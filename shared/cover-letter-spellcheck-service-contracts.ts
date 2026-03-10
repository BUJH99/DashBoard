export type CoverLetterSpellcheckRequest = {
  text: string;
  ignoreTerms?: string[];
};

export type CoverLetterSpellcheckIssueCategory = "spelling" | "standard";

export type CoverLetterSpellcheckIssue = {
  category: CoverLetterSpellcheckIssueCategory;
  token: string;
  count: number;
  suggestions: string[];
  explanation: string | null;
  examples: string[];
};

export type CoverLetterSpellcheckResponse = {
  checkedAt: string;
  issueCount: number;
  spellingIssueCount: number;
  standardIssueCount: number;
  issues: CoverLetterSpellcheckIssue[];
  warnings: string[];
};
