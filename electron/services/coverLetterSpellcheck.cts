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
const STANDARD_WORD_TOKEN_PATTERN = /[A-Za-z0-9가-힣^+-]{2,}/g;
const HANGUL_TOKEN_PATTERN = /^[가-힣]+$/;
const STANDARD_WORD_PARTICLE_SUFFIXES = ["으로", "에서", "에게", "은", "는", "이", "가", "을", "를", "도", "만", "와", "과", "로"];
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
const SPLIT_CANDIDATE_SEGMENT_LIMIT = 4;
const SPLIT_CANDIDATE_EXTRA_SEGMENTS = new Set([
  "불구하고",
  "때문에",
  "만큼",
  "대로",
  "처럼",
  "뿐만",
  "입니다",
  "인데도",
  "이라도",
  "이라고",
  "이며",
  "였다",
  "이었다",
]);
const SPLIT_CANDIDATE_ATTACHED_SEGMENTS = new Set([
  "입니다",
  "인데도",
  "이라도",
  "이라고",
  "이며",
  "였다",
  "이었다",
]);
const SPLIT_CANDIDATE_ALLOWED_SINGLE_SYLLABLE_SEGMENTS = new Set([
  "이",
  "그",
  "저",
  "한",
  "두",
  "세",
  "네",
  "몇",
  "개",
  "번",
  "명",
  "채",
  "칸",
  "줄",
  "수",
  "것",
  "쪽",
  "집",
  "말",
  "글",
  "끝",
  "첫",
]);
const TOKEN_PROBE_LIMIT = 10;
const TOKEN_PROBE_TEMPLATE_PREFIX = "이 단어는 ";
const TOKEN_PROBE_TEMPLATE_SUFFIX = "입니다.";

let hanfixModulePromise: Promise<HanfixModule> | null = null;
let standardWordDictionaryPromise: Promise<Record<string, StandardWordDictionaryEntry>> | null =
  null;
let koreanHeadwordSetPromise: Promise<Set<string>> | null = null;
const tokenProbeCache = new Map<string, CoverLetterSpellcheckIssue | null>();

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

function isHangulToken(token: string) {
  return HANGUL_TOKEN_PATTERN.test(token);
}

function tokenizeByWhitespace(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\s+/)
    .map((token) => normalizeBaseToken(token))
    .filter((token) => token.length > 0);
}

function buildTokenFrequencyMap(tokens: string[]) {
  const frequencyMap = new Map<string, number>();

  for (const token of tokens) {
    frequencyMap.set(token, (frequencyMap.get(token) ?? 0) + 1);
  }

  return frequencyMap;
}

function buildSpellingTokenCandidates(token: string) {
  return buildStandardWordLookupCandidates(token);
}

function hasSimilarSpellingIssue(issueMap: Map<string, CoverLetterSpellcheckIssue>, token: string) {
  const candidates = new Set(buildSpellingTokenCandidates(token));

  return [...issueMap.values()].some((issue) => {
    if (issue.category !== "spelling") {
      return false;
    }

    return buildSpellingTokenCandidates(issue.token).some((candidate) => candidates.has(candidate));
  });
}

function hasStandaloneSpellingIssue(issueMap: Map<string, CoverLetterSpellcheckIssue>, token: string) {
  const candidates = new Set(buildSpellingTokenCandidates(token));

  return [...issueMap.values()].some((issue) => {
    if (issue.category !== "spelling" || issue.token.includes(" ")) {
      return false;
    }

    return buildSpellingTokenCandidates(issue.token).some((candidate) => candidates.has(candidate));
  });
}

