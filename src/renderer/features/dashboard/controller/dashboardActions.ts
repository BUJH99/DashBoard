import { createDashboardCalendarActions } from "./actions/dashboardCalendarActions";
import { createDashboardChecklistActions } from "./actions/dashboardChecklistActions";
import { createDashboardInterviewActions } from "./actions/dashboardInterviewActions";
import { createDashboardJdScannerActions } from "./actions/dashboardJdScannerActions";
import { createDashboardLocationActions } from "./actions/dashboardLocationActions";
import { createDashboardOverviewActions } from "./actions/dashboardOverviewActions";
import { createDashboardPostingActions } from "./actions/dashboardPostingActions";
import { createDashboardUiActions } from "./actions/dashboardUiActions";
import type { DashboardActionContext } from "./dashboardActionContext";

export { createSetUiState } from "./dashboardActionContext";
export type { SetUiState } from "./dashboardActionContext";

export function createDashboardActions(context: DashboardActionContext) {
  return {
    ...createDashboardUiActions(context),
    ...createDashboardOverviewActions(context),
    ...createDashboardPostingActions(context),
    ...createDashboardCalendarActions(context),
    ...createDashboardLocationActions(context),
    ...createDashboardChecklistActions(context),
    ...createDashboardInterviewActions(context),
    ...createDashboardJdScannerActions(context),
  };
}

export type DashboardActions = ReturnType<typeof createDashboardActions>;
