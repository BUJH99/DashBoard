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
  | "resume"
  | "checklist"
  | "interview"
  | "calendar"
  | "coverletters";

export type PortfolioSubTab = "experience" | "showcase" | "academics" | "study";

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

export type DashboardIndustryArticle = {
  id: string;
  title: string;
  source: string;
  date: string;
  publishedAt: string;
  tag: string;
  matchedKeywords: string[];
  summary: string;
  url: string;
};

export type DashboardResumeEducationItem = {
  school: string;
  degree: string;
  major: string;
  gpa: string;
  period: string;
  statusLabel: string;
};

export type DashboardResumeCertificateItem = {
  name: string;
  issuer: string;
  date: string;
};

export type DashboardResumeLanguageItem = {
  name: string;
  detail: string;
  levelLabel: string;
};

export type DashboardResumeSkillSpecItem = {
  name: string;
  track: string;
  levelLabel: "상" | "중" | "하";
};

export type DashboardResumeAwardItem = {
  title: string;
  issuer: string;
};

export type DashboardResumePaperItem = {
  title: string;
};

export type DashboardResumeExperienceCategory =
  | "project"
  | "internship"
  | "activity"
  | "contest"
  | "research";

export type DashboardResumeExperienceItem = {
  id: number;
  title: string;
  category: DashboardResumeExperienceCategory;
  organization: string;
  period: string;
  role: string;
  teamLabel: string;
  featured: boolean;
  tags: string[];
  overview: string;
  outcome: string;
  learning: string;
  rawBullet: string;
  improvedBullet: string;
  bulletReason: string;
  keywords: string[];
};

export type DashboardLocalState = {
  ui: {
    activeTab: DashboardTab;
    userName: string;
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
  industry: {
    keywords: string[];
    articles: DashboardIndustryArticle[];
    lastCrawledAt: string | null;
    periodDays: number;
  };
  resume: {
    version: number;
    title: string;
    targetRole: string;
    summary: string;
    userName: string;
    email: string;
    selectedExperienceIds: number[];
    education: DashboardResumeEducationItem[];
    certificates: DashboardResumeCertificateItem[];
    languages: DashboardResumeLanguageItem[];
    skillSpecs: DashboardResumeSkillSpecItem[];
    awards: DashboardResumeAwardItem[];
    papers: DashboardResumePaperItem[];
    experiences: DashboardResumeExperienceItem[];
  };
  companyAnalysis: {
    compareCompanyId: number;
    entries: Record<number, CompanyAnalysisEntry>;
  };
  coverLetters: {
    questionPresets: Record<number, string[]>;
  };
};
