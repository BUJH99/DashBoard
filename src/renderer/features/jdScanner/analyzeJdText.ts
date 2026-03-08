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
    extracted.length > 0 ? Array.from(new Set(extracted)) : ["Verilog", "SystemVerilog", "AMBA AXI", "UVM", "FPGA"];
  const matched = uniqueExtracted.filter((keyword) => portfolioKeywordSet.has(normalizeKeyword(keyword)));
  const missing = uniqueExtracted.filter((keyword) => !matched.includes(keyword));
  const coverage = Math.round((matched.length / uniqueExtracted.length) * 100);

  let recommendation = "?ы듃?대━?ㅼ뿉???대? ?ㅻ（??湲곗닠???욎そ ?꾨줈?앺듃 ?ㅻ챸?????좊챸?섍쾶 諛곗튂?섏꽭??";
  if (missing.includes("Formal Verification")) {
    recommendation = "Formal Verification? ?숈뒿 以???ぉ怨??곌껐??'吏꾪뻾以묒씤 ??웾'?쇰줈?쇰룄 紐낆떆?섎뒗 寃껋씠 醫뗭뒿?덈떎.";
  } else if (missing.includes("PCIe Gen5")) {
    recommendation = "PCIe 怨꾩뿴 ?ㅼ썙?쒕뒗 ?ㅽ꽣???꾨줈?앺듃??愿??湲곗닠 ?뱀뀡??蹂닿컯?대몢???몄씠 ?좊━?⑸땲??";
  } else if (missing.length === 0) {
    recommendation = "?듭떖 ?ㅼ썙?쒕뒗 ?대? 異⑸텇??留욎븘 ?덉뒿?덈떎. ?꾨줈?앺듃???깃낵 ?섏튂? ??븷 踰붿쐞瑜???媛뺤“?섎㈃ ?⑸땲??";
  }

  return { extracted: uniqueExtracted, matched, missing, coverage, recommendation };
}
