import type { CommuteNote } from "../dashboard/types";

export function buildEmptyCommuteNote(): CommuteNote {
  return {
    totalMinutes: "",
    transfers: "",
    hasBus: false,
    hasSubway: false,
    note: "",
  };
}

export function normalizeCommuteNote(value: unknown): CommuteNote {
  if (typeof value === "string") {
    return {
      totalMinutes: "",
      transfers: "",
      hasBus: false,
      hasSubway: false,
      note: value,
    };
  }

  if (value && typeof value === "object") {
    const raw = value as Partial<CommuteNote>;
    return {
      totalMinutes: typeof raw.totalMinutes === "string" ? raw.totalMinutes : "",
      transfers: typeof raw.transfers === "string" ? raw.transfers : "",
      hasBus: Boolean(raw.hasBus),
      hasSubway: Boolean(raw.hasSubway),
      note: typeof raw.note === "string" ? raw.note : "",
    };
  }

  return buildEmptyCommuteNote();
}

export function hasCommuteNoteContent(value: CommuteNote) {
  return Boolean(
    value.totalMinutes || value.transfers || value.hasBus || value.hasSubway || value.note.trim(),
  );
}

export function formatCommuteNoteSummary(value: CommuteNote) {
  const parts: string[] = [];

  if (value.totalMinutes) {
    parts.push(`${value.totalMinutes}분`);
  }

  if (value.transfers) {
    parts.push(`환승 ${value.transfers}회`);
  }

  if (value.hasBus || value.hasSubway) {
    const modes = [
      value.hasBus ? "버스" : null,
      value.hasSubway ? "지하철" : null,
    ]
      .filter(Boolean)
      .join(" + ");

    if (modes) {
      parts.push(modes);
    }
  }

  if (parts.length === 0 && value.note.trim()) {
    parts.push(value.note.trim());
  }

  return parts.join(" / ");
}
