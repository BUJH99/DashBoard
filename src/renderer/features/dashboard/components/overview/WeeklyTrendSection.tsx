import { Sparkline } from "../../../../components/charts/DashboardCharts";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type WeeklyTrendSectionProps = {
  overview: DashboardController["overview"];
};

export function WeeklyTrendSection({
  overview,
}: WeeklyTrendSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">주간 추이</h3>
          <p className="mt-1 text-sm text-slate-500">주차별 지원 수와 합격 수를 빠르게 비교합니다.</p>
        </div>
        <Pill className="border-slate-200 bg-slate-100 text-slate-700">최근 6주</Pill>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {overview.weeklyTrend.map((item) => (
          <div key={item.week} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-slate-800">{item.week}</p>
              <Pill className="border-slate-200 bg-slate-100 text-slate-700">지원 {item.applications}건</Pill>
            </div>
            <Sparkline
              data={[item.applications, item.passes, item.applications + item.passes]}
              strokeColor="#10b981"
            />
            <p className="mt-3 text-sm text-slate-500">합격 {item.passes}건</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
