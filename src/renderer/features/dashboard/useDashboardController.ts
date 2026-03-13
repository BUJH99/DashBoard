import { useEffect, useMemo, useState } from "react";
import { ALL_INDUSTRY_TAG, buildDefaultDashboardState } from "../../../../shared/dashboard-state";
import type { DashboardLocalState } from "../../../../shared/dashboard-state-contracts";
import { sanitizeIndustryKeywords } from "../../../../shared/industry-news";
import { normalizeKeyword } from "../../../../shared/keywordNormalization";
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
import { jdKeywordLibrary } from "./domain/seeds/jdSeed";
import {
  commuteNotesSeed,
  originPresets,
} from "./domain/seeds/locationSeed";
import { offerCatalog } from "./domain/seeds/offerSeed";
import { portfolioData } from "./domain/seeds/portfolioSeed";
import {
  capitalAreaStationPresets,
  capitalAreaSubwayLines,
} from "../location/data/capitalAreaSubwayLines";
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
import { buildDashboardStateMessage, buildIndustryTags } from "./controller/dashboardMessages";
import {
  buildDashboardCompanySnapshot,
  buildDashboardSelectionState,
} from "./controller/dashboardSelectionState";
import { buildDashboardViewModel } from "./controller/dashboardViewModel";
import { useDashboardDerivedCollections } from "./hooks/useDashboardDerivedCollections";
import { useDashboardStateSynchronization } from "./hooks/useDashboardStateSynchronization";
import { usePersistedDashboardState } from "./hooks/usePersistedDashboardState";
import { useSelectedCompanyModel } from "./hooks/useSelectedCompanyModel";
import { openExternalTarget, openExternalUrl } from "../../services/desktop/externalService";
import { crawlIndustryNews as crawlIndustryNewsService } from "../../services/desktop/industryNewsService";

const FALLBACK_OFFER_A = offerCatalog[0]?.id ?? "";
const FALLBACK_OFFER_B = offerCatalog[1]?.id ?? FALLBACK_OFFER_A;
const RESUME_BASELINE_SCORE = 62;
const RESUME_DRAFT_VERSION = 1;

const RESUME_EXPERIENCE_SECTION_LABELS: Record<
  DashboardLocalState["resume"]["experiences"][number]["category"],
  string
> = {
  internship: "경력 / 인턴",
  project: "프로젝트",
  activity: "대외활동",
  contest: "수상 / 공모전",
  research: "연구 / 논문",
};

type ResumeScalarFieldKey = "title" | "targetRole" | "summary" | "userName" | "email";
type ResumeCollectionKey =
  | "education"
  | "certificates"
  | "languages"
  | "skillSpecs"
  | "awards"
  | "papers";
type PortfolioCollectionKey =
  | "coursework"
  | "projects"
  | "studyProjects"
  | "studyNotes";
type PortfolioCollectionValue<Key extends PortfolioCollectionKey> =
  DashboardLocalState["portfolio"][Key][number];

function cloneResumeExperience(
  item: DashboardLocalState["resume"]["experiences"][number],
): DashboardLocalState["resume"]["experiences"][number] {
  return {
    ...item,
    tags: [...item.tags],
    keywords: [...item.keywords],
  };
}

function normalizeListInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function createEmptyResumeCollectionItem(collection: ResumeCollectionKey) {
  switch (collection) {
    case "education":
      return {
        school: "",
        degree: "",
        major: "",
        gpa: "",
        period: "",
        statusLabel: "",
      };
    case "certificates":
      return {
        name: "",
        issuer: "",
        date: "",
      };
    case "languages":
      return {
        name: "",
        detail: "",
        levelLabel: "",
      };
    case "skillSpecs":
      return {
        name: "",
        track: "",
        levelLabel: "중" as const,
      };
    case "awards":
      return {
        title: "",
        issuer: "",
      };
    case "papers":
      return {
        title: "",
      };
  }
}

