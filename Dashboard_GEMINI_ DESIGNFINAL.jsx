import React, { useState, useEffect } from 'react';
import { 
  Home, Target, Settings, Info, ChevronDown, Filter, CheckCircle2, 
  AlertCircle, FileText, FolderOpen, Clock, RefreshCw, Calendar as CalendarIcon, 
  ChevronLeft, ChevronRight, MapPin, Building2, Briefcase, Newspaper, Code2, 
  ExternalLink, User, Github, Award, Activity, KanbanSquare, Brain, Scale,
  BookOpen, Lightbulb, ChevronUp, Rocket, PenTool, Radio, Terminal, Search,
  AlertTriangle, Book, CheckSquare, XCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup, useMap } from 'react-leaflet';

// --- 하드웨어 설계/검증(Verilog/SV) 맞춤형 모크 데이터 ---
const MOCK_DATA = {
  kpi: {
    totalApplied: { label: '총 지원 횟수', value: 18, trend: '+3', data: [2, 3, 5, 8, 10, 14, 16, 18] },
    passRate: { label: '서류 합격률', value: '45%', trend: '+5.2%', data: [15, 20, 25, 30, 30, 35, 40, 45] },
    activeTests: { label: '진행중인 필기/코테', value: 3, trend: '+1', data: [0, 1, 1, 2, 1, 3, 2, 3] },
    upcomingInterviews: { label: '대기중인 직무면접', value: 2, trend: '+2', data: [0, 0, 0, 0, 1, 0, 1, 2] }
  },
  funnel: [
    { stage: '서류 제출', count: 18, rate: 100 },
    { stage: '서류 합격', count: 8, rate: 44 },
    { stage: '필기/코테 통과', count: 4, rate: 22 },
    { stage: '1차 직무면접 통과', count: 1, rate: 5 },
    { stage: '최종 합격', count: 0, rate: 0 }
  ],
  competency: {
    frontend: { value: 95, target: 90, label: 'RTL 설계 (Verilog)' },
    cs: { value: 85, target: 80, label: '검증 (SystemVerilog/UVM)' },
    algorithm: { value: 80, target: 85, label: '컴퓨터 구조 & SoC' }
  },
  strategyMatrix: [
    { id: 1, name: '삼성전자 (DS/LSI)', fit: 85, preference: 95, status: '서류제출', type: '집중공략', location: '경기 화성/기흥', lat: 37.2084, lng: 127.0763, stage: 'applied' },
    { id: 2, name: 'SK하이닉스', fit: 80, preference: 95, status: '필기대기', type: '집중공략', location: '경기 이천', lat: 37.2471, lng: 127.4883, stage: 'test' },
    { id: 3, name: 'LX세미콘', fit: 75, preference: 85, status: '1차면접', type: '상향지원', location: '서울 양재', lat: 37.4842, lng: 127.0345, stage: 'interview1' },
    { id: 4, name: '리벨리온 (AI반도체)', fit: 85, preference: 90, status: '과제진행', type: '집중공략', location: '경기 성남 (판교)', lat: 37.3957, lng: 127.1105, stage: 'test' },
    { id: 5, name: '퓨리오사AI', fit: 70, preference: 88, status: '서류탈락', type: '상향지원', location: '서울 강남', lat: 37.5000, lng: 127.0361, stage: 'rejected' },
    { id: 6, name: '퀄컴 코리아', fit: 60, preference: 98, status: '준비중', type: '상향지원', location: '서울 강남', lat: 37.5030, lng: 127.0415, stage: 'preparing' },
    { id: 7, name: '텔레칩스', fit: 90, preference: 75, status: '2차면접', type: '안정지원', location: '경기 성남 (판교)', lat: 37.4000, lng: 127.1050, stage: 'interview2' },
    { id: 8, name: '파두 (FADU)', fit: 80, preference: 80, status: '서류합격', type: '안정지원', location: '서울 강남', lat: 37.4950, lng: 127.0300, stage: 'test' },
    { id: 9, name: '망고부스트', fit: 65, preference: 85, status: '최종합격', type: '집중공략', location: '서울 관악', lat: 37.4680, lng: 126.9530, stage: 'passed' },
  ],
  companyDetails: {
    1: {
      description: "삼성전자 DS부문 System LSI 사업부는 모바일 AP, 이미지센서(CIS), DDI 등 첨단 시스템 반도체를 설계하는 글로벌 핵심 팹리스 조직입니다.",
      roleDescription: "SoC 또는 IP 디지털 회로 설계(RTL) 및 검증을 담당합니다. 저전력/고성능 아키텍처를 설계하고, SystemVerilog와 UVM을 활용하여 IP 레벨부터 Top 레벨까지 엄격한 검증을 수행합니다.",
      techStack: ["Verilog", "SystemVerilog", "UVM", "AMBA AXI", "C/C++", "Synopsys/Cadence EDA"],
      news: ["3나노 GAA 공정 기반 차세대 모바일 AP 양산 박차", "차량용 인포테인먼트(IVI) 칩 '엑시노스 오토' 공급 확대"]
    },
    2: {
      description: "SK하이닉스는 HBM, DDR5 등 초고속 메모리 반도체 시장을 선도하는 글로벌 기업입니다. 최근 AI 시대에 맞춰 컨트롤러 설계 역량도 대폭 강화하고 있습니다.",
      roleDescription: "메모리 컨트롤러 및 인터페이스(PHY)의 디지털 로직 설계와 검증을 담당합니다. 초고속 데이터 처리를 위한 파이프라인 설계 및 타이밍 클로저 역량이 중요합니다.",
      techStack: ["Verilog", "SystemVerilog", "Python", "Computer Architecture", "FPGA Prototyping"],
      news: ["엔비디아에 차세대 HBM3E 메모리 대규모 공급", "CXL 기반 연산 기능 통합 메모리(CMS) 개발 가속화"]
    },
    4: {
      description: "리벨리온은 월스트리트 출신 금융/AI 전문가들이 모여 창업한 국내 대표 AI 반도체 팹리스 스타트업으로, 추론용 NPU(신경망처리장치) 분야에서 뛰어난 성과를 내고 있습니다.",
      roleDescription: "AI 가속기 칩의 핵심 연산기(MAC) 및 On-chip Network(NoC)를 설계합니다. 딥러닝 알고리즘에 대한 이해를 바탕으로 하드웨어 아키텍처 최적화 및 PPA(Power, Performance, Area) 개선을 수행합니다.",
      techStack: ["Verilog", "SystemC", "Python", "Deep Learning", "Chisel/SpinalHDL(Option)"],
      news: ["차세대 AI 반도체 '리벨(REBELL)' 삼성전자 4나노 공정 기반 테이프아웃", "사우디 아람코 등 글로벌 투자사로부터 대규모 시리즈B 투자 유치"]
    }
  },
  portfolio: {
    readiness: 92,
    githubCommits: 845,
    resumeUpdated: '어제',
    skills: [
      { name: 'Verilog HDL', level: 95 },
      { name: 'SystemVerilog', level: 85 },
      { name: 'C / C++', level: 80 },
      { name: 'Python (Scripting)', level: 90 },
      { name: 'UVM Methodology', level: 70 }
    ],
    learningSkills: [
      { name: 'AMBA CHI (Coherent Hub)', progress: 40, status: '스펙 문서 리딩' },
      { name: 'Chisel HDL', progress: 65, status: '토이 프로젝트' },
      { name: 'PCIe Gen5 Controller', progress: 20, status: '개념 학습 중' },
      { name: 'Formal Verification', progress: 50, status: '실습 진행 중' }
    ],
    coursework: [
      { id: 1, name: '디지털 논리회로', grade: 'A+', relevance: 100, tags: ['Boolean Algebra', 'K-Map', 'FSM'] },
      { id: 2, name: '컴퓨터 구조', grade: 'A0', relevance: 95, tags: ['Pipeline', 'Cache', 'RISC-V'] },
      { id: 3, name: 'SoC 설계 및 실습', grade: 'A+', relevance: 90, tags: ['Verilog', 'AMBA AXI', 'FPGA'] },
      { id: 4, name: '반도체 공학', grade: 'B+', relevance: 70, tags: ['CMOS', 'MOSFET', 'Fabrication'] },
      { id: 5, name: '마이크로컨트롤러', grade: 'A0', relevance: 85, tags: ['MCU', 'Firmware', 'C/C++'] },
      { id: 6, name: '운영체제', grade: 'B0', relevance: 60, tags: ['Process', 'Memory Management'] }
    ],
    studyProjects: [
      { id: 1, name: 'Chisel 기반 커스텀 가속기 설계', tech: 'Chisel HDL', progress: 40, status: 'ALU 모듈 설계 및 테스트벤치 작성 중', next: 'MAC 연산기 파이프라이닝 적용' },
      { id: 2, name: 'AMBA CHI 프로토콜 검증 환경 구축', tech: 'SystemVerilog / UVM', progress: 15, status: '스펙 문서(IHI0050) 정독 및 트랜잭션 정의', next: '기본 Sequence 및 Driver 뼈대 작성' }
    ],
    studyNotes: [
      { id: 1, title: '[TIL] Chisel3 Data Types & Wire/Reg', date: '2026.03.07', category: 'Chisel', preview: 'Chisel에서의 기본 자료형(UInt, SInt)과 하드웨어 노드 할당 방식(Wire, Reg, WireDefault)의 차이점 및 예외 케이스 복습.' },
      { id: 2, title: 'AMBA AXI vs CHI 차이점 및 특징 요약', date: '2026.03.05', category: 'Architecture', preview: 'AXI는 Point-to-Point 및 버스 기반이나 CHI는 Network-on-Chip(NoC) 기반으로 코히어런시 확장성을 극대화함. Flit 구조의 이해...' },
      { id: 3, title: 'UVM Phase 8단계 흐름도 암기', date: '2026.03.02', category: 'Verification', preview: 'Build -> Connect -> End_of_elaboration -> Start_of_simulation -> Run -> Extract -> Check -> Report. 각 단계별 Virtual function 실행 순서 정리.' }
    ],
    projects: [
      { 
        id: 1, name: 'RISC-V 5-stage Pipelined Processor 설계', date: '2025.09 - 2025.12', role: 'Architecture & RTL Design', 
        tech: ['Verilog', 'FPGA', 'ModelSim', 'Vivado'], 
        impact: 'Data Hazard 해소를 위한 Forwarding Unit 구현으로 IPC 1.5 달성, FPGA 보드 상에서 동작 검증 완료',
        link: 'github.com/my-riscv-core'
      },
      { 
        id: 2, name: 'AMBA AXI4 인터페이스 기반 메모리 컨트롤러', date: '2025.05 - 2025.08', role: 'Design & Verification', 
        tech: ['SystemVerilog', 'AXI4', 'UVM', 'VCS'], 
        impact: 'Burst 전송 지원 컨트롤러 설계, UVM 기반 Random Testbench 구축하여 100% Functional Coverage 달성',
        link: 'github.com/axi-mem-ctrl'
      },
      { 
        id: 3, name: 'CNN 가속기 MAC 연산기 면적 최적화', date: '2025.01 - 2025.03', role: 'Logic Design', 
        tech: ['Verilog', 'Python', 'Design Compiler'], 
        impact: 'Data Reuse 패턴 분석을 통해 불필요한 레지스터 제거, 합성 결과 기존 대비 면적 20% 감소 성공',
        link: 'github.com/cnn-mac-opt'
      }
    ]
  },
  rtlTracker: {
    stats: [
      { category: 'Combinational Logic', score: 95 },
      { category: 'Sequential Logic', score: 88 },
      { category: 'FSM (Finite State Machine)', score: 75 },
      { category: 'CDC (Clock Domain Crossing)', score: 45 },
      { category: 'Arithmetic Circuits', score: 80 }
    ],
    errorLog: [
      { id: 1, type: '의도치 않은 Latch 추론', code: 'always_comb', desc: 'if-else나 case문에서 모든 조건을 덮지 않아 default 값이 없을 때 Latch가 합성됨.', count: 12 },
      { id: 2, type: 'CDC Synchronization 누락', code: 'Metastability', desc: '서로 다른 클럭 도메인 간 1-bit 신호 전달 시 2-flop synchronizer를 거치지 않음.', count: 8 },
      { id: 3, type: 'Blocking vs Non-blocking 혼용', code: 'Sequential', desc: 'always_ff 내부에서 Blocking(=) 할당을 사용하여 시뮬레이션 레이스 컨디션 발생.', count: 5 }
    ]
  },
  industryNews: [
    { id: 1, tag: 'Foundry', title: 'TSMC, 2나노 공정 수율 90% 도달... 애플·엔비디아 물량 싹쓸이 전망', date: '2026.03.08', source: 'SemiEngineering' },
    { id: 2, tag: 'AI 반도체', title: '리벨리온, 차세대 NPU "리벨" 삼성전자 4나노 공정으로 테이프아웃 성공', date: '2026.03.07', source: '전자신문' },
    { id: 3, tag: 'Memory', title: 'SK하이닉스, CXL 3.0 기반 연산 기능 통합 메모리(CMS) 솔루션 시연', date: '2026.03.05', source: 'ZDNet Korea' },
    { id: 4, tag: 'EDA', title: 'Synopsys, AI 기반 설계 최적화 툴 "DSO.ai" 업데이트... PPA 15% 추가 개선', date: '2026.03.03', source: 'EE Times' },
    { id: 5, tag: 'Architecture', title: 'Arm, 성능과 보안을 강화한 최신 Neoverse V3 차량용 코어 아키텍처 발표', date: '2026.03.01', source: 'TechCrunch' }
  ],
  flashcards: [
    { category: 'Digital Design', q: 'Setup Time과 Hold Time의 정의와 Violation 발생 시 해결책은?', a: 'Setup Time은 클럭 엣지 이전 데이터가 유지되어야 하는 최소 시간, Hold Time은 클럭 엣지 이후 유지되어야 하는 시간입니다. Setup 위반 시 클럭 주파수를 낮추거나 Data Path Delay를 줄이고(파이프라이닝 등), Hold 위반 시 Data Path에 버퍼를 추가해 Delay를 늘립니다.' },
    { category: 'Verilog HDL', q: 'Blocking Assignment(=)와 Non-blocking Assignment(<=)의 차이점은?', a: 'Blocking(=)은 순차적으로 실행되어 이전 라인이 완료되어야 다음이 실행되며 주로 Combinational Logic에 쓰입니다. Non-blocking(<=)은 병렬로 동시 실행되므로 Sequential Logic(Flip-flop)을 모델링할 때 사용합니다.' },
    { category: 'SystemVerilog', q: 'SystemVerilog에서 Interface의 장점과 Modport의 역할은?', a: 'Interface는 모듈 간 복잡한 신호 묶음을 캡슐화하여 코드 중복을 줄이고 유지보수성을 높입니다. Modport는 Interface 내에서 각 모듈(Master/Slave 등)의 관점에 따라 신호의 방향(input/output)을 제한하여 설계 오류를 방지합니다.' },
    { category: 'Computer Architecture', q: 'Cache Memory에서 Write-through와 Write-back의 차이는?', a: 'Write-through는 캐시에 쓸 때마다 메인 메모리에도 동시 업데이트하여 데이터 일관성을 유지하지만 대역폭 소모가 큽니다. Write-back은 캐시에만 먼저 쓰고, 블록이 캐시에서 교체(Eviction)될 때 메모리에 반영하여 성능이 좋으나 복잡한 일관성 관리가 필요합니다.' },
    { category: 'Verification (UVM)', q: 'UVM에서 Sequence와 Sequencer의 역할은 무엇인가요?', a: 'Sequence는 테스트 시나리오에 맞는 트랜잭션(데이터 패킷)들을 생성하는 흐름을 정의합니다. Sequencer는 Sequence로부터 트랜잭션을 받아 Driver로 전달하는 중재자 역할을 하며, 여러 Sequence의 우선순위를 관리합니다.' }
  ],
  offerData: {
    '삼성전자 (DS)': { salary: 90, growth: 85, wlb: 70, location: 80, culture: 75, base: '5,300만원', bonus: 'PS 최대 50%' },
    'SK하이닉스': { salary: 88, growth: 80, wlb: 75, location: 85, culture: 80, base: '5,300만원', bonus: 'PI/PS 탄탄함' },
    '리벨리온': { salary: 85, growth: 95, wlb: 65, location: 90, culture: 90, base: '5,000만원 + 스톡옵션', bonus: '빠른 기술 성장' },
    '망고부스트': { salary: 82, growth: 90, wlb: 80, location: 95, culture: 85, base: '4,800만원 + 스톡옵션', bonus: '서울대 연구공원' },
  },
  activePipelines: [
    { company: '리벨리온', stage: '사전 과제', progress: 60, expectedDate: '다음 주 화요일' },
    { company: 'LX세미콘', stage: '1차 면접', progress: 80, expectedDate: '이번 주 목요일' },
    { company: '텔레칩스', stage: '2차 면접', progress: 90, expectedDate: '이번 주 금요일' },
    { company: 'SK하이닉스', stage: '필기 전형', progress: 40, expectedDate: '이번 주 주말' },
    { company: '삼성전자 (DS)', stage: '서류 심사', progress: 20, expectedDate: '결과 대기중' },
  ],
  schedule: [
    { id: 1, date: 5, title: '리벨리온 과제 마감', type: 'task', time: '23:59' },
    { id: 2, date: 10, title: 'LX세미콘 1차 면접', type: 'interview', time: '14:00' },
    { id: 3, date: 12, title: '텔레칩스 2차 면접', type: 'interview', time: '16:30' },
    { id: 4, date: 15, title: '삼성전자 서류 마감', type: 'deadline', time: '18:00' },
    { id: 5, date: 20, title: '퀄컴 코리아 서류 마감', type: 'deadline', time: '17:00' },
    { id: 6, date: 25, title: 'SK하이닉스 SKCT', type: 'test', time: '10:00' },
    { id: 7, date: 25, title: '파두 코딩테스트', type: 'test', time: '14:00' },
    { id: 8, date: 28, title: '망고부스트 최종 면접', type: 'interview', time: '10:30' }
  ],
  mdFiles: [
    {
      id: 'md-1',
      title: '2026_삼성전자_DS_회로설계.md',
      company: '삼성전자',
      lastModified: '10분 전',
      content: `# 삼성전자 DS 회로설계 자기소개서\n\n## 1. 지원동기 및 포부\n초미세 공정의 한계를 극복하는 삼성전자 DS부문에서 저전력 고성능 아키텍처 설계에 기여하고 싶습니다.\n\n## 2. 직무 역량 경험\n- RISC-V 5-stage Pipelined Processor 설계 및 FPGA 검증\n- Data Hazard 해소를 위한 Forwarding Unit 구현 경험\n- UVM 기반의 검증 환경 구축 및 Coverage 100% 달성`
    }
  ]
};

