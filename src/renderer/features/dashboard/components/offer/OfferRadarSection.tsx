import { useState } from "react";
import { ArrowRightLeft, Sparkles } from "lucide-react";
import { RadarChart } from "../../../../components/charts/DashboardCharts";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { buildCompanyComparisonRows } from "../../domain/companyAnalysisSelectors";
import { ComparisonDetailTableCard } from "../shared/ComparisonDetailTableCard";
import { OfferGlassSelect } from "./OfferGlassSelect";
import { OfferNotesSection } from "./OfferNotesSection";

type OfferRadarSectionProps = {
  offer: DashboardController["offer"];
};

export function OfferRadarSection({
  offer,
}: OfferRadarSectionProps) {
  const [detailOpen, setDetailOpen] = useState(false);
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
    pill: "border-blue-200 bg-blue-50 text-blue-700",
    accent: "#2563eb",
  };
  const cardToneB = {
    pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accent: "#10b981",
  };

  return (
    <SurfaceCard className="overflow-hidden border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(248,250,252,0.92))] p-6 shadow-[0_20px_45px_rgba(148,163,184,0.16)]">
      <div className="rounded-[30px] border border-slate-200/80 bg-[radial-gradient(circle_at_top,_rgba(219,234,254,0.28),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.88),_rgba(248,250,252,0.94))] p-5 md:p-7">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <Sparkles className="h-3.5 w-3.5" />
              1대1 비교는 하단 상세 패널에서 깊게 확인합니다.
            </div>
            <button
              type="button"
              onClick={() => setDetailOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {detailOpen ? "상세 메뉴 닫기" : "상세 메뉴 열기"}
            </button>
          </div>

          <div className="grid w-full max-w-[760px] items-end gap-4 self-center md:grid-cols-[1fr_auto_1fr]">
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

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.56fr_0.44fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white/70 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">오퍼 1대1 레이더</h3>
                <p className="mt-1 text-sm text-slate-500">
                  전체 비교판에서 고른 후보를 두 개만 골라 세밀하게 읽는 영역입니다.
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
              className="max-w-[420px]"
            />
          </div>

          <div className="grid gap-4">
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Quick Read</p>
              <div className="mt-4 grid gap-3">
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

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-sm font-black text-slate-900">지표별 승부 포인트</p>
              <div className="mt-4 grid gap-3">
                {metrics.map((metric) => {
                  const diff = offerA.profile[metric.key] - offerB.profile[metric.key];
                  const winner = diff === 0 ? "동률" : diff > 0 ? offerA.label : offerB.label;

                  return (
                    <div key={metric.key} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-900">{metric.label}</p>
                        <span className="text-xs font-semibold text-slate-500">{winner}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {offerA.label} {offerA.profile[metric.key]} / {offerB.label} {offerB.profile[metric.key]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {detailOpen ? (
          <div className="mt-6 grid gap-6">
            <ComparisonDetailTableCard
              title="세부 비교 테이블"
              description="항목별 강약을 한 줄씩 읽기 쉽도록 상세 메뉴 안으로 옮겼습니다."
              leftLabel={offerA.label}
              rightLabel={offerB.label}
              leftClassName="text-blue-600"
              rightClassName="text-emerald-600"
              rows={comparisonRows}
            />

            <OfferNotesSection offers={[offerA, offerB]} />
          </div>
        ) : null}
      </div>
    </SurfaceCard>
  );
}
