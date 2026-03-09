export type CoverLetterConfig = {
  folderName: string;
  relativePath: string;
  namingPattern: string;
  requiredFrontmatter: string[];
};

export type CoverLetterMeta = {
  year: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  jobTrack: string;
  docType: string;
  updatedAt: string;
  title?: string;
  status?: string;
  tags?: string[];
};

export type CoverLetterRecord = {
  name: string;
  title: string;
  year: string;
  companyId: number | null;
  companyName: string;
  companySlug: string;
  jobTrack: string;
  docType: string;
  updatedAt: string;
  status: string;
  tags: string[];
  lastModified: string;
  contentPreview: string;
  isValid: boolean;
  issues: string[];
};

export type CoverLetterSavePayload = {
  originalName?: string | null;
  meta: Partial<CoverLetterMeta>;
  content: string;
};

export type CoverLetterReadResult = {
  file: CoverLetterRecord;
  content: string;
  meta: CoverLetterMeta;
};

export type CoverLetterListResponse = {
  files: CoverLetterRecord[];
};

export type CoverLetterSaveResponse = {
  savedName: string;
  files: CoverLetterRecord[];
  detail: CoverLetterReadResult;
};
