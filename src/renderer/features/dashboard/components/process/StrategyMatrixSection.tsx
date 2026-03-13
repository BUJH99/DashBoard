import { Compass, Sparkles, Target } from "lucide-react";
import { StrategyMatrix } from "../../../../components/charts/DashboardCharts";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { buildStrategyMatrixModel } from "../../domain/strategyMatrix";
import type { DashboardController } from "../../useDashboardController";
import { getCompanyTypeTone } from "../viewUtils";

type StrategyMatrixSectionProps = {
  companies: DashboardController["companies"];
};

export function StrategyMatrixSection({
  companies,
}: StrategyMatrixSectionProps) {
  const strategyModel = buildStrategyMatrixModel(
    companies.companyTargets,
    companies.selectedCompany.id,
  );
  const selectedQuadrant = strategyModel.quadrantSummaries.find(
    (quadrant) => quadrant.id === strategyModel.selectedPoint.quadrantId,
  );

  return (
    <SurfaceCard className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">적합도 / 선호도 매트릭스</h3>
          <p className="mt-1 text-sm text-slate-500">
            기업별 전략 포지션을 기준으로 어디에 시간을 더 써야 하는지 확인합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">
            평균 적합도 {strategyModel.averages.fit}
          </Pill>
          <Pill className="border-violet-200 bg-violet-50 text-violet-700">
            평균 선호도 {strategyModel.averages.preference}
          </Pill>
          <Pill className="border-amber-200 bg-amber-50 text-amber-700">
            평균 전략 점수 {strategyModel.averages.score}
          </Pill>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 shadow-inner">
        <div className="mx-auto w-full xl:w-[60%]">
          <StrategyMatrix
            model={strategyModel}
            onSelect={companies.updateSelectedCompanyId}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.62fr_0.38fr]">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">전략 우선순위 보드</p>
              <p className="mt-1 text-xs text-slate-500">
                전략 점수 기준으로 우선순위를 정렬했습니다.
              </p>
            </div>
            <Target className="h-4 w-4 text-cyan-600" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {strategyModel.points.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => companies.updateSelectedCompanyId(point.id)}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-cyan-200 hover:bg-cyan-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                      #{point.rank}
                    </span>
                    <span className="font-semibold text-slate-800">{point.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    적합도 {point.fit}% / 선호도 {point.preference}%
                  </p>
                </div>
                <span className="text-sm font-black text-slate-900">{point.strategicScore}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">선택 전략 해석</p>
              <p className="mt-1 text-xs text-slate-500">
                현재 선택한 기업 기준의 전략 포지션입니다.
              </p>
            </div>
            <Compass className="h-4 w-4 text-violet-600" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-black text-slate-900">{strategyModel.selectedPoint.name}</p>
                <p className="mt-1 text-sm text-slate-500">{companies.selectedCompany.status}</p>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getCompanyTypeTone(companies.selectedCompany.type)}`}
              >
                {companies.selectedCompany.type}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Quadrant</p>
                <p className="mt-2 text-base font-bold text-slate-900">{selectedQuadrant?.label}</p>
                <p className="mt-1 text-sm text-slate-500">{selectedQuadrant?.description}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Score</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {strategyModel.selectedPoint.strategicScore}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  전체 {strategyModel.points.length}개 중 {strategyModel.selectedPoint.rank}위
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm text-cyan-900">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4" />
                이번 주 제안
              </div>
              <p className="mt-2 leading-6">
                {strategyModel.topPriorityPoint.id === strategyModel.selectedPoint.id
                  ? "현재 선택 기업은 최상위 우선순위입니다. 관련 공고와 메모를 바로 점검하는 것이 가장 효율적입니다."
                  : `${strategyModel.topPriorityPoint.name}가 현재 최상위 우선순위입니다. 선택 기업은 비교 카드로 유지하되, 시간 배분은 상위 기업 쪽에 더 두는 편이 좋습니다.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
