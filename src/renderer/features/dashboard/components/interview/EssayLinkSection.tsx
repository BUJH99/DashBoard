import { BookOpen, Link2 } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type EssayLinkSectionProps = {
  essays: DashboardController["essays"];
  linkedExperiences: DashboardController["interview"]["experienceLibrary"];
};

const ESSAY_STATUS_STYLES: Record<string, string> = {
  "초안 완료": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "수정 필요": "border-amber-200 bg-amber-50 text-amber-700",
  "개요만 작성": "border-slate-200 bg-slate-100 text-slate-600",
};

const ESSAY_COMPANY_STYLES: Record<string, string> = {
  "삼성전자 DS": "border-slate-200 bg-slate-100 text-slate-700",
  리벨리온: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  SK하이닉스: "border-cyan-200 bg-cyan-50 text-cyan-700",
};

function getEssayStatusTone(status: string) {
  return ESSAY_STATUS_STYLES[status] ?? "border-slate-200 bg-slate-100 text-slate-600";
}

function getEssayCompanyTone(company: string) {
  return ESSAY_COMPANY_STYLES[company] ?? "border-slate-200 bg-slate-100 text-slate-700";
}

export function EssayLinkSection({
  essays,
  linkedExperiences,
}: EssayLinkSectionProps) {
  const orderedEssays = [
    essays.selectedEssay,
    ...essays.essayQuestions.filter((essay) => essay.id !== essays.selectedEssay.id),
  ];

  return (
    <div className="grid h-full gap-6 xl:min-h-[760px] xl:grid-rows-[1.1fr_0.82fr]">
      <SurfaceCard className="overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.9))] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">Answer Library</Pill>
            <h3 className="mt-4 text-[28px] font-black tracking-[-0.03em] text-slate-900">자소서 문항 라이브러리</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              지원 문항을 카드형 라이브러리로 정리해서, 면접 답변과 연결되는 서사 흐름을 바로 확인합니다.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white/90 px-4 py-3 shadow-[0_16px_36px_rgba(148,163,184,0.12)]">
            <BookOpen className="h-5 w-5 text-cyan-600" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">선택 문항</p>
              <p className="text-sm font-bold text-slate-900">{essays.selectedEssay.company}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {orderedEssays.map((essay) => {
            const isSelected = essay.id === essays.selectedEssay.id;

            return (
              <button
                key={essay.id}
                type="button"
                onClick={() => essays.setSelectedEssayId(essay.id)}
                className={cn(
                  "w-full rounded-[28px] border px-4 py-4 text-left transition-all duration-200 sm:px-5 sm:py-5",
                  isSelected
                    ? "border-cyan-300 bg-cyan-50/70 shadow-[0_20px_44px_rgba(34,211,238,0.14)]"
                    : "border-slate-200/80 bg-white/88 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill className={cn("bg-white", getEssayCompanyTone(essay.company))}>{essay.company}</Pill>
                      <Pill className="border-slate-200 bg-white text-slate-600">{essay.type}</Pill>
                      <Pill className={getEssayStatusTone(essay.status)}>{essay.status}</Pill>
                    </div>
                    <p className="mt-3 text-[17px] font-bold tracking-[-0.02em] text-slate-900">{essay.question}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{essay.draft}</p>
                  </div>
                  <div
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold",
                      isSelected
                        ? "border-cyan-300 bg-white text-cyan-700"
                        : "border-slate-200 bg-slate-50 text-slate-500",
                    )}
                  >
                    {essay.posting}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </SurfaceCard>

      <SurfaceCard className="overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.9))] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Pill className="border-violet-200 bg-violet-50 text-violet-700">Linked Experiences</Pill>
            <h3 className="mt-4 text-[24px] font-black tracking-[-0.03em] text-slate-900">문항 연결 경험</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              선택한 문항과 바로 연결되는 프로젝트와 정량 성과를 면접 답변 단위로 묶어둡니다.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            <Link2 className="h-4 w-4 text-violet-600" />
            {linkedExperiences.length}개 연결
          </div>
        </div>

        {linkedExperiences.length > 0 ? (
          <div className="mt-5 space-y-3">
            {linkedExperiences.map((experience) => (
              <article key={experience.id} className="rounded-[28px] border border-slate-200/80 bg-white/90 px-4 py-4 shadow-[0_18px_40px_rgba(148,163,184,0.1)] sm:px-5 sm:py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill className="border-violet-200 bg-violet-50 text-violet-700">{experience.category}</Pill>
                      {experience.strengths.map((strength) => (
                        <Pill key={strength} className="border-slate-200 bg-slate-100 text-slate-700">
                          {strength}
                        </Pill>
                      ))}
                    </div>
                    <p className="mt-3 text-[18px] font-bold tracking-[-0.02em] text-slate-900">{experience.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{experience.summary}</p>
                    <p className="mt-3 text-sm text-slate-500">
                      활용 기업: <span className="font-semibold text-slate-700">{experience.reusableFor.join(", ")}</span>
                    </p>
                  </div>
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">{experience.result}</Pill>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-5 py-10 text-center text-sm text-slate-500">
            아직 연결된 경험이 없습니다.
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}
