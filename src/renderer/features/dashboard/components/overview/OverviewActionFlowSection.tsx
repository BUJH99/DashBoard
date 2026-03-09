import { RefreshCcw, Search, SlidersHorizontal } from "lucide-react";
import { Sparkline } from "../../../../components/charts/DashboardCharts";
import { GlassSelect } from "../../../../components/ui/GlassSelect";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type OverviewActionFlowSectionProps = {
  overview: DashboardController["overview"];
};

export function OverviewActionFlowSection({
  overview,
}: OverviewActionFlowSectionProps) {
  const hasActiveFilters =
    overview.filters.query.trim().length > 0 || overview.filters.companyFilter !== "all";

  return (
    <SurfaceCard className="p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <Pill className="border-slate-900 bg-slate-900 text-white">Merged Prototype</Pill>
            <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">Hardware Career BI</Pill>
          </div>
          <h2 className="text-[28px] font-semibold tracking-tight text-slate-950">
            이번 주 우선 액션과 전체 지원 흐름
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            검색과 필터를 기준으로 이번 주 액션, 요약 지표, 전체 지원 흐름을 같은 컨텍스트에서
            확인합니다.
          </p>
        </div>

        <div className="w-full max-w-md space-y-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={overview.filters.query}
              onChange={(event) => overview.filters.setQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-300 focus:bg-white"
              placeholder="기업명, 직무명, 키워드 검색"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <GlassSelect
              ariaLabel="전체 지원 흐름 기업 필터"
              value={overview.filters.companyFilter}
              options={[
                { value: "all", label: "전체 기업" },
                ...overview.filters.companyOptions,
              ]}
              onChange={overview.filters.setCompanyFilter}
              tone="cyan"
              size="sm"
              className="flex-1"
              icon={<SlidersHorizontal className="h-4 w-4" />}
            />

            <button
              type="button"
              onClick={overview.filters.reset}
              disabled={!hasActiveFilters}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
            >
              <RefreshCcw className="h-4 w-4" />
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.summaryMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight text-slate-900">
                    {metric.value}
                  </span>
                  {metric.suffix ? (
                    <span className="text-sm font-medium text-slate-400">{metric.suffix}</span>
                  ) : null}
                </div>
              </div>
              <Pill
                className="border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                {metric.helper}
              </Pill>
            </div>

            <div className="mt-4">
              <Sparkline data={metric.data} strokeColor={metric.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">이번 주 포커스</p>
            <p className="mt-1 text-xs text-slate-500">
              현재 필터 기준으로 바로 밀어야 할 흐름만 추렸습니다.
            </p>
          </div>
          <Pill className="border-slate-200 bg-white text-slate-600">
            {overview.topActions.length}개 액션 반영
          </Pill>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {overview.focusItems.map((item) => (
            <div key={item.postingId} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-800">{item.company}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                  {item.stageLabel}
                </Pill>
                <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">
                  {item.expectedDateLabel}
                </Pill>
              </div>
              <p className="mt-3 text-sm text-slate-500">{item.nextActionLabel}</p>
            </div>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
