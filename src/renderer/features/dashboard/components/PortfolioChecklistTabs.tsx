import { useState } from "react";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  GraduationCap,
  NotebookTabs,
  Sparkles,
} from "lucide-react";
import { cn } from "../../../lib/cn";
import { SurfaceCard } from "../../../components/ui/primitives";
import type { DashboardController } from "../useDashboardController";
import { ChecklistBoardSection } from "./checklist/ChecklistBoardSection";
import { ChecklistTargetSection } from "./checklist/ChecklistTargetSection";
import { PortfolioAcademicsSection } from "./portfolio/PortfolioAcademicsSection";
import { PortfolioExperienceHubSection } from "./portfolio/PortfolioExperienceHubSection";
import { PortfolioHeaderSection } from "./portfolio/PortfolioHeaderSection";
import { PortfolioNotesSection } from "./portfolio/PortfolioNotesSection";
import { PortfolioProjectSection } from "./portfolio/PortfolioProjectSection";
import { PortfolioStudyProjectsSection } from "./portfolio/PortfolioStudyProjectsSection";
import { TabButton } from "./viewUtils";

function PortfolioSubTabButton({
  active,
  label,
  tone,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  tone: "blue" | "emerald" | "violet" | "amber";
  icon: typeof BriefcaseBusiness;
  onClick: () => void;
}) {
  const activeToneClassName =
    tone === "blue"
      ? "text-blue-600 after:bg-blue-600"
      : tone === "emerald"
        ? "text-emerald-600 after:bg-emerald-600"
        : tone === "amber"
          ? "text-amber-600 after:bg-amber-600"
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

function PortfolioPreviewPanelButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: typeof BriefcaseBusiness;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export function PortfolioTab({ controller }: { controller: DashboardController }) {
  const [previewPanel, setPreviewPanel] = useState<"showcase" | "academics" | "learning">("showcase");
  const [studyPanel, setStudyPanel] = useState<"projects" | "notes">("projects");
  const courseworkBySemester = controller.portfolio.data.coursework.reduce<Record<string, number>>((accumulator, course) => {
    const key = course.semester || "미분류";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
  const semesterEntries = Object.entries(courseworkBySemester).sort((left, right) =>
    right[0].localeCompare(left[0], "ko"),
  );

  return (
    <div className="space-y-6">
      <PortfolioHeaderSection portfolio={controller.portfolio} />

      <SurfaceCard className="overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(244,247,251,0.92))] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.10)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Portfolio Preview</p>
            <h3 className="mt-2 text-[20px] font-black tracking-tight text-slate-900">프로젝트, 수업, 학습 미리보기</h3>
            <p className="mt-1 text-sm text-slate-500">
              동시에 펼쳐두지 않고 필요한 패널만 전환해서 빠르게 훑어볼 수 있게 구성했습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PortfolioPreviewPanelButton
              active={previewPanel === "showcase"}
              label="프로젝트 Showcase"
              icon={BriefcaseBusiness}
              onClick={() => setPreviewPanel("showcase")}
            />
            <PortfolioPreviewPanelButton
              active={previewPanel === "academics"}
              label="수업 / Coursework"
              icon={GraduationCap}
              onClick={() => setPreviewPanel("academics")}
            />
            <PortfolioPreviewPanelButton
              active={previewPanel === "learning"}
              label="학습 미리보기"
              icon={BookOpenCheck}
              onClick={() => setPreviewPanel("learning")}
            />
          </div>
        </div>

        <div className="mt-5 rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          {previewPanel === "showcase" ? (
            <div className="grid gap-4 xl:grid-cols-3">
              {controller.portfolio.data.projects.slice(0, 3).map((project) => (
                <article key={project.id} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[15px] font-black text-slate-900">{project.name}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">{project.date}</p>
                  <p className="mt-3 text-sm font-semibold text-blue-700">{project.role}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{project.impact}</p>
                </article>
              ))}
            </div>
          ) : null}

          {previewPanel === "academics" ? (
            <div className="grid gap-4 xl:grid-cols-[0.4fr_0.6fr]">
              <div className="grid gap-3">
                {semesterEntries.map(([semester, count]) => (
                  <div key={semester} className="rounded-[22px] border border-slate-200 bg-emerald-50/60 px-4 py-3">
                    <p className="text-sm font-black text-slate-900">{semester}</p>
                    <p className="mt-1 text-xs text-slate-500">{count}과목 등록</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3">
                {controller.portfolio.data.coursework.slice(0, 4).map((course) => (
                  <div key={course.id} className="rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-slate-900">{course.name}</p>
                      <span className="rounded-full border border-emerald-100 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        {course.relevance}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{course.semester} · {course.grade}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {previewPanel === "learning" ? (
            <div className="grid gap-4 xl:grid-cols-[0.44fr_0.56fr]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-black text-slate-900">학습 중인 기술</p>
                <div className="mt-4 space-y-4">
                  {controller.portfolio.data.learningSkills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
                        <span className="text-xs font-bold text-blue-600">{skill.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${skill.progress}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{skill.status}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-black text-slate-900">최근 학습 로그</p>
                <div className="mt-4 grid gap-3">
                  {controller.portfolio.data.studyNotes.slice(0, 4).map((note) => (
                    <div key={note.id} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-black text-slate-900">{note.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{note.date} · {note.category}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{note.preview}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </SurfaceCard>

      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-slate-200 px-6 pt-5">
          <div className="flex flex-wrap items-center gap-6">
            <PortfolioSubTabButton
              active={controller.portfolio.activeSubTab === "experience"}
              label="경험 허브"
              tone="amber"
              icon={Sparkles}
              onClick={() => controller.portfolio.setActiveSubTab("experience")}
            />
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
          {controller.portfolio.activeSubTab === "experience" ? (
            <PortfolioExperienceHubSection portfolio={controller.portfolio} />
          ) : null}

          {controller.portfolio.activeSubTab === "showcase" ? (
            <PortfolioProjectSection portfolio={controller.portfolio} />
          ) : null}

          {controller.portfolio.activeSubTab === "academics" ? (
            <PortfolioAcademicsSection portfolio={controller.portfolio} />
          ) : null}

          {controller.portfolio.activeSubTab === "study" ? (
            <div className="grid gap-5">
              <div className="flex flex-wrap gap-2">
                <TabButton
                  active={studyPanel === "projects"}
                  label="스터디 프로젝트"
                  onClick={() => setStudyPanel("projects")}
                />
                <TabButton
                  active={studyPanel === "notes"}
                  label="학습 노트"
                  onClick={() => setStudyPanel("notes")}
                />
              </div>

              {studyPanel === "projects" ? (
                <PortfolioStudyProjectsSection portfolio={controller.portfolio} />
              ) : null}
              {studyPanel === "notes" ? (
                <PortfolioNotesSection portfolio={controller.portfolio} />
              ) : null}
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
