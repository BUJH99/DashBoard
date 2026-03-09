import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PostingCardsSectionProps = {
  title: string;
  description?: string;
  postings: DashboardController["companies"]["relatedPostings"];
  badgeMode: "priority" | "deadline";
  selectedPostingId?: number;
  onSelectPosting?: (postingId: number) => void;
};

export function PostingCardsSection({
  title,
  description,
  postings,
  badgeMode,
  selectedPostingId,
  onSelectPosting,
}: PostingCardsSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      <div className="grid gap-3">
        {postings.map((posting) => (
          <button
            key={posting.id}
            type="button"
            onClick={() => onSelectPosting?.(posting.id)}
            className="rounded-2xl text-left"
          >
            <div
              className={[
                "rounded-2xl border p-4 transition",
                selectedPostingId === posting.id
                  ? "border-cyan-300 bg-cyan-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{posting.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{posting.summary}</p>
                </div>
                <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                  {badgeMode === "priority" ? `우선순위 ${posting.priority}` : `D-${posting.daysLeft}`}
                </Pill>
              </div>
            </div>
          </button>
        ))}
      </div>
    </SurfaceCard>
  );
}
