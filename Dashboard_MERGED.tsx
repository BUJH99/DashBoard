"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import L from "leaflet";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import {
  Activity,
  AlertTriangle,
  Award,
  Book,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronUp,
  Clock3,
  Code2,
  ExternalLink,
  FileText,
  Filter,
  FolderOpen,
  Home,
  Info,
  KanbanSquare,
  Lightbulb,
  MapPin,
  Newspaper,
  PenTool,
  Radio,
  RefreshCw,
  Rocket,
  Scale,
  Search,
  Sparkles,
  Target,
  Terminal,
  User,
} from "lucide-react";

type DashboardTab =
  | "overview"
  | "industry"
  | "kanban"
  | "strategy"
  | "company"
  | "jdscanner"
  | "offer"
  | "location"
  | "portfolio"
  | "checklist"
  | "interview"
  | "calendar"
  | "coverletters";

type CompanyStrategyType = "집중공략" | "상향지원" | "안정지원";
type CompanyPipelineStage =
  | "preparing"
  | "applied"
  | "test"
  | "interview1"
  | "interview2"
  | "passed"
  | "rejected";
type PostingStage =
  | "관심기업"
  | "공고확인"
  | "기업분석완료"
  | "직무분석완료"
  | "자소서작성중"
  | "제출완료"
  | "인적성/과제대기"
  | "면접대기"
  | "최종결과대기"
  | "합격"
  | "불합격"
  | "보류";
type PortfolioSubTab = "showcase" | "academics" | "study";
type JdScanPhase = "idle" | "loading" | "result";

type NavSection = {
  title: string;
  items: { id: DashboardTab; label: string; icon: LucideIcon }[];
};

type CompanyTarget = {
  id: number;
  name: string;
  fit: number;
  preference: number;
  status: string;
  type: CompanyStrategyType;
  location: string;
  lat: number;
  lng: number;
  stage: CompanyPipelineStage;
};

type CompanyDetail = {
  description: string;
  roleDescription: string;
  techStack: string[];
  news: string[];
};

type KpiMetric = {
  label: string;
  value: number | string;
  trend: string;
  data: number[];
  color: string;
  suffix?: string;
};

type FunnelStep = {
  stage: string;
  count: number;
  rate: number;
};

type CompetencyMetric = {
  value: number;
  target: number;
  label: string;
  color: string;
};

type PortfolioData = {
  readiness: number;
  githubCommits: number;
  resumeUpdated: string;
  skills: { name: string; level: number }[];
  learningSkills: { name: string; progress: number; status: string }[];
  coursework: { id: number; name: string; grade: string; relevance: number; tags: string[] }[];
  studyProjects: { id: number; name: string; tech: string; progress: number; status: string; next: string }[];
  studyNotes: { id: number; title: string; date: string; category: string; preview: string }[];
  projects: { id: number; name: string; date: string; role: string; tech: string[]; impact: string; link: string }[];
};

type ScheduleEvent = {
  id: number;
  date: number;
  title: string;
  type: "task" | "interview" | "deadline" | "test";
  time: string;
  company: string;
};

type OfferProfile = {
  salary: number;
  growth: number;
  wlb: number;
  location: number;
  culture: number;
  base: string;
  bonus: string;
};

type FlashcardItem = {
  category: string;
  q: string;
  a: string;
};

type ApplicationChecklistItem = {
  id: string;
  label: string;
  category: "documents" | "research" | "story" | "submission";
  done: boolean;
  note: string;
  blocked: boolean;
};

type ApplicationChecklistRecord = {
  postingId: number;
  items: ApplicationChecklistItem[];
};

type CommuteNote = {
  totalMinutes: string;
  transfers: string;
  hasBus: boolean;
  hasSubway: boolean;
  note: string;
};

type DashboardLocalState = {
  ui: {
    activeTab: DashboardTab;
    postingQuery: string;
    postingCompanyFilter: string;
    selectedCompanyId: number;
    selectedOfferA: string;
    selectedOfferB: string;
    portfolioSubTab: PortfolioSubTab;
    selectedChecklistPostingId: number;
    selectedEssayId: number;
    industryFilter: string;
    flashcardMode: "default" | "shuffled";
    activeFlashcardIndex: number | null;
    selectedScheduleId: number;
    selectedCoverLetterName: string | null;
  };
  location: {
    routeOrigin: string;
    routeDestination: string;
    companyCommuteNotes: Record<number, CommuteNote>;
  };
  checklists: {
    applicationChecklists: Record<number, ApplicationChecklistItem[]>;
  };
  interview: {
    flashcardFeedback: Record<string, "hard" | "easy">;
  };
  jdScanner: {
    text: string;
  };
  overview: {
    taskChecked: Record<number, boolean>;
  };
};

type DashboardStateSync = {
  phase: "idle" | "loading" | "saving" | "error";
  message: string | null;
  lastSavedAt: string | null;
};

type CoverLetterConfig = {
  folderName: string;
  relativePath: string;
  namingPattern: string;
  requiredFrontmatter: string[];
};

type CoverLetterMeta = {
  year: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  jobTrack: string;
  docType: string;
  updatedAt: string;
  title: string;
  status: string;
  tags: string;
};

type CoverLetterRecord = {
  name: string;
  title: string;
  year: string;
  companyId: number | null;
  companyName: string;
  companySlug: string;
  jobTrack: string;
  docType: string;
  updatedAt: string;
  status: string;
  tags: string[];
  lastModified: string;
  contentPreview: string;
  isValid: boolean;
  issues: string[];
};

type CoverLetterDraft = {
  originalName: string | null;
  meta: CoverLetterMeta;
  content: string;
};

type CoverLetterSyncState = {
  phase: "idle" | "loading" | "saving" | "error";
  message: string | null;
  lastSyncedAt: string | null;
};

type ExperienceItem = {
  id: number;
  title: string;
  category: string;
  strengths: string[];
  summary: string;
  result: string;
  reusableFor: string[];
  companies: string[];
};

type EssayQuestion = {
  id: number;
  company: string;
  posting: string;
  type: string;
  question: string;
  limit: number;
  status: "초안완료" | "수정중" | "미작성";
  draft: string;
  linkedExperienceIds: number[];
};

type JobPosting = {
  id: number;
  targetCompanyId: number;
  company: string;
  title: string;
  role: string;
  deadline: string;
  stage: PostingStage;
  fit: number;
  burden: number;
  urgency: number;
  locationFit: number;
  growth: number;
  selfIntroReady: number;
  keywords: string[];
  summary: string;
};

type JdScanState = {
  phase: JdScanPhase;
  text: string;
};

type JdScanResult = {
  extracted: string[];
  matched: string[];
  missing: string[];
  coverage: number;
  recommendation: string;
};

type EnrichedPosting = JobPosting & {
  priority: number;
  daysLeft: number;
};

const TODAY = new Date("2026-03-08T00:00:00");
const CALENDAR_YEAR = 2026;
const CALENDAR_MONTH_INDEX = 2;

const navSections: NavSection[] = [
  {
    title: "Dashboards & Radar",
    items: [
      { id: "overview", label: "종합 현황", icon: Home },
      { id: "industry", label: "업계 레이더", icon: Radio },
    ],
  },
  {
    title: "Process & Target",
    items: [
      { id: "kanban", label: "파이프라인 칸반", icon: KanbanSquare },
      { id: "strategy", label: "타겟 전략", icon: Target },
      { id: "company", label: "기업 분석", icon: Building2 },
      { id: "jdscanner", label: "JD 스캐너", icon: Search },
    ],
  },
  {
    title: "Decision & Networking",
    items: [
      { id: "offer", label: "오퍼 비교", icon: Scale },
      { id: "location", label: "근무지 인사이트", icon: MapPin },
    ],
  },
  {
    title: "Assets & Prep",
    items: [
      { id: "portfolio", label: "포트폴리오", icon: User },
      { id: "checklist", label: "지원서 체크리스트", icon: Terminal },
      { id: "interview", label: "면접 플래시카드", icon: Brain },
      { id: "calendar", label: "월간 일정", icon: CalendarDays },
      { id: "coverletters", label: "자소서 뷰어", icon: FileText },
    ],
  },
];

const kpiMetrics: KpiMetric[] = [
  { label: "총 지원 횟수", value: 18, trend: "+3", data: [2, 3, 5, 8, 10, 14, 16, 18], color: "#4f46e5", suffix: "건" },
  { label: "서류 합격률", value: "45%", trend: "+5.2%", data: [15, 20, 25, 30, 30, 35, 40, 45], color: "#10b981" },
  { label: "진행중인 필기/과제", value: 3, trend: "+1", data: [0, 1, 1, 2, 1, 3, 2, 3], color: "#f59e0b", suffix: "건" },
  { label: "대기중인 직무면접", value: 2, trend: "+2", data: [0, 0, 0, 0, 1, 0, 1, 2], color: "#ec4899", suffix: "건" },
];

const funnelData: FunnelStep[] = [
  { stage: "서류 제출", count: 18, rate: 100 },
  { stage: "서류 합격", count: 8, rate: 44 },
  { stage: "필기/과제 통과", count: 4, rate: 22 },
  { stage: "1차 직무면접 통과", count: 1, rate: 5 },
  { stage: "최종 합격", count: 0, rate: 0 },
];

const competencyMetrics: CompetencyMetric[] = [
  { value: 95, target: 90, label: "RTL 설계 (Verilog)", color: "#4f46e5" },
  { value: 85, target: 80, label: "검증 (SystemVerilog/UVM)", color: "#10b981" },
  { value: 80, target: 85, label: "컴퓨터 구조 & SoC", color: "#f59e0b" },
];

const companyTargetsSeed: CompanyTarget[] = [
  { id: 1, name: "삼성전자 (DS/LSI)", fit: 85, preference: 95, status: "서류제출", type: "집중공략", location: "경기 화성/기흥", lat: 37.2084, lng: 127.0763, stage: "applied" },
  { id: 2, name: "SK하이닉스", fit: 80, preference: 95, status: "필기대기", type: "집중공략", location: "경기 이천", lat: 37.2471, lng: 127.4883, stage: "test" },
  { id: 3, name: "LX세미콘", fit: 75, preference: 85, status: "1차면접", type: "상향지원", location: "서울 양재", lat: 37.4842, lng: 127.0345, stage: "interview1" },
  { id: 4, name: "리벨리온 (AI반도체)", fit: 85, preference: 90, status: "과제진행", type: "집중공략", location: "경기 성남 (판교)", lat: 37.3957, lng: 127.1105, stage: "test" },
  { id: 5, name: "퓨리오사AI", fit: 70, preference: 88, status: "서류탈락", type: "상향지원", location: "서울 강남", lat: 37.5, lng: 127.0361, stage: "rejected" },
  { id: 6, name: "퀄컴 코리아", fit: 60, preference: 98, status: "준비중", type: "상향지원", location: "서울 강남", lat: 37.503, lng: 127.0415, stage: "preparing" },
  { id: 7, name: "텔레칩스", fit: 90, preference: 75, status: "2차면접", type: "안정지원", location: "경기 성남 (판교)", lat: 37.4, lng: 127.105, stage: "interview2" },
  { id: 8, name: "파두 (FADU)", fit: 80, preference: 80, status: "서류합격", type: "안정지원", location: "서울 강남", lat: 37.495, lng: 127.03, stage: "test" },
  { id: 9, name: "망고부스트", fit: 65, preference: 85, status: "최종합격", type: "집중공략", location: "서울 관악", lat: 37.468, lng: 126.953, stage: "passed" },
];

const companySlugSeed: Record<number, string> = {
  1: "samsung-ds-lsi",
  2: "sk-hynix",
  3: "lx-semi",
  4: "rebellions-ai-chip",
  5: "furiosa-ai",
  6: "qualcomm-korea",
  7: "telechips",
  8: "fadu",
  9: "mangoboost",
};

const originPresetSeed = [
  { label: "집", value: "집", lat: null, lng: null, type: "ADDRESS_POI" as const },
  { label: "서울역", value: "서울역", lat: 37.554648, lng: 126.970611, type: "SUBWAY_STATION" as const },
  { label: "강남역", value: "강남역", lat: 37.497175, lng: 127.027926, type: "SUBWAY_STATION" as const },
  { label: "판교역", value: "판교역", lat: 37.394761, lng: 127.111217, type: "SUBWAY_STATION" as const },
  { label: "수원역", value: "수원역", lat: 37.26605, lng: 126.9997, type: "SUBWAY_STATION" as const },
  { label: "잠실역", value: "잠실역", lat: 37.513261, lng: 127.100133, type: "SUBWAY_STATION" as const },
];

const companyDetailsSeed: Record<number, CompanyDetail> = {
  1: {
    description: "삼성전자 DS부문 System LSI 사업부는 모바일 AP, 이미지센서(CIS), DDI 등 첨단 시스템 반도체를 설계하는 글로벌 핵심 팹리스 조직입니다.",
    roleDescription: "SoC 또는 IP 디지털 회로 설계(RTL) 및 검증을 담당합니다. 저전력/고성능 아키텍처를 설계하고, SystemVerilog와 UVM을 활용하여 IP 레벨부터 Top 레벨까지 엄격한 검증을 수행합니다.",
    techStack: ["Verilog", "SystemVerilog", "UVM", "AMBA AXI", "C/C++", "Synopsys/Cadence EDA"],
    news: ["3나노 GAA 공정 기반 차세대 모바일 AP 양산 박차", "차량용 인포테인먼트 칩 '엑시노스 오토' 공급 확대"],
  },
  2: {
    description: "SK하이닉스는 HBM, DDR5 등 초고속 메모리 반도체 시장을 선도하는 글로벌 기업입니다. 최근 AI 시대에 맞춰 컨트롤러 설계 역량도 대폭 강화하고 있습니다.",
    roleDescription: "메모리 컨트롤러 및 인터페이스(PHY)의 디지털 로직 설계와 검증을 담당합니다. 초고속 데이터 처리를 위한 파이프라인 설계 및 타이밍 클로저 역량이 중요합니다.",
    techStack: ["Verilog", "SystemVerilog", "Python", "Computer Architecture", "FPGA Prototyping"],
    news: ["엔비디아향 차세대 HBM3E 메모리 대규모 공급", "CXL 기반 연산 기능 통합 메모리 개발 가속화"],
  },
  4: {
    description: "리벨리온은 국내 대표 AI 반도체 팹리스 스타트업으로, 추론용 NPU 중심의 빠른 설계-검증 반복 사이클과 공격적인 기술 확장을 강점으로 갖습니다.",
    roleDescription: "AI 가속기 칩의 핵심 연산기(MAC) 및 On-chip Network(NoC)를 설계합니다. 알고리즘 이해를 바탕으로 하드웨어 아키텍처 최적화 및 PPA 개선을 수행합니다.",
    techStack: ["Verilog", "SystemC", "Python", "Deep Learning", "Chisel"],
    news: ["차세대 AI 반도체 '리벨' 삼성전자 4나노 공정 기반 테이프아웃", "글로벌 투자사로부터 대규모 투자 유치"],
  },
  7: {
    description: "텔레칩스는 자동차용 반도체와 인포테인먼트 SoC 분야에서 강점을 지닌 국내 팹리스 기업입니다.",
    roleDescription: "차량용 AP와 주변 IP의 디지털 설계 및 검증, 파트너사 대응, 인터페이스 검증이 핵심입니다.",
    techStack: ["Verilog", "SystemVerilog", "ARM AMBA", "PCIe", "MIPI", "Automotive SoC"],
    news: ["차량용 AI 인포테인먼트 칩 양산 확대", "해외 완성차 OEM 파트너십 강화"],
  },
};

const activePipelinesSeed = [
  { company: "리벨리온", stage: "사전 과제", progress: 60, expectedDate: "다음 주 화요일" },
  { company: "LX세미콘", stage: "1차 면접", progress: 80, expectedDate: "이번 주 목요일" },
  { company: "텔레칩스", stage: "2차 면접", progress: 90, expectedDate: "이번 주 금요일" },
  { company: "SK하이닉스", stage: "필기 전형", progress: 40, expectedDate: "이번 주 주말" },
  { company: "삼성전자 (DS)", stage: "서류 심사", progress: 20, expectedDate: "결과 대기중" },
];

