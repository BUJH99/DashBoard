import { useMemo, useState } from "react";
import { buildDefaultDashboardState } from "../../../../shared/dashboard-state";
import { useCoverLetterWorkspace } from "../coverLetters/hooks/useCoverLetterWorkspace";
import {
  buildCoverLetterMarkdown,
  buildCoverLetterQuestionsFromPrompts,
  buildDefaultCoverLetterQuestionPrompts,
  coverLetterSlugify,
} from "../coverLetters/utils";
import { fillDraftFromSelectedCompany } from "../coverLetters/workspace/coverLetterWorkspaceState";
import { useJdScanner } from "../jdScanner/hooks/useJdScanner";
import {
  CALENDAR_MONTH_INDEX,
  CALENDAR_YEAR,
  DASHBOARD_REFERENCE_DATE,
} from "./domain/seeds/calendarSeed";
import { buildChecklistTemplates } from "./domain/seeds/checklistSeed";
import {
  companyDetails,
  companySlugMap,
  companyTargets,
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
  buildCompanyComparisonRows,
  buildDefaultCompanyAnalysisEntry,
  buildOfferCatalogFromCompanyAnalysis,
  buildResolvedCompanyAnalysisEntries,
  resolveComparisonCompany,
} from "./domain/companyAnalysisSelectors";
import { buildCompanyTargetsFromPostings } from "./domain/companyTargetSelectors";
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
  const scheduleEntries = dashboardState.calendar.scheduleEntries;

  const postings = useMemo(
    () => enrichPostings(dashboardState.postings.entries, DASHBOARD_REFERENCE_DATE),
    [dashboardState.postings.entries],
  );

  const resolvedCompanyTargets = useMemo(
    () => buildCompanyTargetsFromPostings(companyTargets, postings),
    [postings],
  );
  const resolvedCompanyAnalysisEntries = useMemo(
    () =>
      buildResolvedCompanyAnalysisEntries({
        companyTargets: resolvedCompanyTargets,
        companyDetails,
        offerCatalog,
        storedEntries: dashboardState.companyAnalysis.entries,
      }),
    [dashboardState.companyAnalysis.entries, resolvedCompanyTargets],
  );
  const resolvedOfferCatalog = useMemo(
    () => buildOfferCatalogFromCompanyAnalysis(offerCatalog, resolvedCompanyAnalysisEntries),
    [resolvedCompanyAnalysisEntries],
  );

  const checklistTemplates = useMemo(
    () => buildChecklistTemplates(postings),
    [postings],
  );
  const defaultCoverLetterQuestionPrompts = useMemo(
    () => buildDefaultCoverLetterQuestionPrompts(),
    [],
  );
  const selectedCompanyQuestionPrompts = useMemo(
    () =>
      dashboardState.coverLetters.questionPresets[dashboardState.ui.selectedCompanyId] ??
      defaultCoverLetterQuestionPrompts,
    [
      dashboardState.coverLetters.questionPresets,
      dashboardState.ui.selectedCompanyId,
      defaultCoverLetterQuestionPrompts,
    ],
  );

  const {
    snapshotCompany,
    snapshotCompanyPosting,
    snapshotCompanySlug,
  } = useMemo(
    () =>
      buildDashboardCompanySnapshot({
        companyTargets: resolvedCompanyTargets,
        postings,
        selectedCompanyId: dashboardState.ui.selectedCompanyId,
        selectedJobPostingId: dashboardState.ui.selectedJobPostingId,
        companySlugMap,
        coverLetterSlugify,
      }),
    [
      dashboardState.ui.selectedCompanyId,
      dashboardState.ui.selectedJobPostingId,
      postings,
      resolvedCompanyTargets,
    ],
  );

  const coverLetterWorkspace = useCoverLetterWorkspace({
    selectedCompanyId: dashboardState.ui.selectedCompanyId,
    selectedCompany: snapshotCompany,
    selectedCompanyPosting: snapshotCompanyPosting,
    selectedCompanySlug: snapshotCompanySlug,
    selectedCompanyQuestionPrompts,
    initialSelectedCoverLetterName: dashboardState.ui.selectedCoverLetterName,
  });

  const {
    selectedCompany,
    selectedCompanyDetail,
    relatedPostings,
    companyCoverLetters,
    selectedCompanySlug,
  } = useSelectedCompanyModel({
    companies: resolvedCompanyTargets,
    companyDetails,
    selectedCompanyId: dashboardState.ui.selectedCompanyId,
    postings,
    coverLetterFiles: coverLetterWorkspace.coverLetterFiles,
    companySlugMap,
    coverLetterSlugify,
  });
  const selectedCompanyAnalysis =
    resolvedCompanyAnalysisEntries[selectedCompany.id] ??
    buildDefaultCompanyAnalysisEntry(selectedCompany, selectedCompanyDetail, offerCatalog);
  const comparisonCompany = resolveComparisonCompany({
    companyTargets: resolvedCompanyTargets,
    selectedCompanyId: selectedCompany.id,
    compareCompanyId: dashboardState.companyAnalysis.compareCompanyId,
  });
  const comparisonCompanyAnalysis =
    resolvedCompanyAnalysisEntries[comparisonCompany.id] ??
    buildDefaultCompanyAnalysisEntry(comparisonCompany, companyDetails[comparisonCompany.id] ?? selectedCompanyDetail, offerCatalog);
  const companyComparisonRows = buildCompanyComparisonRows(
    selectedCompanyAnalysis,
    comparisonCompanyAnalysis,
  );

  const selectedCompanyPosting =
    relatedPostings.find((posting) => posting.id === dashboardState.ui.selectedJobPostingId) ??
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
    companyTargets: resolvedCompanyTargets,
    essayQuestions,
    schedule: scheduleEntries,
    offerCatalog: resolvedOfferCatalog,
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
    overviewCollections,
    upcomingSchedule,
    calendarEvents,
    flashcardDeck,
  } = useDashboardDerivedCollections({
    dashboardState,
    postings,
    companyTargets: resolvedCompanyTargets,
    checklistTemplates,
    flashcards,
    industryNews,
    schedule: scheduleEntries,
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
    selectedJobPosting,
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
        schedule: scheduleEntries,
        essayQuestions,
        offerCatalog: resolvedOfferCatalog,
        flashcardDeck,
        selectedCompany,
        companyTargets: resolvedCompanyTargets,
        commuteNotesSeed,
        originPresets,
      }),
    [dashboardState, flashcardDeck, postings, resolvedOfferCatalog, scheduleEntries, selectedCompany],
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
        companyTargets: resolvedCompanyTargets,
        checklistTemplates,
        commuteNotesSeed,
        transitDirectionsUrl,
        setJdScan,
      }),
    [
      activeFlashcard?.q,
      selectedChecklistPosting.id,
      selectedCompany.id,
      resolvedCompanyTargets,
      setJdScan,
      setUiState,
      transitDirectionsUrl,
    ],
  );

  const coverLetterCompanyOptions = useMemo(
    () =>
      resolvedCompanyTargets.map((company) => ({
        value: String(company.id),
        label: company.name,
      })),
    [resolvedCompanyTargets],
  );
  const companyQuestionPresets =
    dashboardState.coverLetters.questionPresets[selectedCompany.id] ??
    defaultCoverLetterQuestionPrompts;

  const updateCompanyQuestionPreset = (index: number, value: string) => {
    setDashboardState((current) => {
      const currentPrompts =
        current.coverLetters.questionPresets[selectedCompany.id] ??
        defaultCoverLetterQuestionPrompts;

      if (index < 0 || index >= currentPrompts.length) {
        return current;
      }

      return {
        ...current,
        coverLetters: {
          ...current.coverLetters,
          questionPresets: {
            ...current.coverLetters.questionPresets,
            [selectedCompany.id]: currentPrompts.map((prompt, promptIndex) =>
              promptIndex === index ? value : prompt,
            ),
          },
        },
      };
    });
  };

  const addCompanyQuestionPreset = () => {
    setDashboardState((current) => {
      const currentPrompts =
        current.coverLetters.questionPresets[selectedCompany.id] ??
        defaultCoverLetterQuestionPrompts;
      const nextPrompts = [...currentPrompts, `${selectedCompany.name} 문항 ${currentPrompts.length + 1}`];

      return {
        ...current,
        coverLetters: {
          ...current.coverLetters,
          questionPresets: {
            ...current.coverLetters.questionPresets,
            [selectedCompany.id]: nextPrompts,
          },
        },
      };
    });
  };

  const removeCompanyQuestionPreset = (index: number) => {
    setDashboardState((current) => {
      const currentPrompts =
        current.coverLetters.questionPresets[selectedCompany.id] ??
        defaultCoverLetterQuestionPrompts;

      if (currentPrompts.length <= 1 || index < 0 || index >= currentPrompts.length) {
        return current;
      }

      return {
        ...current,
        coverLetters: {
          ...current.coverLetters,
          questionPresets: {
            ...current.coverLetters.questionPresets,
            [selectedCompany.id]: currentPrompts.filter((_, promptIndex) => promptIndex !== index),
          },
        },
      };
    });
  };

  const applyCompanyQuestionPresetsToDraft = () => {
    coverLetterWorkspace.setCoverLetterDraft((current) => {
      const nextDraft = fillDraftFromSelectedCompany(current, {
        selectedCompanyId: selectedCompany.id,
        selectedCompany,
        selectedCompanyPosting,
        selectedCompanySlug,
      });
      const nextQuestionItems = buildCoverLetterQuestionsFromPrompts(companyQuestionPresets).map(
        (question, index) => ({
          ...question,
          answer: current.questionItems[index]?.answer ?? "",
        }),
      );

      return {
        ...nextDraft,
        questionItems: nextQuestionItems,
        content: buildCoverLetterMarkdown(nextDraft.meta.title, nextQuestionItems),
      };
    });
  };

  const controller = buildDashboardViewModel({
    dashboardState,
    dashboardStateMessage,
    saveDashboardState,
    setUiState,
    coverLetterWorkspace,
    filteredPostings,
    filteredIndustryNews,
    overviewCollections,
    companyTargets: resolvedCompanyTargets,
    selectedCompany,
    selectedCompanyDetail,
    selectedCompanySlug,
    selectedCompanyPosting,
    selectedJobPosting,
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

  const persistSelectedCompanyAnalysis = (
    nextEntry: typeof selectedCompanyAnalysis,
  ) => {
    setDashboardState((current) => ({
      ...current,
      companyAnalysis: {
        ...current.companyAnalysis,
        entries: {
          ...current.companyAnalysis.entries,
          [selectedCompany.id]: {
            description: nextEntry.description,
            roleDescription: nextEntry.roleDescription,
            techStack: [...nextEntry.techStack],
            news: [...nextEntry.news],
            comparison: {
              ...nextEntry.comparison,
            },
          },
        },
      },
    }));
  };

  const updateSelectedCompanyAnalysisField = (
    field: "description" | "roleDescription",
    value: string,
  ) => {
    persistSelectedCompanyAnalysis({
      ...selectedCompanyAnalysis,
      [field]: value,
    });
  };

  const updateSelectedCompanyAnalysisList = (
    field: "techStack" | "news",
    value: string[],
  ) => {
    persistSelectedCompanyAnalysis({
      ...selectedCompanyAnalysis,
      [field]: value,
    });
  };

  const updateSelectedCompanyComparisonMetric = (
    field: keyof typeof selectedCompanyAnalysis.comparison,
    value: string | number,
  ) => {
    persistSelectedCompanyAnalysis({
      ...selectedCompanyAnalysis,
      comparison: {
        ...selectedCompanyAnalysis.comparison,
        [field]:
          typeof value === "number"
            ? value
            : value,
      },
    });
  };

  const saveCompanyComparisonProfile = (
    companyId: number,
    comparison: typeof selectedCompanyAnalysis.comparison,
  ) => {
    const baseEntry =
      resolvedCompanyAnalysisEntries[companyId] ??
      buildDefaultCompanyAnalysisEntry(
        resolvedCompanyTargets.find((company) => company.id === companyId) ?? selectedCompany,
        companyDetails[companyId] ?? selectedCompanyDetail,
        offerCatalog,
      );

    setDashboardState((current) => ({
      ...current,
      companyAnalysis: {
        ...current.companyAnalysis,
        entries: {
          ...current.companyAnalysis.entries,
          [companyId]: {
            description: baseEntry.description,
            roleDescription: baseEntry.roleDescription,
            techStack: [...baseEntry.techStack],
            news: [...baseEntry.news],
            comparison: {
              ...comparison,
            },
          },
        },
      },
    }));
  };

  const setCompanyComparisonCompanyId = (companyId: number) => {
    setDashboardState((current) => ({
      ...current,
      companyAnalysis: {
        ...current.companyAnalysis,
        compareCompanyId: companyId,
      },
    }));
  };

  return {
    ...controller,
    companies: {
      ...controller.companies,
      selectedCompanyAnalysis,
      comparisonCompany,
      comparisonCompanyAnalysis,
      companyComparisonRows,
      companyCompareOptions: resolvedCompanyTargets
        .filter((company) => company.id !== selectedCompany.id)
        .map((company) => ({
          value: String(company.id),
          label: company.name,
        })),
      companyCompareId: comparisonCompany.id,
      setCompanyComparisonCompanyId,
      saveCompanyComparisonProfile,
      updateSelectedCompanyAnalysisField,
      updateSelectedCompanyAnalysisList,
      updateSelectedCompanyComparisonMetric,
    },
    offer: {
      ...controller.offer,
      offerCatalog: resolvedOfferCatalog,
    },
    coverLetters: {
      ...controller.coverLetters,
      companyOptions: coverLetterCompanyOptions,
      selectedCompanyId: selectedCompany.id,
      selectedCompanyName: selectedCompany.name,
      companyQuestionPresets,
      setSelectedCompanyId: actions.updateSelectedCompanyId,
      updateCompanyQuestionPreset,
      addCompanyQuestionPreset,
      removeCompanyQuestionPreset,
      applyCompanyQuestionPresetsToDraft,
    },
  };
}

export type DashboardController = ReturnType<typeof useDashboardController>;
