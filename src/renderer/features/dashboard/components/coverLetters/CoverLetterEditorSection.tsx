import { Building2, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { GlassSelect } from "../../../../components/ui/GlassSelect";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import {
  buildCoverLetterFileName,
  buildCoverLetterMarkdown,
  createCoverLetterQuestion,
} from "../../../coverLetters/utils";
import type { CoverLetterDraft } from "../../types";
import type { DashboardController } from "../../useDashboardController";

type CoverLetterSectionProps = {
  coverLetters: DashboardController["coverLetters"];
};

function buildDraftUpdater(
  coverLetters: DashboardController["coverLetters"],
): (updater: (current: CoverLetterDraft) => CoverLetterDraft) => void {
  return (updater) => {
    coverLetters.setCoverLetterDraft((current) => {
      const nextDraft = updater(current);

      return {
        ...nextDraft,
        content: buildCoverLetterMarkdown(nextDraft.meta.title, nextDraft.questionItems),
      };
    });
  };
}

export function CoverLetterPresetSection({
  coverLetters,
}: CoverLetterSectionProps) {
  return (
    <SurfaceCard className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[17px] font-black text-slate-900">기업 선택 및 문항 프리셋</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
              선택 기업에 맞는 기본 문항을 관리하고, 현재 초안에 바로 반영할 수 있습니다.
            </p>
          </div>
          <Pill className="border-blue-200 bg-blue-50 text-blue-700">
            프리셋 {coverLetters.companyQuestionPresets.length}개
          </Pill>
        </div>
      </div>

      <div className="border-b border-slate-200 p-5">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <GlassSelect
            label="선택 기업"
            ariaLabel="자기소개서 대상 기업 선택"
            value={String(coverLetters.selectedCompanyId)}
            options={coverLetters.companyOptions}
            onChange={(value) => coverLetters.setSelectedCompanyId(Number(value))}
            tone="blue"
            size="sm"
            icon={<Building2 className="h-4 w-4" />}
            menuMaxHeightClassName="max-h-[320px]"
          />
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4 shadow-[0_12px_28px_rgba(148,163,184,0.08)]">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400">CURRENT PRESET</p>
            <p className="mt-2 text-[15px] font-bold text-slate-900">{coverLetters.selectedCompanyName}</p>
            <p className="mt-1 text-[12px] text-slate-500">
              기본 문항 {coverLetters.companyQuestionPresets.length}개
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => coverLetters.addCompanyQuestionPreset()}
            className="group inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 active:translate-y-[1px]"
          >
            <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            프리셋 문항 추가
          </button>
          <button
            type="button"
            onClick={() => coverLetters.applyCompanyQuestionPresetsToDraft()}
            className="group inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/80 px-4 py-2 text-sm font-semibold text-violet-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-100 active:translate-y-[1px]"
          >
            <Sparkles className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            현재 초안에 프리셋 적용
          </button>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 p-5">
        <div className="grid gap-3">
          {coverLetters.companyQuestionPresets.map((prompt, index) => (
            <div
              key={`${coverLetters.selectedCompanyId}-${index}`}
              className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <Pill className="border-slate-200 bg-white text-slate-700">
                  기본 문항 {index + 1}
                </Pill>
                <button
                  type="button"
                  disabled={coverLetters.companyQuestionPresets.length <= 1}
                  onClick={() => coverLetters.removeCompanyQuestionPreset(index)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-all duration-200 hover:scale-105 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`기본 문항 ${index + 1} 삭제`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                value={prompt}
                onChange={(event) =>
                  coverLetters.updateCompanyQuestionPreset(index, event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-300"
                placeholder={`${coverLetters.selectedCompanyName} 문항을 입력하세요.`}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </SurfaceCard>
  );
}

export function CoverLetterDraftSection({
  coverLetters,
}: CoverLetterSectionProps) {
  const draft = coverLetters.coverLetterDraft;
  const resolvedFileName = draft.originalName ?? buildCoverLetterFileName(draft.meta);
  const relativeFolderPath = coverLetters.coverLetterConfig?.relativePath ?? "coverletters_md";
  const updateDraft = buildDraftUpdater(coverLetters);

  return (
    <SurfaceCard className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-black text-slate-900">
              {draft.meta.title || "새 자기소개서 초안"}
            </h3>
            <p className="mt-1 truncate text-[13px] text-slate-500">{resolvedFileName}</p>
          </div>
          <Pill
            className={cn(
              coverLetters.selectedCoverLetterRecord
                ? coverLetters.selectedCoverLetterLinked
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
                : "border-slate-200 bg-white text-slate-700",
            )}
          >
            {coverLetters.selectedCoverLetterRecord
              ? coverLetters.selectedCoverLetterLinked
                ? "선택 기업 연결됨"
                : "다른 기업 파일"
              : "새 문서"}
          </Pill>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_1fr]">
          <label className="grid gap-1 text-[12px] xl:col-span-2">
            <span className="font-semibold text-slate-700">제목</span>
            <input
              value={draft.meta.title}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  meta: { ...current.meta, title: event.target.value },
                }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-[12px]">
            <span className="font-semibold text-slate-700">직무 트랙</span>
            <input
              value={draft.meta.jobTrack}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  meta: { ...current.meta, jobTrack: event.target.value },
                }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-[12px]">
            <span className="font-semibold text-slate-700">문서 타입</span>
            <input
              value={draft.meta.docType}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  meta: { ...current.meta, docType: event.target.value },
                }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-[12px] xl:col-span-2">
            <span className="font-semibold text-slate-700">태그</span>
            <input
              value={draft.meta.tags}
              onChange={(event) =>
                updateDraft((current) => ({
                  ...current,
                  meta: { ...current.meta, tags: event.target.value },
                }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
        </div>

        <div className="mb-4 mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-[12px] text-slate-600">
          저장 위치: <span className="font-semibold text-slate-900">{relativeFolderPath}/{resolvedFileName}</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => coverLetters.fillCoverLetterDraftFromSelectedCompany()}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 active:translate-y-[1px]"
          >
            <Building2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
            선택 기업 정보 채우기
          </button>
          <button
            type="button"
            onClick={() =>
              updateDraft((current) => ({
                ...current,
                questionItems: [
                  ...current.questionItems,
                  createCoverLetterQuestion(`문항 ${current.questionItems.length + 1}`),
                ],
              }))
            }
            className="group inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50/80 px-4 py-2 text-sm font-semibold text-cyan-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-100 active:translate-y-[1px]"
          >
            <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            문항 추가
          </button>
          <button
            type="button"
            disabled={coverLetters.isSavingCoverLetterFile}
            onClick={() => void coverLetters.saveCoverLetterFile()}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-[1px] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <span className="pointer-events-none absolute inset-0 bg-white/0 transition duration-200 group-hover:bg-white/5" />
            <Save
              className={cn(
                "relative h-4 w-4 transition-transform duration-200 group-hover:scale-105",
                coverLetters.isSavingCoverLetterFile && "animate-pulse",
              )}
            />
            <span className="relative">
              {coverLetters.isSavingCoverLetterFile ? "저장 중..." : "자기소개서 저장"}
            </span>
          </button>
        </div>

        <div className="grid gap-4">
          {draft.questionItems.map((item, index) => (
            <div
              key={item.id}
              className="rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_12px_28px_rgba(148,163,184,0.08)] transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                  문항 {index + 1}
                </Pill>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-slate-500">
                    답변 {item.answer.length}자
                  </span>
                  <button
                    type="button"
                    disabled={draft.questionItems.length <= 1}
                    onClick={() =>
                      updateDraft((current) => ({
                        ...current,
                        questionItems: current.questionItems.filter((question) => question.id !== item.id),
                      }))
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-all duration-200 hover:scale-105 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`문항 ${index + 1} 삭제`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <label className="grid gap-1 text-[12px]">
                <span className="font-semibold text-slate-700">문항</span>
                <input
                  value={item.prompt}
                  onChange={(event) =>
                    updateDraft((current) => ({
                      ...current,
                      questionItems: current.questionItems.map((question) =>
                        question.id === item.id
                          ? { ...question, prompt: event.target.value }
                          : question,
                      ),
                    }))
                  }
                  className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                  placeholder="예: 지원 동기를 작성해 주세요."
                />
              </label>

              <label className="mt-3 grid gap-1 text-[12px]">
                <span className="font-semibold text-slate-700">답변</span>
                <textarea
                  value={item.answer}
                  onChange={(event) =>
                    updateDraft((current) => ({
                      ...current,
                      questionItems: current.questionItems.map((question) =>
                        question.id === item.id
                          ? { ...question, answer: event.target.value }
                          : question,
                      ),
                    }))
                  }
                  className="min-h-[180px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-300"
                  placeholder="문항별 답변을 작성하세요."
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
