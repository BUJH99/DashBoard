import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CircleAlert,
  CircleCheck,
  FileText,
  FolderOpen,
  Newspaper,
  PencilLine,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { Pill, ProgressBar, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";
import { getCompanyTypeTone } from "../viewUtils";

type CompanyOverviewSectionProps = {
  companies: DashboardController["companies"];
  portfolio: DashboardController["portfolio"];
};

type CompanyCard = DashboardController["companies"]["selectedCompany"];
type CompanyAnalysis = DashboardController["companies"]["selectedCompanyAnalysis"];
type CompanyComparisonProfile = CompanyAnalysis["comparison"];

function CompanySectionHeader({
  icon: Icon,
  title,
  helper,
}: {
  icon: typeof Building2;
  title: string;
  helper?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        <h3 className="text-[15px] font-black text-slate-900">{title}</h3>
      </div>
      {helper ? <span className="text-xs font-semibold text-slate-400">{helper}</span> : null}
    </div>
  );
}

function normalizeKeyword(value: string) {
  return value.toLowerCase().replace(/[^\p{Letter}\p{Number}가-힣]+/gu, "");
}

function buildPortfolioKeywordSet(portfolio: DashboardController["portfolio"]) {
  const keywords = new Set<string>();
  const addKeyword = (value: string) => {
    keywords.add(normalizeKeyword(value));
  };

  portfolio.data.skills.forEach((skill) => addKeyword(skill.name));
  portfolio.data.learningSkills.forEach((skill) => addKeyword(skill.name));
  portfolio.data.coursework.forEach((course) => {
    addKeyword(course.name);
    course.tags.forEach(addKeyword);
  });
  portfolio.data.projects.forEach((project) => {
    addKeyword(project.name);
    project.tech.forEach(addKeyword);
  });
  portfolio.data.experienceHub.forEach((experience) => {
    addKeyword(experience.title);
    experience.tags.forEach(addKeyword);
    experience.keywords.forEach(addKeyword);
  });

  return keywords;
}

function getRelevantProjects(
  companies: DashboardController["companies"],
  portfolio: DashboardController["portfolio"],
) {
  const companyKeywords = [
    companies.selectedCompany.name,
    companies.selectedCompanyPosting.title,
    companies.selectedCompanyPosting.role,
    ...companies.selectedCompanyPosting.keywords,
    ...companies.selectedCompanyAnalysis.techStack,
  ]
    .map(normalizeKeyword)
    .filter(Boolean);

  return [...portfolio.data.projects]
    .map((project) => {
      const haystack = normalizeKeyword(
        [project.name, project.role, project.impact, ...project.tech].join(" "),
      );
      const score = companyKeywords.reduce(
        (count, keyword) => (keyword && haystack.includes(keyword) ? count + 1 : count),
        0,
      );

      return {
        project,
        score,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => item.project);
}

function buildCompanyInsightSummary(
  companies: DashboardController["companies"],
  portfolio: DashboardController["portfolio"],
) {
  const portfolioKeywordSet = buildPortfolioKeywordSet(portfolio);
  const extracted = Array.from(
    new Set([
      ...companies.selectedCompanyPosting.keywords,
      ...companies.selectedCompanyAnalysis.techStack,
    ]),
  ).slice(0, 6);
  const matched = extracted.filter((item) => portfolioKeywordSet.has(normalizeKeyword(item)));
  const missing = extracted.filter((item) => !matched.includes(item));
  const keywordCoverage = extracted.length > 0 ? Math.round((matched.length / extracted.length) * 100) : 0;
  const score = Math.round(
    companies.selectedCompany.fit * 0.5 +
      companies.selectedCompany.preference * 0.25 +
      keywordCoverage * 0.25,
  );

  return {
    extracted,
    matched,
    missing,
    score,
    recommendation:
      missing.length > 0
        ? `${missing[0]} 관련 설명을 포트폴리오 첫 프로젝트와 자소서 핵심 문장에 더 선명하게 배치하는 편이 좋습니다.`
        : companies.selectedCompanyAnalysis.news[0] ??
          "현재 정리된 역량과 포지션의 키워드 연결 상태가 좋습니다. 이제는 성과 수치와 디버깅 스토리를 더 강조하면 됩니다.",
  };
}

function EditableListSection({
  title,
  items,
  helper,
  addLabel,
  onChange,
}: {
  title: string;
  items: string[];
  helper: string;
  addLabel: string;
  onChange: (nextItems: string[]) => void;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/72 p-5 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.28)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-black text-slate-900">{title}</h4>
          <p className="mt-1 text-xs text-slate-400">{helper}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>

      <div className="grid gap-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex items-center gap-3">
            <input
              value={item}
              onChange={(event) =>
                onChange(
                  items.map((current, itemIndex) =>
                    itemIndex === index ? event.target.value : current,
                  ),
                )
              }
              placeholder={
                title === "핵심 요구 기술"
                  ? "예: SystemVerilog"
                  : "예: 채용 수요가 계속 증가 중"
              }
              className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:text-rose-500"
              aria-label={`${title} ${index + 1} 삭제`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeywordCluster({
  title,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  items: string[];
  tone: string;
  icon: typeof CircleCheck;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />
        <h4 className="text-sm font-black text-slate-900">{title}</h4>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Pill key={item} className={tone}>
            {item}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function CompanyComparisonProfileEditorCard({
  company,
  analysis,
  tone,
  onSave,
}: {
  company: CompanyCard;
  analysis: DashboardController["companies"]["selectedCompanyAnalysis"];
  tone: "blue" | "emerald";
  onSave: (companyId: number, comparison: CompanyComparisonProfile) => void;
}) {
  const [draft, setDraft] = useState<CompanyComparisonProfile>(analysis.comparison);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    setDraft(analysis.comparison);
    setSaveState("idle");
  }, [
    company.id,
    analysis.comparison.base,
    analysis.comparison.bonus,
    analysis.comparison.salary,
    analysis.comparison.wlb,
    analysis.comparison.growth,
    analysis.comparison.location,
    analysis.comparison.culture,
  ]);

  useEffect(() => {
    if (saveState !== "saved") {
      return;
    }
    const timer = window.setTimeout(() => setSaveState("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [saveState]);

  const toneStyles =
    tone === "blue"
      ? {
          accent: "text-blue-600",
          pill: "border-blue-200 bg-blue-50 text-blue-700",
          button: "bg-blue-600 hover:bg-blue-500",
        }
      : {
          accent: "text-emerald-600",
          pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
          button: "bg-emerald-600 hover:bg-emerald-500",
        };

  const hasChanges =
    draft.base !== analysis.comparison.base ||
    draft.bonus !== analysis.comparison.bonus ||
    draft.salary !== analysis.comparison.salary ||
    draft.wlb !== analysis.comparison.wlb ||
    draft.growth !== analysis.comparison.growth ||
    draft.location !== analysis.comparison.location ||
    draft.culture !== analysis.comparison.culture;

  const metricFields = [
    { label: "연봉/보상", key: "salary" as const },
    { label: "워라밸", key: "wlb" as const },
    { label: "성장성", key: "growth" as const },
    { label: "위치/출퇴근", key: "location" as const },
    { label: "조직문화", key: "culture" as const },
  ];

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white/78 p-6 shadow-[0_18px_48px_-36px_rgba(15,23,42,0.35)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-xl font-black tracking-tight text-slate-900">{company.name}</h4>
            <Pill className={toneStyles.pill}>{company.status}</Pill>
          </div>
          <p className="mt-2 text-sm text-slate-500">{company.location}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">현재 점수</p>
          <p className={cn("mt-2 text-3xl font-black", toneStyles.accent)}>
            {Math.round(
              (analysis.comparison.salary +
                analysis.comparison.wlb +
                analysis.comparison.growth +
                analysis.comparison.location +
                analysis.comparison.culture) /
                5,
            )}
            <span className="ml-1 text-base text-slate-400">점</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">기본급</span>
            <input
              value={draft.base}
              onChange={(event) => setDraft((current) => ({ ...current, base: event.target.value }))}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">보너스</span>
            <input
              value={draft.bonus}
              onChange={(event) => setDraft((current) => ({ ...current, bonus: event.target.value }))}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
          <div className="grid grid-cols-[1.2fr_0.8fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <span>항목</span>
            <span className="text-right">점수</span>
          </div>
          {metricFields.map((metric) => (
            <div
              key={metric.key}
              className="grid grid-cols-[1.2fr_0.8fr] items-center border-b border-slate-200/80 px-5 py-3 last:border-b-0"
            >
              <span className="text-sm font-semibold text-slate-700">{metric.label}</span>
              <input
                type="number"
                min={0}
                max={100}
                value={draft[metric.key]}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    [metric.key]: clampScore(Number(event.target.value || 0)),
                  }))
                }
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-black text-slate-800 outline-none transition focus:border-blue-300"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              저장하면 이 기업의 값이 오퍼 비교 페이지에 반영됩니다.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {saveState === "saved" ? "오퍼 비교 반영 완료" : "아직 저장되지 않은 변경사항이 있을 수 있습니다."}
            </p>
          </div>
          <button
            type="button"
            disabled={!hasChanges}
            onClick={() => {
              onSave(company.id, draft);
              setSaveState("saved");
            }}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-bold text-white transition duration-200 active:scale-[0.98]",
              toneStyles.button,
              !hasChanges && "cursor-not-allowed bg-slate-300 hover:bg-slate-300",
            )}
          >
            <PencilLine className={cn("h-4 w-4", hasChanges && "animate-pulse")} />
            {saveState === "saved" ? "반영 완료" : "오퍼 비교에 반영"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompanyOverviewSection({
  companies,
  portfolio,
}: CompanyOverviewSectionProps) {
  const relatedExperienceCards = useMemo(
    () => getRelevantProjects(companies, portfolio),
    [companies, portfolio],
  );
  const insightSummary = useMemo(
    () => buildCompanyInsightSummary(companies, portfolio),
    [companies, portfolio],
  );

  return (
    <SurfaceCard className="relative overflow-hidden p-7">
      <div className="pointer-events-none absolute right-6 top-0 text-slate-100">
        <Building2 className="h-40 w-40" strokeWidth={1.1} />
      </div>

      <div className="relative space-y-7">
        <div className="border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[24px] font-black tracking-tight text-slate-900">
                  {companies.selectedCompany.name}
                </h2>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-bold",
                    getCompanyTypeTone(companies.selectedCompany.type),
                  )}
                >
                  {companies.selectedCompanyPosting.role || companies.selectedCompany.type}
                </span>
              </div>
              <p className="mt-2 text-[14px] text-slate-500">
                {companies.selectedCompany.status} · {companies.selectedCompany.location}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Pill className="border-blue-200 bg-blue-50 text-blue-700">
                선호도 {companies.selectedCompany.preference}%
              </Pill>
              <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">
                적합도 {companies.selectedCompany.fit}%
              </Pill>
              <Pill className="border-slate-200 bg-white text-slate-600">
                <PencilLine className="mr-1 h-3.5 w-3.5" />
                직접 편집 가능
              </Pill>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/78 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.32)]">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <h3 className="text-[22px] font-black tracking-tight text-slate-900">Company Mapper 결과</h3>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div className="rounded-[30px] border border-slate-200 bg-white/70 px-6 py-7">
              <div className="mx-auto max-w-[420px] text-center">
                <p className="text-sm font-semibold text-slate-500">종합 매칭 점수</p>
                <p className="mt-2 text-6xl font-black tracking-tight text-emerald-600">
                  {insightSummary.score}
                  <span className="ml-1 text-3xl text-slate-400">%</span>
                </p>
                <div className="mt-5">
                  <ProgressBar value={insightSummary.score} color="#10b981" />
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <KeywordCluster
                title="공고에서 추출된 키워드"
                items={insightSummary.extracted}
                tone="border-slate-200 bg-slate-100 text-slate-700"
                icon={Target}
              />
              <KeywordCluster
                title="이미 매칭되는 역량"
                items={insightSummary.matched}
                tone="border-emerald-200 bg-emerald-50 text-emerald-700"
                icon={CircleCheck}
              />
              <KeywordCluster
                title="보강이 필요한 키워드"
                items={insightSummary.missing}
                tone="border-rose-200 bg-rose-50 text-rose-700"
                icon={CircleAlert}
              />
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm leading-7 text-slate-600">
              {insightSummary.recommendation}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5">
                <h4 className="text-lg font-black tracking-tight text-slate-900">추천 연결 경험</h4>
                <div className="mt-4 grid gap-3">
                  {relatedExperienceCards.slice(0, 2).map((project) => (
                    <article
                      key={project.id}
                      className="rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4"
                    >
                      <p className="text-[15px] font-black text-slate-900">{project.name}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{project.impact}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5">
                <h4 className="text-lg font-black tracking-tight text-slate-900">연결할 자소서 포인트</h4>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {companies.selectedCompany.name} {companies.selectedCompanyPosting.role} 직무에 지원한 이유와
                  본인이 기여할 수 있는 지점을 {companies.selectedCompanyAnalysis.roleDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill className="border-amber-200 bg-amber-50 text-amber-700">
                    {companies.selectedCompany.name}
                  </Pill>
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                    {companies.selectedCompanyPosting.stage}
                  </Pill>
                  <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                    핵심 기술 {companies.selectedCompanyAnalysis.techStack.length}개
                  </Pill>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[30px] border border-slate-200 bg-white/72 p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.28)]">
            <CompanySectionHeader
              icon={Building2}
              title="기업 개요"
              helper="상단 로컬 상태 저장 버튼을 누르면 편집 내용이 유지됩니다."
            />
            <textarea
              value={companies.selectedCompanyAnalysis.description}
              onChange={(event) =>
                companies.updateSelectedCompanyAnalysisField("description", event.target.value)
              }
              rows={6}
              className="w-full rounded-[24px] border border-slate-200 bg-white/90 px-5 py-4 text-[14px] leading-8 text-slate-600 outline-none transition focus:border-blue-300"
            />
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white/72 p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.28)]">
            <CompanySectionHeader
              icon={BriefcaseBusiness}
              title="직무 상세"
              helper="직무 맥락과 기대 역할을 직접 보강할 수 있습니다."
            />
            <textarea
              value={companies.selectedCompanyAnalysis.roleDescription}
              onChange={(event) =>
                companies.updateSelectedCompanyAnalysisField("roleDescription", event.target.value)
              }
              rows={6}
              className="w-full rounded-[24px] border border-slate-200 bg-slate-50/80 px-5 py-4 text-[14px] leading-8 text-slate-600 outline-none transition focus:border-blue-300"
            />
          </section>

          <section>
            <CompanySectionHeader
              icon={Sparkles}
              title="핵심 요구 기술"
              helper="키워드와 역량 태그를 바로 수정할 수 있습니다."
            />
            <EditableListSection
              title="핵심 요구 기술"
              helper="한 줄마다 하나의 기술 키워드를 넣어 주세요."
              addLabel="기술 추가"
              items={companies.selectedCompanyAnalysis.techStack}
              onChange={(nextItems) =>
                companies.updateSelectedCompanyAnalysisList("techStack", nextItems)
              }
            />
          </section>

          <section>
            <CompanySectionHeader
              icon={Newspaper}
              title="최근 동향 및 뉴스"
              helper="수동 메모와 산업동향 태그 기반 자동 추가를 함께 지원합니다."
            />
            <div className="mb-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-900">산업동향 태그 기반 자동 뉴스 추가</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    선택 기업의 기술 태그와 산업 키워드를 기준으로 최근 뉴스를 바로 메모 목록에 붙입니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void companies.autofillSelectedCompanyNews()}
                  disabled={companies.companyNewsAutofillState.phase === "loading"}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white transition",
                    companies.companyNewsAutofillState.phase === "loading"
                      ? "cursor-wait bg-slate-400"
                      : "bg-slate-900 hover:bg-slate-800",
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {companies.companyNewsAutofillState.phase === "loading"
                    ? "자동 추가 중"
                    : "자동 뉴스 추가"}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {companies.selectedCompanyAutoNewsKeywords.map((keyword) => (
                  <Pill key={keyword} className="border-slate-200 bg-white text-slate-700">
                    #{keyword}
                  </Pill>
                ))}
              </div>
              {companies.companyNewsAutofillState.message ? (
                <p
                  className={cn(
                    "mt-3 text-xs font-semibold",
                    companies.companyNewsAutofillState.phase === "error"
                      ? "text-rose-600"
                      : "text-emerald-600",
                  )}
                >
                  {companies.companyNewsAutofillState.message}
                </p>
              ) : null}
            </div>
            <EditableListSection
              title="최근 동향 및 뉴스"
              helper="최근 동향, 인터뷰 포인트, 채용 메모를 줄 단위로 관리합니다."
              addLabel="뉴스 추가"
              items={companies.selectedCompanyAnalysis.news}
              onChange={(nextItems) => companies.updateSelectedCompanyAnalysisList("news", nextItems)}
            />
          </section>
        </div>

        <section className="rounded-[30px] border border-slate-200 bg-white/72 p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.28)]">
          <CompanySectionHeader icon={FolderOpen} title="연관 공고와 연결 경험" />
          <div className="grid gap-4 xl:grid-cols-[0.48fr_0.52fr]">
            <button
              type="button"
              onClick={() => companies.setSelectedPostingId(companies.selectedCompanyPosting.id)}
              className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-[0_10px_24px_rgba(148,163,184,0.06)] transition hover:border-slate-300 hover:bg-slate-50/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-[16px] font-black text-slate-900">
                    {companies.selectedCompanyPosting.title}
                  </h4>
                  <p className="mt-2 text-[14px] text-slate-500">
                    {companies.selectedCompanyPosting.role}
                  </p>
                </div>
                <Pill className="border-blue-200 bg-blue-50 text-blue-700">
                  {companies.selectedCompanyPosting.stage}
                </Pill>
              </div>
              <p className="mt-4 text-[14px] leading-7 text-slate-500">
                {companies.selectedCompanyPosting.summary}
              </p>
            </button>

            <div className="grid gap-3">
              {relatedExperienceCards.map((project) => (
                <article
                  key={project.id}
                  className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
                >
                  <h4 className="text-[15px] font-black text-slate-900">{project.name}</h4>
                  <p className="mt-2 text-[14px] leading-7 text-slate-500">{project.impact}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white/72 p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.28)]">
          <CompanySectionHeader icon={FileText} title="관련 자소서" />
          <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
            {companies.companyCoverLetters.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {companies.companyCoverLetters.map((item) => (
                  <Pill key={item.name} className="border-cyan-200 bg-cyan-50 text-cyan-700">
                    {item.title}
                  </Pill>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-slate-500">
                현재 이 기업과 연결된 md 자기소개서가 없습니다. Cover Letter 탭에서 메타를 맞춰 저장하면 자동으로 연결됩니다.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white/72 p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.28)]">
          <CompanySectionHeader
            icon={SlidersHorizontal}
            title="기업별 오퍼 반영 테이블"
            helper="현재 선택한 기업만 저장 대상으로 보여줍니다."
          />
          <div className="grid gap-5">
            <CompanyComparisonProfileEditorCard
              company={companies.selectedCompany}
              analysis={companies.selectedCompanyAnalysis}
              tone="blue"
              onSave={companies.saveCompanyComparisonProfile}
            />
          </div>
        </section>
      </div>
    </SurfaceCard>
  );
}
