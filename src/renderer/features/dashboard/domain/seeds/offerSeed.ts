import type { OfferCatalogEntry } from "../../types";

export const offerCatalog: OfferCatalogEntry[] = [
  {
    id: "samsung-ds",
    label: "삼성전자 DS",
    companyId: 1,
    profile: { salary: 90, growth: 94, wlb: 66, location: 74, culture: 70, base: "연봉 6,200만 원", bonus: "성과급 상단 큼" },
    notes: ["브랜드 레버리지가 가장 큼", "지속적인 실행력 증명이 필요함"],
  },
  {
    id: "sk-hynix",
    label: "SK하이닉스",
    companyId: 2,
    profile: { salary: 88, growth: 92, wlb: 68, location: 58, culture: 73, base: "연봉 6,000만 원", bonus: "메모리 사이클 영향 큼" },
    notes: ["컨트롤러 적합도가 높음", "통근이 가장 약한 포인트"],
  },
  {
    id: "rebellions",
    label: "리벨리온",
    companyId: 4,
    profile: { salary: 84, growth: 97, wlb: 58, location: 86, culture: 82, base: "연봉 5,800만 원", bonus: "스톡옵션 비중 높음" },
    notes: ["아키텍처 성장 여지가 큼", "불확실성과 속도 압박이 존재함"],
  },
  {
    id: "telechips",
    label: "텔레칩스",
    companyId: 5,
    profile: { salary: 73, growth: 71, wlb: 82, location: 88, culture: 80, base: "연봉 5,100만 원", bonus: "안정적인 패키지" },
    notes: ["위치와 생활 균형이 강점", "대형 메모리/설계 조직 대비 브랜드는 약함"],
  },
  {
    id: "fadu",
    label: "파두",
    companyId: 6,
    profile: { salary: 76, growth: 75, wlb: 76, location: 90, culture: 77, base: "연봉 5,300만 원", bonus: "중간 수준 업사이드" },
    notes: ["컨트롤러 경험과 연결이 명확함", "장기 로드맵 신뢰도는 추가 확인 필요"],
  },
];
