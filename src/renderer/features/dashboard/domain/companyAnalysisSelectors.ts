import type { CompanyAnalysisEntry as StoredCompanyAnalysisEntry } from "../../../../../shared/dashboard-state-contracts";
import type {
  CompanyAnalysisDetail,
  CompanyComparisonProfile,
  CompanyComparisonRow,
  CompanyDetail,
  CompanyTarget,
  OfferCatalogEntry,
} from "../types";

const FALLBACK_COMPARISON_PROFILES: Record<number, CompanyComparisonProfile> = {
  1: {
    salary: 90,
    growth: 94,
    wlb: 66,
    location: 74,
    culture: 70,
    base: "연봉 6,200만 원",
    bonus: "성과급 상단 큼",
  },
  2: {
    salary: 88,
    growth: 92,
    wlb: 68,
    location: 58,
    culture: 73,
    base: "연봉 6,000만 원",
    bonus: "메모리 사이클 영향 큼",
  },
  3: {
    salary: 79,
    growth: 81,
    wlb: 74,
    location: 83,
    culture: 72,
    base: "연봉 5,700만 원",
    bonus: "반기 인센티브 안정형",
  },
  4: {
    salary: 84,
    growth: 97,
    wlb: 58,
    location: 86,
    culture: 82,
    base: "연봉 5,800만 원",
    bonus: "스톡옵션 비중 높음",
  },
  5: {
    salary: 73,
    growth: 71,
    wlb: 82,
    location: 88,
    culture: 80,
    base: "연봉 5,100만 원",
    bonus: "안정적인 패키지",
  },
  6: {
    salary: 76,
    growth: 75,
    wlb: 76,
    location: 90,
    culture: 77,
    base: "연봉 5,300만 원",
    bonus: "중간 수준 업사이드",
  },
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function resolveBaseComparisonProfile(
  company: CompanyTarget,
  offerCatalog: OfferCatalogEntry[],
): CompanyComparisonProfile {
  const matchedOffer = offerCatalog.find((item) => item.companyId === company.id);
  if (matchedOffer) {
    return {
      ...matchedOffer.profile,
    };
  }

  return (
    FALLBACK_COMPARISON_PROFILES[company.id] ?? {
      salary: clampScore(company.fit),
      growth: clampScore(company.preference),
      wlb: 70,
      location: clampScore((company.fit + company.preference) / 2),
      culture: 72,
      base: "연봉 정보 정리 필요",
      bonus: "인센티브 구조 확인 필요",
    }
  );
}

export function buildDefaultCompanyAnalysisEntry(
  company: CompanyTarget,
  detail: CompanyDetail,
  offerCatalog: OfferCatalogEntry[],
): CompanyAnalysisDetail {
  return {
    description: detail.description,
    roleDescription: detail.roleDescription,
    techStack: [...detail.techStack],
    news: [...detail.news],
    comparison: resolveBaseComparisonProfile(company, offerCatalog),
  };
}

export function buildResolvedCompanyAnalysisEntries({
  companyTargets,
  companyDetails,
  offerCatalog,
  storedEntries,
}: {
  companyTargets: CompanyTarget[];
  companyDetails: Record<number, CompanyDetail>;
  offerCatalog: OfferCatalogEntry[];
  storedEntries: Record<number, StoredCompanyAnalysisEntry>;
}) {
  return Object.fromEntries(
    companyTargets.map((company) => {
      const fallbackDetail =
        companyDetails[company.id] ?? {
          description: "선택한 기업의 상세 설명이 아직 정리되지 않았습니다.",
          roleDescription: "직무 요구사항을 정리한 뒤 역할 설명을 연결할 수 있습니다.",
          techStack: ["Verilog", "SystemVerilog", "RTL Design"],
          news: ["선택한 기업에 연결된 최신 메모가 아직 없습니다."],
        };
      const defaults = buildDefaultCompanyAnalysisEntry(company, fallbackDetail, offerCatalog);
      const stored = storedEntries[company.id];

      const resolved: CompanyAnalysisDetail = {
        description: stored?.description ?? defaults.description,
        roleDescription: stored?.roleDescription ?? defaults.roleDescription,
        techStack: stored?.techStack ? [...stored.techStack] : defaults.techStack,
        news: stored?.news ? [...stored.news] : defaults.news,
        comparison: {
          ...defaults.comparison,
          ...stored?.comparison,
          salary: clampScore(stored?.comparison?.salary ?? defaults.comparison.salary),
          growth: clampScore(stored?.comparison?.growth ?? defaults.comparison.growth),
          wlb: clampScore(stored?.comparison?.wlb ?? defaults.comparison.wlb),
          location: clampScore(stored?.comparison?.location ?? defaults.comparison.location),
          culture: clampScore(stored?.comparison?.culture ?? defaults.comparison.culture),
        },
      };

      return [company.id, resolved];
    }),
  ) as Record<number, CompanyAnalysisDetail>;
}

export function buildOfferCatalogFromCompanyAnalysis(
  offerCatalog: OfferCatalogEntry[],
  analysisEntries: Record<number, CompanyAnalysisDetail>,
) {
  return offerCatalog.map((offer) => {
    if (!offer.companyId) {
      return offer;
    }

    const linkedAnalysis = analysisEntries[offer.companyId];
    if (!linkedAnalysis) {
      return offer;
    }

    return {
      ...offer,
      profile: {
        ...offer.profile,
        ...linkedAnalysis.comparison,
      },
    };
  });
}

export function resolveComparisonCompany({
  companyTargets,
  selectedCompanyId,
  compareCompanyId,
}: {
  companyTargets: CompanyTarget[];
  selectedCompanyId: number;
  compareCompanyId: number;
}) {
  return (
    companyTargets.find(
      (company) => company.id === compareCompanyId && company.id !== selectedCompanyId,
    ) ??
    companyTargets.find((company) => company.id !== selectedCompanyId) ??
    companyTargets[0]
  );
}

export function buildCompanyComparisonRows(
  left: CompanyAnalysisDetail,
  right: CompanyAnalysisDetail,
): CompanyComparisonRow[] {
  return [
    { label: "기본급", left: left.comparison.base, right: right.comparison.base },
    { label: "보너스", left: left.comparison.bonus, right: right.comparison.bonus },
    {
      label: "연봉/보상",
      left: `${left.comparison.salary}점`,
      right: `${right.comparison.salary}점`,
      leftScore: left.comparison.salary,
      rightScore: right.comparison.salary,
    },
    {
      label: "워라밸",
      left: `${left.comparison.wlb}점`,
      right: `${right.comparison.wlb}점`,
      leftScore: left.comparison.wlb,
      rightScore: right.comparison.wlb,
    },
    {
      label: "성장성",
      left: `${left.comparison.growth}점`,
      right: `${right.comparison.growth}점`,
      leftScore: left.comparison.growth,
      rightScore: right.comparison.growth,
    },
    {
      label: "위치/출퇴근",
      left: `${left.comparison.location}점`,
      right: `${right.comparison.location}점`,
      leftScore: left.comparison.location,
      rightScore: right.comparison.location,
    },
    {
      label: "조직문화",
      left: `${left.comparison.culture}점`,
      right: `${right.comparison.culture}점`,
      leftScore: left.comparison.culture,
      rightScore: right.comparison.culture,
    },
  ];
}
