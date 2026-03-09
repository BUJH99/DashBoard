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
};

export type CompanyDetail = {
  description: string;
  roleDescription: string;
  techStack: string[];
  news: string[];
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
