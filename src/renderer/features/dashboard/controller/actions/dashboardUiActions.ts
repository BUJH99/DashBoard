import type { DashboardTab, PortfolioSubTab } from "../../types";
import type { DashboardActionContext } from "../dashboardActionContext";

export function createDashboardUiActions({
  setDashboardState,
  setUiState,
  companyTargets,
}: DashboardActionContext) {
  const setActiveTab = (tab: DashboardTab) => setUiState("activeTab", tab);
  const setPortfolioSubTab = (tab: PortfolioSubTab) => setUiState("portfolioSubTab", tab);

  const updateSelectedCompanyId = (companyId: number) => {
    setDashboardState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selectedCompanyId: companyId,
        selectedJobPostingId:
          current.postings.entries.find((posting) => posting.targetCompanyId === companyId)?.id ??
          current.ui.selectedJobPostingId,
        selectedChecklistPostingId:
          current.postings.entries.find((posting) => posting.targetCompanyId === companyId)?.id ??
          current.ui.selectedChecklistPostingId,
        postingCompanyFilter: String(companyId),
      },
      location: {
        ...current.location,
        routeDestination:
          companyTargets.find((company) => company.id === companyId)?.name ?? current.location.routeDestination,
      },
    }));
  };

  return {
    setActiveTab,
    setPortfolioSubTab,
    updateSelectedCompanyId,
  };
}
