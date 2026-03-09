import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  FileText,
  Home,
  KanbanSquare,
  MapPin,
  Radio,
  Scale,
  Search,
  Target,
  Terminal,
  User,
} from "lucide-react";
import type { DashboardTab, NavSection } from "../types";

type NavItem = {
  id: DashboardTab;
  label: string;
  icon: LucideIcon;
};

export type DashboardTabMeta = {
  title: string;
  subtitle: string;
};

export type DashboardShellCopy = {
  brandTitle: string;
  brandSubtitle: string;
  workspaceTitle: string;
  workspaceSubtitle: string;
  headerBadgeLabel: string;
  saveButtonLabel: string;
  helpButtonLabel: string;
};

export const DASHBOARD_TAB_META: Record<DashboardTab, DashboardTabMeta> = {
  overview: {
    title: "전체 현황",
    subtitle: "우선순위, 진행 파이프라인, 역량 지표를 한 화면에서 확인합니다.",
  },
  industry: {
    title: "산업 동향",
    subtitle: "채용 시장 변화와 반도체 업계 흐름을 태그 기준으로 빠르게 확인합니다.",
  },
  kanban: {
    title: "지원 칸반",
    subtitle: "기업별 진행 상태를 단계별 카드 보드로 관리합니다.",
  },
  strategy: {
    title: "전략 매트릭스",
    subtitle: "적합도와 선호도를 기준으로 지원 전략을 점검합니다.",
  },
  company: {
    title: "기업 분석",
    subtitle: "선택한 기업의 공고, 핵심 기술, 관련 메모를 구조화해서 봅니다.",
  },
  jdscanner: {
    title: "JD 스캐너",
    subtitle: "공고 텍스트와 현재 포트폴리오 키워드를 비교해 부족한 항목을 찾습니다.",
  },
  offer: {
    title: "오퍼 비교",
    subtitle: "보상, 성장, 위치, 문화 기준으로 선택지를 비교합니다.",
  },
  location: {
    title: "위치 판단",
    subtitle: "기업별 통근 메모, 지도, 네이버 길찾기를 한 화면에서 확인합니다.",
  },
  portfolio: {
    title: "포트폴리오",
    subtitle: "프로젝트, 학습, 학업 이력을 서류 관점에서 정리합니다.",
  },
  checklist: {
    title: "지원 체크리스트",
    subtitle: "공고별 제출 준비 상태와 메모를 추적합니다.",
  },
  interview: {
    title: "면접 준비",
    subtitle: "플래시카드와 경험 연결을 통해 답변 밀도를 높입니다.",
  },
  calendar: {
    title: "캘린더",
    subtitle: "면접, 과제, 마감 일정을 월간 기준으로 관리합니다.",
  },
  coverletters: {
    title: "자기소개서",
    subtitle: "파일 목록과 메타데이터, 본문, 미리보기를 함께 관리합니다.",
  },
};

export const DASHBOARD_NAV_SECTIONS = [
  {
    title: "대시보드",
    items: [
      { id: "overview", label: "전체 현황", icon: Home },
      { id: "industry", label: "산업 동향", icon: Radio },
    ] satisfies NavItem[],
  },
  {
    title: "지원 프로세스",
    items: [
      { id: "kanban", label: "칸반", icon: KanbanSquare },
      { id: "strategy", label: "전략", icon: Target },
      { id: "company", label: "기업 분석", icon: Building2 },
      { id: "jdscanner", label: "JD 스캐너", icon: Search },
    ] satisfies NavItem[],
  },
  {
    title: "의사결정",
    items: [
      { id: "offer", label: "오퍼 비교", icon: Scale },
      { id: "location", label: "위치 판단", icon: MapPin },
    ] satisfies NavItem[],
  },
  {
    title: "자료 준비",
    items: [
      { id: "portfolio", label: "포트폴리오", icon: User },
      { id: "checklist", label: "체크리스트", icon: Terminal },
      { id: "coverletters", label: "자기소개서", icon: FileText },
    ] satisfies NavItem[],
  },
  {
    title: "실전 대응",
    items: [
      { id: "interview", label: "면접 준비", icon: FileText },
      { id: "calendar", label: "캘린더", icon: CalendarDays },
    ] satisfies NavItem[],
  },
] satisfies NavSection[];

export const DASHBOARD_SHELL_COPY: DashboardShellCopy = {
  brandTitle: "하드웨어 취업 BI",
  brandSubtitle: "Structured Dashboard",
  workspaceTitle: "지원자 워크스페이스",
  workspaceSubtitle: "RTL Design / Verification",
  headerBadgeLabel: "구조화 리팩토링 반영",
  saveButtonLabel: "상태 저장",
  helpButtonLabel: "도움말",
};

export function sanitizeDashboardBannerMessage(message: string | null) {
  if (!message) {
    return null;
  }

  return /\d{2}:\d{2}/.test(message) ? null : message;
}
