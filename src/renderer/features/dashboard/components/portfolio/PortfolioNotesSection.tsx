import { useState } from "react";
import { ArrowUpRight, FileText, Globe, Link2, NotebookPen, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type PortfolioNotesSectionProps = {
  portfolio: DashboardController["portfolio"];
};

function getNoteTone(category: string) {
  if (category === "Chisel") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (category === "Architecture") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }
  return "border-violet-200 bg-violet-50 text-violet-700";
}

export function PortfolioNotesSection({
  portfolio,
}: PortfolioNotesSectionProps) {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [savingNoteId, setSavingNoteId] = useState<number | null>(null);

  const handleAddNote = () => {
    const nextId =
      portfolio.data.studyNotes.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

    portfolio.addCollectionItem("studyNotes");
    setEditingNoteId(nextId);
  };

  const handleSaveNote = async (noteId: number) => {
    setSavingNoteId(noteId);

    try {
      await portfolio.saveChanges();
      setEditingNoteId((current) => (current === noteId ? null : current));
    } finally {
      setSavingNoteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-slate-900">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4 text-amber-500" />
          <h3 className="text-[15px] font-black">학습 복습 노트</h3>
        </div>
        <button
          type="button"
          onClick={handleAddNote}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          노트 추가
        </button>
      </div>

      <div className="space-y-4">
        {portfolio.data.studyNotes.map((note) => {
          const isEditing = editingNoteId === note.id;
          const browserLink =
            note.browserLink ?? (note.link.trim().startsWith("http") ? note.link : "");
          const documentLink =
            note.documentLink ?? (!note.link.trim().startsWith("http") ? note.link : "");

          return (
            <article
              key={note.id}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={cn("rounded-full border px-3 py-1.5 text-[11px] font-bold", getNoteTone(note.category))}>
                    {note.category || "카테고리 미입력"}
                  </span>
                  <h4 className="mt-3 text-[16px] font-black text-slate-900">{note.title || `노트 ${note.id}`}</h4>
                  <p className="mt-1 text-[12px] text-slate-400">{note.date || "날짜 미입력"}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => void handleSaveNote(note.id)}
                    disabled={!isEditing || savingNoteId === note.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <Save className="h-3.5 w-3.5" />
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingNoteId(note.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition",
                      isEditing
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    편집
                  </button>
                  <button
                    type="button"
                    onClick={() => portfolio.removeCollectionItem("studyNotes", note.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                    aria-label={`${note.title || `노트 ${note.id}`} 삭제`}
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
                      value={note.title}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("studyNotes", note.id, "title", event.target.value)
                      }
                      className={cn(
                        "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                        !isEditing && "bg-slate-50 text-slate-500",
                      )}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold text-slate-700">날짜</span>
                    <input
                      readOnly={!isEditing}
                      value={note.date}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("studyNotes", note.id, "date", event.target.value)
                      }
                      placeholder="예: 2026.03.13"
                      className={cn(
                        "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                        !isEditing && "bg-slate-50 text-slate-500",
                      )}
                    />
                  </label>
                </div>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-700">카테고리</span>
                  <input
                    readOnly={!isEditing}
                    value={note.category}
                    onChange={(event) =>
                      portfolio.updateCollectionItem("studyNotes", note.id, "category", event.target.value)
                    }
                    className={cn(
                      "rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300",
                      !isEditing && "bg-slate-50 text-slate-500",
                    )}
                  />
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-slate-700">노트 요약</span>
                  <textarea
                    readOnly={!isEditing}
                    value={note.preview}
                    onChange={(event) =>
                      portfolio.updateCollectionItem("studyNotes", note.id, "preview", event.target.value)
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
                        portfolio.updateCollectionItem("studyNotes", note.id, "browserLink", event.target.value)
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
                        portfolio.updateCollectionItem("studyNotes", note.id, "documentLink", event.target.value)
                      }
                      placeholder="C:\\Users\\...\\study-note.pdf"
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
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
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
                    학습 노트와 참고 문서를 분리해서 관리할 수 있습니다.
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
