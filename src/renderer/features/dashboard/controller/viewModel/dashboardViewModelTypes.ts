import type { useCoverLetterWorkspace } from "../../../coverLetters/hooks/useCoverLetterWorkspace";
import { mapScheduleToCalendarEvents } from "../../../calendar/calendarEventMapper";
import type {
  ApplicationChecklistItem,
  CommuteNote,
  CompanyDetail,
  CompanyTarget,
  CoverLetterRecord,
  DashboardLocalState,
  EnrichedPosting,
  EssayQuestion,
  FlashcardItem,
  IndustryNewsItem,
  JdScanResult,
  JdScanState,
  OfferCatalogEntry,
  OverviewActionItem,
  OverviewCompanyOption,
  OverviewFocusItem,
  OverviewObservationPoint,
  OverviewSummaryMetric,
  OverviewSupportFlowItem,
  OverviewUrgentItem,
  ScheduleEvent,
} from "../../types";
import type { DashboardActions, SetUiState } from "../dashboardActions";

export type CoverLetterWorkspace = ReturnType<typeof useCoverLetterWorkspace>;

export type BuildDashboardViewModelOptions = {
  dashboardState: DashboardLocalState;
  dashboardStateMessage: string | null;
  saveDashboardState: () => Promise<void>;
  setUiState: SetUiState;
  coverLetterWorkspace: CoverLetterWorkspace;
  filteredPostings: EnrichedPosting[];
  filteredIndustryNews: IndustryNewsItem[];
  overviewCollections: {
    filteredPostings: EnrichedPosting[];
    summaryMetrics: OverviewSummaryMetric[];
    topActions: OverviewActionItem[];
    supportFlow: OverviewSupportFlowItem[];
    focusItems: OverviewFocusItem[];
    urgentItems: OverviewUrgentItem[];
    observationPoints: OverviewObservationPoint[];
    companyOptions: OverviewCompanyOption[];
  };
  companyTargets: CompanyTarget[];
  selectedCompany: CompanyTarget;
  selectedCompanyDetail: CompanyDetail;
  selectedCompanySlug: string;
  selectedCompanyPosting: EnrichedPosting;
  selectedJobPosting: EnrichedPosting;
  relatedPostings: EnrichedPosting[];
  companyCoverLetters: CoverLetterRecord[];
  selectedOfferA: OfferCatalogEntry;
  selectedOfferB: OfferCatalogEntry;
  selectedCommuteNote: CommuteNote;
  transitDirectionsUrl: string;
  checklistItems: ApplicationChecklistItem[];
  selectedChecklistPosting: EnrichedPosting;
  flashcardDeck: FlashcardItem[];
  activeFlashcard: FlashcardItem | null;
  activeFlashcardIndex: number;
  selectedEssay: EssayQuestion;
  selectedScheduleEvent: ScheduleEvent;
  upcomingSchedule: ScheduleEvent[];
  calendarEvents: ReturnType<typeof mapScheduleToCalendarEvents>;
  jdScan: JdScanState;
  jdResult: JdScanResult | null;
  setJdScannerText: (text: string) => void;
  actions: DashboardActions;
};
