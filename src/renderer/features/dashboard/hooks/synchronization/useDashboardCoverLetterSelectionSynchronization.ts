import { useEffect } from "react";
import type { DashboardStateSynchronizationOptions } from "./dashboardSynchronizationTypes";

export function useDashboardCoverLetterSelectionSynchronization({
  dashboardState,
  setDashboardState,
  workspaceSelectedCoverLetterName,
  setWorkspaceSelectedCoverLetterName,
}: Pick<
  DashboardStateSynchronizationOptions,
  | "dashboardState"
  | "setDashboardState"
  | "workspaceSelectedCoverLetterName"
  | "setWorkspaceSelectedCoverLetterName"
>) {
  useEffect(() => {
    if (dashboardState.ui.selectedCoverLetterName === workspaceSelectedCoverLetterName) {
      return;
    }

    setDashboardState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selectedCoverLetterName: workspaceSelectedCoverLetterName,
      },
    }));
  }, [
    dashboardState.ui.selectedCoverLetterName,
    setDashboardState,
    workspaceSelectedCoverLetterName,
  ]);
}
