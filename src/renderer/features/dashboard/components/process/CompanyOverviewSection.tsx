import {
  BriefcaseBusiness,
  Building2,
  FileText,
  FolderOpen,
  Newspaper,
  PencilLine,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";
import { GlassSelect } from "../../../../components/ui/GlassSelect";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import { portfolioData } from "../../domain/seeds/portfolioSeed";
import type { DashboardController } from "../../useDashboardController";
import { getCompanyTypeTone } from "../viewUtils";
import { ComparisonDetailTableCard } from "../shared/ComparisonDetailTableCard";

type CompanyOverviewSectionProps = {
  companies: DashboardController["companies"];
};

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
  return value.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "");
}

function getRelevantProjects(companies: DashboardController["companies"]) {
  const companyKeywords = [
    companies.selectedCompany.name,
    companies.selectedCompanyPosting.title,
    companies.selectedCompanyPosting.role,
    ...companies.selectedCompanyPosting.keywords,
    ...companies.selectedCompanyAnalysis.techStack,
  ]
    .map(normalizeKeyword)
    .filter(Boolean);

  return [...portfolioData.projects]
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
    <div className="rounded-[24px] border border-slate-200 bg-white/70 p-5">
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
                onChange(items.map((current, itemIndex) => (itemIndex === index ? event.target.value : current)))
              }
              placeholder={title === "핵심 요구 기술" ? "예: SystemVerilog" : "예: 채용 수요가 계속 증가 중"}
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

function MetricEditorCard({
  companies,
}: {
  companies: DashboardController["companies"];
}) {
  const comparison = companies.selectedCompanyAnalysis.comparison;

  const metricFields = [
    { label: "연봉/보상", key: "salary" as const },
    { label: "워라밸", key: "wlb" as const },
    { label: "성장성", key: "growth" as const },
    { label: "위치/출퇴근", key: "location" as const },
    { label: "조직문화", key: "culture" as const },
  ];

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white/78 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-blue-500" />
        <h3 className="text-lg font-black tracking-tight text-slate-900">비교 점수 편집</h3>
      </div>
      <p className="mb-5 text-sm leading-6 text-slate-500">
        여기서 조정한 보상 문구와 점수가 기업분석 비교표와 오퍼 비교 페이지에 함께 반영됩니다.
      </p>

      <div className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">기본급</span>
            <input
              value={comparison.base}
              onChange={(event) =>
                companies.updateSelectedCompanyComparisonMetric("base", event.target.value)
              }
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">보너스</span>
            <input
              value={comparison.bonus}
              onChange={(event) =>
                companies.updateSelectedCompanyComparisonMetric("bonus", event.target.value)
              }
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300"
            />
          </label>
        </div>

        <div className="grid gap-3">
          {metricFields.map((metric) => (
            <label
              key={metric.key}
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3"
            >
              <div>
                <p className="text-sm font-black text-slate-800">{metric.label}</p>
                <p className="mt-1 text-xs text-slate-400">0~100 점수 기준</p>
              </div>
              <input
                type="number"
                min={0}
                max={100}
                value={comparison[metric.key]}
                onChange={(event) =>
                  companies.updateSelectedCompanyComparisonMetric(
                    metric.key,
                    Number(event.target.value || 0),
                  )
                }
                className="h-11 w-24 rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-black text-slate-800 outline-none transition focus:border-blue-300"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CompanyOverviewSection({
  companies,
}: CompanyOverviewSectionProps) {
  const relatedExperienceCards = getRelevantProjects(companies);

  return (
    <SurfaceCard className="relative overflow-hidden p-7">
      <div className="pointer-events-none absolute right-6 top-0 text-slate-100">
        <Building2 className="h-40 w-40" strokeWidth={1.1} />
      </div>

      <div className="relative">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[22px] font-black tracking-tight text-slate-900">
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

        <section className="mb-7">
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
            rows={4}
            className="w-full rounded-[24px] border border-slate-200 bg-white/80 px-5 py-4 text-[14px] leading-8 text-slate-600 outline-none transition focus:border-blue-300"
          />
        </section>

        <section className="mb-7">
          <CompanySectionHeader icon={BriefcaseBusiness} title="직무 상세" helper="직무 맥락과 기대 역할을 직접 보강할 수 있습니다." />
          <textarea
            value={companies.selectedCompanyAnalysis.roleDescription}
            onChange={(event) =>
              companies.updateSelectedCompanyAnalysisField("roleDescription", event.target.value)
            }
            rows={4}
            className="w-full rounded-[24px] border border-slate-200 bg-slate-50/80 px-5 py-4 text-[14px] leading-8 text-slate-600 outline-none transition focus:border-blue-300"
          />
        </section>

        <section className="mb-7">
          <CompanySectionHeader icon={Sparkles} title="핵심 요구 기술" helper="키워드와 역량 태그를 바로 수정할 수 있습니다." />
          <EditableListSection
            title="핵심 요구 기술"
            helper="한 줄마다 하나의 기술 키워드를 넣어 주세요."
            addLabel="기술 추가"
            items={companies.selectedCompanyAnalysis.techStack}
            onChange={(nextItems) => companies.updateSelectedCompanyAnalysisList("techStack", nextItems)}
          />
        </section>

        <section className="mb-7">
          <CompanySectionHeader icon={Newspaper} title="최근 동향 및 뉴스" helper="면접/자소서에 쓸 최신 포인트를 메모해 둘 수 있습니다." />
          <EditableListSection
            title="최근 동향 및 뉴스"
            helper="최근 동향, 인터뷰 포인트, 채용 메모를 줄 단위로 관리합니다."
            addLabel="뉴스 추가"
            items={companies.selectedCompanyAnalysis.news}
            onChange={(nextItems) => companies.updateSelectedCompanyAnalysisList("news", nextItems)}
          />
        </section>

        <section className="mb-7">
          <CompanySectionHeader icon={SlidersHorizontal} title="기업 비교 테이블" helper="오퍼 비교의 세부 비교 테이블과 같은 데이터를 공유합니다." />
          <div className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr]">
            <ComparisonDetailTableCard
              title="세부 비교 테이블"
              description="선택 기업과 비교 기업의 조건을 같은 기준으로 빠르게 읽을 수 있게 정리했습니다."
              leftLabel={companies.selectedCompany.name}
              rightLabel={companies.comparisonCompany.name}
              leftClassName="text-blue-600"
              rightClassName="text-emerald-600"
              rows={companies.companyComparisonRows}
              badgeLabel="기업 비교"
              headerAction={
                <div className="min-w-[220px]">
                  <GlassSelect
                    label="비교 기업"
                    value={String(companies.companyCompareId)}
                    options={companies.companyCompareOptions}
                    onChange={(value) => companies.setCompanyComparisonCompanyId(Number(value))}
                    tone="emerald"
                    size="sm"
                  />
                </div>
              }
            />
            <MetricEditorCard companies={companies} />
          </div>
        </section>

        <section className="mb-7">
          <CompanySectionHeader icon={FolderOpen} title="연관 공고와 연결 경험" />
          <div className="grid gap-4 xl:grid-cols-[0.5fr_0.5fr]">
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

        <section>
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
      </div>
    </SurfaceCard>
  );
}
