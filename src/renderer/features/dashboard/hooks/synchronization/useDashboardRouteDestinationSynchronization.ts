import { useEffect } from "react";
import type { DashboardStateSynchronizationOptions } from "./dashboardSynchronizationTypes";

export function useDashboardRouteDestinationSynchronization({
  dashboardState,
  setDashboardState,
  selectedCompanyName,
}: Pick<DashboardStateSynchronizationOptions, "dashboardState" | "setDashboardState" | "selectedCompanyName">) {
  useEffect(() => {
    if (dashboardState.location.routeDestination.trim()) {
      return;
    }

    setDashboardState((current) => ({
      ...current,
      location: {
        ...current.location,
        routeDestination: selectedCompanyName,
      },
    }));
  }, [dashboardState.location.routeDestination, selectedCompanyName, setDashboardState]);
}
