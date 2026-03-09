import type {
  DashboardStateReadResponse,
  DashboardStateSaveResponse,
} from "../../../../shared/dashboard-state-service-contracts";
import type { DashboardLocalState } from "../../../../shared/dashboard-state-contracts";
import { getDesktopApi } from "./desktopApi";

async function fetchDashboardStateApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/dashboard-state/${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "대시보드 상태 API 요청에 실패했습니다.");
  }

  return response.json() as Promise<T>;
}

export function readDashboardState(): Promise<DashboardStateReadResponse> {
  const desktopApi = getDesktopApi();
  if (desktopApi?.dashboardState) {
    return desktopApi.dashboardState.read();
  }

  return fetchDashboardStateApi<DashboardStateReadResponse>("read");
}

export function saveDashboardState(payload: DashboardLocalState): Promise<DashboardStateSaveResponse> {
  const desktopApi = getDesktopApi();
  if (desktopApi?.dashboardState) {
    return desktopApi.dashboardState.save(payload);
  }

  return fetchDashboardStateApi<DashboardStateSaveResponse>("save", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
