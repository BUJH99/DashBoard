import {
  buildCalendarViewModel,
  buildChecklistViewModel,
  buildCompaniesViewModel,
  buildEssaysViewModel,
  buildIndustryViewModel,
  buildInterviewViewModel,
  buildJdScannerViewModel,
  buildLocationViewModel,
  buildOfferViewModel,
  buildOverviewViewModel,
  buildPostingsViewModel,
  buildPortfolioViewModel,
} from "./viewModel/dashboardViewModelSections";
import type { BuildDashboardViewModelOptions } from "./viewModel/dashboardViewModelTypes";

export function buildDashboardViewModel(options: BuildDashboardViewModelOptions) {
  return {
    activeTab: options.dashboardState.ui.activeTab,
    setActiveTab: options.actions.setActiveTab,
    dashboardState: options.dashboardState,
    dashboardStateMessage: options.dashboardStateMessage,
    saveDashboardState: options.saveDashboardState,
    setUiState: options.setUiState,
    setPortfolioSubTab: options.actions.setPortfolioSubTab,
    overview: buildOverviewViewModel(options),
    industry: buildIndustryViewModel(options),
    companies: buildCompaniesViewModel(options),
    postings: buildPostingsViewModel(options),
    offer: buildOfferViewModel(options),
    location: buildLocationViewModel(options),
    portfolio: buildPortfolioViewModel(options),
    checklist: buildChecklistViewModel(options),
    interview: buildInterviewViewModel(options),
    essays: buildEssaysViewModel(options),
    calendar: buildCalendarViewModel(options),
    jdScanner: buildJdScannerViewModel(options),
    coverLetters: {
      ...options.coverLetterWorkspace,
    },
  };
}
