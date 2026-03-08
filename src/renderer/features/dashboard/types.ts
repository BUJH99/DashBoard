import type { LucideIcon } from "lucide-react";
import type {
  ApplicationChecklistItem,
  CommuteNote,
  CoverLetterConfig,
  CoverLetterMeta,
  CoverLetterRecord,
  DashboardLocalState,
  DashboardTab,
  PortfolioSubTab,
} from "../../../../shared/desktop-contracts";

export type {
  ApplicationChecklistItem,
  CommuteNote,
  CoverLetterConfig,
  CoverLetterMeta,
  CoverLetterRecord,
  DashboardLocalState,
  DashboardTab,
  PortfolioSubTab,
};

export type CompanyStrategyType = "吏묒쨷怨듬왂" | "?곹뼢吏?? | "?덉젙吏??;

export type CompanyPipelineStage =
  | "preparing"
  | "applied"
  | "test"
  | "interview1"
  | "interview2"
  | "passed"
  | "rejected";

export type PostingStage =
  | "愿?ш린??"
  | "怨듦퀬?뺤씤"
  | "湲곗뾽遺꾩꽍?꾨즺"
  | "吏곷Т遺꾩꽍?꾨즺"
  | "?먯냼?쒖옉?깆쨷"
  | "?쒖텧?꾨즺"
  | "?몄쟻??怨쇱젣?湲?"
  | "硫댁젒?湲?"
  | "理쒖쥌寃곌낵?湲?"
  | "?⑷꺽"
  | "遺덊빀寃?"
  | "蹂대쪟";

export type JdScanPhase = "idle" | "loading" | "result";

export type NavSection = {
  title: string;
  items: { id: DashboardTab; label: string; icon: LucideIcon }[];
};

export type CompanyTarget = {
  id: number;
  name: string;
  fit: number;
  preference: number;
  status: string;
  type: CompanyStrategyType;
  location: string;
  lat: number;
  lng: number;
  stage: CompanyPipelineStage;
};

export type CompanyDetail = {
  description: string;
  roleDescription: string;
  techStack: string[];
  news: string[];
};

export type KpiMetric = {
  label: string;
  value: number | string;
  trend: string;
  data: number[];
  color: string;
  suffix?: string;
};

export type FunnelStep = {
  stage: string;
  count: number;
  rate: number;
};

export type CompetencyMetric = {
  value: number;
  target: number;
  label: string;
  color: string;
};

export type PortfolioData = {
  readiness: number;
  githubCommits: number;
  resumeUpdated: string;
  skills: { name: string; level: number }[];
  learningSkills: { name: string; progress: number; status: string }[];
  coursework: { id: number; name: string; grade: string; relevance: number; tags: string[] }[];
  studyProjects: { id: number; name: string; tech: string; progress: number; status: string; next: string }[];
  studyNotes: { id: number; title: string; date: string; category: string; preview: string }[];
  projects: { id: number; name: string; date: string; role: string; tech: string[]; impact: string; link: string }[];
};

export type ScheduleEvent = {
  id: number;
  date: number;
  title: string;
  type: "task" | "interview" | "deadline" | "test";
  time: string;
  company: string;
};

export type OfferProfile = {
  salary: number;
  growth: number;
  wlb: number;
  location: number;
  culture: number;
  base: string;
  bonus: string;
};

export type FlashcardItem = {
  category: string;
  q: string;
  a: string;
};

export type ApplicationChecklistRecord = {
  postingId: number;
  items: ApplicationChecklistItem[];
};

export type DashboardStateSync = {
  phase: "idle" | "loading" | "saving" | "error";
  message: string | null;
  lastSavedAt: string | null;
};

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

export type ExperienceItem = {
  id: number;
  title: string;
  category: string;
  strengths: string[];
  summary: string;
  result: string;
  reusableFor: string[];
  companies: string[];
};

export type EssayQuestion = {
  id: number;
  company: string;
  posting: string;
  type: string;
  question: string;
  limit: number;
  status: "珥덉븞?꾨즺" | "?섏젙以?" | "誘몄옉??";
  draft: string;
  linkedExperienceIds: number[];
};

export type JobPosting = {
  id: number;
  targetCompanyId: number;
  company: string;
  title: string;
  role: string;
  deadline: string;
  stage: PostingStage;
  fit: number;
  burden: number;
  urgency: number;
  locationFit: number;
  growth: number;
  selfIntroReady: number;
  keywords: string[];
  summary: string;
};

export type JdScanState = {
  phase: JdScanPhase;
  text: string;
};

export type JdScanResult = {
  extracted: string[];
  matched: string[];
  missing: string[];
  coverage: number;
  recommendation: string;
};

export type EnrichedPosting = JobPosting & {
  priority: number;
  daysLeft: number;
};
