import { useState } from "react";
import { ArrowUpRight, FileText, Globe, Link2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { Pill } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PortfolioProjectSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioProjectSection({
  portfolio,
}: PortfolioProjectSectionProps) {
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [savingProjectId, setSavingProjectId] = useState<number | null>(null);

  const handleAddProject = () => {
    const nextId =
      portfolio.data.projects.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

    portfolio.addCollectionItem("projects");
    setEditingProjectId(nextId);
  };

  const handleSaveProject = async (projectId: number) => {
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[18px] font-black text-slate-900">프로젝트 Showcase</h3>
          <p className="mt-1 text-sm text-slate-500">
            프로젝트 링크는 웹 URL과 로컬 문서 경로를 모두 지원합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          프로젝트 추가
        </button>
      </div>

      {portfolio.saveMessage ? (
        <p className="text-sm text-slate-500">{portfolio.saveMessage}</p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {portfolio.data.projects.map((project) => {
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
                  <h3 className="text-[16px] font-black leading-snug text-slate-900">
                    {project.name || `프로젝트 ${project.id}`}
                  </h3>
                  <p className="mt-2 text-[12px] font-semibold text-slate-400">
                    {project.date || "기간 미입력"} · <span className="text-blue-600">{project.role || "역할 미입력"}</span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => void handleSaveProject(project.id)}
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
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    편집
                  </button>
                  <button
                    type="button"
                    onClick={() => portfolio.removeCollectionItem("projects", project.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                    aria-label={`${project.name || `프로젝트 ${project.id}`} 삭제`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    휴지통
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold text-slate-700">프로젝트명</span>
                    <input
                      readOnly={!isEditing}
                      value={project.name}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("projects", project.id, "name", event.target.value)
                      }
                      className={cn(
                        "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                        !isEditing && "bg-slate-50 text-slate-500",
                      )}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold text-slate-700">기간</span>
                    <input
                      readOnly={!isEditing}
                      value={project.date}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("projects", project.id, "date", event.target.value)
                      }
                      className={cn(
                        "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                        !isEditing && "bg-slate-50 text-slate-500",
                      )}
                    />
                  </label>
                </div>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-700">역할</span>
                  <input
                    readOnly={!isEditing}
                    value={project.role}
                    onChange={(event) =>
                      portfolio.updateCollectionItem("projects", project.id, "role", event.target.value)
                    }
                    className={cn(
                      "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                      !isEditing && "bg-slate-50 text-slate-500",
                    )}
                  />
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-700">기술 태그</span>
                  <input
                    readOnly={!isEditing}
                    value={project.tech.join(", ")}
                    onChange={(event) =>
                      portfolio.updateCollectionItem("projects", project.id, "tech", event.target.value)
                    }
                    placeholder="쉼표로 구분해 입력"
                    className={cn(
                      "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                      !isEditing && "bg-slate-50 text-slate-500",
                    )}
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Pill key={`${project.id}-${tech}`} className="border-slate-200 bg-slate-100 text-slate-700">
                      {tech}
                    </Pill>
                  ))}
                </div>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-700">정량 성과 / 설명</span>
                  <textarea
                    readOnly={!isEditing}
                    value={project.impact}
                    onChange={(event) =>
                      portfolio.updateCollectionItem("projects", project.id, "impact", event.target.value)
                    }
                    className={cn(
                      "min-h-[96px] rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
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
                        portfolio.updateCollectionItem("projects", project.id, "browserLink", event.target.value)
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
                        portfolio.updateCollectionItem("projects", project.id, "documentLink", event.target.value)
                      }
                      placeholder="C:\\Users\\...\\file.pdf"
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
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    웹 링크 열기
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void portfolio.openLink(documentLink)}
                    disabled={!documentLink.trim()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    문서 열기
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <Link2 className="h-3.5 w-3.5" />
                    링크 2개를 각각 따로 관리할 수 있습니다.
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
