import test from "node:test";
import assert from "node:assert/strict";

const typoIssue = {
  original: "맡춤법",
  suggestions: ["맞춤법"],
  explanation: "'맡춤법'의 옳은 표기는 '맞춤법'입니다.",
  examples: ["맞춤법을 다시 확인해 주세요."],
};

const wrongPastTenseIssue = {
  original: "틀렷다",
  suggestions: ["틀렸다"],
  explanation: "선어말 어미 '-었-' 또는 '-았-'으로 고쳐 쓰세요.",
  examples: ["네가 쓴 이 단어는 철자가 틀렸다."],
};

const hanfixResponses = new Map([
  ["기여하고 싶습니다.", []],
  ["저전력 고성능 아키텍처", []],
  ["검사기가 잘 찾는지 테스트중이다.", []],
  ["이 문장 은 띄어쓰기 오류 가 여러개 있다", []],
  [
    "여러개",
    [
      {
        original: "여러개",
        suggestions: ["여러 개"],
        explanation: "띄어쓰기 오류입니다. 대치어를 참고하여 고쳐 쓰세요.",
        examples: [],
      },
    ],
  ],
  ["맡춤법 이 틀렷다", [typoIssue, wrongPastTenseIssue]],
  ["맡춤법", [typoIssue]],
  ["틀렷다", [wrongPastTenseIssue]],
  ["기여하go 싶습니다.", []],
  [
    "기여하go",
    [
      {
        original: "기여하go",
        suggestions: ["기여하 go"],
        explanation: "띄어쓰기 오류입니다. 대치어를 참고하여 고쳐 쓰세요.",
        examples: [],
      },
    ],
  ],
  [
    "싶s니다",
    [
      {
        original: "싶s니다",
        suggestions: ["싶s니다"],
        explanation: "맞춤법 오류가 의심되는 구절입니다.",
        examples: [],
      },
    ],
  ],
  ["DS부문에서 LPDDR공정 최적화에 기여하고 싶습니다.", []],
  ["기여하고", []],
  ["저전력", []],
  ["고성능", []],
  ["검사기가", []],
  ["잘", []],
  ["찾는지", []],
  ["테스트중이다", []],
  ["문장", []],
  ["띄어쓰기", []],
  ["오류", []],
  ["있다", []],
  ["이", []],
]);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildIssueHtml(issue) {
  const suggestion = issue.suggestions[0] ?? issue.original;
  const explanation = issue.explanation ?? "";
  const examples = (issue.examples ?? [])
    .map((example) => `<li>${escapeHtml(example)}</li>`)
    .join("");

  return [
    `<a data-error-input="${escapeHtml(issue.original)}" data-error-output="${escapeHtml(suggestion)}">`,
    `<ul id="help"><li>${escapeHtml(explanation)}</li></ul>`,
    `<ul id="examples">${examples}</ul>`,
    "</a>",
  ].join("");
}

function buildHanfixHtml(issues) {
  return `<div class="cont_spell">${issues.map(buildIssueHtml).join("")}</div>`;
}

function decodeSentence(body) {
  if (body instanceof URLSearchParams) {
    return body.get("sentence") ?? "";
  }

  return new URLSearchParams(String(body ?? "")).get("sentence") ?? "";
}

global.fetch = async (_url, options = {}) => {
  const sentence = decodeSentence(options.body);
  const issues = hanfixResponses.get(sentence) ?? [];

  return {
    async text() {
      return buildHanfixHtml(issues);
    },
  };
};

const { checkCoverLetterSpelling } = await import("../dist-electron/electron/services/coverLetterSpellcheck.cjs");

function issueTokens(result) {
  return result.issues.map((issue) => issue.token);
}

test("safe compounds and domain mixed tokens are not split", async () => {
  const cases = [
    "기여하고 싶습니다.",
    "저전력 고성능 아키텍처",
    "검사기가 잘 찾는지 테스트중이다.",
    "DS부문에서 LPDDR공정 최적화에 기여하고 싶습니다.",
  ];

  for (const text of cases) {
    const result = await checkCoverLetterSpelling({ text, ignoreTerms: [] });
    assert.equal(result.issueCount, 0, text);
  }
});

test("spacing and typo issues are surfaced together", async () => {
  const spacingResult = await checkCoverLetterSpelling({
    text: "이 문장 은 띄어쓰기 오류 가 여러개 있다",
    ignoreTerms: [],
  });

  assert.deepEqual(issueTokens(spacingResult), ["문장 은", "여러개", "오류 가"]);

  const typoResult = await checkCoverLetterSpelling({
    text: "맡춤법 이 틀렷다",
    ignoreTerms: [],
  });

  assert.deepEqual(issueTokens(typoResult), ["맡춤법", "맡춤법 이", "틀렷다"]);
});

test("mixed-script tokens fall back to warning cards without aggressive suggestions", async () => {
  const mixedTail = await checkCoverLetterSpelling({
    text: "기여하go 싶습니다.",
    ignoreTerms: [],
  });
  const mixedTailIssue = mixedTail.issues[0];

  assert.equal(mixedTailIssue?.token, "기여하go");
  assert.deepEqual(mixedTailIssue?.suggestions, []);
  assert.match(mixedTailIssue?.explanation ?? "", /영문이 섞인 비정상 단어/);

  const mixedMiddle = await checkCoverLetterSpelling({
    text: "싶s니다",
    ignoreTerms: [],
  });
  const mixedMiddleIssue = mixedMiddle.issues[0];

  assert.equal(mixedMiddleIssue?.token, "싶s니다");
  assert.deepEqual(mixedMiddleIssue?.suggestions, []);
  assert.match(mixedMiddleIssue?.explanation ?? "", /영문이 섞인 비정상 단어/);
});

test("mixed-script detection stays stable across repeated runs", async () => {
  const results = [];

  for (let index = 0; index < 3; index += 1) {
    results.push(
      await checkCoverLetterSpelling({
        text: "기여하go 싶습니다.",
        ignoreTerms: [],
      }),
    );
  }

  const snapshot = results.map((result) => ({
    issueCount: result.issueCount,
    spellingIssueCount: result.spellingIssueCount,
    tokens: issueTokens(result),
    suggestions: result.issues.map((issue) => issue.suggestions),
  }));

  assert.deepEqual(snapshot[1], snapshot[0]);
  assert.deepEqual(snapshot[2], snapshot[0]);
});
