import { useEffect } from "react";
import { ensureChecklistCollection } from "../../domain/dashboardSelectors";
import type { DashboardStateSynchronizationOptions } from "./dashboardSynchronizationTypes";

export function useDashboardChecklistSynchronization({
  setDashboardState,
  checklistTemplates,
  dashboardState,
}: Pick<
  DashboardStateSynchronizationOptions,
  "setDashboardState" | "checklistTemplates" | "dashboardState"
>) {
  useEffect(() => {
    setDashboardState((current) => {
      const nextCollection = ensureChecklistCollection(
        current.checklists.applicationChecklists,
        checklistTemplates,
        current.ui.selectedChecklistPostingId,
      );

      if (nextCollection === current.checklists.applicationChecklists) {
        return current;
      }

      return {
        ...current,
        checklists: {
          ...current.checklists,
          applicationChecklists: nextCollection,
        },
      };
    });
  }, [checklistTemplates, dashboardState.ui.selectedChecklistPostingId, setDashboardState]);
}
