import { PipelineBar } from "../../../../components/charts/DashboardCharts";
import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PipelineSectionProps = {
  overview: DashboardController["overview"];
};

export function PipelineSection({
  overview,
}: PipelineSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">진행 중 파이프라인</h3>
        <p className="mt-1 text-sm text-slate-500">현재 살아 있는 지원 건의 단계와 예상 일정을 봅니다.</p>
      </div>
      <div className="space-y-3">
        {overview.activePipelines.map((pipeline, index) => (
          <PipelineBar
            key={`${pipeline.company}-${pipeline.stage}`}
            label={pipeline.company}
            stage={pipeline.stage}
            progress={pipeline.progress}
            expectedDate={pipeline.expectedDate}
            colorHex={index % 2 === 0 ? "#10b981" : "#2563eb"}
          />
        ))}
      </div>
    </SurfaceCard>
  );
}
