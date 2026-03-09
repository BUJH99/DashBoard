import type { DashboardStateSync, IndustryNewsItem } from "../types";

function formatSaveMessage(savedAt: string | null) {
  if (!savedAt) {
    return null;
  }

  return `${new Date(savedAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  })} 저장 완료`;
}

export function buildDashboardStateMessage(sync: DashboardStateSync) {
  if (sync.message) {
    return sync.message;
  }

  if (sync.phase === "saving") {
    return "대시보드 상태를 저장하는 중...";
  }

  if (sync.phase === "loading") {
    return "저장된 대시보드 상태를 불러오는 중...";
  }

  return formatSaveMessage(sync.lastSavedAt);
}

export function buildIndustryTags(news: IndustryNewsItem[]) {
  return ["전체", ...Array.from(new Set(news.map((item) => item.tag)))];
}
