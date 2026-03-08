import { useEffect, useMemo, useState } from "react";
import type { CoverLetterMeta, CoverLetterRecord } from "../../dashboard/types";
import type { CompanyTarget, CoverLetterDraft, CoverLetterSyncState, EnrichedPosting } from "../../dashboard/types";
import {
  getCoverLetterConfig as getCoverLetterConfigService,
  listCoverLetters,
  readCoverLetter,
  saveCoverLetter,
} from "../../../services/desktop/coverLetterService";
import { buildEmptyCoverLetterDraft, getIsoNow } from "../utils";

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
  const [coverLetterConfig, setCoverLetterConfig] = useState<ReturnType<typeof getCoverLetterConfigService> extends Promise<infer T> ? T | null : null>(null);
  const [coverLetterFiles, setCoverLetterFiles] = useState<CoverLetterRecord[]>([]);
  const [selectedCoverLetterName, setSelectedCoverLetterName] = useState<string | null>(null);
  const [coverLetterDraft, setCoverLetterDraft] = useState<CoverLetterDraft>(() =>
    buildEmptyCoverLetterDraft(selectedCompany, selectedCompanyPosting, selectedCompanySlug),
  );
  const [coverLetterSync, setCoverLetterSync] = useState<CoverLetterSyncState>({
    phase: "idle",
    message: null,
    lastSyncedAt: null,
  });

  const selectedCoverLetterRecord = useMemo(
    () => coverLetterFiles.find((file) => file.name === selectedCoverLetterName) ?? null,
    [coverLetterFiles, selectedCoverLetterName],
  );
  const companyCoverLetters = useMemo(
    () => coverLetterFiles.filter((file) => file.companyId === selectedCompanyId),
    [coverLetterFiles, selectedCompanyId],
  );
  const selectedCoverLetterLinked = selectedCoverLetterRecord?.companyId === selectedCompanyId;

  const syncCoverLetterFiles = async (preferredName?: string | null) => {
    setCoverLetterSync((current) => ({
      ...current,
      phase: "loading",
      message: null,
    }));

    try {
      const payload = await listCoverLetters();
      setCoverLetterFiles(payload.files);
      setCoverLetterSync({
        phase: "idle",
        message: null,
        lastSyncedAt: getIsoNow(),
      });

      const nextName =
        preferredName && payload.files.some((file) => file.name === preferredName)
          ? preferredName
          : selectedCoverLetterName && payload.files.some((file) => file.name === selectedCoverLetterName)
            ? selectedCoverLetterName
            : payload.files[0]?.name ?? null;

      setSelectedCoverLetterName(nextName);
      if (!nextName) {
        setCoverLetterDraft(buildEmptyCoverLetterDraft(selectedCompany, selectedCompanyPosting, selectedCompanySlug));
      }
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: error instanceof Error ? error.message : "?먯냼???대뜑 ?숆린??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.",
        lastSyncedAt: null,
      });
    }
  };

  const loadCoverLetterFile = async (name: string) => {
    setCoverLetterSync((current) => ({
      ...current,
      phase: "loading",
      message: null,
    }));

    try {
      const payload = await readCoverLetter(name);
      setCoverLetterDraft({
        originalName: payload.file.name,
        meta: {
          year: String(payload.meta.year ?? "2026"),
          companyId: String(payload.meta.companyId ?? ""),
          companyName: String(payload.meta.companyName ?? ""),
          companySlug: String(payload.meta.companySlug ?? ""),
          jobTrack: String(payload.meta.jobTrack ?? ""),
          docType: String(payload.meta.docType ?? "cover-letter"),
          updatedAt: String(payload.meta.updatedAt ?? getIsoNow()),
          title: String(payload.meta.title ?? payload.file.title ?? ""),
          status: String(payload.meta.status ?? payload.file.status ?? "draft"),
          tags: Array.isArray(payload.meta.tags) ? payload.meta.tags.join(", ") : "",
        },
        content: payload.content,
      });
      setCoverLetterSync({
        phase: "idle",
        message: null,
        lastSyncedAt: getIsoNow(),
      });
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: error instanceof Error ? error.message : "?먯냼???뚯씪 濡쒕뱶 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.",
        lastSyncedAt: null,
      });
    }
  };

  const saveCoverLetterFile = async () => {
    setCoverLetterSync((current) => ({
      ...current,
      phase: "saving",
      message: null,
    }));

    try {
      const payload = await saveCoverLetter({
        originalName: coverLetterDraft.originalName,
        meta: {
          ...coverLetterDraft.meta,
          tags: coverLetterDraft.meta.tags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          updatedAt: getIsoNow(),
        },
        content: coverLetterDraft.content,
      });

      setCoverLetterFiles(payload.files);
      setSelectedCoverLetterName(payload.savedName);
      setCoverLetterDraft({
        originalName: payload.detail.file.name,
        meta: {
          year: String(payload.detail.meta.year ?? coverLetterDraft.meta.year),
          companyId: String(payload.detail.meta.companyId ?? coverLetterDraft.meta.companyId),
          companyName: String(payload.detail.meta.companyName ?? coverLetterDraft.meta.companyName),
          companySlug: String(payload.detail.meta.companySlug ?? coverLetterDraft.meta.companySlug),
          jobTrack: String(payload.detail.meta.jobTrack ?? coverLetterDraft.meta.jobTrack),
          docType: String(payload.detail.meta.docType ?? coverLetterDraft.meta.docType),
          updatedAt: String(payload.detail.meta.updatedAt ?? getIsoNow()),
          title: String(payload.detail.meta.title ?? coverLetterDraft.meta.title),
          status: String(payload.detail.meta.status ?? coverLetterDraft.meta.status),
          tags: Array.isArray(payload.detail.meta.tags) ? payload.detail.meta.tags.join(", ") : coverLetterDraft.meta.tags,
        },
        content: payload.detail.content,
      });
      setCoverLetterSync({
        phase: "idle",
        message: "????꾨즺",
        lastSyncedAt: getIsoNow(),
      });
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: error instanceof Error ? error.message : "?먯냼?????以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.",
        lastSyncedAt: null,
      });
    }
  };

  const resetCoverLetterDraft = () => {
    setSelectedCoverLetterName(null);
    setCoverLetterDraft(buildEmptyCoverLetterDraft(selectedCompany, selectedCompanyPosting, selectedCompanySlug));
  };

  const fillCoverLetterDraftFromSelectedCompany = () => {
    setCoverLetterDraft((current) => ({
      ...current,
      meta: {
        ...current.meta,
        companyId: String(selectedCompanyId),
        companyName: selectedCompany.name,
        companySlug: selectedCompanySlug,
        jobTrack: current.meta.jobTrack || selectedCompanyPosting?.role || "cover-letter",
        title: current.meta.title || `${selectedCompany.name} ?먭린?뚭컻??`,
        updatedAt: getIsoNow(),
      },
    }));
  };

  useEffect(() => {
    void (async () => {
      try {
        const payload = await getCoverLetterConfigService();
        setCoverLetterConfig(payload);
      } catch {
        // list sync surfaces actionable errors
      }
      await syncCoverLetterFiles();
    })();
  }, []);

  useEffect(() => {
    if (!selectedCoverLetterName) {
      return;
    }
    void loadCoverLetterFile(selectedCoverLetterName);
  }, [selectedCoverLetterName]);

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
