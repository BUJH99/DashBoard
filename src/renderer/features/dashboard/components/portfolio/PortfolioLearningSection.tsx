import { ProgressBar, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PortfolioLearningSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioLearningSection({
  portfolio,
}: PortfolioLearningSectionProps) {
  return (
    <SurfaceCard className="p-5">
      <h3 className="font-semibold text-slate-900">학습 중인 기술</h3>
      <div className="mt-4 space-y-4">
        {portfolio.data.learningSkills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-700">{skill.name}</span>
              <span className="font-semibold text-slate-800">{skill.progress}%</span>
            </div>
            <ProgressBar value={skill.progress} color="#8b5cf6" />
            <p className="mt-2 text-xs text-slate-500">{skill.status}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
