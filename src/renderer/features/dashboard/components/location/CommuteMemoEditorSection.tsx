import { CommuteInsightSection } from "./CommuteInsightSection";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { formatCommuteNoteSummary, hasCommuteNoteContent } from "../../../location/commuteNotes";

type CommuteMemoEditorSectionProps = {
  selectedCompany: DashboardController["companies"]["selectedCompany"];
  location: DashboardController["location"];
  dashboardStateMessage: string | null;
  onSaveDashboardState: () => void;
};

export function CommuteMemoEditorSection({
  selectedCompany,
  location,
  dashboardStateMessage,
  onSaveDashboardState,
}: CommuteMemoEditorSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <CommuteInsightSection selectedCompany={selectedCompany} />

      <div className="mt-4 rounded-2xl border border-slate-200 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">기업별 메모 입력 / 저장</p>
          <div className="flex items-center gap-2">
            <Pill className="border-slate-200 bg-slate-100 text-slate-700">{selectedCompany.name}</Pill>
            <button
              type="button"
              onClick={onSaveDashboardState}
              className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              메모 저장
            </button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">총 소요 시간</span>
            <input
              value={location.selectedCommuteNote.totalMinutes}
              onChange={(event) => location.updateCommuteNote({ totalMinutes: event.target.value })}
              placeholder="예: 55"
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">환승 횟수</span>
            <input
              value={location.selectedCommuteNote.transfers}
              onChange={(event) => location.updateCommuteNote({ transfers: event.target.value })}
              placeholder="예: 1"
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={location.selectedCommuteNote.hasBus}
              onChange={(event) => location.updateCommuteNote({ hasBus: event.target.checked })}
            />
            <span className="font-semibold text-slate-700">버스 포함</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={location.selectedCommuteNote.hasSubway}
              onChange={(event) => location.updateCommuteNote({ hasSubway: event.target.checked })}
            />
            <span className="font-semibold text-slate-700">지하철 포함</span>
          </label>
        </div>
        <textarea
          value={location.selectedCommuteNote.note}
          onChange={(event) => location.updateCommuteNote({ note: event.target.value })}
          placeholder="예: 판교역에서 도보 12분, 아침 시간엔 혼잡. 면접은 30분 여유 있게 출발."
          className="mt-4 min-h-[96px] w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300"
        />
        {hasCommuteNoteContent(location.selectedCommuteNote) ? (
          <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
            <span className="font-semibold">요약:</span> {formatCommuteNoteSummary(location.selectedCommuteNote)}
          </div>
        ) : null}
        {dashboardStateMessage ? (
          <div className="mt-3 text-xs font-medium text-slate-500">{dashboardStateMessage}</div>
        ) : null}
        <p className="mt-2 text-xs text-slate-500">
          이 메모는 저장 후 좌측 기업 목록에서 바로 상태 확인용으로 다시 보입니다.
        </p>
      </div>
    </SurfaceCard>
  );
}
