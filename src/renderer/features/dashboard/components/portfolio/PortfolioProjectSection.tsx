import { ContributionHeatmap } from "../../../../components/charts/DashboardCharts";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PortfolioProjectSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioProjectSection({
  portfolio,
}: PortfolioProjectSectionProps) {
  return (
    <div className="space-y-4">
      <SurfaceCard className="p-5">
        <h3 className="font-semibold text-slate-900">대표 프로젝트</h3>
        <div className="mt-4 space-y-3">
          {portfolio.data.projects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{project.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{project.role}</p>
                </div>
                <Pill className="border-slate-200 bg-slate-100 text-slate-700">{project.date}</Pill>
              </div>
              <p className="mt-3 text-sm text-slate-600">{project.impact}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
      <SurfaceCard className="p-5">
        <h3 className="font-semibold text-slate-900">활동 히트맵</h3>
        <div className="mt-4">
          <ContributionHeatmap values={portfolio.contributionHeatmapSeed} />
        </div>
      </SurfaceCard>
    </div>
  );
}