// --- Custom Shared Components ---

const Sparkline = ({ data, colorClass, strokeColor }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 80 - 10}`).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-12 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${strokeColor}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${points} 100,100`} fill={`url(#grad-${strokeColor})`} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const PipelineBar = ({ label, stage, progress, expectedDate, colorHex }) => (
  <div className="flex items-center text-sm mb-4">
    <div className="w-32 font-bold text-slate-700 truncate">{label}</div>
    <div className="w-24 text-xs font-medium text-slate-500">{stage}</div>
    <div className="flex-1 relative h-2.5 bg-slate-100 rounded-full mx-3 overflow-hidden">
      <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: colorHex }} />
    </div>
    <div className="w-24 text-right text-xs text-slate-400">{expectedDate}</div>
  </div>
);

const SemiCircleGauge = ({ value, target, label, colorHex }) => {
  const radius = 40;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const targetAngle = (target / 100) * 180;
  const targetX = 50 - 45 * Math.cos(targetAngle * (Math.PI / 180));
  const targetY = 50 - 45 * Math.sin(targetAngle * (Math.PI / 180));

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 55" className="w-32 h-auto overflow-visible">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={colorHex} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
        <line x1="50" y1="50" x2={targetX} y2={targetY} stroke="#334155" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
      <div className="text-center mt-1">
        <p className="font-bold text-slate-800 text-lg">{value}%</p>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{label}</p>
        <p className="text-[9px] text-slate-400">목표: {target}%</p>
      </div>
    </div>
  );
};

