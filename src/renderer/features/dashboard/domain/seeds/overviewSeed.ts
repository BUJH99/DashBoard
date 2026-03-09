import type {
  CompetencyMetric,
  ExperienceInsight,
  FunnelStep,
  KpiMetric,
  PipelineActivity,
  WeeklyTrendPoint,
} from "../../types";

export const kpiMetrics: KpiMetric[] = [
  { label: "관리 중인 공고", value: 18, trend: "+3 이번 주", data: [5, 7, 9, 11, 13, 15, 16, 18], color: "#2563eb", suffix: "건" },
  { label: "서류 합격률", value: "44%", trend: "+5%", data: [18, 22, 24, 26, 30, 33, 39, 44], color: "#10b981" },
  { label: "진행 중인 면접", value: 3, trend: "+1", data: [0, 1, 1, 2, 2, 2, 3, 3], color: "#f59e0b", suffix: "건" },
  { label: "수정 가능한 초안", value: 4, trend: "유지", data: [1, 2, 2, 3, 3, 4, 4, 4], color: "#8b5cf6", suffix: "개" },
];

export const funnelSteps: FunnelStep[] = [
  { stage: "지원", count: 18, rate: 100 },
  { stage: "서류 합격", count: 8, rate: 44 },
  { stage: "과제/인적성 합격", count: 5, rate: 28 },
  { stage: "면접 합격", count: 2, rate: 11 },
  { stage: "오퍼", count: 1, rate: 6 },
];

export const competencyMetrics: CompetencyMetric[] = [
  { value: 92, target: 90, label: "RTL 설계", color: "#2563eb" },
  { value: 84, target: 85, label: "검증", color: "#10b981" },
  { value: 78, target: 82, label: "아키텍처", color: "#f59e0b" },
];

export const activePipelines: PipelineActivity[] = [
  { company: "리벨리온", stage: "과제 제출 준비", progress: 65, expectedDate: "3월 12일" },
  { company: "LX세미콘", stage: "1차 면접", progress: 80, expectedDate: "3월 11일" },
  { company: "텔레칩스", stage: "2차 면접 준비", progress: 88, expectedDate: "3월 15일" },
  { company: "SK하이닉스", stage: "인적성 정리", progress: 45, expectedDate: "3월 14일" },
];

export const weeklyTrend: WeeklyTrendPoint[] = [
  { week: "3월 1주", applications: 2, passes: 0 },
  { week: "3월 2주", applications: 3, passes: 1 },
  { week: "3월 3주", applications: 4, passes: 1 },
  { week: "3월 4주", applications: 4, passes: 2 },
  { week: "4월 1주", applications: 3, passes: 1 },
  { week: "4월 2주", applications: 5, passes: 2 },
];

export const analyticsInsights: ExperienceInsight[] = [
  {
    title: "면접 대응 포인트",
    summary: "최근 면접은 툴 나열보다 구체적인 디버그 내러티브를 더 높게 평가합니다.",
  },
  {
    title: "포트폴리오 집중 영역",
    summary: "컨트롤러와 인터페이스 프로젝트가 일반적인 수업 요약보다 신호가 강합니다.",
  },
  {
    title: "지원 타이밍",
    summary: "마감 5~7일 전에 지원한 공고가 퀄리티를 유지하면서 수정하기 좋았습니다.",
  },
];
