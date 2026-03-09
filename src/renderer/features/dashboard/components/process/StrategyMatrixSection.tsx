import { StrategyMatrix } from "../../../../components/charts/DashboardCharts";
import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type StrategyMatrixSectionProps = {
  companies: DashboardController["companies"];
};

export function StrategyMatrixSection({
  companies,
}: StrategyMatrixSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">적합도 / 선호도 매트릭스</h3>
        <p className="mt-1 text-sm text-slate-500">
          기업별 전략 포지션을 기준으로 어디에 시간을 더 써야 하는지 확인합니다.
        </p>
      </div>
      <div className="px-8 pb-8">
        <StrategyMatrix
          data={companies.companyTargets}
          selectedId={companies.selectedCompany.id}
          onSelect={companies.updateSelectedCompanyId}
        />
      </div>
    </SurfaceCard>
  );
}
