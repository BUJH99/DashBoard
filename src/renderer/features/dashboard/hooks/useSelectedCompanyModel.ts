import { useMemo } from "react";
import type { CompanyDetail, CompanyTarget, CoverLetterRecord, EnrichedPosting } from "../types";

type UseSelectedCompanyModelOptions = {
  companies: CompanyTarget[];
  companyDetails: Record<number, CompanyDetail>;
  selectedCompanyId: number;
  postings: EnrichedPosting[];
  coverLetterFiles: CoverLetterRecord[];
  companySlugMap: Record<number, string>;
  coverLetterSlugify: (value: string) => string;
};

export function useSelectedCompanyModel({
  companies,
  companyDetails,
  selectedCompanyId,
  postings,
  coverLetterFiles,
  companySlugMap,
  coverLetterSlugify,
}: UseSelectedCompanyModelOptions) {
  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId) ?? companies[0],
    [companies, selectedCompanyId],
  );

  const selectedCompanyDetail = useMemo(
    () =>
      companyDetails[selectedCompanyId] ?? {
        description: "?대떦 湲곗뾽??????몃? 遺꾩꽍 ?곗씠?곕뒗 ?꾩쭅 蹂닿컯 以묒엯?덈떎.",
        roleDescription: "?듭떖 吏곷Т ?곸꽭??以鍮?以묒씠硫? 梨꾩슜 怨듦퀬 湲곗? ?붽뎄 ??웾 以묒떖?쇰줈 ?뺣━ 媛?ν빀?덈떎.",
        techStack: ["Verilog", "SystemVerilog", "RTL Design"],
        news: ["愿??理쒖떊 硫붾え瑜?異붽??섎㈃ ???곸뿭?????띾??댁쭛?덈떎."],
      },
    [companyDetails, selectedCompanyId],
  );

  const relatedPostings = useMemo(
    () => postings.filter((posting) => posting.targetCompanyId === selectedCompanyId),
    [postings, selectedCompanyId],
  );

  const companyCoverLetters = useMemo(
    () => coverLetterFiles.filter((file) => file.companyId === selectedCompanyId),
    [coverLetterFiles, selectedCompanyId],
  );

  const selectedCompanySlug = useMemo(
    () => companySlugMap[selectedCompanyId] ?? coverLetterSlugify(selectedCompany.name),
    [companySlugMap, coverLetterSlugify, selectedCompany.name, selectedCompanyId],
  );

  return {
    selectedCompany,
    selectedCompanyDetail,
    relatedPostings,
    companyCoverLetters,
    selectedCompanySlug,
  };
}
