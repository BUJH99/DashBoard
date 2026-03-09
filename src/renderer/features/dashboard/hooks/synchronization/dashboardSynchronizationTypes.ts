import type { Dispatch, SetStateAction } from "react";
import type {
  ApplicationChecklistItem,
  CompanyTarget,
  DashboardLocalState,
  EnrichedPosting,
  EssayQuestion,
  JdScanState,
  OfferCatalogEntry,
  ScheduleEvent,
} from "../../types";

export type DashboardStateSetter = Dispatch<SetStateAction<DashboardLocalState>>;
export type JdScanSetter = Dispatch<SetStateAction<JdScanState>>;

export type DashboardStateSynchronizationOptions = {
  dashboardState: DashboardLocalState;
  setDashboardState: DashboardStateSetter;
  postings: EnrichedPosting[];
  companyTargets: CompanyTarget[];
  essayQuestions: EssayQuestion[];
  schedule: ScheduleEvent[];
  offerCatalog: OfferCatalogEntry[];
  fallbackOfferA: string;
  fallbackOfferB: string;
  dashboardStateSyncMessage: string | null;
  clearDashboardStateMessage: () => void;
  checklistTemplates: Record<number, ApplicationChecklistItem[]>;
  workspaceSelectedCoverLetterName: string | null;
  setWorkspaceSelectedCoverLetterName: (value: string | null) => void;
  selectedCompanyName: string;
  jdScan: JdScanState;
  setJdScan: JdScanSetter;
};
