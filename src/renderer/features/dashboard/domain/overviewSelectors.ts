import {
  filterPostings,
  getChecklistItems,
  normalizeKeyword,
} from "./dashboardSelectors";
import type {
  ApplicationChecklistItem,
  CompanyTarget,
  DashboardLocalState,
  EnrichedPosting,
  OverviewActionItem,
  OverviewCompanyOption,
  OverviewFocusItem,
  OverviewObservationPoint,
  OverviewStageKind,
  OverviewSummaryMetric,
  OverviewSupportFlowItem,
  OverviewUrgentItem,
  ScheduleEvent,
} from "../types";

type BuildOverviewCollectionsOptions = {
  postings: EnrichedPosting[];
  companyTargets: CompanyTarget[];
  checklistCollection: DashboardLocalState["checklists"]["applicationChecklists"];
  checklistTemplates: Record<number, ApplicationChecklistItem[]>;
  schedule: ScheduleEvent[];
  query: string;
  companyFilter: string;
  referenceDate: Date;
  portfolioKeywordSet: Set<string>;
};

type NormalizedOverviewStage = {
  kind: OverviewStageKind;
  stageLabel: string;
  nextActionLabel: string;
  progress: number;
};

type CompanyEventSummary = {
  title: string;
  dateLabel: string;
  daysUntil: number;
};

const OVERVIEW_STAGE_CONFIG: Record<string, NormalizedOverviewStage> = {
  "서류 제출": {
    kind: "applied",
    stageLabel: "서류 심사",
    nextActionLabel: "서류 결과 대기",
    progress: 24,
  },
  "서류 합격": {
    kind: "documentPassed",
    stageLabel: "서류 합격",
    nextActionLabel: "다음 전형 준비",
    progress: 42,
  },
  과제: {
    kind: "activeProcess",
    stageLabel: "과제 진행",
    nextActionLabel: "과제 제출 준비",
    progress: 64,
  },
  "인적성 예정": {
    kind: "activeProcess",
    stageLabel: "인적성 준비",
    nextActionLabel: "인적성 응시 준비",
    progress: 58,
  },
  "1차 면접": {
    kind: "interview",
    stageLabel: "1차 면접",
    nextActionLabel: "면접 답변 정리",
    progress: 78,
  },
  "2차 면접": {
    kind: "interview",
    stageLabel: "2차 면접",
    nextActionLabel: "최종 질의응답 준비",
    progress: 88,
  },
};

const DEFAULT_STAGE_CONFIG: NormalizedOverviewStage = OVERVIEW_STAGE_CONFIG["서류 제출"];

function normalizeOverviewStage(stage: string): NormalizedOverviewStage {
  return OVERVIEW_STAGE_CONFIG[stage] ?? DEFAULT_STAGE_CONFIG;
}

function formatMonthDay(dateString: string) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatDueBadge(daysUntil: number) {
  return daysUntil <= 0 ? "D-Day" : `D-${daysUntil}`;
}

function getNextCompanyEvent(
  posting: EnrichedPosting,
  schedule: ScheduleEvent[],
  referenceDate: Date,
): CompanyEventSummary | null {
  const nextEvent = schedule
    .filter((event) => event.company === posting.company && event.date >= referenceDate.getDate())
    .sort((left, right) => left.date - right.date)[0];

  if (!nextEvent) {
    return null;
  }

  return {
    title: nextEvent.title,
    dateLabel: `${referenceDate.getMonth() + 1}월 ${nextEvent.date}일`,
    daysUntil: nextEvent.date - referenceDate.getDate(),
  };
}

function resolveExpectedDateLabel(
  posting: EnrichedPosting,
  schedule: ScheduleEvent[],
  referenceDate: Date,
) {
  const nextEvent = getNextCompanyEvent(posting, schedule, referenceDate);
  if (nextEvent) {
    return nextEvent.dateLabel;
  }

  return `${formatMonthDay(posting.deadline)} 마감`;
}

function resolveDueContext(
  posting: EnrichedPosting,
  schedule: ScheduleEvent[],
  referenceDate: Date,
) {
  const nextEvent = getNextCompanyEvent(posting, schedule, referenceDate);
  const shouldUseEvent = nextEvent && nextEvent.daysUntil <= posting.daysLeft;

  if (shouldUseEvent && nextEvent) {
    return {
      dueDays: nextEvent.daysUntil,
      dueContext: nextEvent.title,
    };
  }

  return {
    dueDays: posting.daysLeft,
    dueContext: `${formatMonthDay(posting.deadline)} 서류 마감`,
  };
}