const StrategyMatrix = ({ data }) => {
  return (
    <div className="relative w-full aspect-[4/3] border-l-2 border-b-2 border-slate-300 bg-slate-50/50 rounded-tr-lg">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/30 rounded-tr-lg"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-green-50/30"></div>
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-yellow-50/30"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-slate-100/50"></div>

      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-300 border-dashed border-t border-slate-400"></div>
      <div className="absolute top-0 left-1/2 w-px h-full bg-slate-300 border-dashed border-l border-slate-400"></div>
      
      <span className="absolute top-2 right-4 text-xs font-bold text-blue-400 opacity-60">1순위: 집중 공략</span>
      <span className="absolute top-2 left-4 text-xs font-bold text-yellow-500 opacity-60">도전: 상향 지원</span>
      <span className="absolute bottom-4 right-4 text-xs font-bold text-green-500 opacity-60">플랜B: 안정 지원</span>
      <span className="absolute bottom-4 left-4 text-xs font-bold text-slate-400 opacity-60">보류/재고</span>

      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-600 font-bold">합격 가능성 (Fit & Readiness) →</span>
      <span className="absolute top-1/2 -left-10 -translate-y-1/2 -rotate-90 text-xs text-slate-600 font-bold whitespace-nowrap">내 선호도 (Preference) →</span>

      {data.map(d => {
        const x = d.fit;
        const y = 100 - d.preference;
        return (
          <div 
            key={d.id} 
            className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className={`w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-white z-10 transition-transform group-hover:scale-150 ${
              d.type === '집중공략' ? 'bg-blue-500' :
              d.type === '상향지원' ? 'bg-yellow-400' :
              d.type === '안정지원' ? 'bg-green-400' : 'bg-slate-400'
            }`}></div>
            <span className="absolute top-4 text-[10px] font-bold text-slate-700 bg-white/80 px-1 rounded whitespace-nowrap opacity-100 transition-opacity">
              {d.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const FunnelChart = ({ data }) => {
  const maxCount = data[0].count;
  
  return (
    <div className="flex flex-col items-center w-full py-4 space-y-1">
      {data.map((item, index) => {
        const widthPercent = Math.max((item.count / maxCount) * 100, 15);
        const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-400', 'bg-emerald-400'];
        
        return (
          <div key={index} className="flex flex-col items-center w-full relative group cursor-pointer">
            <div 
              className={`h-10 ${colors[index]} rounded flex items-center justify-between px-4 text-white font-medium shadow-sm transition-all duration-300 group-hover:opacity-90`}
              style={{ width: `${widthPercent}%` }}
            >
              <span className={`text-xs ${widthPercent < 30 ? 'hidden' : 'block'}`}>{item.stage}</span>
              <span className={`text-sm font-bold ${widthPercent < 20 ? 'mx-auto' : ''}`}>{item.count}</span>
            </div>
            {index < data.length - 1 && (
              <div className="text-[10px] text-slate-400 my-0.5 font-medium flex items-center">
                 ↓ 전환율 {((data[index+1].count / item.count) * 100).toFixed(1)}%
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const RadarChart = ({ data1, data2, color1, color2 }) => {
  const axes = ['salary', 'wlb', 'growth', 'location', 'culture'];
  const labels = ['연봉/보상', '워라밸', '성장성', '위치/출퇴근', '조직문화'];
  const center = 150;
  const radius = 100;
  const angleStep = (Math.PI * 2) / axes.length;

  const getPoints = (dataObj) => {
    return axes.map((axis, i) => {
      const value = dataObj[axis] / 100;
      const x = center + radius * value * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + radius * value * Math.sin(i * angleStep - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full max-w-sm mx-auto overflow-visible font-sans">
      {[0.2, 0.4, 0.6, 0.8, 1].map((level, levelIdx) => (
        <polygon 
          key={levelIdx}
          points={axes.map((_, i) => `${center + radius * level * Math.cos(i * angleStep - Math.PI / 2)},${center + radius * level * Math.sin(i * angleStep - Math.PI / 2)}`).join(' ')}
          fill="none" stroke="#e2e8f0" strokeWidth="1"
        />
      ))}
      {axes.map((_, i) => (
        <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(i * angleStep - Math.PI / 2)} y2={center + radius * Math.sin(i * angleStep - Math.PI / 2)} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const x = center + (radius + 25) * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + (radius + 15) * Math.sin(i * angleStep - Math.PI / 2);
        return <text key={i} x={x} y={y} fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{labels[i]}</text>
      })}

      {data1 && <polygon points={getPoints(data1)} fill={color1} fillOpacity="0.3" stroke={color1} strokeWidth="2" />}
      {data2 && <polygon points={getPoints(data2)} fill={color2} fillOpacity="0.3" stroke={color2} strokeWidth="2" />}
    </svg>
  );
};


// --- Main Application ---
export default function HardwareJobDashboard() {
  const [activeTab, setActiveTab] = useState('portfolio'); // 시작 탭을 포트폴리오로 설정

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col shadow-xl z-20 shrink-0">
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white shadow-lg">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-base font-bold text-white tracking-wide leading-tight">HARDWARE<br/>CAREER BI</span>
        </div>
        
        <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
          <div className="px-6 text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Dashboards & Radar</div>
          <NavItem icon={<Home className="w-4 h-4" />} label="종합 현황 (Overview)" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<Radio className="w-4 h-4" />} label="업계 동향 레이더 (Industry Radar)" isActive={activeTab === 'industry'} onClick={() => setActiveTab('industry')} />
          
          <div className="px-6 text-[10px] font-bold text-slate-500 mb-2 mt-6 uppercase tracking-wider">Process & Target</div>
          <NavItem icon={<KanbanSquare className="w-4 h-4" />} label="지원 현황 칸반 (Kanban)" isActive={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} />
          <NavItem icon={<Target className="w-4 h-4" />} label="전략 매트릭스 (Strategy)" isActive={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
          <NavItem icon={<Building2 className="w-4 h-4" />} label="기업 분석 (Company)" isActive={activeTab === 'company'} onClick={() => setActiveTab('company')} />
          <NavItem icon={<Search className="w-4 h-4" />} label="JD 스캐너 (Resume Mapper)" isActive={activeTab === 'jdscanner'} onClick={() => setActiveTab('jdscanner')} />
          
          <div className="px-6 text-[10px] font-bold text-slate-500 mb-2 mt-6 uppercase tracking-wider">Decision & Networking</div>
          <NavItem icon={<Scale className="w-4 h-4" />} label="최종 오퍼 비교기 (Offer)" isActive={activeTab === 'offer'} onClick={() => setActiveTab('offer')} />
          <NavItem icon={<MapPin className="w-4 h-4" />} label="기업 위치 (Location Map)" isActive={activeTab === 'location'} onClick={() => setActiveTab('location')} />
          
          <div className="px-6 text-[10px] font-bold text-slate-500 mb-2 mt-6 uppercase tracking-wider">Assets & Prep Tools</div>
          <NavItem icon={<User className="w-4 h-4" />} label="포트폴리오 (Portfolio & Academics)" isActive={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
          <NavItem icon={<Terminal className="w-4 h-4" />} label="RTL 코테 트래커 (HDLBits)" isActive={activeTab === 'rtltracker'} onClick={() => setActiveTab('rtltracker')} />
          <NavItem icon={<Brain className="w-4 h-4" />} label="면접 훈련 (Flashcards)" isActive={activeTab === 'interview'} onClick={() => setActiveTab('interview')} />
          <NavItem icon={<CalendarIcon className="w-4 h-4" />} label="일정 캘린더 (Calendar)" isActive={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <NavItem icon={<FileText className="w-4 h-4" />} label="자소서 조회 (MD)" isActive={activeTab === 'coverletters'} onClick={() => setActiveTab('coverletters')} />
        </nav>
        
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">김</div>
             <div>
               <p className="text-xs font-bold text-white">김설계</p>
               <p className="text-[9px] text-slate-400">RTL 설계 / 검증 (Verilog)</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
        <header className="bg-white px-8 py-4 border-b border-slate-200 flex justify-between items-center z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {activeTab === 'overview' ? 'Executive Overview' : 
               activeTab === 'industry' ? 'Industry News Radar' :
               activeTab === 'kanban' ? 'Application Process Kanban' :
               activeTab === 'analysis' ? 'Target Strategy' :
               activeTab === 'company' ? 'Company Deep Dive' :
               activeTab === 'jdscanner' ? 'JD Keyword Scanner' :
               activeTab === 'offer' ? 'Offer Comparer' :
               activeTab === 'portfolio' ? 'Portfolio & Academics' :
               activeTab === 'rtltracker' ? 'RTL Coding Test Tracker' :
               activeTab === 'interview' ? 'Interview Prep & Flashcards' :
               activeTab === 'calendar' ? 'Monthly Schedule' :
               activeTab === 'location' ? 'Location Insights' :
               'Document Viewer'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">2026 시스템반도체 설계/검증 채용 대비</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-sm font-medium transition-colors">
              <Filter className="w-4 h-4" /> 상세 필터
            </button>
            <Info className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeTab === 'overview' ? <OverviewDashboard /> : 
           activeTab === 'industry' ? <IndustryRadarDashboard /> :
           activeTab === 'kanban' ? <KanbanDashboard /> :
           activeTab === 'analysis' ? <AnalysisDashboard /> :
           activeTab === 'company' ? <CompanyInfoDashboard /> :
           activeTab === 'jdscanner' ? <JdScannerDashboard /> :
           activeTab === 'offer' ? <OfferCompareDashboard /> :
           activeTab === 'portfolio' ? <PortfolioDashboard /> :
           activeTab === 'rtltracker' ? <RtlTrackerDashboard /> :
           activeTab === 'interview' ? <InterviewPrepDashboard /> :
           activeTab === 'calendar' ? <CalendarDashboard /> :
           activeTab === 'location' ? <LocationDashboard /> :
           <CoverLetterViewer />}
        </div>
      </main>
    </div>
  );
}

// --- Tab Views ---

function OverviewDashboard() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title={MOCK_DATA.kpi.totalApplied.label} value={MOCK_DATA.kpi.totalApplied.value} trend={MOCK_DATA.kpi.totalApplied.trend} data={MOCK_DATA.kpi.totalApplied.data} color="#6366f1" suffix="곳" />
        <KPICard title={MOCK_DATA.kpi.passRate.label} value={MOCK_DATA.kpi.passRate.value} trend={MOCK_DATA.kpi.passRate.trend} data={MOCK_DATA.kpi.passRate.data} color="#10b981" />
        <KPICard title={MOCK_DATA.kpi.activeTests.label} value={MOCK_DATA.kpi.activeTests.value} trend={MOCK_DATA.kpi.activeTests.trend} data={MOCK_DATA.kpi.activeTests.data} color="#f59e0b" suffix="건" />
        <KPICard title={MOCK_DATA.kpi.upcomingInterviews.label} value={MOCK_DATA.kpi.upcomingInterviews.value} trend={MOCK_DATA.kpi.upcomingInterviews.trend} data={MOCK_DATA.kpi.upcomingInterviews.data} color="#ec4899" suffix="건" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">채용 단계별 퍼널 <span className="text-xs font-normal text-slate-500 ml-2">Conversion Rate</span></h2>
            <p className="text-xs text-slate-500 mt-1">서류 합격 후 인적성/코테 통과율을 집중적으로 높여야 합니다.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <FunnelChart data={MOCK_DATA.funnel} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">진행 중인 주요 기업 <span className="text-xs font-normal text-slate-500 ml-2">Active Pipelines</span></h2>
            <button className="text-sm text-emerald-600 font-medium hover:underline">칸반 보드 가기</button>
          </div>
          <div className="space-y-2 mt-2">
             {MOCK_DATA.activePipelines.map((pl, i) => (
               <PipelineBar 
                  key={i} 
                  label={pl.company} 
                  stage={pl.stage} 
                  progress={pl.progress} 
                  expectedDate={pl.expectedDate} 
                  colorHex={i % 2 === 0 ? '#10b981' : '#94a3b8'} 
               />
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">내 핵심 역량 평가 <span className="text-xs font-normal text-slate-500 ml-2">Competency Readiness</span></h2>
            <p className="text-xs text-slate-500 mt-1">이력서 및 전공 지식 모의테스트 기준 (목표치 대비)</p>
          </div>
          <div className="flex justify-around items-end h-40 pb-4">
            <SemiCircleGauge value={MOCK_DATA.competency.frontend.value} target={MOCK_DATA.competency.frontend.target} label={MOCK_DATA.competency.frontend.label} colorHex="#4f46e5" />
            <SemiCircleGauge value={MOCK_DATA.competency.cs.value} target={MOCK_DATA.competency.cs.target} label={MOCK_DATA.competency.cs.label} colorHex="#10b981" />
            <SemiCircleGauge value={MOCK_DATA.competency.algorithm.value} target={MOCK_DATA.competency.algorithm.target} label={MOCK_DATA.competency.algorithm.label} colorHex="#f59e0b" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h2 className="text-lg font-bold text-slate-800 mb-4">최근 주요 알림 <span className="text-xs font-normal text-slate-500 ml-2">Recent Alerts</span></h2>
           <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg bg-red-50/50 border border-red-100">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></div>
                 <div>
                   <p className="text-sm font-bold text-slate-800">SK하이닉스 인적성(SKCT) D-3</p>
                   <p className="text-xs text-slate-600 mt-1">수리/추리 영역 기출문제 모의고사를 추천합니다.</p>
                 </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 border border-transparent transition-colors">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                 <div>
                   <p className="text-sm font-bold text-slate-800">망고부스트 최종 합격!</p>
                   <p className="text-xs text-slate-600 mt-1">오퍼 비교기 탭에서 연봉 및 스톡옵션 조건을 타 기업과 비교해보세요.</p>
                 </div>
              </div>
              <div className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 border border-transparent transition-colors">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                 <div>
                   <p className="text-sm font-bold text-slate-800">리벨리온 실무진 직무 면접 확정</p>
                   <p className="text-xs text-slate-600 mt-1">컴퓨터 구조(Computer Architecture) 관련 플래시카드를 복습하세요.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// 📌 [신규] B 2-1. RTL 코딩테스트 및 HDLBits 트래커
function RtlTrackerDashboard() {
  const { stats, errorLog } = MOCK_DATA.rtlTracker;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="mb-4">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">RTL Coding Tracker</h2>
        <p className="text-sm text-slate-500 mt-1">HDLBits 문제 풀이 현황 및 하드웨어 설계 코딩테스트 대비 취약점 분석</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HDLBits 정답률 시각화 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-500"/> 유형별 정답률 (HDLBits Mastery)
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Total: 135/180 solved</span>
          </div>
          
          <div className="space-y-5">
            {stats.map((stat, idx) => {
              const color = stat.score > 80 ? 'bg-emerald-500' : stat.score > 60 ? 'bg-blue-500' : 'bg-red-500';
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
                    <span>{stat.category}</span>
                    <span>{stat.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${stat.score}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 빈출 오답 노트 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500"/> 회로 타이밍/로직 에러 오답 노트
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {errorLog.map(err => (
              <div key={err.id} className="p-4 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-red-700 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4"/> {err.type}
                  </h4>
                  <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    발생 빈도: {err.count}회
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 mb-1">카테고리: {err.code}</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                  {err.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 📌 [신규] B 2-2. JD 스캐너 & 자소서 매퍼
function JdScannerDashboard() {
  const [jdText, setJdText] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScan = () => {
    if(!jdText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">JD Keyword Scanner</h2>
        <p className="text-sm text-slate-500 mt-1">채용 공고(Job Description)를 분석하여 내 이력서/포트폴리오와의 매칭률을 계산합니다.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" /> 공고 텍스트 붙여넣기
            </h3>
            <button 
              onClick={handleScan}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>} 분석하기
            </button>
          </div>
          <textarea 
            className="flex-1 p-5 text-sm text-slate-700 focus:outline-none resize-none bg-slate-50/50"
            placeholder="타겟 기업의 모집 요강, 자격 요건, 우대 사항을 여기에 붙여넣어 주세요..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-500" /> 이력서 매칭 결과 (Resume Mapper)
            </h3>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {!analyzed && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <Search className="w-12 h-12 opacity-30"/>
                <p className="text-sm font-medium">채용 공고 텍스트를 분석해보세요.</p>
              </div>
            )}
            {loading && (
               <div className="h-full flex flex-col items-center justify-center text-blue-500 gap-3">
                <RefreshCw className="w-10 h-10 animate-spin"/>
                <p className="text-sm font-bold animate-pulse">JD 키워드 추출 중...</p>
              </div>
            )}
            {analyzed && !loading && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500 mb-2">포트폴리오 종합 매칭률</p>
                  <div className="inline-flex items-end justify-center gap-1">
                    <span className="text-5xl font-black text-emerald-600">82</span><span className="text-xl font-bold text-slate-400 mb-1">%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 mt-4 max-w-sm mx-auto">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `82%` }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500"/> 내 이력서에 포함된 키워드 (Matched)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Verilog', 'SystemVerilog', 'UVM', 'AMBA AXI', 'FPGA Prototyping', 'Low Power Design'].map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs font-bold">{kw}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500"/> 보완이 필요한 핵심 키워드 (Missing)
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['PCIe Gen5', 'Formal Verification', 'CDC Analysis'].map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-bold">{kw}</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg mt-3">💡 <strong className="text-slate-700">팁:</strong> 위 누락된 키워드 관련 전공 과목 수강 이력이나, 진행 중인 스터디(Study Lab) 기록을 자소서에 보강해 보세요.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 📌 [신규] C 3-3. 업계 동향 레이더
function IndustryRadarDashboard() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Industry News Radar</h2>
          <p className="text-sm text-slate-500 mt-1">팹리스, 파운드리 및 반도체 생태계 최신 동향 크롤링 피드</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer">All</span>
          <span className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-50">Foundry</span>
          <span className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-50">Fabless/AI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_DATA.industryNews.map(news => (
          <div key={news.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col group cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                news.tag === 'Foundry' ? 'bg-orange-100 text-orange-700' :
                news.tag === 'AI 반도체' ? 'bg-purple-100 text-purple-700' :
                news.tag === 'EDA' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {news.tag}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors"/>
            </div>
            <h3 className="font-bold text-slate-800 text-lg leading-snug mb-4 group-hover:text-blue-700 transition-colors">
              {news.title}
            </h3>
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><Newspaper className="w-3.5 h-3.5"/> {news.source}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {news.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 📌 [업데이트] A. 포트폴리오에 "대학 수강 강좌(Coursework)" 탭 포함 및 완전 복구
function PortfolioDashboard() {
  const { portfolio } = MOCK_DATA;
  const [activeSubTab, setActiveSubTab] = useState('showcase'); // showcase | study | academics

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Portfolio & Academics</h2>
          <p className="text-sm text-slate-500 mt-1">디지털 설계/검증 프로젝트, 기술 스택 및 학부 수강 이력</p>
        </div>
      </div>

      {/* 상단 4단 위젯 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center text-xl font-bold border-4 border-slate-100 shadow-sm">김</div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">김설계</h3>
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">github.com/kim-rtl</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700">포트폴리오 완성도</span>
              <span className="font-bold text-blue-600">{portfolio.readiness}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${portfolio.readiness}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-emerald-500"/> 핵심 기술 스택
          </h3>
          <div className="space-y-3">
            {portfolio.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <span className="w-28 font-bold text-slate-600 truncate">{skill.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                </div>
                <span className="w-8 text-right text-xs font-bold text-slate-400">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-blue-500"/> 학습 중인 기술
          </h3>
          <div className="space-y-4">
            {portfolio.learningSkills.map((skill, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700 truncate pr-2">{skill.name}</span>
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold whitespace-nowrap">{skill.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-8 text-right">{skill.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500"/> 깃허브 기여도
            </h3>
            <span className="text-xl font-black text-slate-800">{portfolio.githubCommits}<span className="text-xs text-slate-500 font-medium ml-1">commits</span></span>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-x-auto overflow-y-hidden pb-2">
             <div className="flex gap-1">
                {Array.from({length: 15}).map((_, w) => (
                  <div key={w} className="flex flex-col gap-1">
                    {Array.from({length: 7}).map((_, d) => {
                       const activityLevel = (Math.sin(w) + Math.cos(d) + (w/15)*3 + Math.random()) / 2;
                       const bgClass = activityLevel > 2 ? 'bg-emerald-600' : activityLevel > 1.2 ? 'bg-emerald-400' : activityLevel > 0.5 ? 'bg-emerald-200' : 'bg-slate-100';
                       return <div key={d} className={`w-2.5 h-2.5 rounded-sm ${bgClass}`}></div>
                    })}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* 하단 탭 영역 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
        <div className="flex gap-6 border-b border-slate-200 mb-6">
          <button onClick={() => setActiveSubTab('showcase')} className={`pb-3 flex items-center gap-2 font-bold text-sm transition-colors relative ${activeSubTab === 'showcase' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Briefcase className="w-4 h-4" /> 프로젝트 Showcase
            {activeSubTab === 'showcase' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
          </button>
          <button onClick={() => setActiveSubTab('academics')} className={`pb-3 flex items-center gap-2 font-bold text-sm transition-colors relative ${activeSubTab === 'academics' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Book className="w-4 h-4" /> 학부 수강 로드맵 (Coursework)
            {activeSubTab === 'academics' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></div>}
          </button>
          <button onClick={() => setActiveSubTab('study')} className={`pb-3 flex items-center gap-2 font-bold text-sm transition-colors relative ${activeSubTab === 'study' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <BookOpen className="w-4 h-4" /> 학습 & 연구 노트 (Study Lab)
            {activeSubTab === 'study' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>}
          </button>
        </div>
        
        {activeSubTab === 'showcase' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-300">
            {portfolio.projects.map(project => (
              <div key={project.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col">
                <h4 className="font-bold text-slate-800 text-lg line-clamp-1 mb-2">{project.name}</h4>
                <p className="text-[11px] font-bold text-slate-400 mb-3">{project.date} • <span className="text-blue-600">{project.role}</span></p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{t}</span>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed"><span className="text-emerald-600 font-bold mr-1">성과:</span>{project.impact}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'academics' && (
          <div className="animate-in fade-in duration-300">
             <p className="text-sm text-slate-500 mb-6">학부 시절 수강한 전공 핵심 과목과 직무 연관성을 시각적으로 관리합니다. (Coursework Mapper)</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.coursework.map(course => (
                  <div key={course.id} className="flex flex-col p-4 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${course.relevance > 85 ? 'bg-emerald-500' : 'bg-blue-400'}`}></div> {course.name}
                      </h4>
                      <span className="text-xl font-black text-slate-700">{course.grade}</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      {course.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded font-bold shadow-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeSubTab === 'study' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-sm"><Rocket className="w-4 h-4 text-indigo-500" /> 진행 중인 토이 프로젝트 / 스터디</h4>
              <div className="space-y-4">
                {portfolio.studyProjects.map(sp => (
                  <div key={sp.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2"><h5 className="font-bold text-slate-800 text-sm">{sp.name}</h5><span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">{sp.tech}</span></div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${sp.progress}%` }}></div></div><span className="text-xs font-bold text-slate-500">{sp.progress}%</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className="flex items-start gap-2 text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium">현재:</span> {sp.status}</p>
                      <p className="flex items-start gap-2 text-slate-600"><AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /> <span className="font-medium">Next:</span> {sp.next}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><PenTool className="w-4 h-4 text-amber-500" /> 학습 복습 노트 (TIL & Log)</h4><button className="text-[11px] font-bold text-slate-500 hover:text-indigo-600">전체 보기</button></div>
              <div className="space-y-3">
                {portfolio.studyNotes.map(note => (
                  <div key={note.id} className="border border-slate-200 rounded-xl p-4 hover:border-amber-300 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-1.5"><span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">{note.category}</span><span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Clock className="w-3 h-3"/>{note.date}</span></div>
                    <h5 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-amber-600 transition-colors">{note.title}</h5>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{note.preview}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 기존 대시보드 컴포넌트 유지 영역 ---
function KanbanDashboard() {
  const columns = [
    { id: 'preparing', title: '준비/서류제출', color: 'border-slate-300', bg: 'bg-slate-50' },
    { id: 'test', title: '필기/코테/과제', color: 'border-blue-400', bg: 'bg-blue-50/50' },
    { id: 'interview1', title: '1차 실무면접', color: 'border-purple-400', bg: 'bg-purple-50/50' },
    { id: 'interview2', title: '2차/임원면접', color: 'border-orange-400', bg: 'bg-orange-50/50' },
    { id: 'passed', title: '최종 합격', color: 'border-emerald-500', bg: 'bg-emerald-50/50' },
  ];
  return (
    <div className="h-full flex flex-col max-w-[1400px] mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><KanbanSquare className="w-5 h-5 text-indigo-500"/> Kanban Board</h2>
        <p className="text-sm text-slate-500 mt-1">채용 파이프라인 전형별 진행 상황</p>
      </div>
      <div className="flex-1 overflow-x-auto flex gap-4 pb-4">
        {columns.map(col => {
          const columnTasks = MOCK_DATA.strategyMatrix.filter(c => c.stage === col.id);
          return (
            <div key={col.id} className={`w-72 shrink-0 rounded-xl border-t-4 ${col.color} ${col.bg} border-x border-b border-slate-200 shadow-sm flex flex-col`}>
              <div className="p-3 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
                <h3 className="font-bold text-slate-700 text-sm">{col.title}</h3>
                <span className="bg-white text-slate-500 text-xs font-bold px-2 py-0.5 rounded shadow-sm border border-slate-200">{columnTasks.length}</span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {columnTasks.map(task => (
                  <div key={task.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{task.name}</h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${task.type === '집중공략' ? 'bg-blue-100 text-blue-700' : task.type === '상향지원' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mb-3 flex items-center gap-1"><MapPin className="w-3 h-3"/> {task.location}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400">선호도: {task.preference}%</span><button className="text-slate-300 hover:text-blue-500"><ExternalLink className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OfferCompareDashboard() {
  const [comp1, setComp1] = useState('삼성전자 (DS)');
  const [comp2, setComp2] = useState('리벨리온');
  
  const companyNames = Object.keys(MOCK_DATA.offerData);
  const data1 = MOCK_DATA.offerData[comp1];
  const data2 = MOCK_DATA.offerData[comp2];

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
          <Scale className="w-6 h-6 text-emerald-500"/> Offer Comparer
        </h2>
        <p className="text-sm text-slate-500 mt-1">최종 합격한 기업들의 처우와 조건을 시각적으로 비교 분석합니다.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-blue-600 flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> 회사 A</label>
            <select value={comp1} onChange={(e)=>setComp1(e.target.value)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-blue-500 min-w-[160px]">
              {companyNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
          <div className="text-slate-300 font-black text-xl italic">VS</div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-emerald-600 flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 회사 B</label>
            <select value={comp2} onChange={(e)=>setComp2(e.target.value)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-emerald-500 min-w-[160px]">
              {companyNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="w-full max-w-sm">
            <RadarChart data1={data1} data2={data2} color1="#3b82f6" color2="#10b981" />
          </div>

          <div className="w-full max-w-sm bg-slate-50 rounded-xl p-5 border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left font-medium text-slate-400 text-xs">항목</th>
                  <th className="py-2 text-right font-bold text-blue-600">{comp1}</th>
                  <th className="py-2 text-right font-bold text-emerald-600">{comp2}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                <tr><td className="py-3 text-slate-600 font-medium">기본급 (Base)</td><td className="py-3 text-right font-bold text-slate-800">{data1.base}</td><td className="py-3 text-right font-bold text-slate-800">{data2.base}</td></tr>
                <tr><td className="py-3 text-slate-600 font-medium">보너스/인센티브</td><td className="py-3 text-right font-bold text-slate-800 text-[11px]">{data1.bonus}</td><td className="py-3 text-right font-bold text-slate-800 text-[11px]">{data2.bonus}</td></tr>
                <tr><td className="py-3 text-slate-600 font-medium">연봉/보상</td><td className="py-3 text-right font-bold text-slate-800">{data1.salary}점</td><td className="py-3 text-right font-bold text-slate-800">{data2.salary}점</td></tr>
                <tr><td className="py-3 text-slate-600 font-medium">기술 성장성</td><td className="py-3 text-right font-bold text-slate-800">{data1.growth}점</td><td className="py-3 text-right font-bold text-slate-800">{data2.growth}점</td></tr>
                <tr><td className="py-3 text-slate-600 font-medium">조직 문화</td><td className="py-3 text-right font-bold text-slate-800">{data1.culture}점</td><td className="py-3 text-right font-bold text-slate-800">{data2.culture}점</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function InterviewPrepDashboard() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500"/> Interview Flashcards
          </h2>
          <p className="text-sm text-slate-500 mt-1">디지털 회로 설계 및 검증 직무 전공 면접 기출/예상 질문 은행</p>
        </div>
        <button className="text-xs bg-slate-800 text-white font-bold px-4 py-2 rounded-lg hover:bg-slate-700">무작위 셔플 모드</button>
      </div>

      <div className="space-y-4">
        {MOCK_DATA.flashcards.map((fc, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div 
                className="p-5 flex justify-between items-start cursor-pointer hover:bg-slate-50"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="flex gap-3 items-start">
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded shrink-0">{fc.category}</span>
                  <h3 className="font-bold text-slate-800 text-base leading-snug">{fc.q}</h3>
                </div>
                <div className="shrink-0 ml-4 text-slate-400">
                  <ChevronUp className={`w-5 h-5 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
                </div>
              </div>
              
              {isOpen && (
                <div className="p-5 pt-0 bg-slate-50 border-t border-slate-100 mt-2">
                  <div className="mt-4 flex gap-3 items-start">
                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600 leading-relaxed font-medium bg-white p-4 rounded-lg border border-slate-200 shadow-sm w-full">
                      {fc.a}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded font-bold hover:bg-red-100">다시 보기 (Hard)</button>
                    <button className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded font-bold hover:bg-emerald-100">완벽 숙지 (Easy)</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalysisDashboard() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <div className="mb-6">
             <h3 className="text-lg font-bold text-slate-800">타겟 기업 우선순위 매트릭스 <span className="text-xs font-normal text-slate-500 ml-2">Strategy Matrix</span></h3>
             <p className="text-xs text-slate-500 mt-1">기업 선호도와 합격 기대율(직무적합도)을 기반으로 리소스 분배를 결정합니다.</p>
           </div>
           <div className="flex-1 px-8 pb-10">
             <StrategyMatrix data={MOCK_DATA.strategyMatrix} />
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">주차별 지원 및 통과 트렌드 <span className="text-xs font-normal text-slate-500 ml-2">Weekly Trends</span></h3>
          </div>
          <div className="h-64 relative flex items-end justify-between pb-8 px-4 border-b border-slate-200">
             {[3, 5, 8, 12, 10, 6, 4, 2].map((v, i) => (
               <div key={i} className="flex flex-col items-center justify-end h-full w-full group">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-2 absolute z-10 shadow-sm" style={{ bottom: `${v * 8 + 30}px` }}></div>
                 <div className="w-6 bg-indigo-100 rounded-t border-t-2 border-indigo-400 transition-all duration-300 group-hover:bg-indigo-200" style={{ height: `${v * 15}px` }}></div>
                 <span className="absolute -bottom-6 text-xs font-medium text-slate-500">{i+1}주차</span>
               </div>
             ))}
             <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
               <path d="M 40 200 L 130 180 L 220 150 L 310 100 L 400 120 L 490 160 L 580 180 L 670 190" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
             </svg>
          </div>
          <div className="flex justify-center gap-6 mt-10 text-xs font-medium text-slate-600">
             <span className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-200 border-t-2 border-indigo-400"></div> 지원 횟수 (건)</span>
             <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> 서류 합격 (건)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyInfoDashboard() {
  const [selectedId, setSelectedId] = useState(1);
  const company = MOCK_DATA.strategyMatrix.find(c => c.id === selectedId);
  const details = MOCK_DATA.companyDetails[selectedId] || {
    description: "해당 기업에 대한 세부 분석 데이터가 아직 작성되지 않았습니다. 외부 정보 연동 또는 수동 입력을 통해 데이터를 채워주세요.",
    roleDescription: "해당 직무에 대한 세부 분석 데이터가 아직 작성되지 않았습니다.",
    techStack: ["Verilog / SV"],
    news: ["관련 뉴스가 없습니다."]
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Company Analysis</h2>
          <p className="text-sm text-slate-500 mt-1">타겟 반도체 기업 비즈니스 현황 및 직무 요구사항 심층 분석</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-[600px]">
        <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800">분석 대상 기업 리스트</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {[...MOCK_DATA.strategyMatrix].sort((a,b) => b.preference - a.preference).map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-colors border ${
                  selectedId === c.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-800 block text-lg">{c.name}</span>
                  <span className="text-xs text-slate-500 font-medium mt-1 inline-block flex items-center gap-1">
                    <MapPin className="w-3 h-3"/> {c.location}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.type === '집중공략' ? 'bg-blue-100 text-blue-700' :
                    c.type === '상향지원' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>{c.type}</span>
                  <p className="text-xs font-bold text-slate-600 mt-2">선호도 {c.preference}%</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-y-auto relative">
          <div className="p-8 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden shrink-0">
             <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none">
                <Building2 className="w-64 h-64" />
             </div>
             <div className="relative z-10 flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-3 mb-2">
                   <h2 className="text-3xl font-black text-slate-900">{company.name}</h2>
                   <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-md shadow-sm">HW Design / Verification</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                <Building2 className="w-5 h-5 text-blue-500" /> 기업 개요 (Company Overview)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{details.description}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                <Briefcase className="w-5 h-5 text-emerald-500" /> 직무 상세 (Role Description)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-lg border border-slate-100">
                {details.roleDescription}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                <Code2 className="w-5 h-5 text-indigo-500" /> 핵심 요구 기술 (Tech Stack)
              </h3>
              <div className="flex flex-wrap gap-2">
                {details.techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-sm font-bold shadow-sm">{tech}</span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                <Newspaper className="w-5 h-5 text-amber-500" /> 최근 동향 및 뉴스 (Recent News)
              </h3>
              <ul className="space-y-3">
                {details.news.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-600 font-medium items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>{item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarDashboard() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totalCells = 35;
  const sortedSchedule = [...MOCK_DATA.schedule].sort((a, b) => a.date - b.date);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">March 2026</h2>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center">
            {daysOfWeek.map((day, idx) => (
              <div key={day} className={`py-3 text-xs font-bold uppercase tracking-wider ${idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-slate-500'}`}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-1 bg-slate-200 gap-px">
            {Array.from({ length: totalCells }).map((_, index) => {
              const dayNumber = index + 1;
              const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
              const isToday = dayNumber === 10;
              const dayEvents = isCurrentMonth ? MOCK_DATA.schedule.filter(s => s.date === dayNumber) : [];

              return (
                <div key={index} className={`bg-white p-2 flex flex-col transition-colors ${!isCurrentMonth ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                  {isCurrentMonth && (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : index % 7 === 0 ? 'text-red-500' : 'text-slate-700'}`}>{dayNumber}</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
                        {dayEvents.map(event => (
                          <div key={event.id} className="px-2 py-1 text-[10px] font-bold rounded border truncate cursor-pointer bg-slate-100">{event.time} {event.title}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> 다가오는 주요 일정</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {sortedSchedule.filter(s => s.date >= 10).map(event => (
              <div key={event.id} className="relative pl-4 border-l-2 border-slate-200">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white bg-blue-500"></div>
                <div className="mb-1 text-xs font-bold text-slate-500">3월 {event.date}일 ({event.time})</div>
                <div className="font-bold text-slate-800 mb-1">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeafletMap({ selectedCompany, onSelectCompany, data }) {
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);
  const markersRef = React.useRef({});

  React.useEffect(() => {
    let isMounted = true;
    const initMap = () => {
      if (!isMounted || !mapRef.current || mapInstance.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: false }).setView([36.5, 127.5], 7);
      mapInstance.current = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);

      data.forEach(company => {
        const colorClass = company.location.includes('서울') ? 'bg-blue-500' : company.location.includes('경기') ? 'bg-emerald-500' : 'bg-amber-500';
        const icon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div class="w-5 h-5 ${colorClass} rounded-full border-[3px] border-white shadow-lg relative"><div class="absolute inset-0 rounded-full animate-ping opacity-50 ${colorClass}"></div></div>`,
          iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -10]
        });
        const marker = L.marker([company.lat, company.lng], { icon }).addTo(map);
        marker.bindPopup(`<div class="font-bold text-slate-800 text-sm">${company.name}</div>`);
        marker.on('click', () => onSelectCompany(company.id));
        markersRef.current[company.id] = marker;
      });
    };

    if (window.L) { initMap(); } 
    else {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link'); link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
      }
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script'); script.id = 'leaflet-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.async = true; script.onload = initMap; document.head.appendChild(script);
      } else { document.getElementById('leaflet-js').addEventListener('load', initMap); }
    }
    return () => { isMounted = false; if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [data, onSelectCompany]);

  React.useEffect(() => {
    if (mapInstance.current && window.L) {
      if (selectedCompany) {
        mapInstance.current.flyTo([selectedCompany.lat, selectedCompany.lng], 13, { duration: 1.5 });
        const marker = markersRef.current[selectedCompany.id];
        if (marker && !marker.isPopupOpen()) marker.openPopup();
      } else {
        mapInstance.current.flyTo([36.5, 127.5], 7, { duration: 1.5 });
        mapInstance.current.closePopup();
      }
    }
  }, [selectedCompany]);

  return <div ref={mapRef} className="w-full h-full" style={{ zIndex: 0 }}></div>;
}

function LocationDashboard() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const selectedCompany = MOCK_DATA.strategyMatrix.find(c => c.id === selectedCompanyId);
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Geographic Insights</h2>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        <div className="lg:col-span-2 bg-slate-50 rounded-xl border border-slate-200 shadow-inner flex flex-col overflow-hidden relative z-0">
          <div className="absolute top-6 right-6 z-[1000]">
            <button onClick={() => setSelectedCompanyId(null)} className="bg-white/90 backdrop-blur-md p-2.5 rounded-lg shadow-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <MapPin className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-full"><LeafletMap selectedCompany={selectedCompany} onSelectCompany={setSelectedCompanyId} data={MOCK_DATA.strategyMatrix} /></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50"><h3 className="font-bold text-slate-800">목록에서 선택</h3></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {MOCK_DATA.strategyMatrix.map(company => (
              <button key={company.id} onClick={() => setSelectedCompanyId(company.id)} className={`w-full text-left p-4 rounded-lg flex flex-col gap-2 transition-colors border ${selectedCompanyId === company.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-transparent border-b-slate-100'}`}>
                <div className="flex justify-between items-center"><span className="font-bold text-slate-800">{company.name}</span></div>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium"><MapPin className="w-3 h-3 text-slate-400" />{company.location}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverLetterViewer() {
  const selectedFile = MOCK_DATA.mdFiles[0];
  const renderMarkdown = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('## ')) return <h2 key={index} className="text-lg font-bold text-slate-800 mt-6 mb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-black text-slate-900 mt-2 mb-4 pb-2 border-b border-slate-200">{line.replace('# ', '')}</h1>;
      if (line.startsWith('- ')) return <li key={index} className="ml-5 list-disc my-1 text-slate-700 leading-relaxed">{line.replace('- ', '')}</li>;
      if (line.trim() === '') return <br key={index} className="my-1" />;
      return <p key={index} className="mb-2 leading-relaxed text-slate-700">{line}</p>;
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] max-w-[1400px] mx-auto flex gap-6">
      <div className="w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center"><h3 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-blue-500" />로컬 MD 보관함</h3></div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <button className="w-full text-left p-3 rounded-lg flex flex-col gap-1 bg-blue-50 border border-blue-200">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-2 truncate"><FileText className="w-4 h-4 text-blue-500" />{selectedFile.title}</span>
          </button>
        </div>
      </div>
      <div className="w-2/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-10 font-sans"><div className="max-w-prose mx-auto">{renderMarkdown(selectedFile.content)}</div></div>
      </div>
    </div>
  );
}

// Shared simple NavItem component
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all border-l-4 ${isActive ? 'bg-slate-800 border-blue-500 text-white font-bold' : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
      {React.cloneElement(icon, { className: `w-4 h-4 ${isActive ? 'text-blue-500' : ''}` })}
      <span>{label}</span>
    </button>
  );
}

function KPICard({ title, value, trend, data, color, suffix = '' }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-slate-300 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2"><h3 className="text-sm font-bold text-slate-500">{title}</h3></div>
      <div className="flex items-baseline gap-1 mb-3"><span className="text-3xl font-black text-slate-800 tracking-tight">{value}</span><span className="text-sm font-medium text-slate-500">{suffix}</span></div>
      <div className="mb-4"><span className={`inline-flex items-center px-1.5 py-0.5 text-[11px] font-bold rounded ${isPositive ? 'text-emerald-500 bg-emerald-50' : 'text-slate-500 bg-slate-100'}`}>{trend} 이번 달</span></div>
      <div className="-mx-1 mt-auto"><Sparkline data={data} strokeColor={color} /></div>
    </div>
  );
}