export type CoverLetterSpellcheckRequest = {
  text: string;
  ignoreTerms?: string[];
};

export type CoverLetterSpellcheckIssue = {
  token: string;
  count: number;
  suggestions: string[];
  explanation: string | null;
  examples: string[];
};

export type CoverLetterSpellcheckResponse = {
  checkedAt: string;
  issueCount: number;
  issues: CoverLetterSpellcheckIssue[];
  warnings: string[];
};
