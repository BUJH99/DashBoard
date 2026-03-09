import type {
  DashboardJobPostingEntry,
  DashboardScheduleEntry,
} from "./dashboard-editable-data.js";

export type DashboardTab =
  | "overview"
  | "industry"
  | "kanban"
  | "strategy"
  | "postings"
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

export type CompanyAnalysisComparisonProfile = {
  salary: number;
  growth: number;
  wlb: number;
  location: number;
  culture: number;
  base: string;
  bonus: string;
};

export type CompanyAnalysisEntry = {
  description: string;
  roleDescription: string;
  techStack: string[];
  news: string[];
  comparison: CompanyAnalysisComparisonProfile;
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
    selectedJobPostingId: number;
    selectedCoverLetterName: string | null;
  };
  calendar: {
    scheduleEntries: DashboardScheduleEntry[];
  };
  postings: {
    entries: DashboardJobPostingEntry[];
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
    query: string;
    companyFilter: string;
    taskChecked: Record<number, boolean>;
  };
  companyAnalysis: {
    compareCompanyId: number;
    entries: Record<number, CompanyAnalysisEntry>;
  };
  coverLetters: {
    questionPresets: Record<number, string[]>;
  };
};
