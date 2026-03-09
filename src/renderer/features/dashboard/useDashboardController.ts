import { useMemo, useState } from "react";
import { buildDefaultDashboardState } from "../../../../shared/dashboard-state";
import { useCoverLetterWorkspace } from "../coverLetters/hooks/useCoverLetterWorkspace";
import { coverLetterSlugify } from "../coverLetters/utils";
import { useJdScanner } from "../jdScanner/hooks/useJdScanner";
import {
  CALENDAR_MONTH_INDEX,
  CALENDAR_YEAR,
  DASHBOARD_REFERENCE_DATE,
  schedule,
} from "./domain/seeds/calendarSeed";
import { checklistTemplates } from "./domain/seeds/checklistSeed";
import {
  companyDetails,
  companySlugMap,
  companyTargets,
  jobPostings,
} from "./domain/seeds/companySeed";
import {
  essayQuestions,
  flashcards,
} from "./domain/seeds/interviewSeed";
import { industryNews } from "./domain/seeds/industrySeed";
import { jdKeywordLibrary } from "./domain/seeds/jdSeed";
import {
  commuteNotesSeed,
  originPresets,
} from "./domain/seeds/locationSeed";
import { offerCatalog } from "./domain/seeds/offerSeed";
import { portfolioData } from "./domain/seeds/portfolioSeed";
import {
  enrichPostings,
  getChecklistItems,
} from "./domain/dashboardSelectors";
import {
  createDashboardActions,
  createSetUiState,
} from "./controller/dashboardActions";
import { buildDashboardStateMessage } from "./controller/dashboardMessages";
import {
  buildDashboardCompanySnapshot,
  buildDashboardSelectionState,
} from "./controller/dashboardSelectionState";
import { buildDashboardViewModel } from "./controller/dashboardViewModel";
import { useDashboardDerivedCollections } from "./hooks/useDashboardDerivedCollections";
import { useDashboardStateSynchronization } from "./hooks/useDashboardStateSynchronization";
import { usePersistedDashboardState } from "./hooks/usePersistedDashboardState";
import { useSelectedCompanyModel } from "./hooks/useSelectedCompanyModel";

const FALLBACK_OFFER_A = offerCatalog[0]?.id ?? "";
const FALLBACK_OFFER_B = offerCatalog[1]?.id ?? FALLBACK_OFFER_A;

