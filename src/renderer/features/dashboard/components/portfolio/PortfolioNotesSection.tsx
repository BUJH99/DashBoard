import { NotebookPen } from "lucide-react";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type PortfolioNotesSectionProps = {
  portfolio: DashboardController["portfolio"];
};

function getNoteTone(category: string) {
  if (category === "Chisel") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (category === "Architecture") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }
  return "border-violet-200 bg-violet-50 text-violet-700";
}

export function PortfolioNotesSection({
  portfolio,
}: PortfolioNotesSectionProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-slate-900">
        <NotebookPen className="h-4 w-4 text-amber-500" />
        <h3 className="text-[15px] font-black">학습 복습 노트</h3>
      </div>
      <div className="space-y-4">
        {portfolio.data.studyNotes.map((note) => (
          <article
            key={note.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className={cn("rounded-full border px-3 py-1.5 text-[11px] font-bold", getNoteTone(note.category))}>
                {note.category}
              </span>
              <span className="text-[12px] text-slate-400">{note.date}</span>
            </div>
            <h4 className="text-[16px] font-black text-slate-900">{note.title}</h4>
            <p className="mt-3 text-[14px] leading-7 text-slate-500">{note.preview}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
