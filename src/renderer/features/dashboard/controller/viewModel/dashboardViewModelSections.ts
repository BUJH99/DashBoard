import { getChecklistItems } from "../../domain/dashboardSelectors";
import {
  analyticsInsights,
  competencyMetrics,
  funnelSteps,
  weeklyTrend,
} from "../../domain/seeds/overviewSeed";
import {
  companyDetails,
} from "../../domain/seeds/companySeed";
import { industryNews } from "../../domain/seeds/industrySeed";
import {
  essayQuestions,
  experienceLibrary,
} from "../../domain/seeds/interviewSeed";
import { originPresets } from "../../domain/seeds/locationSeed";
import { offerCatalog } from "../../domain/seeds/offerSeed";
import {
  contributionHeatmapSeed,
  portfolioData,
} from "../../domain/seeds/portfolioSeed";
import type { ApplicationChecklistItem } from "../../types";
import { buildIndustryTags } from "../dashboardMessages";
import type { BuildDashboardViewModelOptions } from "./dashboardViewModelTypes";

function buildChecklistProgress(items: ApplicationChecklistItem[]) {
  const totalCount = items.length;
  const doneCount = items.filter((item) => item.done).length;
  const blockedCount = items.filter((item) => item.blocked).length;

  return {
    totalCount,
    doneCount,
    blockedCount,
    remainingCount: Math.max(totalCount - doneCount, 0),
    completionRate: totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100),
  };
}

export function buildOverviewViewModel({
  overviewCollections,
  actions,
  dashboardState,
}: BuildDashboardViewModelOptions) {
  return {
    analyticsInsights,
    funnelSteps,
    competencyMetrics,
    filters: {
      query: dashboardState.overview.query,
      companyFilter: dashboardState.overview.companyFilter,
      companyOptions: overviewCollections.companyOptions,
      setQuery: actions.setOverviewQuery,
      setCompanyFilter: actions.setOverviewCompanyFilter,
      reset: actions.resetOverviewFilters,
    },
    summaryMetrics: overviewCollections.summaryMetrics,
    topActions: overviewCollections.topActions,
    supportFlow: overviewCollections.supportFlow,
    focusItems: overviewCollections.focusItems,
    urgentItems: overviewCollections.urgentItems,
    observationPoints: overviewCollections.observationPoints,
    weeklyTrend,
    toggleOverviewTask: actions.toggleOverviewTask,
    taskChecked: dashboardState.overview.taskChecked,
  };
}

export function buildIndustryViewModel({
  filteredIndustryNews,
  dashboardState,
  setUiState,
}: BuildDashboardViewModelOptions) {
  return {
    news: filteredIndustryNews,
    tags: buildIndustryTags(industryNews),
    selectedTag: dashboardState.ui.industryFilter,
    setTag: (tag: string) => setUiState("industryFilter", tag),
  };
}

export function buildCompaniesViewModel({
  companyTargets,
  selectedCompany,
  selectedCompanyDetail,
  selectedCompanySlug,
  selectedCompanyPosting,
  selectedJobPosting,
  relatedPostings,
  companyCoverLetters,
  filteredPostings,
  dashboardState,
  setUiState,
  actions,
}: BuildDashboardViewModelOptions) {
  const activeSelectedPosting =
    selectedJobPosting.targetCompanyId === selectedCompany.id
      ? selectedJobPosting
      : selectedCompanyPosting;

  return {
    companyTargets,
    companyDetails,
    selectedCompany,
    selectedCompanyDetail,
    selectedCompanySlug,
    selectedCompanyPosting: activeSelectedPosting,
    selectedJobPosting,
    relatedPostings,
    companyCoverLetters,
    filteredPostings,
    setPostingQuery: (value: string) => setUiState("postingQuery", value),
    setPostingCompanyFilter: (value: string) => setUiState("postingCompanyFilter", value),
    updateSelectedCompanyId: actions.updateSelectedCompanyId,
    setSelectedPostingId: actions.selectJobPosting,
    postingQuery: dashboardState.ui.postingQuery,
    postingCompanyFilter: dashboardState.ui.postingCompanyFilter,
  };
}

