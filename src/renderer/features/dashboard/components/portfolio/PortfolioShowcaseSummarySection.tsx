import { ProgressBar, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PortfolioShowcaseSummarySectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioShowcaseSummarySection({
  portfolio,
}: PortfolioShowcaseSummarySectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <p className="text-sm text-slate-500">서류 준비도</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{portfolio.data.readiness}%</p>
          <p className="mt-2 text-sm text-slate-500">이력서 최근 수정일 {portfolio.data.resumeUpdated}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <p className="text-sm text-slate-500">Git 커밋</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{portfolio.data.githubCommits}</p>
          <p className="mt-2 text-sm text-slate-500">지속적인 작업 흔적을 보여주는 지표입니다.</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900">핵심 스킬</h3>
        <div className="mt-4 space-y-4">
          {portfolio.data.skills.map((skill) => (
            <div key={skill.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">{skill.name}</span>
                <span className="font-semibold text-slate-800">{skill.level}%</span>
              </div>
              <ProgressBar value={skill.level} color="#0ea5e9" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