const portfolioSeed: PortfolioData = {
  readiness: 92,
  githubCommits: 845,
  resumeUpdated: "어제",
  skills: [
    { name: "Verilog HDL", level: 95 },
    { name: "SystemVerilog", level: 85 },
    { name: "C / C++", level: 80 },
    { name: "Python (Scripting)", level: 90 },
    { name: "UVM Methodology", level: 70 },
  ],
  learningSkills: [
    { name: "AMBA CHI (Coherent Hub)", progress: 40, status: "스펙 문서 리딩" },
    { name: "Chisel HDL", progress: 65, status: "토이 프로젝트" },
    { name: "PCIe Gen5 Controller", progress: 20, status: "개념 학습 중" },
    { name: "Formal Verification", progress: 50, status: "실습 진행 중" },
  ],
  coursework: [
    { id: 1, name: "디지털 논리회로", grade: "A+", relevance: 100, tags: ["Boolean Algebra", "K-Map", "FSM"] },
    { id: 2, name: "컴퓨터 구조", grade: "A0", relevance: 95, tags: ["Pipeline", "Cache", "RISC-V"] },
    { id: 3, name: "SoC 설계 및 실습", grade: "A+", relevance: 90, tags: ["Verilog", "AMBA AXI", "FPGA"] },
    { id: 4, name: "반도체 공학", grade: "B+", relevance: 70, tags: ["CMOS", "MOSFET", "Fabrication"] },
    { id: 5, name: "마이크로컨트롤러", grade: "A0", relevance: 85, tags: ["MCU", "Firmware", "C/C++"] },
    { id: 6, name: "운영체제", grade: "B0", relevance: 60, tags: ["Process", "Memory Management"] },
  ],
  studyProjects: [
    { id: 1, name: "Chisel 기반 커스텀 가속기 설계", tech: "Chisel HDL", progress: 40, status: "ALU 모듈 설계 및 테스트벤치 작성 중", next: "MAC 연산기 파이프라이닝 적용" },
    { id: 2, name: "AMBA CHI 프로토콜 검증 환경 구축", tech: "SystemVerilog / UVM", progress: 15, status: "스펙 문서 정독 및 트랜잭션 정의", next: "기본 Sequence 및 Driver 뼈대 작성" },
  ],
  studyNotes: [
    { id: 1, title: "[TIL] Chisel3 Data Types & Wire/Reg", date: "2026.03.07", category: "Chisel", preview: "Chisel에서 기본 자료형과 하드웨어 노드 할당 방식의 차이점 및 예외 케이스 복습." },
    { id: 2, title: "AMBA AXI vs CHI 차이점 및 특징 요약", date: "2026.03.05", category: "Architecture", preview: "AXI와 CHI의 연결 방식, 코히어런시 모델, 확장성 차이를 정리한 비교 노트." },
    { id: 3, title: "UVM Phase 8단계 흐름도 암기", date: "2026.03.02", category: "Verification", preview: "Build부터 Report까지 각 단계별 Virtual function 실행 순서 정리." },
  ],
  projects: [
    { id: 1, name: "RISC-V 5-stage Pipelined Processor 설계", date: "2025.09 - 2025.12", role: "Architecture & RTL Design", tech: ["Verilog", "FPGA", "ModelSim", "Vivado"], impact: "Forwarding Unit 구현으로 IPC 1.5 달성, FPGA 보드 상에서 동작 검증 완료", link: "github.com/my-riscv-core" },
    { id: 2, name: "AMBA AXI4 인터페이스 기반 메모리 컨트롤러", date: "2025.05 - 2025.08", role: "Design & Verification", tech: ["SystemVerilog", "AXI4", "UVM", "VCS"], impact: "Random Testbench 구축으로 100% Functional Coverage 달성", link: "github.com/axi-mem-ctrl" },
    { id: 3, name: "CNN 가속기 MAC 연산기 면적 최적화", date: "2025.01 - 2025.03", role: "Logic Design", tech: ["Verilog", "Python", "Design Compiler"], impact: "Data Reuse 패턴 분석으로 합성 면적 20% 감소", link: "github.com/cnn-mac-opt" },
  ],
};

const industryNewsSeed = [
  { id: 1, tag: "Foundry", title: "TSMC, 2나노 공정 수율 90% 도달 전망", date: "2026.03.08", source: "SemiEngineering" },
  { id: 2, tag: "AI 반도체", title: "리벨리온, 차세대 NPU '리벨' 테이프아웃 성공", date: "2026.03.07", source: "전자신문" },
  { id: 3, tag: "Memory", title: "SK하이닉스, CXL 3.0 기반 메모리 솔루션 시연", date: "2026.03.05", source: "ZDNet Korea" },
  { id: 4, tag: "EDA", title: "Synopsys DSO.ai 업데이트로 PPA 추가 개선", date: "2026.03.03", source: "EE Times" },
  { id: 5, tag: "Architecture", title: "Arm, Neoverse V3 차량용 코어 아키텍처 발표", date: "2026.03.01", source: "TechCrunch" },
];

const flashcardsSeed: FlashcardItem[] = [
  { category: "Digital Design", q: "Setup Time과 Hold Time의 정의와 위반 시 해결책은?", a: "Setup Time은 클럭 엣지 이전 데이터가 안정돼 있어야 하는 최소 시간, Hold Time은 클럭 엣지 이후 유지돼야 하는 시간입니다. Setup 위반은 주파수 완화, 파이프라이닝, 경로 지연 축소로 대응하고, Hold 위반은 버퍼 삽입 등으로 데이터 경로 지연을 늘려 해결합니다." },
  { category: "Verilog HDL", q: "Blocking Assignment(=)와 Non-blocking Assignment(<=)의 차이점은?", a: "Blocking은 순차 실행에 가깝고 주로 조합 논리에, Non-blocking은 동시 갱신 모델에 가깝고 순차 논리에 사용합니다." },
  { category: "SystemVerilog", q: "SystemVerilog에서 Interface의 장점과 Modport의 역할은?", a: "Interface는 신호 묶음을 캡슐화해 재사용성과 가독성을 높이고, Modport는 각 모듈 입장에서 신호 방향과 접근 범위를 제한해 설계 오류를 줄입니다." },
  { category: "Computer Architecture", q: "Cache Memory에서 Write-through와 Write-back의 차이는?", a: "Write-through는 메모리까지 즉시 반영해 일관성이 좋지만 대역폭 비용이 크고, Write-back은 캐시 교체 시점에 반영해 성능에 유리하지만 dirty 상태 관리가 필요합니다." },
  { category: "Verification (UVM)", q: "UVM에서 Sequence와 Sequencer의 역할은 무엇인가요?", a: "Sequence는 트랜잭션 생성 흐름을 정의하고, Sequencer는 여러 Sequence를 중재하며 Driver로 전달하는 역할을 합니다." },
];

const offerProfilesSeed: Record<string, OfferProfile> = {
  "삼성전자 (DS)": { salary: 90, growth: 85, wlb: 70, location: 80, culture: 75, base: "5,300만원", bonus: "PS 최대 50%" },
  SK하이닉스: { salary: 88, growth: 80, wlb: 75, location: 85, culture: 80, base: "5,300만원", bonus: "PI/PS 탄탄함" },
  리벨리온: { salary: 85, growth: 95, wlb: 65, location: 90, culture: 90, base: "5,000만원 + 스톡옵션", bonus: "빠른 기술 성장" },
  망고부스트: { salary: 82, growth: 90, wlb: 80, location: 95, culture: 85, base: "4,800만원 + 스톡옵션", bonus: "서울대 연구공원" },
};

const scheduleSeed: ScheduleEvent[] = [
  { id: 1, date: 5, title: "리벨리온 과제 마감", type: "task", time: "23:59", company: "리벨리온" },
  { id: 2, date: 10, title: "LX세미콘 1차 면접", type: "interview", time: "14:00", company: "LX세미콘" },
  { id: 3, date: 12, title: "텔레칩스 2차 면접", type: "interview", time: "16:30", company: "텔레칩스" },
  { id: 4, date: 15, title: "삼성전자 서류 마감", type: "deadline", time: "18:00", company: "삼성전자 (DS/LSI)" },
  { id: 5, date: 20, title: "퀄컴 코리아 서류 마감", type: "deadline", time: "17:00", company: "퀄컴 코리아" },
  { id: 6, date: 25, title: "SK하이닉스 SKCT", type: "test", time: "10:00", company: "SK하이닉스" },
  { id: 7, date: 25, title: "파두 코딩테스트", type: "test", time: "14:00", company: "파두 (FADU)" },
  { id: 8, date: 28, title: "망고부스트 최종 면접", type: "interview", time: "10:30", company: "망고부스트" },
];

const experienceLibrarySeed: ExperienceItem[] = [
  { id: 201, title: "RISC-V 파이프라인 설계 및 Hazard 해결", category: "프로젝트", strengths: ["RTL 설계", "문제 해결", "검증"], summary: "5-stage 파이프라인 CPU를 설계하고 Hazard 탐지 및 Forwarding 경로를 구현했습니다.", result: "IPC 1.5 달성, FPGA 보드 검증 완료", reusableFor: ["지원동기", "직무 역량", "문제 해결"], companies: ["삼성전자 (DS/LSI)", "텔레칩스", "LX세미콘"] },
  { id: 202, title: "AXI4 메모리 컨트롤러 UVM 검증", category: "검증", strengths: ["SystemVerilog", "UVM", "Coverage"], summary: "메모리 컨트롤러에 대한 랜덤 트랜잭션 기반 검증 환경을 구축했습니다.", result: "Functional Coverage 100%", reusableFor: ["검증 역량", "협업", "품질"], companies: ["SK하이닉스", "삼성전자 (DS/LSI)", "파두 (FADU)"] },
  { id: 203, title: "CNN MAC 연산기 면적 최적화", category: "아키텍처", strengths: ["PPA", "분석", "Python"], summary: "데이터 재사용 패턴을 분석해 연산기 구조를 조정하고 레지스터를 줄였습니다.", result: "합성 면적 20% 감소", reusableFor: ["직무 역량", "AI 반도체", "성과"], companies: ["리벨리온 (AI반도체)", "퓨리오사AI", "퀄컴 코리아"] },
  { id: 204, title: "AMBA CHI 학습 프로젝트", category: "학습", strengths: ["NoC", "프로토콜", "지속성"], summary: "스펙을 기반으로 트랜잭션 모델과 검증 환경 골격을 만들며 확장 가능한 학습 로그를 쌓고 있습니다.", result: "CHI/UVM 연결 학습 체계화", reusableFor: ["성장성", "학습 민첩성", "장기 잠재력"], companies: ["리벨리온 (AI반도체)", "삼성전자 (DS/LSI)", "SK하이닉스"] },
];

const essayQuestionsSeed: EssayQuestion[] = [
  { id: 301, company: "삼성전자 (DS/LSI)", posting: "System LSI RTL Design Engineer", type: "지원동기", question: "삼성전자 DS 회로설계 직무에 지원한 이유와 본인이 기여할 수 있는 점을 작성하세요.", limit: 1000, status: "수정중", draft: "저전력 고성능 설계 역량을 실제 제품에 연결하고 싶어 삼성전자 DS에 지원했습니다. RISC-V 파이프라인 설계 경험을 바탕으로...", linkedExperienceIds: [201, 202] },
  { id: 302, company: "SK하이닉스", posting: "Memory Controller Logic Design", type: "직무 역량", question: "메모리 반도체 설계 직무와 관련된 본인의 프로젝트 경험을 기술하세요.", limit: 1000, status: "초안완료", draft: "AXI4 메모리 컨트롤러와 UVM 검증 환경 구축 경험을 중심으로 고속 데이터 경로 설계 역량을 설명했습니다.", linkedExperienceIds: [202] },
  { id: 303, company: "리벨리온 (AI반도체)", posting: "AI Accelerator RTL Engineer", type: "문제 해결", question: "성능 혹은 면적 문제를 해결한 경험을 구체적으로 설명하세요.", limit: 800, status: "미작성", draft: "", linkedExperienceIds: [203, 204] },
];

const jobPostingsSeed: JobPosting[] = [
  { id: 101, targetCompanyId: 1, company: "삼성전자 (DS/LSI)", title: "System LSI RTL Design Engineer", role: "RTL 설계", deadline: "2026-03-15", stage: "제출완료", fit: 85, burden: 62, urgency: 82, locationFit: 82, growth: 88, selfIntroReady: 72, keywords: ["Verilog", "SystemVerilog", "AMBA AXI", "저전력"], summary: "모바일 AP 및 이미지센서 IP를 위한 RTL 설계와 검증 협업 역할." },
  { id: 102, targetCompanyId: 2, company: "SK하이닉스", title: "Memory Controller Logic Design", role: "디지털 로직 설계", deadline: "2026-03-25", stage: "인적성/과제대기", fit: 80, burden: 68, urgency: 66, locationFit: 85, growth: 84, selfIntroReady: 58, keywords: ["DDR", "HBM", "SystemVerilog", "Python"], summary: "메모리 컨트롤러와 인터페이스 로직의 설계 및 검증 대응." },
  { id: 103, targetCompanyId: 3, company: "LX세미콘", title: "Display Driver IC Digital Design", role: "회로 설계", deadline: "2026-03-10", stage: "면접대기", fit: 75, burden: 58, urgency: 92, locationFit: 88, growth: 72, selfIntroReady: 74, keywords: ["RTL", "Timing Closure", "Display IC"], summary: "DDI 및 주변 디지털 블록 설계, 검증 협업, 양산 대응." },
  { id: 104, targetCompanyId: 4, company: "리벨리온 (AI반도체)", title: "AI Accelerator RTL Engineer", role: "가속기 RTL", deadline: "2026-03-11", stage: "자소서작성중", fit: 86, burden: 78, urgency: 94, locationFit: 90, growth: 95, selfIntroReady: 48, keywords: ["Verilog", "SystemC", "MAC", "NoC"], summary: "추론용 NPU의 연산기 및 온칩 네트워크 구조를 설계하는 역할." },
  { id: 105, targetCompanyId: 5, company: "퓨리오사AI", title: "NPU Micro-architecture Engineer", role: "마이크로아키텍처", deadline: "2026-03-09", stage: "불합격", fit: 70, burden: 72, urgency: 100, locationFit: 86, growth: 94, selfIntroReady: 35, keywords: ["AI Accelerator", "Pipeline", "PPA"], summary: "마이크로아키텍처 및 데이터플로우 중심의 반도체 설계 포지션." },
  { id: 106, targetCompanyId: 6, company: "퀄컴 코리아", title: "SoC Integration Engineer", role: "SoC 통합", deadline: "2026-03-20", stage: "직무분석완료", fit: 60, burden: 85, urgency: 74, locationFit: 92, growth: 96, selfIntroReady: 22, keywords: ["SoC", "Bus", "Low Power", "CDC"], summary: "고성능 모바일 SoC 통합과 인터페이스 안정성 검토." },
  { id: 107, targetCompanyId: 7, company: "텔레칩스", title: "Automotive SoC Verification Engineer", role: "검증", deadline: "2026-03-12", stage: "면접대기", fit: 90, burden: 54, urgency: 88, locationFit: 84, growth: 78, selfIntroReady: 80, keywords: ["SystemVerilog", "UVM", "Automotive"], summary: "차량용 SoC 검증, 인터페이스 시나리오 설계, 파트너 대응." },
  { id: 108, targetCompanyId: 8, company: "파두 (FADU)", title: "Storage Controller RTL Engineer", role: "스토리지 RTL", deadline: "2026-03-18", stage: "자소서작성중", fit: 80, burden: 64, urgency: 70, locationFit: 87, growth: 82, selfIntroReady: 55, keywords: ["PCIe", "NVMe", "RTL", "Verification"], summary: "스토리지 컨트롤러와 고속 인터페이스 중심의 RTL 설계 포지션." },
  { id: 109, targetCompanyId: 9, company: "망고부스트", title: "High-speed Interconnect Engineer", role: "인터커넥트 설계", deadline: "2026-03-28", stage: "합격", fit: 65, burden: 52, urgency: 48, locationFit: 95, growth: 90, selfIntroReady: 92, keywords: ["SerDes", "High-speed IO", "Verification"], summary: "고속 인터커넥트 설계와 검증을 포함하는 스타트업 포지션." },
];

const applicationChecklistSeed: ApplicationChecklistRecord[] = jobPostingsSeed.map((posting) => ({
  postingId: posting.id,
  items: [
    {
      id: `${posting.id}-cover-letter`,
      label: "자소서 최종본 반영",
      category: "documents",
      done: posting.selfIntroReady >= 75,
      note: posting.selfIntroReady >= 75 ? "핵심 문항 반영 완료" : "문장 다듬기와 회사 맞춤 문구 보완 필요",
      blocked: posting.selfIntroReady < 35,
    },
    {
      id: `${posting.id}-portfolio`,
      label: "포트폴리오 링크 점검",
      category: "documents",
      done: posting.fit >= 75,
      note: "대표 프로젝트 링크와 README 확인",
      blocked: false,
    },
    {
      id: `${posting.id}-naming`,
      label: "제출 파일명/형식 확인",
      category: "submission",
      done: posting.stage === "제출완료" || posting.stage === "합격",
      note: "PDF/포트폴리오 첨부 형식 재확인",
      blocked: false,
    },
    {
      id: `${posting.id}-company-research`,
      label: "기업 분석 요약 점검",
      category: "research",
      done: posting.stage !== "관심기업" && posting.stage !== "공고확인",
      note: "최근 뉴스 2건과 직무 핵심 요구 역량 요약",
      blocked: false,
    },
    {
      id: `${posting.id}-interview`,
      label: "예상 질문 3개 준비",
      category: "story",
      done: posting.stage === "면접대기" || posting.stage === "합격",
      note: "지원동기/프로젝트/협업 질문 중심",
      blocked: false,
    },
    {
      id: `${posting.id}-deadline`,
      label: "지원 마감 시간 재확인",
      category: "submission",
      done: true,
      note: `${posting.deadline} 마감 일정 캘린더 반영`,
      blocked: getDaysLeft(posting.deadline) <= 2 && posting.stage !== "제출완료" && posting.stage !== "합격",
    },
  ],
}));

function buildDefaultDashboardLocalState(): DashboardLocalState {
  return {
    ui: {
      activeTab: "overview",
      postingQuery: "",
      postingCompanyFilter: "all",
      selectedCompanyId: 1,
      selectedOfferA: "삼성전자 (DS)",
      selectedOfferB: "리벨리온",
      portfolioSubTab: "showcase",
      selectedChecklistPostingId: jobPostingsSeed[0].id,
      selectedEssayId: essayQuestionsSeed[0].id,
      industryFilter: "All",
      flashcardMode: "default",
      activeFlashcardIndex: 0,
      selectedScheduleId: scheduleSeed.find((event) => event.date >= TODAY.getDate())?.id ?? scheduleSeed[0].id,
      selectedCoverLetterName: null,
    },
    location: {
      routeOrigin: originPresetSeed[0].value,
      routeDestination: companyTargetsSeed[0].name,
      companyCommuteNotes: {},
    },
    checklists: {
      applicationChecklists: Object.fromEntries(applicationChecklistSeed.map((record) => [record.postingId, record.items])) as Record<
        number,
        ApplicationChecklistItem[]
      >,
    },
    interview: {
      flashcardFeedback: {},
    },
    jdScanner: {
      text: `우대사항
- Verilog / SystemVerilog 기반 RTL 설계 경험
- UVM 검증 환경 이해
- AMBA AXI, FPGA 프로토타이핑 경험
- 저전력 설계 또는 CDC 분석 경험`,
    },
    overview: {
      taskChecked: {},
    },
  };
}

