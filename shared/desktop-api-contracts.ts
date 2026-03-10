import type { DashboardLocalState } from "./dashboard-state-contracts.js";
import type {
  DashboardStateReadResponse,
  DashboardStateSaveResponse,
} from "./dashboard-state-service-contracts.js";
import type {
  CoverLetterConfig,
  CoverLetterDeletePayload,
  CoverLetterDeleteResponse,
  CoverLetterListResponse,
  CoverLetterReadResult,
  CoverLetterSavePayload,
  CoverLetterSaveResponse,
} from "./cover-letter-contracts.js";
import type {
  CoverLetterSpellcheckRequest,
  CoverLetterSpellcheckResponse,
} from "./cover-letter-spellcheck-service-contracts.js";
import type {
  IndustryNewsCrawlRequest,
  IndustryNewsCrawlResponse,
} from "./industry-news-service-contracts.js";

export type DesktopApi = {
  coverletters: {
    getConfig(): Promise<CoverLetterConfig>;
    list(): Promise<CoverLetterListResponse>;
    read(name: string): Promise<CoverLetterReadResult>;
    save(payload: CoverLetterSavePayload): Promise<CoverLetterSaveResponse>;
    remove(payload: CoverLetterDeletePayload): Promise<CoverLetterDeleteResponse>;
  };
  coverLetterSpellcheck: {
    check(payload: CoverLetterSpellcheckRequest): Promise<CoverLetterSpellcheckResponse>;
  };
  dashboardState: {
    read(): Promise<DashboardStateReadResponse>;
    save(payload: DashboardLocalState): Promise<DashboardStateSaveResponse>;
  };
  industryNews: {
    crawl(payload: IndustryNewsCrawlRequest): Promise<IndustryNewsCrawlResponse>;
  };
  external: {
    openUrl(url: string): Promise<void>;
  };
};
