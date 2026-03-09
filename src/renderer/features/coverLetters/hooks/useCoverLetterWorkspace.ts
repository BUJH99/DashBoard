import { useCallback, useEffect, useMemo, useState } from "react";
import {
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
};

export function useCoverLetterWorkspace({
  selectedCompanyId,
  selectedCompany,
  selectedCompanyPosting,
  selectedCompanySlug,
}: UseCoverLetterWorkspaceOptions) {
  const [coverLetterConfig, setCoverLetterConfig] = useState<CoverLetterConfig | null>(null);
  const [coverLetterFiles, setCoverLetterFiles] = useState<CoverLetterRecord[]>([]);
  const [selectedCoverLetterName, setSelectedCoverLetterName] = useState<string | null>(null);
  const [coverLetterDraft, setCoverLetterDraft] = useState<CoverLetterDraft>(() =>
    buildSelectedCompanyCoverLetterDraft(selectedCompany, selectedCompanyPosting, selectedCompanySlug),
  );
  const [coverLetterSync, setCoverLetterSync] = useState<CoverLetterSyncState>({
    phase: "idle",
    message: null,
    lastSyncedAt: null,
  });

  const buildCompanyDraft = useCallback(
    () => buildSelectedCompanyCoverLetterDraft(selectedCompany, selectedCompanyPosting, selectedCompanySlug),
    [selectedCompany, selectedCompanyPosting, selectedCompanySlug],
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

  const syncCoverLetterFiles = useCallback(
    async (preferredName?: string | null) => {
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
          selectedCoverLetterName,
        );

        setCoverLetterFiles(payload.files);
        setSelectedCoverLetterName(nextName);
        if (!nextName) {
          setCoverLetterDraft(buildCompanyDraft());
        }
        setCoverLetterSync(buildIdleCoverLetterSyncState());
      } catch (error) {
        setCoverLetterSync({
          phase: "error",
          message: resolveCoverLetterErrorMessage(COVER_LETTER_SYNC_MESSAGES.syncFailed, error),
          lastSyncedAt: null,
        });
      }
    },
    [buildCompanyDraft, selectedCoverLetterName],
  );

  const loadCoverLetterFile = useCallback(async (name: string) => {
    setCoverLetterSync((current) => ({
      ...current,
      phase: "loading",
      message: null,
    }));

    try {
      const payload = await readCoverLetter(name);
      setCoverLetterDraft(buildCoverLetterDraftFromReadResult(payload));
      setCoverLetterSync(buildIdleCoverLetterSyncState());
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: resolveCoverLetterErrorMessage(COVER_LETTER_SYNC_MESSAGES.loadFailed, error),
        lastSyncedAt: null,
      });
    }
  }, []);

  const saveCoverLetterFile = useCallback(async () => {
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
      setCoverLetterSync(buildIdleCoverLetterSyncState(COVER_LETTER_SYNC_MESSAGES.saveSucceeded));
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: resolveCoverLetterErrorMessage(COVER_LETTER_SYNC_MESSAGES.saveFailed, error),
        lastSyncedAt: null,
      });
    }
  }, [coverLetterDraft]);

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

  const initializeWorkspace = useCallback(async () => {
    try {
      const payload = await getCoverLetterConfigService();
      setCoverLetterConfig(payload);
    } catch {
      // 설정 조회 실패는 편집 기능을 막지 않으므로 무시합니다.
    }

    await syncCoverLetterFiles();
  }, [syncCoverLetterFiles]);

  useEffect(() => {
    void initializeWorkspace();
  }, [initializeWorkspace]);

  useEffect(() => {
    if (!selectedCoverLetterName) {
      return;
    }

    void loadCoverLetterFile(selectedCoverLetterName);
  }, [loadCoverLetterFile, selectedCoverLetterName]);

  return {
    coverLetterConfig,
    coverLetterFiles,
    selectedCoverLetterName,
    setSelectedCoverLetterName,
    coverLetterDraft,
    setCoverLetterDraft,
    coverLetterSync,
    syncCoverLetterFiles,
    loadCoverLetterFile,
    saveCoverLetterFile,
    selectedCoverLetterRecord,
    companyCoverLetters,
    selectedCoverLetterLinked,
    resetCoverLetterDraft,
    fillCoverLetterDraftFromSelectedCompany,
  };
}