export function buildOfferViewModel({
  selectedOfferA,
  selectedOfferB,
  setUiState,
}: BuildDashboardViewModelOptions) {
  return {
    offerCatalog,
    selectedOfferA,
    selectedOfferB,
    setSelectedOfferA: (value: string) => setUiState("selectedOfferA", value),
    setSelectedOfferB: (value: string) => setUiState("selectedOfferB", value),
  };
}

export function buildLocationViewModel({
  dashboardState,
  selectedCommuteNote,
  transitDirectionsUrl,
  actions,
}: BuildDashboardViewModelOptions) {
  return {
    originPresets,
    routeOrigin: dashboardState.location.routeOrigin,
    setRouteOrigin: actions.setRouteOrigin,
    setRouteDestination: actions.setRouteDestination,
    routeDestination: dashboardState.location.routeDestination,
    selectedCommuteNote,
    updateCommuteNote: actions.updateCommuteNote,
    transitDirectionsUrl,
    openTransitDirections: actions.openTransitDirections,
  };
}

export function buildPortfolioViewModel({
  dashboardState,
  actions,
}: BuildDashboardViewModelOptions) {
  return {
    data: portfolioData,
    contributionHeatmapSeed,
    activeSubTab: dashboardState.ui.portfolioSubTab,
    setActiveSubTab: actions.setPortfolioSubTab,
  };
}

export function buildChecklistViewModel({
  dashboardState,
  allPostings,
  checklistTemplates,
  selectedChecklistPosting,
  checklistItems,
  actions,
}: BuildDashboardViewModelOptions) {
  const postingSummaries = allPostings.map((posting) => {
    const items = getChecklistItems(
      dashboardState.checklists.applicationChecklists,
      checklistTemplates,
      posting.id,
    );
    const progress = buildChecklistProgress(items);

    return {
      id: posting.id,
      company: posting.company,
      title: posting.title,
      stage: posting.stage,
      deadline: posting.deadline,
      daysLeft: posting.daysLeft,
      priority: posting.priority,
      selfIntroReady: posting.selfIntroReady,
      summary: posting.summary,
      totalCount: progress.totalCount,
      doneCount: progress.doneCount,
      blockedCount: progress.blockedCount,
      remainingCount: progress.remainingCount,
      completionRate: progress.completionRate,
      isSelected: posting.id === selectedChecklistPosting.id,
    };
  });
  const totalChecklistItemCount = postingSummaries.reduce((sum, posting) => sum + posting.totalCount, 0);
  const totalDoneCount = postingSummaries.reduce((sum, posting) => sum + posting.doneCount, 0);
  const selectedProgress = buildChecklistProgress(checklistItems);
  const blockedPostingCount = postingSummaries.filter((posting) => posting.blockedCount > 0).length;
  const atRiskPostingCount = postingSummaries.filter(
    (posting) => posting.daysLeft <= 2 && (posting.completionRate < 100 || posting.blockedCount > 0),
  ).length;

  return {
    selectedPosting: selectedChecklistPosting,
    checklistItems,
    postingSummaries,
    selectedProgress,
    summaryMetrics: {
      overallCompletionRate:
        totalChecklistItemCount === 0 ? 0 : Math.round((totalDoneCount / totalChecklistItemCount) * 100),
      blockedPostingCount,
      atRiskPostingCount,
      totalPostingCount: postingSummaries.length,
    },
    setSelectedPostingId: actions.selectJobPosting,
    toggleChecklistItemDone: actions.toggleChecklistItemDone,
    toggleChecklistItemBlocked: actions.toggleChecklistItemBlocked,
    updateChecklistItemNote: actions.updateChecklistItemNote,
  };
}

