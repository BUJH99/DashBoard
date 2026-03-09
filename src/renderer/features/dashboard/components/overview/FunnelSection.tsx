import { FunnelChart } from "../../../../components/charts/DashboardCharts";
import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type FunnelSectionProps = {
  overview: DashboardController["overview"];
};

export function FunnelSection({
  overview,
}: FunnelSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">지원 퍼널</h3>
        <p className="mt-1 text-sm text-slate-500">현재까지의 지원 흐름을 단계별로 확인합니다.</p>
      </div>
      <FunnelChart data={overview.funnelSteps} />
    </SurfaceCard>
  );
}
