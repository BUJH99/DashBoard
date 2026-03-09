import type { DashboardController } from "../useDashboardController";
import { IndustryNewsSection } from "./industry/IndustryNewsSection";
import { CompetencySection } from "./overview/CompetencySection";
import { OverviewActionFlowSection } from "./overview/OverviewActionFlowSection";
import { PipelineSection } from "./overview/PipelineSection";
import { TopActionsSection } from "./overview/TopActionsSection";
import { UrgentItemsSection } from "./overview/UrgentItemsSection";
import { WeeklyTrendSection } from "./overview/WeeklyTrendSection";

export function OverviewTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <OverviewActionFlowSection overview={controller.overview} />
        <TopActionsSection overview={controller.overview} />
      </div>

      <div className="grid gap-6">
        <PipelineSection overview={controller.overview} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <CompetencySection overview={controller.overview} />
        <UrgentItemsSection overview={controller.overview} />
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
