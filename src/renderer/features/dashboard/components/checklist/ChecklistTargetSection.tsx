import { GlassSelect } from "../../../../components/ui/GlassSelect";
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
      <GlassSelect
        ariaLabel="지원 체크리스트 대상 공고 선택"
        value={String(checklist.selectedPosting.id)}
        onChange={(value) => checklist.setSelectedPostingId(Number(value))}
        options={companies.filteredPostings.map((posting) => ({
          value: String(posting.id),
          label: `${posting.company} / ${posting.title}`,
        }))}
        tone="violet"
        size="sm"
        className="mt-4"
      />
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <p className="font-semibold text-slate-800">{checklist.selectedPosting.company}</p>
        <p className="mt-1 text-sm text-slate-500">{checklist.selectedPosting.summary}</p>
      </div>
    </SurfaceCard>
  );
}
