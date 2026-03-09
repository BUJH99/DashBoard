import type { DashboardController } from "../useDashboardController";
import { ChecklistBoardSection } from "./checklist/ChecklistBoardSection";
import { ChecklistTargetSection } from "./checklist/ChecklistTargetSection";
import { PortfolioAcademicsSection } from "./portfolio/PortfolioAcademicsSection";
import { PortfolioHeaderSection } from "./portfolio/PortfolioHeaderSection";
import { PortfolioLearningSection } from "./portfolio/PortfolioLearningSection";
import { PortfolioNotesSection } from "./portfolio/PortfolioNotesSection";
import { PortfolioProjectSection } from "./portfolio/PortfolioProjectSection";
import { PortfolioShowcaseSummarySection } from "./portfolio/PortfolioShowcaseSummarySection";
import { PortfolioStudyProjectsSection } from "./portfolio/PortfolioStudyProjectsSection";

export function PortfolioTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="space-y-6">
      <PortfolioHeaderSection portfolio={controller.portfolio} />

      {controller.portfolio.activeSubTab === "showcase" ? (
        <div className="grid gap-6 xl:grid-cols-[0.52fr_0.48fr]">
          <PortfolioShowcaseSummarySection portfolio={controller.portfolio} />
          <PortfolioProjectSection portfolio={controller.portfolio} />
        </div>
      ) : null}

      {controller.portfolio.activeSubTab === "academics" ? (
        <div className="grid gap-6 xl:grid-cols-[0.55fr_0.45fr]">
          <PortfolioAcademicsSection portfolio={controller.portfolio} />
          <PortfolioNotesSection portfolio={controller.portfolio} />
        </div>
      ) : null}

      {controller.portfolio.activeSubTab === "study" ? (
        <div className="grid gap-6 xl:grid-cols-[0.45fr_0.55fr]">
          <PortfolioLearningSection portfolio={controller.portfolio} />
          <PortfolioStudyProjectsSection portfolio={controller.portfolio} />
        </div>
      ) : null}
    </div>
  );
}

export function ChecklistTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
      <ChecklistTargetSection checklist={controller.checklist} companies={controller.companies} />
      <ChecklistBoardSection checklist={controller.checklist} />
    </div>
  );
}
