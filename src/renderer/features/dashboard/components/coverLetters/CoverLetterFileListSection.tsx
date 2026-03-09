import {
  CheckSquare,
  FilePlus2,
  FileText,
  FolderOpen,
  RefreshCcw,
  Square,
  Trash2,
} from "lucide-react";
import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type CoverLetterFileListSectionProps = {
  coverLetters: DashboardController["coverLetters"];
};

export function CoverLetterFileListSection({
  coverLetters,
}: CoverLetterFileListSectionProps) {
  const phaseLabel = coverLetters.isDeletingCoverLetterFiles
    ? "삭제 중"
    : coverLetters.coverLetterSync.phase === "loading"
      ? "불러오는 중"
      : coverLetters.coverLetterSync.phase === "saving"
        ? "저장 중"
        : coverLetters.coverLetterSync.phase === "error"
          ? "오류"
          : "준비됨";
  const syncButtonBusy =
    coverLetters.isSyncingCoverLetterFiles || coverLetters.isDeletingCoverLetterFiles;
  const createButtonBusy =
    coverLetters.isCreatingCoverLetterDraft || coverLetters.isDeletingCoverLetterFiles;
  const deleteButtonBusy = coverLetters.isDeletingCoverLetterFiles;
  const selectedCount = coverLetters.selectedCoverLetterNames.length;
  const allSelected =
    coverLetters.coverLetterFiles.length > 0 &&
    selectedCount === coverLetters.coverLetterFiles.length;

  return (
    <SurfaceCard className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
              <FolderOpen className="h-4 w-4 text-blue-500" />
              자기소개서 파일
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {coverLetters.coverLetterConfig
                ? `${coverLetters.coverLetterConfig.relativePath} / ${coverLetters.coverLetterConfig.namingPattern}`
                : "설정 정보를 아직 불러오지 못했습니다."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={syncButtonBusy}
              onClick={() => void coverLetters.syncCoverLetterFiles()}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12",
                  syncButtonBusy && "animate-spin",
                )}
              />
              {syncButtonBusy ? "동기화 중..." : "목록 동기화"}
            </button>
            <button
              type="button"
              disabled={createButtonBusy}
              onClick={() => void coverLetters.createCoverLetterDraft()}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-[1px] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <span className="pointer-events-none absolute inset-0 bg-white/0 transition duration-200 group-hover:bg-white/5" />
              <FilePlus2
                className={cn(
                  "relative h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110",
                  createButtonBusy && "animate-pulse",
                )}
              />
              <span className="relative">{createButtonBusy ? "초안 생성 중..." : "새 초안"}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="border-b border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-500">
        상태: {phaseLabel}
        {coverLetters.coverLetterSync.message ? ` / ${coverLetters.coverLetterSync.message}` : ""}
      </div>
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[12px] font-semibold text-slate-600">
            선택 {selectedCount}개
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => coverLetters.toggleSelectAllCoverLetters()}
              disabled={coverLetters.coverLetterFiles.length === 0 || deleteButtonBusy}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {allSelected ? (
                <CheckSquare className="h-3.5 w-3.5 text-cyan-600" />
              ) : (
                <Square className="h-3.5 w-3.5 text-slate-500" />
              )}
              {allSelected ? "전체 해제" : "전체 선택"}
            </button>
            <button
              type="button"
              disabled={selectedCount === 0 || deleteButtonBusy}
              onClick={() => void coverLetters.deleteSelectedCoverLetterFiles()}
              className="group inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-100 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-105",
                  deleteButtonBusy && "animate-pulse",
                )}
              />
              {deleteButtonBusy ? "삭제 중..." : "선택 삭제"}
            </button>
          </div>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1 p-2">
        <div className="space-y-2">
          {coverLetters.coverLetterFiles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              불러온 자기소개서 파일이 없습니다.
            </div>
          ) : (
            coverLetters.coverLetterFiles.map((file) => {
              const isSelected = coverLetters.selectedCoverLetterName === file.name;
              const isChecked = coverLetters.selectedCoverLetterNames.includes(file.name);

              return (
                <div
                  key={file.name}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-3 transition",
                    isSelected
                      ? "border-cyan-300 bg-cyan-50/50"
                      : "border-transparent bg-white hover:bg-slate-50",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => coverLetters.toggleCoverLetterSelection(file.name)}
                    disabled={deleteButtonBusy}
                    className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:scale-105 hover:border-cyan-200 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`${file.title} 선택`}
                  >
                    {isChecked ? (
                      <CheckSquare className="h-4 w-4 text-cyan-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => coverLetters.setSelectedCoverLetterName(file.name)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
                          <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                          <span className="truncate">{file.title}</span>
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-500">{file.name}</p>
                      </div>
                    </div>
                  </button>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Pill
                      className={cn(
                        file.isValid
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700",
                      )}
                    >
                      {file.isValid ? "정상" : "점검 필요"}
                    </Pill>
                    <button
                      type="button"
                      disabled={deleteButtonBusy}
                      onClick={() => void coverLetters.deleteCoverLetterFile(file.name)}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-rose-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-50 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                      삭제
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </SurfaceCard>
  );
}
