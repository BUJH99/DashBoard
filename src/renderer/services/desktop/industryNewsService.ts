import type {
  IndustryNewsCrawlRequest,
  IndustryNewsCrawlResponse,
} from "../../../../shared/industry-news-service-contracts";
import { getDesktopApi } from "./desktopApi";

async function fetchIndustryNewsApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/industry-news/${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "산업 뉴스 API 요청에 실패했습니다.");
  }

  return response.json() as Promise<T>;
}

export function crawlIndustryNews(payload: IndustryNewsCrawlRequest): Promise<IndustryNewsCrawlResponse> {
  const desktopApi = getDesktopApi();

  if (desktopApi?.industryNews) {
    return desktopApi.industryNews.crawl(payload);
  }

  return fetchIndustryNewsApi<IndustryNewsCrawlResponse>("crawl", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
