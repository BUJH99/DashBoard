import {
  AlertCircle,
  Clock3,
  ExternalLink,
  Newspaper,
  PencilLine,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";
import { getNewsTone, TabButton } from "../viewUtils";

type IndustryNewsSectionProps = {
  industry: DashboardController["industry"];
};

const INDUSTRY_PERIOD_OPTIONS = [
  { label: "3일", value: 3 },
  { label: "7일", value: 7 },
  { label: "14일", value: 14 },
  { label: "30일", value: 30 },
  { label: "90일", value: 90 },
];

function formatLastCrawledAt(lastCrawledAt: string | null) {
  if (!lastCrawledAt) {
    return "아직 수집하지 않았습니다.";
  }

  const parsedDate = new Date(lastCrawledAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return lastCrawledAt;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsedDate);
}

export function IndustryNewsSection({
  industry,
}: IndustryNewsSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">산업 뉴스</h2>
          <p className="mt-1 text-sm text-slate-500">
            공개 RSS 기반으로 한국 반도체/하드웨어 기사를 수동 수집합니다. 변경 사항은 상단 저장 버튼으로 보존됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600">
            기간
            <select
              value={String(industry.periodDays)}
              onChange={(event) => industry.updatePeriodDays(Number(event.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none focus:border-cyan-300"
            >
              {INDUSTRY_PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void industry.crawl()}
            disabled={industry.isCrawling || !industry.canCrawl}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
              industry.isCrawling || !industry.canCrawl
                ? "cursor-not-allowed bg-slate-300 text-white"
                : "bg-slate-900 text-white hover:bg-slate-800",
            )}
          >
            <RefreshCw className={cn("h-4 w-4", industry.isCrawling && "animate-spin")} />
            {industry.isCrawling ? "크롤링 중..." : "크롤링"}
          </button>
          <button
            type="button"
            onClick={industry.toggleKeywordEditor}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
          >
            <PencilLine className="h-4 w-4" />
            {industry.isKeywordEditorOpen ? "키워드 접기" : "키워드 편집"}
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 shadow-[0_12px_28px_rgba(148,163,184,0.08)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock3 className="h-4 w-4 text-slate-400" />
            마지막 수집 시각: {formatLastCrawledAt(industry.lastCrawledAt)}
          </div>
          <Pill className="border-slate-200 bg-white text-slate-700">
            키워드 {industry.keywords.filter((keyword) => keyword.trim().length > 0).length}개
          </Pill>
          <Pill className="border-slate-200 bg-white text-slate-700">
            최근 {industry.periodDays}일
          </Pill>
        </div>

        {industry.crawlMessage ? (
          <p className="mt-3 text-sm font-medium text-slate-600">{industry.crawlMessage}</p>
        ) : null}

        {industry.warnings.length > 0 ? (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              일부 RSS 소스에서 경고가 발생했습니다.
            </div>
            <div className="mt-2 grid gap-1.5">
              {industry.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {industry.isKeywordEditorOpen ? (
        <div className="mt-5 rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.28)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">크롤링 키워드</h3>
              <p className="mt-1 text-xs text-slate-400">
                키워드를 수정한 뒤 다시 크롤링하면 기사 목록이 최신 결과로 교체됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={industry.addKeyword}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              키워드 추가
            </button>
          </div>

          <div className="grid gap-3">
            {industry.keywords.map((keyword, index) => (
              <div key={`industry-keyword-${index}`} className="flex items-center gap-3">
                <input
                  value={keyword}
                  onChange={(event) => industry.updateKeyword(index, event.target.value)}
                  className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-300"
                  placeholder="예: HBM"
                />
                <button
                  type="button"
                  onClick={() => industry.removeKeyword(index)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:text-rose-500"
                  aria-label={`산업 키워드 ${index + 1} 삭제`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {industry.tags.map((tag) => (
          <TabButton
            key={tag}
            active={industry.selectedTag === tag}
            label={tag}
            onClick={() => industry.setTag(tag)}
          />
        ))}
      </div>

      {industry.news.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-slate-300" />
          <h3 className="mt-3 text-lg font-bold text-slate-900">아직 불러온 산업 뉴스가 없습니다.</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            키워드를 확인한 뒤 `크롤링` 버튼을 눌러 공개 RSS에서 한국 기사 위주 결과를 가져오세요.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {industry.news.map((news) => (
            <article
              key={news.id}
              className="group flex flex-col rounded-3xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", getNewsTone(news.tag))}>
                  {news.tag}
                </span>
                <Newspaper className="h-4 w-4 text-slate-300 transition group-hover:text-cyan-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold leading-snug text-slate-900">{news.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500">{news.summary}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {news.matchedKeywords.slice(0, 4).map((keyword) => (
                  <Pill key={`${news.id}-${keyword}`} className="border-slate-200 bg-slate-100 text-slate-600">
                    {keyword}
                  </Pill>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
                <div className="grid gap-1">
                  <span>{news.source}</span>
                  <span>{news.date}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void industry.openArticle(news.url)}
                  disabled={!news.url}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  원문 보기
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
