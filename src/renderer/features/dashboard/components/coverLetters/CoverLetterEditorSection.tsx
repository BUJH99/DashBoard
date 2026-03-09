import { buildCoverLetterFileName } from "../../../coverLetters/utils";
import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type CoverLetterEditorSectionProps = {
  coverLetters: DashboardController["coverLetters"];
};

export function CoverLetterEditorSection({
  coverLetters,
}: CoverLetterEditorSectionProps) {
  const draft = coverLetters.coverLetterDraft;

  return (
    <SurfaceCard className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900">{draft.meta.title || "새 자기소개서 초안"}</h3>
            <p className="mt-1 truncate text-[13px] text-slate-500">
              {draft.originalName ?? buildCoverLetterFileName(draft.meta)}
            </p>
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

      <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="grid gap-1 text-[12px] xl:col-span-2">
          <span className="font-semibold text-slate-700">제목</span>
          <input
            value={draft.meta.title}
            onChange={(event) =>
              coverLetters.setCoverLetterDraft((current) => ({
                ...current,
                meta: { ...current.meta, title: event.target.value },
              }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          />
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-slate-700">기업 ID</span>
          <input
            value={draft.meta.companyId}
            onChange={(event) =>
              coverLetters.setCoverLetterDraft((current) => ({
                ...current,
                meta: { ...current.meta, companyId: event.target.value },
              }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          />
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-slate-700">기업명</span>
          <input
            value={draft.meta.companyName}
            onChange={(event) =>
              coverLetters.setCoverLetterDraft((current) => ({
                ...current,
                meta: { ...current.meta, companyName: event.target.value },
              }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          />
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-slate-700">슬러그</span>
          <input
            value={draft.meta.companySlug}
            onChange={(event) =>
              coverLetters.setCoverLetterDraft((current) => ({
                ...current,
                meta: { ...current.meta, companySlug: event.target.value },
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
              coverLetters.setCoverLetterDraft((current) => ({
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
              coverLetters.setCoverLetterDraft((current) => ({
                ...current,
                meta: { ...current.meta, docType: event.target.value },
              }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          />
        </label>
        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-slate-700">상태</span>
          <input
            value={draft.meta.status}
            onChange={(event) =>
              coverLetters.setCoverLetterDraft((current) => ({
                ...current,
                meta: { ...current.meta, status: event.target.value },
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
              coverLetters.setCoverLetterDraft((current) => ({
                ...current,
                meta: { ...current.meta, tags: event.target.value },
              }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          />
        </label>
      </div>

      <div className="border-t border-slate-200 p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => coverLetters.fillCoverLetterDraftFromSelectedCompany()}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            선택 기업 정보 채우기
          </button>
          <button
            type="button"
            onClick={() => void coverLetters.saveCoverLetterFile()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            자기소개서 저장
          </button>
        </div>
        <textarea
          value={draft.content}
          onChange={(event) =>
            coverLetters.setCoverLetterDraft((current) => ({
              ...current,
              content: event.target.value,
            }))
          }
          className="min-h-[280px] w-full rounded-3xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-cyan-300"
        />
      </div>
    </SurfaceCard>
  );
}