export function buildInterviewViewModel({
  flashcardDeck,
  activeFlashcard,
  activeFlashcardIndex,
  dashboardState,
  actions,
}: BuildDashboardViewModelOptions) {
  return {
    flashcardDeck,
    activeFlashcard,
    activeFlashcardIndex,
    setActiveFlashcardIndex: actions.setActiveFlashcardIndex,
    flashcardMode: dashboardState.ui.flashcardMode,
    setFlashcardMode: actions.setFlashcardMode,
    feedback: dashboardState.interview.flashcardFeedback,
    recordFlashcardFeedback: actions.recordFlashcardFeedback,
    experienceLibrary,
  };
}

export function buildEssaysViewModel({
  selectedEssay,
  setUiState,
}: BuildDashboardViewModelOptions) {
  return {
    essayQuestions,
    selectedEssay,
    setSelectedEssayId: (id: number) => setUiState("selectedEssayId", id),
  };
}

export function buildCalendarViewModel({
  companyTargets,
  dashboardState,
  dashboardStateMessage,
  saveDashboardState,
  calendarEvents,
  selectedScheduleEvent,
  upcomingSchedule,
  actions,
  setUiState,
}: BuildDashboardViewModelOptions) {
  return {
    calendarEvents,
    selectedScheduleEvent,
    upcomingSchedule,
    companyOptions: companyTargets.map((company) => ({
      value: company.name,
      label: company.name,
    })),
    eventTypeOptions: [
      { value: "task", label: "과제/준비" },
      { value: "interview", label: "면접" },
      { value: "deadline", label: "마감" },
      { value: "test", label: "필기/인적성" },
    ],
    saveMessage: dashboardStateMessage,
    canDelete: dashboardState.calendar.scheduleEntries.length > 1,
    setSelectedScheduleId: (id: number) => setUiState("selectedScheduleId", id),
    updateScheduleEvent: actions.updateScheduleEvent,
    createScheduleEvent: actions.createScheduleEvent,
    deleteScheduleEvent: actions.deleteScheduleEvent,
    saveChanges: saveDashboardState,
  };
}

export function buildPostingsViewModel({
  companyTargets,
  dashboardState,
  dashboardStateMessage,
  saveDashboardState,
  filteredPostings,
  selectedJobPosting,
  actions,
  setUiState,
}: BuildDashboardViewModelOptions) {
  return {
    companyOptions: companyTargets.map((company) => ({
      value: String(company.id),
      label: company.name,
    })),
    stageOptions: [
      "서류 제출",
      "서류 합격",
      "과제",
      "인적성 예정",
      "1차 면접",
      "2차 면접",
    ],
    filteredPostings,
    selectedPosting: selectedJobPosting,
    postingQuery: dashboardState.ui.postingQuery,
    postingCompanyFilter: dashboardState.ui.postingCompanyFilter,
    setPostingQuery: (value: string) => setUiState("postingQuery", value),
    setPostingCompanyFilter: (value: string) => setUiState("postingCompanyFilter", value),
    setSelectedPostingId: actions.selectJobPosting,
    updatePosting: actions.updateJobPosting,
    updatePostingKeywords: actions.updateJobPostingKeywords,
    createPosting: actions.createJobPosting,
    deletePosting: actions.deleteJobPosting,
    saveChanges: saveDashboardState,
    saveMessage: dashboardStateMessage,
    canDelete: dashboardState.postings.entries.length > 1,
  };
}

export function buildJdScannerViewModel({
  jdScan,
  jdResult,
  selectedCompany,
  selectedCompanyPosting,
  selectedEssay,
  setJdScannerText,
  actions,
}: BuildDashboardViewModelOptions) {
  return {
    jdScan,
    setText: setJdScannerText,
    runJdAnalysis: actions.runJdAnalysis,
    resetJdAnalysis: actions.resetJdAnalysis,
    result: jdResult,
    selectedCompany,
    selectedCompanyPosting,
    selectedEssay,
    experienceLibrary,
    essayQuestions,
  };
}
