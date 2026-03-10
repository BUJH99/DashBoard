import type { DashboardLocalState } from "./dashboard-state-contracts.js";
import { DEFAULT_DASHBOARD_COVERLETTER_PRESETS } from "./dashboard-cover-letter-presets.js";
import {
  DEFAULT_DASHBOARD_JOB_POSTINGS,
  DEFAULT_DASHBOARD_SCHEDULE_ENTRIES,
} from "./dashboard-editable-data.js";

type UnknownRecord = Record<string, unknown>;

export const ALL_INDUSTRY_TAG = "전체";

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeSection<T extends UnknownRecord>(defaults: T, value: unknown): T {
  if (!isRecord(value)) {
    return { ...defaults };
  }

  return {
    ...defaults,
    ...value,
  } as T;
}

function isScheduleEntry(value: unknown): value is DashboardLocalState["calendar"]["scheduleEntries"][number] {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.date === "number" &&
    typeof value.title === "string" &&
    typeof value.type === "string" &&
    typeof value.time === "string" &&
    typeof value.company === "string"
  );
}

function isPostingEntry(value: unknown): value is DashboardLocalState["postings"]["entries"][number] {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.targetCompanyId === "number" &&
    typeof value.company === "string" &&
    typeof value.title === "string" &&
    typeof value.role === "string" &&
    typeof value.deadline === "string" &&
    typeof value.stage === "string" &&
    typeof value.fit === "number" &&
    typeof value.burden === "number" &&
    typeof value.urgency === "number" &&
    typeof value.locationFit === "number" &&
    typeof value.growth === "number" &&
    typeof value.selfIntroReady === "number" &&
    Array.isArray(value.keywords) &&
    value.keywords.every((keyword) => typeof keyword === "string") &&
    typeof value.summary === "string"
  );
}

function isCompanyAnalysisComparisonProfile(
  value: unknown,
): value is DashboardLocalState["companyAnalysis"]["entries"][number]["comparison"] {
  return (
    isRecord(value) &&
    typeof value.salary === "number" &&
    typeof value.growth === "number" &&
    typeof value.wlb === "number" &&
    typeof value.location === "number" &&
    typeof value.culture === "number" &&
    typeof value.base === "string" &&
    typeof value.bonus === "string"
  );
}

function isCompanyAnalysisEntry(
  value: unknown,
): value is DashboardLocalState["companyAnalysis"]["entries"][number] {
  return (
    isRecord(value) &&
    typeof value.description === "string" &&
    typeof value.roleDescription === "string" &&
    Array.isArray(value.techStack) &&
    value.techStack.every((item) => typeof item === "string") &&
    Array.isArray(value.news) &&
    value.news.every((item) => typeof item === "string") &&
    isCompanyAnalysisComparisonProfile(value.comparison)
  );
}

export function buildDefaultDashboardState(): DashboardLocalState {
  return {
    ui: {
      activeTab: "overview",
      userName: "지원자",
      postingQuery: "",
      postingCompanyFilter: "all",
      selectedCompanyId: 1,
      selectedOfferA: "samsung-ds",
      selectedOfferB: "telechips",
      portfolioSubTab: "showcase",
      selectedChecklistPostingId: 101,
      selectedEssayId: 301,
      industryFilter: ALL_INDUSTRY_TAG,
      flashcardMode: "default",
      activeFlashcardIndex: 0,
      selectedScheduleId: 1,
      selectedJobPostingId: 101,
      selectedCoverLetterName: null,
    },
    calendar: {
      scheduleEntries: DEFAULT_DASHBOARD_SCHEDULE_ENTRIES.map((entry) => ({ ...entry })),
    },
    postings: {
      entries: DEFAULT_DASHBOARD_JOB_POSTINGS.map((entry) => ({
        ...entry,
        keywords: [...entry.keywords],
      })),
    },
    location: {
      routeOrigin: "수원역",
      routeDestination: "삼성전자 DS",
      companyCommuteNotes: {},
    },
    checklists: {
      applicationChecklists: {},
    },
    interview: {
      flashcardFeedback: {},
    },
    jdScanner: {
      text: "Verilog, SystemVerilog, UVM, AXI, CDC, STA, FPGA 경험 보유",
    },
    overview: {
      query: "",
      companyFilter: "all",
      taskChecked: {},
    },
    companyAnalysis: {
      compareCompanyId: 2,
      entries: {},
    },
    coverLetters: {
      questionPresets: Object.fromEntries(
        Object.entries(DEFAULT_DASHBOARD_COVERLETTER_PRESETS).map(([companyId, prompts]) => [
          Number(companyId),
          [...prompts],
        ]),
      ),
    },
  };
}

