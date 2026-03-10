import type { DashboardIndustryArticle } from "../../shared/dashboard-state-contracts.js";
import type {
  IndustryNewsCrawlRequest,
  IndustryNewsCrawlResponse,
} from "../../shared/industry-news-service-contracts.js";
import { sanitizeIndustryKeywords } from "../../shared/industry-news.js";
import { normalizeKeyword } from "../../shared/keywordNormalization.js";
import { XMLParser } from "fast-xml-parser";

type RssSource = {
  name: string;
  url: string;
};

type ParsedRssItem = Record<string, unknown>;

const RSS_SOURCES: RssSource[] = [
  {
    name: "ZDNet Korea",
    url: "https://feeds.feedburner.com/zdkorea",
  },
  {
    name: "디일렉",
    url: "https://cdn.thelec.kr/rss/gn_rss_allArticle.xml",
  },
  {
    name: "전자신문 장비",
    url: "https://rss.etnews.com/06061.xml",
  },
  {
    name: "전자신문 부품",
    url: "https://rss.etnews.com/06062.xml",
  },
  {
    name: "전자신문 소재",
    url: "https://rss.etnews.com/06064.xml",
  },
];

const NAVER_NEWS_SOURCE_NAME = "네이버뉴스";
const DEFAULT_PERIOD_DAYS = 30;
const RSS_ITEM_LIMIT = 20;
const STORED_ARTICLE_LIMIT = 18;
const SUMMARY_LIMIT = 140;
const NAVER_RESULT_LIMIT_PER_KEYWORD = 4;

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: false,
  parseTagValue: false,
  removeNSPrefix: true,
  trimValues: true,
});

function ensureArray<T>(value: T | T[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function readText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => readText(entry)).find(Boolean) ?? "";
  }

  if (value && typeof value === "object") {
    const cdataValue = (value as Record<string, unknown>)["#text"];
    if (typeof cdataValue === "string") {
      return cdataValue.trim();
    }
  }

  return "";
}

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&apos;/gi, "'");
}

function stripHtml(value: string) {
  return collapseWhitespace(
    decodeHtmlEntities(value)
      .replace(/<!\[CDATA\[|\]\]>/g, "")
      .replace(/<[^>]+>/g, " "),
  );
}

function summarizeDescription(description: string) {
  const cleaned = stripHtml(description);

  if (!cleaned) {
    return "RSS 요약이 제공되지 않은 기사입니다.";
  }

  if (cleaned.length <= SUMMARY_LIMIT) {
    return cleaned;
  }

  return `${cleaned.slice(0, SUMMARY_LIMIT).trimEnd()}...`;
}

