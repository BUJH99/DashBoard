export function getLocationInsight(location: string) {
  if (location.includes("판교")) {
    return "스타트업/팹리스 기업 접근성이 좋아 일정이 몰릴 때도 동선 부담이 비교적 적습니다.";
  }
  if (location.includes("이천") || location.includes("동탄")) {
    return "수도권 외곽 이동 비중이 커서 통근 시간과 아침 면접 리스크를 같이 고려해야 합니다.";
  }
  if (location.includes("양재")) {
    return "서울 내 접근성은 무난하지만 면접장 위치에 따라 버스/지하철 조합 확인이 필요합니다.";
  }
  if (location.includes("강남")) {
    return "교통 선택지가 많아 유연성이 좋지만 피크 시간 혼잡도는 체크해야 합니다.";
  }
  return "주요 면접 동선과 출발지 기준 이동 시간을 같이 확인하는 편이 좋습니다.";
}
