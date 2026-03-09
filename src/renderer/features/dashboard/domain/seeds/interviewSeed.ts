import type { EssayQuestion, ExperienceItem, FlashcardItem } from "../../types";

export const flashcards: FlashcardItem[] = [
  {
    category: "RTL",
    q: "면접에서 블록 디버그 스토리를 어떤 순서로 설명할 것인가?",
    a: "증상, 관찰 포인트, 원인 축소 과정, 실제 수정 내용, 정량 결과 순서로 말하면 전달력이 좋습니다.",
  },
  {
    category: "검증",
    q: "테스트벤치를 짜기 전에 assertion을 먼저 쓰는 기준은 무엇인가?",
    a: "프로토콜 보장 조건과 불법 상태가 명확하고 assertion이 디버그 시간을 줄일 수 있으면 먼저 쓰는 편이 좋습니다.",
  },
  {
    category: "아키텍처",
    q: "컨트롤러 파이프라인의 병목을 어떻게 설명할 것인가?",
    a: "제약 자원, backpressure 전파, 지연 처리 영향, 개선 전후 수치까지 연결해서 말하면 됩니다.",
  },
  {
    category: "CDC",
    q: "단순한 synchronizer만으로 끝나지 않는 CDC 대응은 어떻게 구성할 것인가?",
    a: "신호 빈도, crossing 유형, 데이터 유지 방식, reset 가정, 검증 방법까지 함께 설명해야 설득력이 높습니다.",
  },
  {
    category: "협업",
    q: "검증팀이나 물리설계팀과 의견이 충돌했을 때 어떻게 대응했는가?",
    a: "정량 위험을 기준으로 설명하고 ownership을 정리한 뒤 최종 결정을 문서화했다고 설명하면 됩니다.",
  },
];

export const experienceLibrary: ExperienceItem[] = [
  {
    id: 1,
    title: "AXI 브로커 설계 오너십",
    category: "설계",
    strengths: ["프로토콜 이해", "RTL 정리", "디버그"],
    summary: "학부 SoC 팀 프로젝트에서 arbitration과 response ordering을 직접 설계했습니다.",
    result: "시뮬레이션 기준 지연 시간을 18% 줄였습니다.",
    reusableFor: ["삼성전자 DS", "텔레칩스", "파두"],
    companies: ["삼성전자 DS", "텔레칩스", "파두"],
  },
  {
    id: 2,
    title: "FPGA bring-up 일정 관리",
    category: "검증",
    strengths: ["현장 디버그", "커뮤니케이션", "로그 해석"],
    summary: "비동기 reset 상호작용 문제를 좁혀 가며 flaky 현상을 제거했습니다.",
    result: "bring-up 시간을 30% 줄였습니다.",
    reusableFor: ["SK하이닉스", "LX세미콘"],
    companies: ["SK하이닉스", "LX세미콘"],
  },
  {
    id: 3,
    title: "버스 모니터 자동화",
    category: "자동화",
    strengths: ["Python", "검증 운영", "효율화"],
    summary: "로그와 파형 비교의 반복 작업을 자동화했습니다.",
    result: "반복 이슈 분류 시간을 크게 줄였습니다.",
    reusableFor: ["리벨리온", "텔레칩스"],
    companies: ["리벨리온", "텔레칩스"],
  },
];

export const essayQuestions: EssayQuestion[] = [
  {
    id: 301,
    company: "삼성전자 DS",
    posting: "RTL 설계 엔지니어",
    type: "지원 동기",
    question: "이 직무를 우선순위로 두는 이유와, 그 판단을 뒷받침하는 설계 경험을 구체적으로 설명하라.",
    limit: 1000,
    status: "초안 완료",
    draft: "삼성전자 DS는 규모, RTL 오너십, 실제 제품 영향도가 모두 큰 조직이라 제 우선순위가 높습니다.",
    linkedExperienceIds: [1],
  },
  {
    id: 302,
    company: "리벨리온",
    posting: "AI 가속기 RTL 엔지니어",
    type: "문제 해결",
    question: "구조적 분석을 통해 요소나 서브시스템을 개선한 경험을 설명하라.",
    limit: 1200,
    status: "수정 필요",
    draft: "AXI 브로커 프로젝트에서 starvation 문제를 파형과 로그 기반으로 좁혀 원인을 찾고 해결했습니다.",
    linkedExperienceIds: [1, 3],
  },
  {
    id: 303,
    company: "SK하이닉스",
    posting: "메모리 컨트롤러 RTL / 검증",
    type: "적합성",
    question: "메모리 서브시스템 업무 중 현재 강점과 가장 잘 맞는 영역은 무엇인가?",
    limit: 900,
    status: "개요만 작성",
    draft: "성능 민감도와 검증 규칙이 많은 컨트롤러 동작 영역이 제 경험과 가장 잘 맞습니다.",
    linkedExperienceIds: [2],
  },
];
