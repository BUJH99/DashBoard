import type { DashboardTab, PortfolioSubTab } from "../../types";
import type { DashboardActionContext } from "../dashboardActionContext";

export function createDashboardUiActions({
  setDashboardState,
  setUiState,
  companyTargets,
}: DashboardActionContext) {
  const setActiveTab = (tab: DashboardTab) => setUiState("activeTab", tab);
  const setPortfolioSubTab = (tab: PortfolioSubTab) => setUiState("portfolioSubTab", tab);

  const toggleOverviewTask = (postingId: number) => {
    setDashboardState((current) => ({
      ...current,
      overview: {
        taskChecked: {
          ...current.overview.taskChecked,
          [postingId]: !current.overview.taskChecked[postingId],
        },
      },
    }));
  };

  const updateSelectedCompanyId = (companyId: number) => {
    setDashboardState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selectedCompanyId: companyId,
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
    toggleOverviewTask,
    updateSelectedCompanyId,
  };
}
