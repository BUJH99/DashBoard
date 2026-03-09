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
