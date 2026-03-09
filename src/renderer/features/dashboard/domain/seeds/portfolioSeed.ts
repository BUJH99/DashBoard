import type { PortfolioData } from "../../types";

export const portfolioData: PortfolioData = {
  profile: {
    initials: "김",
    name: "김회로",
    handle: "github.com/kim-rtl",
  },
  readiness: 92,
  githubCommits: 845,
  resumeUpdated: "2026.03.08",
  skills: [
    { name: "Verilog HDL", level: 95 },
    { name: "SystemVerilog", level: 85 },
    { name: "C / C++", level: 80 },
    { name: "Python (Scripting)", level: 90 },
    { name: "UVM Methodology", level: 70 },
  ],
  learningSkills: [
    { name: "AMBA CHI (Coherent Hub)", progress: 38, status: "스펙 문서 리딩" },
    { name: "Chisel HDL", progress: 66, status: "토이 프로젝트" },
    { name: "PCIe Gen5 Controller", progress: 21, status: "개념 학습 중" },
    { name: "Formal Verification", progress: 54, status: "실습 진행 중" },
  ],
  coursework: [
    { id: 1, name: "디지털 논리회로", grade: "A+", relevance: 100, tags: ["Boolean Algebra", "K-Map", "FSM"] },
    { id: 2, name: "컴퓨터 구조", grade: "A0", relevance: 95, tags: ["Pipeline", "Cache", "RISC-V"] },
    { id: 3, name: "SoC 설계 및 실습", grade: "A+", relevance: 90, tags: ["Verilog", "AMBA AXI", "FPGA"] },
    { id: 4, name: "반도체 공학", grade: "B+", relevance: 70, tags: ["CMOS", "MOSFET", "Fabrication"] },
    { id: 5, name: "운영체제", grade: "B0", relevance: 60, tags: ["Process", "Memory Management"] },
  ],
  studyProjects: [
    {
      id: 1,
      name: "Chisel 기반 커스텀 가속기 설계",
      tech: "Chisel HDL",
      progress: 40,
      status: "ALU 모듈 설계 및 테스트벤치 작성 중",
      next: "MAC 연산기 파이프라이닝 적용",
    },
    {
      id: 2,
      name: "AMBA CHI 프로토콜 검증 환경 구축",
      tech: "SystemVerilog / UVM",
      progress: 16,
      status: "스펙 문서 정독 및 트랜잭션 정의",
      next: "기본 Sequence 및 Driver 뼈대 작성",
    },
  ],
  studyNotes: [
    {
      id: 1,
      title: "[TIL] Chisel3 Data Types & Wire/Reg",
      date: "2026.03.07",
      category: "Chisel",
      preview: "Chisel에서 기본 자료형과 하드웨어 노드 할당 방식의 차이점 및 예외 케이스 복습.",
    },
    {
      id: 2,
      title: "AMBA AXI vs CHI 차이점 및 특징 요약",
      date: "2026.03.05",
      category: "Architecture",
      preview: "AXI와 CHI의 연결 방식, 코히어런시 모델, 확장성 차이를 정리한 비교 노트.",
    },
    {
      id: 3,
      title: "UVM Phase 8단계 흐름도 암기",
      date: "2026.03.02",
      category: "Verification",
      preview: "Build부터 Report까지 각 단계별 Virtual function 실행 순서 정리.",
    },
  ],
  projects: [
    {
      id: 1,
      name: "RISC-V 5-stage Pipelined Processor 설계",
      date: "2025.09 - 2025.12",
      role: "Architecture & RTL Design",
      tech: ["Verilog", "FPGA", "ModelSim", "Vivado"],
      impact: "Forwarding Unit 구현으로 IPC 1.5 달성, FPGA 보드 상에서 동작 검증 완료",
      link: "https://example.com/riscv-pipeline",
    },
    {
      id: 2,
      name: "AMBA AXI4 인터페이스 기반 메모리 컨트롤러",
      date: "2025.05 - 2025.08",
      role: "Design & Verification",
      tech: ["SystemVerilog", "AXI4", "UVM", "VCS"],
      impact: "Random Testbench 구축으로 100% Functional Coverage 달성",
      link: "https://example.com/axi4-controller",
    },
    {
      id: 3,
      name: "CNN 가속기 MAC 연산기 면적 최적화",
      date: "2025.01 - 2025.03",
      role: "Logic Design",
      tech: ["Verilog", "Python", "Design Compiler"],
      impact: "Data Reuse 패턴 분석으로 합성 면적 20% 감소",
      link: "https://example.com/cnn-mac",
    },
  ],
};

export const contributionHeatmapSeed: number[][] = Array.from({ length: 24 }, (_, weekIndex) =>
  Array.from({ length: 7 }, (_, dayIndex) => {
    const pattern = (weekIndex * 5 + dayIndex * 3 + (weekIndex % 4)) % 9;

    if (pattern >= 7) {
      return 4;
    }
    if (pattern >= 5) {
      return 3;
    }
    if (pattern >= 3) {
      return 2;
    }
    if (pattern >= 1) {
      return 1;
    }

    return 0;
  }),
);
