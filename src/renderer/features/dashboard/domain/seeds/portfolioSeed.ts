import type { PortfolioData } from "../../types";

export const portfolioData: PortfolioData = {
  readiness: 89,
  githubCommits: 845,
  resumeUpdated: "2026-03-08",
  skills: [
    { name: "Verilog HDL", level: 95 },
    { name: "SystemVerilog", level: 86 },
    { name: "Python scripting", level: 90 },
    { name: "UVM workflow", level: 74 },
    { name: "FPGA bring-up", level: 78 },
  ],
  learningSkills: [
    { name: "Formal verification", progress: 54, status: "기초 문법과 toy proof 정리 중" },
    { name: "PCIe Gen5", progress: 38, status: "프로토콜 시트 정리 중" },
    { name: "NoC performance", progress: 46, status: "아키텍처 리뷰 중" },
  ],
  coursework: [
    { id: 1, name: "논리 회로 설계", grade: "A+", relevance: 100, tags: ["FSM", "logic minimization"] },
    { id: 2, name: "컴퓨터 구조", grade: "A0", relevance: 96, tags: ["pipeline", "cache", "RISC-V"] },
    { id: 3, name: "SoC 설계 실험", grade: "A+", relevance: 92, tags: ["AMBA AXI", "FPGA", "integration"] },
    { id: 4, name: "반도체 공학", grade: "B+", relevance: 72, tags: ["CMOS", "fabrication"] },
  ],
  studyProjects: [
    { id: 1, name: "AXI 브로커 RTL", tech: "Verilog / AXI", progress: 88, status: "문서 보강", next: "중재 정책 trade-off 정리 추가" },
    { id: 2, name: "DDR 스케줄러 시뮬레이터", tech: "Python", progress: 63, status: "프로토타입", next: "대기열 fairness 시각화" },
    { id: 3, name: "파이프라인 hazard 시각화", tech: "TypeScript", progress: 72, status: "리팩토링 중", next: "데모 영상 추가" },
  ],
  studyNotes: [
    { id: 1, title: "면접용 CDC 체크리스트", date: "2026-03-07", category: "검증", preview: "메타안정성과 동기화 ownership boundary를 짧게 설명하는 방식 정리." },
    { id: 2, title: "컨트롤러 지연 시간 trade-off", date: "2026-03-05", category: "아키텍처", preview: "버퍼링, ordering, tail latency를 같이 설명하도록 정리." },
    { id: 3, title: "타이밍 클로저 스토리 뱅크", date: "2026-03-02", category: "설계", preview: "수정했다고만 말하지 않고 실제 결과를 숫자로 제시하는 방식 정리." },
  ],
  projects: [
    { id: 1, name: "RISC-V 캐시 서브시스템", date: "2025-12", role: "RTL + 검증", tech: ["Verilog", "SystemVerilog", "AXI"], impact: "시뮬레이션 기준 miss 처리 지연을 18% 줄였습니다.", link: "https://example.com/cache" },
    { id: 2, name: "FPGA 센서 허브", date: "2025-09", role: "통합 오너", tech: ["Verilog", "FPGA", "UART"], impact: "bring-up 일정을 통합해 디버그 시간을 30% 줄였습니다.", link: "https://example.com/fpga" },
    { id: 3, name: "버스 모니터 자동화", date: "2025-07", role: "로직", tech: ["Python", "SystemVerilog"], impact: "반복적인 로그와 파형 확인 시간을 크게 줄였습니다.", link: "https://example.com/monitor" },
  ],
};

export const contributionHeatmapSeed: number[][] = [
  [0, 1, 0, 2, 0, 1, 0],
  [1, 2, 1, 3, 2, 0, 1],
  [0, 1, 3, 4, 2, 1, 0],
  [2, 3, 2, 4, 3, 1, 1],
  [1, 2, 1, 3, 4, 2, 1],
  [0, 1, 2, 3, 2, 2, 0],
];
