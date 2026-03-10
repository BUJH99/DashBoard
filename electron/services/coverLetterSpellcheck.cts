import type {
  CoverLetterSpellcheckIssue,
  CoverLetterSpellcheckIssueCategory,
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

type StandardWordDictionaryEntry = {
  note: string;
  suggestions: string[];
};

type StandardWordDictionaryModule = {
  STANDARD_WORD_DICTIONARY: Record<string, StandardWordDictionaryEntry>;
};

type KoreanHeadwordsModule = {
  KOREAN_HEADWORDS: string[];
};

type TextToken = {
  token: string;
  start: number;
  end: number;
};

type TextChunk = {
  text: string;
  start: number;
  end: number;
};

type DetectedIssueSource =
  | "hanfix"
  | "mixed-script"
  | "particle-spacing"
  | "bound-noun-spacing"
  | "token-probe"
  | "standard";

type DetectedIssueConfidence = "high" | "medium" | "low";

type DetectedIssueSpan = {
  category: CoverLetterSpellcheckIssueCategory;
  token: string;
  start: number;
  end: number;
  suggestions: string[];
  explanation: string | null;
  examples: string[];
  source: DetectedIssueSource;
  confidence: DetectedIssueConfidence;
};

type ProbeIssueTemplate = {
  suggestions: string[];
  explanation: string | null;
  examples: string[];
  confidence: DetectedIssueConfidence;
};

type HanfixProbeCacheEntry = {
  attempts: number;
  issues: HanfixIssue[];
};

type ProbeContext = {
  hanfixProbeCache: Map<string, HanfixProbeCacheEntry>;
  tokenProbeCache: Map<string, ProbeIssueTemplate | null>;
  mixedScriptProbeCache: Map<string, ProbeIssueTemplate>;
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
const HANFIX_PROBE_RETRY_DELAYS = [120, 320];
const STANDARD_WORD_TOKEN_PATTERN = /[A-Za-z0-9가-힣^+-]{2,}/g;
const HANGUL_TOKEN_PATTERN = /^[가-힣]+$/;
const LATIN_PATTERN = /[A-Za-z]/;
const MIXED_SCRIPT_SUSPICIOUS_PATTERN = /[가-힣][A-Za-z]+(?:[가-힣]|$)/;
const STANDARD_WORD_PARTICLE_SUFFIXES = [
  "으로",
  "에서",
  "에게",
  "은",
  "는",
  "이",
  "가",
  "을",
  "를",
  "도",
  "만",
  "와",
  "과",
  "로",
];
const ATTACHED_PARTICLE_RULES = new Map([
  ["은", "조사는 앞말에 붙여 씁니다."],
  ["는", "조사는 앞말에 붙여 씁니다."],
  ["이", "조사는 앞말에 붙여 씁니다."],
  ["가", "조사는 앞말에 붙여 씁니다."],
  ["을", "조사는 앞말에 붙여 씁니다."],
  ["를", "조사는 앞말에 붙여 씁니다."],
  ["와", "조사는 앞말에 붙여 씁니다."],
  ["과", "조사는 앞말에 붙여 씁니다."],
  ["도", "보조사는 앞말에 붙여 씁니다."],
  ["만", "보조사는 앞말에 붙여 씁니다."],
  ["에", "조사는 앞말에 붙여 씁니다."],
  ["에서", "조사는 앞말에 붙여 씁니다."],
  ["에게", "조사는 앞말에 붙여 씁니다."],
  ["께", "조사는 앞말에 붙여 씁니다."],
  ["로", "조사는 앞말에 붙여 씁니다."],
  ["으로", "조사는 앞말에 붙여 씁니다."],
  ["부터", "조사는 앞말에 붙여 씁니다."],
  ["까지", "조사는 앞말에 붙여 씁니다."],
  ["보다", "조사는 앞말에 붙여 씁니다."],
  ["처럼", "조사는 앞말에 붙여 씁니다."],
]);
const ATTACHED_PARTICLE_TOKENS = new Set(ATTACHED_PARTICLE_RULES.keys());
const COUNTER_PREFIXES = new Set([
  "몇",
  "여러",
  "한",
  "두",
  "세",
  "네",
  "다섯",
  "여섯",
  "일곱",
  "여덟",
  "아홉",
  "열",
]);
const COUNTER_SUFFIX_EXPLANATIONS = new Map([
  ["개", "수량을 나타내는 단위 명사는 앞말과 띄어 씁니다."],
  ["명", "인원을 나타내는 단위 명사는 앞말과 띄어 씁니다."],
  ["번", "횟수를 나타내는 단위 명사는 앞말과 띄어 씁니다."],
  ["가지", "의존 명사는 앞말과 띄어 씁니다."],
]);
const COUNTER_SPACING_EXCLUSIONS = new Set(["한번"]);
const CONSERVATIVE_SAFE_SPELLING_TOKENS = new Set([
  "기여하고",
  "저전력",
  "고성능",
  "검사기",
  "검사기가",
  "테스트중이다",
]);
const TOKEN_PROBE_LIMIT = 10;
const TOKEN_PROBE_TEMPLATE_PREFIX = "이 단어는 ";
const TOKEN_PROBE_TEMPLATE_SUFFIX = "입니다.";
const MIXED_SCRIPT_WARNING_MESSAGE =
  "영문이 섞인 비정상 단어가 의심됩니다. 입력 전환 상태를 확인해 주세요.";

const SOURCE_PRIORITY: Record<DetectedIssueSource, number> = {
  hanfix: 5,
  "mixed-script": 4,
  "particle-spacing": 3,
  "bound-noun-spacing": 2,
  "token-probe": 2,
  standard: 1,
};

const CONFIDENCE_PRIORITY: Record<DetectedIssueConfidence, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

let hanfixModulePromise: Promise<HanfixModule> | null = null;
let standardWordDictionaryPromise: Promise<Record<string, StandardWordDictionaryEntry>> | null =
  null;
let koreanHeadwordSetPromise: Promise<Set<string>> | null = null;

function normalizeBaseToken(token: string) {
  return token.replace(/^[^\p{Letter}\p{Number}가-힣]+|[^\p{Letter}\p{Number}가-힣]+$/gu, "").trim();
}

function normalizeIgnoreTerm(term: string) {
  return normalizeBaseToken(term);
}

function normalizeStandardWordToken(token: string) {
  return normalizeBaseToken(token).replace(/[-^\s]+/g, "");
}

function normalizeIssueToken(token: string) {
  return normalizeBaseToken(token);
}

function normalizeSuggestionText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function buildIssueKey(category: CoverLetterSpellcheckIssueCategory, token: string) {
  return `${category}:${token}`;
}

function sortIssues(a: CoverLetterSpellcheckIssue, b: CoverLetterSpellcheckIssue) {
  if (b.count !== a.count) {
    return b.count - a.count;
  }

  if (a.category !== b.category) {
    return a.category === "standard" ? -1 : 1;
  }

  return a.token.localeCompare(b.token, "ko-KR");
}

function buildIgnoreTermSet(
  ignoreTerms: string[] = [],
  normalizer: (term: string) => string = normalizeIgnoreTerm,
) {
  return new Set(
    [...BASE_IGNORE_TERMS, ...ignoreTerms]
      .map(normalizer)
      .filter((term) => term.length > 0),
  );
}

function shouldIgnoreIssue(
  token: string,
  ignoreTerms: Set<string>,
  normalizer: (term: string) => string = normalizeIssueToken,
) {
  const normalized = normalizer(token);

  return normalized.length > 0 && ignoreTerms.has(normalized);
}

function sumIssueCount(
  issues: CoverLetterSpellcheckIssue[],
  category?: CoverLetterSpellcheckIssueCategory,
) {
  return issues.reduce((total, issue) => {
    if (category && issue.category !== category) {
      return total;
    }

    return total + issue.count;
  }, 0);
}

function formatStandardWordSuggestions(suggestions: string[]) {
  if (suggestions.length === 0) {
    return "표준국어대사전에서 권장 표기를 찾지 못했습니다.";
  }

  return `표준국어대사전 기준 표준어 후보: ${suggestions.join(", ")}`;
}

function buildStandardWordLookupCandidates(token: string) {
  const normalizedToken = normalizeStandardWordToken(token);

  if (!normalizedToken) {
    return [];
  }

  const candidates = [normalizedToken];

  for (const suffix of STANDARD_WORD_PARTICLE_SUFFIXES) {
    if (!normalizedToken.endsWith(suffix) || normalizedToken.length <= suffix.length + 1) {
      continue;
    }

    candidates.push(normalizedToken.slice(0, normalizedToken.length - suffix.length));
  }

  return [...new Set(candidates)];
}

function buildSpellingTokenCandidates(token: string) {
  return buildStandardWordLookupCandidates(token);
}

function isHangulToken(token: string) {
  return HANGUL_TOKEN_PATTERN.test(token);
}

function containsLatin(value: string) {
  return LATIN_PATTERN.test(value);
}

function isSuspiciousMixedScriptToken(token: string) {
  return MIXED_SCRIPT_SUSPICIOUS_PATTERN.test(token);
}

function shouldSuppressConservativeSpellingToken(token: string) {
  return CONSERVATIVE_SAFE_SPELLING_TOKENS.has(normalizeStandardWordToken(token));
}

function isMeaningfulSuggestion(original: string, suggestion: string) {
  return normalizeSuggestionText(suggestion) !== normalizeSuggestionText(original);
}

function sanitizeSuggestions(original: string, suggestions: string[]) {
  return [
    ...new Set(
      suggestions
        .map(normalizeSuggestionText)
        .filter((suggestion) => suggestion.length > 0 && isMeaningfulSuggestion(original, suggestion)),
    ),
  ].slice(0, 5);
}

function sanitizeMixedScriptSuggestions(original: string, suggestions: string[]) {
  return sanitizeSuggestions(original, suggestions).filter((suggestion) => !containsLatin(suggestion));
}

function hasValidAttachedParticleForm(token: string, headwordSet: Set<string>) {
  if (!isHangulToken(token) || token.length < 2) {
    return false;
  }

  for (const particle of ATTACHED_PARTICLE_TOKENS) {
    if (!token.endsWith(particle) || token.length <= particle.length) {
      continue;
    }

    const stem = token.slice(0, token.length - particle.length);

    if (headwordSet.has(stem)) {
      return true;
    }
  }

  return false;
}

function getTrimBounds(rawToken: string) {
  let start = 0;
  let end = rawToken.length;

  while (start < end && !/[\p{Letter}\p{Number}가-힣]/u.test(rawToken[start] ?? "")) {
    start += 1;
  }

  while (end > start && !/[\p{Letter}\p{Number}가-힣]/u.test(rawToken[end - 1] ?? "")) {
    end -= 1;
  }

  return { start, end };
}

function tokenizeByWhitespaceWithOffsets(text: string) {
  const regex = /\S+/g;
  const tokens: TextToken[] = [];

  for (const match of text.matchAll(regex)) {
    const rawToken = match[0];
    const index = match.index ?? 0;
    const bounds = getTrimBounds(rawToken);
    const token = normalizeBaseToken(rawToken);

    if (!token) {
      continue;
    }

    tokens.push({
      token,
      start: index + bounds.start,
      end: index + bounds.end,
    });
  }

  return tokens;
}

function extractLookupTokens(text: string) {
  const regex = new RegExp(STANDARD_WORD_TOKEN_PATTERN.source, STANDARD_WORD_TOKEN_PATTERN.flags);
  const tokens: TextToken[] = [];

  for (const match of text.matchAll(regex)) {
    const token = normalizeBaseToken(match[0]);

    if (!token) {
      continue;
    }

    const start = match.index ?? 0;

    tokens.push({
      token,
      start,
      end: start + match[0].length,
    });
  }

  return tokens;
}

function buildTokenOccurrenceMap(tokens: TextToken[]) {
  const tokenMap = new Map<string, TextToken[]>();

  for (const token of tokens) {
    const current = tokenMap.get(token.token);

    if (current) {
      current.push(token);
      continue;
    }

    tokenMap.set(token.token, [token]);
  }

  return tokenMap;
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

function splitTextIntoChunksWithOffsets(text: string, maxLength = HANFIX_MAX_TEXT_LENGTH) {
  const chunkTexts = splitTextIntoChunks(text, maxLength);
  const chunks: TextChunk[] = [];
  let cursor = 0;

  for (const chunkText of chunkTexts) {
    const start = text.indexOf(chunkText, cursor);
    const resolvedStart = start >= 0 ? start : text.indexOf(chunkText);
    const safeStart = resolvedStart >= 0 ? resolvedStart : cursor;
    const end = safeStart + chunkText.length;

    chunks.push({
      text: chunkText,
      start: safeStart,
      end,
    });

    cursor = end;
  }

  return chunks;
}

function createDetectedSpan(
  token: string,
  start: number,
  end: number,
  category: CoverLetterSpellcheckIssueCategory,
  source: DetectedIssueSource,
  confidence: DetectedIssueConfidence,
  suggestions: string[],
  explanation: string | null,
  examples: string[] = [],
): DetectedIssueSpan {
  return {
    category,
    token,
    start,
    end,
    suggestions,
    explanation,
    examples,
    source,
    confidence,
  };
}

function mergeSpanExamples(currentExamples: string[], nextExamples: string[]) {
  return [...new Set([...currentExamples, ...nextExamples])].filter(Boolean).slice(0, 5);
}

function compareSpanPriority(left: DetectedIssueSpan, right: DetectedIssueSpan) {
  const sourceDiff = SOURCE_PRIORITY[right.source] - SOURCE_PRIORITY[left.source];

  if (sourceDiff !== 0) {
    return sourceDiff;
  }

  const confidenceDiff = CONFIDENCE_PRIORITY[right.confidence] - CONFIDENCE_PRIORITY[left.confidence];

  if (confidenceDiff !== 0) {
    return confidenceDiff;
  }

  const rangeDiff = (left.end - left.start) - (right.end - right.start);

  if (rangeDiff !== 0) {
    return rangeDiff;
  }

  return left.start - right.start;
}

function findExactSpan(spans: DetectedIssueSpan[], candidate: DetectedIssueSpan) {
  return spans.find(
    (span) =>
      span.category === candidate.category &&
      span.token === candidate.token &&
      span.start === candidate.start &&
      span.end === candidate.end,
  );
}

function hasOverlappingSpellingSpan(
  spans: DetectedIssueSpan[],
  candidate: DetectedIssueSpan,
  options: { requireExact?: boolean } = {},
) {
  return spans.some((span) => {
    if (span.category !== "spelling") {
      return false;
    }

    if (options.requireExact) {
      return span.start === candidate.start && span.end === candidate.end;
    }

    return span.start < candidate.end && candidate.start < span.end;
  });
}

function mergeDetectedSpans(spans: DetectedIssueSpan[]) {
  const kept: DetectedIssueSpan[] = [];

  for (const candidate of spans.sort(compareSpanPriority)) {
    const exact = findExactSpan(kept, candidate);

    if (exact) {
      exact.suggestions = [...new Set([...exact.suggestions, ...candidate.suggestions])].slice(0, 5);

      if (!exact.explanation && candidate.explanation) {
        exact.explanation = candidate.explanation;
      }

      exact.examples = mergeSpanExamples(exact.examples, candidate.examples);
      continue;
    }

    if (
      candidate.category === "standard" &&
      hasOverlappingSpellingSpan(kept, candidate)
    ) {
      continue;
    }

    if (
      candidate.category === "spelling" &&
      candidate.suggestions.length === 0 &&
      hasOverlappingSpellingSpan(kept, candidate, { requireExact: true })
    ) {
      continue;
    }

    kept.push(candidate);
  }

  return kept.sort((left, right) => {
    if (left.start !== right.start) {
      return left.start - right.start;
    }

    return compareSpanPriority(left, right);
  });
}

function aggregateDetectedSpans(spans: DetectedIssueSpan[]) {
  const issueMap = new Map<string, CoverLetterSpellcheckIssue>();

  for (const span of spans) {
    const issueKey = buildIssueKey(span.category, span.token);
    const currentIssue = issueMap.get(issueKey);

    if (currentIssue) {
      currentIssue.count += 1;
      currentIssue.suggestions = [...new Set([...currentIssue.suggestions, ...span.suggestions])].slice(0, 5);

      if (!currentIssue.explanation && span.explanation) {
        currentIssue.explanation = span.explanation;
      }

      currentIssue.examples = mergeSpanExamples(currentIssue.examples, span.examples);
      continue;
    }

    issueMap.set(issueKey, {
      category: span.category,
      token: span.token,
      count: 1,
      suggestions: [...span.suggestions],
      explanation: span.explanation,
      examples: [...span.examples],
    });
  }

  return [...issueMap.values()].sort(sortIssues);
}

async function sleep(delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay));
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

async function getStandardWordDictionary() {
  if (!standardWordDictionaryPromise) {
    standardWordDictionaryPromise = import("./generated/standardWordDictionary.cjs")
      .then((module) => (module as StandardWordDictionaryModule).STANDARD_WORD_DICTIONARY)
      .catch((error) => {
        standardWordDictionaryPromise = null;
        throw error;
      });
  }

  return standardWordDictionaryPromise;
}

async function getKoreanHeadwordSet() {
  if (!koreanHeadwordSetPromise) {
    koreanHeadwordSetPromise = import("./generated/koreanHeadwords.cjs")
      .then((module) => new Set((module as KoreanHeadwordsModule).KOREAN_HEADWORDS))
      .catch((error) => {
        koreanHeadwordSetPromise = null;
        throw error;
      });
  }

  return koreanHeadwordSetPromise;
}

async function checkChunk(text: string) {
  const hanfixModule = await getHanfixModule();

  return hanfixModule.check(text);
}

async function runHanfixProbe(
  text: string,
  context: ProbeContext,
  attempts = 1,
): Promise<HanfixIssue[]> {
  const cached = context.hanfixProbeCache.get(text);

  if (cached && (cached.issues.length > 0 || cached.attempts >= attempts)) {
    return cached.issues;
  }

  let lastIssues = cached?.issues ?? [];
  const startAttempt = cached?.attempts ?? 0;

  for (let attempt = startAttempt; attempt < attempts; attempt += 1) {
    try {
      const issues = await checkChunk(text);
      lastIssues = issues;

      if (issues.length > 0) {
        context.hanfixProbeCache.set(text, {
          attempts: attempt + 1,
          issues,
        });

        return issues;
      }
    } catch (error) {
      if (attempt === attempts - 1) {
        throw error;
      }
    }

    if (attempt < attempts - 1) {
      await sleep(HANFIX_PROBE_RETRY_DELAYS[Math.min(attempt, HANFIX_PROBE_RETRY_DELAYS.length - 1)] ?? 0);
    }
  }

  context.hanfixProbeCache.set(text, {
    attempts,
    issues: lastIssues,
  });

  return lastIssues;
}

function buildIssueFromDirectProbe(
  token: string,
  issue: HanfixIssue,
  suffix: string | null,
): ProbeIssueTemplate | null {
  if (normalizeStandardWordToken(issue.original) !== normalizeStandardWordToken(token)) {
    return null;
  }

  const suggestions = sanitizeSuggestions(
    token,
    issue.suggestions.map((suggestion) => rebuildSuggestionWithSuffix(suggestion, suffix)),
  );

  if (suggestions.length === 0) {
    return null;
  }

  return {
    suggestions,
    explanation: issue.explanation ?? null,
    examples: issue.examples?.filter((example): example is string => Boolean(example)) ?? [],
    confidence: "medium",
  };
}

function buildIssueFromTemplateProbe(token: string, issue: HanfixIssue): ProbeIssueTemplate | null {
  const originalWithSuffix = `${token}${TOKEN_PROBE_TEMPLATE_SUFFIX}`;
  const normalizedOriginal = normalizeBaseToken(issue.original);

  if (!normalizedOriginal.endsWith(originalWithSuffix)) {
    return null;
  }

  const suggestions = sanitizeSuggestions(
    token,
    issue.suggestions
      .map((suggestion) => {
        if (!suggestion.endsWith(TOKEN_PROBE_TEMPLATE_SUFFIX)) {
          return null;
        }

        return suggestion.slice(0, -TOKEN_PROBE_TEMPLATE_SUFFIX.length);
      })
      .filter((suggestion): suggestion is string => Boolean(suggestion)),
  );

  if (suggestions.length === 0) {
    return null;
  }

  return {
    suggestions,
    explanation: issue.explanation ?? null,
    examples: issue.examples?.filter((example): example is string => Boolean(example)) ?? [],
    confidence: "medium",
  };
}

function stripParticleSuffix(token: string, root: string) {
  if (!token.startsWith(root)) {
    return null;
  }

  return token.slice(root.length);
}

function rebuildSuggestionWithSuffix(suggestion: string, suffix: string | null) {
  if (!suffix) {
    return suggestion;
  }

  const trimmedSuggestion = suggestion.trimEnd();

  if (!trimmedSuggestion) {
    return suffix;
  }

  return `${trimmedSuggestion}${suffix}`;
}

async function probeSingleToken(token: string, context: ProbeContext) {
  const cached = context.tokenProbeCache.get(token);

  if (cached !== undefined) {
    return cached;
  }

  const candidates = buildSpellingTokenCandidates(token);

  for (const candidate of candidates) {
    const suffix = stripParticleSuffix(token, candidate);
    const directIssues = await runHanfixProbe(candidate, context, 2);
    const directIssue = directIssues
      .map((issue) => buildIssueFromDirectProbe(token, issue, suffix))
      .find((issue): issue is ProbeIssueTemplate => Boolean(issue));

    if (directIssue) {
      context.tokenProbeCache.set(token, directIssue);
      return directIssue;
    }

    if (suffix) {
      continue;
    }

    const templateIssues = await runHanfixProbe(
      `${TOKEN_PROBE_TEMPLATE_PREFIX}${candidate}${TOKEN_PROBE_TEMPLATE_SUFFIX}`,
      context,
      2,
    );
    const templateIssue = templateIssues
      .map((issue) => buildIssueFromTemplateProbe(token, issue))
      .find((issue): issue is ProbeIssueTemplate => Boolean(issue));

    if (templateIssue) {
      context.tokenProbeCache.set(token, templateIssue);
      return templateIssue;
    }
  }

  context.tokenProbeCache.set(token, null);
  return null;
}

function buildMixedScriptCandidates(token: string) {
  const candidates = [token];
  const segmentPattern = /[A-Za-z]+/g;

  for (const match of token.matchAll(segmentPattern)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const left = token.slice(0, start);
    const right = token.slice(end);
    const spaced = [left, match[0], right].filter(Boolean).join(" ");

    if (spaced && spaced !== token) {
      candidates.push(spaced);
    }
  }

  return [...new Set(candidates)];
}

async function probeMixedScriptToken(token: string, context: ProbeContext) {
  const cached = context.mixedScriptProbeCache.get(token);

  if (cached !== undefined) {
    return cached;
  }

  for (const [index, candidate] of buildMixedScriptCandidates(token).entries()) {
    const issues = await runHanfixProbe(candidate, context, index === 0 ? 3 : 2);
    const matchedIssue = issues.find((issue) => {
      const normalizedOriginal = normalizeStandardWordToken(issue.original);

      return (
        normalizedOriginal === normalizeStandardWordToken(token) ||
        normalizedOriginal === normalizeStandardWordToken(candidate)
      );
    });

    if (!matchedIssue) {
      continue;
    }

    const suggestions = sanitizeMixedScriptSuggestions(token, matchedIssue.suggestions);

    if (suggestions.length > 0) {
      const result = {
        suggestions,
        explanation: matchedIssue.explanation ?? MIXED_SCRIPT_WARNING_MESSAGE,
        examples: matchedIssue.examples?.filter((example): example is string => Boolean(example)) ?? [],
        confidence: "medium" as const,
      };

      context.mixedScriptProbeCache.set(token, result);
      return result;
    }
  }

  const warningIssue = {
    suggestions: [],
    explanation: MIXED_SCRIPT_WARNING_MESSAGE,
    examples: [],
    confidence: "low" as const,
  };

  context.mixedScriptProbeCache.set(token, warningIssue);
  return warningIssue;
}

function findSequentialOccurrence(text: string, needle: string, startAt: number) {
  if (!needle) {
    return -1;
  }

  const exactIndex = text.indexOf(needle, startAt);

  if (exactIndex >= 0) {
    return exactIndex;
  }

  if (startAt > 0) {
    return text.indexOf(needle);
  }

  return -1;
}

function locateHanfixSpansInChunk(
  chunk: TextChunk,
  issues: HanfixIssue[],
  ignoreTerms: Set<string>,
) {
  const spans: DetectedIssueSpan[] = [];
  const occurrenceCursor = new Map<string, number>();

  for (const issue of issues) {
    const token = normalizeBaseToken(issue.original);

    if (
      !token ||
      shouldIgnoreIssue(token, ignoreTerms) ||
      shouldSuppressConservativeSpellingToken(token)
    ) {
      continue;
    }

    const localSearchStart = occurrenceCursor.get(issue.original) ?? 0;
    const localStart =
      findSequentialOccurrence(chunk.text, issue.original, localSearchStart) >= 0
        ? findSequentialOccurrence(chunk.text, issue.original, localSearchStart)
        : findSequentialOccurrence(chunk.text, token, localSearchStart);

    if (localStart < 0) {
      continue;
    }

    occurrenceCursor.set(issue.original, localStart + token.length);

    const suggestions = isSuspiciousMixedScriptToken(token)
      ? sanitizeMixedScriptSuggestions(token, issue.suggestions)
      : sanitizeSuggestions(token, issue.suggestions);
    const explanation =
      isSuspiciousMixedScriptToken(token) && suggestions.length === 0
        ? MIXED_SCRIPT_WARNING_MESSAGE
        : issue.explanation ?? null;

    spans.push(
      createDetectedSpan(
        token,
        chunk.start + localStart,
        chunk.start + localStart + token.length,
        "spelling",
        "hanfix",
        suggestions.length > 0 ? "high" : "medium",
        suggestions,
        explanation,
        issue.examples?.filter((example): example is string => Boolean(example)) ?? [],
      ),
    );
  }

  return spans;
}

async function buildHanfixSpans(
  chunks: TextChunk[],
  ignoreTerms: Set<string>,
  warnings: string[],
) {
  const spans: DetectedIssueSpan[] = [];

  for (const [index, chunk] of chunks.entries()) {
    try {
      const issues = await checkChunk(chunk.text);
      spans.push(...locateHanfixSpansInChunk(chunk, issues, ignoreTerms));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "맞춤법 검사를 완료하지 못했습니다.";

      warnings.push(`${index + 1}번째 구간 검사에 실패했습니다. (${message})`);
    }
  }

  return spans;
}

async function buildMixedScriptSpans(
  text: string,
  tokens: TextToken[],
  ignoreTerms: Set<string>,
  context: ProbeContext,
  existingSpans: DetectedIssueSpan[],
) {
  const spans: DetectedIssueSpan[] = [];

  for (const token of tokens) {
    if (
      !isSuspiciousMixedScriptToken(token.token) ||
      shouldIgnoreIssue(token.token, ignoreTerms, (value) => value) ||
      shouldSuppressConservativeSpellingToken(token.token)
    ) {
      continue;
    }

    if (hasOverlappingSpellingSpan(existingSpans, createDetectedSpan(token.token, token.start, token.end, "spelling", "mixed-script", "low", [], null), { requireExact: true })) {
      continue;
    }

    const issue = await probeMixedScriptToken(token.token, context);

    spans.push(
      createDetectedSpan(
        token.token,
        token.start,
        token.end,
        "spelling",
        "mixed-script",
        issue.confidence,
        issue.suggestions,
        issue.explanation,
        issue.examples,
      ),
    );
  }

  return spans;
}

function buildParticleSpacingSpans(text: string, ignoreTerms: Set<string>) {
  const tokens = tokenizeByWhitespaceWithOffsets(text);
  const spans: DetectedIssueSpan[] = [];
  const seenKeys = new Set<string>();

  for (let index = 1; index < tokens.length; index += 1) {
    const leftToken = tokens[index - 1];
    const rightToken = tokens[index];
    const explanation = ATTACHED_PARTICLE_RULES.get(rightToken.token);

    if (!explanation || !isHangulToken(leftToken.token) || !isHangulToken(rightToken.token)) {
      continue;
    }

    if (
      shouldIgnoreIssue(leftToken.token, ignoreTerms, (value) => value) ||
      shouldIgnoreIssue(rightToken.token, ignoreTerms, (value) => value)
    ) {
      continue;
    }

    const issueToken = `${leftToken.token} ${rightToken.token}`;
    const issueKey = `${issueToken}:${leftToken.start}:${rightToken.end}`;

    if (seenKeys.has(issueKey)) {
      continue;
    }

    seenKeys.add(issueKey);

    spans.push(
      createDetectedSpan(
        issueToken,
        leftToken.start,
        rightToken.end,
        "spelling",
        "particle-spacing",
        "high",
        [`${leftToken.token}${rightToken.token}`],
        explanation,
      ),
    );
  }

  return spans;
}

function buildBoundNounSpacingSpans(text: string, ignoreTerms: Set<string>) {
  const tokens = tokenizeByWhitespaceWithOffsets(text);
  const spans: DetectedIssueSpan[] = [];

  for (const token of tokens) {
    if (
      !isHangulToken(token.token) ||
      shouldIgnoreIssue(token.token, ignoreTerms, (value) => value) ||
      COUNTER_SPACING_EXCLUSIONS.has(token.token)
    ) {
      continue;
    }

    for (const [suffix, explanation] of COUNTER_SUFFIX_EXPLANATIONS.entries()) {
      if (!token.token.endsWith(suffix) || token.token.length <= suffix.length) {
        continue;
      }

      const prefix = token.token.slice(0, -suffix.length);

      if (!COUNTER_PREFIXES.has(prefix)) {
        continue;
      }

      spans.push(
        createDetectedSpan(
          token.token,
          token.start,
          token.end,
          "spelling",
          "bound-noun-spacing",
          "medium",
          [`${prefix} ${suffix}`],
          explanation,
        ),
      );

      break;
    }
  }

  return spans;
}

async function buildTokenProbeSpans(
  text: string,
  ignoreTerms: Set<string>,
  headwordSet: Set<string>,
  context: ProbeContext,
  existingSpans: DetectedIssueSpan[],
) {
  const tokens = tokenizeByWhitespaceWithOffsets(text);
  const tokenOccurrences = buildTokenOccurrenceMap(tokens);
  const spans: DetectedIssueSpan[] = [];
  let probeCount = 0;

  for (const [token, occurrences] of tokenOccurrences.entries()) {
    if (probeCount >= TOKEN_PROBE_LIMIT) {
      break;
    }

    if (
      !isHangulToken(token) ||
      headwordSet.has(token) ||
      hasValidAttachedParticleForm(token, headwordSet) ||
      shouldIgnoreIssue(token, ignoreTerms, (value) => value) ||
      shouldSuppressConservativeSpellingToken(token)
    ) {
      continue;
    }

    if (
      existingSpans.some(
        (span) => span.category === "spelling" && span.token === token && occurrences.some((occurrence) => occurrence.start === span.start && occurrence.end === span.end),
      )
    ) {
      continue;
    }

    const issue = await probeSingleToken(token, context);
    probeCount += 1;

    if (!issue) {
      continue;
    }

    for (const occurrence of occurrences) {
      spans.push(
        createDetectedSpan(
          token,
          occurrence.start,
          occurrence.end,
          "spelling",
          "token-probe",
          issue.confidence,
          issue.suggestions,
          issue.explanation,
          issue.examples,
        ),
      );
    }
  }

  return spans;
}

async function buildStandardWordSpans(text: string, ignoreTerms: Set<string>) {
  const standardWordDictionary = await getStandardWordDictionary();
  const tokens = extractLookupTokens(text);
  const spans: DetectedIssueSpan[] = [];

  for (const token of tokens) {
    const lookupCandidates = buildStandardWordLookupCandidates(token.token);

    if (
      lookupCandidates.length === 0 ||
      lookupCandidates.some((candidate) => shouldIgnoreIssue(candidate, ignoreTerms, (value) => value))
    ) {
      continue;
    }

    const matchedCandidate = lookupCandidates.find((candidate) => Boolean(standardWordDictionary[candidate]));

    if (!matchedCandidate) {
      continue;
    }

    const entry = standardWordDictionary[matchedCandidate];

    spans.push(
      createDetectedSpan(
        token.token,
        token.start,
        token.end,
        "standard",
        "standard",
        "high",
        [...entry.suggestions],
        entry.note || formatStandardWordSuggestions(entry.suggestions),
      ),
    );
  }

  return spans;
}

export async function checkCoverLetterSpelling(
  payload: CoverLetterSpellcheckRequest,
): Promise<CoverLetterSpellcheckResponse> {
  const normalizedText = payload.text.trim();

  if (!normalizedText) {
    return {
      checkedAt: new Date().toISOString(),
      issueCount: 0,
      spellingIssueCount: 0,
      standardIssueCount: 0,
      issues: [],
      warnings: [],
    };
  }

  const warnings: string[] = [];
  const ignoreTerms = buildIgnoreTermSet(payload.ignoreTerms);
  const standardWordIgnoreTerms = buildIgnoreTermSet(payload.ignoreTerms, normalizeStandardWordToken);
  const chunks = splitTextIntoChunksWithOffsets(normalizedText);
  const probeContext: ProbeContext = {
    hanfixProbeCache: new Map(),
    tokenProbeCache: new Map(),
    mixedScriptProbeCache: new Map(),
  };

  if (chunks.length > 1) {
    warnings.push(`답변이 길어 ${chunks.length}개 구간으로 나누어 검사했습니다.`);
  }

  const directHanfixSpans = await buildHanfixSpans(chunks, ignoreTerms, warnings);
  const lookupTokens = extractLookupTokens(normalizedText);
  const spellingSupportSpans: DetectedIssueSpan[] = [...directHanfixSpans];

  try {
    const headwordSet = await getKoreanHeadwordSet();
    const mixedScriptSpans = await buildMixedScriptSpans(
      normalizedText,
      lookupTokens,
      standardWordIgnoreTerms,
      probeContext,
      spellingSupportSpans,
    );

    spellingSupportSpans.push(...mixedScriptSpans);
    spellingSupportSpans.push(...buildParticleSpacingSpans(normalizedText, standardWordIgnoreTerms));
    spellingSupportSpans.push(...buildBoundNounSpacingSpans(normalizedText, standardWordIgnoreTerms));

    const tokenProbeSpans = await buildTokenProbeSpans(
      normalizedText,
      standardWordIgnoreTerms,
      headwordSet,
      probeContext,
      spellingSupportSpans,
    );

    spellingSupportSpans.push(...tokenProbeSpans);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "보조 맞춤법 검사를 완료하지 못했습니다.";

    warnings.push(`보조 맞춤법 검사에 실패했습니다. (${message})`);
  }

  const mergedSpellingSpans = mergeDetectedSpans(spellingSupportSpans);
  let mergedSpans = [...mergedSpellingSpans];

  try {
    const standardWordSpans = await buildStandardWordSpans(normalizedText, standardWordIgnoreTerms);
    mergedSpans = mergeDetectedSpans([...mergedSpellingSpans, ...standardWordSpans]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "표준어 검사를 완료하지 못했습니다.";

    warnings.push(`표준어 검사에 실패했습니다. (${message})`);
  }

  const issues = aggregateDetectedSpans(mergedSpans);
  const spellingIssueCount = sumIssueCount(issues, "spelling");
  const standardIssueCount = sumIssueCount(issues, "standard");

  return {
    checkedAt: new Date().toISOString(),
    issueCount: spellingIssueCount + standardIssueCount,
    spellingIssueCount,
    standardIssueCount,
    issues,
    warnings,
  };
}
