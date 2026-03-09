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
      <div className="flex flex-wrap items-end justify-around gap-4">
        {overview.competencyMetrics.map((metric) => (
          <SemiCircleGauge
            key={metric.label}
            value={metric.value}
            target={metric.target}
            label={metric.label}
            colorHex={metric.color}
          />
        ))}
      </div>
    </SurfaceCard>
  );
}
