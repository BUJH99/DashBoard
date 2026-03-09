import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type ChecklistTargetSectionProps = {
  checklist: DashboardController["checklist"];
  companies: DashboardController["companies"];
};

export function ChecklistTargetSection({
  checklist,
  companies,
}: ChecklistTargetSectionProps) {
  return (
    <SurfaceCard className="p-5">
      <h3 className="font-semibold text-slate-900">대상 공고</h3>
      <select
        value={checklist.selectedPosting.id}
        onChange={(event) => checklist.setSelectedPostingId(Number(event.target.value))}
        className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
      >
        {companies.filteredPostings.map((posting) => (
          <option key={posting.id} value={posting.id}>
            {posting.company} / {posting.title}
          </option>
        ))}
      </select>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <p className="font-semibold text-slate-800">{checklist.selectedPosting.company}</p>
        <p className="mt-1 text-sm text-slate-500">{checklist.selectedPosting.summary}</p>
      </div>
    </SurfaceCard>
  );
}
