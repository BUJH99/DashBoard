import type { PortfolioData } from "../../types";

export const portfolioData: PortfolioData = {
  profile: {
    initials: "박",
    name: "박준혁",
    handle: "semiconductor process / data storytelling",
  },
  resumeProfile: {
    email: "junhyuk.park@demo.careerxp.kr",
    headline: "공정 최적화, 수율 분석, 실험 기반 문제 해결 경험을 정량 성과 중심으로 정리할 수 있는 지원자",
    education: [
      {
        school: "성균관대학교",
        degree: "학사",
        major: "신소재공학과 (반도체공학 부전공)",
        gpa: "3.82/4.5 · 전공 3.95/4.5",
        period: "2019.03 - 2025.02",
        statusLabel: "졸업예정",
      },
      {
        school: "한영외국어고등학교",
        degree: "고등학교",
        major: "자연계",
        gpa: "",
        period: "2016.03 - 2019.02",
        statusLabel: "졸업",
      },
    ],
    certificates: [
      { name: "반도체설계기사", issuer: "한국산업인력공단", date: "2024.06" },
      { name: "데이터분석 준전문가(ADsP)", issuer: "한국데이터산업진흥원", date: "2024.03" },
      { name: "컴퓨터활용능력 1급", issuer: "대한상공회의소", date: "2023.08" },
    ],
    languages: [
      { name: "영어", detail: "TOEIC 905점 (2024.08), OPIC IH (2024.09)", levelLabel: "상" },
      { name: "일본어", detail: "JLPT N2 (2023.12)", levelLabel: "중" },
    ],
    skillSpecs: [
      { name: "Python", track: "프로그래밍", levelLabel: "상" },
      { name: "MATLAB", track: "엔지니어링", levelLabel: "상" },
      { name: "TCAD (Silvaco)", track: "시뮬레이션", levelLabel: "중" },
      { name: "SPC/DOE 통계", track: "데이터분석", levelLabel: "중" },
      { name: "Minitab", track: "데이터분석", levelLabel: "중" },
      { name: "Origin Pro", track: "데이터시각화", levelLabel: "상" },
    ],
    awards: [
      { title: "한국반도체학술대회 우수 포스터상", issuer: "한국반도체학술대회" },
      { title: "SKKU AI+X 해커톤 최우수상", issuer: "SKKU AI+X 해커톤" },
    ],
    papers: [
      { title: "High-k 유전체 ALD 공정의 전구체 주입 조건이 DRAM 캐패시터 특성에 미치는 영향" },
    ],
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
  experienceHub: [
    {
      id: 1,
      title: "삼성전자 메모리사업부 인턴 (식각 공정팀)",
      category: "internship",
      organization: "삼성전자",
      period: "2024.07 ~ 2024.08",
      role: "공정기술팀 인턴",
      teamLabel: "시각 공정팀",
      featured: true,
      tags: ["식각공정", "DOE", "SPC", "Python", "수율개선", "DRAM"],
      overview:
        "DRAM 식각 공정 파라미터 최적화 프로젝트를 수행하며 DOE 설계, 공정 데이터 정리, SPC 기반 이상 산포 분석을 담당했습니다.",
      outcome:
        "핵심 공정 조건을 재설계해 불량률을 12% 낮추고, 일일 보고용 데이터 정리 시간을 40% 줄였습니다.",
      learning:
        "공정 데이터 해석과 실험 설계를 현업 속도에 맞춰 정리하는 법을 익혔고, 엔지니어가 바로 이해할 수 있는 보고 구조를 체득했습니다.",
      rawBullet:
        "식각 공정 인턴으로 파라미터 최적화 프로젝트에 참여하고 공정 데이터를 분석했습니다.",
      improvedBullet:
        "DRAM HAR etch 공정의 DOE 기반 조건 최적화로 불량률 12% 감소를 이끌고, SPC 자동 리포트로 일일 분석 시간을 40% 단축했습니다.",
      bulletReason:
        "단순 참여 서술을 문제-행동-성과 구조로 바꾸고 정량 수치를 넣어 실무 임팩트를 드러냈습니다.",
      keywords: ["DRAM", "식각", "DOE", "SPC", "Python", "공정최적화"],
    },
    {
      id: 2,
      title: "졸업연구: High-k 유전체 ALD 공정 최적화",
      category: "research",
      organization: "성균관대학교 반도체소자연구실",
      period: "2024.03 ~ 2024.12",
      role: "연구자 (졸업논문)",
      teamLabel: "연구/논문",
      featured: true,
      tags: ["ALD", "High-k", "DRAM", "TCAD", "C-V측정", "박막공정"],
      overview:
        "HfO2 기반 High-k 유전체의 ALD 공정에서 전구체 주입 및 purge 조건이 DRAM 캐패시터 특성에 미치는 영향을 실험과 시뮬레이션으로 검증했습니다.",
      outcome:
        "최적 조건 도출로 유전율 15% 향상, 누설전류 밀도 2차릿수 감소를 달성했고 학회 포스터 발표 및 우수상을 수상했습니다.",
      learning:
        "박막 증착 공정의 원리와 전기적 특성 분석을 구조적으로 설명하는 힘이 생겼고, 실험과 TCAD 결과를 엮는 스토리라인을 익혔습니다.",
      rawBullet:
        "ALD 공정 조건에 따른 유전 특성을 연구하고 결과를 학회에서 발표했습니다.",
      improvedBullet:
        "High-k ALD 공정 변수 최적화로 DRAM 캐패시터 유전율 15% 향상과 누설전류 2차릿수 감소를 달성하고 학회 우수 포스터상을 수상했습니다.",
      bulletReason:
        "연구 내용을 업무형 bullet로 바꾸기 위해 실험 변수, 개선 폭, 외부 검증 결과를 한 문장에 묶었습니다.",
      keywords: ["ALD", "High-k", "DRAM", "TCAD", "공정최적화", "유전율"],
    },
    {
      id: 3,
      title: "반도체 수율 예측 AI 모델 개발 (해커톤)",
      category: "contest",
      organization: "산학 연계 해커톤",
      period: "2024.05",
      role: "데이터 분석 담당",
      teamLabel: "4인팀",
      featured: true,
      tags: ["Python", "XGBoost", "EDA", "수율분석", "Feature Engineering", "Dashboard"],
      overview:
        "웨이퍼 공정 로그와 검사 데이터를 기반으로 수율 이상 구간을 조기 탐지하는 분류 모델을 설계하고 시각화 대시보드를 구현했습니다.",
      outcome:
        "XGBoost 기반 모델로 기준선 대비 F1-score를 18% 개선했고, 최종 발표에서 실용성 우수 평가를 받았습니다.",
      learning:
        "모델 성능만이 아니라 공정 엔지니어가 해석할 수 있는 피처 설명과 시각화 방식이 중요하다는 점을 체감했습니다.",
      rawBullet:
        "해커톤에서 수율 예측 AI 모델을 만들고 데이터를 분석했습니다.",
      improvedBullet:
        "공정 로그 기반 수율 예측 모델을 설계해 F1-score를 18% 개선하고, 원인 피처를 설명하는 시각화 대시보드로 발표 완성도를 높였습니다.",
      bulletReason:
        "데이터 분석 경험을 현업 관점으로 읽히도록 모델 성능과 설명 가능성을 함께 강조했습니다.",
      keywords: ["수율", "Python", "XGBoost", "EDA", "데이터분석", "시각화"],
    },
    {
      id: 4,
      title: "반도체공학회 학술부장 활동",
      category: "activity",
      organization: "성균관대 반도체공학회",
      period: "2023.03 ~ 2024.02",
      role: "학술부장",
      teamLabel: "대외활동",
      featured: false,
      tags: ["반도체", "논문리뷰", "세미나운영", "리더십", "트렌드조사", "커뮤니케이션"],
      overview:
        "학회 세미나 기획과 논문 리뷰 세션 운영을 맡아 반도체 공정/소자 최신 트렌드를 공유하는 프로그램을 설계했습니다.",
      outcome:
        "1년간 32회 세미나를 운영하며 참여 인원을 15명에서 28명으로 늘렸고, GAA/EUV/3D NAND 주제 발표를 주도했습니다.",
      learning:
        "기술 내용을 비전공자에게도 전달 가능한 구조로 재조립하는 힘과 발표 자료 스토리라인을 설계하는 감각을 키웠습니다.",
      rawBullet:
        "학술부장으로 세미나를 운영하고 논문 리뷰를 진행했습니다.",
      improvedBullet:
        "학술부장으로 32회 세미나와 논문 리뷰 세션을 운영해 참여 인원을 87% 늘리고, GAA·EUV·3D NAND 주제 발표를 체계화했습니다.",
      bulletReason:
        "리더십 경험을 활동량과 성장률로 표현해 조직 운영 역량이 드러나도록 다듬었습니다.",
      keywords: ["리더십", "세미나", "반도체", "논문리뷰", "GAA", "EUV"],
    },
    {
      id: 5,
      title: "클린룸 실습 프로젝트 (MOSFET 제작)",
      category: "project",
      organization: "반도체 공정 실습",
      period: "2023.09 ~ 2023.12",
      role: "조장",
      teamLabel: "3인조",
      featured: false,
      tags: ["클린룸", "MOSFET", "포토리소그래피", "식각", "측정", "공정변동"],
      overview:
        "포토리소그래피, 증착, 식각, 전기적 특성 측정을 포함한 MOSFET 제작 전 과정을 수행하며 공정 편차 원인을 분석했습니다.",
      outcome:
        "리워크 없이 목표 소자 특성을 구현했고, 조별 발표에서 공정 편차 해석의 논리성을 인정받았습니다.",
      learning:
        "장비 제약과 실제 공정 오차를 고려한 실험 운영이 얼마나 중요한지 체감했고, 협업 중 역할 분담 기준도 정교해졌습니다.",
      rawBullet:
        "클린룸 실습에서 MOSFET를 제작하고 발표했습니다.",
      improvedBullet:
        "3인 팀 조장으로 MOSFET 제작 전 공정을 리드하며 포토·식각·측정 편차를 분석해 리워크 없이 목표 특성을 확보했습니다.",
      bulletReason:
        "실습 경험을 제조 공정 실행력과 문제 분석 역량이 보이도록 팀 리딩과 결과 중심으로 정리했습니다.",
      keywords: ["클린룸", "MOSFET", "포토리소그래피", "식각", "측정"],
    },
    {
      id: 6,
      title: "Python 기반 공정 데이터 분석 자동화",
      category: "project",
      organization: "개인 프로젝트",
      period: "2024.01 ~ 2024.03",
      role: "개인 프로젝트",
      teamLabel: "프로젝트",
      featured: false,
      tags: ["Python", "Streamlit", "SPC", "CP/CPk", "EDA", "자동화"],
      overview:
        "반복적으로 정리하던 공정 CSV 데이터를 업로드하면 SPC 차트와 CP/CPk 지표를 자동 생성하는 대시보드를 구축했습니다.",
      outcome:
        "리포트 작성 시간을 절반 이하로 줄였고, 실험 결과 비교 과정을 표준화해 재사용성을 높였습니다.",
      learning:
        "데이터 분석 자동화는 단순 코드 작성보다 현업 보고 흐름에 맞는 화면 구성과 예외 처리 설계가 중요하다는 점을 익혔습니다.",
      rawBullet:
        "공정 데이터를 분석하는 Python 대시보드를 만들었습니다.",
      improvedBullet:
        "Streamlit 기반 공정 분석 대시보드로 SPC·CP/CPk 리포트를 자동화해 반복 보고 시간을 50% 이상 절감했습니다.",
      bulletReason:
        "개인 프로젝트를 현업 활용성 있는 도구 개발 경험으로 읽히도록 업무 흐름 개선 효과를 강조했습니다.",
      keywords: ["Python", "Streamlit", "SPC", "CP/CPk", "자동화", "공정데이터"],
    },
    {
      id: 7,
      title: "신소재공학 실험 조교 (TA)",
      category: "internship",
      organization: "성균관대학교",
      period: "2023.03 ~ 2023.06",
      role: "실험 조교",
      teamLabel: "인턴/직무경험",
      featured: false,
      tags: ["XRD", "SEM", "TEM", "분석장비", "실험지원", "문서화"],
      overview:
        "학부 실험 수업에서 장비 세팅, 샘플 준비, 결과 해석 가이드를 제공하며 학생 실험 운영을 지원했습니다.",
      outcome:
        "실험 가이드 문서를 표준화해 장비 문의 횟수를 줄였고, 수업 운영의 안정성을 높였습니다.",
      learning:
        "복잡한 측정 장비와 절차를 초심자에게 설명하는 과정에서 커뮤니케이션과 문서화 역량을 키웠습니다.",
      rawBullet:
        "실험 조교로 XRD, SEM, TEM 장비 사용을 도왔습니다.",
      improvedBullet:
        "재료 분석 실험 조교로 XRD·SEM·TEM 가이드를 표준화해 장비 문의를 줄이고 실험 운영 안정성을 높였습니다.",
      bulletReason:
        "보조 역할을 단순 지원이 아니라 운영 최적화와 문서화 경험으로 보이도록 재구성했습니다.",
      keywords: ["XRD", "SEM", "TEM", "분석장비", "문서화", "실험지원"],
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