function buildOverviewSummaryMetrics(filteredPostings: EnrichedPosting[]): OverviewSummaryMetric[] {
  const totalCount = filteredPostings.length;
  const documentPassedCount = filteredPostings.filter((posting) => {
    const stage = normalizeOverviewStage(posting.stage).kind;
    return stage === "documentPassed" || stage === "activeProcess" || stage === "interview";
  }).length;
  const activeProcessCount = filteredPostings.filter(
    (posting) => normalizeOverviewStage(posting.stage).kind === "activeProcess",
  ).length;
  const interviewCount = filteredPostings.filter(
    (posting) => normalizeOverviewStage(posting.stage).kind === "interview",
  ).length;
  const companyCount = new Set(filteredPostings.map((posting) => posting.targetCompanyId)).size;
  const passRate = totalCount === 0 ? 0 : Math.round((documentPassedCount / totalCount) * 100);

  return [
    {
      label: "총 지원 횟수",
      value: totalCount,
      suffix: "건",
      helper: `${companyCount}개 기업 추적`,
      data: [
        0,
        Math.max(totalCount - 3, 0),
        Math.max(totalCount - 2, 0),
        Math.max(totalCount - 1, 0),
        totalCount,
      ],
      color: "#4f46e5",
    },
    {
      label: "서류 합격률",
      value: `${passRate}%`,
      helper: `${documentPassedCount}/${totalCount || 0}건 통과`,
      data: [
        0,
        Math.round(passRate * 0.35),
        Math.round(passRate * 0.55),
        Math.round(passRate * 0.8),
        passRate,
      ],
      color: "#10b981",
    },
    {
      label: "진행중인 필기/과제",
      value: activeProcessCount,
      suffix: "건",
      helper: "테스트/과제 기준",
      data: [
        0,
        activeProcessCount,
        activeProcessCount,
        Math.max(activeProcessCount - 1, 0),
        activeProcessCount,
      ],
      color: "#f59e0b",
    },
    {
      label: "대기중인 직무면접",
      value: interviewCount,
      suffix: "건",
      helper: "면접 단계 기준",
      data: [0, 0, Math.max(interviewCount - 1, 0), interviewCount, interviewCount],
      color: "#ec4899",
    },
  ];
}

function buildOverviewActionItem(
  posting: EnrichedPosting,
  schedule: ScheduleEvent[],
  referenceDate: Date,
): OverviewActionItem {
  const normalizedStage = normalizeOverviewStage(posting.stage);

  return {
    id: posting.id,
    companyId: posting.targetCompanyId,
    company: posting.company,
    title: posting.title,
    summary: posting.summary,
    priority: posting.priority,
    daysLeft: posting.daysLeft,
    stageLabel: normalizedStage.stageLabel,
    nextActionLabel: normalizedStage.nextActionLabel,
    expectedDateLabel: resolveExpectedDateLabel(posting, schedule, referenceDate),
  };
}

function buildOverviewSupportFlowItem(
  posting: EnrichedPosting,
  schedule: ScheduleEvent[],
  referenceDate: Date,
): OverviewSupportFlowItem {
  const normalizedStage = normalizeOverviewStage(posting.stage);

  return {
    postingId: posting.id,
    companyId: posting.targetCompanyId,
    company: posting.company,
    stageKind: normalizedStage.kind,
    stageLabel: normalizedStage.stageLabel,
    progress: normalizedStage.progress,
    nextActionLabel: normalizedStage.nextActionLabel,
    expectedDateLabel: resolveExpectedDateLabel(posting, schedule, referenceDate),
    priority: posting.priority,
  };
}

function buildOverviewFocusItems(supportFlow: OverviewSupportFlowItem[]): OverviewFocusItem[] {
  return supportFlow.slice(0, 3).map((item) => ({
    postingId: item.postingId,
    company: item.company,
    stageLabel: item.stageLabel,
    nextActionLabel: item.nextActionLabel,
    expectedDateLabel: item.expectedDateLabel,
  }));
}

function buildOverviewUrgentItems(
  filteredPostings: EnrichedPosting[],
  schedule: ScheduleEvent[],
  referenceDate: Date,
): OverviewUrgentItem[] {
  return filteredPostings
    .map((posting) => {
      const due = resolveDueContext(posting, schedule, referenceDate);

      return {
        postingId: posting.id,
        company: posting.company,
        title: posting.title,
        summary: posting.summary,
        stageLabel: normalizeOverviewStage(posting.stage).stageLabel,
        dueDays: due.dueDays,
        dueBadge: formatDueBadge(due.dueDays),
        dueContext: due.dueContext,
        priority: posting.priority,
      };
    })
    .filter((item) => item.dueDays <= 7)
    .sort((left, right) => {
      if (left.dueDays !== right.dueDays) {
        return left.dueDays - right.dueDays;
      }

      return right.priority - left.priority;
    })
    .map(({ priority, ...item }) => item);
}

function calculateChecklistProgress(items: ApplicationChecklistItem[]) {
  const total = items.length;
  const done = items.filter((item) => item.done).length;
  const blocked = items.filter((item) => item.blocked).length;

  return {
    completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
    blockedCount: blocked,
  };
}

