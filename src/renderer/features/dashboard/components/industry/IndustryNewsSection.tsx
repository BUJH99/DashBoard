import { Newspaper } from "lucide-react";
import { SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";
import { getNewsTone, TabButton } from "../viewUtils";

type IndustryNewsSectionProps = {
  industry: DashboardController["industry"];
};

export function IndustryNewsSection({
  industry,
}: IndustryNewsSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">산업 뉴스</h2>
          <p className="mt-1 text-sm text-slate-500">
            반도체 취업 흐름과 공고 특성 변화를 태그 기준으로 빠르게 걸러서 봅니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {industry.tags.map((tag) => {
            const normalizedTag = tag === "All" ? "전체" : tag;
            return (
              <TabButton
                key={tag}
                active={industry.selectedTag === normalizedTag}
                label={normalizedTag}
                onClick={() => industry.setTag(normalizedTag)}
              />
            );
          })}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
            <p className="mb-4 text-sm text-slate-500">{news.summary}</p>
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
              <span>{news.source}</span>
              <span>{news.date}</span>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}
