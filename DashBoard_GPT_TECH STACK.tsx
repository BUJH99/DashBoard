"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, CalendarDays, FileText, MapPin, Search, Sparkles, Target, TrendingUp, ClipboardList, MessageSquare, Plus, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stageOrder = [
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

const companiesSeed = [
  {
    id: 1,
    name: "네이버",
    industry: "IT/플랫폼",
    type: "대기업",
    size: "대규모",
    roleFit: 88,
    interest: 95,
    growth: 90,
    location: "성남 / 하이브리드",
    benefits: "점심 지원, 복지포인트, 유연근무",
    memo: "데이터 기반 서비스 개선 경험 강조 필요",
  },
  {
    id: 2,
    name: "카카오",
    industry: "IT/플랫폼",
    type: "대기업",
    size: "대규모",
    roleFit: 82,
    interest: 90,
    growth: 87,
    location: "판교 / 하이브리드",
    benefits: "유연근무, 사내카페, 성장환경",
    memo: "협업/커뮤니케이션 사례 보강 필요",
  },
  {
    id: 3,
    name: "토스",
    industry: "핀테크",
    type: "중견/유니콘",
    size: "중대형",
    roleFit: 79,
    interest: 91,
    growth: 94,
    location: "서울 / 오피스 중심",
    benefits: "장비지원, 스낵바, 자율문화",
    memo: "빠른 실행과 실험 경험을 강조",
  },
];

const postingsSeed = [
  {
    id: 101,
    company: "네이버",
    title: "서비스 데이터 분석 인턴",
    role: "데이터 분석",
    deadline: "2026-03-12",
    stage: "자소서작성중",
    fit: 88,
    burden: 55,
    urgency: 90,
    locationFit: 84,
    growth: 90,
    selfIntroReady: 60,
    keywords: ["SQL", "A/B Test", "지표설계"],
    summary: "핵심지표 설계, 사용자 행동 분석, 협업 커뮤니케이션 역량이 중요",
  },
  {
    id: 102,
    company: "카카오",
    title: "프로덕트 데이터 분석가 신입",
    role: "데이터 분석",
    deadline: "2026-03-20",
    stage: "직무분석완료",
    fit: 82,
    burden: 68,
    urgency: 66,
    locationFit: 85,
    growth: 87,
    selfIntroReady: 30,
    keywords: ["Python", "SQL", "협업"],
    summary: "분석 역량 외에 서비스 맥락 이해와 협업 전달력이 중요",
  },
  {
    id: 103,
    company: "토스",
    title: "Data Analyst",
    role: "데이터 분석",
    deadline: "2026-03-09",
    stage: "공고확인",
    fit: 79,
    burden: 72,
    urgency: 100,
    locationFit: 70,
    growth: 94,
    selfIntroReady: 10,
    keywords: ["Experimentation", "Dashboard", "Ownership"],
    summary: "오너십, 빠른 실험, 사업 KPI 연결 능력이 중요",
  },
  {
    id: 104,
    company: "네이버",
    title: "검색 품질 기획",
    role: "서비스 기획",
    deadline: "2026-03-25",
    stage: "기업분석완료",
    fit: 61,
    burden: 60,
    urgency: 45,
    locationFit: 84,
    growth: 88,
    selfIntroReady: 0,
    keywords: ["기획", "검색", "사용자경험"],
    summary: "문제정의와 우선순위 기획 사례가 필요",
  },
];

type Posting = (typeof postingsSeed)[number];

