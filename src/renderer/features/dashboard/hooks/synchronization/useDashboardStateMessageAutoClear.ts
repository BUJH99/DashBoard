import { useEffect } from "react";
import type { DashboardStateSynchronizationOptions } from "./dashboardSynchronizationTypes";

export function useDashboardStateMessageAutoClear({
  dashboardStateSyncMessage,
  clearDashboardStateMessage,
}: Pick<DashboardStateSynchronizationOptions, "dashboardStateSyncMessage" | "clearDashboardStateMessage">) {
  useEffect(() => {
    if (!dashboardStateSyncMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      clearDashboardStateMessage();
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [clearDashboardStateMessage, dashboardStateSyncMessage]);
}
