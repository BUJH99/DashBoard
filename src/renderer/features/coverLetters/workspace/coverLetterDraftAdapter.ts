import type {
  CoverLetterReadResult,
  CoverLetterSavePayload,
  CoverLetterSaveResponse,
} from "../../../../../shared/cover-letter-contracts";
import type { CoverLetterDraft, CoverLetterRecord } from "../../dashboard/types";
import { getIsoNow } from "../utils";

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
      title: String(payload.meta.title ?? payload.file.title ?? ""),
      status: String(payload.meta.status ?? payload.file.status ?? "draft"),
      tags: normalizeTags(payload.meta.tags),
    },
    content: payload.content,
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
    content: draft.content,
  };
}

export function buildCoverLetterDraftFromSaveResponse(
  payload: CoverLetterSaveResponse,
  currentDraft: CoverLetterDraft,
): CoverLetterDraft {
  return {
    originalName: payload.detail.file.name,
    meta: {
      year: String(payload.detail.meta.year ?? currentDraft.meta.year),
      companyId: String(payload.detail.meta.companyId ?? currentDraft.meta.companyId),
      companyName: String(payload.detail.meta.companyName ?? currentDraft.meta.companyName),
      companySlug: String(payload.detail.meta.companySlug ?? currentDraft.meta.companySlug),
      jobTrack: String(payload.detail.meta.jobTrack ?? currentDraft.meta.jobTrack),
      docType: String(payload.detail.meta.docType ?? currentDraft.meta.docType),
      updatedAt: String(payload.detail.meta.updatedAt ?? getIsoNow()),
      title: String(payload.detail.meta.title ?? currentDraft.meta.title),
      status: String(payload.detail.meta.status ?? currentDraft.meta.status),
      tags: Array.isArray(payload.detail.meta.tags)
        ? payload.detail.meta.tags.join(", ")
        : currentDraft.meta.tags,
    },
    content: payload.detail.content,
  };
}
