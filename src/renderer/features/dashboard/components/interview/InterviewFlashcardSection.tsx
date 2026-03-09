import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type InterviewFlashcardSectionProps = {
  interview: DashboardController["interview"];
};

export function InterviewFlashcardSection({
  interview,
}: InterviewFlashcardSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">면접 플래시카드</h3>
          <p className="mt-1 text-sm text-slate-500">질문-답변 카드를 넘기며 답변 밀도를 올립니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => interview.setFlashcardMode("default")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              interview.flashcardMode === "default"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            기본
          </button>
          <button
            type="button"
            onClick={() => interview.setFlashcardMode("shuffled")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              interview.flashcardMode === "shuffled"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            재정렬
          </button>
        </div>
      </div>
      {interview.activeFlashcard ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
          <Pill className="border-slate-200 bg-white text-slate-700">
            {interview.activeFlashcard.category}
          </Pill>
          <p className="mt-4 text-xl font-semibold text-slate-900">{interview.activeFlashcard.q}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{interview.activeFlashcard.a}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => interview.setActiveFlashcardIndex(Math.max(0, interview.activeFlashcardIndex - 1))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() =>
                interview.setActiveFlashcardIndex(
                  Math.min(interview.flashcardDeck.length - 1, interview.activeFlashcardIndex + 1),
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              다음
            </button>
            <button
              type="button"
              onClick={() => interview.recordFlashcardFeedback("hard")}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700"
            >
              어려움
            </button>
            <button
              type="button"
              onClick={() => interview.recordFlashcardFeedback("easy")}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
            >
              쉬움
            </button>
          </div>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
