import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

const STAGE_COLORS = {
  applied: "#6366f1",
  documentPassed: "#10b981",
  activeProcess: "#64748b",
  interview: "#06b6d4",
} as const;

type PipelineSectionProps = {
  overview: DashboardController["overview"];
};

export function PipelineSection({
  overview,
}: PipelineSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">주요 액티브 파이프라인</h3>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            {overview.supportFlow.length}개 흐름
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          전형 단계와 다음 액션, 예상 일정을 같은 필터 기준으로 확인합니다.
        </p>
      </div>

      {overview.supportFlow.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          현재 필터에 맞는 지원 흐름이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {overview.supportFlow.map((pipeline) => (
            <div
              key={`${pipeline.company}-${pipeline.postingId}`}
              className="grid gap-3 rounded-2xl border border-slate-200 p-4 xl:grid-cols-[140px_120px_1fr_120px]"
            >
              <div className="text-sm font-semibold text-slate-800">{pipeline.company}</div>
              <div className="text-sm text-slate-500">{pipeline.stageLabel}</div>
              <div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${pipeline.progress}%`,
                      backgroundColor: STAGE_COLORS[pipeline.stageKind],
                    }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{pipeline.nextActionLabel}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                    우선순위 {pipeline.priority}
                  </span>
                </div>
              </div>
              <div className="text-sm text-slate-400 xl:text-right">{pipeline.expectedDateLabel}</div>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
