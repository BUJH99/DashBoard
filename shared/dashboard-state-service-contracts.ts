import type { DashboardLocalState } from "./dashboard-state-contracts.js";

export type DashboardStateReadResponse = {
  state: DashboardLocalState;
  savedAt: string;
};

export type DashboardStateSaveResponse = {
  state: DashboardLocalState;
  savedAt: string;
};
