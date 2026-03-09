import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deleteCoverLetters,
  getCoverLetterConfig as getCoverLetterConfigService,
  listCoverLetters,
  readCoverLetter,
  saveCoverLetter,
} from "../../../services/desktop/coverLetterService";
import type {
  CompanyTarget,
  CoverLetterConfig,
  CoverLetterDraft,
  CoverLetterRecord,
  CoverLetterSyncState,
  EnrichedPosting,
} from "../../dashboard/types";
import {
  buildCoverLetterDraftFromReadResult,
  buildCoverLetterDraftFromSaveResponse,
  buildCoverLetterSavePayload,
  resolveNextCoverLetterName,
} from "../workspace/coverLetterDraftAdapter";
import {
  buildIdleCoverLetterSyncState,
  buildSelectedCompanyCoverLetterDraft,
  buildUniqueCoverLetterDraft,
  fillDraftFromSelectedCompany,
} from "../workspace/coverLetterWorkspaceState";
import {
  COVER_LETTER_SYNC_MESSAGES,
  resolveCoverLetterErrorMessage,
} from "../workspace/coverLetterSyncMessages";

type UseCoverLetterWorkspaceOptions = {
  selectedCompanyId: number;
  selectedCompany: CompanyTarget;
  selectedCompanyPosting?: EnrichedPosting;
  selectedCompanySlug: string;
  selectedCompanyQuestionPrompts: string[];
  initialSelectedCoverLetterName?: string | null;
};

