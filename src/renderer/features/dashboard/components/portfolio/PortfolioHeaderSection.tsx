import {
  Activity,
  BookOpenCheck,
  ChartNoAxesColumn,
  GitCommitHorizontal,
} from "lucide-react";
import { ContributionHeatmap } from "../../../../components/charts/DashboardCharts";
import { SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type PortfolioHeaderSectionProps = {
  portfolio: DashboardController["portfolio"];
};

const skillRowAccent = "bg-emerald-500";
const learningRowAccent = "bg-blue-500";

function PortfolioLinearMetric({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: number;
  accentClassName: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-[12px] font-semibold text-slate-600">
        <span>{label}</span>
        <span className="text-slate-400">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={cn("h-2 rounded-full", accentClassName)}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export function PortfolioHeaderSection({
  portfolio,
}: PortfolioHeaderSectionProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1fr_1fr]">
      <SurfaceCard className="min-h-[248px] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[28px] font-black text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
            {portfolio.data.profile.initials}
          </div>
          <div>
            <h3 className="text-[15px] font-black text-slate-900">{portfolio.data.profile.name}</h3>
            <p className="mt-1 text-[13px] text-slate-400">{portfolio.data.profile.handle}</p>
          </div>
        </div>
        <div className="mt-28 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between gap-3 text-[13px] font-semibold text-slate-700">
            <span>포트폴리오 완성도</span>
            <span className="text-blue-600">{portfolio.data.readiness}%</span>
          </div>
          <div className="mt-2 h-2.5 rounded-full bg-slate-100">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: `${Math.max(0, Math.min(100, portfolio.data.readiness))}%` }}
            />
          </div>
          <p className="mt-2 text-[12px] text-slate-400">
            최근 업데이트 {portfolio.data.resumeUpdated}
          </p>
        </div>
      </SurfaceCard>

      <SurfaceCard className="min-h-[248px] p-5">
        <div className="flex items-center gap-2 text-slate-900">
          <ChartNoAxesColumn className="h-4 w-4 text-emerald-500" />
          <h3 className="text-[15px] font-black">핵심 기술 스택</h3>
        </div>
        <div className="mt-6 space-y-4">
          {portfolio.data.skills.map((skill) => (
            <PortfolioLinearMetric
              key={skill.name}
              label={skill.name}
              value={skill.level}
              accentClassName={skillRowAccent}
            />
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="min-h-[248px] p-5">
        <div className="flex items-center gap-2 text-slate-900">
          <BookOpenCheck className="h-4 w-4 text-blue-500" />
          <h3 className="text-[15px] font-black">학습 중인 기술</h3>
        </div>
        <div className="mt-6 space-y-5">
          {portfolio.data.learningSkills.map((skill) => (
            <div key={skill.name}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[13px] font-semibold text-slate-700">{skill.name}</span>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">
                  {skill.status}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className={learningRowAccent + " h-2 rounded-full"}
                  style={{ width: `${Math.max(0, Math.min(100, skill.progress))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="min-h-[248px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-900">
            <GitCommitHorizontal className="h-4 w-4 text-emerald-500" />
            <h3 className="text-[15px] font-black">커밋 활동</h3>
          </div>
          <div className="text-right">
            <p className="text-[32px] font-black leading-none text-slate-900">{portfolio.data.githubCommits}</p>
          </div>
        </div>
        <div className="mt-5 rounded-[20px] bg-slate-50/70 p-3">
          <ContributionHeatmap values={portfolio.contributionHeatmapSeed} />
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-400">
          <Activity className="h-3.5 w-3.5" />
          <span>꾸준한 학습 로그와 구현 기록을 한 번에 보여줍니다.</span>
        </div>
      </SurfaceCard>
    </div>
  );
}
