import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Code2,
  FileText,
  GraduationCap,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { ExperienceHubCategory } from "../../types";
import type { DashboardController } from "../../useDashboardController";
import { TabButton } from "../viewUtils";

type PortfolioExperienceHubSectionProps = {
  portfolio: DashboardController["portfolio"];
};

const EXPERIENCE_CATEGORY_META: Record<
  ExperienceHubCategory,
  {
    label: string;
    icon: typeof Code2;
    tone: string;
  }
> = {
  project: {
    label: "프로젝트",
    icon: Code2,
    tone: "border-sky-200 bg-sky-50 text-sky-700",
  },
  internship: {
    label: "인턴/직무경험",
    icon: BriefcaseBusiness,
    tone: "border-violet-200 bg-violet-50 text-violet-700",
  },
  activity: {
    label: "대외활동",
    icon: Users,
    tone: "border-amber-200 bg-amber-50 text-amber-700",
  },
  contest: {
    label: "공모전/해커톤",
    icon: Trophy,
    tone: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  research: {
    label: "연구/논문",
    icon: GraduationCap,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

export function PortfolioExperienceHubSection({
  portfolio,
}: PortfolioExperienceHubSectionProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | ExperienceHubCategory>("all");
  const [expandedExperienceId, setExpandedExperienceId] = useState<number | null>(
    portfolio.experienceHubItems.find((item) => item.featured)?.id ?? null,
  );
  const selectedExperienceIdSet = useMemo(
    () => new Set(portfolio.selectedResumeExperienceIds),
    [portfolio.selectedResumeExperienceIds],
  );
  const filterOptions = useMemo(
    () => [
      { id: "all" as const, label: "전체", count: portfolio.experienceHubItems.length },
      ...Object.entries(EXPERIENCE_CATEGORY_META).map(([category, meta]) => ({
        id: category as ExperienceHubCategory,
        label: meta.label,
        count: portfolio.experienceHubItems.filter((item) => item.category === category).length,
      })),
    ],
    [portfolio.experienceHubItems],
  );
  const filteredItems =
    activeFilter === "all"
      ? portfolio.experienceHubItems
      : portfolio.experienceHubItems.filter((item) => item.category === activeFilter);

  return (
    <div className="space-y-6">
      <SurfaceCard className="overflow-hidden border-blue-100 bg-[linear-gradient(135deg,_rgba(238,244,255,0.9),_rgba(246,248,255,0.94))] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h3 className="text-[24px] font-black tracking-tight text-slate-900">경험 허브</h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">자소서·이력서 재료를 한곳에 모아두고, 강한 경험부터 문장으로 연결합니다.</p>
            <p className="mt-4 text-[15px] font-semibold text-blue-700">{portfolio.resumeReadyMessage}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={portfolio.openCoverLetterBuilder}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white/85 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-white"
            >
              <FileText className="h-4 w-4" />
              자소서 작성
            </button>
            <button
              type="button"
              onClick={portfolio.openResumeBuilder}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Target className="h-4 w-4" />
              이력서 작성
            </button>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[0.32fr_0.68fr]">
        <div className="grid gap-4">
          <SurfaceCard className="p-5">
            <h4 className="text-[15px] font-black text-slate-900">Resume 준비 상태</h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">선택 경험</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{portfolio.selectedResumeExperienceIds.length}</p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">핵심 경험</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{portfolio.experienceHubItems.filter((item) => item.featured).length}</p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">카테고리</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{filterOptions.length - 1}</p>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50/70 p-4 text-sm leading-7 text-slate-600">
              선택한 경험은 새 이력서 페이지에서 자동으로 핵심 bullet로 연결됩니다. 정량 성과가 큰 경험을 먼저 포함하면 평가 점수가 더 안정적으로 올라갑니다.
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <h4 className="text-[15px] font-black text-slate-900">현재 포함된 경험</h4>
            <div className="mt-4 grid gap-3">
              {portfolio.experienceHubItems
                .filter((item) => selectedExperienceIdSet.has(item.id))
                .map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-slate-200 bg-white/80 px-4 py-3">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {EXPERIENCE_CATEGORY_META[item.category].label} · {item.period}
                    </p>
                  </div>
                ))}
              {portfolio.selectedResumeExperienceIds.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-sm text-slate-500">
                  아직 선택된 경험이 없습니다. 우측 카드에서 `이력서 포함` 버튼으로 핵심 경험을 골라 주세요.
                </div>
              ) : null}
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filterOption) => (
              <TabButton
                key={filterOption.id}
                active={activeFilter === filterOption.id}
                label={`${filterOption.label} (${filterOption.count})`}
                onClick={() => setActiveFilter(filterOption.id)}
              />
            ))}
          </div>

          <div className="grid gap-4">
            {filteredItems.map((item) => {
              const categoryMeta = EXPERIENCE_CATEGORY_META[item.category];
              const Icon = categoryMeta.icon;
              const isExpanded = expandedExperienceId === item.id;
              const isSelected = selectedExperienceIdSet.has(item.id);

              return (
                <article
                  key={item.id}
                  className="rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(148,163,184,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(148,163,184,0.10)]"
                >
                  <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border", categoryMeta.tone)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[15px] font-black leading-snug text-slate-900">{item.title}</h4>
                          {item.featured ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {categoryMeta.label} · {item.period} · {item.role} · {item.teamLabel}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.slice(0, 4).map((tag) => (
                            <Pill key={`${item.id}-${tag}`} className="border-slate-200 bg-slate-100 text-slate-700">
                              {tag}
                            </Pill>
                          ))}
                          {item.tags.length > 4 ? (
                            <Pill className="border-slate-200 bg-slate-100 text-slate-500">+{item.tags.length - 4}</Pill>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <button
                        type="button"
                        onClick={() => portfolio.toggleResumeExperience(item.id)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                          isSelected
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                        )}
                      >
                        {isSelected ? "이력서 포함됨" : "이력서 포함"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedExperienceId(isExpanded ? null : item.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                        aria-label={`${item.title} 상세 펼치기`}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="grid gap-5 border-t border-slate-100 bg-slate-50/70 px-5 py-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">활동 내용</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.overview}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">성과 / 결과</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.outcome}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">배운 점</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.learning}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">스킬 태그</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Pill key={`${item.id}-detail-${tag}`} className="border-slate-200 bg-white text-slate-700">
                              {tag}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
