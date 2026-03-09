import type { DashboardJobPostingEntry } from "../../../../../shared/dashboard-editable-data";

export type CompanyStrategyType = string;

export type CompanyPipelineStage =
  | "preparing"
  | "applied"
  | "test"
  | "interview1"
  | "interview2"
  | "passed"
  | "rejected";

export type PostingStage = string;

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
  naverPlaceId?: string | null;
  naverPlaceType?: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
};

export type CompanyDetail = {
  description: string;
  roleDescription: string;
  techStack: string[];
  news: string[];
};

export type CompanyComparisonMetricKey =
  | "salary"
  | "growth"
  | "wlb"
  | "location"
  | "culture";

export type CompanyComparisonProfile = {
  salary: number;
  growth: number;
  wlb: number;
  location: number;
  culture: number;
  base: string;
  bonus: string;
};

export type CompanyAnalysisDetail = CompanyDetail & {
  comparison: CompanyComparisonProfile;
};

export type CompanyComparisonRow = {
  label: string;
  left: string;
  right: string;
  leftScore?: number;
  rightScore?: number;
};

export type JobPosting = DashboardJobPostingEntry & {
  stage: PostingStage;
};

export type EnrichedPosting = JobPosting & {
  priority: number;
  daysLeft: number;
};

export type IndustryNewsItem = {
  id: number;
  title: string;
  source: string;
  date: string;
  tag: string;
  summary: string;
  url: string;
};
