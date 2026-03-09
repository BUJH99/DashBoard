import { FileText, FolderOpen } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type CoverLetterFileListSectionProps = {
  coverLetters: DashboardController["coverLetters"];
};

export function CoverLetterFileListSection({
  coverLetters,
}: CoverLetterFileListSectionProps) {
  return (
    <SurfaceCard className="overflow-hidden">
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
              onClick={() => void coverLetters.syncCoverLetterFiles()}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              목록 동기화
            </button>
            <button
              type="button"
              onClick={() => coverLetters.resetCoverLetterDraft()}
              className="rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
            >
              새 초안
            </button>
          </div>
        </div>
      </div>
      <div className="border-b border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-500">
        상태: {coverLetters.coverLetterSync.phase}
        {coverLetters.coverLetterSync.message ? ` / ${coverLetters.coverLetterSync.message}` : ""}
      </div>
      <div className="space-y-2 p-2">
        {coverLetters.coverLetterFiles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            불러온 자기소개서 파일이 없습니다.
          </div>
        ) : (
          coverLetters.coverLetterFiles.map((file) => (
            <button
              key={file.name}
              type="button"
              onClick={() => coverLetters.setSelectedCoverLetterName(file.name)}
              className={cn(
                "w-full rounded-2xl border p-3 text-left transition",
                coverLetters.selectedCoverLetterName === file.name
                  ? "border-cyan-300 bg-cyan-50/50"
                  : "border-transparent hover:bg-slate-50",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
                    <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                    <span className="truncate">{file.title}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{file.name}</p>
                </div>
                <Pill
                  className={cn(
                    file.isValid
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700",
                  )}
                >
                  {file.isValid ? "정상" : "점검 필요"}
                </Pill>
              </div>
            </button>
          ))
        )}
      </div>
    </SurfaceCard>
  );
}