function createEmptyResumeExperience(
  nextId: number,
): DashboardLocalState["resume"]["experiences"][number] {
  return {
    id: nextId,
    title: "",
    category: "project",
    organization: "",
    period: "",
    role: "",
    teamLabel: "",
    featured: false,
    tags: [],
    overview: "",
    outcome: "",
    learning: "",
    rawBullet: "",
    improvedBullet: "",
    bulletReason: "",
    keywords: [],
  };
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clonePortfolioProject(
  item: DashboardLocalState["portfolio"]["projects"][number],
): DashboardLocalState["portfolio"]["projects"][number] {
  return {
    ...item,
    tech: [...item.tech],
  };
}

function clonePortfolioCoursework(
  item: DashboardLocalState["portfolio"]["coursework"][number],
): DashboardLocalState["portfolio"]["coursework"][number] {
  return {
    ...item,
    tags: [...item.tags],
  };
}

function createEmptyPortfolioCollectionItem<Key extends PortfolioCollectionKey>(
  collection: Key,
  nextId: number,
): PortfolioCollectionValue<Key> {
  switch (collection) {
    case "projects":
      return {
        id: nextId,
        name: "",
        date: "",
        role: "",
        tech: [],
        impact: "",
        link: "",
        browserLink: "",
        documentLink: "",
      } as PortfolioCollectionValue<Key>;
    case "coursework":
      return {
        id: nextId,
        semester: "",
        name: "",
        grade: "",
        relevance: 70,
        tags: [],
      } as PortfolioCollectionValue<Key>;
    case "studyProjects":
      return {
        id: nextId,
        name: "",
        tech: "",
        progress: 0,
        status: "",
        next: "",
        link: "",
        browserLink: "",
        documentLink: "",
      } as PortfolioCollectionValue<Key>;
    case "studyNotes":
      return {
        id: nextId,
        title: "",
        date: "",
        category: "",
        preview: "",
        link: "",
        browserLink: "",
        documentLink: "",
      } as PortfolioCollectionValue<Key>;
  }
}

function getResolvedPortfolioCollection<Key extends PortfolioCollectionKey>(
  portfolioState: DashboardLocalState["portfolio"],
  collection: Key,
): DashboardLocalState["portfolio"][Key] {
  const storedCollection = portfolioState[collection];
  if (portfolioState.initialized) {
    return storedCollection;
  }

  switch (collection) {
    case "projects":
      return portfolioData.projects.map((item) => ({
        ...item,
        tech: [...item.tech],
      })) as DashboardLocalState["portfolio"][Key];
    case "coursework":
      return portfolioData.coursework.map((item) => ({
        ...item,
        tags: [...item.tags],
      })) as DashboardLocalState["portfolio"][Key];
    case "studyProjects":
      return portfolioData.studyProjects.map((item) => ({ ...item })) as DashboardLocalState["portfolio"][Key];
    case "studyNotes":
      return portfolioData.studyNotes.map((item) => ({ ...item })) as DashboardLocalState["portfolio"][Key];
  }
}

function buildResumeDraft(
  currentResume: DashboardLocalState["resume"],
  fallbackUserName: string,
): DashboardLocalState["resume"] {
  return {
    version: RESUME_DRAFT_VERSION,
    title: currentResume.title,
    targetRole: currentResume.targetRole,
    summary: currentResume.summary,
    userName:
      currentResume.userName.trim().length > 0
        ? currentResume.userName
        : fallbackUserName.trim().length > 0
          ? fallbackUserName
          : portfolioData.profile.name,
    email:
      currentResume.email.trim().length > 0
        ? currentResume.email
        : portfolioData.resumeProfile.email,
    selectedExperienceIds:
      currentResume.selectedExperienceIds.length > 0
        ? [...currentResume.selectedExperienceIds]
        : [1, 2, 3],
    education:
      currentResume.education.length > 0
        ? currentResume.education.map((item) => ({ ...item }))
        : portfolioData.resumeProfile.education.map((item) => ({
            school: item.school,
            degree: item.degree,
            major: item.major,
            gpa: item.gpa,
            period: item.period,
            statusLabel: item.statusLabel ?? "",
          })),
    certificates:
      currentResume.certificates.length > 0
        ? currentResume.certificates.map((item) => ({ ...item }))
        : portfolioData.resumeProfile.certificates.map((item) => ({ ...item })),
    languages:
      currentResume.languages.length > 0
        ? currentResume.languages.map((item) => ({ ...item }))
        : portfolioData.resumeProfile.languages.map((item) => ({
            name: item.name,
            detail: item.detail,
            levelLabel: item.levelLabel ?? "",
          })),
    skillSpecs:
      currentResume.skillSpecs.length > 0
        ? currentResume.skillSpecs.map((item) => ({ ...item }))
        : portfolioData.resumeProfile.skillSpecs.map((item) => ({ ...item })),
    awards:
      currentResume.awards.length > 0
        ? currentResume.awards.map((item) => ({ ...item }))
        : portfolioData.resumeProfile.awards.map((item) => ({ ...item })),
    papers:
      currentResume.papers.length > 0
        ? currentResume.papers.map((item) => ({ ...item }))
        : portfolioData.resumeProfile.papers.map((item) => ({ ...item })),
    experiences:
      currentResume.experiences.length > 0
        ? currentResume.experiences.map((item) => cloneResumeExperience(item))
        : portfolioData.experienceHub.map((item) => cloneResumeExperience(item)),
  };
}

export function useDashboardController() {
  const [dashboardState, setDashboardState] = useState(buildDefaultDashboardState);
  const [isIndustryKeywordEditorOpen, setIsIndustryKeywordEditorOpen] = useState(false);
  const [industryCrawlState, setIndustryCrawlState] = useState<{
    phase: "idle" | "loading" | "error";
    message: string | null;
    warnings: string[];
  }>({
    phase: "idle",
    message: null,
    warnings: [],
  });
  const [companyNewsAutofillState, setCompanyNewsAutofillState] = useState<{
    phase: "idle" | "loading" | "error" | "done";
    companyId: number | null;
    message: string | null;
  }>({
    phase: "idle",
    companyId: null,
    message: null,
  });
  const setUiState = useMemo(() => createSetUiState(setDashboardState), []);
  const scheduleEntries = dashboardState.calendar.scheduleEntries;
  const resolvedPortfolioData = useMemo(
    () => ({
      ...portfolioData,
      learningSkills:
        dashboardState.portfolio.initialized
          ? dashboardState.portfolio.learningSkills.map((item) => ({ ...item }))
          : portfolioData.learningSkills.map((item) => ({ ...item })),
      coursework:
        dashboardState.portfolio.initialized
          ? dashboardState.portfolio.coursework.map((item) => clonePortfolioCoursework(item))
          : portfolioData.coursework.map((item) => ({ ...item, tags: [...item.tags] })),
      studyProjects:
        dashboardState.portfolio.initialized
          ? dashboardState.portfolio.studyProjects.map((item) => ({ ...item }))
          : portfolioData.studyProjects.map((item) => ({ ...item })),
      studyNotes:
        dashboardState.portfolio.initialized
          ? dashboardState.portfolio.studyNotes.map((item) => ({ ...item }))
          : portfolioData.studyNotes.map((item) => ({ ...item })),
      projects:
        dashboardState.portfolio.initialized
          ? dashboardState.portfolio.projects.map((item) => clonePortfolioProject(item))
          : portfolioData.projects.map((item) => ({ ...item, tech: [...item.tech] })),
    }),
    [dashboardState.portfolio],
  );
  const sanitizedIndustryKeywords = useMemo(
    () => sanitizeIndustryKeywords(dashboardState.industry.keywords),
    [dashboardState.industry.keywords],
  );
  const availableIndustryTags = useMemo(
    () => buildIndustryTags(dashboardState.industry.articles, sanitizedIndustryKeywords),
    [dashboardState.industry.articles, sanitizedIndustryKeywords],
  );

  useEffect(() => {
    if (
      dashboardState.ui.industryFilter === ALL_INDUSTRY_TAG ||
      availableIndustryTags.includes(dashboardState.ui.industryFilter)
    ) {
      return;
    }

    setUiState("industryFilter", ALL_INDUSTRY_TAG);
  }, [availableIndustryTags, dashboardState.ui.industryFilter, setUiState]);

  useEffect(() => {
    if (dashboardState.resume.version >= RESUME_DRAFT_VERSION) {
      return;
    }

    setDashboardState((current) => ({
      ...current,
      resume: buildResumeDraft(current.resume, current.ui.userName),
    }));
  }, [dashboardState.resume.version]);

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
  const selectedCompanyAutoNewsKeywords = useMemo(
    () =>
      sanitizeIndustryKeywords([
        ...selectedCompanyAnalysis.techStack,
        ...dashboardState.industry.keywords.filter((keyword) =>
          selectedCompanyAnalysis.techStack.some((tech) => {
            const normalizedKeyword = normalizeKeyword(keyword);
            const normalizedTech = normalizeKeyword(tech);

            return (
              normalizedKeyword.length > 0 &&
              (normalizedTech.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedTech))
            );
          }),
        ),
      ]).slice(0, 6),
    [dashboardState.industry.keywords, selectedCompanyAnalysis.techStack],
  );

  useEffect(() => {
    setCompanyNewsAutofillState({
      phase: "idle",
      companyId: null,
      message: null,
    });
  }, [selectedCompany.id]);

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
    schedule: scheduleEntries,
    portfolioData: resolvedPortfolioData,
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
        originPresets: [...originPresets, ...capitalAreaStationPresets],
      }),
    [dashboardState, flashcardDeck, postings, resolvedOfferCatalog, scheduleEntries, selectedCompany],
  );

  const checklistItems = getChecklistItems(
    dashboardState.checklists.applicationChecklists,
    checklistTemplates,
    selectedChecklistPosting.id,
  );
  const dashboardStateMessage = buildDashboardStateMessage(dashboardStateSync);
  const resumeExperienceIdSet = useMemo(
    () => new Set(dashboardState.resume.selectedExperienceIds),
    [dashboardState.resume.selectedExperienceIds],
  );
  const selectedResumeExperiences = useMemo(
    () =>
      dashboardState.resume.experiences.filter((item) =>
        resumeExperienceIdSet.has(item.id),
      ),
    [dashboardState.resume.experiences, resumeExperienceIdSet],
  );
  const resolvedResumeTitle =
    dashboardState.resume.version >= RESUME_DRAFT_VERSION
      ? dashboardState.resume.title
      : dashboardState.resume.title.trim().length > 0
        ? dashboardState.resume.title
        : `${selectedCompany.name} ${selectedCompanyPosting.title} 지원 이력서`;
  const resolvedResumeTargetRole =
    dashboardState.resume.version >= RESUME_DRAFT_VERSION
      ? dashboardState.resume.targetRole
      : dashboardState.resume.targetRole.trim().length > 0
        ? dashboardState.resume.targetRole
        : `${selectedCompany.name} ${selectedCompanyPosting.title} 지원`;
  const resolvedResumeSummary =
    dashboardState.resume.version >= RESUME_DRAFT_VERSION
      ? dashboardState.resume.summary
      : dashboardState.resume.summary.trim().length > 0
        ? dashboardState.resume.summary
        : `${selectedCompanyPosting.title} 포지션 기준으로 공정·데이터·협업 경험을 정량 성과 중심으로 연결한 이력서입니다.`;
  const resolvedResumeUserName =
    dashboardState.resume.version >= RESUME_DRAFT_VERSION
      ? dashboardState.resume.userName
      : dashboardState.ui.userName.trim().length > 0
        ? dashboardState.ui.userName
        : portfolioData.profile.name;
  const resolvedResumeEmail =
    dashboardState.resume.version >= RESUME_DRAFT_VERSION
      ? dashboardState.resume.email
      : portfolioData.resumeProfile.email;
  const matchedResumeKeywords = useMemo(() => {
    const experienceHaystacks = selectedResumeExperiences.map((experience) =>
      normalizeKeyword(
        [
          experience.title,
          experience.organization,
          experience.role,
          experience.overview,
          experience.outcome,
          experience.learning,
          experience.improvedBullet,
          experience.tags.join(" "),
          experience.keywords.join(" "),
        ].join(" "),
      ),
    );

    return selectedCompanyPosting.keywords.filter((keyword) => {
      const normalized = normalizeKeyword(keyword);

      return experienceHaystacks.some((haystack) => haystack.includes(normalized));
    });
  }, [selectedCompanyPosting.keywords, selectedResumeExperiences]);
  const missingResumeKeywords = useMemo(
    () =>
      selectedCompanyPosting.keywords.filter(
        (keyword) => !matchedResumeKeywords.includes(keyword),
      ),
    [matchedResumeKeywords, selectedCompanyPosting.keywords],
  );
  const quantifiedExperienceCount = useMemo(
    () =>
      selectedResumeExperiences.filter((item) => /\d/.test(`${item.outcome} ${item.improvedBullet}`)).length,
    [selectedResumeExperiences],
  );
  const uniqueResumeCategories = useMemo(
    () => new Set(selectedResumeExperiences.map((item) => item.category)).size,
    [selectedResumeExperiences],
  );
  const resumeKeywordCoverage =
    selectedCompanyPosting.keywords.length > 0
      ? Math.round((matchedResumeKeywords.length / selectedCompanyPosting.keywords.length) * 100)
      : 100;
  const resumeRecommendations = useMemo(() => {
    const items: string[] = [];

    if (missingResumeKeywords.length > 0) {
      items.push(
        `${missingResumeKeywords[0]} 키워드는 아직 bullet에 직접 드러나지 않습니다. 선택한 경험의 개선 문장에 해당 키워드를 더 명시적으로 넣는 편이 좋습니다.`,
      );
    }

    if (selectedResumeExperiences.length < 3) {
      items.push("경험 3개 이상을 고르면 이력서가 한 가지 성격으로 치우치지 않고, 성장성과 협업 경험을 함께 보여주기 좋습니다.");
    }

    if (quantifiedExperienceCount < selectedResumeExperiences.length) {
      items.push("수치가 빠진 경험은 시간 절감, 개선율, 운영 규모 같은 정량 표현을 추가하면 평가 안정성이 올라갑니다.");
    }

    if (items.length === 0) {
      items.push("핵심 경험과 키워드 정렬 상태가 좋아서, 현재 버전은 지원 직무에 맞는 정량 중심 이력서로 읽힙니다.");
    }

    return items;
  }, [missingResumeKeywords, quantifiedExperienceCount, selectedResumeExperiences.length]);
  const resumeExperienceSections = useMemo(() => {
    const orderedCategories: DashboardLocalState["resume"]["experiences"][number]["category"][] = [
      "internship",
      "project",
      "activity",
      "contest",
      "research",
    ];

    return orderedCategories
      .map((category) => ({
        id: category,
        label: RESUME_EXPERIENCE_SECTION_LABELS[category],
        items: selectedResumeExperiences.filter((item) => item.category === category),
      }))
      .filter((section) => section.items.length > 0);
  }, [selectedResumeExperiences]);
  const resumeSkillHighlights = useMemo(() => {
    const values = new Set<string>();

    dashboardState.resume.skillSpecs.forEach((skill) => {
      if (skill.name.trim().length > 0) {
        values.add(skill.name.trim());
      }
    });
    selectedResumeExperiences.forEach((experience) => {
      experience.tags.slice(0, 3).forEach((tag) => values.add(tag));
    });

    return [...values].slice(0, 10);
  }, [dashboardState.resume.skillSpecs, selectedResumeExperiences]);
  const resumeSpecSections = useMemo(() => {
    const careerItems = dashboardState.resume.experiences.filter((item) => item.category === "internship");
    const activityItems = dashboardState.resume.experiences.filter(
      (item) => item.category === "activity" || item.category === "contest",
    );

    return [
      {
        id: "education",
        label: "학력",
        count: dashboardState.resume.education.length,
        items: dashboardState.resume.education.map((item) => ({
          title: item.school,
          subtitle: `${item.degree} · ${item.major}`,
          detail: item.gpa,
          meta: item.period,
          badge: item.statusLabel ?? null,
        })),
      },
      {
        id: "languages",
        label: "어학",
        count: dashboardState.resume.languages.length,
        items: dashboardState.resume.languages.map((item) => ({
          title: item.name,
          subtitle: item.detail,
          detail: "",
          meta: item.levelLabel ?? "",
          badge: item.levelLabel ?? null,
        })),
      },
      {
        id: "certificates",
        label: "자격증",
        count: dashboardState.resume.certificates.length,
        items: dashboardState.resume.certificates.map((item) => ({
          title: item.name,
          subtitle: item.issuer,
          detail: "",
          meta: item.date,
          badge: null,
        })),
      },
      {
        id: "skills",
        label: "기술 스택",
        count: dashboardState.resume.skillSpecs.length,
        items: dashboardState.resume.skillSpecs.map((item) => ({
          title: item.name,
          subtitle: item.track,
          detail: "",
          meta: item.levelLabel,
          badge: item.levelLabel,
        })),
      },
      {
        id: "career",
        label: "경력",
        count: careerItems.length,
        items: careerItems.map((item) => ({
          title: item.title,
          subtitle: item.organization,
          detail: item.role,
          meta: item.period,
          badge: null,
        })),
      },
      {
        id: "activities",
        label: "대외활동",
        count: activityItems.length,
        items: activityItems.map((item) => ({
          title: item.title,
          subtitle: item.organization,
          detail: item.role,
          meta: item.period,
          badge: null,
        })),
      },
      {
        id: "awards",
        label: "수상",
        count: dashboardState.resume.awards.length,
        items: dashboardState.resume.awards.map((item) => ({
          title: item.title,
          subtitle: item.issuer,
          detail: "",
          meta: "",
          badge: null,
        })),
      },
      {
        id: "papers",
        label: "논문",
        count: dashboardState.resume.papers.length,
        items: dashboardState.resume.papers.map((item) => ({
          title: item.title,
          subtitle: "",
          detail: "",
          meta: "",
          badge: null,
        })),
      },
    ];
  }, [
    dashboardState.resume.awards,
    dashboardState.resume.certificates,
    dashboardState.resume.education,
    dashboardState.resume.experiences,
    dashboardState.resume.languages,
    dashboardState.resume.papers,
    dashboardState.resume.skillSpecs,
  ]);
  const resumeSpecProgress = useMemo(() => {
    const completedSectionCount = resumeSpecSections.filter((section) => section.count > 0).length;

    return Math.round((completedSectionCount / resumeSpecSections.length) * 100);
  }, [resumeSpecSections]);
  const resumeSpecTotalCount = useMemo(
    () => resumeSpecSections.reduce((sum, section) => sum + section.count, 0),
    [resumeSpecSections],
  );
  const resumeScore = useMemo(() => {
    const keywordRatio =
      selectedCompanyPosting.keywords.length > 0
        ? matchedResumeKeywords.length / selectedCompanyPosting.keywords.length
        : 1;
    const quantifiedRatio =
      selectedResumeExperiences.length > 0
        ? quantifiedExperienceCount / selectedResumeExperiences.length
        : 0;
    const diversityRatio = Math.min(1, uniqueResumeCategories / 3);
    const specRatio = resumeSpecProgress / 100;

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(56 + keywordRatio * 22 + quantifiedRatio * 10 + diversityRatio * 6 + specRatio * 6),
      ),
    );
  }, [
    matchedResumeKeywords.length,
    quantifiedExperienceCount,
    resumeSpecProgress,
    selectedCompanyPosting.keywords.length,
    selectedResumeExperiences.length,
    uniqueResumeCategories,
  ]);

  const setJdScannerText = (text: string) => {
    setJdScan((current) => ({
      ...current,
      text,
      phase: current.phase === "result" ? "idle" : current.phase,
    }));
  };

  const updateResumeField = (field: ResumeScalarFieldKey, value: string) => {
    setDashboardState((current) => ({
      ...current,
      resume: {
        ...current.resume,
        [field]: value,
      },
    }));
  };

  const toggleResumeExperience = (experienceId: number) => {
    setDashboardState((current) => {
      const selectedIds = current.resume.selectedExperienceIds.includes(experienceId)
        ? current.resume.selectedExperienceIds.filter((id) => id !== experienceId)
        : [...current.resume.selectedExperienceIds, experienceId];

      return {
        ...current,
        resume: {
          ...current.resume,
          selectedExperienceIds: selectedIds,
        },
      };
    });
  };

  const addResumeCollectionItem = (collection: ResumeCollectionKey) => {
    setDashboardState((current) => ({
      ...current,
      resume: {
        ...current.resume,
        [collection]: [
          ...current.resume[collection],
          createEmptyResumeCollectionItem(collection),
        ],
      },
    }));
  };

  const updateResumeCollectionItem = (
    collection: ResumeCollectionKey,
    index: number,
    field: string,
    value: string,
  ) => {
    setDashboardState((current) => ({
      ...current,
      resume: {
        ...current.resume,
        [collection]: current.resume[collection].map((item, itemIndex) =>
          itemIndex === index
            ? ({
                ...item,
                [field]: value,
              } as (typeof current.resume)[typeof collection][number])
            : item,
        ),
      },
    }));
  };

  const removeResumeCollectionItem = (collection: ResumeCollectionKey, index: number) => {
    setDashboardState((current) => ({
      ...current,
      resume: {
        ...current.resume,
        [collection]: current.resume[collection].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  const addResumeExperience = () => {
    setDashboardState((current) => {
      const nextId =
        current.resume.experiences.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

      return {
        ...current,
        resume: {
          ...current.resume,
          experiences: [...current.resume.experiences, createEmptyResumeExperience(nextId)],
          selectedExperienceIds: current.resume.selectedExperienceIds.includes(nextId)
            ? current.resume.selectedExperienceIds
            : [...current.resume.selectedExperienceIds, nextId],
        },
      };
    });
  };

  const updateResumeExperienceField = (
    experienceId: number,
    field: string,
    value: string | boolean,
  ) => {
    setDashboardState((current) => ({
      ...current,
      resume: {
        ...current.resume,
        experiences: current.resume.experiences.map((item) => {
          if (item.id !== experienceId) {
            return item;
          }

          if (field === "tags" || field === "keywords") {
            return {
              ...item,
              [field]: normalizeListInput(String(value)),
            };
          }

          if (field === "featured") {
            return {
              ...item,
              featured: Boolean(value),
            };
          }

          return {
            ...item,
            [field]: value,
          };
        }),
      },
    }));
  };

  const removeResumeExperience = (experienceId: number) => {
    setDashboardState((current) => ({
      ...current,
      resume: {
        ...current.resume,
        experiences: current.resume.experiences.filter((item) => item.id !== experienceId),
        selectedExperienceIds: current.resume.selectedExperienceIds.filter((id) => id !== experienceId),
      },
    }));
  };

  const addPortfolioCollectionItem = (collection: PortfolioCollectionKey) => {
    setDashboardState((current) => {
      const currentItems = getResolvedPortfolioCollection(current.portfolio, collection);
      const nextId =
        currentItems.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

      return {
        ...current,
        portfolio: {
          ...current.portfolio,
          initialized: true,
          [collection]: [
            ...currentItems,
            createEmptyPortfolioCollectionItem(collection, nextId),
          ],
        },
      };
    });
  };

  const updatePortfolioCollectionItem = (
    collection: PortfolioCollectionKey,
    itemId: number,
    field: string,
    value: string | number,
  ) => {
    setDashboardState((current) => {
      const currentItems = getResolvedPortfolioCollection(current.portfolio, collection);

      return {
        ...current,
        portfolio: {
          ...current.portfolio,
          initialized: true,
          [collection]: currentItems.map((item) => {
            if (item.id !== itemId) {
              return item;
            }

            if ((collection === "projects" && field === "tech") || (collection === "coursework" && field === "tags")) {
              return {
                ...item,
                [field]: normalizeListInput(String(value)),
              };
            }

            if (
              (collection === "coursework" && field === "relevance") ||
              (collection === "studyProjects" && field === "progress")
            ) {
              return {
                ...item,
                [field]: clampPercent(Number(value)),
              };
            }

            return {
              ...item,
              [field]: value,
            };
          }),
        },
      };
    });
  };

  const removePortfolioCollectionItem = (collection: PortfolioCollectionKey, itemId: number) => {
    setDashboardState((current) => {
      const currentItems = getResolvedPortfolioCollection(current.portfolio, collection);

      return {
        ...current,
        portfolio: {
          ...current.portfolio,
          initialized: true,
          [collection]: currentItems.filter((item) => item.id !== itemId),
        },
      };
    });
  };

  const openPortfolioLink = async (target: string) => {
    await openExternalTarget(target);
  };

  const openResumeBuilder = () => {
    setUiState("activeTab", "resume");
  };

  const openExperienceHub = () => {
    setUiState("activeTab", "portfolio");
    setUiState("portfolioSubTab", "experience");
  };

  const openCoverLetterBuilder = () => {
    setUiState("activeTab", "coverletters");
  };

  const downloadResumePdf = () => {
    if (typeof window !== "undefined" && typeof window.print === "function") {
      window.print();
    }
  };

  const setHomeAddress = (value: string) =>
    setDashboardState((current) => ({
      ...current,
      location: {
        ...current.location,
        homeAddress: value,
      },
    }));

  const toggleIndustryKeywordEditor = () => {
    setIsIndustryKeywordEditorOpen((current) => !current);
  };

  const addIndustryKeyword = () => {
    setDashboardState((current) => ({
      ...current,
      industry: {
        ...current.industry,
        keywords: [...current.industry.keywords, ""],
      },
    }));
  };

  const updateIndustryKeyword = (index: number, value: string) => {
    setDashboardState((current) => {
      if (index < 0 || index >= current.industry.keywords.length) {
        return current;
      }

      return {
        ...current,
        industry: {
          ...current.industry,
          keywords: current.industry.keywords.map((keyword, keywordIndex) =>
            keywordIndex === index ? value : keyword,
          ),
        },
      };
    });
  };

  const removeIndustryKeyword = (index: number) => {
    setDashboardState((current) => {
      if (index < 0 || index >= current.industry.keywords.length) {
        return current;
      }

      return {
        ...current,
        industry: {
          ...current.industry,
          keywords: current.industry.keywords.filter((_, keywordIndex) => keywordIndex !== index),
        },
      };
    });
  };

  const updateIndustryPeriodDays = (value: number) => {
    setDashboardState((current) => ({
      ...current,
      industry: {
        ...current.industry,
        periodDays: value > 0 ? value : current.industry.periodDays,
      },
    }));
  };

  const openIndustryArticle = async (url: string) => {
    await openExternalUrl(url);
  };

  const crawlIndustryNews = async () => {
    const nextKeywords = sanitizeIndustryKeywords(dashboardState.industry.keywords);

    if (nextKeywords.length === 0) {
      setIndustryCrawlState({
        phase: "error",
        message: "크롤링할 키워드를 한 개 이상 입력해 주세요.",
        warnings: [],
      });
      return;
    }

    setIndustryCrawlState({
      phase: "loading",
      message: null,
      warnings: [],
    });

    try {
      const payload = await crawlIndustryNewsService({
        keywords: nextKeywords,
        periodDays: dashboardState.industry.periodDays,
      });
      const nextTags = buildIndustryTags(payload.articles, nextKeywords);

      setDashboardState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          industryFilter: nextTags.includes(current.ui.industryFilter)
            ? current.ui.industryFilter
            : ALL_INDUSTRY_TAG,
        },
        industry: {
          ...current.industry,
          keywords: [...nextKeywords],
          articles: payload.articles,
          lastCrawledAt: payload.fetchedAt,
        },
      }));
      setIndustryCrawlState({
        phase: "idle",
        message:
          payload.articles.length > 0
            ? `${dashboardState.industry.periodDays}일 기준 ${payload.articles.length}건의 기사를 불러왔습니다. 변경 사항은 저장 버튼으로 보존됩니다.`
            : `${dashboardState.industry.periodDays}일 기준 조건에 맞는 기사를 찾지 못했습니다. 변경 사항은 저장 버튼으로 보존됩니다.`,
        warnings: payload.warnings,
      });
    } catch (error) {
      setIndustryCrawlState({
        phase: "error",
        message:
          error instanceof Error ? error.message : "산업 뉴스 크롤링에 실패했습니다.",
        warnings: [],
      });
    }
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
    industryKeywords: dashboardState.industry.keywords,
    industryPeriodDays: dashboardState.industry.periodDays,
    industryLastCrawledAt: dashboardState.industry.lastCrawledAt,
    industryIsCrawling: industryCrawlState.phase === "loading",
    industryCrawlMessage: industryCrawlState.message,
    industryWarnings: industryCrawlState.warnings,
    industryIsKeywordEditorOpen: isIndustryKeywordEditorOpen,
    toggleIndustryKeywordEditor,
    addIndustryKeyword,
    updateIndustryKeyword,
    removeIndustryKeyword,
    updateIndustryPeriodDays,
    crawlIndustryNews,
    openIndustryArticle,
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
    allPostings: postings,
    checklistItems,
    checklistTemplates,
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

  const autofillSelectedCompanyNews = async () => {
    const tagKeywords = selectedCompanyAutoNewsKeywords;
    const crawlKeywords = sanitizeIndustryKeywords([selectedCompany.name, ...tagKeywords]).slice(0, 7);

    if (crawlKeywords.length === 0) {
      setCompanyNewsAutofillState({
        phase: "error",
        companyId: selectedCompany.id,
        message: "자동 뉴스 추가에 사용할 산업 태그가 없습니다.",
      });
      return;
    }

    setCompanyNewsAutofillState({
      phase: "loading",
      companyId: selectedCompany.id,
      message: null,
    });

    try {
      const payload = await crawlIndustryNewsService({
        keywords: crawlKeywords,
        periodDays: dashboardState.industry.periodDays,
      });
      const autoNewsItems = payload.articles.slice(0, 6).map((article) => {
        const meta = [article.source, article.date].filter(Boolean).join(" · ");
        return `[${article.tag}] ${article.title}${meta ? ` (${meta})` : ""}`;
      });
      const existingTitles = new Set(
        selectedCompanyAnalysis.news.map((item) => item.replace(/^\[[^\]]+\]\s*/, "").trim()),
      );
      const dedupedAutoNews = autoNewsItems.filter((item) => {
        const normalizedItem = item.replace(/^\[[^\]]+\]\s*/, "").trim();
        return !existingTitles.has(normalizedItem);
      });
      const nextNews = [...selectedCompanyAnalysis.news, ...dedupedAutoNews];

      persistSelectedCompanyAnalysis({
        ...selectedCompanyAnalysis,
        news: nextNews,
      });
      setCompanyNewsAutofillState({
        phase: "done",
        companyId: selectedCompany.id,
        message:
          dedupedAutoNews.length > 0
            ? `${dedupedAutoNews.length}개의 산업 동향 뉴스를 자동 추가했습니다.`
            : "추가할 새 산업 동향 뉴스가 없어 현재 목록을 유지했습니다.",
      });
    } catch (error) {
      setCompanyNewsAutofillState({
        phase: "error",
        companyId: selectedCompany.id,
        message:
          error instanceof Error
            ? error.message
            : "산업 동향 뉴스를 자동으로 추가하지 못했습니다.",
      });
    }
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
    location: {
      ...controller.location,
      homeAddress: dashboardState.location.homeAddress,
      setHomeAddress,
      capitalAreaSubwayLines,
    },
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
      selectedCompanyAutoNewsKeywords,
      companyNewsAutofillState,
      autofillSelectedCompanyNews,
      updateSelectedCompanyComparisonMetric,
    },
    offer: {
      ...controller.offer,
      offerCatalog: resolvedOfferCatalog,
    },
    portfolio: {
      ...controller.portfolio,
      data: resolvedPortfolioData,
      experienceHubItems: portfolioData.experienceHub,
      selectedResumeExperienceIds: dashboardState.resume.selectedExperienceIds,
      saveChanges: saveDashboardState,
      saveMessage: dashboardStateMessage,
      resumeReadyMessage:
        dashboardState.resume.selectedExperienceIds.length >= 3
          ? "경험이 충분히 정리되었습니다. 이제 자소서나 이력서를 작성해보세요."
          : "핵심 경험을 3개 이상 고르면 자소서와 이력서 초안이 더 안정적으로 구성됩니다.",
      addCollectionItem: addPortfolioCollectionItem,
      updateCollectionItem: updatePortfolioCollectionItem,
      removeCollectionItem: removePortfolioCollectionItem,
      openLink: openPortfolioLink,
      toggleResumeExperience,
      openResumeBuilder,
      openCoverLetterBuilder,
    },
    resume: {
      title: resolvedResumeTitle,
      targetRole: resolvedResumeTargetRole,
      summary: resolvedResumeSummary,
      userName: resolvedResumeUserName,
      email: resolvedResumeEmail,
      selectedCompanyName: selectedCompany.name,
      selectedPostingTitle: selectedCompanyPosting.title,
      selectedExperienceIds: dashboardState.resume.selectedExperienceIds,
      selectedExperiences: selectedResumeExperiences,
      experienceOptions: dashboardState.resume.experiences,
      allExperiences: dashboardState.resume.experiences,
      education: dashboardState.resume.education,
      certificates: dashboardState.resume.certificates,
      languages: dashboardState.resume.languages,
      skillSpecs: dashboardState.resume.skillSpecs,
      awards: dashboardState.resume.awards,
      papers: dashboardState.resume.papers,
      skillHighlights: resumeSkillHighlights,
      specProgress: resumeSpecProgress,
      specTotalCount: resumeSpecTotalCount,
      specSections: resumeSpecSections,
      experienceSections: resumeExperienceSections,
      matchedKeywords: matchedResumeKeywords,
      missingKeywords: missingResumeKeywords,
      keywordCoverage: resumeKeywordCoverage,
      recommendations: resumeRecommendations,
      beforeAfterItems: selectedResumeExperiences.map((item) => ({
        id: item.id,
        title: item.title,
        rawBullet: item.rawBullet,
        improvedBullet: item.improvedBullet,
        reason: item.bulletReason,
      })),
      metrics: {
        growth: resumeScore - RESUME_BASELINE_SCORE,
        reviewCount: Math.max(1, Math.min(4, Math.ceil(selectedResumeExperiences.length / 2))),
        score: resumeScore,
      },
      updateField: updateResumeField,
      addCollectionItem: addResumeCollectionItem,
      updateCollectionItem: updateResumeCollectionItem,
      removeCollectionItem: removeResumeCollectionItem,
      addExperience: addResumeExperience,
      updateExperienceField: updateResumeExperienceField,
      removeExperience: removeResumeExperience,
      toggleExperience: toggleResumeExperience,
      openExperienceHub,
      downloadPdf: downloadResumePdf,
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
