import type {
  CoverLetterReadResult,
  CoverLetterSavePayload,
  CoverLetterSaveResponse,
} from "../../../../../shared/cover-letter-contracts";
import type { CoverLetterDraft, CoverLetterRecord } from "../../dashboard/types";
import {
  buildCoverLetterMarkdown,
  getIsoNow,
  parseCoverLetterQuestions,
} from "../utils";

function normalizeTags(tags: unknown) {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

export function resolveNextCoverLetterName(
  files: CoverLetterRecord[],
  preferredName?: string | null,
  selectedName?: string | null,
) {
  if (preferredName && files.some((file) => file.name === preferredName)) {
    return preferredName;
  }

  if (selectedName && files.some((file) => file.name === selectedName)) {
    return selectedName;
  }

  return files[0]?.name ?? null;
}

export function buildCoverLetterDraftFromReadResult(payload: CoverLetterReadResult): CoverLetterDraft {
  const title = String(payload.meta.title ?? payload.file.title ?? "");
  const questionItems = parseCoverLetterQuestions(payload.content);

  return {
    originalName: payload.file.name,
    meta: {
      year: String(payload.meta.year ?? "2026"),
      companyId: String(payload.meta.companyId ?? ""),
      companyName: String(payload.meta.companyName ?? ""),
      companySlug: String(payload.meta.companySlug ?? ""),
      jobTrack: String(payload.meta.jobTrack ?? ""),
      docType: String(payload.meta.docType ?? "cover-letter"),
      updatedAt: String(payload.meta.updatedAt ?? getIsoNow()),
      title,
      status: String(payload.meta.status ?? payload.file.status ?? "draft"),
      tags: normalizeTags(payload.meta.tags),
    },
    questionItems,
    content: buildCoverLetterMarkdown(title, questionItems),
  };
}

export function buildCoverLetterSavePayload(draft: CoverLetterDraft): CoverLetterSavePayload {
  return {
    originalName: draft.originalName,
    meta: {
      ...draft.meta,
      tags: draft.meta.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      updatedAt: getIsoNow(),
    },
    content: buildCoverLetterMarkdown(draft.meta.title, draft.questionItems),
  };
}

export function buildCoverLetterDraftFromSaveResponse(
  payload: CoverLetterSaveResponse,
  _currentDraft: CoverLetterDraft,
): CoverLetterDraft {
  return buildCoverLetterDraftFromReadResult(payload.detail);
}
