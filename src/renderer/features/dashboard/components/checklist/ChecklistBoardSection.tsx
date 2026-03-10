import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { formatDueBadge, getChecklistTone, getPostingStageTone } from "../viewUtils";

type ChecklistBoardSectionProps = {
  checklist: DashboardController["checklist"];
};

function formatDeadline(deadline: string) {
  const [year, month, day] = deadline.split("-");

  if (!year || !month || !day) {
    return deadline;
  }

  return `${year}.${month}.${day}`;
}

export function ChecklistBoardSection({
  checklist,
}: ChecklistBoardSectionProps) {
  const { selectedPosting, selectedProgress } = checklist;

  return (
    <SurfaceCard className="h-full min-h-[920px] overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,247,251,0.92))] p-5 sm:p-6">
      <div className="rounded-[30px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,1),_rgba(247,250,252,0.96))] p-5 shadow-[0_20px_46px_rgba(148,163,184,0.12)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[30px] font-black tracking-[-0.04em] text-slate-900">{selectedPosting.company}</p>
            <p className="mt-1 text-sm text-slate-500">{selectedPosting.title}</p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">{selectedPosting.summary}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white/90 px-4 py-3 text-right shadow-[0_12px_30px_rgba(148,163,184,0.12)]">
            <p className="text-sm font-bold text-slate-900">완성률 {selectedProgress.completionRate}%</p>
            <p className="mt-1 text-sm text-slate-500">
              마감 {formatDueBadge(selectedPosting.daysLeft)} · {formatDeadline(selectedPosting.deadline)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[1fr_1fr_0.9fr]">
          <div className="rounded-[22px] border border-slate-200 bg-white/90 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">진행 단계</p>
            <div className="mt-3">
              <Pill className={cn("border", getPostingStageTone(selectedPosting.stage))}>{selectedPosting.stage}</Pill>
            </div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white/90 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">완료 항목</p>
            <p className="mt-3 text-lg font-black tracking-[-0.03em] text-slate-900">
              {selectedProgress.doneCount} / {selectedProgress.totalCount}
            </p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white/90 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">우선순위</p>
            <p className="mt-3 text-lg font-black tracking-[-0.03em] text-slate-900">{selectedPosting.priority}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {checklist.checklistItems.map((item) => (
          <article
            key={item.id}
            className={cn(
              "rounded-[30px] border px-4 py-4 shadow-[0_18px_40px_rgba(148,163,184,0.1)] transition-all sm:px-5 sm:py-5",
              item.blocked
                ? "border-rose-200 bg-rose-50/40"
                : item.done
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-slate-200/80 bg-white/92",
            )}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => checklist.toggleChecklistItemDone(item.id)}
                  className={cn(
                    "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition",
                    item.done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white text-transparent hover:border-cyan-300",
                  )}
                >
                  ✓
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={cn("text-[20px] font-black tracking-[-0.03em] text-slate-900", item.done && "text-slate-400 line-through")}>
                      {item.label}
                    </p>
                    <Pill className={cn("border", getChecklistTone(item.category))}>{item.category}</Pill>
                    {item.blocked ? <Pill className="border-rose-200 bg-rose-50 text-rose-700">블로커</Pill> : null}
                  </div>
                </div>
              </div>
              <textarea
                value={item.note}
                onChange={(event) => checklist.updateChecklistItemNote(item.id, event.target.value)}
                className="min-h-[86px] w-full rounded-[22px] border border-slate-200 bg-white/90 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-cyan-300"
                placeholder="메모, 진행 상황, 확인할 점을 적어 두세요."
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => checklist.toggleChecklistItemBlocked(item.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                    item.blocked
                      ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {item.blocked ? "블로커 해제" : "블로커 표시"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}
