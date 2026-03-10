import type { DashboardIndustryArticle } from "./dashboard-state-contracts.js";

export type IndustryNewsCrawlRequest = {
  keywords: string[];
  periodDays: number;
};

export type IndustryNewsCrawlResponse = {
  articles: DashboardIndustryArticle[];
  fetchedAt: string;
  warnings: string[];
};
