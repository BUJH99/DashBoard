import type { DashboardActionContext } from "../dashboardActionContext";

export function createDashboardOverviewActions({
  setDashboardState,
}: DashboardActionContext) {
  const setOverviewQuery = (query: string) => {
    setDashboardState((current) => ({
      ...current,
      overview: {
        ...current.overview,
        query,
      },
    }));
  };

  const setOverviewCompanyFilter = (companyFilter: string) => {
    setDashboardState((current) => ({
      ...current,
      overview: {
        ...current.overview,
        companyFilter,
      },
    }));
  };

  const resetOverviewFilters = () => {
    setDashboardState((current) => ({
      ...current,
      overview: {
        ...current.overview,
        query: "",
        companyFilter: "all",
      },
    }));
  };

  const toggleOverviewTask = (postingId: number) => {
    setDashboardState((current) => ({
      ...current,
      overview: {
        ...current.overview,
        taskChecked: {
          ...current.overview.taskChecked,
          [postingId]: !current.overview.taskChecked[postingId],
        },
      },
    }));
  };

  return {
    setOverviewQuery,
    setOverviewCompanyFilter,
    resetOverviewFilters,
    toggleOverviewTask,
  };
}
