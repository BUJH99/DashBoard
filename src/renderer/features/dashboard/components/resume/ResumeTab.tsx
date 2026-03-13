import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpenText,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Download,
  FileText,
  GraduationCap,
  Languages,
  Plus,
  Trophy,
  Trash2,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { Pill, ProgressBar, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type ResumeTabProps = {
  resume: DashboardController["resume"];
};

function ResumeViewButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-slate-900 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      )}
    >
      {label}
    </button>
  );
}

function ResumeMetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "blue" | "violet";
}) {
  const toneClassName =
    tone === "emerald"
      ? "border-emerald-100 bg-emerald-50/80 text-emerald-700"
      : tone === "blue"
        ? "border-blue-100 bg-blue-50/80 text-blue-700"
        : "border-violet-100 bg-violet-50/80 text-violet-700";

  return (
    <SurfaceCard className={cn("border p-5", toneClassName)}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-tight">{value}</p>
    </SurfaceCard>
  );
}

const SPEC_SECTION_META: Record<
  string,
  {
    icon: typeof Sparkles;
    toneClassName: string;
  }
> = {
  education: {
    icon: GraduationCap,
    toneClassName: "border-violet-200 bg-violet-50 text-violet-700",
  },
  languages: {
    icon: Languages,
    toneClassName: "border-sky-200 bg-sky-50 text-sky-700",
  },
  certificates: {
    icon: BadgeCheck,
    toneClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  skills: {
    icon: Cpu,
    toneClassName: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  },
  career: {
    icon: BriefcaseBusiness,
    toneClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  activities: {
    icon: Users,
    toneClassName: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  awards: {
    icon: Trophy,
    toneClassName: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  papers: {
    icon: BookOpenText,
    toneClassName: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

function getSpecBadgeToneClassName(value: string | null) {
  if (!value) {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  if (value.includes("예정")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (value === "졸업" || value === "상") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (value === "중") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (value === "하") {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}

function ResumeSpecSectionCard({
  section,
  expanded,
  onToggle,
}: {
  section: DashboardController["resume"]["specSections"][number];
  expanded: boolean;
  onToggle: () => void;
}) {
  const meta = SPEC_SECTION_META[section.id];
  const Icon = meta?.icon ?? Sparkles;

  return (
    <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-50/80"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border", meta?.toneClassName)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900">{section.label}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
            {section.count}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </button>

      {expanded ? (
        <div className="grid gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-4">
          {section.items.map((item) => (
            <div
              key={`${section.id}-${item.title}-${item.meta}`}
              className="rounded-[18px] border border-white/80 bg-white/90 px-4 py-3 shadow-[0_8px_20px_rgba(148,163,184,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-slate-900">{item.title}</p>
                    {item.badge ? (
                      <Pill className={getSpecBadgeToneClassName(item.badge)}>
                        {item.badge}
                      </Pill>
                    ) : null}
                  </div>
                  {item.subtitle ? <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p> : null}
                  {item.detail ? <p className="mt-1 text-sm font-semibold text-blue-600">{item.detail}</p> : null}
                </div>
                {item.meta ? <p className="shrink-0 text-xs font-medium text-slate-400">{item.meta}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function ResumeEditorSection({
  title,
  description,
  expanded,
  onToggle,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  description?: string;
  expanded: boolean;
  onToggle: () => void;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 text-left"
        >
          <p className="text-sm font-black text-slate-900">{title}</p>
          {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
        </button>
        <div className="flex items-center gap-2">
          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {actionLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:bg-slate-50"
            aria-label={`${title} ${expanded ? "접기" : "펼치기"}`}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {expanded ? <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4">{children}</div> : null}
    </article>
  );
}

function EditorField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function EditorInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email";
}) {
  return (
    <EditorField label={label}>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-300"
      />
    </EditorField>
  );
}

function monthValueToLabel(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) {
    return "";
  }

  const [year, month] = value.split("-");

  return `${year}.${month}`;
}

function labelToMonthValue(value: string) {
  const normalized = value.replace(/\s/g, "");
  const match = normalized.match(/^(\d{4})[.-](\d{2})$/);

  if (!match) {
    return "";
  }

  return `${match[1]}-${match[2]}`;
}

function parsePeriodRange(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return { start: "", end: "" };
  }

  const rangeParts = normalized.split(/\s+[~-]\s+/);

  if (rangeParts.length >= 2) {
    return {
      start: labelToMonthValue(rangeParts[0] ?? ""),
      end: labelToMonthValue(rangeParts[1] ?? ""),
    };
  }

  return {
    start: labelToMonthValue(normalized),
    end: "",
  };
}

function buildPeriodRangeValue(start: string, end: string) {
  const startLabel = monthValueToLabel(start);
  const endLabel = monthValueToLabel(end);

  if (startLabel && endLabel) {
    return `${startLabel} - ${endLabel}`;
  }

  return startLabel || "";
}

function EditorMonthInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <EditorField label={label}>
      <input
        type="month"
        value={labelToMonthValue(value)}
        onChange={(event) => onChange(monthValueToLabel(event.target.value))}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-300"
      />
    </EditorField>
  );
}

function EditorPeriodRange({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { start, end } = parsePeriodRange(value);

  return (
    <EditorField label={label}>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <input
          type="month"
          value={start}
          onChange={(event) => onChange(buildPeriodRangeValue(event.target.value, end))}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-300"
        />
        <div className="flex items-center justify-center text-sm font-semibold text-slate-400">~</div>
        <input
          type="month"
          value={end}
          onChange={(event) => onChange(buildPeriodRangeValue(start, event.target.value))}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-300"
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {value.trim().length > 0 ? `선택된 기간: ${value}` : "시작일과 종료일을 월 단위로 선택하세요."}
      </p>
    </EditorField>
  );
}

function EditorTextArea({
  label,
  value,
  onChange,
  placeholder,
  minHeightClassName = "min-h-[96px]",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeightClassName?: string;
}) {
  return (
    <EditorField label={label}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          minHeightClassName,
          "rounded-2xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-300",
        )}
      />
    </EditorField>
  );
}

function EditorItemCard({
  title,
  subtitle,
  onRemove,
  children,
}: {
  title: string;
  subtitle?: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_20px_rgba(148,163,184,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-900">{title}</p>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          aria-label={`${title} 삭제`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

export function ResumeTab({
  resume,
}: ResumeTabProps) {
  const [activeView, setActiveView] = useState<"content" | "analysis" | "compare">("content");
  const [expandedSpecSectionId, setExpandedSpecSectionId] = useState<string | null>(
    resume.specSections[0]?.id ?? null,
  );
  const [expandedEditorSectionId, setExpandedEditorSectionId] = useState<string | null>("basics");
  const selectedExperienceIdSet = useMemo(
    () => new Set(resume.selectedExperienceIds),
    [resume.selectedExperienceIds],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[34px] font-black tracking-tight text-slate-900">이력서</h2>
          <p className="mt-1 text-sm text-slate-500">{resume.title}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resume.openExperienceHub}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            경험 허브로
          </button>
          <button
            type="button"
            onClick={resume.downloadPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            PDF 다운로드
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ResumeMetricCard label="총 성장" value={`${resume.metrics.growth >= 0 ? "+" : ""}${resume.metrics.growth}점`} tone="emerald" />
        <ResumeMetricCard label="평가 횟수" value={`${resume.metrics.reviewCount}회`} tone="blue" />
        <ResumeMetricCard label="현재 점수" value={`${resume.metrics.score}점`} tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.32fr_0.68fr] xl:items-start">
        <SurfaceCard className="overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-slate-900">나의 스펙</h3>
                  <p className="text-xs text-slate-500">총 {resume.specTotalCount}개 항목이 연결되어 있습니다.</p>
                </div>
              </div>
              <div className="w-24">
                <p className="text-right text-sm font-black text-violet-600">{resume.specProgress}%</p>
                <div className="mt-2">
                  <ProgressBar value={resume.specProgress} color="#6366f1" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="rounded-[20px] border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm leading-6 text-slate-600">
              스펙 등록은 이력서 평가와 현재 점수 계산에 함께 반영됩니다.
            </div>

            <div className="mt-4 grid gap-3">
              {resume.specSections.map((section) => (
                <ResumeSpecSectionCard
                  key={section.id}
                  section={section}
                  expanded={expandedSpecSectionId === section.id}
                  onToggle={() =>
                    setExpandedSpecSectionId((current) =>
                      current === section.id ? null : section.id,
                    )
                  }
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">총 {resume.specTotalCount}개 항목 등록됨</p>
              <button
                type="button"
                onClick={resume.openExperienceHub}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                경험 허브 열기
              </button>
            </div>
          </div>
        </SurfaceCard>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <ResumeViewButton active={activeView === "content"} label="이력서 내용" onClick={() => setActiveView("content")} />
            <ResumeViewButton active={activeView === "analysis"} label="AI 평가 결과" onClick={() => setActiveView("analysis")} />
            <ResumeViewButton active={activeView === "compare"} label="Before/After 비교" onClick={() => setActiveView("compare")} />
          </div>

          {activeView === "content" ? (
            <SurfaceCard className="overflow-hidden">
              <ScrollArea className="max-h-[1100px] p-6">
                <div className="mx-auto max-w-[760px] rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-[0_18px_40px_rgba(148,163,184,0.08)]">
                  <div className="text-center">
                    <h3 className="text-[36px] font-black tracking-tight text-slate-900">{resume.userName}</h3>
                    <p className="mt-3 text-sm text-slate-500">{resume.email}</p>
                    <p className="mt-2 text-sm font-semibold text-blue-600">{resume.targetRole}</p>
                  </div>

                  <div className="mt-8 border-t-2 border-slate-700 pt-7">
                    <section className="mb-7">
                      <h4 className="mb-4 text-lg font-black text-violet-600">학력</h4>
                      <div className="grid gap-5">
                        {resume.education.map((item) => (
                          <div key={`${item.school}-${item.period}`} className="flex justify-between gap-4 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                            <div>
                              <p className="font-bold text-slate-900">{item.school}</p>
                              <p className="text-sm text-slate-600">
                                {item.degree} · {item.major}
                              </p>
                              {item.gpa ? <p className="mt-1 text-sm text-slate-500">{item.gpa}</p> : null}
                            </div>
                            <Pill className="h-fit border-slate-200 bg-slate-100 text-slate-600">{item.period}</Pill>
                          </div>
                        ))}
                      </div>
                    </section>

                    {resume.experienceSections.map((section) => (
                      <section key={section.label} className="mb-7">
                        <h4 className="mb-4 text-lg font-black text-violet-600">{section.label}</h4>
                        <div className="grid gap-5">
                          {section.items.map((item) => (
                            <div key={item.id} className="flex justify-between gap-4 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900">{item.title}</p>
                                <p className="text-sm text-slate-600">
                                  {item.organization} · {item.role}
                                </p>
                                <p className="mt-2 text-[15px] leading-7 text-slate-700">{item.improvedBullet}</p>
                              </div>
                              <Pill className="h-fit border-slate-200 bg-slate-100 text-slate-600">{item.period}</Pill>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}

                    <section className="mb-7">
                      <h4 className="mb-4 text-lg font-black text-violet-600">자격증</h4>
                      <div className="grid gap-4">
                        {resume.certificates.map((item) => (
                          <div key={`${item.name}-${item.date}`} className="flex justify-between gap-4 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                            <div>
                              <p className="font-bold text-slate-900">{item.name}</p>
                              <p className="text-sm text-slate-600">{item.issuer}</p>
                            </div>
                            <Pill className="h-fit border-slate-200 bg-slate-100 text-slate-600">{item.date}</Pill>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="mb-7">
                      <h4 className="mb-4 text-lg font-black text-violet-600">수상</h4>
                      <div className="grid gap-4">
                        {resume.awards.map((item) => (
                          <div key={`${item.title}-${item.issuer}`} className="flex justify-between gap-4 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                            <div>
                              <p className="font-bold text-slate-900">{item.title}</p>
                              <p className="text-sm text-slate-600">{item.issuer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="mb-7">
                      <h4 className="mb-4 text-lg font-black text-violet-600">논문</h4>
                      <div className="grid gap-4">
                        {resume.papers.map((item) => (
                          <div key={item.title} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                            <p className="font-bold text-slate-900">{item.title}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="mb-7">
                      <h4 className="mb-4 text-lg font-black text-violet-600">외국어</h4>
                      <div className="grid gap-4">
                        {resume.languages.map((item) => (
                          <div key={item.name} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-600">{item.detail}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="mb-4 text-lg font-black text-violet-600">기술 / 스킬</h4>
                      <div className="flex flex-wrap gap-2">
                        {resume.skillHighlights.map((skill) => (
                          <Pill key={skill} className="border-slate-200 bg-slate-100 text-slate-700">
                            {skill}
                          </Pill>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </ScrollArea>
            </SurfaceCard>
          ) : null}

          {activeView === "analysis" ? (
            <SurfaceCard className="p-6">
              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <h4 className="text-[16px] font-black text-slate-900">잘 맞는 키워드</h4>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {resume.matchedKeywords.map((keyword) => (
                        <Pill key={keyword} className="border-emerald-200 bg-emerald-50 text-emerald-700">
                          {keyword}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-500" />
                      <h4 className="text-[16px] font-black text-slate-900">보강할 키워드</h4>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {resume.missingKeywords.map((keyword) => (
                        <Pill key={keyword} className="border-amber-200 bg-amber-50 text-amber-700">
                          {keyword}
                        </Pill>
                      ))}
                      {resume.missingKeywords.length === 0 ? (
                        <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">핵심 키워드가 잘 반영되어 있습니다.</Pill>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                      <h4 className="text-[16px] font-black text-slate-900">추천 수정 포인트</h4>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {resume.recommendations.map((recommendation) => (
                        <div key={recommendation} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700">
                          {recommendation}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-blue-100 bg-blue-50/70 p-5">
                    <p className="text-sm font-semibold text-slate-500">핵심 키워드 커버리지</p>
                    <p className="mt-3 text-5xl font-black tracking-tight text-blue-700">{resume.keywordCoverage}%</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <h4 className="text-[16px] font-black text-slate-900">선택 경험 품질 점검</h4>
                    <div className="mt-4 grid gap-3">
                      {resume.selectedExperiences.map((item) => (
                        <div key={item.id} className="rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3">
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          ) : null}

          {activeView === "compare" ? (
            <SurfaceCard className="p-6">
              <div className="grid gap-4">
                {resume.beforeAfterItems.map((item) => (
                  <article key={item.id} className="rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_28px_rgba(148,163,184,0.08)]">
                    <h4 className="text-[16px] font-black text-slate-900">{item.title}</h4>
                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                      <div className="rounded-[20px] border border-rose-200 bg-rose-50/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Before</p>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{item.rawBullet}</p>
                      </div>
                      <div className="rounded-[20px] border border-emerald-200 bg-emerald-50/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">After</p>
                        <p className="mt-3 text-sm leading-7 font-semibold text-slate-800">{item.improvedBullet}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-7 text-slate-600">
                      {item.reason}
                    </div>
                  </article>
                ))}
              </div>
            </SurfaceCard>
          ) : null}

          <div className="resume-print-only">
            <div className="resume-print-page">
              <div className="resume-print-sheet">
                <div className="resume-print-header">
                  <div className="resume-print-header-main">
                    <div className="resume-print-name">{resume.userName}</div>
                    <div className="resume-print-role">{resume.targetRole}</div>
                    <div className="resume-print-headline">{resume.title}</div>
                  </div>
                  <div className="resume-print-header-side">
                    <div className="resume-print-meta-row">
                      <span className="resume-print-meta-label">Email</span>
                      <span className="resume-print-meta-value">{resume.email}</span>
                    </div>
                    <div className="resume-print-meta-row">
                      <span className="resume-print-meta-label">Focus</span>
                      <span className="resume-print-meta-value">{resume.selectedCompanyName}</span>
                    </div>
                    <div className="resume-print-meta-row">
                      <span className="resume-print-meta-label">Posting</span>
                      <span className="resume-print-meta-value">{resume.selectedPostingTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="resume-print-summary">
                  <div className="resume-print-section-title">Summary</div>
                  <p className="resume-print-summary-text">{resume.summary}</p>
                </div>

                <div className="resume-print-layout">
                  <div className="resume-print-main-column">
                    <section className="resume-print-section">
                      <div className="resume-print-section-title">학력</div>
                      {resume.education.map((item) => (
                        <div key={`print-education-${item.school}-${item.period}`} className="resume-print-item">
                          <div>
                            <div className="resume-print-item-title">{item.school}</div>
                            <div className="resume-print-item-subtitle">
                              {item.degree} · {item.major}
                            </div>
                            {item.gpa ? <div className="resume-print-item-detail">{item.gpa}</div> : null}
                          </div>
                          <div className="resume-print-pill">{item.period}</div>
                        </div>
                      ))}
                    </section>

                    {resume.experienceSections.map((section) => (
                      <section key={`print-${section.label}`} className="resume-print-section">
                        <div className="resume-print-section-title">{section.label}</div>
                        {section.items.map((item) => (
                          <div key={`print-experience-${item.id}`} className="resume-print-item">
                            <div>
                              <div className="resume-print-item-title">{item.title}</div>
                              <div className="resume-print-item-subtitle">
                                {item.organization} · {item.role}
                              </div>
                              <div className="resume-print-item-bullet">{item.improvedBullet}</div>
                            </div>
                            <div className="resume-print-pill">{item.period}</div>
                          </div>
                        ))}
                      </section>
                    ))}
                  </div>

                  <div className="resume-print-side-column">
                    <section className="resume-print-section">
                      <div className="resume-print-section-title">자격증</div>
                      {resume.certificates.map((item) => (
                        <div key={`print-certificate-${item.name}-${item.date}`} className="resume-print-item">
                          <div>
                            <div className="resume-print-item-title">{item.name}</div>
                            <div className="resume-print-item-subtitle">{item.issuer}</div>
                          </div>
                          <div className="resume-print-pill">{item.date}</div>
                        </div>
                      ))}
                    </section>

                    <section className="resume-print-section">
                      <div className="resume-print-section-title">외국어</div>
                      {resume.languages.map((item) => (
                        <div key={`print-language-${item.name}`} className="resume-print-item">
                          <div>
                            <div className="resume-print-item-title">{item.name}</div>
                            <div className="resume-print-item-subtitle">{item.detail}</div>
                          </div>
                          {item.levelLabel ? <div className="resume-print-pill">{item.levelLabel}</div> : null}
                        </div>
                      ))}
                    </section>

                    <section className="resume-print-section">
                      <div className="resume-print-section-title">기술 / 스킬</div>
                      <div className="resume-print-skills">
                        {resume.skillHighlights.map((skill) => (
                          <div key={`print-skill-${skill}`} className="resume-print-pill">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </section>

                    {resume.awards.length > 0 ? (
                      <section className="resume-print-section">
                        <div className="resume-print-section-title">수상</div>
                        {resume.awards.map((item) => (
                          <div key={`print-award-${item.title}`} className="resume-print-item">
                            <div>
                              <div className="resume-print-item-title">{item.title}</div>
                              <div className="resume-print-item-subtitle">{item.issuer}</div>
                            </div>
                          </div>
                        ))}
                      </section>
                    ) : null}

                    {resume.papers.length > 0 ? (
                      <section className="resume-print-section">
                        <div className="resume-print-section-title">논문</div>
                        {resume.papers.map((item) => (
                          <div key={`print-paper-${item.title}`} className="resume-print-item">
                            <div className="resume-print-item-title">{item.title}</div>
                          </div>
                        ))}
                      </section>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SurfaceCard className="overflow-hidden xl:col-span-2">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <h3 className="text-[16px] font-black text-slate-900">이력서 내용 편집</h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">문서 제목과 타깃 직무를 포함한 편집 내용이 우측 이력서 본문과 분석 결과에 바로 반영됩니다.</p>
          </div>

          <div className="grid gap-3 p-5">
            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">문서 제목</span>
                <input
                  value={resume.title}
                  onChange={(event) => resume.updateField("title", event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">타깃 직무</span>
                <input
                  value={resume.targetRole}
                  onChange={(event) => resume.updateField("targetRole", event.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                />
              </label>
            </div>

            <div className="rounded-[24px] border border-blue-100 bg-blue-50/70 p-4 text-sm leading-7 text-slate-600">
              현재 선택된 회사는 <span className="font-semibold text-slate-900">{resume.selectedCompanyName}</span>, 기준 공고는{" "}
              <span className="font-semibold text-slate-900">{resume.selectedPostingTitle}</span>입니다.
            </div>

            <ResumeEditorSection
              title="기본 정보"
              description="이름과 이메일을 직접 수정합니다."
              expanded={expandedEditorSectionId === "basics"}
              onToggle={() =>
                setExpandedEditorSectionId((current) => (current === "basics" ? null : "basics"))
              }
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                <EditorInput label="이름" value={resume.userName} onChange={(value) => resume.updateField("userName", value)} />
                <EditorInput label="이메일" value={resume.email} onChange={(value) => resume.updateField("email", value)} type="email" />
              </div>
            </ResumeEditorSection>

            <ResumeEditorSection
              title="학력"
              description="학교, 전공, GPA, 재학 상태를 수정합니다."
              expanded={expandedEditorSectionId === "education"}
              onToggle={() =>
                setExpandedEditorSectionId((current) => (current === "education" ? null : "education"))
              }
              actionLabel="학력 추가"
              onAction={() => {
                resume.addCollectionItem("education");
                setExpandedEditorSectionId("education");
              }}
            >
              <div className="grid gap-3">
                {resume.education.map((item, index) => (
                  <EditorItemCard
                    key={`education-${index}`}
                    title={item.school || `학력 ${index + 1}`}
                    subtitle={item.period || "기간 미입력"}
                    onRemove={() => resume.removeCollectionItem("education", index)}
                  >
                    <div className="grid gap-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <EditorInput label="학교" value={item.school} onChange={(value) => resume.updateCollectionItem("education", index, "school", value)} />
                        <EditorPeriodRange label="기간" value={item.period} onChange={(value) => resume.updateCollectionItem("education", index, "period", value)} />
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <EditorInput label="학위" value={item.degree} onChange={(value) => resume.updateCollectionItem("education", index, "degree", value)} />
                        <EditorInput label="상태" value={item.statusLabel ?? ""} onChange={(value) => resume.updateCollectionItem("education", index, "statusLabel", value)} />
                      </div>
                      <EditorInput label="전공" value={item.major} onChange={(value) => resume.updateCollectionItem("education", index, "major", value)} />
                      <EditorInput label="GPA" value={item.gpa} onChange={(value) => resume.updateCollectionItem("education", index, "gpa", value)} />
                    </div>
                  </EditorItemCard>
                ))}
              </div>
            </ResumeEditorSection>

            <ResumeEditorSection
              title="경력 / 프로젝트 / 핵심 경험"
              description="경험 허브에서 고른 항목 기준으로 연결되며, 여기서는 모든 경험 초안을 직접 다듬을 수 있습니다."
              expanded={expandedEditorSectionId === "experiences"}
              onToggle={() =>
                setExpandedEditorSectionId((current) => (current === "experiences" ? null : "experiences"))
              }
              actionLabel="경험 추가"
              onAction={() => {
                resume.addExperience();
                setExpandedEditorSectionId("experiences");
              }}
            >
              <div className="grid gap-3">
                {resume.allExperiences.map((item) => (
                  <EditorItemCard
                    key={`experience-${item.id}`}
                    title={item.title || `경험 ${item.id}`}
                    subtitle={selectedExperienceIdSet.has(item.id) ? "현재 이력서에 포함됨" : "현재 이력서에서 제외됨"}
                    onRemove={() => resume.removeExperience(item.id)}
                  >
                    <div className="grid gap-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <EditorInput label="제목" value={item.title} onChange={(value) => resume.updateExperienceField(item.id, "title", value)} />
                        <EditorInput label="기관 / 회사" value={item.organization} onChange={(value) => resume.updateExperienceField(item.id, "organization", value)} />
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <EditorPeriodRange label="기간" value={item.period} onChange={(value) => resume.updateExperienceField(item.id, "period", value)} />
                        <EditorInput label="역할" value={item.role} onChange={(value) => resume.updateExperienceField(item.id, "role", value)} />
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <EditorField label="카테고리">
                          <select
                            value={item.category}
                            onChange={(event) => resume.updateExperienceField(item.id, "category", event.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-300"
                          >
                            <option value="project">프로젝트</option>
                            <option value="internship">인턴/직무경험</option>
                            <option value="activity">대외활동</option>
                            <option value="contest">공모전/해커톤</option>
                            <option value="research">연구/논문</option>
                          </select>
                        </EditorField>
                        <EditorInput label="팀/조직 정보" value={item.teamLabel} onChange={(value) => resume.updateExperienceField(item.id, "teamLabel", value)} />
                      </div>
                      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.featured}
                          onChange={(event) => resume.updateExperienceField(item.id, "featured", event.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-amber-500"
                        />
                        핵심 경험으로 표시
                      </label>
                      <EditorTextArea label="활동 내용" value={item.overview} onChange={(value) => resume.updateExperienceField(item.id, "overview", value)} />
                      <EditorTextArea label="성과 / 결과" value={item.outcome} onChange={(value) => resume.updateExperienceField(item.id, "outcome", value)} />
                      <EditorTextArea label="배운 점" value={item.learning} onChange={(value) => resume.updateExperienceField(item.id, "learning", value)} />
                      <EditorTextArea label="Before 문장" value={item.rawBullet} onChange={(value) => resume.updateExperienceField(item.id, "rawBullet", value)} />
                      <EditorTextArea label="After 문장" value={item.improvedBullet} onChange={(value) => resume.updateExperienceField(item.id, "improvedBullet", value)} />
                      <EditorTextArea label="수정 이유" value={item.bulletReason} onChange={(value) => resume.updateExperienceField(item.id, "bulletReason", value)} minHeightClassName="min-h-[80px]" />
                      <div className="grid gap-3 md:grid-cols-2">
                        <EditorInput
                          label="태그"
                          value={item.tags.join(", ")}
                          onChange={(value) => resume.updateExperienceField(item.id, "tags", value)}
                          placeholder="쉼표로 구분해 입력"
                        />
                        <EditorInput
                          label="키워드"
                          value={item.keywords.join(", ")}
                          onChange={(value) => resume.updateExperienceField(item.id, "keywords", value)}
                          placeholder="쉼표로 구분해 입력"
                        />
                      </div>
                    </div>
                  </EditorItemCard>
                ))}
              </div>
            </ResumeEditorSection>

            <ResumeEditorSection
              title="자격증"
              description="이력서 본문과 스펙 카드에 함께 표시됩니다."
              expanded={expandedEditorSectionId === "certificates"}
              onToggle={() =>
                setExpandedEditorSectionId((current) => (current === "certificates" ? null : "certificates"))
              }
              actionLabel="자격증 추가"
              onAction={() => {
                resume.addCollectionItem("certificates");
                setExpandedEditorSectionId("certificates");
              }}
            >
              <div className="grid gap-3">
                {resume.certificates.map((item, index) => (
                  <EditorItemCard
                    key={`certificate-${index}`}
                    title={item.name || `자격증 ${index + 1}`}
                    subtitle={item.date || "취득일 미입력"}
                    onRemove={() => resume.removeCollectionItem("certificates", index)}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <EditorInput label="자격증명" value={item.name} onChange={(value) => resume.updateCollectionItem("certificates", index, "name", value)} />
                      <EditorMonthInput label="취득일" value={item.date} onChange={(value) => resume.updateCollectionItem("certificates", index, "date", value)} />
                      <div className="md:col-span-2">
                        <EditorInput label="발급기관" value={item.issuer} onChange={(value) => resume.updateCollectionItem("certificates", index, "issuer", value)} />
                      </div>
                    </div>
                  </EditorItemCard>
                ))}
              </div>
            </ResumeEditorSection>

            <ResumeEditorSection
              title="외국어"
              description="언어, 점수/시험명, 숙련도 배지를 수정합니다."
              expanded={expandedEditorSectionId === "languages"}
              onToggle={() =>
                setExpandedEditorSectionId((current) => (current === "languages" ? null : "languages"))
              }
              actionLabel="어학 추가"
              onAction={() => {
                resume.addCollectionItem("languages");
                setExpandedEditorSectionId("languages");
              }}
            >
              <div className="grid gap-3">
                {resume.languages.map((item, index) => (
                  <EditorItemCard
                    key={`language-${index}`}
                    title={item.name || `어학 ${index + 1}`}
                    subtitle={item.levelLabel || "등급 미입력"}
                    onRemove={() => resume.removeCollectionItem("languages", index)}
                  >
                    <div className="grid gap-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <EditorInput label="언어" value={item.name} onChange={(value) => resume.updateCollectionItem("languages", index, "name", value)} />
                        <EditorInput label="등급" value={item.levelLabel ?? ""} onChange={(value) => resume.updateCollectionItem("languages", index, "levelLabel", value)} />
                      </div>
                      <EditorInput label="세부 내용" value={item.detail} onChange={(value) => resume.updateCollectionItem("languages", index, "detail", value)} />
                    </div>
                  </EditorItemCard>
                ))}
              </div>
            </ResumeEditorSection>

            <ResumeEditorSection
              title="기술 스택"
              description="스킬명, 분야, 숙련도를 수정합니다."
              expanded={expandedEditorSectionId === "skills"}
              onToggle={() =>
                setExpandedEditorSectionId((current) => (current === "skills" ? null : "skills"))
              }
              actionLabel="스택 추가"
              onAction={() => {
                resume.addCollectionItem("skillSpecs");
                setExpandedEditorSectionId("skills");
              }}
            >
              <div className="grid gap-3">
                {resume.skillSpecs.map((item, index) => (
                  <EditorItemCard
                    key={`skill-${index}`}
                    title={item.name || `기술 ${index + 1}`}
                    subtitle={item.levelLabel}
                    onRemove={() => resume.removeCollectionItem("skillSpecs", index)}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <EditorInput label="기술명" value={item.name} onChange={(value) => resume.updateCollectionItem("skillSpecs", index, "name", value)} />
                      <EditorInput label="분야" value={item.track} onChange={(value) => resume.updateCollectionItem("skillSpecs", index, "track", value)} />
                      <div className="md:col-span-2">
                        <EditorField label="숙련도">
                          <select
                            value={item.levelLabel}
                            onChange={(event) => resume.updateCollectionItem("skillSpecs", index, "levelLabel", event.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-300"
                          >
                            <option value="상">상</option>
                            <option value="중">중</option>
                            <option value="하">하</option>
                          </select>
                        </EditorField>
                      </div>
                    </div>
                  </EditorItemCard>
                ))}
              </div>
            </ResumeEditorSection>

            <ResumeEditorSection
              title="수상"
              description="수상명과 주최 기관을 편집합니다."
              expanded={expandedEditorSectionId === "awards"}
              onToggle={() =>
                setExpandedEditorSectionId((current) => (current === "awards" ? null : "awards"))
              }
              actionLabel="수상 추가"
              onAction={() => {
                resume.addCollectionItem("awards");
                setExpandedEditorSectionId("awards");
              }}
            >
              <div className="grid gap-3">
                {resume.awards.map((item, index) => (
                  <EditorItemCard
                    key={`award-${index}`}
                    title={item.title || `수상 ${index + 1}`}
                    subtitle={item.issuer || "기관 미입력"}
                    onRemove={() => resume.removeCollectionItem("awards", index)}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <EditorInput label="수상명" value={item.title} onChange={(value) => resume.updateCollectionItem("awards", index, "title", value)} />
                      <EditorInput label="주최 기관" value={item.issuer} onChange={(value) => resume.updateCollectionItem("awards", index, "issuer", value)} />
                    </div>
                  </EditorItemCard>
                ))}
              </div>
            </ResumeEditorSection>

            <ResumeEditorSection
              title="논문"
              description="논문 제목을 편집합니다."
              expanded={expandedEditorSectionId === "papers"}
              onToggle={() =>
                setExpandedEditorSectionId((current) => (current === "papers" ? null : "papers"))
              }
              actionLabel="논문 추가"
              onAction={() => {
                resume.addCollectionItem("papers");
                setExpandedEditorSectionId("papers");
              }}
            >
              <div className="grid gap-3">
                {resume.papers.map((item, index) => (
                  <EditorItemCard
                    key={`paper-${index}`}
                    title={item.title || `논문 ${index + 1}`}
                    onRemove={() => resume.removeCollectionItem("papers", index)}
                  >
                    <EditorInput label="논문 제목" value={item.title} onChange={(value) => resume.updateCollectionItem("papers", index, "title", value)} />
                  </EditorItemCard>
                ))}
              </div>
            </ResumeEditorSection>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
