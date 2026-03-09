import { Rocket } from "lucide-react";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type PriorityPostingsSectionProps = {
  overview: DashboardController["overview"];
};

export function PriorityPostingsSection({
  overview,
}: PriorityPostingsSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">이번 주 우선 공고</h2>
          <p className="mt-1 text-sm text-slate-500">
            마감과 준비도를 함께 반영한 상위 공고입니다. 체크박스로 오늘 처리한 항목을 표시할 수 있습니다.
          </p>
        </div>
        <Rocket className="h-5 w-5 text-cyan-600" />
      </div>
      <div className="space-y-3">
        {overview.priorityPostings.map((posting, index) => (
          <div key={posting.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => overview.toggleOverviewTask(posting.id)}
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px]",
                  overview.taskChecked[posting.id]
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-300 bg-white text-transparent",
                )}
              >
                ✓
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">#{index + 1}</Pill>
                  <span
                    className={cn(
                      "text-sm font-semibold text-slate-800",
                      overview.taskChecked[posting.id] && "line-through text-slate-400",
                    )}
                  >
                    {posting.company} / {posting.title}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                    우선순위 {posting.priority}
                  </Pill>
                  <Pill className="border-rose-200 bg-rose-50 text-rose-700">D-{posting.daysLeft}</Pill>
                </div>
                <p className="mt-2 text-sm text-slate-500">{posting.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
