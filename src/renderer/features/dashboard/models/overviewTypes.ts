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

export type PipelineActivity = {
  company: string;
  stage: string;
  progress: number;
  expectedDate: string;
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
