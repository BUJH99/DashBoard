import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type AnalyticsInsightsSectionProps = {
  overview: DashboardController["overview"];
};

export function AnalyticsInsightsSection({
  overview,
}: AnalyticsInsightsSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">분석 메모</h3>
        <p className="mt-1 text-sm text-slate-500">최근 지원 흐름에서 눈에 띄는 해석 포인트입니다.</p>
      </div>
      <div className="space-y-3">
        {overview.analyticsInsights.map((insight) => (
          <div key={insight.title} className="rounded-2xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-800">{insight.title}</p>
            <p className="mt-2 text-sm text-slate-500">{insight.summary}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
