import type { DashboardLocalState } from "./dashboard-state-contracts.js";
import { DEFAULT_DASHBOARD_COVERLETTER_PRESETS } from "./dashboard-cover-letter-presets.js";
import {
  DEFAULT_DASHBOARD_JOB_POSTINGS,
  DEFAULT_DASHBOARD_SCHEDULE_ENTRIES,
} from "./dashboard-editable-data.js";
import {
  DEFAULT_INDUSTRY_KEYWORDS,
  sanitizeIndustryKeywords,
} from "./industry-news.js";

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

function isIndustryArticle(
  value: unknown,
): value is DashboardLocalState["industry"]["articles"][number] {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.source === "string" &&
    typeof value.date === "string" &&
    typeof value.publishedAt === "string" &&
    typeof value.tag === "string" &&
    Array.isArray(value.matchedKeywords) &&
    value.matchedKeywords.every((keyword) => typeof keyword === "string") &&
    typeof value.summary === "string" &&
    typeof value.url === "string"
  );
}

function isResumeExperienceId(value: unknown): value is number {
  return typeof value === "number";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isResumeEducationItem(
  value: unknown,
): value is DashboardLocalState["resume"]["education"][number] {
  return (
    isRecord(value) &&
    typeof value.school === "string" &&
    typeof value.degree === "string" &&
    typeof value.major === "string" &&
    typeof value.gpa === "string" &&
    typeof value.period === "string" &&
    typeof value.statusLabel === "string"
  );
}

function isResumeCertificateItem(
  value: unknown,
): value is DashboardLocalState["resume"]["certificates"][number] {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.issuer === "string" &&
    typeof value.date === "string"
  );
}

function isResumeLanguageItem(
  value: unknown,
): value is DashboardLocalState["resume"]["languages"][number] {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.detail === "string" &&
    typeof value.levelLabel === "string"
  );
}

function isResumeSkillSpecItem(
  value: unknown,
): value is DashboardLocalState["resume"]["skillSpecs"][number] {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.track === "string" &&
    (value.levelLabel === "상" || value.levelLabel === "중" || value.levelLabel === "하")
  );
}

function isResumeAwardItem(
  value: unknown,
): value is DashboardLocalState["resume"]["awards"][number] {
  return isRecord(value) && typeof value.title === "string" && typeof value.issuer === "string";
}

function isResumePaperItem(
  value: unknown,
): value is DashboardLocalState["resume"]["papers"][number] {
  return isRecord(value) && typeof value.title === "string";
}

function isResumeExperienceItem(
  value: unknown,
): value is DashboardLocalState["resume"]["experiences"][number] {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    ["project", "internship", "activity", "contest", "research"].includes(
      String(value.category),
    ) &&
    typeof value.organization === "string" &&
    typeof value.period === "string" &&
    typeof value.role === "string" &&
    typeof value.teamLabel === "string" &&
    typeof value.featured === "boolean" &&
    isStringArray(value.tags) &&
    typeof value.overview === "string" &&
    typeof value.outcome === "string" &&
    typeof value.learning === "string" &&
    typeof value.rawBullet === "string" &&
    typeof value.improvedBullet === "string" &&
    typeof value.bulletReason === "string" &&
    isStringArray(value.keywords)
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
      portfolioSubTab: "experience",
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
    industry: {
      keywords: [...DEFAULT_INDUSTRY_KEYWORDS],
      articles: [],
      lastCrawledAt: null,
      periodDays: 30,
    },
    resume: {
      version: 0,
      title: "반도체 직무 지원 이력서",
      targetRole: "",
      summary: "경험 허브에서 선택한 경험을 기반으로 정량 성과 중심의 이력서를 구성합니다.",
      userName: "",
      email: "",
      selectedExperienceIds: [1, 2, 3],
      education: [],
      certificates: [],
      languages: [],
      skillSpecs: [],
      awards: [],
      papers: [],
      experiences: [],
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
  const industry = mergeSection(defaults.industry, payload.industry);
  const resume = mergeSection(defaults.resume, payload.resume);
  const companyAnalysis = mergeSection(defaults.companyAnalysis, payload.companyAnalysis);
  const coverLetters = mergeSection(defaults.coverLetters, payload.coverLetters);

  return {
    ui: {
      ...ui,
      industryFilter:
        typeof ui.industryFilter === "string"
          ? ui.industryFilter === "All"
            ? ALL_INDUSTRY_TAG
            : ui.industryFilter
          : defaults.ui.industryFilter,
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
    industry: {
      keywords: Array.isArray(industry.keywords)
        ? sanitizeIndustryKeywords(
            industry.keywords.filter((keyword): keyword is string => typeof keyword === "string"),
          )
        : defaults.industry.keywords,
      articles: Array.isArray(industry.articles)
        ? industry.articles.filter(isIndustryArticle)
        : defaults.industry.articles,
      lastCrawledAt:
        typeof industry.lastCrawledAt === "string" || industry.lastCrawledAt === null
          ? industry.lastCrawledAt
          : defaults.industry.lastCrawledAt,
      periodDays:
        typeof industry.periodDays === "number" && Number.isFinite(industry.periodDays) && industry.periodDays > 0
          ? industry.periodDays
          : defaults.industry.periodDays,
    },
    resume: {
      version: typeof resume.version === "number" ? resume.version : defaults.resume.version,
      title: typeof resume.title === "string" ? resume.title : defaults.resume.title,
      targetRole:
        typeof resume.targetRole === "string" ? resume.targetRole : defaults.resume.targetRole,
      summary: typeof resume.summary === "string" ? resume.summary : defaults.resume.summary,
      userName: typeof resume.userName === "string" ? resume.userName : defaults.resume.userName,
      email: typeof resume.email === "string" ? resume.email : defaults.resume.email,
      selectedExperienceIds: Array.isArray(resume.selectedExperienceIds)
        ? resume.selectedExperienceIds.filter(isResumeExperienceId)
        : defaults.resume.selectedExperienceIds,
      education: Array.isArray(resume.education)
        ? resume.education.filter(isResumeEducationItem)
        : defaults.resume.education,
      certificates: Array.isArray(resume.certificates)
        ? resume.certificates.filter(isResumeCertificateItem)
        : defaults.resume.certificates,
      languages: Array.isArray(resume.languages)
        ? resume.languages.filter(isResumeLanguageItem)
        : defaults.resume.languages,
      skillSpecs: Array.isArray(resume.skillSpecs)
        ? resume.skillSpecs.filter(isResumeSkillSpecItem)
        : defaults.resume.skillSpecs,
      awards: Array.isArray(resume.awards)
        ? resume.awards.filter(isResumeAwardItem)
        : defaults.resume.awards,
      papers: Array.isArray(resume.papers)
        ? resume.papers.filter(isResumePaperItem)
        : defaults.resume.papers,
      experiences: Array.isArray(resume.experiences)
        ? resume.experiences.filter(isResumeExperienceItem)
        : defaults.resume.experiences,
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
