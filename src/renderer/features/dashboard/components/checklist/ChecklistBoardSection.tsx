import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { getChecklistTone } from "../viewUtils";

type ChecklistBoardSectionProps = {
  checklist: DashboardController["checklist"];
};

export function ChecklistBoardSection({
  checklist,
}: ChecklistBoardSectionProps) {
  return (
    <SurfaceCard className="p-5">
      <h3 className="mb-4 font-semibold text-slate-900">체크리스트</h3>
      <div className="space-y-4">
        {checklist.checklistItems.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start gap-3">
              <button
                type="button"
                onClick={() => checklist.toggleChecklistItemDone(item.id)}
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px]",
                  item.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-300 bg-white text-transparent",
                )}
              >
                ✓
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className={cn("border", getChecklistTone(item.category))}>{item.category}</Pill>
                  {item.blocked ? (
                    <Pill className="border-rose-200 bg-rose-50 text-rose-700">블로킹</Pill>
                  ) : null}
                </div>
                <p className={cn("mt-3 font-semibold text-slate-800", item.done && "line-through text-slate-400")}>
                  {item.label}
                </p>
                <textarea
                  value={item.note}
                  onChange={(event) => checklist.updateChecklistItemNote(item.id, event.target.value)}
                  className="mt-3 min-h-[96px] w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-cyan-300"
                  placeholder="메모, 진행 상황, 확인할 점을 적어 두세요."
                />
              </div>
              <button
                type="button"
                onClick={() => checklist.toggleChecklistItemBlocked(item.id)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                  item.blocked
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {item.blocked ? "블로킹 해제" : "블로킹 표시"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
