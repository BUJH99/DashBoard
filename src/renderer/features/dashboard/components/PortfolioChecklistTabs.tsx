import {
  BriefcaseBusiness,
  GraduationCap,
  NotebookTabs,
} from "lucide-react";
import { SurfaceCard } from "../../../components/ui/primitives";
import type { DashboardController } from "../useDashboardController";
import { ChecklistBoardSection } from "./checklist/ChecklistBoardSection";
import { ChecklistTargetSection } from "./checklist/ChecklistTargetSection";
import { PortfolioAcademicsSection } from "./portfolio/PortfolioAcademicsSection";
import { PortfolioHeaderSection } from "./portfolio/PortfolioHeaderSection";
import { PortfolioNotesSection } from "./portfolio/PortfolioNotesSection";
import { PortfolioProjectSection } from "./portfolio/PortfolioProjectSection";
import { PortfolioStudyProjectsSection } from "./portfolio/PortfolioStudyProjectsSection";

function PortfolioSubTabButton({
  active,
  label,
  tone,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  tone: "blue" | "emerald" | "violet";
  icon: typeof BriefcaseBusiness;
  onClick: () => void;
}) {
  const activeToneClassName =
    tone === "blue"
      ? "text-blue-600 after:bg-blue-600"
      : tone === "emerald"
        ? "text-emerald-600 after:bg-emerald-600"
        : "text-violet-600 after:bg-violet-600";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 pb-3 text-[15px] font-bold transition after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full ${
        active
          ? `${activeToneClassName} after:opacity-100`
          : "text-slate-400 hover:text-slate-600 after:opacity-0"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

export function PortfolioTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="space-y-6">
      <PortfolioHeaderSection portfolio={controller.portfolio} />

      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-slate-200 px-6 pt-5">
          <div className="flex flex-wrap items-center gap-6">
            <PortfolioSubTabButton
              active={controller.portfolio.activeSubTab === "showcase"}
              label="프로젝트 Showcase"
              tone="blue"
              icon={BriefcaseBusiness}
              onClick={() => controller.portfolio.setActiveSubTab("showcase")}
            />
            <PortfolioSubTabButton
              active={controller.portfolio.activeSubTab === "academics"}
              label="수업 / Coursework"
              tone="emerald"
              icon={GraduationCap}
              onClick={() => controller.portfolio.setActiveSubTab("academics")}
            />
            <PortfolioSubTabButton
              active={controller.portfolio.activeSubTab === "study"}
              label="학습 & 스터디 로그"
              tone="violet"
              icon={NotebookTabs}
              onClick={() => controller.portfolio.setActiveSubTab("study")}
            />
          </div>
        </div>

        <div className="p-6">
          {controller.portfolio.activeSubTab === "showcase" ? (
            <PortfolioProjectSection portfolio={controller.portfolio} />
          ) : null}

          {controller.portfolio.activeSubTab === "academics" ? (
            <PortfolioAcademicsSection portfolio={controller.portfolio} />
          ) : null}

          {controller.portfolio.activeSubTab === "study" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <PortfolioStudyProjectsSection portfolio={controller.portfolio} />
              <PortfolioNotesSection portfolio={controller.portfolio} />
            </div>
          ) : null}
        </div>
      </SurfaceCard>
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
