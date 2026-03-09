import { MapPin } from "lucide-react";
import { Pill, ProgressBar, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import { buildStrategyMatrixModel } from "../../domain/strategyMatrix";
import type { DashboardController } from "../../useDashboardController";
import { getCompanyTypeTone } from "../viewUtils";

type StrategySummarySectionProps = {
  companies: DashboardController["companies"];
  overview: DashboardController["overview"];
};

export function StrategySummarySection({
  companies,
  overview,
}: StrategySummarySectionProps) {
  const strategyModel = buildStrategyMatrixModel(
    companies.companyTargets,
    companies.selectedCompany.id,
  );
  const selectedQuadrant = strategyModel.quadrantSummaries.find(
    (quadrant) => quadrant.id === strategyModel.selectedPoint.quadrantId,
  );

  return (
    <SurfaceCard className="p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">선택 기업 요약</h3>
          <p className="mt-1 text-sm text-slate-500">
            지금 선택한 기업의 상태, 위치, 적합도를 빠르게 확인합니다.
          </p>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-bold",
            getCompanyTypeTone(companies.selectedCompany.type),
          )}
        >
          {companies.selectedCompany.type}
        </span>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xl font-black text-slate-900">{companies.selectedCompany.name}</h4>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {companies.selectedCompany.location}
              </p>
            </div>
            <Pill className="border-slate-200 bg-white text-slate-700">
              {companies.selectedCompany.status}
            </Pill>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">적합도</span>
                <span className="font-semibold text-slate-800">{companies.selectedCompany.fit}%</span>
              </div>
              <ProgressBar value={companies.selectedCompany.fit} color="#0ea5e9" />
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">선호도</span>
                <span className="font-semibold text-slate-800">{companies.selectedCompany.preference}%</span>
              </div>
              <ProgressBar value={companies.selectedCompany.preference} color="#4f46e5" />
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Rank</p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                #{strategyModel.selectedPoint.rank}
              </p>
              <p className="mt-1 text-xs text-slate-500">전략 우선순위</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Score</p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {strategyModel.selectedPoint.strategicScore}
              </p>
              <p className="mt-1 text-xs text-slate-500">적합도/선호도 종합</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Quadrant</p>
              <p className="mt-2 text-sm font-bold text-slate-900">{selectedQuadrant?.label}</p>
              <p className="mt-1 text-xs text-slate-500">{selectedQuadrant?.description}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {overview.analyticsInsights.slice(0, 2).map((insight) => (
            <div key={insight.title} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">{insight.title}</p>
              <p className="mt-2">{insight.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
