import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PortfolioNotesSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioNotesSection({
  portfolio,
}: PortfolioNotesSectionProps) {
  return (
    <SurfaceCard className="p-5">
      <h3 className="font-semibold text-slate-900">정리 노트</h3>
      <div className="mt-4 space-y-3">
        {portfolio.data.studyNotes.map((note) => (
          <div key={note.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-800">{note.title}</p>
              <Pill className="border-slate-200 bg-slate-100 text-slate-700">{note.category}</Pill>
            </div>
            <p className="mt-2 text-sm text-slate-500">{note.preview}</p>
            <p className="mt-3 text-xs text-slate-400">{note.date}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
