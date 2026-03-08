import type { CompanyTarget, CoverLetterDraft, CoverLetterDraftMeta, EnrichedPosting } from "../dashboard/types";

export function coverLetterSlugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function getIsoNow() {
  return new Date().toISOString();
}

export function buildCoverLetterFileName(meta: CoverLetterDraftMeta) {
  return `${meta.year}__${meta.companySlug}__${coverLetterSlugify(meta.jobTrack)}__${coverLetterSlugify(meta.docType)}.md`;
}

export function buildEmptyCoverLetterDraft(
  company?: CompanyTarget,
  posting?: EnrichedPosting,
  companySlug?: string,
): CoverLetterDraft {
  const companyName = company?.name ?? "";
  const companyId = company ? String(company.id) : "";
  const safeCompanySlug = companySlug ?? (company ? coverLetterSlugify(company.name) : "");
  const title = company ? `${company.name} ?먭린?뚭컻??` : "???먯냼??";
  const jobTrack = posting?.role ? coverLetterSlugify(posting.role) : "cover-letter";

  return {
    originalName: null,
    meta: {
      year: "2026",
      companyId,
      companyName,
      companySlug: safeCompanySlug,
      jobTrack,
      docType: "cover-letter",
      updatedAt: getIsoNow(),
      title,
      status: "draft",
      tags: "",
    },
    content: `# ${title}\n\n## 1. 吏?먮룞湲?\n## 2. 吏곷Т ??웾 寃쏀뿕\n`,
  };
}