function isSplitSegmentCandidate(token: string, headwordSet: Set<string>) {
  return headwordSet.has(token) || SPLIT_CANDIDATE_EXTRA_SEGMENTS.has(token);
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

function isAllowedSingleSyllableSegment(token: string) {
  return token.length > 1 || SPLIT_CANDIDATE_ALLOWED_SINGLE_SYLLABLE_SEGMENTS.has(token);
}

function scoreSplitParts(parts: string[]) {
  return parts.reduce((score, part, index) => {
    let nextScore = score + Math.min(part.length, 4) * 5;

    if (index === 0 && part.length === 1 && !SPLIT_CANDIDATE_ALLOWED_SINGLE_SYLLABLE_SEGMENTS.has(part)) {
      nextScore -= 12;
    }

    if (part.length === 1 && !SPLIT_CANDIDATE_ALLOWED_SINGLE_SYLLABLE_SEGMENTS.has(part)) {
      nextScore -= 8;
    }

    return nextScore;
  }, parts.length === 2 ? 100 : 100 - parts.length * 8);
}

function formatSplitParts(parts: string[]) {
  if (parts.length === 0) {
    return "";
  }

  let result = parts[0];

  for (const part of parts.slice(1)) {
    if (SPLIT_CANDIDATE_ATTACHED_SEGMENTS.has(part)) {
      result += part;
      continue;
    }

    result += ` ${part}`;
  }

  return result;
}

function findBestCompoundSplit(token: string, headwordSet: Set<string>) {
  if (
    !isHangulToken(token) ||
    token.length < 3 ||
    token.length > 12 ||
    headwordSet.has(token) ||
    hasValidAttachedParticleForm(token, headwordSet)
  ) {
    return null;
  }

  const candidates: string[][] = [];

  function walk(startIndex: number, parts: string[]) {
    if (parts.length > SPLIT_CANDIDATE_SEGMENT_LIMIT) {
      return;
    }

    if (startIndex === token.length) {
      if (parts.length >= 2 && parts.every(isAllowedSingleSyllableSegment)) {
        candidates.push([...parts]);
      }

      return;
    }

    for (let nextIndex = startIndex + 1; nextIndex <= token.length; nextIndex += 1) {
      const part = token.slice(startIndex, nextIndex);

      if (!isSplitSegmentCandidate(part, headwordSet)) {
        continue;
      }

      if (parts.length > 0 && ATTACHED_PARTICLE_TOKENS.has(part)) {
        continue;
      }

      parts.push(part);
      walk(nextIndex, parts);
      parts.pop();
    }
  }

  walk(0, []);

  if (candidates.length === 0) {
    return null;
  }

  return candidates.sort((left, right) => scoreSplitParts(right) - scoreSplitParts(left))[0] ?? null;
}

function buildSpacingIssue(
  token: string,
  suggestion: string,
  explanation: string,
  count = 1,
): CoverLetterSpellcheckIssue {
  return {
    category: "spelling",
    token,
    count,
    suggestions: [suggestion],
    explanation,
    examples: [],
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

  if (trimmedSuggestion.includes(" ")) {
    return `${trimmedSuggestion}${suffix}`;
  }

  return `${trimmedSuggestion}${suffix}`;
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

function buildIssueFromDirectProbe(
  token: string,
  issue: HanfixIssue,
  suffix: string | null,
): CoverLetterSpellcheckIssue | null {
  if (normalizeStandardWordToken(issue.original) !== normalizeStandardWordToken(token)) {
    return null;
  }

  return {
    category: "spelling",
    token,
    count: 1,
    suggestions: [...new Set(issue.suggestions.map((suggestion) => rebuildSuggestionWithSuffix(suggestion, suffix)))],
    explanation: issue.explanation ?? null,
    examples: issue.examples?.filter((example): example is string => Boolean(example)) ?? [],
  };
}

function buildIssueFromTemplateProbe(token: string, issue: HanfixIssue): CoverLetterSpellcheckIssue | null {
  const originalWithSuffix = `${token}${TOKEN_PROBE_TEMPLATE_SUFFIX}`;
  const normalizedOriginal = normalizeBaseToken(issue.original);

  if (!normalizedOriginal.endsWith(originalWithSuffix)) {
    return null;
  }

  const suggestions = issue.suggestions
    .map((suggestion) => {
      if (!suggestion.endsWith(TOKEN_PROBE_TEMPLATE_SUFFIX)) {
        return null;
      }

      return suggestion.slice(0, -TOKEN_PROBE_TEMPLATE_SUFFIX.length);
    })
    .filter((suggestion): suggestion is string => Boolean(suggestion));

  if (suggestions.length === 0) {
    return null;
  }

  return {
    category: "spelling",
    token,
    count: 1,
    suggestions: [...new Set(suggestions)],
    explanation: issue.explanation ?? null,
    examples: issue.examples?.filter((example): example is string => Boolean(example)) ?? [],
  };
}

async function probeSingleToken(token: string) {
  const cached = tokenProbeCache.get(token);

  if (cached !== undefined) {
    return cached;
  }

  const candidates = buildSpellingTokenCandidates(token);

  for (const candidate of candidates) {
    const suffix = stripParticleSuffix(token, candidate);

    try {
      const directIssues = await checkChunk(candidate);
      const directIssue = directIssues
        .map((issue) => buildIssueFromDirectProbe(token, issue, suffix))
        .find((issue): issue is CoverLetterSpellcheckIssue => Boolean(issue));

      if (directIssue) {
        tokenProbeCache.set(token, directIssue);
        return directIssue;
      }

      if (suffix) {
        continue;
      }

      const templateIssues = await checkChunk(`${TOKEN_PROBE_TEMPLATE_PREFIX}${candidate}${TOKEN_PROBE_TEMPLATE_SUFFIX}`);
      const templateIssue = templateIssues
        .map((issue) => buildIssueFromTemplateProbe(token, issue))
        .find((issue): issue is CoverLetterSpellcheckIssue => Boolean(issue));

      if (templateIssue) {
        tokenProbeCache.set(token, templateIssue);
        return templateIssue;
      }
    } catch {
      break;
    }
  }

  tokenProbeCache.set(token, null);
  return null;
}

async function checkStandardWords(text: string, ignoreTerms: Set<string>) {
  const standardWordDictionary = await getStandardWordDictionary();
  const tokens = text.match(STANDARD_WORD_TOKEN_PATTERN) ?? [];
  const issues = new Map<string, CoverLetterSpellcheckIssue>();

  for (const token of tokens) {
    const displayToken = normalizeBaseToken(token);
    const lookupCandidates = buildStandardWordLookupCandidates(token);

    if (
      !displayToken ||
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
    const currentIssue = issues.get(displayToken);

    if (currentIssue) {
      currentIssue.count += 1;
      continue;
    }

    issues.set(displayToken, {
      category: "standard",
      token: displayToken,
      count: 1,
      suggestions: [...entry.suggestions],
      explanation: entry.note || formatStandardWordSuggestions(entry.suggestions),
      examples: [],
    });
  }

  return [...issues.values()].sort(sortIssues);
}

async function buildParticleSpacingIssues(
  text: string,
  ignoreTerms: Set<string>,
  headwordSet: Set<string>,
) {
  const tokens = tokenizeByWhitespace(text);
  const issues = new Map<string, CoverLetterSpellcheckIssue>();

  for (let index = 1; index < tokens.length; index += 1) {
    const leftToken = tokens[index - 1];
    const rightToken = tokens[index];
    const explanation = ATTACHED_PARTICLE_RULES.get(rightToken);

    if (!explanation || !isHangulToken(leftToken) || !isHangulToken(rightToken)) {
      continue;
    }

    if (
      shouldIgnoreIssue(leftToken, ignoreTerms, (value) => value) ||
      shouldIgnoreIssue(rightToken, ignoreTerms, (value) => value)
    ) {
      continue;
    }

    const splitParts = findBestCompoundSplit(leftToken, headwordSet);
    const joinedLeftToken = splitParts ? formatSplitParts(splitParts) : leftToken;
    const suggestion = `${joinedLeftToken}${rightToken}`;
    const issueToken = `${leftToken} ${rightToken}`;
    const currentIssue = issues.get(issueToken);

    if (currentIssue) {
      currentIssue.count += 1;
      continue;
    }

    issues.set(
      issueToken,
      buildSpacingIssue(
        issueToken,
        suggestion,
        splitParts
          ? "띄어쓰기와 조사가 함께 어긋난 표현입니다. 앞부분은 띄어 쓰고 조사는 앞말에 붙여 씁니다."
          : explanation,
      ),
    );
  }

  return [...issues.values()].sort(sortIssues);
}

async function buildCompoundSpacingIssues(
  text: string,
  ignoreTerms: Set<string>,
  headwordSet: Set<string>,
) {
  const tokens = tokenizeByWhitespace(text);
  const frequencyMap = buildTokenFrequencyMap(tokens);
  const tokensFollowedByParticles = new Set<string>();
  const issues: CoverLetterSpellcheckIssue[] = [];

  for (let index = 1; index < tokens.length; index += 1) {
    if (ATTACHED_PARTICLE_TOKENS.has(tokens[index])) {
      tokensFollowedByParticles.add(tokens[index - 1]);
    }
  }

  for (const [token, count] of frequencyMap.entries()) {
    if (!isHangulToken(token) || shouldIgnoreIssue(token, ignoreTerms, (value) => value)) {
      continue;
    }

    if (tokensFollowedByParticles.has(token)) {
      continue;
    }

    const splitParts = findBestCompoundSplit(token, headwordSet);

    if (!splitParts) {
      continue;
    }

    issues.push(
      buildSpacingIssue(
        token,
        formatSplitParts(splitParts),
        "사전 기반 띄어쓰기 보정 후보입니다. 단어 경계를 띄어 써서 다시 확인해 보세요.",
        count,
      ),
    );
  }

  return issues.sort(sortIssues);
}

async function buildTokenProbeIssues(
  text: string,
  ignoreTerms: Set<string>,
  headwordSet: Set<string>,
  issueMap: Map<string, CoverLetterSpellcheckIssue>,
) {
  const tokens = tokenizeByWhitespace(text);
  const frequencyMap = buildTokenFrequencyMap(tokens);
  const issues: CoverLetterSpellcheckIssue[] = [];
  let probeCount = 0;

  for (const [token, count] of frequencyMap.entries()) {
    if (probeCount >= TOKEN_PROBE_LIMIT) {
      break;
    }

    if (!isHangulToken(token) || headwordSet.has(token) || shouldIgnoreIssue(token, ignoreTerms, (value) => value)) {
      continue;
    }

    if (hasStandaloneSpellingIssue(issueMap, token)) {
      continue;
    }

    const issue = await probeSingleToken(token);

    probeCount += 1;

    if (!issue || hasStandaloneSpellingIssue(issueMap, issue.token)) {
      continue;
    }

    issue.count = count;
    issues.push(issue);
  }

  return issues.sort(sortIssues);
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

  const chunks = splitTextIntoChunks(normalizedText);
  const warnings: string[] = [];
  const issueMap = new Map<string, CoverLetterSpellcheckIssue>();
  const ignoreTerms = buildIgnoreTermSet(payload.ignoreTerms);
  const standardWordIgnoreTerms = buildIgnoreTermSet(payload.ignoreTerms, normalizeStandardWordToken);

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

        const issueKey = buildIssueKey("spelling", issue.original);
        const currentIssue = issueMap.get(issueKey);

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

        issueMap.set(issueKey, {
          category: "spelling",
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

  try {
    const headwordSet = await getKoreanHeadwordSet();
    const particleSpacingIssues = await buildParticleSpacingIssues(
      normalizedText,
      standardWordIgnoreTerms,
      headwordSet,
    );

    for (const issue of particleSpacingIssues) {
      if (issueMap.has(buildIssueKey(issue.category, issue.token))) {
        continue;
      }

      issueMap.set(buildIssueKey(issue.category, issue.token), issue);
    }

    const compoundSpacingIssues = await buildCompoundSpacingIssues(
      normalizedText,
      standardWordIgnoreTerms,
      headwordSet,
    );

    for (const issue of compoundSpacingIssues) {
      if (hasSimilarSpellingIssue(issueMap, issue.token)) {
        continue;
      }

      issueMap.set(buildIssueKey(issue.category, issue.token), issue);
    }

    const tokenProbeIssues = await buildTokenProbeIssues(
      normalizedText,
      standardWordIgnoreTerms,
      headwordSet,
      issueMap,
    );

    for (const issue of tokenProbeIssues) {
      if (hasSimilarSpellingIssue(issueMap, issue.token)) {
        continue;
      }

      issueMap.set(buildIssueKey(issue.category, issue.token), issue);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "보조 맞춤법 검사를 완료하지 못했습니다.";

    warnings.push(`보조 맞춤법 검사에 실패했습니다. (${message})`);
  }

  try {
    const spellingIssueTokens = new Set(
      [...issueMap.values()]
        .filter((issue) => issue.category === "spelling")
        .map((issue) => normalizeStandardWordToken(issue.token)),
    );
    const standardWordIssues = await checkStandardWords(normalizedText, standardWordIgnoreTerms);

    for (const issue of standardWordIssues) {
      if (spellingIssueTokens.has(normalizeStandardWordToken(issue.token))) {
        continue;
      }

      issueMap.set(buildIssueKey(issue.category, issue.token), issue);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "표준어 검사를 완료하지 못했습니다.";

    warnings.push(`표준어 검사에 실패했습니다. (${message})`);
  }

  const issues = [...issueMap.values()].sort(sortIssues);
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
