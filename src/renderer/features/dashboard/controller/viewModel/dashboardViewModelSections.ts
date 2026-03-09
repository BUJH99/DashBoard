import {
  activePipelines,
  analyticsInsights,
  competencyMetrics,
  funnelSteps,
  kpiMetrics,
  weeklyTrend,
} from "../../domain/seeds/overviewSeed";
import {
  companyDetails,
  companyTargets,
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
import { buildIndustryTags } from "../dashboardMessages";
import type { BuildDashboardViewModelOptions } from "./dashboardViewModelTypes";

export function buildOverviewViewModel({
  filteredPostings,
  urgentPostings,
  actions,
  dashboardState,
}: BuildDashboardViewModelOptions) {
  return {
    kpiMetrics,
    urgentPostings,
    activePipelines,
    analyticsInsights,
    funnelSteps,
    competencyMetrics,
    priorityPostings: filteredPostings.slice(0, 4),
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
  selectedCompany,
  selectedCompanyDetail,
  selectedCompanySlug,
  selectedCompanyPosting,
  relatedPostings,
  companyCoverLetters,
  filteredPostings,
  dashboardState,
  setUiState,
  actions,
}: BuildDashboardViewModelOptions) {
  return {
    companyTargets,
    companyDetails,
    selectedCompany,
    selectedCompanyDetail,
    selectedCompanySlug,
    selectedCompanyPosting,
    relatedPostings,
    companyCoverLetters,
    filteredPostings,
    setPostingQuery: (value: string) => setUiState("postingQuery", value),
    setPostingCompanyFilter: (value: string) => setUiState("postingCompanyFilter", value),
    updateSelectedCompanyId: actions.updateSelectedCompanyId,
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
  selectedChecklistPosting,
  checklistItems,
  setUiState,
  actions,
}: BuildDashboardViewModelOptions) {
  return {
    selectedPosting: selectedChecklistPosting,
    checklistItems,
    setSelectedPostingId: (id: number) => setUiState("selectedChecklistPostingId", id),
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
  calendarEvents,
  selectedScheduleEvent,
  upcomingSchedule,
  setUiState,
}: BuildDashboardViewModelOptions) {
  return {
    calendarEvents,
    selectedScheduleEvent,
    upcomingSchedule,
    setSelectedScheduleId: (id: number) => setUiState("selectedScheduleId", id),
  };
}

export function buildJdScannerViewModel({
  jdScan,
  jdResult,
  setJdScannerText,
  actions,
}: BuildDashboardViewModelOptions) {
  return {
    jdScan,
    setText: setJdScannerText,
    runJdAnalysis: actions.runJdAnalysis,
    result: jdResult,
  };
}