const experiencesSeed = [
  {
    id: 201,
    title: "이커머스 리텐션 분석 프로젝트",
    category: "프로젝트",
    strength: ["문제해결", "데이터분석", "협업"],
    summary: "이탈 구간을 분석하고 리텐션 개선 액션을 제안",
    result: "재방문율 +8%",
    reusableFor: ["지원동기", "문제 해결", "직무 역량", "프로젝트 경험"],
    companies: ["네이버", "카카오", "토스"],
  },
  {
    id: 202,
    title: "A/B 테스트 대시보드 구축",
    category: "인턴",
    strength: ["SQL", "시각화", "커뮤니케이션"],
    summary: "실험 결과를 팀 전체가 공유 가능한 대시보드로 제작",
    result: "리포팅 시간 60% 감소",
    reusableFor: ["성취 경험", "협업 경험", "직무 역량"],
    companies: ["네이버", "카카오"],
  },
  {
    id: 203,
    title: "프로젝트 일정 충돌 해결 경험",
    category: "팀프로젝트",
    strength: ["갈등해결", "리더십", "협업"],
    summary: "역할 충돌 상황에서 일정 재설계와 커뮤니케이션 주도",
    result: "마감 내 배포 완료",
    reusableFor: ["갈등 해결", "리더십", "협업 경험"],
    companies: ["카카오", "토스"],
  },
];

const essayQuestionsSeed = [
  {
    id: 301,
    company: "네이버",
    posting: "서비스 데이터 분석 인턴",
    type: "지원동기",
    question: "네이버 서비스 데이터 분석 직무에 지원한 동기와 본인이 기여할 수 있는 부분을 작성해주세요.",
    limit: 1000,
    status: "수정중",
    draft: "사용자 행동 데이터 기반으로 문제를 정의하고 개선하는 과정에 매력을 느껴 지원했습니다...",
    linkedExperienceIds: [201, 202],
  },
  {
    id: 302,
    company: "네이버",
    posting: "서비스 데이터 분석 인턴",
    type: "문제 해결",
    question: "데이터를 기반으로 문제를 해결한 경험을 구체적으로 설명해주세요.",
    limit: 1000,
    status: "초안완료",
    draft: "이커머스 리텐션 분석 프로젝트에서 이탈 구간을 세분화하고...",
    linkedExperienceIds: [201],
  },
  {
    id: 303,
    company: "카카오",
    posting: "프로덕트 데이터 분석가 신입",
    type: "협업 경험",
    question: "협업 과정에서 갈등을 조율한 경험을 설명해주세요.",
    limit: 800,
    status: "미작성",
    draft: "",
    linkedExperienceIds: [203],
  },
];

const calendarSeed = [
  { id: 401, date: "03/09", title: "토스 Data Analyst 마감", type: "마감", company: "토스" },
  { id: 402, date: "03/10", title: "네이버 자소서 1차 수정", type: "작성", company: "네이버" },
  { id: 403, date: "03/12", title: "네이버 서비스 데이터 분석 인턴 마감", type: "마감", company: "네이버" },
  { id: 404, date: "03/14", title: "카카오 기업 분석 정리", type: "준비", company: "카카오" },
  { id: 405, date: "03/18", title: "모의 면접 질문 정리", type: "면접", company: "공통" },
];

