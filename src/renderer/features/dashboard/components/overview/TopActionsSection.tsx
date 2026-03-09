import { CheckSquare2, Rocket } from "lucide-react";
import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type TopActionsSectionProps = {
  overview: DashboardController["overview"];
};

export function TopActionsSection({
  overview,
}: TopActionsSectionProps) {
  const actions = overview.topActions.slice(0, 5);

  return (
    <SurfaceCard className="h-fit overflow-hidden border-white/50 bg-white/60 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl xl:h-[600px] xl:self-start">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">오늘 처리할 TOP 5</h3>
          <p className="mt-1 text-sm text-slate-500">
            우선순위와 마감 일정을 함께 고려한 액션입니다. 스크롤로 빠르게 훑어보세요.
          </p>
        </div>
        <Rocket className="h-5 w-5 text-cyan-600" />
      </div>

      {actions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          현재 필터에 맞는 액션이 없습니다.
        </div>
      ) : (
        <ScrollArea className="h-[360px] pr-2 xl:h-[495px]">
          <div className="space-y-3">
            {actions.map((posting, index) => (
              <div
                key={posting.id}
                className="rounded-[22px] border border-white/60 bg-white/55 p-3.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => overview.toggleOverviewTask(posting.id)}
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px]",
                      overview.taskChecked[posting.id]
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white/80 text-transparent",
                    )}
                  >
                    <CheckSquare2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill className="border-slate-200 bg-white/80 text-slate-700">
                        #{index + 1}
                      </Pill>
                      <span
                        className={cn(
                          "text-sm font-semibold text-slate-800",
                          overview.taskChecked[posting.id] && "line-through text-slate-400",
                        )}
                      >
                        {posting.company} {posting.title}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <Pill className="border-slate-200 bg-white/80 text-slate-700">
                        {posting.stageLabel}
                      </Pill>
                      <Pill className="border-amber-200 bg-amber-50/90 text-amber-700">
                        우선순위 {posting.priority}
                      </Pill>
                      <Pill className="border-rose-200 bg-rose-50/90 text-rose-700">
                        {posting.daysLeft <= 0 ? "D-Day" : `D-${posting.daysLeft}`}
                      </Pill>
                      <Pill className="border-cyan-200 bg-cyan-50/90 text-cyan-700">
                        {posting.expectedDateLabel}
                      </Pill>
                    </div>

                    <p className="mt-2 text-sm font-medium text-slate-600">{posting.nextActionLabel}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{posting.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </SurfaceCard>
  );
}
