export type DashboardTab =
  | "overview"
  | "industry"
  | "kanban"
  | "strategy"
  | "company"
  | "jdscanner"
  | "offer"
  | "location"
  | "portfolio"
  | "checklist"
  | "interview"
  | "calendar"
  | "coverletters";

export type PortfolioSubTab = "showcase" | "academics" | "study";

export type ApplicationChecklistItem = {
  id: string;
  label: string;
  category: "documents" | "research" | "story" | "submission";
  done: boolean;
  note: string;
  blocked: boolean;
};

export type CommuteNote = {
  totalMinutes: string;
  transfers: string;
  hasBus: boolean;
  hasSubway: boolean;
  note: string;
};

export type DashboardLocalState = {
  ui: {
    activeTab: DashboardTab;
    postingQuery: string;
    postingCompanyFilter: string;
    selectedCompanyId: number;
    selectedOfferA: string;
    selectedOfferB: string;
    portfolioSubTab: PortfolioSubTab;
    selectedChecklistPostingId: number;
    selectedEssayId: number;
    industryFilter: string;
    flashcardMode: "default" | "shuffled";
    activeFlashcardIndex: number | null;
    selectedScheduleId: number;
    selectedCoverLetterName: string | null;
  };
  location: {
    routeOrigin: string;
    routeDestination: string;
    companyCommuteNotes: Record<number, CommuteNote>;
  };
  checklists: {
    applicationChecklists: Record<number, ApplicationChecklistItem[]>;
  };
  interview: {
    flashcardFeedback: Record<string, "hard" | "easy">;
  };
  jdScanner: {
    text: string;
  };
  overview: {
    taskChecked: Record<number, boolean>;
  };
};

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

export type DashboardStateReadResponse = {
  state: DashboardLocalState;
  savedAt: string;
};

export type DashboardStateSaveResponse = {
  state: DashboardLocalState;
  savedAt: string;
};

export type DesktopApi = {
  coverletters: {
    getConfig(): Promise<CoverLetterConfig>;
    list(): Promise<CoverLetterListResponse>;
    read(name: string): Promise<CoverLetterReadResult>;
    save(payload: CoverLetterSavePayload): Promise<CoverLetterSaveResponse>;
  };
  dashboardState: {
    read(): Promise<DashboardStateReadResponse>;
    save(payload: DashboardLocalState): Promise<DashboardStateSaveResponse>;
  };
  external: {
    openUrl(url: string): Promise<void>;
  };
};