const weeklyTrendSeed = [
  { week: "1주차", applications: 3, passes: 1 },
  { week: "2주차", applications: 5, passes: 2 },
  { week: "3주차", applications: 8, passes: 3 },
  { week: "4주차", applications: 12, passes: 4 },
  { week: "5주차", applications: 10, passes: 3 },
  { week: "6주차", applications: 6, passes: 2 },
  { week: "7주차", applications: 4, passes: 1 },
  { week: "8주차", applications: 2, passes: 1 },
];

const postingStageOrder: PostingStage[] = [
  "관심기업",
  "공고확인",
  "기업분석완료",
  "직무분석완료",
  "자소서작성중",
  "제출완료",
  "인적성/과제대기",
  "면접대기",
  "최종결과대기",
  "합격",
  "불합격",
  "보류",
];

const kanbanColumns = [
  { id: "preparing", title: "준비/분석", accent: "border-slate-400", bg: "bg-slate-50" },
  { id: "applied", title: "서류 제출/심사", accent: "border-indigo-400", bg: "bg-indigo-50/60" },
  { id: "test", title: "필기/과제", accent: "border-sky-400", bg: "bg-sky-50/60" },
  { id: "interview1", title: "1차 면접", accent: "border-violet-400", bg: "bg-violet-50/60" },
  { id: "interview2", title: "2차 면접", accent: "border-amber-400", bg: "bg-amber-50/60" },
  { id: "passed", title: "최종 합격", accent: "border-emerald-500", bg: "bg-emerald-50/70" },
] as const;

const jdKeywordLibrary = [
  { label: "Verilog", aliases: ["verilog"] },
  { label: "SystemVerilog", aliases: ["systemverilog", "sv"] },
  { label: "UVM", aliases: ["uvm"] },
  { label: "AMBA AXI", aliases: ["amba axi", "axi"] },
  { label: "FPGA", aliases: ["fpga"] },
  { label: "Python", aliases: ["python"] },
  { label: "CDC Analysis", aliases: ["cdc", "clock domain crossing"] },
  { label: "Low Power Design", aliases: ["low power", "power intent", "upf"] },
  { label: "Formal Verification", aliases: ["formal verification", "formal"] },
  { label: "PCIe Gen5", aliases: ["pcie", "pcie gen5"] },
  { label: "SystemC", aliases: ["systemc"] },
  { label: "Computer Architecture", aliases: ["computer architecture", "soc", "architecture"] },
  { label: "Chisel", aliases: ["chisel"] },
];

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function normalizeKeyword(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

function getDaysLeft(deadline: string) {
  const end = new Date(`${deadline}T00:00:00`);
  const diff = end.getTime() - TODAY.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function computePriority(posting: JobPosting) {
  const stageWeightMap: Record<PostingStage, number> = {
    관심기업: 20,
    공고확인: 34,
    기업분석완료: 42,
    직무분석완료: 48,
    자소서작성중: 74,
    제출완료: 40,
    "인적성/과제대기": 58,
    면접대기: 67,
    최종결과대기: 28,
    합격: 12,
    불합격: 0,
    보류: 15,
  };

  const score =
    posting.fit * 0.24 +
    posting.urgency * 0.22 +
    posting.locationFit * 0.08 +
    posting.growth * 0.14 +
    posting.selfIntroReady * 0.18 +
    stageWeightMap[posting.stage] * 0.18 -
    posting.burden * 0.12;

  return Math.max(0, Math.round(score));
}

function getCompanyTypeTone(type: CompanyStrategyType) {
  if (type === "집중공략") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }
  if (type === "상향지원") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

function getStageTone(stage: PostingStage) {
  const map: Record<PostingStage, string> = {
    관심기업: "bg-slate-100 text-slate-700",
    공고확인: "bg-slate-100 text-slate-700",
    기업분석완료: "bg-sky-100 text-sky-700",
    직무분석완료: "bg-sky-100 text-sky-700",
    자소서작성중: "bg-amber-100 text-amber-700",
    제출완료: "bg-indigo-100 text-indigo-700",
    "인적성/과제대기": "bg-violet-100 text-violet-700",
    면접대기: "bg-fuchsia-100 text-fuchsia-700",
    최종결과대기: "bg-cyan-100 text-cyan-700",
    합격: "bg-emerald-100 text-emerald-700",
    불합격: "bg-rose-100 text-rose-700",
    보류: "bg-slate-200 text-slate-700",
  };
  return map[stage];
}

function getEventTone(type: ScheduleEvent["type"]) {
  if (type === "interview") {
    return "bg-violet-100 text-violet-700 border-violet-200";
  }
  if (type === "deadline") {
    return "bg-rose-100 text-rose-700 border-rose-200";
  }
  if (type === "test") {
    return "bg-sky-100 text-sky-700 border-sky-200";
  }
  return "bg-amber-100 text-amber-700 border-amber-200";
}

function getNewsTone(tag: string) {
  if (tag === "Foundry") {
    return "bg-orange-100 text-orange-700";
  }
  if (tag === "AI 반도체") {
    return "bg-fuchsia-100 text-fuchsia-700";
  }
  if (tag === "Memory") {
    return "bg-sky-100 text-sky-700";
  }
  if (tag === "EDA") {
    return "bg-indigo-100 text-indigo-700";
  }
  return "bg-emerald-100 text-emerald-700";
}

function buildContributionGrid(weeks: number, days: number) {
  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: days }, (_, day) => ((week * 3 + day * 2 + (week % 4)) % 5)),
  );
}

function buildCalendarCells(year: number, monthIndex: number) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstWeekday + 1;
    if (day < 1 || day > daysInMonth) {
      return { key: `blank-${index}`, day: null };
    }
    return { key: `day-${day}`, day };
  });
}

function getStableSortScore(value: string) {
  return value.split("").reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
}

function getTaskTitle(posting: EnrichedPosting) {
  if (posting.stage === "자소서작성중") {
    return `${posting.company} 자소서 1차 초안 정리`;
  }
  if (posting.stage === "면접대기") {
    return `${posting.company} 예상 질문 답변 시뮬레이션`;
  }
  if (posting.stage === "인적성/과제대기") {
    return `${posting.company} 전형 대비 문제 풀이 세션`;
  }
  if (posting.stage === "제출완료") {
    return `${posting.company} 제출 후 Follow-up 메모 정리`;
  }
  return `${posting.company} ${posting.title} 다음 액션 진행`;
}

function getLocationInsight(company: CompanyTarget) {
  if (company.location.includes("판교")) {
    return "스타트업/팹리스 밀집 지역이라 네트워킹과 이직 정보 접근성이 좋습니다.";
  }
  if (company.location.includes("화성") || company.location.includes("기흥")) {
    return "대형 반도체 사업장 중심 지역이라 공정/설계 협업 맥락을 체감하기 좋습니다.";
  }
  if (company.location.includes("이천")) {
    return "메모리 중심 생산/개발 축과 맞닿아 있어 장기적으로 메모리 커리어 집중도가 높습니다.";
  }
  return "서울권 접근성이 높아 면접/출퇴근 부담이 상대적으로 안정적입니다.";
}

function analyzeJdText(text: string, portfolioKeywordSet: Set<string>): JdScanResult {
  const normalized = normalizeKeyword(text);
  const extracted = jdKeywordLibrary
    .filter((item) => item.aliases.some((alias) => normalized.includes(normalizeKeyword(alias))))
    .map((item) => item.label);

  const uniqueExtracted = extracted.length > 0 ? Array.from(new Set(extracted)) : ["Verilog", "SystemVerilog", "AMBA AXI", "UVM", "FPGA"];
  const matched = uniqueExtracted.filter((keyword) => portfolioKeywordSet.has(normalizeKeyword(keyword)));
  const missing = uniqueExtracted.filter((keyword) => !matched.includes(keyword));
  const coverage = Math.round((matched.length / uniqueExtracted.length) * 100);

  let recommendation = "포트폴리오에서 이미 다루는 기술을 앞쪽 프로젝트 설명에 더 선명하게 배치하세요.";
  if (missing.includes("Formal Verification")) {
    recommendation = "Formal Verification은 학습 중 항목과 연결해 '진행중인 역량'으로라도 명시하는 것이 좋습니다.";
  } else if (missing.includes("PCIe Gen5")) {
    recommendation = "PCIe 계열 키워드는 스터디 프로젝트나 관심 기술 섹션에 보강해두는 편이 유리합니다.";
  } else if (missing.length === 0) {
    recommendation = "핵심 키워드는 이미 충분히 맞아 있습니다. 프로젝트의 성과 수치와 역할 범위를 더 강조하면 됩니다.";
  }

  return { extracted: uniqueExtracted, matched, missing, coverage, recommendation };
}

function renderMarkdown(markdown: string) {
  const blocks: React.ReactNode[] = [];
  const lines = markdown.split("\n");
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }
    blocks.push(
      <ul key={`list-${blocks.length}`} className="mb-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    if (line.startsWith("# ")) {
      flushList();
      blocks.push(
        <h1 key={`h1-${index}`} className="mb-6 break-words border-b border-slate-200 pb-3 text-[34px] font-black tracking-tight text-slate-900">
          {line.replace("# ", "")}
        </h1>,
      );
      return;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h2 key={`h2-${index}`} className="mb-3 mt-8 break-words text-[22px] font-bold text-slate-800">
          {line.replace("## ", "")}
        </h2>,
      );
      return;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.replace("- ", ""));
      return;
    }

    if (line.trim() === "") {
      flushList();
      return;
    }

    flushList();
    blocks.push(
      <p key={`p-${index}`} className="mb-3 break-words text-sm leading-relaxed text-slate-700">
        {line}
      </p>,
    );
  });

  flushList();
  return blocks;
}

function coverLetterSlugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getIsoNow() {
  return new Date().toISOString();
}

function buildEmptyCoverLetterDraft(company?: CompanyTarget, posting?: EnrichedPosting): CoverLetterDraft {
  const companyName = company?.name ?? "";
  const companyId = company ? String(company.id) : "";
  const companySlug = company ? companySlugSeed[company.id] ?? coverLetterSlugify(company.name) : "";
  const title = company ? `${company.name} 자기소개서` : "새 자소서";
  const jobTrack = posting?.role ? coverLetterSlugify(posting.role) : "cover-letter";

  return {
    originalName: null,
    meta: {
      year: "2026",
      companyId,
      companyName,
      companySlug,
      jobTrack,
      docType: "cover-letter",
      updatedAt: getIsoNow(),
      title,
      status: "draft",
      tags: "",
    },
    content: `# ${title}\n\n## 1. 지원동기\n\n## 2. 직무 역량 경험\n`,
  };
}

function buildCoverLetterFileName(meta: CoverLetterMeta) {
  return `${meta.year}__${meta.companySlug}__${coverLetterSlugify(meta.jobTrack)}__${coverLetterSlugify(meta.docType)}.md`;
}

function buildEmptyCommuteNote(): CommuteNote {
  return {
    totalMinutes: "",
    transfers: "",
    hasBus: false,
    hasSubway: false,
    note: "",
  };
}

function normalizeCommuteNote(value: unknown): CommuteNote {
  if (typeof value === "string") {
    return {
      totalMinutes: "",
      transfers: "",
      hasBus: false,
      hasSubway: false,
      note: value,
    };
  }

  if (value && typeof value === "object") {
    const raw = value as Partial<CommuteNote>;
    return {
      totalMinutes: typeof raw.totalMinutes === "string" ? raw.totalMinutes : "",
      transfers: typeof raw.transfers === "string" ? raw.transfers : "",
      hasBus: Boolean(raw.hasBus),
      hasSubway: Boolean(raw.hasSubway),
      note: typeof raw.note === "string" ? raw.note : "",
    };
  }

  return buildEmptyCommuteNote();
}

function hasCommuteNoteContent(value: CommuteNote) {
  return Boolean(value.totalMinutes || value.transfers || value.hasBus || value.hasSubway || value.note.trim());
}

function formatCommuteNoteSummary(value: CommuteNote) {
  const parts: string[] = [];
  if (value.totalMinutes) {
    parts.push(`${value.totalMinutes}분`);
  }
  if (value.transfers) {
    parts.push(`환승 ${value.transfers}회`);
  }
  if (value.hasBus || value.hasSubway) {
    const modes = [value.hasBus ? "버스" : null, value.hasSubway ? "지하철" : null].filter(Boolean).join(" + ");
    if (modes) {
      parts.push(modes);
    }
  }
  if (parts.length === 0 && value.note.trim()) {
    parts.push(value.note.trim());
  }
  return parts.join(" · ");
}

function projectToNaverWebXY(lat: number, lng: number) {
  const originShift = 6378137;
  const x = originShift * ((lng * Math.PI) / 180);
  const y =
    originShift *
    Math.log(Math.tan(Math.PI / 4 + ((lat * Math.PI) / 180) / 2));
  return {
    x: x.toFixed(6),
    y: y.toFixed(6),
  };
}

function buildNaverDirectionSegment({
  placeName,
  type = "ADDRESS_POI",
  lat,
  lng,
}: {
  placeName: string;
  type?: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
  lat?: number | null;
  lng?: number | null;
}) {
  const projected = typeof lat === "number" && typeof lng === "number" ? projectToNaverWebXY(lat, lng) : null;
  const x = projected ? projected.x : "-";
  const y = projected ? projected.y : "-";
  return `${x},${y},${encodeURIComponent(placeName)},,${type}`;
}

function buildNaverTransitDirectionsUrl({
  origin,
  originLat,
  originLng,
  originType,
  destination,
  destinationLat,
  destinationLng,
}: {
  origin: string;
  originLat?: number | null;
  originLng?: number | null;
  originType?: "ADDRESS_POI" | "PLACE_POI" | "SUBWAY_STATION";
  destination: string;
  destinationLat?: number | null;
  destinationLng?: number | null;
}) {
  const originSegment = buildNaverDirectionSegment({
    placeName: origin,
    type: originType ?? "ADDRESS_POI",
    lat: originLat,
    lng: originLng,
  });
  const destinationSegment = buildNaverDirectionSegment({
    placeName: destination,
    type: "PLACE_POI",
    lat: destinationLat,
    lng: destinationLng,
  });
  return `https://map.naver.com/p/directions/${originSegment}/${destinationSegment}/-/transit?c=15.00,0,0,0,dh`;
}

function SurfaceCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-[24px] border border-slate-200 bg-white shadow-sm", className)}>{children}</section>;
}

