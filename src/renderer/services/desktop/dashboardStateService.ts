import type {
  DashboardLocalState,
  DashboardStateReadResponse,
  DashboardStateSaveResponse,
} from "../../../../shared/desktop-contracts";
import { getDesktopApi } from "./desktopApi";

export function readDashboardState(): Promise<DashboardStateReadResponse> {
  return getDesktopApi().dashboardState.read();
}

export function saveDashboardState(payload: DashboardLocalState): Promise<DashboardStateSaveResponse> {
  return getDesktopApi().dashboardState.save(payload);
}
