import { ArrowRightLeft, Sparkles } from "lucide-react";
import { RadarChart } from "../../../../components/charts/DashboardCharts";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { buildCompanyComparisonRows } from "../../domain/companyAnalysisSelectors";
import { ComparisonDetailTableCard } from "../shared/ComparisonDetailTableCard";
import { OfferGlassSelect } from "./OfferGlassSelect";

type OfferRadarSectionProps = {
  offer: DashboardController["offer"];
};

export function OfferRadarSection({
  offer,
}: OfferRadarSectionProps) {
  const offerA = offer.selectedOfferA;
  const offerB = offer.selectedOfferB;
  const comparisonRows = buildCompanyComparisonRows(
    {
      description: "",
      roleDescription: "",
      techStack: [],
      news: [],
      comparison: offerA.profile,
    },
    {
      description: "",
      roleDescription: "",
      techStack: [],
      news: [],
      comparison: offerB.profile,
    },
  );

  const metrics = [
    { label: "연봉/보상", key: "salary" as const },
    { label: "워라밸", key: "wlb" as const },
    { label: "성장성", key: "growth" as const },
    { label: "위치/출퇴근", key: "location" as const },
    { label: "조직문화", key: "culture" as const },
  ];

  const totalScoreA = Math.round(
    metrics.reduce((sum, item) => sum + offerA.profile[item.key], 0) / metrics.length,
  );
  const totalScoreB = Math.round(
    metrics.reduce((sum, item) => sum + offerB.profile[item.key], 0) / metrics.length,
  );

  const cardToneA = {
    label: "text-blue-600",
    pill: "border-blue-200 bg-blue-50 text-blue-700",
    accent: "#2563eb",
  };
  const cardToneB = {
    label: "text-emerald-600",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accent: "#10b981",
  };

  return (
    <SurfaceCard className="overflow-hidden border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(248,250,252,0.92))] p-6 shadow-[0_20px_45px_rgba(148,163,184,0.16)]">
      <div className="rounded-[30px] border border-slate-200/80 bg-[radial-gradient(circle_at_top,_rgba(219,234,254,0.28),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.88),_rgba(248,250,252,0.94))] p-5 md:p-7">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            연봉, 성장, 출퇴근, 조직문화까지 한 화면 비교
          </div>

          <div className="grid w-full max-w-[760px] items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
            <OfferGlassSelect
              label="회사 A"
              value={offerA.id}
              options={offer.offerCatalog.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
              onChange={offer.setSelectedOfferA}
              tone="blue"
            />

            <div className="flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-300 shadow-sm">
                <ArrowRightLeft className="h-7 w-7" />
              </div>
            </div>

            <OfferGlassSelect
              label="회사 B"
              value={offerB.id}
              options={offer.offerCatalog.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
              onChange={offer.setSelectedOfferB}
              tone="emerald"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.46fr_0.54fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white/70 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">오퍼 비교 레이더</h3>
                <p className="mt-1 text-sm text-slate-500">
                  보상, 성장, 생활 균형, 위치, 문화 점수를 한 번에 확인합니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill className={cardToneA.pill}>{offerA.label}</Pill>
                <Pill className={cardToneB.pill}>{offerB.label}</Pill>
              </div>
            </div>

            <RadarChart
              data1={offerA.profile}
              data2={offerB.profile}
              color1={cardToneA.accent}
              color2={cardToneB.accent}
              className="max-w-[440px]"
            />

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">회사 A 총평</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{totalScoreA}<span className="ml-1 text-base text-slate-400">점</span></p>
                <p className="mt-1 text-sm text-slate-600">기본 {offerA.profile.base}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">회사 B 총평</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{totalScoreB}<span className="ml-1 text-base text-slate-400">점</span></p>
                <p className="mt-1 text-sm text-slate-600">기본 {offerB.profile.base}</p>
              </div>
            </div>
          </div>

          <ComparisonDetailTableCard
            title="세부 비교 테이블"
            description="이미지 기준으로 항목별 강약을 바로 읽을 수 있게 정렬했습니다."
            leftLabel={offerA.label}
            rightLabel={offerB.label}
            leftClassName="text-blue-600"
            rightClassName="text-emerald-600"
            rows={comparisonRows}
          />
        </div>
      </div>
    </SurfaceCard>
  );
}
