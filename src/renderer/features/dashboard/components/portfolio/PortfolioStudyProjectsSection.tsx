import { Pill, ProgressBar, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PortfolioStudyProjectsSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioStudyProjectsSection({
  portfolio,
}: PortfolioStudyProjectsSectionProps) {
  return (
    <SurfaceCard className="p-5">
      <h3 className="font-semibold text-slate-900">진행 중인 사이드 프로젝트</h3>
      <div className="mt-4 space-y-3">
        {portfolio.data.studyProjects.map((project) => (
          <div key={project.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{project.name}</p>
                <p className="mt-1 text-sm text-slate-500">{project.tech}</p>
              </div>
              <Pill className="border-slate-200 bg-slate-100 text-slate-700">{project.status}</Pill>
            </div>
            <div className="mt-3">
              <ProgressBar value={project.progress} color="#14b8a6" />
            </div>
            <p className="mt-3 text-sm text-slate-500">다음 단계: {project.next}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
