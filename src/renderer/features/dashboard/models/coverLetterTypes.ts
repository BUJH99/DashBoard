export type CoverLetterDraftMeta = {
  year: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  jobTrack: string;
  docType: string;
  updatedAt: string;
  title: string;
  status: string;
  tags: string;
};

export type CoverLetterDraft = {
  originalName: string | null;
  meta: CoverLetterDraftMeta;
  content: string;
};

export type CoverLetterSyncState = {
  phase: "idle" | "loading" | "saving" | "error";
  message: string | null;
  lastSyncedAt: string | null;
};
