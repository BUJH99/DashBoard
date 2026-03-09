import type {
  DashboardStateReadResponse,
  DashboardStateSaveResponse,
} from "../../../../shared/dashboard-state-service-contracts";
import type { DashboardLocalState } from "../../../../shared/dashboard-state-contracts";
import { getDesktopApi } from "./desktopApi";

export function readDashboardState(): Promise<DashboardStateReadResponse> {
  return getDesktopApi().dashboardState.read();
}

export function saveDashboardState(payload: DashboardLocalState): Promise<DashboardStateSaveResponse> {
  return getDesktopApi().dashboardState.save(payload);
}
