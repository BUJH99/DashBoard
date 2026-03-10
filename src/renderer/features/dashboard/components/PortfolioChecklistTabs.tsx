import {
  BriefcaseBusiness,
  GraduationCap,
  NotebookTabs,
} from "lucide-react";
import { cn } from "../../../lib/cn";
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

function ChecklistSummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "danger" | "warning";
}) {
  return (
    <SurfaceCard className="overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,247,251,0.92))] px-5 py-4 shadow-[0_16px_36px_rgba(148,163,184,0.12)]">
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      <p
        className={cn(
          "mt-3 text-[42px] font-black tracking-[-0.04em]",
          tone === "danger"
            ? "text-rose-600"
            : tone === "warning"
              ? "text-amber-600"
              : "text-slate-900",
        )}
      >
        {value}
      </p>
    </SurfaceCard>
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
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.96fr]">
        <ChecklistSummaryCard
          label="전체 체크리스트 완성률"
          value={`${controller.checklist.summaryMetrics.overallCompletionRate}%`}
          tone="default"
        />
        <ChecklistSummaryCard
          label="블로커 있는 공고"
          value={String(controller.checklist.summaryMetrics.blockedPostingCount)}
          tone="danger"
        />
        <ChecklistSummaryCard
          label="오늘 제출 위험 공고"
          value={String(controller.checklist.summaryMetrics.atRiskPostingCount)}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.36fr_0.64fr] xl:items-start">
        <ChecklistTargetSection checklist={controller.checklist} />
        <ChecklistBoardSection checklist={controller.checklist} />
      </div>
    </div>
  );
}
