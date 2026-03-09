import type { Dispatch, SetStateAction } from "react";
import type {
  ApplicationChecklistItem,
  CommuteNote,
  CompanyTarget,
  DashboardLocalState,
  JdScanState,
} from "../types";

export type DashboardStateSetter = Dispatch<SetStateAction<DashboardLocalState>>;

export type SetUiState = <Key extends keyof DashboardLocalState["ui"]>(
  key: Key,
  value: DashboardLocalState["ui"][Key],
) => void;

export type DashboardActionContext = {
  setDashboardState: DashboardStateSetter;
  setUiState: SetUiState;
  selectedCompanyId: number;
  selectedChecklistPostingId: number;
  activeFlashcardQuestion: string | null;
  companyTargets: CompanyTarget[];
  checklistTemplates: Record<number, ApplicationChecklistItem[]>;
  commuteNotesSeed: Record<number, CommuteNote>;
  transitDirectionsUrl: string;
  setJdScan: Dispatch<SetStateAction<JdScanState>>;
};

export function createSetUiState(setDashboardState: DashboardStateSetter): SetUiState {
  return function setUiState<Key extends keyof DashboardLocalState["ui"]>(
    key: Key,
    value: DashboardLocalState["ui"][Key],
  ) {
    setDashboardState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        [key]: value,
      },
    }));
  };
}
