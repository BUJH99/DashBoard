import { Rocket } from "lucide-react";
import type { DashboardController } from "../../useDashboardController";

type PortfolioStudyProjectsSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioStudyProjectsSection({
  portfolio,
}: PortfolioStudyProjectsSectionProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-slate-900">
        <Rocket className="h-4 w-4 text-violet-500" />
        <h3 className="text-[15px] font-black">진행 중인 스터디 프로젝트</h3>
      </div>
      <div className="space-y-4">
        {portfolio.data.studyProjects.map((project) => (
          <article
            key={project.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h4 className="text-[16px] font-black text-slate-900">{project.name}</h4>
              <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-600">
                {project.tech}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-violet-500"
                style={{ width: `${Math.max(0, Math.min(100, project.progress))}%` }}
              />
            </div>
            <div className="mt-4 grid gap-2 text-[14px] text-slate-500">
              <p>
                <span className="font-black text-slate-800">현재:</span> {project.status}
              </p>
              <p>
                <span className="font-black text-slate-800">Next:</span> {project.next}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
