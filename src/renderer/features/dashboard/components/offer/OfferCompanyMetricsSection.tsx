import { BarChart3, Building2, Trophy } from "lucide-react";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type OfferCompanyMetricsSectionProps = {
  offer: DashboardController["offer"];
};

const METRIC_CONFIGS = [
  { key: "salary", label: "연봉 / 보상", color: "#2563eb", bgClassName: "bg-blue-50", textClassName: "text-blue-700" },
  { key: "growth", label: "성장성", color: "#7c3aed", bgClassName: "bg-violet-50", textClassName: "text-violet-700" },
  { key: "wlb", label: "워라밸", color: "#0f766e", bgClassName: "bg-teal-50", textClassName: "text-teal-700" },
  { key: "location", label: "위치 / 출퇴근", color: "#ea580c", bgClassName: "bg-orange-50", textClassName: "text-orange-700" },
  { key: "culture", label: "조직문화", color: "#16a34a", bgClassName: "bg-emerald-50", textClassName: "text-emerald-700" },
] as const;

function getAverageScore(profile: DashboardController["offer"]["selectedOfferA"]["profile"]) {
  return Math.round(
    (profile.salary + profile.growth + profile.wlb + profile.location + profile.culture) / 5,
  );
}

export function OfferCompanyMetricsSection({
  offer,
}: OfferCompanyMetricsSectionProps) {
  const rankedByAverage = [...offer.offerCatalog].sort(
    (left, right) => getAverageScore(right.profile) - getAverageScore(left.profile),
  );
  const leader = rankedByAverage[0];

  return (
    <SurfaceCard className="overflow-hidden border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.97),_rgba(241,245,249,0.94))] p-6 shadow-[0_20px_45px_rgba(148,163,184,0.14)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-[22px] font-black tracking-tight text-slate-900">전체 오퍼 지표 비교</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            모든 기업을 지표별 그래프로 한 번에 비교하고, 아래에서 필요한 경우 1대1 상세 비교로 내려갑니다.
          </p>
        </div>
        {leader ? (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-amber-700">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-[0.18em]">Top Offer</span>
            </div>
            <p className="mt-2 text-lg font-black text-slate-900">{leader.label}</p>
            <p className="mt-1 text-sm text-slate-600">종합 평균 {getAverageScore(leader.profile)}점</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-5">
        {METRIC_CONFIGS.map((metric) => {
          const sortedOffers = [...offer.offerCatalog].sort(
            (left, right) => right.profile[metric.key] - left.profile[metric.key],
          );

          return (
            <div
              key={metric.key}
              className={cn(
                "rounded-[24px] border border-slate-200 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
                metric.bgClassName,
              )}
            >
              <p className={cn("text-sm font-black", metric.textClassName)}>{metric.label}</p>
              <div className="mt-4 grid gap-3">
                {sortedOffers.map((item, index) => {
                  const value = item.profile[metric.key];
                  const isOfferA = item.id === offer.selectedOfferA.id;
                  const isOfferB = item.id === offer.selectedOfferB.id;

                  return (
                    <div
                      key={`${metric.key}-${item.id}`}
                      className={cn(
                        "rounded-[18px] border px-3 py-3",
                        isOfferA
                          ? "border-blue-200 bg-white"
                          : isOfferB
                            ? "border-emerald-200 bg-white"
                            : "border-white/70 bg-white/75",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-slate-400">#{index + 1}</span>
                            <p className="truncate text-sm font-bold text-slate-900">{item.label}</p>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {isOfferA ? <Pill className="border-blue-200 bg-blue-50 text-blue-700">회사 A</Pill> : null}
                            {isOfferB ? <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">회사 B</Pill> : null}
                          </div>
                        </div>
                        <span className="text-sm font-black text-slate-900">{value}</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-200/80">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${value}%`, backgroundColor: metric.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-white/80 p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-500" />
          <p className="text-sm font-black text-slate-900">종합 평균 순위</p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {rankedByAverage.map((item, index) => (
            <div
              key={`overall-${item.id}`}
              className={cn(
                "rounded-[20px] border px-4 py-3",
                item.id === offer.selectedOfferA.id
                  ? "border-blue-200 bg-blue-50/70"
                  : item.id === offer.selectedOfferB.id
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-slate-200 bg-slate-50/70",
              )}
            >
              <p className="text-xs font-black text-slate-400">#{index + 1}</p>
              <p className="mt-2 text-sm font-black text-slate-900">{item.label}</p>
              <p className="mt-1 text-lg font-black text-slate-900">{getAverageScore(item.profile)}점</p>
            </div>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
