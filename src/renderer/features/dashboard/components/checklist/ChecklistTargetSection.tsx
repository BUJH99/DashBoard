import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { formatDueBadge, getPostingStageTone } from "../viewUtils";

type ChecklistTargetSectionProps = {
  checklist: DashboardController["checklist"];
};

export function ChecklistTargetSection({
  checklist,
}: ChecklistTargetSectionProps) {
  if (checklist.postingSummaries.length === 0) {
    return (
      <SurfaceCard className="p-6">
        <p className="text-sm text-slate-500">표시할 공고가 없습니다.</p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="h-full min-h-[920px] overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,247,251,0.92))]">
      <div className="border-b border-slate-200/80 px-5 py-5">
        <h3 className="text-[22px] font-black tracking-[-0.03em] text-slate-900">공고별 제출 준비</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {checklist.postingSummaries.map((posting) => (
          <button
            key={posting.id}
            type="button"
            onClick={() => checklist.setSelectedPostingId(posting.id)}
            className={cn(
              "w-full px-5 py-5 text-left transition-all duration-200",
              posting.isSelected
                ? "bg-cyan-50/70 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.7)]"
                : "bg-white/75 hover:bg-slate-50/80",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[20px] font-black tracking-[-0.03em] text-slate-900">{posting.company}</p>
                <p className="mt-1 text-sm text-slate-500">{posting.title}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                    {formatDueBadge(posting.daysLeft)}
                  </Pill>
                  <Pill className={cn("border", getPostingStageTone(posting.stage))}>{posting.stage}</Pill>
                  {posting.blockedCount > 0 ? (
                    <Pill className="border-rose-200 bg-rose-50 text-rose-700">블로커 {posting.blockedCount}</Pill>
                  ) : null}
                </div>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-600">
                {posting.completionRate}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </SurfaceCard>
  );
}
