import type { DashboardController } from "../useDashboardController";
import { IndustryNewsSection } from "./industry/IndustryNewsSection";
import { AnalyticsInsightsSection } from "./overview/AnalyticsInsightsSection";
import { CompetencySection } from "./overview/CompetencySection";
import { FunnelSection } from "./overview/FunnelSection";
import { OverviewKpiGridSection } from "./overview/OverviewKpiGridSection";
import { PipelineSection } from "./overview/PipelineSection";
import { PriorityPostingsSection } from "./overview/PriorityPostingsSection";
import { WeeklyTrendSection } from "./overview/WeeklyTrendSection";

export function OverviewTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="space-y-6">
      <OverviewKpiGridSection overview={controller.overview} />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PriorityPostingsSection overview={controller.overview} />
        <FunnelSection overview={controller.overview} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
        <PipelineSection overview={controller.overview} />
        <CompetencySection overview={controller.overview} />
        <AnalyticsInsightsSection overview={controller.overview} />
      </div>

      <WeeklyTrendSection overview={controller.overview} />
    </div>
  );
}

export function IndustryTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="space-y-6">
      <IndustryNewsSection industry={controller.industry} />
    </div>
  );
}
