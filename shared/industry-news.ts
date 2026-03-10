export const DEFAULT_INDUSTRY_KEYWORDS = [
  "HBM",
  "DDR",
  "메모리",
  "파운드리",
  "AI 반도체",
  "RTL",
  "SystemVerilog",
  "검증",
  "SoC",
  "EDA",
  "패키징",
  "반도체",
];

export function sanitizeIndustryKeywords(keywords: string[]) {
  const uniqueKeywords = new Set<string>();

  keywords.forEach((keyword) => {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) {
      uniqueKeywords.add(trimmedKeyword);
    }
  });

  return [...uniqueKeywords];
}
