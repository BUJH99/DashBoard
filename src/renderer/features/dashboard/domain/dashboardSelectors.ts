import { ALL_INDUSTRY_TAG } from "../../../../../shared/dashboard-state";
import { normalizeKeyword } from "../../../../../shared/keywordNormalization";
import type {
  ApplicationChecklistItem,
  DashboardLocalState,
  FlashcardItem,
  IndustryNewsItem,
  JobPosting,
  PortfolioData,
  ScheduleEvent,
} from "../types";

export function daysUntil(targetDate: string, referenceDate: Date) {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(targetDate);
  end.setHours(0, 0, 0, 0);

  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function enrichPostings(postings: JobPosting[], referenceDate: Date) {
  return postings.map((posting) => {
    const daysLeft = Math.max(0, daysUntil(posting.deadline, referenceDate));
    const priority = Math.round(
      posting.fit * 0.35 +
        posting.urgency * 0.25 +
        posting.growth * 0.2 +
        posting.selfIntroReady * 0.1 +
        (100 - posting.burden) * 0.1,
    );

    return {
      ...posting,
      daysLeft,
      priority,
    };
  });
}

export function filterPostings(postings: ReturnType<typeof enrichPostings>, query: string, companyFilter: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return postings.filter((posting) => {
    const matchesCompany = companyFilter === "all" || posting.targetCompanyId === Number(companyFilter);
    if (!matchesCompany) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      posting.company,
      posting.title,
      posting.role,
      posting.summary,
      posting.keywords.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function filterIndustryNews(news: IndustryNewsItem[], filter: string) {
  return filter === ALL_INDUSTRY_TAG ? news : news.filter((item) => item.tag === filter);
}

export function buildPortfolioKeywordSet(portfolio: PortfolioData) {
  const keywords = new Set<string>();
  const addKeyword = (value: string) => keywords.add(normalizeKeyword(value));

  portfolio.skills.forEach((skill) => addKeyword(skill.name));
  portfolio.learningSkills.forEach((skill) => addKeyword(skill.name));
  portfolio.coursework.forEach((course) => {
    addKeyword(course.name);
    course.tags.forEach(addKeyword);
  });
  portfolio.projects.forEach((project) => {
    addKeyword(project.name);
    project.tech.forEach(addKeyword);
  });
  portfolio.experienceHub.forEach((experience) => {
    addKeyword(experience.title);
    experience.tags.forEach(addKeyword);
    experience.keywords.forEach(addKeyword);
  });

  return keywords;
}

export function getChecklistItems(
  collection: DashboardLocalState["checklists"]["applicationChecklists"],
  templates: Record<number, ApplicationChecklistItem[]>,
  postingId: number,
) {
  return collection[postingId] ?? templates[postingId] ?? [];
}

export function ensureChecklistCollection(
  collection: DashboardLocalState["checklists"]["applicationChecklists"],
  templates: Record<number, ApplicationChecklistItem[]>,
  postingId: number,
) {
  if (collection[postingId]) {
    return collection;
  }

  return {
    ...collection,
    [postingId]: templates[postingId] ?? [],
  };
}

export function getUpcomingSchedule(schedule: ScheduleEvent[], referenceDate: Date) {
  return [...schedule]
    .sort((left, right) => left.date - right.date)
    .filter((event) => event.date >= referenceDate.getDate());
}

export function buildFlashcardDeck(cards: FlashcardItem[], mode: "default" | "shuffled") {
  if (mode === "default") {
    return cards;
  }

  return [...cards].sort((left, right) => left.q.localeCompare(right.q, "ko-KR"));
}

export { normalizeKeyword };
