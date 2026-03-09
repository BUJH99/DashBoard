import type { DashboardLocalState } from "./dashboard-state-contracts.js";
import type {
  DashboardStateReadResponse,
  DashboardStateSaveResponse,
} from "./dashboard-state-service-contracts.js";
import type {
  CoverLetterConfig,
  CoverLetterListResponse,
  CoverLetterReadResult,
  CoverLetterSavePayload,
  CoverLetterSaveResponse,
} from "./cover-letter-contracts.js";

export type DesktopApi = {
  coverletters: {
    getConfig(): Promise<CoverLetterConfig>;
    list(): Promise<CoverLetterListResponse>;
    read(name: string): Promise<CoverLetterReadResult>;
    save(payload: CoverLetterSavePayload): Promise<CoverLetterSaveResponse>;
  };
  dashboardState: {
    read(): Promise<DashboardStateReadResponse>;
    save(payload: DashboardLocalState): Promise<DashboardStateSaveResponse>;
  };
  external: {
    openUrl(url: string): Promise<void>;
  };
};
