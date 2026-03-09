import { useMemo } from "react";
import type {
  CompanyDetail,
  CompanyTarget,
  CoverLetterRecord,
  EnrichedPosting,
} from "../types";

type UseSelectedCompanyModelOptions = {
  companies: CompanyTarget[];
  companyDetails: Record<number, CompanyDetail>;
  selectedCompanyId: number;
  postings: EnrichedPosting[];
  coverLetterFiles?: CoverLetterRecord[];
  companySlugMap: Record<number, string>;
  coverLetterSlugify: (value: string) => string;
};

export function useSelectedCompanyModel({
  companies,
  companyDetails,
  selectedCompanyId,
  postings,
  coverLetterFiles = [],
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
        description: "선택한 기업의 상세 설명이 아직 정리되지 않았습니다.",
        roleDescription: "직무 요구사항을 정리한 뒤 여기에 역할 설명을 연결할 수 있습니다.",
        techStack: ["Verilog", "SystemVerilog", "RTL Design"],
        news: ["선택한 기업에 연결된 최신 메모가 아직 없습니다."],
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
