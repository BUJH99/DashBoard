import type {
  CompanyTarget,
  CoverLetterDraft,
  CoverLetterDraftMeta,
  CoverLetterQuestionItem,
  EnrichedPosting,
} from "../dashboard/types";

function createQuestionId() {
  return `question-${Math.random().toString(36).slice(2, 10)}`;
}

export function createCoverLetterQuestion(
  prompt = "",
  answer = "",
): CoverLetterQuestionItem {
  return {
    id: createQuestionId(),
    prompt,
    answer,
  };
}

export function buildDefaultCoverLetterQuestions() {
  return buildCoverLetterQuestionsFromPrompts(buildDefaultCoverLetterQuestionPrompts());
}

export function buildDefaultCoverLetterQuestionPrompts() {
  return [
    "지원 동기를 작성해 주세요.",
    "직무 관련 경험과 강점을 작성해 주세요.",
    "입사 후 기여 계획과 포부를 작성해 주세요.",
  ];
}

export function buildCoverLetterQuestionsFromPrompts(prompts: string[]) {
  if (prompts.length === 0) {
    return [createCoverLetterQuestion("문항 1")];
  }

  return prompts.map((prompt) => createCoverLetterQuestion(prompt));
}

export function parseCoverLetterQuestions(content: string) {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return buildDefaultCoverLetterQuestions();
  }

  const bodyWithoutTitle = normalized.replace(/^# .+\n*/, "").trim();
  const sectionMatches = [...bodyWithoutTitle.matchAll(/^##\s+(.+)$/gm)];

  if (sectionMatches.length === 0) {
    return [createCoverLetterQuestion("문항 1", bodyWithoutTitle)];
  }

  return sectionMatches.map((match, index) => {
    const prompt = match[1].trim();
    const answerStart = match.index! + match[0].length;
    const answerEnd =
      index < sectionMatches.length - 1 ? sectionMatches[index + 1].index! : bodyWithoutTitle.length;
    const answer = bodyWithoutTitle.slice(answerStart, answerEnd).trim();

    return createCoverLetterQuestion(prompt, answer);
  });
}

export function buildCoverLetterMarkdown(
  title: string,
  questionItems: CoverLetterQuestionItem[],
) {
  const safeTitle = title.trim() || "자기소개서";
  const sections = questionItems.map((item, index) => {
    const prompt = item.prompt.trim() || `문항 ${index + 1}`;
    const answer = item.answer.trim();

    return `## ${prompt}\n\n${answer}`;
  });

  return [`# ${safeTitle}`, ...sections].join("\n\n").trimEnd() + "\n";
}

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
  questionPrompts?: string[],
): CoverLetterDraft {
  const companyName = company?.name ?? "";
  const companyId = company ? String(company.id) : "";
  const safeCompanySlug = companySlug ?? (company ? coverLetterSlugify(company.name) : "");
  const title = company ? `${company.name} 자기소개서 초안` : "새 자기소개서 초안";
  const jobTrack = posting?.role ? coverLetterSlugify(posting.role) : "cover-letter";
  const questionItems =
    questionPrompts && questionPrompts.length > 0
      ? buildCoverLetterQuestionsFromPrompts(questionPrompts)
      : buildDefaultCoverLetterQuestions();

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
    questionItems,
    content: buildCoverLetterMarkdown(title, questionItems),
  };
}
