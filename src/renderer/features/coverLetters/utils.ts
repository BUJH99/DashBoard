import type {
  CompanyTarget,
  CoverLetterDraft,
  CoverLetterDraftMeta,
  EnrichedPosting,
} from "../dashboard/types";

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
  const title = company ? `${company.name} 자기소개서 초안` : "새 자기소개서 초안";
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
    content: `# ${title}

## 지원 동기
회사와 직무를 선택한 이유를 구체적으로 정리합니다.

## 관련 경험
직무와 가장 직접적으로 연결되는 프로젝트, 수업, 인턴, 업무 경험을 정리합니다.

## 마무리
입사 후 기여 방안과 성장 방향을 간단히 정리합니다.
`,
  };
}