function parsePublishedAt(value: string, fetchedAt: string) {
  const trimmedValue = value.trim();
  const koreanDateTimeMatch = trimmedValue.match(
    /^(\d{4})[.-](\d{2})[.-](\d{2})[.\s]+(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (koreanDateTimeMatch) {
    const [, year, month, day, hour, minute, second = "00"] = koreanDateTimeMatch;
    const normalizedIso = `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`;
    const normalizedDate = new Date(normalizedIso);

    if (!Number.isNaN(normalizedDate.getTime())) {
      return normalizedDate.toISOString();
    }
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return fetchedAt;
  }

  return parsedDate.toISOString();
}

function formatDisplayDate(isoString: string) {
  const parsedDate = new Date(isoString);

  if (Number.isNaN(parsedDate.getTime())) {
    return isoString;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(parsedDate);
}

function buildArticleId(source: string, url: string, title: string, publishedAt: string) {
  const stableKey = url || `${source}::${title}::${publishedAt}`;

  return stableKey.replace(/\s+/g, " ").trim();
}

function mergeArticleKeywords(
  existing: DashboardIndustryArticle | undefined,
  incoming: DashboardIndustryArticle,
) {
  const mergedKeywords = [
    ...(existing?.matchedKeywords ?? []),
    ...incoming.matchedKeywords,
  ].filter((keyword, index, array) => array.indexOf(keyword) === index);

  return {
    ...(existing ?? incoming),
    ...incoming,
    tag: mergedKeywords[0] ?? incoming.tag,
    matchedKeywords: mergedKeywords,
  } satisfies DashboardIndustryArticle;
}

function upsertArticle(
  dedupedArticles: Map<string, DashboardIndustryArticle>,
  key: string,
  article: DashboardIndustryArticle,
) {
  const existing = dedupedArticles.get(key);
  dedupedArticles.set(key, mergeArticleKeywords(existing, article));
}

function findMatchedKeywords(keywords: string[], title: string, description: string) {
  const haystack = normalizeKeyword(`${title} ${description}`);

  return keywords.filter((keyword) => {
    const normalizedKeyword = normalizeKeyword(keyword);

    return normalizedKeyword.length > 0 && haystack.includes(normalizedKeyword);
  });
}

function parseRssItems(xml: string) {
  const parsed = xmlParser.parse(xml) as {
    rss?: {
      channel?: {
        item?: ParsedRssItem | ParsedRssItem[];
      };
    };
  };

  return ensureArray(parsed.rss?.channel?.item);
}

async function fetchText(url: string, accept: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
      Accept: accept,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function resolvePeriodDays(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_PERIOD_DAYS;
  }

  return Math.floor(value);
}

function buildCutoffTime(periodDays: number, fetchedAt: string) {
  const cutoffDate = new Date(fetchedAt);
  cutoffDate.setDate(cutoffDate.getDate() - Math.max(periodDays - 1, 0));
  cutoffDate.setHours(0, 0, 0, 0);

  return cutoffDate.getTime();
}

function isWithinPeriod(publishedAt: string, cutoffTime: number) {
  const publishedTime = new Date(publishedAt).getTime();

  if (Number.isNaN(publishedTime)) {
    return false;
  }

  return publishedTime >= cutoffTime;
}

function buildArticleFromItem(
  item: ParsedRssItem,
  source: RssSource,
  keywords: string[],
  fetchedAt: string,
  cutoffTime: number,
): DashboardIndustryArticle | null {
  const title = readText(item.title);
  const url = readText(item.link);
  const description = readText(item.description) || readText(item.summary) || readText(item.encoded);
  const matchedKeywords = findMatchedKeywords(keywords, title, description);

  if (!title || matchedKeywords.length === 0) {
    return null;
  }

  const publishedAt = parsePublishedAt(
    readText(item.pubDate) || readText(item.published) || readText(item.date),
    fetchedAt,
  );

  if (!isWithinPeriod(publishedAt, cutoffTime)) {
    return null;
  }

  return {
    id: buildArticleId(source.name, url, title, publishedAt),
    title,
    source: source.name,
    date: formatDisplayDate(publishedAt),
    publishedAt,
    tag: matchedKeywords[0] ?? "",
    matchedKeywords,
    summary: summarizeDescription(description),
    url,
  };
}

function formatNaverSearchDate(isoString: string) {
  const parsedDate = new Date(isoString);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function buildNaverSearchUrl(keyword: string, fetchedAt: string, periodDays: number) {
  const endDate = new Date(fetchedAt);
  const startDate = new Date(fetchedAt);
  startDate.setDate(startDate.getDate() - Math.max(periodDays - 1, 0));

  const url = new URL("https://search.naver.com/search.naver");
  url.searchParams.set("where", "news");
  url.searchParams.set("query", keyword);
  url.searchParams.set("sort", "1");
  url.searchParams.set("pd", "3");
  url.searchParams.set("ds", formatNaverSearchDate(startDate.toISOString()));
  url.searchParams.set("de", formatNaverSearchDate(endDate.toISOString()));

  return url.toString();
}

function extractNaverArticleUrls(html: string, limit: number) {
  const matches = html.match(/https:\/\/n\.news\.naver\.com\/mnews\/article\/\d+\/\d+(?:\?[^"'\\s<]+)?/g) ?? [];
  const dedupedUrls = new Set<string>();

  matches.forEach((match) => {
    const normalizedUrl = decodeHtmlEntities(match);
    dedupedUrls.add(normalizedUrl);
  });

  return [...dedupedUrls].slice(0, limit);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readMetaProperty(html: string, key: string) {
  const propertyPattern = new RegExp(
    `<meta[^>]+property=["']${escapeRegExp(key)}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const propertyMatch = html.match(propertyPattern);

  if (propertyMatch?.[1]) {
    return decodeHtmlEntities(propertyMatch[1]);
  }

  const namePattern = new RegExp(
    `<meta[^>]+name=["']${escapeRegExp(key)}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const nameMatch = html.match(namePattern);

  return nameMatch?.[1] ? decodeHtmlEntities(nameMatch[1]) : "";
}

function readNaverPublishedAt(html: string) {
  const match = html.match(/data-date-time="([^"]+)"/i);

  return match?.[1] ?? "";
}

async function buildNaverArticle(
  url: string,
  keywords: string[],
  searchKeyword: string,
  fetchedAt: string,
  cutoffTime: number,
): Promise<DashboardIndustryArticle | null> {
  const html = await fetchText(url, "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
  const title = stripHtml(readMetaProperty(html, "og:title"));
  const description = stripHtml(readMetaProperty(html, "og:description"));
  const publisher = collapseWhitespace(readMetaProperty(html, "og:article:author").split("|")[0] ?? "");
  const matchedKeywords = [
    ...new Set([
      searchKeyword,
      ...findMatchedKeywords(keywords, title, description),
    ]),
  ].filter(Boolean);

  if (!title || matchedKeywords.length === 0) {
    return null;
  }

  const publishedAt = parsePublishedAt(readNaverPublishedAt(html), fetchedAt);

  if (!isWithinPeriod(publishedAt, cutoffTime)) {
    return null;
  }

  return {
    id: buildArticleId(NAVER_NEWS_SOURCE_NAME, url, title, publishedAt),
    title,
    source: publisher ? `${publisher} (네이버뉴스)` : NAVER_NEWS_SOURCE_NAME,
    date: formatDisplayDate(publishedAt),
    publishedAt,
    tag: matchedKeywords[0] ?? "",
    matchedKeywords,
    summary: summarizeDescription(description),
    url,
  };
}

async function collectRssArticles(
  keywords: string[],
  fetchedAt: string,
  cutoffTime: number,
  dedupedArticles: Map<string, DashboardIndustryArticle>,
  warnings: string[],
) {
  await Promise.all(
    RSS_SOURCES.map(async (source) => {
      try {
        const xml = await fetchText(
          source.url,
          "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        );
        const items = parseRssItems(xml).slice(0, RSS_ITEM_LIMIT);

        items.forEach((item) => {
          const article = buildArticleFromItem(item, source, keywords, fetchedAt, cutoffTime);

          if (!article) {
            return;
          }

          const dedupeKey = article.url || `${article.source}::${article.title}`;
          upsertArticle(dedupedArticles, dedupeKey, article);
        });
      } catch (error) {
        warnings.push(
          `${source.name} RSS를 불러오지 못했습니다: ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`,
        );
      }
    }),
  );
}

async function collectNaverArticles(
  keywords: string[],
  fetchedAt: string,
  periodDays: number,
  cutoffTime: number,
  dedupedArticles: Map<string, DashboardIndustryArticle>,
  warnings: string[],
) {
  for (const keyword of keywords) {
    try {
      const searchHtml = await fetchText(
        buildNaverSearchUrl(keyword, fetchedAt, periodDays),
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      );
      const articleUrls = extractNaverArticleUrls(searchHtml, NAVER_RESULT_LIMIT_PER_KEYWORD);

      for (const articleUrl of articleUrls) {
        try {
          const article = await buildNaverArticle(
            articleUrl,
            keywords,
            keyword,
            fetchedAt,
            cutoffTime,
          );

          if (article) {
            upsertArticle(dedupedArticles, articleUrl, article);
          }
        } catch (error) {
          warnings.push(
            `네이버뉴스 기사(${keyword})를 불러오지 못했습니다: ${
              error instanceof Error ? error.message : "알 수 없는 오류"
            }`,
          );
        }
      }
    } catch (error) {
      warnings.push(
        `네이버뉴스 검색(${keyword})을 불러오지 못했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
      );
    }
  }
}

export async function crawlIndustryNews(
  request: IndustryNewsCrawlRequest,
): Promise<IndustryNewsCrawlResponse> {
  const keywords = sanitizeIndustryKeywords(request.keywords);

  if (keywords.length === 0) {
    throw new Error("크롤링할 키워드를 한 개 이상 입력해 주세요.");
  }

  const periodDays = resolvePeriodDays(request.periodDays);
  const fetchedAt = new Date().toISOString();
  const cutoffTime = buildCutoffTime(periodDays, fetchedAt);
  const warnings: string[] = [];
  const dedupedArticles = new Map<string, DashboardIndustryArticle>();

  await collectRssArticles(keywords, fetchedAt, cutoffTime, dedupedArticles, warnings);
  await collectNaverArticles(keywords, fetchedAt, periodDays, cutoffTime, dedupedArticles, warnings);

  const articles = [...dedupedArticles.values()]
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .slice(0, STORED_ARTICLE_LIMIT);

  return {
    articles,
    fetchedAt,
    warnings,
  };
}
