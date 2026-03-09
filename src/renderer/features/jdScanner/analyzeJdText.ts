import type { JdScanResult } from "../dashboard/types";

export function normalizeKeyword(value: string) {
  return value.toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

export function analyzeJdText(
  text: string,
  portfolioKeywordSet: Set<string>,
  keywordLibrary: Array<{ label: string; aliases: string[] }>,
): JdScanResult {
  const normalized = normalizeKeyword(text);
  const extracted = keywordLibrary
    .filter((item) => item.aliases.some((alias) => normalized.includes(normalizeKeyword(alias))))
    .map((item) => item.label);

  const uniqueExtracted =
    extracted.length > 0
      ? Array.from(new Set(extracted))
      : ["Verilog", "SystemVerilog", "AMBA AXI", "UVM", "FPGA"];
  const matched = uniqueExtracted.filter((keyword) => portfolioKeywordSet.has(normalizeKeyword(keyword)));
  const missing = uniqueExtracted.filter((keyword) => !matched.includes(keyword));
  const coverage = Math.round((matched.length / uniqueExtracted.length) * 100);

  let recommendation =
    "추출된 키워드 중 비어 있는 항목을 중심으로 포트폴리오와 자기소개서 보강 포인트를 정리하는 편이 좋습니다.";

  if (missing.includes("Formal Verification")) {
    recommendation =
      "Formal Verification 경험이 없더라도 assertion 작성 경험과 property 기반 검증 이해를 별도 항목으로 보강하는 편이 좋습니다.";
  } else if (missing.includes("PCIe Gen5")) {
    recommendation =
      "PCIe 계열 인터페이스 경험이 부족하면 프로토콜 이해, 전송 지연 trade-off, 검증 포인트를 별도로 정리하는 편이 좋습니다.";
  } else if (missing.length === 0) {
    recommendation =
      "주요 요구 키워드는 충분합니다. 이제는 경험별 수치화와 문제 해결 스토리의 밀도를 높이는 쪽이 더 효과적입니다.";
  }

  return { extracted: uniqueExtracted, matched, missing, coverage, recommendation };
}
