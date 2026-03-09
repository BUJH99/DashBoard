import { KpiCard } from "../../../../components/charts/DashboardCharts";
import type { DashboardController } from "../../useDashboardController";

type OverviewKpiGridSectionProps = {
  overview: DashboardController["overview"];
};

export function OverviewKpiGridSection({
  overview,
}: OverviewKpiGridSectionProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-4">
      {overview.kpiMetrics.map((metric) => (
        <KpiCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}
