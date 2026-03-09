import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { TabButton } from "../viewUtils";

type PortfolioHeaderSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioHeaderSection({
  portfolio,
}: PortfolioHeaderSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">포트폴리오 정리</h2>
          <p className="mt-1 text-sm text-slate-500">
            프로젝트, 학습, 학업 이력을 지원 서류 관점에서 다시 정리합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TabButton
            active={portfolio.activeSubTab === "showcase"}
            label="프로젝트"
            onClick={() => portfolio.setActiveSubTab("showcase")}
          />
          <TabButton
            active={portfolio.activeSubTab === "academics"}
            label="학업"
            onClick={() => portfolio.setActiveSubTab("academics")}
          />
          <TabButton
            active={portfolio.activeSubTab === "study"}
            label="학습"
            onClick={() => portfolio.setActiveSubTab("study")}
          />
        </div>
      </div>
    </SurfaceCard>
  );
}
