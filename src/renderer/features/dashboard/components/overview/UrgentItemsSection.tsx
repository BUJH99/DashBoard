import { AlertTriangle } from "lucide-react";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type UrgentItemsSectionProps = {
  overview: DashboardController["overview"];
};

export function UrgentItemsSection({
  overview,
}: UrgentItemsSectionProps) {
  const urgentItems = overview.urgentItems.slice(0, 4);

  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">임박 공고 및 전형</h3>
          <p className="mt-1 text-sm text-slate-500">7일 이내 대응해야 하는 항목만 추렸습니다.</p>
        </div>
        <AlertTriangle className="h-5 w-5 text-rose-500" />
      </div>

      {urgentItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          현재 필터 기준으로 7일 이내 임박한 항목이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {urgentItems.map((item) => (
            <div key={item.postingId} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-slate-900">{item.company}</p>
                  <p className="mt-1 text-sm font-medium text-slate-600">{item.title}</p>
                </div>
                <Pill className="border-rose-200 bg-rose-50 text-rose-700">{item.dueBadge}</Pill>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Pill className="border-slate-200 bg-slate-100 text-slate-700">{item.stageLabel}</Pill>
                <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">{item.dueContext}</Pill>
              </div>

              <p className="mt-3 text-sm text-slate-500">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
