import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type InterviewFlashcardSectionProps = {
  interview: DashboardController["interview"];
};

const FLASHCARD_CATEGORY_STYLES: Record<string, string> = {
  RTL: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  검증: "border-cyan-200 bg-cyan-50 text-cyan-700",
  아키텍처: "border-violet-200 bg-violet-50 text-violet-700",
  CDC: "border-amber-200 bg-amber-50 text-amber-700",
  협업: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function getFlashcardCategoryTone(category: string) {
  return FLASHCARD_CATEGORY_STYLES[category] ?? "border-slate-200 bg-slate-100 text-slate-700";
}

function getFeedbackLabel(feedback?: "hard" | "easy") {
  if (feedback === "hard") {
    return "다시 보기";
  }

  if (feedback === "easy") {
    return "숙지 완료";
  }

  return "미표시";
}

export function InterviewFlashcardSection({
  interview,
}: InterviewFlashcardSectionProps) {
  const activeCard = interview.activeFlashcard;
  const reviewedCount = interview.flashcardDeck.filter((card) => interview.feedback[card.q]).length;
  const hardCount = interview.flashcardDeck.filter((card) => interview.feedback[card.q] === "hard").length;
  const easyCount = interview.flashcardDeck.filter((card) => interview.feedback[card.q] === "easy").length;

  const toggleFlashcardMode = () => {
    interview.setFlashcardMode(interview.flashcardMode === "default" ? "shuffled" : "default");
  };

  return (
    <SurfaceCard className="h-full min-h-[760px] overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.92))] p-5 sm:p-6">
      <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.92))] p-5 shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Pill className="border-slate-200 bg-white text-slate-600">Technical Interview Drill</Pill>
            <h3 className="mt-4 text-[28px] font-black tracking-[-0.03em] text-slate-900">전공 플래시카드</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {interview.flashcardMode === "shuffled"
                ? "셔플은 매번 달라지는 랜덤이 아니라 동일한 입력 순서를 기준으로 안정적으로 섞입니다."
                : "입력한 질문 순서를 따라 답변 흐름, 복습 상태, 설명 밀도를 차분하게 점검합니다."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill className="border-slate-200 bg-white text-slate-700">
              {interview.activeFlashcardIndex + 1} / {interview.flashcardDeck.length}
            </Pill>
            <button
              type="button"
              onClick={toggleFlashcardMode}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Shuffle className="h-4 w-4" />
              {interview.flashcardMode === "shuffled" ? "입력 순서" : "셔플 모드"}
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] border border-slate-200 bg-white/90 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">전체 카드</p>
            <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900">{interview.flashcardDeck.length}</p>
          </div>
          <div className="rounded-[22px] border border-rose-200 bg-rose-50/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">다시 보기</p>
            <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-rose-700">{hardCount}</p>
          </div>
          <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">숙지 완료</p>
            <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-emerald-700">{easyCount}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          복습 진행률 <span className="font-semibold text-slate-900">{reviewedCount}</span> / {interview.flashcardDeck.length}
        </p>
      </div>

      {activeCard ? (
        <div className="mt-5 space-y-4">
          {interview.flashcardDeck.map((card, index) => {
            const isActive = index === interview.activeFlashcardIndex;
            const feedback = interview.feedback[card.q];

            return (
              <article
                key={card.q}
                className={cn(
                  "overflow-hidden rounded-[28px] border transition-all duration-200",
                  isActive
                    ? "border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,247,251,0.96))] shadow-[0_22px_50px_rgba(148,163,184,0.15)]"
                    : "border-slate-200/80 bg-white/90 hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(148,163,184,0.12)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => interview.setActiveFlashcardIndex(index)}
                  className="w-full px-4 py-4 text-left sm:px-5 sm:py-5"
                  aria-expanded={isActive}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill className={cn("bg-white", getFlashcardCategoryTone(card.category))}>{card.category}</Pill>
                        {feedback ? (
                          <Pill
                            className={cn(
                              "bg-white",
                              feedback === "hard"
                                ? "border-rose-200 text-rose-600"
                                : "border-emerald-200 text-emerald-600",
                            )}
                          >
                            {getFeedbackLabel(feedback)}
                          </Pill>
                        ) : null}
                      </div>
                      <p className="mt-3 text-[17px] font-bold tracking-[-0.02em] text-slate-900 sm:text-[20px]">
                        {card.q}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all",
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-400",
                      )}
                    >
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isActive && "rotate-180")} />
                    </span>
                  </div>
                </button>

                {isActive ? (
                  <div className="border-t border-slate-200/80 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                    <div className="flex gap-3 rounded-[24px] border border-slate-200 bg-white/90 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">{card.a}</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <p className="text-sm text-slate-500">
                        복습 상태:{" "}
                        <span className="font-semibold text-slate-900">{getFeedbackLabel(feedback)}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => interview.setActiveFlashcardIndex(Math.max(0, interview.activeFlashcardIndex - 1))}
                          disabled={interview.activeFlashcardIndex === 0}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          이전
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            interview.setActiveFlashcardIndex(
                              Math.min(interview.flashcardDeck.length - 1, interview.activeFlashcardIndex + 1),
                            )
                          }
                          disabled={interview.activeFlashcardIndex === interview.flashcardDeck.length - 1}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          다음
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => interview.recordFlashcardFeedback("hard")}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <RotateCcw className="h-4 w-4" />
                          다시 보기
                        </button>
                        <button
                          type="button"
                          onClick={() => interview.recordFlashcardFeedback("easy")}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          숙지 완료
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </SurfaceCard>
  );
}