function getDaysLeft(deadline: string) {
  const today = new Date("2026-03-08T00:00:00");
  const end = new Date(`${deadline}T00:00:00`);
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function computePriority(posting: Posting) {
  const stageWeightMap: Record<string, number> = {
    관심기업: 20,
    공고확인: 35,
    기업분석완료: 45,
    직무분석완료: 52,
    자소서작성중: 75,
    제출완료: 40,
    "인적성/과제대기": 55,
    면접대기: 65,
    최종결과대기: 30,
    합격: 10,
    불합격: 0,
    보류: 15,
  };

  const score =
    posting.fit * 0.24 +
    posting.urgency * 0.23 +
    posting.locationFit * 0.08 +
    posting.growth * 0.12 +
    posting.selfIntroReady * 0.12 +
    (100 - posting.burden) * 0.11 +
    (stageWeightMap[posting.stage] ?? 30) * 0.1;

  return Math.round(score);
}

const stageColor: Record<string, string> = {
  관심기업: "bg-slate-100 text-slate-700",
  공고확인: "bg-blue-100 text-blue-700",
  기업분석완료: "bg-cyan-100 text-cyan-700",
  직무분석완료: "bg-indigo-100 text-indigo-700",
  자소서작성중: "bg-amber-100 text-amber-700",
  제출완료: "bg-emerald-100 text-emerald-700",
  "인적성/과제대기": "bg-violet-100 text-violet-700",
  면접대기: "bg-fuchsia-100 text-fuchsia-700",
  최종결과대기: "bg-orange-100 text-orange-700",
  합격: "bg-green-100 text-green-700",
  불합격: "bg-rose-100 text-rose-700",
  보류: "bg-zinc-100 text-zinc-700",
};

const pieColors = ["#111827", "#374151", "#6b7280", "#9ca3af", "#d1d5db"];
const subscribe = () => () => {};

export default function JobPrepDashboardPrototype() {
  const [query, setQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [todoChecked, setTodoChecked] = useState<Record<number, boolean>>({});
  const chartsReady = useSyncExternalStore(subscribe, () => true, () => false);

  const postings = useMemo(() => {
    return postingsSeed
      .map((item) => ({ ...item, priority: computePriority(item), daysLeft: getDaysLeft(item.deadline) }))
      .filter((item) => {
        const matchesCompany = selectedCompany === "all" ? true : item.company === selectedCompany;
        const q = query.trim().toLowerCase();
        const matchesSearch =
          !q ||
          item.company.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.role.toLowerCase().includes(q) ||
          item.keywords.some((k: string) => k.toLowerCase().includes(q));
        return matchesCompany && matchesSearch;
      })
      .sort((a, b) => b.priority - a.priority);
  }, [query, selectedCompany]);

  const topTasks = useMemo(() => {
    const tasks = postings.slice(0, 5).map((item, idx) => ({
      id: idx + 1,
      title:
        item.stage === "자소서작성중"
          ? `${item.company} 자소서 수정 및 제출 마감 대응`
          : item.stage === "공고확인"
            ? `${item.company} 공고 분석 및 지원 여부 결정`
            : `${item.company} ${item.title} 다음 액션 진행`,
      priority: item.priority,
      daysLeft: item.daysLeft,
      company: item.company,
    }));

    if (newTodoTitle.trim()) {
      tasks.unshift({
        id: 999,
        title: newTodoTitle,
        priority: 99,
        daysLeft: 0,
        company: "직접 추가",
      });
    }

    return tasks.slice(0, 5);
  }, [postings, newTodoTitle]);

  const stageStats = useMemo(() => {
    return stageOrder
      .map((stage) => ({ name: stage, value: postingsSeed.filter((p) => p.stage === stage).length }))
      .filter((item) => item.value > 0);
  }, []);

  const analyticsData = [
    { name: "서류합격률", value: 42 },
    { name: "면접전환율", value: 21 },
    { name: "최종합격률", value: 8 },
    { name: "자소서완성률", value: 63 },
  ];

  const urgentItems = postings.filter((p) => p.daysLeft <= 5).slice(0, 4);
  const incompleteEssays = essayQuestionsSeed.filter((q) => q.status !== "최종완료");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge className="rounded-full bg-slate-900 px-3 py-1 text-white hover:bg-slate-900">취준 운영 시스템</Badge>
              <Badge variant="secondary" className="rounded-full">MVP Prototype</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">취준용 올인원 대시보드</h1>
            <p className="mt-1 text-sm text-slate-500 md:text-base">
              기업 분석, 지원 파이프라인, 자소서, 일정, 면접 준비, 통계를 하나로 묶은 운영형 대시보드
            </p>
          </div>

          <div className="flex flex-col gap-3 md:w-[360px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="기업명, 공고명, 키워드 검색"
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCompany} onValueChange={(value) => setSelectedCompany(value ?? "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="기업 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기업</SelectItem>
                  {companiesSeed.map((company) => (
                    <SelectItem key={company.id} value={company.name}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger render={<Button className="rounded-xl" />}>
                  <Plus className="mr-2 h-4 w-4" />빠른 추가
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>오늘 할 일 빠르게 추가</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>작업명</Label>
                      <Input value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} placeholder="예: 카카오 자소서 1문항 초안 작성" />
                    </div>
                    <div className="space-y-2">
                      <Label>메모</Label>
                      <Textarea placeholder="이 작업을 왜 해야 하는지, 어디에 연결되는지 적어두기" />
                    </div>
                    <Button className="w-full rounded-xl">추가 완료</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "전체 지원 건", value: postingsSeed.length, icon: ClipboardList, desc: "활성 공고 기준" },
            { title: "임박 마감", value: urgentItems.length, icon: AlertTriangle, desc: "5일 이내 마감" },
            { title: "자소서 미완성", value: incompleteEssays.length, icon: FileText, desc: "최종본 미완료" },
            { title: "이번 주 일정", value: calendarSeed.length, icon: CalendarDays, desc: "예정 이벤트" },
          ].map((card) => (
            <Card key={card.title} className="rounded-3xl border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <p className="mt-2 text-3xl font-semibold">{card.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{card.desc}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3">
                  <card.icon className="h-5 w-5 text-slate-700" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="home" className="space-y-4">
          <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-2xl bg-transparent p-0 md:grid-cols-6">
            {[
              ["home", "홈"],
              ["pipeline", "지원관리"],
              ["companies", "기업/공고"],
              ["essays", "자소서"],
              ["interviews", "면접준비"],
              ["analytics", "통계"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="rounded-2xl border bg-white py-3 data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="home" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> 오늘 해야 할 일 TOP 5</CardTitle>
                  <CardDescription>우선순위 점수, 마감 임박도, 준비 상태를 반영해 추천</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topTasks.map((task, idx) => (
                    <div key={task.id} className="flex items-start gap-3 rounded-2xl border p-4">
                      <Checkbox
                        checked={!!todoChecked[task.id]}
                        onCheckedChange={(checked) => setTodoChecked((prev) => ({ ...prev, [task.id]: !!checked }))}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="rounded-full">#{idx + 1}</Badge>
                          <span className={`text-sm font-medium ${todoChecked[task.id] ? "line-through text-slate-400" : ""}`}>{task.title}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                          <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{task.company}</Badge>
                          <Badge className="rounded-full bg-amber-50 text-amber-700 hover:bg-amber-50">우선순위 {task.priority}</Badge>
                          <Badge className="rounded-full bg-rose-50 text-rose-700 hover:bg-rose-50">D-{task.daysLeft}</Badge>
                        </div>
                      </div>
                      {todoChecked[task.id] && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-4">
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>임박 마감 공고</CardTitle>
                    <CardDescription>지금 놓치면 안 되는 지원 건</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {urgentItems.map((item) => (
                      <div key={item.id} className="rounded-2xl border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{item.company} · {item.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.summary}</p>
                          </div>
                          <Badge className="rounded-full bg-rose-100 text-rose-700 hover:bg-rose-100">D-{item.daysLeft}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>오늘/이번 주 일정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {calendarSeed.map((event) => (
                      <div key={event.id} className="flex items-center justify-between rounded-2xl border p-3">
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-slate-500">{event.company}</p>
                        </div>
                        <Badge variant="secondary" className="rounded-full">{event.date}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>핵심 지표</CardTitle>
                  <CardDescription>취준 흐름을 빠르게 확인</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData.map((item) => (
                    <div key={item.name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>지원 단계 분포</CardTitle>
                  <CardDescription>어느 단계에 병목이 있는지 확인</CardDescription>
                </CardHeader>
                <CardContent className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stageStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" hide />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>문항/경험 재사용 현황</CardTitle>
                  <CardDescription>자산화가 잘 되고 있는지 확인</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {experiencesSeed.map((exp) => (
                    <div key={exp.id} className="rounded-2xl border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{exp.title}</p>
                        <Badge variant="secondary" className="rounded-full">{exp.companies.length}개 기업 연결</Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{exp.result}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exp.reusableFor.slice(0, 3).map((tag) => (
                          <Badge key={tag} className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> 지원 파이프라인 보드</CardTitle>
                <CardDescription>현재 단계, 마감일, 준비 상태를 한 번에 관리</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-4 pb-4">
                    {stageOrder.slice(0, 8).map((stage) => {
                      const items = postingsSeed.filter((posting) => posting.stage === stage).map((item) => ({ ...item, priority: computePriority(item), daysLeft: getDaysLeft(item.deadline) }));
                      return (
                        <div key={stage} className="w-[300px] shrink-0 rounded-3xl bg-slate-100 p-3">
                          <div className="mb-3 flex items-center justify-between px-1">
                            <p className="font-medium">{stage}</p>
                            <Badge variant="secondary" className="rounded-full">{items.length}</Badge>
                          </div>
                          <div className="space-y-3">
                            {items.length === 0 && (
                              <div className="rounded-2xl border border-dashed bg-white p-4 text-sm text-slate-400">아직 항목 없음</div>
                            )}
                            {items.map((item) => (
                              <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="font-medium">{item.company}</p>
                                    <p className="text-sm text-slate-500">{item.title}</p>
                                  </div>
                                  <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{item.priority}</Badge>
                                </div>
                                <div className="mt-3 space-y-2 text-xs text-slate-500">
                                  <div className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> 마감 D-{item.daysLeft}</div>
                                  <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> 자소서 준비도 {item.selfIntroReady}%</div>
                                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> 위치 적합도 {item.locationFit}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>우선순위 추천 로직 예시</CardTitle>
                <CardDescription>관심도, 직무 적합도, 합격 가능성, 마감 임박도, 준비 상태를 종합</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {postings.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.company}</p>
                      <Badge className="rounded-full bg-slate-900 text-white hover:bg-slate-900">{item.priority}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.title}</p>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between"><span>직무 적합도</span><span>{item.fit}</span></div>
                      <div className="flex justify-between"><span>마감 임박도</span><span>{item.urgency}</span></div>
                      <div className="flex justify-between"><span>자소서 준비도</span><span>{item.selfIntroReady}</span></div>
                      <div className="flex justify-between"><span>준비 부담도</span><span>{item.burden}</span></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> 기업 분석</CardTitle>
                  <CardDescription>관심도, 적합도, 성장성, 근무 위치까지 함께 판단</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {companiesSeed.map((company) => (
                    <div key={company.id} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-slate-500">{company.industry} · {company.type}</p>
                        </div>
                        <Badge variant="secondary" className="rounded-full">적합도 {company.roleFit}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded-xl bg-slate-100 p-2">관심도 {company.interest}</div>
                        <div className="rounded-xl bg-slate-100 p-2">성장성 {company.growth}</div>
                        <div className="rounded-xl bg-slate-100 p-2">위치 {company.location}</div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{company.memo}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>공고 요약 & 역량 갭 분석</CardTitle>
                  <CardDescription>공고 원문 요약, 키워드, 준비 포인트, 부족 역량까지 한 번에 보기</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {postings.slice(0, 3).map((posting) => (
                    <div key={posting.id} className="rounded-2xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{posting.company} · {posting.title}</p>
                          <p className="text-sm text-slate-500">{posting.role}</p>
                        </div>
                        <Badge className={stageColor[posting.stage]}>{posting.stage}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{posting.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {posting.keywords.map((keyword: string) => (
                          <Badge key={keyword} className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{keyword}</Badge>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
                          <p className="font-medium">충분한 역량</p>
                          <p className="mt-1 text-xs">SQL, 대시보드 구성, 지표 분석</p>
                        </div>
                        <div className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-700">
                          <p className="font-medium">보완 필요한 역량</p>
                          <p className="mt-1 text-xs">실험 설계 서술, 협업 사례 구체화</p>
                        </div>
                        <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
                          <p className="font-medium">면접 방어 포인트</p>
                          <p className="mt-1 text-xs">서비스 맥락 이해와 비즈니스 임팩트 설명</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="essays" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> 자소서 문항 관리</CardTitle>
                  <CardDescription>문항, 상태, 초안, 연결 경험을 함께 관리</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {essayQuestionsSeed.map((item) => (
                    <div key={item.id} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{item.company}</p>
                            <Badge variant="secondary" className="rounded-full">{item.type}</Badge>
                            <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{item.status}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{item.question}</p>
                        </div>
                        <Badge className="rounded-full bg-amber-50 text-amber-700 hover:bg-amber-50">{item.limit}자</Badge>
                      </div>
                      <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                        {item.draft || "아직 초안이 없습니다."}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.linkedExperienceIds.map((id) => {
                          const exp = experiencesSeed.find((e) => e.id === id);
                          return exp ? <Badge key={id} className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">연결 경험: {exp.title}</Badge> : null;
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-4">
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>경험 라이브러리</CardTitle>
                    <CardDescription>자소서와 면접에서 반복 재사용할 핵심 경험 자산</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {experiencesSeed.map((exp) => (
                      <div key={exp.id} className="rounded-2xl border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{exp.title}</p>
                            <p className="text-sm text-slate-500">{exp.category}</p>
                          </div>
                          <Badge variant="secondary" className="rounded-full">{exp.result}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{exp.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {exp.strength.map((tag) => (
                            <Badge key={tag} className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>문항 재사용 추천</CardTitle>
                    <CardDescription>새 문항과 유사한 기존 문항, 답변, 경험 추천</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-2xl border p-4">
                      <p className="text-sm font-medium">입력 문항 예시</p>
                      <p className="mt-2 text-sm text-slate-600">데이터를 활용해 문제를 해결한 경험을 설명해주세요.</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
                      <p className="font-medium">추천 경험</p>
                      <p className="mt-1">이커머스 리텐션 분석 프로젝트</p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
                      <p className="font-medium">재사용 가능한 기존 문항</p>
                      <p className="mt-1">네이버 · 데이터 기반 문제 해결 경험</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                      <p className="font-medium">보완 포인트</p>
                      <p className="mt-1">정량 성과와 협업 맥락을 한 문단 더 보강하면 좋음</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> 면접 질문 관리</CardTitle>
                  <CardDescription>기업 맞춤 질문과 실제 답변 품질을 관리</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      q: "최근 수행한 분석 중 가장 임팩트가 컸던 사례를 설명해주세요.",
                      type: "직무 질문",
                      company: "네이버",
                      exp: "이커머스 리텐션 분석 프로젝트",
                      score: 78,
                    },
                    {
                      q: "협업 과정에서 의견 충돌을 조정한 경험이 있나요?",
                      type: "인성 질문",
                      company: "카카오",
                      exp: "프로젝트 일정 충돌 해결 경험",
                      score: 65,
                    },
                    {
                      q: "빠른 실행이 중요한 환경에서 어떤 방식으로 우선순위를 정하나요?",
                      type: "기업 맞춤 질문",
                      company: "토스",
                      exp: "A/B 테스트 대시보드 구축",
                      score: 58,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="rounded-2xl border p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full">{item.type}</Badge>
                        <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{item.company}</Badge>
                      </div>
                      <p className="mt-2 text-sm font-medium">{item.q}</p>
                      <p className="mt-2 text-xs text-slate-500">연결 경험: {item.exp}</p>
                      <div className="mt-3">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span>답변 만족도</span>
                          <span>{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>면접 준비 메모</CardTitle>
                  <CardDescription>STAR 답변, 보완 포인트, 실제 받은 질문을 축적</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-100 p-4">
                      <p className="font-medium">보완 포인트</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-600">
                        <li>• 결과 수치를 먼저 말하고 행동 과정을 뒤에 배치</li>
                        <li>• 기술 설명보다 비즈니스 임팩트 연결 강화</li>
                        <li>• 협업 갈등 사례에서 본인 판단 근거를 더 분명히 제시</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-4">
                      <p className="font-medium">다음 면접 체크리스트</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-600">
                        <li>• 기업 서비스 핵심 지표 3개 정리</li>
                        <li>• 1분 자기소개 2버전 준비</li>
                        <li>• 경험별 STAR 요약 5개 암기</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>실제 받은 질문 / 회고 메모</Label>
                    <Textarea rows={8} defaultValue={"- 왜 이 회사여야 하는가?\n- 이 분석이 실제 사업에 어떤 영향을 줬는가?\n- 협업 과정에서 설득은 어떻게 했는가?\n\n회고:\n- 사례 자체는 괜찮았지만 결론이 길었음\n- 수치와 행동을 더 선명하게 말할 것"} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> 지원 성과 분석</CardTitle>
                  <CardDescription>직무별/단계별 성과를 빠르게 확인</CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]">
                  {chartsReady ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
                      차트 로딩 중...
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>지원 단계 비중</CardTitle>
                  <CardDescription>지금 어디에 시간이 몰려 있는지 확인</CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]">
                  {chartsReady ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stageStats} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>
                          {stageStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
                      차트 로딩 중...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>전략 인사이트</CardTitle>
                <CardDescription>데이터를 바탕으로 다음 취준 전략을 정리</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["강한 직무", "데이터 분석 직무에서 적합도와 서류 준비도가 가장 높음"],
                  ["보완 필요", "카카오/토스 지원 전 협업 사례와 서비스 맥락 설명을 강화할 것"],
                  ["자산 활용", "리텐션 분석 프로젝트 경험이 가장 범용적으로 재사용 가능"],
                  ["다음 액션", "이번 주는 네이버 제출 완료 후 토스 지원 여부를 즉시 결정"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border p-4">
                    <p className="font-medium">{title}</p>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>기업 비교</CardTitle>
                  <CardDescription>관심 기업을 한 화면에서 비교해 지원 우선순위를 판단</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {companiesSeed.map((company) => {
                    const relatedPosting = postingsSeed.find((p) => p.company === company.name);
                    return (
                      <div key={company.id} className="rounded-2xl border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-slate-500">{company.industry} · {company.type}</p>
                          </div>
                          <Badge variant="secondary" className="rounded-full">관심도 {company.interest}</Badge>
                        </div>
                        <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
                          <div className="rounded-xl bg-slate-100 p-2">직무 적합도 {company.roleFit}</div>
                          <div className="rounded-xl bg-slate-100 p-2">성장성 {company.growth}</div>
                          <div className="rounded-xl bg-slate-100 p-2">근무 위치 {company.location}</div>
                          <div className="rounded-xl bg-slate-100 p-2">대표 공고 {relatedPosting?.title ?? "없음"}</div>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">{company.benefits}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>근무 위치 / 근무 형태 분석</CardTitle>
                  <CardDescription>출퇴근 현실성과 근무 방식까지 지원 판단에 반영</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      company: "네이버",
                      location: "성남",
                      mode: "하이브리드",
                      commute: "예상 65분",
                      fit: 84,
                      note: "판교권 수용 가능, 장기적으로 무난",
                    },
                    {
                      company: "카카오",
                      location: "판교",
                      mode: "하이브리드",
                      commute: "예상 70분",
                      fit: 85,
                      note: "출퇴근은 가능하나 면접/입사 시 동선 확인 필요",
                    },
                    {
                      company: "토스",
                      location: "서울",
                      mode: "오피스 중심",
                      commute: "예상 85분",
                      fit: 70,
                      note: "위치 매력도는 다소 낮지만 성장성과 브랜드 매력은 높음",
                    },
                  ].map((item) => (
                    <div key={item.company} className="rounded-2xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{item.company}</p>
                        <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">적합도 {item.fit}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded-xl bg-slate-100 p-2">지역 {item.location}</div>
                        <div className="rounded-xl bg-slate-100 p-2">근무형태 {item.mode}</div>
                        <div className="rounded-xl bg-slate-100 p-2">출퇴근 {item.commute}</div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{item.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium">다음 구현 추천</p>
              <p className="text-sm text-slate-500">Supabase 연동, 실제 CRUD, RLS, 칸반 DnD, 캘린더 저장, 자소서 버전 관리 추가</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl">DB 스키마 연결</Button>
              <Button className="rounded-xl">실서비스 구조로 확장</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
