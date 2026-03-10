import type {
  CoverLetterSpellcheckIssue,
  CoverLetterSpellcheckRequest,
  CoverLetterSpellcheckResponse,
} from "../../shared/cover-letter-spellcheck-service-contracts.js";

type HanfixIssue = {
  original: string;
  suggestions: string[];
  explanation?: string;
  examples?: (string | null | undefined)[];
};

type HanfixModule = {
  check(text: string): Promise<HanfixIssue[]>;
};

const BASE_IGNORE_TERMS = [
  "HBM",
  "HBM3",
  "HBM3E",
  "DDR",
  "DDR5",
  "DRAM",
  "NAND",
  "EUV",
  "EDA",
  "RTL",
  "SoC",
  "SystemVerilog",
  "Python",
  "TCAD",
  "SPC",
  "DOE",
  "Minitab",
  "XGBoost",
  "Streamlit",
  "CVD",
  "ALD",
  "Etch",
  "Deposition",
  "MOSFET",
  "High-k",
  "AI",
  "SKKU",
  "SK",
  "하이닉스",
  "삼성전자",
  "메모리사업부",
  "공정기술",
  "공정기술팀",
  "식각공정",
  "시각공정",
  "박막공정",
  "포토리소그래피",
  "반도체공학",
  "반도체공학과",
  "메모리반도체",
  "직무적합도",
  "직무역량",
  "직무경험",
  "유전율",
  "누설전류",
  "패키징",
  "파운드리",
];
const HANFIX_MAX_TEXT_LENGTH = 1000;

let hanfixModulePromise: Promise<HanfixModule> | null = null;

function normalizeIgnoreTerm(term: string) {
  return term.replace(/^[^\p{Letter}\p{Number}가-힣]+|[^\p{Letter}\p{Number}가-힣]+$/gu, "").trim();
}

function normalizeIssueToken(token: string) {
  return token.replace(/^[^\p{Letter}\p{Number}가-힣]+|[^\p{Letter}\p{Number}가-힣]+$/gu, "").trim();
}

function sortIssues(a: CoverLetterSpellcheckIssue, b: CoverLetterSpellcheckIssue) {
  if (b.count !== a.count) {
    return b.count - a.count;
  }

  return a.token.localeCompare(b.token, "ko-KR");
}

function buildIgnoreTermSet(ignoreTerms: string[] = []) {
  return new Set(
    [...BASE_IGNORE_TERMS, ...ignoreTerms]
      .map(normalizeIgnoreTerm)
      .filter((term) => term.length > 0),
  );
}

function shouldIgnoreIssue(token: string, ignoreTerms: Set<string>) {
  const normalized = normalizeIssueToken(token);

  return normalized.length > 0 && ignoreTerms.has(normalized);
}

function splitLongTextByWords(text: string, maxLength: number) {
  const parts: string[] = [];
  const words = text.split(/\s+/).filter(Boolean);
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }

    if (current) {
      parts.push(current);
      current = "";
    }

    if (word.length <= maxLength) {
      current = word;
      continue;
    }

    for (let index = 0; index < word.length; index += maxLength) {
      parts.push(word.slice(index, index + maxLength));
    }
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

function splitTextIntoChunks(text: string, maxLength = HANFIX_MAX_TEXT_LENGTH) {
  const normalized = text.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  const paragraphs = normalized.split(/\n{2,}/).filter((paragraph) => paragraph.trim().length > 0);
  const chunks: string[] = [];

  for (const paragraph of paragraphs) {
    const sentences =
      paragraph.match(/[^.!?\n]+[.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [
        paragraph.trim(),
      ];
    let current = "";

    for (const sentence of sentences) {
      if (sentence.length > maxLength) {
        if (current) {
          chunks.push(current);
          current = "";
        }

        chunks.push(...splitLongTextByWords(sentence, maxLength));
        continue;
      }

      const candidate = current ? `${current} ${sentence}` : sentence;

      if (candidate.length <= maxLength) {
        current = candidate;
      } else {
        if (current) {
          chunks.push(current);
        }

        current = sentence;
      }
    }

    if (current) {
      chunks.push(current);
    }
  }

  return chunks.length > 0 ? chunks : splitLongTextByWords(normalized, maxLength);
}

async function getHanfixModule() {
  if (!hanfixModulePromise) {
    hanfixModulePromise = import("hanfix/src/hanfix.js")
      .then((module) => ({
        check: module.check,
      }))
      .catch((error) => {
        hanfixModulePromise = null;
        throw error;
      });
  }

  return hanfixModulePromise;
}

async function checkChunk(text: string) {
  const hanfixModule = await getHanfixModule();

  return hanfixModule.check(text);
}

export async function checkCoverLetterSpelling(
  payload: CoverLetterSpellcheckRequest,
): Promise<CoverLetterSpellcheckResponse> {
  const normalizedText = payload.text.trim();

  if (!normalizedText) {
    return {
      checkedAt: new Date().toISOString(),
      issueCount: 0,
      issues: [],
      warnings: [],
    };
  }

  const chunks = splitTextIntoChunks(normalizedText);
  const warnings: string[] = [];
  const issueMap = new Map<string, CoverLetterSpellcheckIssue>();
  const ignoreTerms = buildIgnoreTermSet(payload.ignoreTerms);

  if (chunks.length > 1) {
    warnings.push(`답변이 길어 ${chunks.length}개 구간으로 나누어 검사했습니다.`);
  }

  for (const [index, chunk] of chunks.entries()) {
    try {
      const issues = await checkChunk(chunk);

      for (const issue of issues) {
        if (shouldIgnoreIssue(issue.original, ignoreTerms)) {
          continue;
        }

        const currentIssue = issueMap.get(issue.original);

        if (currentIssue) {
          currentIssue.count += 1;
          currentIssue.suggestions = [
            ...new Set([...currentIssue.suggestions, ...issue.suggestions]),
          ].slice(0, 5);

          if (!currentIssue.explanation && issue.explanation) {
            currentIssue.explanation = issue.explanation;
          }

          if (currentIssue.examples.length === 0 && issue.examples?.length) {
            currentIssue.examples = issue.examples.filter(
              (example): example is string => Boolean(example),
            );
          }

          continue;
        }

        issueMap.set(issue.original, {
          token: issue.original,
          count: 1,
          suggestions: [...new Set(issue.suggestions)].slice(0, 5),
          explanation: issue.explanation ?? null,
          examples: issue.examples?.filter((example): example is string => Boolean(example)) ?? [],
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "맞춤법 검사를 완료하지 못했습니다.";

      warnings.push(`${index + 1}번째 구간 검사에 실패했습니다. (${message})`);
    }
  }

  const issues = [...issueMap.values()].sort(sortIssues);

  return {
    checkedAt: new Date().toISOString(),
    issueCount: issues.reduce((total, issue) => total + issue.count, 0),
    issues,
    warnings,
  };
}