export function hydrateDashboardState(payload: unknown): DashboardLocalState {
  const defaults = buildDefaultDashboardState();
  if (!isRecord(payload)) {
    return defaults;
  }

  const ui = mergeSection(defaults.ui, payload.ui);
  const calendar = mergeSection(defaults.calendar, payload.calendar);
  const postings = mergeSection(defaults.postings, payload.postings);
  const location = mergeSection(defaults.location, payload.location);
  const checklists = mergeSection(defaults.checklists, payload.checklists);
  const interview = mergeSection(defaults.interview, payload.interview);
  const jdScanner = mergeSection(defaults.jdScanner, payload.jdScanner);
  const overview = mergeSection(defaults.overview, payload.overview);
  const companyAnalysis = mergeSection(defaults.companyAnalysis, payload.companyAnalysis);
  const coverLetters = mergeSection(defaults.coverLetters, payload.coverLetters);

  return {
    ui: {
      ...ui,
      userName: typeof ui.userName === "string" ? ui.userName : defaults.ui.userName,
      activeFlashcardIndex:
        typeof ui.activeFlashcardIndex === "number" || ui.activeFlashcardIndex === null
          ? ui.activeFlashcardIndex
          : defaults.ui.activeFlashcardIndex,
      selectedJobPostingId:
        typeof ui.selectedJobPostingId === "number"
          ? ui.selectedJobPostingId
          : defaults.ui.selectedJobPostingId,
      selectedCoverLetterName:
        typeof ui.selectedCoverLetterName === "string" || ui.selectedCoverLetterName === null
          ? ui.selectedCoverLetterName
          : defaults.ui.selectedCoverLetterName,
    },
    calendar: {
      scheduleEntries: Array.isArray(calendar.scheduleEntries)
        ? calendar.scheduleEntries.filter(isScheduleEntry)
        : defaults.calendar.scheduleEntries,
    },
    postings: {
      entries: Array.isArray(postings.entries)
        ? postings.entries.filter(isPostingEntry)
        : defaults.postings.entries,
    },
    location: {
      ...location,
      companyCommuteNotes: isRecord(location.companyCommuteNotes)
        ? (location.companyCommuteNotes as DashboardLocalState["location"]["companyCommuteNotes"])
        : defaults.location.companyCommuteNotes,
    },
    checklists: {
      ...checklists,
      applicationChecklists: isRecord(checklists.applicationChecklists)
        ? (checklists.applicationChecklists as DashboardLocalState["checklists"]["applicationChecklists"])
        : defaults.checklists.applicationChecklists,
    },
    interview: {
      ...interview,
      flashcardFeedback: isRecord(interview.flashcardFeedback)
        ? (interview.flashcardFeedback as DashboardLocalState["interview"]["flashcardFeedback"])
        : defaults.interview.flashcardFeedback,
    },
    jdScanner,
    overview: {
      ...overview,
      query: typeof overview.query === "string" ? overview.query : defaults.overview.query,
      companyFilter:
        typeof overview.companyFilter === "string"
          ? overview.companyFilter
          : defaults.overview.companyFilter,
      taskChecked: isRecord(overview.taskChecked)
        ? (overview.taskChecked as DashboardLocalState["overview"]["taskChecked"])
        : defaults.overview.taskChecked,
    },
    companyAnalysis: {
      ...companyAnalysis,
      compareCompanyId:
        typeof companyAnalysis.compareCompanyId === "number"
          ? companyAnalysis.compareCompanyId
          : defaults.companyAnalysis.compareCompanyId,
      entries: isRecord(companyAnalysis.entries)
        ? Object.fromEntries(
            Object.entries(companyAnalysis.entries)
              .map(([companyId, entry]) => [Number(companyId), entry] as const)
              .filter(([, entry]) => isCompanyAnalysisEntry(entry)),
          )
        : defaults.companyAnalysis.entries,
    },
    coverLetters: {
      ...coverLetters,
      questionPresets: isRecord(coverLetters.questionPresets)
        ? Object.fromEntries(
            Object.entries(coverLetters.questionPresets).map(([companyId, prompts]) => [
              Number(companyId),
              Array.isArray(prompts)
                ? prompts.filter((prompt): prompt is string => typeof prompt === "string")
                : [],
            ]),
          )
        : defaults.coverLetters.questionPresets,
    },
  };
}
