import { useState } from "react";
import { ArrowUpRight, FileText, Globe, Link2, Pencil, Plus, Rocket, Save, Trash2 } from "lucide-react";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type PortfolioStudyProjectsSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioStudyProjectsSection({
  portfolio,
}: PortfolioStudyProjectsSectionProps) {
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [savingProjectId, setSavingProjectId] = useState<number | null>(null);

  const handleAddStudyProject = () => {
    const nextId =
      portfolio.data.studyProjects.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

    portfolio.addCollectionItem("studyProjects");
    setEditingProjectId(nextId);
  };

  const handleSaveStudyProject = async (projectId: number) => {
    setSavingProjectId(projectId);

    try {
      await portfolio.saveChanges();
      setEditingProjectId((current) => (current === projectId ? null : current));
    } finally {
      setSavingProjectId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-slate-900">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-violet-500" />
          <h3 className="text-[15px] font-black">진행 중인 스터디 프로젝트</h3>
        </div>
        <button
          type="button"
          onClick={handleAddStudyProject}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          스터디 추가
        </button>
      </div>

      <div className="space-y-4">
        {portfolio.data.studyProjects.map((project) => {
          const isEditing = editingProjectId === project.id;
          const browserLink =
            project.browserLink ?? (project.link.trim().startsWith("http") ? project.link : "");
          const documentLink =
            project.documentLink ?? (!project.link.trim().startsWith("http") ? project.link : "");

          return (
            <article
              key={project.id}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-[16px] font-black text-slate-900">{project.name || `스터디 ${project.id}`}</h4>
                  <span className="mt-3 inline-flex rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-600">
                    {project.tech || "기술 스택 미입력"}
                  </span>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => void handleSaveStudyProject(project.id)}
                    disabled={!isEditing || savingProjectId === project.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <Save className="h-3.5 w-3.5" />
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProjectId(project.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition",
                      isEditing
                        ? "border-violet-200 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    편집
                  </button>
                  <button
                    type="button"
                    onClick={() => portfolio.removeCollectionItem("studyProjects", project.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                    aria-label={`${project.name || `스터디 ${project.id}`} 삭제`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    휴지통
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold text-slate-700">제목</span>
                    <input
                      readOnly={!isEditing}
                      value={project.name}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("studyProjects", project.id, "name", event.target.value)
                      }
                      className={cn(
                        "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                        !isEditing && "bg-slate-50 text-slate-500",
                      )}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold text-slate-700">기술 스택</span>
                    <input
                      readOnly={!isEditing}
                      value={project.tech}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("studyProjects", project.id, "tech", event.target.value)
                      }
                      className={cn(
                        "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                        !isEditing && "bg-slate-50 text-slate-500",
                      )}
                    />
                  </label>
                </div>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-700">진행률</span>
                  <input
                    readOnly={!isEditing}
                    type="number"
                    min={0}
                    max={100}
                    value={project.progress}
                    onChange={(event) =>
                      portfolio.updateCollectionItem(
                        "studyProjects",
                        project.id,
                        "progress",
                        Number(event.target.value || 0),
                      )
                    }
                    className={cn(
                      "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                      !isEditing && "bg-slate-50 text-slate-500",
                    )}
                  />
                </label>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-violet-500"
                    style={{ width: `${Math.max(0, Math.min(100, project.progress))}%` }}
                  />
                </div>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-700">현재 상태</span>
                  <textarea
                    readOnly={!isEditing}
                    value={project.status}
                    onChange={(event) =>
                      portfolio.updateCollectionItem("studyProjects", project.id, "status", event.target.value)
                    }
                    className={cn(
                      "min-h-[84px] rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                      !isEditing && "bg-slate-50 text-slate-500",
                    )}
                  />
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-700">다음 액션</span>
                  <textarea
                    readOnly={!isEditing}
                    value={project.next}
                    onChange={(event) =>
                      portfolio.updateCollectionItem("studyProjects", project.id, "next", event.target.value)
                    }
                    className={cn(
                      "min-h-[84px] rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                      !isEditing && "bg-slate-50 text-slate-500",
                    )}
                  />
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                      <Globe className="h-4 w-4" />
                      웹브라우저주소
                    </span>
                    <input
                      readOnly={!isEditing}
                      value={browserLink}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("studyProjects", project.id, "browserLink", event.target.value)
                      }
                      placeholder="https://..."
                      className={cn(
                        "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                        !isEditing && "bg-slate-50 text-slate-500",
                      )}
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                      <FileText className="h-4 w-4" />
                      문서주소
                    </span>
                    <input
                      readOnly={!isEditing}
                      value={documentLink}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("studyProjects", project.id, "documentLink", event.target.value)
                      }
                      placeholder="C:\\Users\\...\\notes.md"
                      className={cn(
                        "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                        !isEditing && "bg-slate-50 text-slate-500",
                      )}
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void portfolio.openLink(browserLink)}
                    disabled={!browserLink.trim()}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    웹 링크 열기
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void portfolio.openLink(documentLink)}
                    disabled={!documentLink.trim()}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    문서 열기
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <Link2 className="h-3.5 w-3.5" />
                    학습 링크와 문서 기록을 분리해 저장할 수 있습니다.
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
