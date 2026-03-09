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

export type OverviewStageKind =
  | "applied"
  | "documentPassed"
  | "activeProcess"
  | "interview";

export type OverviewSummaryMetric = {
  label: string;
  value: number | string;
  helper: string;
  data: number[];
  color: string;
  suffix?: string;
};

export type OverviewActionItem = {
  id: number;
  companyId: number;
  company: string;
  title: string;
  summary: string;
  priority: number;
  daysLeft: number;
  stageLabel: string;
  nextActionLabel: string;
  expectedDateLabel: string;
};

export type OverviewSupportFlowItem = {
  postingId: number;
  companyId: number;
  company: string;
  stageKind: OverviewStageKind;
  stageLabel: string;
  progress: number;
  nextActionLabel: string;
  expectedDateLabel: string;
  priority: number;
};

export type OverviewFocusItem = {
  postingId: number;
  company: string;
  stageLabel: string;
  nextActionLabel: string;
  expectedDateLabel: string;
};

export type OverviewUrgentItem = {
  postingId: number;
  company: string;
  title: string;
  summary: string;
  stageLabel: string;
  dueDays: number;
  dueBadge: string;
  dueContext: string;
};

export type OverviewObservationPoint = {
  id: string;
  summary: string;
};

export type OverviewCompanyOption = {
  value: string;
  label: string;
};

export type WeeklyTrendPoint = {
  week: string;
  applications: number;
  passes: number;
};

export type ExperienceInsight = {
  title: string;
  summary: string;
};
