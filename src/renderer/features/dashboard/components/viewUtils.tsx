import { cn } from "../../../lib/cn";

export const kanbanColumns = [
  { id: "preparing", title: "준비 중", accent: "border-t-slate-300", bg: "bg-slate-50" },
  { id: "applied", title: "지원 완료", accent: "border-t-blue-300", bg: "bg-blue-50/50" },
  { id: "test", title: "과제/인적성", accent: "border-t-amber-300", bg: "bg-amber-50/60" },
  { id: "interview1", title: "1차 면접", accent: "border-t-violet-300", bg: "bg-violet-50/60" },
  { id: "interview2", title: "2차 면접", accent: "border-t-cyan-300", bg: "bg-cyan-50/60" },
  { id: "passed", title: "오퍼", accent: "border-t-emerald-300", bg: "bg-emerald-50/60" },
  { id: "rejected", title: "종료", accent: "border-t-rose-300", bg: "bg-rose-50/60" },
] as const;

export function getNewsTone(tag: string) {
  if (tag === "AI 반도체") {
    return "bg-violet-50 text-violet-700";
  }
  if (tag === "메모리") {
    return "bg-cyan-50 text-cyan-700";
  }
  if (tag === "파운드리") {
    return "bg-amber-50 text-amber-700";
  }
  return "bg-slate-100 text-slate-700";
}

export function getCompanyTypeTone(type: string) {
  if (type === "집중 지원") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (type === "스트레치") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (type === "균형 카드") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (type === "안정 카드") {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }
  return "border-cyan-200 bg-cyan-50 text-cyan-700";
}

export function getEventTone(type: string) {
  if (type === "interview") {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  if (type === "deadline") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (type === "test") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
}

export function getChecklistTone(category: string) {
  if (category === "documents") {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }
  if (category === "research") {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  if (category === "story") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export function getPostingStageTone(stage: string) {
  if (stage.includes("면접")) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  if (stage.includes("인적성") || stage.includes("과제")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (stage.includes("합격")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (stage.includes("제출")) {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }
  return "border-cyan-200 bg-cyan-50 text-cyan-700";
}

export function formatDueBadge(daysLeft: number) {
  return daysLeft <= 0 ? "D-Day" : `D-${daysLeft}`;
}

export function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      )}
    >
      {label}
    </button>
  );
}