export function useCoverLetterWorkspace({
  selectedCompanyId,
  selectedCompany,
  selectedCompanyPosting,
  selectedCompanySlug,
  selectedCompanyQuestionPrompts,
  initialSelectedCoverLetterName = null,
}: UseCoverLetterWorkspaceOptions) {
  const coverLetterRelativePath = "coverletters_md";
  const [coverLetterConfig, setCoverLetterConfig] = useState<CoverLetterConfig | null>(null);
  const [coverLetterFiles, setCoverLetterFiles] = useState<CoverLetterRecord[]>([]);
  const [selectedCoverLetterNames, setSelectedCoverLetterNames] = useState<string[]>([]);
  const [selectedCoverLetterName, setSelectedCoverLetterName] = useState<string | null>(
    initialSelectedCoverLetterName,
  );
  const [coverLetterDraft, setCoverLetterDraft] = useState<CoverLetterDraft>(() =>
    buildSelectedCompanyCoverLetterDraft(
      selectedCompany,
      selectedCompanyPosting,
      selectedCompanySlug,
      selectedCompanyQuestionPrompts,
    ),
  );
  const [coverLetterSync, setCoverLetterSync] = useState<CoverLetterSyncState>(() =>
    buildIdleCoverLetterSyncState("목록 동기화 버튼을 눌러 파일을 불러오세요."),
  );
  const [activeAction, setActiveAction] = useState<
    "sync" | "create" | "load" | "save" | "delete" | null
  >(null);
  const selectedCoverLetterNameRef = useRef<string | null>(selectedCoverLetterName);

  const buildCompanyDraft = useCallback(
    () =>
      buildSelectedCompanyCoverLetterDraft(
        selectedCompany,
        selectedCompanyPosting,
        selectedCompanySlug,
        selectedCompanyQuestionPrompts,
      ),
    [selectedCompany, selectedCompanyPosting, selectedCompanyQuestionPrompts, selectedCompanySlug],
  );

  const selectedCoverLetterRecord = useMemo(
    () => coverLetterFiles.find((file) => file.name === selectedCoverLetterName) ?? null,
    [coverLetterFiles, selectedCoverLetterName],
  );
  const companyCoverLetters = useMemo(
    () => coverLetterFiles.filter((file) => file.companyId === selectedCompanyId),
    [coverLetterFiles, selectedCompanyId],
  );
  const selectedCoverLetterLinked = selectedCoverLetterRecord?.companyId === selectedCompanyId;

  useEffect(() => {
    selectedCoverLetterNameRef.current = selectedCoverLetterName;
  }, [selectedCoverLetterName]);

  useEffect(() => {
    setSelectedCoverLetterNames((current) =>
      current.filter((name) => coverLetterFiles.some((file) => file.name === name)),
    );
  }, [coverLetterFiles]);

  useEffect(() => {
    if (!selectedCoverLetterName && initialSelectedCoverLetterName) {
      setSelectedCoverLetterName(initialSelectedCoverLetterName);
    }
  }, [initialSelectedCoverLetterName, selectedCoverLetterName]);

  const syncCoverLetterFiles = useCallback(
    async (preferredName?: string | null) => {
      setActiveAction("sync");
      setCoverLetterSync((current) => ({
        ...current,
        phase: "loading",
        message: null,
      }));

      try {
        const payload = await listCoverLetters();
        const nextName = resolveNextCoverLetterName(
          payload.files,
          preferredName,
          selectedCoverLetterNameRef.current,
        );

        setCoverLetterFiles(payload.files);
        setSelectedCoverLetterName(nextName);
        if (!nextName) {
          setCoverLetterDraft(buildCompanyDraft());
        }
        setCoverLetterSync(
          buildIdleCoverLetterSyncState(`자기소개서 파일 ${payload.files.length}개를 동기화했습니다.`),
        );
        setActiveAction(null);
      } catch (error) {
        setCoverLetterSync({
          phase: "error",
          message: resolveCoverLetterErrorMessage(COVER_LETTER_SYNC_MESSAGES.syncFailed, error),
          lastSyncedAt: null,
        });
        setActiveAction(null);
      }
    },
    [buildCompanyDraft],
  );

  const createCoverLetterDraft = useCallback(async () => {
    const nextDraft = buildUniqueCoverLetterDraft(buildCompanyDraft(), coverLetterFiles);

    setActiveAction("create");
    setCoverLetterSync((current) => ({
      ...current,
      phase: "saving",
      message: null,
    }));

    try {
      const payload = await saveCoverLetter(buildCoverLetterSavePayload(nextDraft));
      setCoverLetterDraft(buildCoverLetterDraftFromSaveResponse(payload, nextDraft));
      setCoverLetterSync({
        phase: "loading",
        message: "새 초안 저장 후 폴더를 동기화하는 중입니다.",
        lastSyncedAt: null,
      });

      const syncedPayload = await listCoverLetters();
      const nextName = resolveNextCoverLetterName(
        syncedPayload.files,
        payload.savedName,
        selectedCoverLetterNameRef.current,
      );

      setCoverLetterFiles(syncedPayload.files);
      setSelectedCoverLetterName(nextName);
      setCoverLetterSync(
        buildIdleCoverLetterSyncState(
          `${COVER_LETTER_SYNC_MESSAGES.createSucceeded} (${coverLetterRelativePath}/${payload.savedName})`,
        ),
      );
      setActiveAction(null);
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: resolveCoverLetterErrorMessage(COVER_LETTER_SYNC_MESSAGES.createFailed, error),
        lastSyncedAt: null,
      });
      setActiveAction(null);
    }
  }, [buildCompanyDraft, coverLetterFiles]);

  const loadCoverLetterFile = useCallback(async (name: string) => {
    setActiveAction("load");
    setCoverLetterSync((current) => ({
      ...current,
      phase: "loading",
    }));

    try {
      const payload = await readCoverLetter(name);
      setCoverLetterDraft(buildCoverLetterDraftFromReadResult(payload));
      setCoverLetterSync((current) => buildIdleCoverLetterSyncState(current.message));
      setActiveAction(null);
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: resolveCoverLetterErrorMessage(COVER_LETTER_SYNC_MESSAGES.loadFailed, error),
        lastSyncedAt: null,
      });
      setActiveAction(null);
    }
  }, []);

  const saveCoverLetterFile = useCallback(async () => {
    setActiveAction("save");
    setCoverLetterSync((current) => ({
      ...current,
      phase: "saving",
      message: null,
    }));

    try {
      const payload = await saveCoverLetter(buildCoverLetterSavePayload(coverLetterDraft));
      setCoverLetterFiles(payload.files);
      setSelectedCoverLetterName(payload.savedName);
      setCoverLetterDraft((current) => buildCoverLetterDraftFromSaveResponse(payload, current));
      setCoverLetterSync(
        buildIdleCoverLetterSyncState(
          `${COVER_LETTER_SYNC_MESSAGES.saveSucceeded} (${coverLetterRelativePath}/${payload.savedName})`,
        ),
      );
      setActiveAction(null);
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: resolveCoverLetterErrorMessage(COVER_LETTER_SYNC_MESSAGES.saveFailed, error),
        lastSyncedAt: null,
      });
      setActiveAction(null);
    }
  }, [coverLetterDraft]);

  const deleteSelectedCoverLetterFiles = useCallback(
    async (names?: string[]) => {
      const targetNames = [...new Set((names ?? selectedCoverLetterNames).filter(Boolean))];

      if (targetNames.length === 0) {
        return;
      }

      setActiveAction("delete");
      setCoverLetterSync((current) => ({
        ...current,
        phase: "saving",
        message: null,
      }));

      try {
        const payload = await deleteCoverLetters({ names: targetNames });
        const nextSelectedName = resolveNextCoverLetterName(
          payload.files,
          undefined,
          targetNames.includes(selectedCoverLetterNameRef.current ?? "")
            ? undefined
            : selectedCoverLetterNameRef.current,
        );

        setCoverLetterFiles(payload.files);
        setSelectedCoverLetterNames((current) =>
          current.filter((name) => !payload.deletedNames.includes(name)),
        );
        setSelectedCoverLetterName(nextSelectedName);

        if (!nextSelectedName) {
          setCoverLetterDraft(buildCompanyDraft());
        }

        setCoverLetterSync(
          buildIdleCoverLetterSyncState(
            payload.deletedNames.length > 1
              ? `${payload.deletedNames.length}개 자기소개서 파일을 삭제했습니다.`
              : COVER_LETTER_SYNC_MESSAGES.deleteSucceeded,
          ),
        );
        setActiveAction(null);
      } catch (error) {
        setCoverLetterSync({
          phase: "error",
          message: resolveCoverLetterErrorMessage(COVER_LETTER_SYNC_MESSAGES.deleteFailed, error),
          lastSyncedAt: null,
        });
        setActiveAction(null);
      }
    },
    [buildCompanyDraft, selectedCoverLetterNames],
  );

  const toggleCoverLetterSelection = useCallback((name: string) => {
    setSelectedCoverLetterNames((current) =>
      current.includes(name)
        ? current.filter((selectedName) => selectedName !== name)
        : [...current, name],
    );
  }, []);

  const toggleSelectAllCoverLetters = useCallback(() => {
    setSelectedCoverLetterNames((current) =>
      current.length === coverLetterFiles.length ? [] : coverLetterFiles.map((file) => file.name),
    );
  }, [coverLetterFiles]);

  const resetCoverLetterDraft = useCallback(() => {
    setSelectedCoverLetterName(null);
    setCoverLetterDraft(buildCompanyDraft());
  }, [buildCompanyDraft]);

  const fillCoverLetterDraftFromSelectedCompany = useCallback(() => {
    setCoverLetterDraft((current) =>
      fillDraftFromSelectedCompany(current, {
        selectedCompanyId,
        selectedCompany,
        selectedCompanyPosting,
        selectedCompanySlug,
      }),
    );
  }, [selectedCompany, selectedCompanyId, selectedCompanyPosting, selectedCompanySlug]);

  useEffect(() => {
    let isDisposed = false;

    void (async () => {
      try {
        const payload = await getCoverLetterConfigService();
        if (!isDisposed) {
          setCoverLetterConfig(payload);
        }
      } catch {
        // 설정 조회 실패는 편집 기능을 막지 않으므로 무시합니다.
      }
    })();

    return () => {
      isDisposed = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCoverLetterName) {
      return;
    }

    void loadCoverLetterFile(selectedCoverLetterName);
  }, [loadCoverLetterFile, selectedCoverLetterName]);

  return {
    coverLetterConfig,
    coverLetterFiles,
    selectedCoverLetterNames,
    selectedCoverLetterName,
    setSelectedCoverLetterName,
    coverLetterDraft,
    setCoverLetterDraft,
    coverLetterSync,
    isSyncingCoverLetterFiles: activeAction === "sync",
    isCreatingCoverLetterDraft: activeAction === "create",
    isLoadingCoverLetterFile: activeAction === "load",
    isSavingCoverLetterFile: activeAction === "save",
    isDeletingCoverLetterFiles: activeAction === "delete",
    syncCoverLetterFiles,
    loadCoverLetterFile,
    saveCoverLetterFile,
    createCoverLetterDraft,
    deleteSelectedCoverLetterFiles,
    deleteCoverLetterFile: (name: string) => deleteSelectedCoverLetterFiles([name]),
    toggleCoverLetterSelection,
    toggleSelectAllCoverLetters,
    selectedCoverLetterRecord,
    companyCoverLetters,
    selectedCoverLetterLinked,
    resetCoverLetterDraft,
    fillCoverLetterDraftFromSelectedCompany,
  };
}