function hasPortfolioKeywordCoverage(keyword: string, portfolioKeywordSet: Set<string>) {
  const normalizedKeyword = normalizeKeyword(keyword);
  return [...portfolioKeywordSet].some(
    (portfolioKeyword) =>
      portfolioKeyword === normalizedKeyword ||
      portfolioKeyword.includes(normalizedKeyword) ||
      normalizedKeyword.includes(portfolioKeyword),
  );
}

function findFirstMissingKeyword(posting: EnrichedPosting, portfolioKeywordSet: Set<string>) {
  return posting.keywords.find((keyword) => !hasPortfolioKeywordCoverage(keyword, portfolioKeywordSet)) ?? null;
}

function buildOverviewObservationPoints({
  filteredPostings,
  companyTargets,
  urgentItems,
  checklistCollection,
  checklistTemplates,
  portfolioKeywordSet,
}: {
  filteredPostings: EnrichedPosting[];
  companyTargets: CompanyTarget[];
  urgentItems: OverviewUrgentItem[];
  checklistCollection: DashboardLocalState["checklists"]["applicationChecklists"];
  checklistTemplates: Record<number, ApplicationChecklistItem[]>;
  portfolioKeywordSet: Set<string>;
}): OverviewObservationPoint[] {
  if (filteredPostings.length === 0) {
    return [
      {
        id: "empty-filter",
        summary: "현재 필터에서는 바로 행동으로 옮길 관찰 포인트가 없습니다. 검색어나 회사를 초기화해 보세요.",
      },
    ];
  }

  const focusPosting = filteredPostings[0];
  const focusCompany =
    companyTargets.find((company) => company.id === focusPosting.targetCompanyId) ?? null;
  const urgentItem = urgentItems[0] ?? null;
  const checklistItems = getChecklistItems(
    checklistCollection,
    checklistTemplates,
    (urgentItem?.postingId ?? focusPosting.id),
  );
  const checklistProgress = calculateChecklistProgress(checklistItems);
  const missingKeyword = findFirstMissingKeyword(focusPosting, portfolioKeywordSet);

  return [
    {
      id: "focus-company",
      summary: `가장 집중할 타겟은 ${focusPosting.company}이며, 선호도 ${focusCompany?.preference ?? focusPosting.priority}%와 적합도 ${focusCompany?.fit ?? focusPosting.fit}%가 동시에 높습니다.`,
    },
    {
      id: "urgent-item",
      summary: urgentItem
        ? `즉시 대응 과제는 ${urgentItem.company}이며 ${urgentItem.dueContext}까지 ${urgentItem.dueDays}일 남았습니다.`
        : `이번 필터 기준으로 7일 이내 급한 전형은 없고, 가장 가까운 항목은 ${focusPosting.company}입니다.`,
    },
    {
      id: "checklist-progress",
      summary:
        checklistProgress.blockedCount > 0
          ? `${urgentItem?.company ?? focusPosting.company}은 체크리스트 ${checklistProgress.completionRate}% 완료 상태이며 블로킹 ${checklistProgress.blockedCount}건 정리가 필요합니다.`
          : `${urgentItem?.company ?? focusPosting.company}은 체크리스트 ${checklistProgress.completionRate}% 완료 상태이며 제출 전 점검이 더 필요합니다.`,
    },
    {
      id: "keyword-gap",
      summary: missingKeyword
        ? `JD 키워드 중 '${missingKeyword}'는 포트폴리오 표기 보강이 필요합니다.`
        : "핵심 JD 키워드는 현재 포트폴리오와 잘 맞물려 있습니다.",
    },
  ];
}

export function buildOverviewCollections({
  postings,
  companyTargets,
  checklistCollection,
  checklistTemplates,
  schedule,
  query,
  companyFilter,
  referenceDate,
  portfolioKeywordSet,
}: BuildOverviewCollectionsOptions) {
  const filteredPostings = filterPostings(postings, query, companyFilter).sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }

    return left.daysLeft - right.daysLeft;
  });

  const topActions = filteredPostings.map((posting) =>
    buildOverviewActionItem(posting, schedule, referenceDate),
  );
  const supportFlow = filteredPostings.map((posting) =>
    buildOverviewSupportFlowItem(posting, schedule, referenceDate),
  );
  const urgentItems = buildOverviewUrgentItems(filteredPostings, schedule, referenceDate);

  return {
    filteredPostings,
    summaryMetrics: buildOverviewSummaryMetrics(filteredPostings),
    topActions,
    supportFlow,
    focusItems: buildOverviewFocusItems(supportFlow),
    urgentItems,
    observationPoints: buildOverviewObservationPoints({
      filteredPostings,
      companyTargets,
      urgentItems,
      checklistCollection,
      checklistTemplates,
      portfolioKeywordSet,
    }),
    companyOptions: companyTargets.map((company) => ({
      value: String(company.id),
      label: company.name,
    })) satisfies OverviewCompanyOption[],
  };
}