function ScrollArea({
  children,
  className,
  dark = false,
  axis = "y",
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  axis?: "x" | "y" | "both";
}) {
  return (
    <OverlayScrollbarsComponent
      defer
      className={cn("min-h-0", className)}
      options={{
        overflow: {
          x: axis === "x" || axis === "both" ? "scroll" : "hidden",
          y: axis === "y" || axis === "both" ? "scroll" : "hidden",
        },
        scrollbars: {
          theme: dark ? "os-theme-career-dark" : "os-theme-career",
          autoHide: "never",
          autoHideDelay: 140,
          dragScroll: true,
          clickScroll: true,
        },
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", className)}>{children}</span>;
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} />
    </div>
  );
}

function Sparkline({ data, strokeColor }: { data: number[]; strokeColor: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => `${(index / (data.length - 1)) * 100},${100 - ((value - min) / range) * 80 - 10}`).join(" ");
  const gradientId = `spark-${strokeColor.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 100 100" className="h-12 w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${points} 100,100`} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KpiCard({ metric }: { metric: KpiMetric }) {
  return (
    <SurfaceCard className="p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-slate-900">{metric.value}</span>
            {metric.suffix ? <span className="text-sm font-medium text-slate-500">{metric.suffix}</span> : null}
          </div>
        </div>
        <Pill className={cn(metric.trend.startsWith("+") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-600")}>
          {metric.trend} 최근
        </Pill>
      </div>
      <Sparkline data={metric.data} strokeColor={metric.color} />
    </SurfaceCard>
  );
}

function PipelineBar({
  label,
  stage,
  progress,
  expectedDate,
  colorHex,
}: {
  label: string;
  stage: string;
  progress: number;
  expectedDate: string;
  colorHex: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-32 shrink-0 font-semibold text-slate-700">{label}</div>
      <div className="w-24 shrink-0 text-xs text-slate-500">{stage}</div>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${progress}%`, backgroundColor: colorHex }} />
      </div>
      <div className="w-24 shrink-0 text-right text-xs text-slate-400">{expectedDate}</div>
    </div>
  );
}

function SemiCircleGauge({ value, target, label, colorHex }: { value: number; target: number; label: string; colorHex: string }) {
  const radius = 40;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const targetAngle = (target / 100) * 180;
  const targetX = 50 - 45 * Math.cos(targetAngle * (Math.PI / 180));
  const targetY = 50 - 45 * Math.sin(targetAngle * (Math.PI / 180));

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 55" className="h-auto w-32 overflow-visible">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={colorHex} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
        <line x1="50" y1="50" x2={targetX} y2={targetY} stroke="#334155" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
      <div className="mt-1 text-center">
        <p className="text-lg font-bold text-slate-800">{value}%</p>
        <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
        <p className="text-[10px] text-slate-400">목표: {target}%</p>
      </div>
    </div>
  );
}

function FunnelChart({ data }: { data: FunnelStep[] }) {
  const maxCount = data[0]?.count ?? 1;

  return (
    <div className="flex w-full flex-col items-center space-y-1 py-4">
      {data.map((item, index) => {
        const widthPercent = Math.max((item.count / maxCount) * 100, 18);
        const colors = ["#4f46e5", "#2563eb", "#0ea5e9", "#14b8a6", "#22c55e"];

        return (
          <div key={item.stage} className="relative flex w-full flex-col items-center">
            <div className="flex h-10 items-center justify-between rounded px-4 text-sm font-semibold text-white shadow-sm" style={{ width: `${widthPercent}%`, backgroundColor: colors[index] }}>
              <span className={cn(widthPercent < 36 ? "hidden" : "block")}>{item.stage}</span>
              <span className="text-base font-bold">{item.count}</span>
            </div>
            {index < data.length - 1 ? (
              <div className="my-1 text-[11px] font-medium text-slate-400">
                ↓ 전환율 {item.count === 0 ? 0 : ((data[index + 1].count / item.count) * 100).toFixed(1)}%
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function StrategyMatrix({
  data,
  selectedId,
  onSelect,
}: {
  data: CompanyTarget[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="relative aspect-[4/3] w-full rounded-tr-lg border-b-2 border-l-2 border-slate-300 bg-slate-50/50">
      <div className="absolute left-0 top-0 h-1/2 w-1/2 bg-yellow-50/40" />
      <div className="absolute right-0 top-0 h-1/2 w-1/2 rounded-tr-lg bg-blue-50/40" />
      <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-slate-100/60" />
      <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-emerald-50/40" />
      <div className="absolute left-0 top-1/2 h-px w-full border-t border-dashed border-slate-400" />
      <div className="absolute left-1/2 top-0 h-full w-px border-l border-dashed border-slate-400" />
      <span className="absolute left-4 top-2 text-xs font-bold text-yellow-600/80">도전: 상향 지원</span>
      <span className="absolute right-4 top-2 text-xs font-bold text-blue-600/80">1순위: 집중 공략</span>
      <span className="absolute bottom-4 left-4 text-xs font-bold text-slate-400">보류/재고</span>
      <span className="absolute bottom-4 right-4 text-xs font-bold text-emerald-600/80">플랜B: 안정 지원</span>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">합격 가능성 (Fit & Readiness) →</span>
      <span className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs font-bold text-slate-600">내 선호도 (Preference) →</span>
      {data.map((target) => {
        const left = `${target.fit}%`;
        const top = `${100 - target.preference}%`;
        const colorClass =
          target.type === "집중공략"
            ? "bg-blue-500"
            : target.type === "상향지원"
              ? "bg-amber-400"
              : "bg-emerald-500";

        return (
          <button key={target.id} type="button" onClick={() => onSelect(target.id)} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
            <div className={cn("h-4 w-4 rounded-full ring-4 ring-white transition-all group-hover:scale-125", colorClass, selectedId === target.id ? "scale-125 shadow-lg" : "shadow-sm")} />
            <span className={cn("absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm transition-opacity", selectedId === target.id ? "opacity-100" : "opacity-85")}>
              {target.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RadarChart({
  data1,
  data2,
  color1,
  color2,
}: {
  data1: OfferProfile;
  data2: OfferProfile;
  color1: string;
  color2: string;
}) {
  const axes: Array<keyof Pick<OfferProfile, "salary" | "wlb" | "growth" | "location" | "culture">> = ["salary", "wlb", "growth", "location", "culture"];
  const labels = ["연봉/보상", "워라밸", "성장성", "위치/출퇴근", "조직문화"];
  const center = 150;
  const radius = 100;
  const angleStep = (Math.PI * 2) / axes.length;

  const getPoints = (profile: OfferProfile) =>
    axes
      .map((axis, index) => {
        const value = profile[axis] / 100;
        const x = center + radius * value * Math.cos(index * angleStep - Math.PI / 2);
        const y = center + radius * value * Math.sin(index * angleStep - Math.PI / 2);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg viewBox="0 0 300 300" className="mx-auto h-full w-full max-w-sm overflow-visible">
      {[0.2, 0.4, 0.6, 0.8, 1].map((level) => (
        <polygon
          key={level}
          points={axes
            .map((_, index) => `${center + radius * level * Math.cos(index * angleStep - Math.PI / 2)},${center + radius * level * Math.sin(index * angleStep - Math.PI / 2)}`)
            .join(" ")}
          fill="none"
          stroke="#dbe4ef"
          strokeWidth="1"
        />
      ))}
      {axes.map((_, index) => (
        <line key={`line-${labels[index]}`} x1={center} y1={center} x2={center + radius * Math.cos(index * angleStep - Math.PI / 2)} y2={center + radius * Math.sin(index * angleStep - Math.PI / 2)} stroke="#dbe4ef" strokeWidth="1" />
      ))}
      {labels.map((label, index) => {
        const x = center + (radius + 26) * Math.cos(index * angleStep - Math.PI / 2);
        const y = center + (radius + 18) * Math.sin(index * angleStep - Math.PI / 2);
        return (
          <text key={label} x={x} y={y} fontSize="10" fontWeight="700" fill="#64748b" textAnchor="middle" dominantBaseline="middle">
            {label}
          </text>
        );
      })}
      <polygon points={getPoints(data1)} fill={color1} fillOpacity="0.28" stroke={color1} strokeWidth="2.5" />
      <polygon points={getPoints(data2)} fill={color2} fillOpacity="0.28" stroke={color2} strokeWidth="2.5" />
    </svg>
  );
}

function ContributionHeatmap({ values }: { values: number[][] }) {
  const colors = ["bg-slate-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-500", "bg-emerald-700"];

  return (
    <ScrollArea axis="x" className="pb-2">
      <div className="flex gap-1">
        {values.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
            {week.map((value, dayIndex) => (
              <div key={`cell-${weekIndex}-${dayIndex}`} className={cn("h-3 w-3 rounded-sm", colors[value])} />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function LeafletLocationMap({
  companies,
  selectedCompanyId,
  onSelectCompany,
}: {
  companies: CompanyTarget[];
  selectedCompanyId: number;
  onSelectCompany: (id: number) => void;
}) {
  const mapContainerId = "location-leaflet-map";
  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) ?? companies[0];
  const [tileState, setTileState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = document.getElementById(mapContainerId);
    if (!container) {
      return;
    }

    if ((container as any)._leaflet_id) {
      (container as any)._leaflet_id = undefined;
    }

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    }).setView([36.5, 127.8], 7);

    const markers = new Map<number, L.Marker>();
    let sawSuccessfulTile = false;
    let tileErrorCount = 0;

    const tileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      crossOrigin: true,
    });

    tileLayer.on("loading", () => {
      setTileState("loading");
    });
    tileLayer.on("load", () => {
      sawSuccessfulTile = true;
      setTileState("ready");
    });
    tileLayer.on("tileerror", () => {
      tileErrorCount += 1;
      if (!sawSuccessfulTile && tileErrorCount >= 1) {
        setTileState("error");
      }
    });
    tileLayer.on("tileload", () => {
      sawSuccessfulTile = true;
      setTileState("ready");
    });
    tileLayer.addTo(map);

    const buildMarkerIcon = (company: CompanyTarget, selected: boolean) => {
      const color = company.location.includes("서울") ? "#3b82f6" : company.location.includes("경기") ? "#10b981" : "#f59e0b";
      const size = selected ? 18 : 14;
      const ring = selected ? 5 : 4;
      return L.divIcon({
        className: "dashboard-marker-icon",
        html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:${ring}px solid white;box-shadow:0 8px 20px rgba(15,23,42,.18)"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    };

    companies.forEach((company) => {
      const marker = L.marker([company.lat, company.lng], {
        icon: buildMarkerIcon(company, company.id === selectedCompanyId),
      }).addTo(map);
      marker.bindPopup(`<div style="font-weight:700;font-size:12px">${company.name}<br /><span style="font-weight:500;color:#64748b">${company.location}</span></div>`);
      marker.on("click", () => onSelectCompany(company.id));
      markers.set(company.id, marker);
    });

    const selectedMarker = markers.get(selectedCompanyId);
    if (selectedMarker) {
      map.setView([selectedCompany.lat, selectedCompany.lng], 9, { animate: false });
      selectedMarker.openPopup();
    }

    const resizeMap = () => map.invalidateSize();
    requestAnimationFrame(resizeMap);
    const resizeTimeout = window.setTimeout(resizeMap, 160);
    window.addEventListener("resize", resizeMap);

    return () => {
      window.clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeMap);
      markers.forEach((marker) => marker.remove());
      tileLayer.remove();
      map.remove();
      container.innerHTML = "";
    };
  }, [companies, onSelectCompany, selectedCompanyId]);

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
      <div className="absolute left-4 top-4 z-[500] rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Leaflet Map</p>
        <p className="mt-1 text-sm font-bold text-slate-900">{selectedCompany.name}</p>
        <p className="mt-1 text-xs text-slate-500">{selectedCompany.location}</p>
      </div>
      {tileState === "error" ? (
        <div className="absolute inset-0 z-[450] flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-rose-200 bg-white px-5 py-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-rose-700">지도 타일 로드 실패</p>
            <p className="mt-2 text-xs text-slate-500">오른쪽 목록과 상세 패널은 계속 사용할 수 있습니다.</p>
          </div>
        </div>
      ) : null}
      <div id={mapContainerId} className="min-h-[360px] w-full" aria-label="한국 위치 인사이트 지도" />
      <div className="absolute bottom-4 left-4 z-[500] flex flex-wrap gap-2">
        <Pill className="border-slate-200 bg-white/90 text-slate-700">서울권</Pill>
        <Pill className="border-slate-200 bg-white/90 text-slate-700">경기권</Pill>
        <Pill className="border-slate-200 bg-white/90 text-slate-700">OpenStreetMap</Pill>
      </div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  isActive,
  expanded,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mx-2 flex items-center rounded-2xl border border-transparent px-3 py-2 text-left text-[13px] transition-all duration-300",
        expanded ? "w-[calc(100%-16px)] gap-3 justify-start" : "w-[48px] justify-center",
        isActive
          ? "border-slate-900/15 bg-[linear-gradient(135deg,_rgba(7,18,46,0.98),_rgba(10,24,58,0.94))] text-white shadow-[0_14px_28px_rgba(2,6,23,0.18)]"
          : "text-slate-500 hover:border-slate-200 hover:bg-white/60 hover:text-slate-900",
      )}
      title={label}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-500")} />
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap font-medium transition-all duration-300",
          expanded ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0",
          isActive && "font-semibold",
        )}
      >
        {label}
      </span>
    </button>
  );
}

export default function HardwareCareerDashboardMerged() {
  const defaultDashboardState = buildDefaultDashboardLocalState();
  const previousSelectedCompanyIdRef = useRef<number | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [postingQuery, setPostingQuery] = useState("");
  const [postingCompanyFilter, setPostingCompanyFilter] = useState<string>("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(1);
  const [companyCommuteNotes, setCompanyCommuteNotes] = useState<Record<number, CommuteNote>>({});
  const [dashboardStateSync, setDashboardStateSync] = useState<DashboardStateSync>({
    phase: "idle",
    message: null,
    lastSavedAt: null,
  });
  const [routeOrigin, setRouteOrigin] = useState(originPresetSeed[0].value);
  const [routeDestination, setRouteDestination] = useState(companyTargetsSeed[0].name);
  const [routeSearchError, setRouteSearchError] = useState<string | null>(null);
  const [selectedOfferA, setSelectedOfferA] = useState<string>("삼성전자 (DS)");
  const [selectedOfferB, setSelectedOfferB] = useState<string>("리벨리온");
  const [portfolioSubTab, setPortfolioSubTab] = useState<PortfolioSubTab>("showcase");
  const [selectedChecklistPostingId, setSelectedChecklistPostingId] = useState<number>(jobPostingsSeed[0].id);
  const [applicationChecklists, setApplicationChecklists] = useState<Record<number, ApplicationChecklistItem[]>>(
    () =>
      Object.fromEntries(applicationChecklistSeed.map((record) => [record.postingId, record.items])) as Record<
        number,
        ApplicationChecklistItem[]
      >,
  );
  const [selectedEssayId, setSelectedEssayId] = useState(essayQuestionsSeed[0].id);
  const [industryFilter, setIndustryFilter] = useState("All");
  const [flashcardMode, setFlashcardMode] = useState<"default" | "shuffled">("default");
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState<number | null>(0);
  const [flashcardFeedback, setFlashcardFeedback] = useState<Record<string, "hard" | "easy">>({});
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>(scheduleSeed.find((event) => event.date >= TODAY.getDate())?.id ?? scheduleSeed[0].id);
  const [coverLetterConfig, setCoverLetterConfig] = useState<CoverLetterConfig | null>(null);
  const [coverLetterFiles, setCoverLetterFiles] = useState<CoverLetterRecord[]>([]);
  const [selectedCoverLetterName, setSelectedCoverLetterName] = useState<string | null>(null);
  const [coverLetterDraft, setCoverLetterDraft] = useState<CoverLetterDraft>(() => buildEmptyCoverLetterDraft());
  const [coverLetterSync, setCoverLetterSync] = useState<CoverLetterSyncState>({
    phase: "idle",
    message: null,
    lastSyncedAt: null,
  });
  const [jdScan, setJdScan] = useState<JdScanState>({
    phase: "idle",
    text: `우대사항
- Verilog / SystemVerilog 기반 RTL 설계 경험
- UVM 검증 환경 이해
- AMBA AXI, FPGA 프로토타이핑 경험
- 저전력 설계 또는 CDC 분석 경험`,
  });
  const [taskChecked, setTaskChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (jdScan.phase !== "loading") {
      return;
    }
    const timer = window.setTimeout(() => {
      setJdScan((current) => (current.phase === "loading" ? { ...current, phase: "result" } : current));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [jdScan.phase]);

  useEffect(() => {
    if (activeTab !== "location") {
      return;
    }
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 120);
    return () => window.clearTimeout(timer);
  }, [activeTab]);

  const buildDashboardStatePayload = (): DashboardLocalState => ({
    ui: {
      activeTab,
      postingQuery,
      postingCompanyFilter,
      selectedCompanyId,
      selectedOfferA,
      selectedOfferB,
      portfolioSubTab,
      selectedChecklistPostingId,
      selectedEssayId,
      industryFilter,
      flashcardMode,
      activeFlashcardIndex,
      selectedScheduleId,
      selectedCoverLetterName,
    },
    location: {
      routeOrigin,
      routeDestination,
      companyCommuteNotes,
    },
    checklists: {
      applicationChecklists,
    },
    interview: {
      flashcardFeedback,
    },
    jdScanner: {
      text: jdScan.text,
    },
    overview: {
      taskChecked,
    },
  });

  const saveDashboardState = async () => {
    setDashboardStateSync({
      phase: "saving",
      message: null,
      lastSavedAt: dashboardStateSync.lastSavedAt,
    });

    try {
      const payload = (await window.desktopAPI.dashboardState.save(buildDashboardStatePayload())) as {
        error?: string;
        savedAt?: string;
        state?: DashboardLocalState;
      };
      if (!payload.state) {
        throw new Error(payload.error || "대시보드 상태 저장에 실패했습니다.");
      }
      setDashboardStateSync({
        phase: "idle",
        message: "로컬 상태 저장됨",
        lastSavedAt: payload.savedAt ?? getIsoNow(),
      });
    } catch (error) {
      setDashboardStateSync({
        phase: "error",
        message: error instanceof Error ? error.message : "대시보드 상태 저장 중 오류가 발생했습니다.",
        lastSavedAt: dashboardStateSync.lastSavedAt,
      });
    }
  };

  useEffect(() => {
    void (async () => {
      setDashboardStateSync({
        phase: "loading",
        message: null,
        lastSavedAt: null,
      });
      try {
        const payload = (await window.desktopAPI.dashboardState.read()) as {
          state?: Partial<DashboardLocalState>;
          error?: string;
          savedAt?: string;
        };
        if (!payload.state) {
          throw new Error(payload.error || "대시보드 상태 로드에 실패했습니다.");
        }

        const nextState: DashboardLocalState = {
          ui: { ...defaultDashboardState.ui, ...(payload.state.ui ?? {}) },
          location: {
            ...defaultDashboardState.location,
            ...(payload.state.location ?? {}),
            companyCommuteNotes: Object.fromEntries(
              Object.entries(payload.state.location?.companyCommuteNotes ?? {})
                .map(([key, value]) => [Number(key), normalizeCommuteNote(value)])
                .filter(([key]) => Number.isFinite(key)),
            ) as Record<number, CommuteNote>,
          },
          checklists: {
            applicationChecklists:
              (payload.state.checklists?.applicationChecklists as Record<number, ApplicationChecklistItem[]>) ?? defaultDashboardState.checklists.applicationChecklists,
          },
          interview: {
            flashcardFeedback:
              (payload.state.interview?.flashcardFeedback as Record<string, "hard" | "easy">) ?? defaultDashboardState.interview.flashcardFeedback,
          },
          jdScanner: {
            text: payload.state.jdScanner?.text ?? defaultDashboardState.jdScanner.text,
          },
          overview: {
            taskChecked: (payload.state.overview?.taskChecked as Record<number, boolean>) ?? defaultDashboardState.overview.taskChecked,
          },
        };

        setActiveTab(nextState.ui.activeTab);
        setPostingQuery(nextState.ui.postingQuery);
        setPostingCompanyFilter(nextState.ui.postingCompanyFilter);
        setSelectedCompanyId(nextState.ui.selectedCompanyId);
        setSelectedOfferA(nextState.ui.selectedOfferA);
        setSelectedOfferB(nextState.ui.selectedOfferB);
        setPortfolioSubTab(nextState.ui.portfolioSubTab);
        setSelectedChecklistPostingId(nextState.ui.selectedChecklistPostingId);
        setSelectedEssayId(nextState.ui.selectedEssayId);
        setIndustryFilter(nextState.ui.industryFilter);
        setFlashcardMode(nextState.ui.flashcardMode);
        setActiveFlashcardIndex(nextState.ui.activeFlashcardIndex);
        setSelectedScheduleId(nextState.ui.selectedScheduleId);
        setSelectedCoverLetterName(nextState.ui.selectedCoverLetterName);
        setRouteOrigin(nextState.location.routeOrigin);
        setRouteDestination(nextState.location.routeDestination);
        setCompanyCommuteNotes(nextState.location.companyCommuteNotes);
        setApplicationChecklists(nextState.checklists.applicationChecklists);
        setFlashcardFeedback(nextState.interview.flashcardFeedback);
        setJdScan((current) => ({ ...current, text: nextState.jdScanner.text, phase: "idle" }));
        setTaskChecked(nextState.overview.taskChecked);

        setDashboardStateSync({
          phase: "idle",
          message: null,
          lastSavedAt: payload.savedAt ?? null,
        });
      } catch (error) {
        setDashboardStateSync({
          phase: "error",
          message: error instanceof Error ? error.message : "대시보드 상태 로드 중 오류가 발생했습니다.",
          lastSavedAt: null,
        });
      }
    })();
  }, []);

  const syncCoverLetterFiles = async (preferredName?: string | null) => {
    setCoverLetterSync((current) => ({
      ...current,
      phase: "loading",
      message: null,
    }));

    try {
      const payload = (await window.desktopAPI.coverletters.list()) as { files?: CoverLetterRecord[]; error?: string };
      if (!payload.files) {
        throw new Error(payload.error || "자소서 폴더 스캔에 실패했습니다.");
      }

      setCoverLetterFiles(payload.files);
      setCoverLetterSync({
        phase: "idle",
        message: null,
        lastSyncedAt: getIsoNow(),
      });

      const nextName =
        preferredName && payload.files.some((file) => file.name === preferredName)
          ? preferredName
          : selectedCoverLetterName && payload.files.some((file) => file.name === selectedCoverLetterName)
            ? selectedCoverLetterName
            : payload.files[0]?.name ?? null;

      setSelectedCoverLetterName(nextName);
      if (!nextName) {
        const company = companyTargetsSeed.find((item) => item.id === selectedCompanyId);
        const posting = jobPostingsSeed.find((item) => item.targetCompanyId === selectedCompanyId);
        setCoverLetterDraft(buildEmptyCoverLetterDraft(company, posting ? { ...posting, priority: 0, daysLeft: 0 } : undefined));
      }
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: error instanceof Error ? error.message : "자소서 폴더 동기화 중 오류가 발생했습니다.",
        lastSyncedAt: null,
      });
    }
  };

  const loadCoverLetterFile = async (name: string) => {
    setCoverLetterSync((current) => ({
      ...current,
      phase: "loading",
      message: null,
    }));

    try {
      const payload = (await window.desktopAPI.coverletters.read(name)) as {
        file?: CoverLetterRecord;
        content?: string;
        meta?: Partial<CoverLetterMeta>;
        error?: string;
      };

      if (!payload.file || typeof payload.content !== "string" || !payload.meta) {
        throw new Error(payload.error || "자소서 파일을 불러오지 못했습니다.");
      }

      setCoverLetterDraft({
        originalName: payload.file.name,
        meta: {
          year: String(payload.meta.year ?? "2026"),
          companyId: String(payload.meta.companyId ?? ""),
          companyName: String(payload.meta.companyName ?? ""),
          companySlug: String(payload.meta.companySlug ?? ""),
          jobTrack: String(payload.meta.jobTrack ?? ""),
          docType: String(payload.meta.docType ?? "cover-letter"),
          updatedAt: String(payload.meta.updatedAt ?? getIsoNow()),
          title: String(payload.meta.title ?? payload.file.title ?? ""),
          status: String(payload.meta.status ?? payload.file.status ?? "draft"),
          tags: Array.isArray(payload.meta.tags) ? payload.meta.tags.join(", ") : "",
        },
        content: payload.content,
      });
      setCoverLetterSync({
        phase: "idle",
        message: null,
        lastSyncedAt: getIsoNow(),
      });
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: error instanceof Error ? error.message : "자소서 파일 로드 중 오류가 발생했습니다.",
        lastSyncedAt: null,
      });
    }
  };

  const saveCoverLetterFile = async () => {
    setCoverLetterSync((current) => ({
      ...current,
      phase: "saving",
      message: null,
    }));

    try {
      const payload = (await window.desktopAPI.coverletters.save({
        originalName: coverLetterDraft.originalName,
        meta: {
          ...coverLetterDraft.meta,
          tags: coverLetterDraft.meta.tags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          updatedAt: getIsoNow(),
        },
        content: coverLetterDraft.content,
      })) as {
        savedName?: string;
        files?: CoverLetterRecord[];
        detail?: { file: CoverLetterRecord; content: string; meta: Partial<CoverLetterMeta> };
        error?: string;
      };

      if (!payload.savedName || !payload.files || !payload.detail) {
        throw new Error(payload.error || "자소서 저장에 실패했습니다.");
      }

      setCoverLetterFiles(payload.files);
      setSelectedCoverLetterName(payload.savedName);
      setCoverLetterDraft({
        originalName: payload.detail.file.name,
        meta: {
          year: String(payload.detail.meta.year ?? coverLetterDraft.meta.year),
          companyId: String(payload.detail.meta.companyId ?? coverLetterDraft.meta.companyId),
          companyName: String(payload.detail.meta.companyName ?? coverLetterDraft.meta.companyName),
          companySlug: String(payload.detail.meta.companySlug ?? coverLetterDraft.meta.companySlug),
          jobTrack: String(payload.detail.meta.jobTrack ?? coverLetterDraft.meta.jobTrack),
          docType: String(payload.detail.meta.docType ?? coverLetterDraft.meta.docType),
          updatedAt: String(payload.detail.meta.updatedAt ?? getIsoNow()),
          title: String(payload.detail.meta.title ?? coverLetterDraft.meta.title),
          status: String(payload.detail.meta.status ?? coverLetterDraft.meta.status),
          tags: Array.isArray(payload.detail.meta.tags) ? payload.detail.meta.tags.join(", ") : coverLetterDraft.meta.tags,
        },
        content: payload.detail.content,
      });
      setCoverLetterSync({
        phase: "idle",
        message: "저장 완료",
        lastSyncedAt: getIsoNow(),
      });
    } catch (error) {
      setCoverLetterSync({
        phase: "error",
        message: error instanceof Error ? error.message : "자소서 저장 중 오류가 발생했습니다.",
        lastSyncedAt: null,
      });
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        const payload = (await window.desktopAPI.coverletters.getConfig()) as CoverLetterConfig;
        if (payload) {
          setCoverLetterConfig(payload);
        }
      } catch {
        // Ignore config fetch errors here; list sync will surface actionable errors.
      }
      await syncCoverLetterFiles();
    })();
  }, []);

  useEffect(() => {
    if (!selectedCoverLetterName) {
      return;
    }
    void loadCoverLetterFile(selectedCoverLetterName);
  }, [selectedCoverLetterName]);

  const contributionGrid = useMemo(() => buildContributionGrid(15, 7), []);
  const portfolioKeywordSet = useMemo(() => {
    const values = [
      ...portfolioSeed.skills.map((item) => item.name),
      ...portfolioSeed.learningSkills.map((item) => item.name),
      ...portfolioSeed.coursework.flatMap((item) => item.tags),
      ...portfolioSeed.studyProjects.map((item) => item.tech),
      ...portfolioSeed.projects.flatMap((item) => item.tech),
      ...Object.values(companyDetailsSeed).flatMap((item) => item.techStack),
    ];
    return new Set(values.map((value) => normalizeKeyword(value)));
  }, []);

  const companyOptions = useMemo(() => Array.from(new Set(jobPostingsSeed.map((posting) => posting.company))), []);
  const allPostings = useMemo<EnrichedPosting[]>(() => {
    return jobPostingsSeed
      .map((posting) => ({ ...posting, priority: computePriority(posting), daysLeft: getDaysLeft(posting.deadline) }))
      .sort((a, b) => b.priority - a.priority);
  }, []);
  const enrichedPostings = useMemo<EnrichedPosting[]>(() => {
    return allPostings
      .filter((posting) => {
        const matchesCompany = postingCompanyFilter === "all" ? true : posting.company === postingCompanyFilter;
        const normalizedQuery = postingQuery.trim().toLowerCase();
        const matchesQuery =
          !normalizedQuery ||
          posting.company.toLowerCase().includes(normalizedQuery) ||
          posting.title.toLowerCase().includes(normalizedQuery) ||
          posting.role.toLowerCase().includes(normalizedQuery) ||
          posting.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery));
        return matchesCompany && matchesQuery;
      })
      .sort((a, b) => b.priority - a.priority);
  }, [allPostings, postingCompanyFilter, postingQuery]);

  const topTasks = useMemo(() => enrichedPostings.slice(0, 5), [enrichedPostings]);
  const urgentPostings = useMemo(() => enrichedPostings.filter((posting) => posting.daysLeft <= 7).slice(0, 4), [enrichedPostings]);
  const selectedCompany = useMemo(() => companyTargetsSeed.find((company) => company.id === selectedCompanyId) ?? companyTargetsSeed[0], [selectedCompanyId]);
  useEffect(() => {
    setRouteSearchError(null);
    setRouteDestination((current) => {
      if (previousSelectedCompanyIdRef.current === null) {
        previousSelectedCompanyIdRef.current = selectedCompanyId;
        return current || selectedCompany.name;
      }
      if (previousSelectedCompanyIdRef.current !== selectedCompanyId) {
        previousSelectedCompanyIdRef.current = selectedCompanyId;
        return selectedCompany.name;
      }
      return current;
    });
  }, [selectedCompany.name, selectedCompanyId]);
  const selectedCompanyCommuteNote = companyCommuteNotes[selectedCompanyId] ?? buildEmptyCommuteNote();
  const updateSelectedCompanyCommuteNote = (nextNote: CommuteNote) => {
    setCompanyCommuteNotes((current) => ({
      ...current,
      [selectedCompanyId]: nextNote,
    }));
    setDashboardStateSync((current) => ({
      ...current,
      message: null,
    }));
  };
  const selectedCompanyDetail = useMemo(
    () =>
      companyDetailsSeed[selectedCompanyId] ?? {
        description: "해당 기업에 대한 세부 분석 데이터는 아직 보강 중입니다.",
        roleDescription: "핵심 직무 상세는 준비 중이며, 채용 공고 기준 요구 역량 중심으로 정리 가능합니다.",
        techStack: ["Verilog", "SystemVerilog", "RTL Design"],
        news: ["관련 최신 메모를 추가하면 이 영역이 더 풍부해집니다."],
      },
    [selectedCompanyId],
  );
  const relatedPostings = useMemo(() => enrichedPostings.filter((posting) => posting.targetCompanyId === selectedCompanyId), [enrichedPostings, selectedCompanyId]);
  const filteredIndustryNews = useMemo(() => (industryFilter === "All" ? industryNewsSeed : industryNewsSeed.filter((news) => news.tag === industryFilter)), [industryFilter]);
  const orderedFlashcards = useMemo(() => (flashcardMode === "default" ? flashcardsSeed : [...flashcardsSeed].sort((a, b) => getStableSortScore(a.q) - getStableSortScore(b.q))), [flashcardMode]);
  const jdScanResult = useMemo(() => analyzeJdText(jdScan.text, portfolioKeywordSet), [jdScan.text, portfolioKeywordSet]);
  const selectedCoverLetterRecord = useMemo(
    () => coverLetterFiles.find((file) => file.name === selectedCoverLetterName) ?? null,
    [coverLetterFiles, selectedCoverLetterName],
  );
  const companyCoverLetters = useMemo(
    () => coverLetterFiles.filter((file) => file.companyId === selectedCompanyId),
    [coverLetterFiles, selectedCompanyId],
  );
  const checklistPostings = useMemo(
    () =>
      allPostings.map((posting) => {
        const items = applicationChecklists[posting.id] ?? [];
        const doneCount = items.filter((item) => item.done).length;
        const blockedCount = items.filter((item) => item.blocked).length;
        return {
          ...posting,
          checklistItems: items,
          checklistProgress: items.length === 0 ? 0 : Math.round((doneCount / items.length) * 100),
          blockedCount,
        };
      }),
    [allPostings, applicationChecklists],
  );
  const selectedChecklistPosting = useMemo(
    () => checklistPostings.find((posting) => posting.id === selectedChecklistPostingId) ?? checklistPostings[0] ?? null,
    [checklistPostings, selectedChecklistPostingId],
  );
  const selectedEssay = useMemo(() => essayQuestionsSeed.find((question) => question.id === selectedEssayId) ?? essayQuestionsSeed[0], [selectedEssayId]);
  const recommendedExperiences = useMemo(
    () => selectedEssay.linkedExperienceIds.map((id) => experienceLibrarySeed.find((item) => item.id === id)).filter((item): item is ExperienceItem => Boolean(item)),
    [selectedEssay],
  );
  const sortedCompanyTargets = useMemo(() => [...companyTargetsSeed].sort((a, b) => b.preference + b.fit - (a.preference + a.fit)), []);
  const sortedSchedule = useMemo(() => [...scheduleSeed].sort((a, b) => a.date - b.date || a.time.localeCompare(b.time)), []);
  const selectedScheduleEvent = useMemo(() => sortedSchedule.find((event) => event.id === selectedScheduleId) ?? sortedSchedule[0], [selectedScheduleId, sortedSchedule]);
  const calendarEvents = useMemo(
    () =>
      sortedSchedule.map((event) => {
        const start = new Date(CALENDAR_YEAR, CALENDAR_MONTH_INDEX, event.date);
        const [hours, minutes] = event.time.split(":").map(Number);
        start.setHours(hours, minutes, 0, 0);
        const end = new Date(start);
        end.setHours(start.getHours() + (event.type === "interview" ? 1 : 0), start.getMinutes() + (event.type === "deadline" ? 30 : 0));

        const palette =
          event.type === "interview"
            ? { bg: "#7c3aed", border: "#7c3aed" }
            : event.type === "deadline"
              ? { bg: "#e11d48", border: "#e11d48" }
              : event.type === "test"
                ? { bg: "#0284c7", border: "#0284c7" }
                : { bg: "#f59e0b", border: "#f59e0b" };

        return {
          id: String(event.id),
          title: event.title,
          start,
          end,
          extendedProps: {
            originalEvent: event,
            company: event.company,
          },
          backgroundColor: palette.bg,
          borderColor: palette.border,
        };
      }),
    [sortedSchedule],
  );
  const analyticsInsights = useMemo(() => {
    const strongest = sortedCompanyTargets[0];
    const urgent = urgentPostings[0];
    const riskiestChecklist = [...checklistPostings]
      .filter((posting) => posting.checklistProgress < 100 || posting.blockedCount > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft || a.checklistProgress - b.checklistProgress)[0];
    const missingJd = jdScanResult.missing[0];
    return [
      `가장 집중할 타겟은 ${strongest.name}이며, 선호도와 적합도가 동시에 높습니다.`,
      urgent ? `즉시 대응 과제는 ${urgent.company}이며 마감까지 ${urgent.daysLeft}일 남았습니다.` : "즉시 대응 과제가 없습니다.",
      riskiestChecklist ? `${riskiestChecklist.company}은 체크리스트 ${riskiestChecklist.checklistProgress}% 완료 상태이며 제출 전 점검이 더 필요합니다.` : "체크리스트 기준 위험 공고가 없습니다.",
      missingJd ? `JD 키워드 중 '${missingJd}'는 포트폴리오 표기 보강이 필요합니다.` : "JD 키워드 커버리지는 현재 양호합니다.",
    ];
  }, [checklistPostings, jdScanResult.missing, sortedCompanyTargets, urgentPostings]);
  const selectedCompanySlug = companySlugSeed[selectedCompanyId] ?? coverLetterSlugify(selectedCompany.name);
  const selectedCompanyPosting = relatedPostings[0];
  const selectedCoverLetterLinked = selectedCoverLetterRecord?.companyId === selectedCompanyId;

  const offerKeys = Object.keys(offerProfilesSeed);
  const offerProfileA = offerProfilesSeed[selectedOfferA] ?? offerProfilesSeed[offerKeys[0]];
  const offerProfileB = offerProfilesSeed[selectedOfferB] ?? offerProfilesSeed[offerKeys[1]];

  const activeMeta = {
    overview: { title: "Executive Overview", subtitle: "2026 하드웨어 커리어 인텔리전스 대시보드" },
    industry: { title: "Industry News Radar", subtitle: "반도체 생태계와 시장 이슈를 한 화면에서 추적" },
    kanban: { title: "Application Process Kanban", subtitle: "기업별 채용 단계와 현재 상태를 칸반 구조로 정리" },
    strategy: { title: "Target Strategy", subtitle: "선호도와 합격 가능성을 동시에 보는 포트폴리오 분배판" },
    company: { title: "Company Deep Dive", subtitle: "기업 개요, 직무, 요구 기술과 최근 이슈를 한 번에 확인" },
    jdscanner: { title: "JD Keyword Scanner", subtitle: "공고 텍스트와 내 역량 키워드의 연결 정도를 로컬 분석" },
    offer: { title: "Offer Comparer", subtitle: "복수 오퍼 상황에서 보상, 성장성, 위치를 같은 축으로 비교" },
    location: { title: "Location Insights", subtitle: "근무지, 지역 특성, 지도 정보를 함께 보는 위치 패널" },
    portfolio: { title: "Portfolio & Academics", subtitle: "프로젝트, 학업, 학습 로그를 직무 맥락으로 묶은 자산 뷰" },
    checklist: { title: "Application Checklist", subtitle: "제출 직전 누락 요소와 블로커를 공고별로 관리하는 체크리스트" },
    interview: { title: "Interview Flashcards", subtitle: "전공 면접 대비를 위한 Q&A와 답변 상태 관리" },
    calendar: { title: "Monthly Schedule", subtitle: "3월 일정과 전형 이벤트를 선택 가능한 캘린더로 정리" },
    coverletters: { title: "Cover Letter Viewer", subtitle: "지원서 문서를 파일 단위로 빠르게 검토하는 뷰어" },
  }[activeTab];
  const overviewContent = (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="p-5">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Pill className="border-slate-900 bg-slate-900 text-white">Merged Prototype</Pill>
                <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">Hardware Career BI</Pill>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">이번 주 우선 액션과 전체 지원 흐름</h2>
              <p className="mt-1 text-sm text-slate-500">검색/필터, 우선순위 계산, 일정 리스크를 같은 카드 흐름으로 묶었습니다.</p>
            </div>
            <div className="grid gap-3 md:w-[360px]">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={postingQuery} onChange={(event) => setPostingQuery(event.target.value)} placeholder="기업명, 직무명, 키워드 검색" className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-cyan-300" />
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select value={postingCompanyFilter} onChange={(event) => setPostingCompanyFilter(event.target.value)} className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-cyan-300">
                    <option value="all">전체 기업</option>
                    {companyOptions.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => { setPostingQuery(""); setPostingCompanyFilter("all"); }} className="rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                  초기화
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpiMetrics.map((metric) => (
              <KpiCard key={metric.label} metric={metric} />
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">오늘 처리할 TOP 5</h3>
            <p className="mt-1 text-sm text-slate-500">우선순위, 마감, 준비도 기준으로 정렬된 액션입니다.</p>
          </div>
          <div className="space-y-3">
            {topTasks.map((task, index) => (
              <div key={task.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <button type="button" onClick={() => setTaskChecked((current) => ({ ...current, [task.id]: !current[task.id] }))} className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px]", taskChecked[task.id] ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-transparent")}>
                    ✓
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill className="border-slate-200 bg-slate-100 text-slate-700">#{index + 1}</Pill>
                      <span className={cn("text-sm font-semibold text-slate-800", taskChecked[task.id] && "line-through text-slate-400")}>{getTaskTitle(task)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <Pill className="border-slate-200 bg-slate-100 text-slate-700">{task.company}</Pill>
                      <Pill className="border-amber-200 bg-amber-50 text-amber-700">우선순위 {task.priority}</Pill>
                      <Pill className="border-rose-200 bg-rose-50 text-rose-700">D-{task.daysLeft}</Pill>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{task.summary}</p>
                  </div>
                  {taskChecked[task.id] ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : null}
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">채용 단계 전환률</h3>
            <p className="mt-1 text-sm text-slate-500">현재 지원 흐름에서 어디가 병목인지 한눈에 봅니다.</p>
          </div>
          <FunnelChart data={funnelData} />
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">주요 액티브 파이프라인</h3>
            <p className="mt-1 text-sm text-slate-500">전형별 진도와 다음 이벤트 시점을 함께 표시합니다.</p>
          </div>
          <div className="space-y-3">
            {activePipelinesSeed.map((pipeline, index) => (
              <PipelineBar key={`${pipeline.company}-${pipeline.stage}`} label={pipeline.company} stage={pipeline.stage} progress={pipeline.progress} expectedDate={pipeline.expectedDate} colorHex={index % 2 === 0 ? "#10b981" : "#64748b"} />
            ))}
          </div>
        </SurfaceCard>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
        <SurfaceCard className="p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">핵심 역량 준비도</h3>
            <p className="mt-1 text-sm text-slate-500">직무 기대치 대비 현재 스택과 학습 진행 상황입니다.</p>
          </div>
          <div className="flex flex-wrap items-end justify-around gap-4">
            {competencyMetrics.map((metric) => (
              <SemiCircleGauge key={metric.label} value={metric.value} target={metric.target} label={metric.label} colorHex={metric.color} />
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">임박 공고 및 전형</h3>
              <p className="mt-1 text-sm text-slate-500">7일 이내 대응해야 하는 항목만 추렸습니다.</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="space-y-3">
            {urgentPostings.map((posting) => (
              <div key={posting.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{posting.company}</p>
                    <p className="mt-1 text-sm text-slate-500">{posting.title}</p>
                  </div>
                  <Pill className="border-rose-200 bg-rose-50 text-rose-700">D-{posting.daysLeft}</Pill>
                </div>
                <p className="mt-3 text-sm text-slate-600">{posting.summary}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">이번 주 관찰 포인트</h3>
            <p className="mt-1 text-sm text-slate-500">지금 상태에서 바로 행동으로 옮길 만한 인사이트입니다.</p>
          </div>
          <div className="space-y-3">
            {analyticsInsights.map((insight) => (
              <div key={insight} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">{insight}</div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );

  const industryContent = (
    <div className="space-y-6">
      <SurfaceCard className="p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Industry Radar</h2>
            <p className="mt-1 text-sm text-slate-500">태그 필터를 기준으로 관심 뉴스만 추려봅니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Foundry", "AI 반도체", "Memory", "EDA", "Architecture"].map((tag) => (
              <button key={tag} type="button" onClick={() => setIndustryFilter(tag)} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold transition", industryFilter === tag ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredIndustryNews.map((news) => (
            <article key={news.id} className="group flex flex-col rounded-3xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", getNewsTone(news.tag))}>{news.tag}</span>
                <ExternalLink className="h-4 w-4 text-slate-300 transition group-hover:text-cyan-600" />
              </div>
              <h3 className="mb-4 text-lg font-bold leading-snug text-slate-900">{news.title}</h3>
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5"><Newspaper className="h-3.5 w-3.5" />{news.source}</span>
                <span>{news.date}</span>
              </div>
            </article>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );

  const kanbanContent = (
    <div className="space-y-6">
      <SurfaceCard className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Application Pipeline Board</h2>
            <p className="mt-1 text-sm text-slate-500">선택 기업은 strategy, company, location 탭과 같은 기준 엔티티를 공유합니다.</p>
          </div>
          <Pill className="border-slate-200 bg-slate-100 text-slate-700">정적 프로토타입 · 드래그 없음</Pill>
        </div>
        <ScrollArea axis="x" className="pb-2">
          <div className="flex gap-4">
            {kanbanColumns.map((column) => {
              const items = companyTargetsSeed.filter((company) => company.stage === column.id);
              return (
                <div key={column.id} className={cn("w-72 shrink-0 rounded-3xl border-t-4 border-x border-b border-slate-200 shadow-sm", column.accent, column.bg)}>
                  <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-700">{column.title}</h3>
                    <Pill className="border-slate-200 bg-white text-slate-600">{items.length}</Pill>
                  </div>
                  <div className="space-y-3 p-3">
                    {items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm text-slate-400">현재 항목 없음</div> : null}
                    {items.map((company) => (
                      <button key={company.id} type="button" onClick={() => setSelectedCompanyId(company.id)} className={cn("w-full rounded-2xl border bg-white p-4 text-left transition hover:shadow-md", selectedCompanyId === company.id ? "border-cyan-300 shadow-md" : "border-slate-200")}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-800">{company.name}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{company.location}</p>
                          </div>
                          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", getCompanyTypeTone(company.type))}>{company.type}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                          <span>선호도 {company.preference}%</span>
                          <span>적합도 {company.fit}%</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SurfaceCard>
    </div>
  );
  const strategyContent = (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <SurfaceCard className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">타겟 기업 우선순위 매트릭스</h3>
          <p className="mt-1 text-sm text-slate-500">선호도와 합격 가능성을 동시에 보고 리소스 분배를 결정합니다.</p>
        </div>
        <div className="px-8 pb-8">
          <StrategyMatrix data={companyTargetsSeed} selectedId={selectedCompanyId} onSelect={setSelectedCompanyId} />
        </div>
      </SurfaceCard>
      <div className="grid gap-6">
        <SurfaceCard className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">선택 기업 스냅샷</h3>
              <p className="mt-1 text-sm text-slate-500">strategy, company, location 탭이 같은 선택 상태를 공유합니다.</p>
            </div>
            <span className={cn("rounded-full border px-2.5 py-1 text-xs font-bold", getCompanyTypeTone(selectedCompany.type))}>{selectedCompany.type}</span>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xl font-black text-slate-900">{selectedCompany.name}</h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-4 w-4" />{selectedCompany.location}</p>
                </div>
                <Pill className="border-slate-200 bg-white text-slate-700">{selectedCompany.status}</Pill>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-500">적합도</span><span className="font-semibold text-slate-800">{selectedCompany.fit}%</span></div>
                  <ProgressBar value={selectedCompany.fit} color="#0ea5e9" />
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-500">선호도</span><span className="font-semibold text-slate-800">{selectedCompany.preference}%</span></div>
                  <ProgressBar value={selectedCompany.preference} color="#4f46e5" />
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {analyticsInsights.slice(0, 2).map((insight) => (
                <div key={insight} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">{insight}</div>
              ))}
            </div>
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">주차별 지원 및 통과 트렌드</h3>
            <p className="mt-1 text-sm text-slate-500">막대는 지원 횟수, 라인은 서류 합격 흐름입니다.</p>
          </div>
          <div className="relative flex h-64 items-end justify-between border-b border-slate-200 px-4 pb-8">
            {weeklyTrendSeed.map((item) => (
              <div key={item.week} className="group relative flex h-full w-full flex-col items-center justify-end">
                <div className="absolute z-10 mb-2 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" style={{ bottom: `${item.passes * 20 + 28}px` }} />
                <div className="w-7 rounded-t border-t-2 border-indigo-400 bg-indigo-100 transition group-hover:bg-indigo-200" style={{ height: `${item.applications * 14}px` }} />
                <span className="absolute -bottom-6 text-xs font-medium text-slate-500">{item.week}</span>
              </div>
            ))}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path d="M 40 208 L 128 188 L 216 168 L 304 148 L 392 168 L 480 188 L 568 208 L 656 188" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="mt-10 flex justify-center gap-6 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border-t-2 border-indigo-400 bg-indigo-200" />지원 횟수</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" />서류 합격</span>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );

  const companyContent = (
    <div className="grid min-h-[720px] gap-6 xl:grid-cols-[0.34fr_0.66fr]">
      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><h3 className="font-bold text-slate-900">분석 대상 기업 리스트</h3></div>
        <div className="space-y-2 p-3">
          {sortedCompanyTargets.map((company) => (
            <button key={company.id} type="button" onClick={() => setSelectedCompanyId(company.id)} className={cn("flex w-full items-center justify-between rounded-2xl border p-4 text-left transition", selectedCompanyId === company.id ? "border-cyan-300 bg-cyan-50/50 shadow-sm" : "border-transparent hover:bg-slate-50")}>
              <div>
                <p className="text-lg font-semibold text-slate-800">{company.name}</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500"><MapPin className="h-3.5 w-3.5" />{company.location}</p>
              </div>
              <div className="text-right">
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", getCompanyTypeTone(company.type))}>{company.type}</span>
                <p className="mt-2 text-xs font-bold text-slate-600">선호도 {company.preference}%</p>
              </div>
            </button>
          ))}
        </div>
      </SurfaceCard>
      <SurfaceCard className="overflow-hidden">
        <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-8 py-8">
          <div className="absolute -right-6 -top-6 opacity-5"><Building2 className="h-64 w-64" /></div>
          <div className="relative z-10">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900">{selectedCompany.name}</h2>
              <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">HW Design / Verification</Pill>
            </div>
            <p className="text-sm text-slate-500">{selectedCompany.status} · {selectedCompany.location}</p>
          </div>
        </div>
        <div className="space-y-8 p-8">
          <section>
            <h3 className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-bold text-slate-800"><Building2 className="h-5 w-5 text-blue-500" />기업 개요</h3>
            <p className="text-sm leading-relaxed text-slate-600">{selectedCompanyDetail.description}</p>
          </section>
          <section>
            <h3 className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-bold text-slate-800"><Briefcase className="h-5 w-5 text-emerald-500" />직무 상세</h3>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">{selectedCompanyDetail.roleDescription}</div>
          </section>
          <section>
            <h3 className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-bold text-slate-800"><Code2 className="h-5 w-5 text-indigo-500" />핵심 요구 기술</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCompanyDetail.techStack.map((tech) => (
                <Pill key={tech} className="border-indigo-200 bg-indigo-50 text-indigo-700">{tech}</Pill>
              ))}
            </div>
          </section>
          <section>
            <h3 className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-bold text-slate-800"><Newspaper className="h-5 w-5 text-amber-500" />최근 동향 및 뉴스</h3>
            <div className="space-y-3">
              {selectedCompanyDetail.news.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" /><span>{item}</span></div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-bold text-slate-800"><FileText className="h-5 w-5 text-cyan-500" />연관 공고와 연결 경험</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                {relatedPostings.map((posting) => (
                  <div key={posting.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div><p className="font-semibold text-slate-800">{posting.title}</p><p className="mt-1 text-sm text-slate-500">{posting.role}</p></div>
                      <Pill className={cn("border-transparent", getStageTone(posting.stage))}>{posting.stage}</Pill>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{posting.summary}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {experienceLibrarySeed.filter((experience) => experience.companies.includes(selectedCompany.name)).slice(0, 3).map((experience) => (
                  <div key={experience.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-semibold text-slate-800">{experience.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{experience.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {experience.strengths.map((strength) => (
                        <Pill key={strength} className="border-slate-200 bg-slate-100 text-slate-700">{strength}</Pill>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section>
            <h3 className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-bold text-slate-800"><FolderOpen className="h-5 w-5 text-blue-500" />관련 자소서</h3>
            {companyCoverLetters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                현재 이 기업과 연결된 md 자소서가 없습니다. Cover Letter 탭에서 메타를 맞춰 저장하면 자동으로 연결됩니다.
              </div>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {companyCoverLetters.map((file) => (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => {
                      setActiveTab("coverletters");
                      setSelectedCoverLetterName(file.name);
                    }}
                    className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-cyan-300 hover:bg-cyan-50/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">{file.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{file.name}</p>
                      </div>
                      <Pill className={cn("border-slate-200 bg-slate-100 text-slate-700", file.isValid ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
                        {file.isValid ? "연결됨" : "규칙 확인 필요"}
                      </Pill>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Pill className="border-slate-200 bg-white text-slate-700">{file.jobTrack}</Pill>
                      <Pill className="border-slate-200 bg-white text-slate-700">{file.docType}</Pill>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </SurfaceCard>
    </div>
  );

  const jdScannerContent = (
    <div className="grid min-h-[720px] gap-6 lg:grid-cols-2">
      <SurfaceCard className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h3 className="flex items-center gap-2 font-bold text-slate-800"><FileText className="h-5 w-5 text-slate-500" />채용 공고 텍스트 붙여넣기</h3>
          <div className="flex gap-2">
            <button type="button" onClick={() => { if (!jdScan.text.trim()) return; setJdScan((current) => ({ ...current, phase: "loading" })); }} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              {jdScan.phase === "loading" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}분석하기
            </button>
            <button type="button" onClick={() => setJdScan((current) => ({ ...current, phase: "idle" }))} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">결과 초기화</button>
          </div>
        </div>
        <textarea value={jdScan.text} onChange={(event) => setJdScan({ text: event.target.value, phase: "idle" })} className="min-h-[520px] flex-1 resize-none bg-slate-50/70 p-5 text-sm leading-relaxed text-slate-700 outline-none" placeholder="공고 본문을 붙여넣으면 키워드를 로컬 분석합니다." />
      </SurfaceCard>
      <SurfaceCard className="flex flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><h3 className="flex items-center gap-2 font-bold text-slate-800"><Sparkles className="h-5 w-5 text-emerald-500" />Resume Mapper 결과</h3></div>
        <ScrollArea className="flex-1 p-6">
          {jdScan.phase === "idle" ? <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-3 text-center text-slate-400"><Search className="h-12 w-12 opacity-30" /><p className="text-sm font-medium">분석 버튼을 누르면 키워드 커버리지와 보완 항목을 정리합니다.</p></div> : null}
          {jdScan.phase === "loading" ? <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-3 text-center text-blue-500"><RefreshCw className="h-10 w-10 animate-spin" /><p className="text-sm font-semibold">JD 키워드 스캔 중...</p></div> : null}
          {jdScan.phase === "result" ? (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-500">종합 매칭 점수</p>
                <div className="mt-2 inline-flex items-end gap-1"><span className="text-5xl font-black text-emerald-600">{jdScanResult.coverage}</span><span className="mb-1 text-xl font-bold text-slate-400">%</span></div>
                <div className="mx-auto mt-4 max-w-sm"><ProgressBar value={jdScanResult.coverage} color="#10b981" /></div>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><CheckCircle2 className="h-4 w-4 text-emerald-500" />공고에서 추출된 키워드</h4>
                <div className="flex flex-wrap gap-2">{jdScanResult.extracted.map((keyword) => <Pill key={keyword} className="border-slate-200 bg-slate-100 text-slate-700">{keyword}</Pill>)}</div>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><CheckCircle2 className="h-4 w-4 text-emerald-500" />이미 매칭되는 역량</h4>
                <div className="flex flex-wrap gap-2">{jdScanResult.matched.map((keyword) => <Pill key={keyword} className="border-emerald-200 bg-emerald-50 text-emerald-700">{keyword}</Pill>)}</div>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><AlertTriangle className="h-4 w-4 text-rose-500" />보강이 필요한 키워드</h4>
                <div className="flex flex-wrap gap-2">{jdScanResult.missing.length === 0 ? <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">추가 보강 없이도 커버 중</Pill> : jdScanResult.missing.map((keyword) => <Pill key={keyword} className="border-rose-200 bg-rose-50 text-rose-700">{keyword}</Pill>)}</div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{jdScanResult.recommendation}</div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-800">추천 연결 경험</p>
                  <div className="mt-3 space-y-3">{recommendedExperiences.map((experience) => <div key={experience.id} className="rounded-2xl bg-slate-50 p-3"><p className="font-medium text-slate-800">{experience.title}</p><p className="mt-1 text-sm text-slate-600">{experience.result}</p></div>)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-800">연결할 자소서 문항</p>
                  <p className="mt-3 text-sm text-slate-600">{selectedEssay.question}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill className="border-amber-200 bg-amber-50 text-amber-700">{selectedEssay.company}</Pill>
                    <Pill className="border-slate-200 bg-slate-100 text-slate-700">{selectedEssay.type}</Pill>
                    <Pill className="border-slate-200 bg-slate-100 text-slate-700">{selectedEssay.limit}자</Pill>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </SurfaceCard>
    </div>
  );

  const offerContent = (
    <div className="mx-auto max-w-6xl space-y-6">
      <SurfaceCard className="p-6">
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:justify-center">
          <div className="grid gap-1">
            <label className="text-xs font-bold text-blue-600">회사 A</label>
            <select value={selectedOfferA} onChange={(event) => setSelectedOfferA(event.target.value)} className="min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400">
              {offerKeys.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xl font-black italic text-slate-300">VS</div>
          <div className="grid gap-1">
            <label className="text-xs font-bold text-emerald-600">회사 B</label>
            <select value={selectedOfferB} onChange={(event) => setSelectedOfferB(event.target.value)} className="min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-400">
              {offerKeys.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
            <RadarChart data1={offerProfileA} data2={offerProfileB} color1="#3b82f6" color2="#10b981" />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left text-xs font-medium text-slate-400">항목</th>
                  <th className="py-2 text-right text-xs font-bold text-blue-600">{selectedOfferA}</th>
                  <th className="py-2 text-right text-xs font-bold text-emerald-600">{selectedOfferB}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                <tr><td className="py-3 font-medium text-slate-600">기본급</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileA.base}</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileB.base}</td></tr>
                <tr><td className="py-3 font-medium text-slate-600">보너스</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileA.bonus}</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileB.bonus}</td></tr>
                <tr><td className="py-3 font-medium text-slate-600">연봉/보상</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileA.salary}점</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileB.salary}점</td></tr>
                <tr><td className="py-3 font-medium text-slate-600">워라밸</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileA.wlb}점</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileB.wlb}점</td></tr>
                <tr><td className="py-3 font-medium text-slate-600">성장성</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileA.growth}점</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileB.growth}점</td></tr>
                <tr><td className="py-3 font-medium text-slate-600">위치/출퇴근</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileA.location}점</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileB.location}점</td></tr>
                <tr><td className="py-3 font-medium text-slate-600">조직문화</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileA.culture}점</td><td className="py-3 text-right font-bold text-slate-800">{offerProfileB.culture}점</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );

  const locationContent = (
    <div className="grid gap-6 xl:grid-cols-[0.36fr_0.64fr]">
      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><h3 className="font-bold text-slate-900">목록에서 선택</h3></div>
        <div className="space-y-2 p-4">
          {companyTargetsSeed.map((company) => (
            <button key={company.id} type="button" onClick={() => setSelectedCompanyId(company.id)} className={cn("w-full rounded-2xl border p-4 text-left transition", selectedCompanyId === company.id ? "border-cyan-300 bg-cyan-50/50 shadow-sm" : "border-transparent hover:bg-slate-50")}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800">{company.name}</span>
                  {hasCommuteNoteContent(companyCommuteNotes[company.id] ?? buildEmptyCommuteNote()) ? (
                    <p className="mt-1 text-[11px] font-medium text-cyan-700">{formatCommuteNoteSummary(companyCommuteNotes[company.id] ?? buildEmptyCommuteNote())}</p>
                  ) : null}
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", getCompanyTypeTone(company.type))}>{company.type}</span>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{company.location}</p>
            </button>
          ))}
        </div>
      </SurfaceCard>
      <div className="grid gap-6">
        <LeafletLocationMap companies={companyTargetsSeed} selectedCompanyId={selectedCompanyId} onSelectCompany={setSelectedCompanyId} />
        <SurfaceCard className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{selectedCompany.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{selectedCompany.location}</p>
            </div>
            <Pill className="border-slate-200 bg-slate-100 text-slate-700">좌표 {selectedCompany.lat.toFixed(2)}, {selectedCompany.lng.toFixed(2)}</Pill>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">근무지 메모</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{getLocationInsight(selectedCompany)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">선호도/적합도</p>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-500">선호도</span><span className="font-semibold text-slate-800">{selectedCompany.preference}%</span></div>
                  <ProgressBar value={selectedCompany.preference} color="#4f46e5" />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-500">적합도</span><span className="font-semibold text-slate-800">{selectedCompany.fit}%</span></div>
                  <ProgressBar value={selectedCompany.fit} color="#10b981" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">기업별 소요시간 메모</p>
              <div className="flex items-center gap-2">
                <Pill className="border-slate-200 bg-slate-100 text-slate-700">{selectedCompany.name}</Pill>
                <button
                  type="button"
                  onClick={() => void saveDashboardState()}
                  className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  메모 저장
                </button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">총 소요시간(분)</span>
                <input
                  value={selectedCompanyCommuteNote.totalMinutes}
                  onChange={(event) => updateSelectedCompanyCommuteNote({ ...selectedCompanyCommuteNote, totalMinutes: event.target.value })}
                  placeholder="예: 55"
                  className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">환승 횟수</span>
                <input
                  value={selectedCompanyCommuteNote.transfers}
                  onChange={(event) => updateSelectedCompanyCommuteNote({ ...selectedCompanyCommuteNote, transfers: event.target.value })}
                  placeholder="예: 1"
                  className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCompanyCommuteNote.hasBus}
                  onChange={(event) => updateSelectedCompanyCommuteNote({ ...selectedCompanyCommuteNote, hasBus: event.target.checked })}
                />
                <span className="font-semibold text-slate-700">버스 포함</span>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCompanyCommuteNote.hasSubway}
                  onChange={(event) => updateSelectedCompanyCommuteNote({ ...selectedCompanyCommuteNote, hasSubway: event.target.checked })}
                />
                <span className="font-semibold text-slate-700">지하철 포함</span>
              </label>
            </div>
            <textarea
              value={selectedCompanyCommuteNote.note}
              onChange={(event) => updateSelectedCompanyCommuteNote({ ...selectedCompanyCommuteNote, note: event.target.value })}
              placeholder="예: 강남역 기준 출근시간대 혼잡함 / 판교역 하차 후 도보 12분"
              className="mt-4 min-h-[96px] w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300"
            />
            {hasCommuteNoteContent(selectedCompanyCommuteNote) ? (
              <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                <span className="font-semibold">요약:</span> {formatCommuteNoteSummary(selectedCompanyCommuteNote)}
              </div>
            ) : null}
            {dashboardStateSync.message ? <div className="mt-3 text-xs font-medium text-slate-500">{dashboardStateSync.message}</div> : null}
            <p className="mt-2 text-xs text-slate-500">기업별로 따로 저장되며 브라우저에 로컬로 보관됩니다.</p>
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">소요시간 탐색</h3>
              <p className="mt-1 text-sm text-slate-500">출발지와 목적지를 입력한 뒤 네이버지도 대중교통 경로탐색 페이지를 엽니다.</p>
            </div>
            <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">대중교통</Pill>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-slate-700">출발지</span>
              <input
                value={routeOrigin}
                onChange={(event) => {
                  setRouteOrigin(event.target.value);
                  if (routeSearchError) {
                    setRouteSearchError(null);
                  }
                }}
                placeholder="예: 서울역, 수원역, 집 주소"
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {originPresetSeed.map((origin) => (
                  <button
                    key={origin.value}
                    type="button"
                    onClick={() => {
                      setRouteOrigin(origin.value);
                      setRouteSearchError(null);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold transition",
                      routeOrigin === origin.value ? "border-cyan-300 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {origin.label}
                  </button>
                ))}
              </div>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-slate-700">목적지</span>
              <input
                value={routeDestination}
                onChange={(event) => {
                  setRouteDestination(event.target.value);
                  if (routeSearchError) {
                    setRouteSearchError(null);
                  }
                }}
                placeholder="예: 경기 성남 판교"
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const origin = routeOrigin.trim();
                const destination = routeDestination.trim();
                if (!origin || !destination) {
                  setRouteSearchError("출발지와 목적지를 모두 입력하세요.");
                  return;
                }
                const selectedOriginPreset = originPresetSeed.find((item) => item.value === origin);
                setRouteSearchError(null);
                void window.desktopAPI.external.openUrl(
                  buildNaverTransitDirectionsUrl({
                    origin,
                    originLat: selectedOriginPreset?.lat ?? null,
                    originLng: selectedOriginPreset?.lng ?? null,
                    originType: selectedOriginPreset?.type ?? "ADDRESS_POI",
                    destination,
                    destinationLat: selectedCompany.lat,
                    destinationLng: selectedCompany.lng,
                  }),
                );
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ExternalLink className="h-4 w-4" />
              소요시간 탐색
            </button>
            <button
              type="button"
              onClick={() => {
                setRouteDestination(selectedCompany.name);
                setRouteSearchError(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              목적지 현재 기업명으로 채우기
            </button>
          </div>
          {routeSearchError ? (
            <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{routeSearchError}</div>
          ) : null}
        </SurfaceCard>
      </div>
    </div>
  );

  const portfolioContent = (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-4">
        <SurfaceCard className="flex flex-col justify-between p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-100 bg-slate-800 text-xl font-bold text-white shadow-sm">김</div>
            <div><h3 className="text-lg font-bold text-slate-900">김회로</h3><p className="text-xs font-medium text-slate-500">github.com/kim-rtl</p></div>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-slate-700">포트폴리오 완성도</span><span className="font-bold text-blue-600">{portfolioSeed.readiness}%</span></div>
            <ProgressBar value={portfolioSeed.readiness} color="#2563eb" />
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><Award className="h-4 w-4 text-emerald-500" />핵심 기술 스택</h3>
          <div className="space-y-3">
            {portfolioSeed.skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 font-semibold text-slate-600">{skill.name}</span>
                <div className="flex-1"><ProgressBar value={skill.level} color="#10b981" /></div>
                <span className="w-10 shrink-0 text-right text-xs font-bold text-slate-400">{skill.level}%</span>
              </div>
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><BookOpen className="h-4 w-4 text-blue-500" />학습 중인 기술</h3>
          <div className="space-y-4">
            {portfolioSeed.learningSkills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-slate-700">{skill.name}</span><Pill className="border-blue-200 bg-blue-50 text-blue-700">{skill.status}</Pill></div>
                <ProgressBar value={skill.progress} color="#3b82f6" />
              </div>
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 className="flex items-center gap-2 font-bold text-slate-900"><Activity className="h-4 w-4 text-emerald-500" />커밋 활동</h3>
            <span className="text-xl font-black text-slate-900">{portfolioSeed.githubCommits}</span>
          </div>
          <ContributionHeatmap values={contributionGrid} />
        </SurfaceCard>
      </div>
      <SurfaceCard className="p-6">
        <div className="mb-6 flex flex-wrap gap-4 border-b border-slate-200 pb-4">
          {[
            { id: "showcase" as const, label: "프로젝트 Showcase", icon: Briefcase, tone: "text-blue-600" },
            { id: "academics" as const, label: "수업 / Coursework", icon: Book, tone: "text-emerald-600" },
            { id: "study" as const, label: "학습 & 스터디 로그", icon: BookOpen, tone: "text-indigo-600" },
          ].map((tab) => (
            <button key={tab.id} type="button" onClick={() => setPortfolioSubTab(tab.id)} className={cn("relative flex items-center gap-2 pb-3 text-sm font-semibold transition", portfolioSubTab === tab.id ? tab.tone : "text-slate-400 hover:text-slate-600")}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {portfolioSubTab === tab.id ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-current" /> : null}
            </button>
          ))}
        </div>
        {portfolioSubTab === "showcase" ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{portfolioSeed.projects.map((project) => <div key={project.id} className="flex flex-col rounded-3xl border border-slate-200 p-5 transition hover:border-cyan-200 hover:shadow-md"><h4 className="text-lg font-bold text-slate-900">{project.name}</h4><p className="mt-2 text-xs font-bold text-slate-400">{project.date} · <span className="text-blue-600">{project.role}</span></p><div className="mt-4 flex flex-wrap gap-2">{project.tech.map((tech) => <Pill key={tech} className="border-slate-200 bg-slate-100 text-slate-700">{tech}</Pill>)}</div><p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{project.impact}</p><a href={`https://${project.link}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-800">프로젝트 링크<ExternalLink className="h-4 w-4" /></a></div>)}</div> : null}
        {portfolioSubTab === "academics" ? <div><p className="mb-6 text-sm text-slate-500">직무 관련성이 높은 전공 과목과 키워드를 함께 정리했습니다.</p><div className="grid gap-4 md:grid-cols-2">{portfolioSeed.coursework.map((course) => <div key={course.id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4"><div className="mb-3 flex items-start justify-between gap-3"><h4 className="font-bold text-slate-900">{course.name}</h4><span className="text-xl font-black text-slate-700">{course.grade}</span></div><div className="mb-3 flex items-center justify-between text-sm"><span className="text-slate-500">직무 관련성</span><span className="font-semibold text-slate-800">{course.relevance}%</span></div><ProgressBar value={course.relevance} color={course.relevance >= 85 ? "#10b981" : "#3b82f6"} /><div className="mt-4 flex flex-wrap gap-2">{course.tags.map((tag) => <Pill key={tag} className="border-white bg-white text-slate-600">{tag}</Pill>)}</div></div>)}</div></div> : null}
        {portfolioSubTab === "study" ? <div className="grid gap-6 xl:grid-cols-2"><div><h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"><Rocket className="h-4 w-4 text-indigo-500" />진행 중인 스터디 프로젝트</h4><div className="space-y-4">{portfolioSeed.studyProjects.map((project) => <div key={project.id} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4"><div className="mb-2 flex items-start justify-between gap-3"><h5 className="font-bold text-slate-900">{project.name}</h5><Pill className="border-indigo-200 bg-indigo-50 text-indigo-700">{project.tech}</Pill></div><div className="mb-3"><ProgressBar value={project.progress} color="#6366f1" /></div><p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">현재:</span> {project.status}</p><p className="mt-2 text-sm text-slate-600"><span className="font-semibold text-slate-800">Next:</span> {project.next}</p></div>)}</div></div><div><h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"><PenTool className="h-4 w-4 text-amber-500" />학습 복습 노트</h4><div className="space-y-3">{portfolioSeed.studyNotes.map((note) => <div key={note.id} className="rounded-3xl border border-slate-200 p-4 transition hover:border-amber-200"><div className="mb-2 flex items-center justify-between gap-3"><Pill className="border-amber-200 bg-amber-50 text-amber-700">{note.category}</Pill><span className="text-xs font-medium text-slate-400">{note.date}</span></div><h5 className="text-sm font-bold text-slate-900">{note.title}</h5><p className="mt-2 text-sm leading-relaxed text-slate-500">{note.preview}</p></div>)}</div></div></div> : null}
      </SurfaceCard>
    </div>
  );

  const checklistContent = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SurfaceCard className="p-5">
          <p className="text-sm text-slate-500">전체 체크리스트 완성률</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {checklistPostings.length === 0
              ? 0
              : Math.round(checklistPostings.reduce((sum, posting) => sum + posting.checklistProgress, 0) / checklistPostings.length)}
            %
          </p>
        </SurfaceCard>
        <SurfaceCard className="p-5">
          <p className="text-sm text-slate-500">블로커 있는 공고</p>
          <p className="mt-2 text-3xl font-black text-rose-600">{checklistPostings.filter((posting) => posting.blockedCount > 0).length}</p>
        </SurfaceCard>
        <SurfaceCard className="p-5">
          <p className="text-sm text-slate-500">오늘 제출 위험 공고</p>
          <p className="mt-2 text-3xl font-black text-amber-600">
            {checklistPostings.filter((posting) => posting.daysLeft <= 2 && posting.checklistProgress < 100).length}
          </p>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.36fr_0.64fr]">
        <SurfaceCard className="overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="font-bold text-slate-900">공고별 제출 준비</h3>
          </div>
          <div className="space-y-2 p-3">
            {checklistPostings.map((posting) => (
              <button
                key={posting.id}
                type="button"
                onClick={() => {
                  setSelectedChecklistPostingId(posting.id);
                  setSelectedCompanyId(posting.targetCompanyId);
                }}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedChecklistPosting?.id === posting.id ? "border-cyan-300 bg-cyan-50/50 shadow-sm" : "border-transparent hover:bg-slate-50",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{posting.company}</p>
                    <p className="mt-1 text-sm text-slate-500">{posting.title}</p>
                  </div>
                  <Pill className={cn("border-slate-200 bg-white text-slate-700", posting.blockedCount > 0 && "border-rose-200 bg-rose-50 text-rose-700")}>
                    {posting.checklistProgress}%
                  </Pill>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">D-{posting.daysLeft}</Pill>
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">{posting.stage}</Pill>
                  {posting.blockedCount > 0 ? <Pill className="border-rose-200 bg-rose-50 text-rose-700">블로커 {posting.blockedCount}</Pill> : null}
                </div>
              </button>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          {selectedChecklistPosting ? (
            <>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedChecklistPosting.company}</h3>
                  <p className="mt-1 text-sm text-slate-500">{selectedChecklistPosting.title}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-slate-800">완성률 {selectedChecklistPosting.checklistProgress}%</p>
                  <p className="mt-1 text-slate-500">마감 D-{selectedChecklistPosting.daysLeft}</p>
                </div>
              </div>

              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">기업 분석</p>
                  <p className="mt-2 text-sm text-slate-700">{selectedCompany.name}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">자소서 연결</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {coverLetterFiles.some((file) => file.companyId === selectedChecklistPosting.targetCompanyId) ? "연결된 md 있음" : "연결된 md 없음"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">우선순위</p>
                  <p className="mt-2 text-sm text-slate-700">{selectedChecklistPosting.priority}</p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedChecklistPosting.checklistItems.map((item) => (
                  <div key={item.id} className={cn("rounded-3xl border p-4", item.blocked ? "border-rose-200 bg-rose-50/40" : "border-slate-200 bg-white")}>
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setApplicationChecklists((current) => ({
                            ...current,
                            [selectedChecklistPosting.id]: (current[selectedChecklistPosting.id] ?? []).map((entry) =>
                              entry.id === item.id ? { ...entry, done: !entry.done } : entry,
                            ),
                          }))
                        }
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px]",
                          item.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-transparent",
                        )}
                      >
                        ✓
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={cn("font-semibold text-slate-800", item.done && "text-slate-400 line-through")}>{item.label}</p>
                          <Pill className="border-slate-200 bg-slate-100 text-slate-700">{item.category}</Pill>
                          {item.blocked ? <Pill className="border-rose-200 bg-rose-50 text-rose-700">블로커</Pill> : null}
                        </div>
                        <textarea
                          value={item.note}
                          onChange={(event) =>
                            setApplicationChecklists((current) => ({
                              ...current,
                              [selectedChecklistPosting.id]: (current[selectedChecklistPosting.id] ?? []).map((entry) =>
                                entry.id === item.id ? { ...entry, note: event.target.value } : entry,
                              ),
                            }))
                          }
                          className="mt-3 min-h-[88px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300"
                        />
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setApplicationChecklists((current) => ({
                                ...current,
                                [selectedChecklistPosting.id]: (current[selectedChecklistPosting.id] ?? []).map((entry) =>
                                  entry.id === item.id ? { ...entry, blocked: !entry.blocked } : entry,
                                ),
                              }))
                            }
                            className={cn(
                              "rounded-xl px-3 py-1.5 text-xs font-semibold transition",
                              item.blocked ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                            )}
                          >
                            {item.blocked ? "블로커 해제" : "블로커 표시"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500">표시할 체크리스트 공고가 없습니다.</div>
          )}
        </SurfaceCard>
      </div>
    </div>
  );
  const interviewContent = (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <SurfaceCard className="p-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">전공 플래시카드</h3>
            <p className="mt-1 text-sm text-slate-500">셔플은 랜덤이 아니라 동일한 입력 순서 기준으로 안정적으로 섞입니다.</p>
          </div>
          <button type="button" onClick={() => { setFlashcardMode((current) => (current === "default" ? "shuffled" : "default")); setActiveFlashcardIndex(0); }} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            {flashcardMode === "default" ? "셔플 모드" : "기본 순서"}
          </button>
        </div>
        <div className="space-y-4">
          {orderedFlashcards.map((flashcard, index) => {
            const isOpen = activeFlashcardIndex === index;
            const feedbackKey = `${flashcard.category}-${flashcard.q}`;
            const feedback = flashcardFeedback[feedbackKey];
            return (
              <div key={feedbackKey} className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition">
                <button type="button" onClick={() => setActiveFlashcardIndex(isOpen ? null : index)} className="flex w-full items-start justify-between gap-4 p-5 text-left hover:bg-slate-50">
                  <div className="flex gap-3">
                    <Pill className="border-purple-200 bg-purple-50 text-purple-700">{flashcard.category}</Pill>
                    <h4 className="font-semibold leading-relaxed text-slate-800">{flashcard.q}</h4>
                  </div>
                  <ChevronUp className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform", isOpen ? "" : "rotate-180")} />
                </button>
                {isOpen ? (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 pb-5 pt-0">
                    <div className="mt-4 flex items-start gap-3">
                      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                      <p className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">{flashcard.a}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-xs font-medium text-slate-500">복습 상태: {feedback === "hard" ? "다시 보기" : feedback === "easy" ? "숙지 완료" : "미표시"}</div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFlashcardFeedback((current) => ({ ...current, [feedbackKey]: "hard" }))} className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100">다시 보기</button>
                        <button type="button" onClick={() => setFlashcardFeedback((current) => ({ ...current, [feedbackKey]: "easy" }))} className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100">숙지 완료</button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </SurfaceCard>
      <div className="grid gap-6">
        <SurfaceCard className="p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">자소서 문항 라이브러리</h3>
          <div className="space-y-3">
            {essayQuestionsSeed.map((question) => (
              <button key={question.id} type="button" onClick={() => setSelectedEssayId(question.id)} className={cn("w-full rounded-3xl border p-4 text-left transition", selectedEssayId === question.id ? "border-cyan-300 bg-cyan-50/50 shadow-sm" : "border-slate-200 hover:bg-slate-50")}>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">{question.company}</Pill>
                  <Pill className="border-amber-200 bg-amber-50 text-amber-700">{question.type}</Pill>
                  <Pill className="border-slate-200 bg-white text-slate-700">{question.status}</Pill>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800">{question.question}</p>
                <p className="mt-2 text-sm text-slate-500">{question.draft || "아직 초안이 없습니다."}</p>
              </button>
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">문항 연결 경험</h3>
          <div className="space-y-3">
            {recommendedExperiences.map((experience) => (
              <div key={experience.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-semibold text-slate-800">{experience.title}</p><p className="mt-2 text-sm text-slate-600">{experience.summary}</p></div>
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">{experience.result}</Pill>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {experience.strengths.map((strength) => (
                    <Pill key={strength} className="border-slate-200 bg-slate-100 text-slate-700">{strength}</Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );

  const calendarContent = (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[22px] font-black tracking-tight text-slate-900">Interactive Calendar</h3>
              <p className="mt-1 text-[13px] text-slate-500">월간, 주간, 리스트 뷰 전환과 이벤트 클릭이 가능한 실제 캘린더입니다.</p>
            </div>
            <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">FullCalendar</Pill>
          </div>
        </div>
        <div className="career-calendar p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            locale={koLocale}
            initialView="dayGridMonth"
            initialDate="2026-03-01"
            height={720}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,listMonth",
            }}
            buttonText={{
              today: "오늘",
              month: "월간",
              week: "주간",
              list: "리스트",
            }}
            dayMaxEventRows={3}
            nowIndicator
            selectable
            events={calendarEvents}
            eventClick={(info) => {
              setSelectedScheduleId(Number(info.event.id));
            }}
            dateClick={(info) => {
              const sameDayEvent = sortedSchedule.find((event) => event.date === info.date.getDate());
              if (sameDayEvent) {
                setSelectedScheduleId(sameDayEvent.id);
              }
            }}
          />
        </div>
      </SurfaceCard>
      <div className="grid gap-6">
        <SurfaceCard className="p-6">
          <div className="mb-4 flex items-center gap-2"><Clock3 className="h-5 w-5 text-blue-500" /><h3 className="text-lg font-bold text-slate-900">선택한 일정</h3></div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <Pill className={cn("border", getEventTone(selectedScheduleEvent.type))}>{selectedScheduleEvent.type}</Pill>
              <span className="text-xs font-semibold text-slate-500">3월 {selectedScheduleEvent.date}일 {selectedScheduleEvent.time}</span>
            </div>
            <h4 className="mt-4 text-xl font-bold text-slate-900">{selectedScheduleEvent.title}</h4>
            <p className="mt-2 text-sm text-slate-500">{selectedScheduleEvent.company}</p>
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">다가오는 주요 일정</h3>
          <div className="space-y-4">
            {sortedSchedule.filter((event) => event.date >= TODAY.getDate()).map((event) => (
              <button key={event.id} type="button" onClick={() => setSelectedScheduleId(event.id)} className="relative w-full border-l-2 border-slate-200 pl-4 text-left">
                <span className={cn("absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ring-4 ring-white", selectedScheduleId === event.id ? "bg-cyan-500" : "bg-blue-500")} />
                <div className="mb-1 text-xs font-bold text-slate-500">3월 {event.date}일 ({event.time})</div>
                <div className="font-semibold text-slate-800">{event.title}</div>
                <div className="mt-1 text-sm text-slate-500">{event.company}</div>
              </button>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );

  const coverLetterContent = (
    <div className="grid min-h-[760px] gap-5 xl:grid-cols-[0.32fr_0.68fr]">
      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900"><FolderOpen className="h-4 w-4 text-blue-500" />자소서 MD 보관함</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {coverLetterConfig ? `${coverLetterConfig.relativePath} · ${coverLetterConfig.namingPattern}` : "coverletters_md 폴더 동기화 중"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => void syncCoverLetterFiles()} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50">
                동기화
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCoverLetterName(null);
                  setCoverLetterDraft(buildEmptyCoverLetterDraft(selectedCompany, selectedCompanyPosting));
                }}
                className="rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
              >
                새 파일
              </button>
            </div>
          </div>
        </div>
        <div className="border-b border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-500">
          상태: {coverLetterSync.phase}
          {coverLetterSync.message ? ` · ${coverLetterSync.message}` : ""}
          {coverLetterSync.lastSyncedAt ? ` · 마지막 동기화 ${new Date(coverLetterSync.lastSyncedAt).toLocaleString("ko-KR")}` : ""}
        </div>
        <div className="space-y-2 p-2">
          {coverLetterFiles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              아직 스캔된 md 파일이 없습니다. 새 파일을 만들거나 `coverletters_md/` 폴더에 md를 추가한 뒤 동기화하세요.
            </div>
          ) : (
            coverLetterFiles.map((file) => (
              <button
                key={file.name}
                type="button"
                onClick={() => setSelectedCoverLetterName(file.name)}
                className={cn(
                  "w-full rounded-2xl border p-3 text-left transition",
                  selectedCoverLetterName === file.name ? "border-cyan-300 bg-cyan-50/50" : "border-transparent hover:bg-slate-50",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
                      <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="truncate">{file.title}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-500">{file.name}</p>
                  </div>
                  <Pill className={cn(file.isValid ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
                    {file.isValid ? "정상" : "규칙 확인"}
                  </Pill>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>{file.companyName}</span>
                  <span>{new Date(file.lastModified).toLocaleDateString("ko-KR")}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </SurfaceCard>
      <div className="grid gap-6">
        <SurfaceCard className="overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">{coverLetterDraft.meta.title || "새 자소서"}</h3>
                <p className="mt-1 truncate text-[13px] text-slate-500">
                  {coverLetterDraft.originalName ?? buildCoverLetterFileName(coverLetterDraft.meta)}
                </p>
              </div>
              <Pill className={cn(selectedCoverLetterRecord ? (selectedCoverLetterLinked ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700") : "border-slate-200 bg-white text-slate-700")}>
                {selectedCoverLetterRecord ? (selectedCoverLetterLinked ? "현재 기업과 연결됨" : "현재 기업과 불일치") : "새 문서"}
              </Pill>
            </div>
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
            <label className="grid gap-1 text-[12px] xl:col-span-2">
              <span className="font-semibold text-slate-700">제목</span>
              <input value={coverLetterDraft.meta.title} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, title: event.target.value } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" />
            </label>
            <label className="grid gap-1 text-[12px]">
              <span className="font-semibold text-slate-700">기업 ID</span>
              <input value={coverLetterDraft.meta.companyId} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, companyId: event.target.value } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" />
            </label>
            <label className="grid gap-1 text-[12px]">
              <span className="font-semibold text-slate-700">기업명</span>
              <input value={coverLetterDraft.meta.companyName} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, companyName: event.target.value } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" />
            </label>
            <label className="grid gap-1 text-[12px]">
              <span className="font-semibold text-slate-700">기업 슬러그</span>
              <input value={coverLetterDraft.meta.companySlug} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, companySlug: coverLetterSlugify(event.target.value) } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" />
            </label>
            <label className="grid gap-1 text-[12px]">
              <span className="font-semibold text-slate-700">연도</span>
              <input value={coverLetterDraft.meta.year} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, year: event.target.value } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" />
            </label>
            <label className="grid gap-1 text-[12px]">
              <span className="font-semibold text-slate-700">직무 트랙</span>
              <input value={coverLetterDraft.meta.jobTrack} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, jobTrack: event.target.value } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" />
            </label>
            <label className="grid gap-1 text-[12px]">
              <span className="font-semibold text-slate-700">문서 유형</span>
              <input value={coverLetterDraft.meta.docType} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, docType: event.target.value } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" />
            </label>
            <label className="grid gap-1 text-[12px] xl:col-span-2">
              <span className="font-semibold text-slate-700">상태 / 태그</span>
              <div className="grid grid-cols-[0.42fr_0.58fr] gap-2">
                <input value={coverLetterDraft.meta.status} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, status: event.target.value } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" />
                <input value={coverLetterDraft.meta.tags} onChange={(event) => setCoverLetterDraft((current) => ({ ...current, meta: { ...current.meta, tags: event.target.value } }))} className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300" placeholder="rtl, verification" />
              </div>
            </label>
          </div>
          <div className="border-t border-slate-200 bg-white px-6 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCoverLetterDraft((current) => ({
                    ...current,
                    meta: {
                      ...current.meta,
                      companyId: String(selectedCompanyId),
                      companyName: selectedCompany.name,
                      companySlug: selectedCompanySlug,
                      jobTrack: current.meta.jobTrack || selectedCompanyPosting?.role || "cover-letter",
                      title: current.meta.title || `${selectedCompany.name} 자기소개서`,
                      updatedAt: getIsoNow(),
                    },
                  }));
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                선택 기업으로 메타 채우기
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedCoverLetterName) {
                    void loadCoverLetterFile(selectedCoverLetterName);
                    return;
                  }
                  setCoverLetterDraft(buildEmptyCoverLetterDraft(selectedCompany, selectedCompanyPosting));
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={() => void saveCoverLetterFile()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-800"
              >
                저장
              </button>
            </div>
          </div>
        </SurfaceCard>
        <div className="grid min-h-[420px] gap-6 xl:grid-cols-2">
          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h4 className="text-[15px] font-bold text-slate-900">Markdown 편집기</h4>
            </div>
            <textarea
              value={coverLetterDraft.content}
              onChange={(event) => setCoverLetterDraft((current) => ({ ...current, content: event.target.value }))}
              className="min-h-[420px] w-full resize-none p-5 text-[14px] leading-relaxed text-slate-700 outline-none"
            />
          </SurfaceCard>
          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h4 className="text-[15px] font-bold text-slate-900">Preview</h4>
            </div>
            <ScrollArea className="p-8">
              <div className="mx-auto max-w-2xl">{renderMarkdown(coverLetterDraft.content)}</div>
            </ScrollArea>
          </SurfaceCard>
        </div>
        <SurfaceCard className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">파일명 규칙 미리보기</p>
              <p className="mt-1 text-xs text-slate-500">{buildCoverLetterFileName(coverLetterDraft.meta)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCoverLetterRecord?.issues.map((issue) => (
                <Pill key={issue} className="border-amber-200 bg-amber-50 text-amber-700">{issue}</Pill>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
  const tabRegistry: Record<DashboardTab, React.ReactNode> = {
    overview: overviewContent,
    industry: industryContent,
    kanban: kanbanContent,
    strategy: strategyContent,
    company: companyContent,
    jdscanner: jdScannerContent,
    offer: offerContent,
    location: locationContent,
    portfolio: portfolioContent,
    checklist: checklistContent,
    interview: interviewContent,
    calendar: calendarContent,
    coverletters: coverLetterContent,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#f8fbff,_#eef4fb_55%,_#e8eef7)] font-sans text-slate-900">
      <aside
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col bg-transparent px-3 py-3 text-slate-300 transition-[width] duration-300 ease-out",
          isSidebarExpanded ? "w-[292px]" : "w-[92px]",
        )}
      >
        <div className={cn("rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(255,255,255,0.48))] shadow-[0_28px_60px_rgba(148,163,184,0.18)] backdrop-blur-[28px] transition-all duration-300", isSidebarExpanded ? "px-5 py-5" : "px-3 py-4")}>
          <div className={cn("flex items-center", isSidebarExpanded ? "gap-3" : "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#22d3ee,_#2563eb)] text-white shadow-lg shadow-cyan-500/25">
              <Code2 className="h-4.5 w-4.5" />
            </div>
            <div className={cn("overflow-hidden transition-all duration-300", isSidebarExpanded ? "max-w-[170px] opacity-100" : "max-w-0 opacity-0")}>
              <p className="text-[14px] font-bold tracking-wide text-slate-900">HARDWARE CAREER BI</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">Merged Dashboard</p>
            </div>
          </div>
        </div>
        <ScrollArea className={cn("mt-3 flex-1 rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.62),_rgba(255,255,255,0.4))] shadow-[0_24px_48px_rgba(148,163,184,0.18)] backdrop-blur-[28px] transition-all duration-300", isSidebarExpanded ? "px-1 py-4" : "px-0 py-3")}>
          {navSections.map((section) => (
            <div key={section.title} className={cn("mx-2 mb-4 rounded-[22px] border border-white/5 bg-white/[0.03] transition-all duration-300", isSidebarExpanded ? "px-1 py-2" : "px-0 py-2")}>
              <div className={cn("overflow-hidden px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 transition-all duration-300", isSidebarExpanded ? "max-h-6 pb-1 opacity-100" : "max-h-0 pb-0 opacity-0")}>{section.title}</div>
              {section.items.map((item) => (
                <NavItem key={item.id} icon={item.icon} label={item.label} expanded={isSidebarExpanded} isActive={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
              ))}
            </div>
          ))}
        </ScrollArea>
        <div className={cn("mt-3 rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.6),_rgba(255,255,255,0.38))] shadow-[0_22px_44px_rgba(148,163,184,0.16)] backdrop-blur-[28px] transition-all duration-300", isSidebarExpanded ? "px-4 py-4" : "px-3 py-4")}>
          <div className={cn("flex items-center", isSidebarExpanded ? "gap-3" : "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-white">김</div>
            <div className={cn("overflow-hidden transition-all duration-300", isSidebarExpanded ? "max-w-[150px] opacity-100" : "max-w-0 opacity-0")}>
              <p className="text-[13px] font-semibold text-slate-900">김회로</p>
              <p className="text-[10px] text-slate-500">RTL Design / Verification</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-10 py-5 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-[40px] font-black tracking-tight text-slate-900">{activeMeta.title}</h1>
              <p className="mt-1 text-[14px] text-slate-500">{activeMeta.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">Prototype Only</Pill>
              <Pill className="border-slate-200 bg-slate-100 text-slate-700">{selectedCompany.name}</Pill>
              {dashboardStateSync.message ? <Pill className="border-slate-200 bg-white text-slate-700">{dashboardStateSync.message}</Pill> : null}
              <button
                type="button"
                onClick={() => void saveDashboardState()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                로컬 상태 저장
              </button>
              <button type="button" className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50">
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
        <ScrollArea className="flex-1 p-6 lg:p-8">{tabRegistry[activeTab]}</ScrollArea>
      </main>
    </div>
  );
}