export function useDashboardController() {
  const [dashboardState, setDashboardState] = useState(buildDefaultDashboardState);
  const setUiState = useMemo(() => createSetUiState(setDashboardState), []);

  const postings = useMemo(
    () => enrichPostings(jobPostings, DASHBOARD_REFERENCE_DATE),
    [],
  );

  const {
    snapshotCompany,
    snapshotCompanyPosting,
    snapshotCompanySlug,
  } = useMemo(
    () =>
      buildDashboardCompanySnapshot({
        companyTargets,
        postings,
        selectedCompanyId: dashboardState.ui.selectedCompanyId,
        companySlugMap,
        coverLetterSlugify,
      }),
    [dashboardState.ui.selectedCompanyId, postings],
  );

  const coverLetterWorkspace = useCoverLetterWorkspace({
    selectedCompanyId: dashboardState.ui.selectedCompanyId,
    selectedCompany: snapshotCompany,
    selectedCompanyPosting: snapshotCompanyPosting,
    selectedCompanySlug: snapshotCompanySlug,
  });

  const {
    selectedCompany,
    selectedCompanyDetail,
    relatedPostings,
    companyCoverLetters,
    selectedCompanySlug,
  } = useSelectedCompanyModel({
    companies: companyTargets,
    companyDetails,
    selectedCompanyId: dashboardState.ui.selectedCompanyId,
    postings,
    coverLetterFiles: coverLetterWorkspace.coverLetterFiles,
    companySlugMap,
    coverLetterSlugify,
  });

  const selectedCompanyPosting =
    relatedPostings.find((posting) => posting.targetCompanyId === selectedCompany.id) ??
    snapshotCompanyPosting;

  const {
    dashboardStateSync,
    clearDashboardStateMessage,
    saveDashboardState,
  } = usePersistedDashboardState({
    applyState: setDashboardState,
    buildState: () => dashboardState,
  });

  const { jdScan, setJdScan } = useJdScanner(dashboardState.jdScanner.text);

  useDashboardStateSynchronization({
    dashboardState,
    setDashboardState,
    postings,
    companyTargets,
    essayQuestions,
    schedule,
    offerCatalog,
    fallbackOfferA: FALLBACK_OFFER_A,
    fallbackOfferB: FALLBACK_OFFER_B,
    dashboardStateSyncMessage: dashboardStateSync.message,
    clearDashboardStateMessage,
    checklistTemplates,
    workspaceSelectedCoverLetterName: coverLetterWorkspace.selectedCoverLetterName,
    setWorkspaceSelectedCoverLetterName: coverLetterWorkspace.setSelectedCoverLetterName,
    selectedCompanyName: selectedCompany.name,
    jdScan,
    setJdScan,
  });

  const {
    jdResult,
    filteredIndustryNews,
    filteredPostings,
    urgentPostings,
    upcomingSchedule,
    calendarEvents,
    flashcardDeck,
  } = useDashboardDerivedCollections({
    dashboardState,
    postings,
    flashcards,
    industryNews,
    schedule,
    portfolioData,
    jdScan,
    jdKeywordLibrary,
    calendarYear: CALENDAR_YEAR,
    calendarMonthIndex: CALENDAR_MONTH_INDEX,
    referenceDate: DASHBOARD_REFERENCE_DATE,
  });

  const {
    activeFlashcardIndex,
    activeFlashcard,
    selectedScheduleEvent,
    selectedChecklistPosting,
    selectedEssay,
    selectedOfferA,
    selectedOfferB,
    selectedCommuteNote,
    transitDirectionsUrl,
  } = useMemo(
    () =>
      buildDashboardSelectionState({
        dashboardState,
        postings,
        schedule,
        essayQuestions,
        offerCatalog,
        flashcardDeck,
        selectedCompany,
        commuteNotesSeed,
        originPresets,
      }),
    [dashboardState, flashcardDeck, postings, selectedCompany],
  );

  const checklistItems = getChecklistItems(
    dashboardState.checklists.applicationChecklists,
    checklistTemplates,
    selectedChecklistPosting.id,
  );
  const dashboardStateMessage = buildDashboardStateMessage(dashboardStateSync);

  const setJdScannerText = (text: string) => {
    setJdScan((current) => ({
      ...current,
      text,
      phase: current.phase === "result" ? "idle" : current.phase,
    }));
  };

  const actions = useMemo(
    () =>
      createDashboardActions({
        setDashboardState,
        setUiState,
        selectedCompanyId: selectedCompany.id,
        selectedChecklistPostingId: selectedChecklistPosting.id,
        activeFlashcardQuestion: activeFlashcard?.q ?? null,
        companyTargets,
        checklistTemplates,
        commuteNotesSeed,
        transitDirectionsUrl,
        setJdScan,
      }),
    [
      activeFlashcard?.q,
      selectedChecklistPosting.id,
      selectedCompany.id,
      setJdScan,
      setUiState,
      transitDirectionsUrl,
    ],
  );

  return buildDashboardViewModel({
    dashboardState,
    dashboardStateMessage,
    saveDashboardState,
    setUiState,
    coverLetterWorkspace,
    filteredPostings,
    filteredIndustryNews,
    urgentPostings,
    selectedCompany,
    selectedCompanyDetail,
    selectedCompanySlug,
    selectedCompanyPosting,
    relatedPostings,
    companyCoverLetters,
    selectedOfferA,
    selectedOfferB,
    selectedCommuteNote,
    transitDirectionsUrl,
    checklistItems,
    selectedChecklistPosting,
    flashcardDeck,
    activeFlashcard,
    activeFlashcardIndex,
    selectedEssay,
    selectedScheduleEvent,
    upcomingSchedule,
    calendarEvents,
    jdScan,
    jdResult,
    setJdScannerText,
    actions,
  });
}

export type DashboardController = ReturnType<typeof useDashboardController>;
