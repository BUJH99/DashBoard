import { useMemo } from "react";
import { mapScheduleToCalendarEvents } from "../../calendar/calendarEventMapper";
import { analyzeJdText } from "../../jdScanner/analyzeJdText";
import { buildOverviewCollections } from "../domain/overviewSelectors";
import {
  buildFlashcardDeck,
  buildPortfolioKeywordSet,
  filterIndustryNews,
  filterPostings,
  getUpcomingSchedule,
} from "../domain/dashboardSelectors";
import type {
  ApplicationChecklistItem,
  CompanyTarget,
  DashboardLocalState,
  EnrichedPosting,
  FlashcardItem,
  IndustryNewsItem,
  JdScanState,
  PortfolioData,
  ScheduleEvent,
} from "../types";

type KeywordEntry = {
  label: string;
  aliases: string[];
};

type UseDashboardDerivedCollectionsOptions = {
  dashboardState: DashboardLocalState;
  postings: EnrichedPosting[];
  companyTargets: CompanyTarget[];
  checklistTemplates: Record<number, ApplicationChecklistItem[]>;
  flashcards: FlashcardItem[];
  industryNews: IndustryNewsItem[];
  schedule: ScheduleEvent[];
  portfolioData: PortfolioData;
  jdScan: JdScanState;
  jdKeywordLibrary: KeywordEntry[];
  calendarYear: number;
  calendarMonthIndex: number;
  referenceDate: Date;
};

export function useDashboardDerivedCollections({
  dashboardState,
  postings,
  companyTargets,
  checklistTemplates,
  flashcards,
  industryNews,
  schedule,
  portfolioData,
  jdScan,
  jdKeywordLibrary,
  calendarYear,
  calendarMonthIndex,
  referenceDate,
}: UseDashboardDerivedCollectionsOptions) {
  const portfolioKeywordSet = useMemo(
    () => buildPortfolioKeywordSet(portfolioData),
    [portfolioData],
  );

  const jdResult = useMemo(
    () =>
      jdScan.phase === "result"
        ? analyzeJdText(jdScan.text, portfolioKeywordSet, jdKeywordLibrary)
        : null,
    [jdKeywordLibrary, jdScan.phase, jdScan.text, portfolioKeywordSet],
  );

  const filteredIndustryNews = useMemo(
    () => filterIndustryNews(industryNews, dashboardState.ui.industryFilter),
    [dashboardState.ui.industryFilter, industryNews],
  );

  const filteredPostings = useMemo(
    () =>
      filterPostings(
        postings,
        dashboardState.ui.postingQuery,
        dashboardState.ui.postingCompanyFilter,
      ).sort((left, right) => {
        if (right.priority !== left.priority) {
          return right.priority - left.priority;
        }

        return left.daysLeft - right.daysLeft;
      }),
    [dashboardState.ui.postingCompanyFilter, dashboardState.ui.postingQuery, postings],
  );

  const overviewCollections = useMemo(
    () =>
      buildOverviewCollections({
        postings,
        companyTargets,
        checklistCollection: dashboardState.checklists.applicationChecklists,
        checklistTemplates,
        schedule,
        query: dashboardState.overview.query,
        companyFilter: dashboardState.overview.companyFilter,
        referenceDate,
        portfolioKeywordSet,
      }),
    [
      companyTargets,
      checklistTemplates,
      dashboardState.overview.companyFilter,
      dashboardState.overview.query,
      dashboardState.checklists.applicationChecklists,
      postings,
      portfolioKeywordSet,
      referenceDate,
      schedule,
    ],
  );

  const upcomingSchedule = useMemo(
    () => getUpcomingSchedule(schedule, referenceDate),
    [referenceDate, schedule],
  );

  const calendarEvents = useMemo(
    () => mapScheduleToCalendarEvents(schedule, calendarYear, calendarMonthIndex),
    [calendarMonthIndex, calendarYear, schedule],
  );

  const flashcardDeck = useMemo(
    () => buildFlashcardDeck(flashcards, dashboardState.ui.flashcardMode),
    [dashboardState.ui.flashcardMode, flashcards],
  );

  return {
    jdResult,
    filteredIndustryNews,
    filteredPostings,
    overviewCollections,
    upcomingSchedule,
    calendarEvents,
    flashcardDeck,
  };
}
