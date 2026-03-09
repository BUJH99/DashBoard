import type {
  CompanyTarget,
  CoverLetterDraft,
  CoverLetterRecord,
  CoverLetterSyncState,
  EnrichedPosting,
} from "../../dashboard/types";
import { buildCoverLetterFileName, buildEmptyCoverLetterDraft, getIsoNow } from "../utils";

type SelectedCompanyCoverLetterOptions = {
  selectedCompanyId: number;
  selectedCompany: CompanyTarget;
  selectedCompanyPosting?: EnrichedPosting;
  selectedCompanySlug: string;
};

export function buildIdleCoverLetterSyncState(message: string | null = null): CoverLetterSyncState {
  return {
    phase: "idle",
    message,
    lastSyncedAt: getIsoNow(),
  };
}

export function buildSelectedCompanyCoverLetterDraft(
  selectedCompany: CompanyTarget,
  selectedCompanyPosting: EnrichedPosting | undefined,
  selectedCompanySlug: string,
  selectedCompanyQuestionPrompts: string[],
) {
  return buildEmptyCoverLetterDraft(
    selectedCompany,
    selectedCompanyPosting,
    selectedCompanySlug,
    selectedCompanyQuestionPrompts,
  );
}

export function fillDraftFromSelectedCompany(
  currentDraft: CoverLetterDraft,
  {
    selectedCompanyId,
    selectedCompany,
    selectedCompanyPosting,
    selectedCompanySlug,
  }: SelectedCompanyCoverLetterOptions,
): CoverLetterDraft {
  return {
    ...currentDraft,
    meta: {
      ...currentDraft.meta,
      companyId: String(selectedCompanyId),
      companyName: selectedCompany.name,
      companySlug: selectedCompanySlug,
      jobTrack: currentDraft.meta.jobTrack || selectedCompanyPosting?.role || "cover-letter",
      title: currentDraft.meta.title || `${selectedCompany.name} 자기소개서 초안`,
      updatedAt: getIsoNow(),
    },
  };
}

export function buildUniqueCoverLetterDraft(
  baseDraft: CoverLetterDraft,
  files: CoverLetterRecord[],
) {
  const usedNames = new Set(files.map((file) => file.name));
  const baseTitle = baseDraft.meta.title.trim() || "새 자기소개서 초안";
  const baseDocType = baseDraft.meta.docType.trim() || "cover-letter";
  let sequence = 1;
  let nextDraft = baseDraft;

  while (usedNames.has(buildCoverLetterFileName(nextDraft.meta))) {
    sequence += 1;
    nextDraft = {
      ...baseDraft,
      meta: {
        ...baseDraft.meta,
        title: `${baseTitle} ${sequence}`,
        docType: `${baseDocType}-${sequence}`,
        updatedAt: getIsoNow(),
      },
    };
  }

  return nextDraft;
}
