import type {
  CompanyTarget,
  CoverLetterDraft,
  CoverLetterSyncState,
  EnrichedPosting,
} from "../../dashboard/types";
import { buildEmptyCoverLetterDraft, getIsoNow } from "../utils";

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
) {
  return buildEmptyCoverLetterDraft(selectedCompany, selectedCompanyPosting, selectedCompanySlug);
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
