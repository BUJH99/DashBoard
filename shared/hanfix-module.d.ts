declare module "hanfix/src/hanfix.js" {
  export type HanfixIssue = {
    original: string;
    suggestions: string[];
    explanation?: string;
    examples?: (string | null | undefined)[];
  };

  export function check(text: string): Promise<HanfixIssue[]>;
}
