import { Lightbulb } from "lucide-react";
import { SemiCircleGauge } from "../../../../components/charts/DashboardCharts";
import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type CompetencySectionProps = {
  overview: DashboardController["overview"];
};

export function CompetencySection({
  overview,
}: CompetencySectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">핵심 역량 점검</h3>
        <p className="mt-1 text-sm text-slate-500">직무 기준으로 어느 영역이 충분하고 부족한지 확인합니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overview.competencyMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-4"
          >
            <SemiCircleGauge
              value={metric.value}
              target={metric.target}
              label={metric.label}
              colorHex={metric.color}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-slate-900">이번 주 관찰 포인트</h4>
            <p className="mt-1 text-sm text-slate-500">
              역량 점검과 함께 바로 액션으로 이어질 인사이트입니다.
            </p>
          </div>
          <Lightbulb className="h-5 w-5 text-amber-500" />
        </div>

        <div className="space-y-3">
          {overview.observationPoints.map((point) => (
            <div
              key={point.id}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
            >
              {point.summary}
            </div>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
