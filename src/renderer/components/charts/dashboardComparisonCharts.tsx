import type {
  CompanyTarget,
  FunnelStep,
  OfferProfile,
} from "../../features/dashboard/types";
import type {
  StrategyMatrixModel,
  StrategyQuadrantId,
} from "../../features/dashboard/domain/strategyMatrix";
import { cn } from "../../lib/cn";

const FUNNEL_COLORS = ["#4f46e5", "#2563eb", "#0ea5e9", "#14b8a6", "#22c55e"];
const RADAR_AXES: Array<keyof Pick<OfferProfile, "salary" | "wlb" | "growth" | "location" | "culture">> = [
  "salary",
  "wlb",
  "growth",
  "location",
  "culture",
];
const RADAR_LABELS = ["보상", "워라밸", "성장", "위치", "문화"];

export function FunnelChart({ data }: { data: FunnelStep[] }) {
  const maxCount = data[0]?.count ?? 1;

  return (
    <div className="flex w-full flex-col items-center space-y-1 py-4">
      {data.map((item, index) => {
        const widthPercent = Math.max((item.count / maxCount) * 100, 18);

        return (
          <div key={item.stage} className="relative flex w-full flex-col items-center">
            <div
              className="flex h-10 items-center justify-between rounded px-4 text-sm font-semibold text-white shadow-sm"
              style={{ width: `${widthPercent}%`, backgroundColor: FUNNEL_COLORS[index] }}
            >
              <span className={cn(widthPercent < 36 ? "hidden" : "block")}>{item.stage}</span>
              <span className="text-base font-bold">{item.count}</span>
            </div>
            {index < data.length - 1 ? (
              <div className="my-1 text-[11px] font-medium text-slate-400">
                전환율 {item.count === 0 ? 0 : ((data[index + 1].count / item.count) * 100).toFixed(1)}%
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

const STRATEGY_QUADRANT_TONES: Record<
  StrategyQuadrantId,
  { panel: string; label: string; point: string }
> = {
  observe: {
    panel: "bg-slate-100/85 text-slate-600",
    label: "border-slate-200 bg-white/90 text-slate-700",
    point: "bg-slate-500",
  },
  stretch: {
    panel: "bg-amber-50/85 text-amber-700",
    label: "border-amber-200 bg-white/90 text-amber-700",
    point: "bg-amber-500",
  },
  stable: {
    panel: "bg-emerald-50/85 text-emerald-700",
    label: "border-emerald-200 bg-white/90 text-emerald-700",
    point: "bg-emerald-500",
  },
  focus: {
    panel: "bg-cyan-50/85 text-cyan-700",
    label: "border-cyan-200 bg-white/90 text-cyan-700",
    point: "bg-cyan-500",
  },
};

function getScaledPercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

export function StrategyMatrix({
  model,
  onSelect,
}: {
  model: StrategyMatrixModel;
  onSelect: (id: number) => void;
}) {
  const fitThresholdPercent = getScaledPercent(
    model.fitScale.threshold,
    model.fitScale.min,
    model.fitScale.max,
  );
  const preferenceThresholdPercent =
    100 -
    getScaledPercent(
      model.preferenceScale.threshold,
      model.preferenceScale.min,
      model.preferenceScale.max,
    );
  const selectedLeft = getScaledPercent(
    model.selectedPoint.fit,
    model.fitScale.min,
    model.fitScale.max,
  );
  const selectedTop =
    100 -
    getScaledPercent(
      model.selectedPoint.preference,
      model.preferenceScale.min,
      model.preferenceScale.max,
    );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {model.quadrantSummaries.map((quadrant) => (
          <div
            key={quadrant.id}
            className={cn(
              "rounded-2xl border border-white/60 px-4 py-3 shadow-sm",
              STRATEGY_QUADRANT_TONES[quadrant.id].panel,
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold">{quadrant.label}</p>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold">
                {quadrant.count}곳
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 opacity-90">{quadrant.description}</p>
          </div>
        ))}
      </div>

      <div className="relative aspect-[11/9] w-full overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.88))] shadow-inner">
        <div
          className="absolute inset-y-0 left-0 border-r border-white/40 bg-slate-100/70"
          style={{ width: `${fitThresholdPercent}%` }}
        />
        <div
          className="absolute left-0 top-0 border-b border-white/40 bg-amber-50/60"
          style={{ width: `${fitThresholdPercent}%`, height: `${preferenceThresholdPercent}%` }}
        />
        <div
          className="absolute right-0 top-0 border-l border-white/40 bg-cyan-50/65"
          style={{ width: `${100 - fitThresholdPercent}%`, height: `${preferenceThresholdPercent}%` }}
        />
        <div
          className="absolute bottom-0 right-0 border-l border-t border-white/40 bg-emerald-50/70"
          style={{ width: `${100 - fitThresholdPercent}%`, height: `${100 - preferenceThresholdPercent}%` }}
        />

        {model.fitScale.ticks.map((tick) => {
          const left = getScaledPercent(tick, model.fitScale.min, model.fitScale.max);
          return (
            <div key={`fit-${tick}`}>
              <div
                className="absolute inset-y-0 border-l border-dashed border-slate-300/70"
                style={{ left: `${left}%` }}
              />
              <span
                className="absolute bottom-3 -translate-x-1/2 text-[11px] font-semibold text-slate-500"
                style={{ left: `${left}%` }}
              >
                {tick}
              </span>
            </div>
          );
        })}

        {model.preferenceScale.ticks.map((tick) => {
          const top =
            100 - getScaledPercent(tick, model.preferenceScale.min, model.preferenceScale.max);
          return (
            <div key={`pref-${tick}`}>
              <div
                className="absolute inset-x-0 border-t border-dashed border-slate-300/70"
                style={{ top: `${top}%` }}
              />
              <span
                className="absolute left-3 -translate-y-1/2 text-[11px] font-semibold text-slate-500"
                style={{ top: `${top}%` }}
              >
                {tick}
              </span>
            </div>
          );
        })}

        <div
          className="absolute inset-y-0 border-l-2 border-cyan-300/80"
          style={{ left: `${fitThresholdPercent}%` }}
        />
        <div
          className="absolute inset-x-0 border-t-2 border-cyan-300/80"
          style={{ top: `${preferenceThresholdPercent}%` }}
        />

        <span className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
          적합도
        </span>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
          선호도
        </span>

        <div className="absolute left-5 top-5 max-w-[180px] rounded-2xl border border-slate-200 bg-white/92 p-3 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Selected</p>
          <p className="mt-1 text-base font-bold text-slate-900">{model.selectedPoint.name}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
              전략 점수 {model.selectedPoint.strategicScore}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-1 font-semibold",
                STRATEGY_QUADRANT_TONES[model.selectedPoint.quadrantId].label,
              )}
            >
              {model.quadrantSummaries.find((item) => item.id === model.selectedPoint.quadrantId)?.label}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            적합도 {model.selectedPoint.fit}% / 선호도 {model.selectedPoint.preference}%
          </p>
        </div>

        <div
          className="absolute bottom-12 border-l-2 border-dotted border-slate-400/80"
          style={{
            left: `${selectedLeft}%`,
            top: `${selectedTop}%`,
          }}
        />
        <div
          className="absolute left-10 border-t-2 border-dotted border-slate-400/80"
          style={{
            top: `${selectedTop}%`,
            width: `calc(${selectedLeft}% - 2.5rem)`,
          }}
        />

        {model.points.map((point) => {
          const left = getScaledPercent(point.fit, model.fitScale.min, model.fitScale.max);
          const top =
            100 - getScaledPercent(point.preference, model.preferenceScale.min, model.preferenceScale.max);
          const shouldPlaceLabelAbove = top > 70;
          const horizontalLabelClassName =
            left < 14
              ? "left-0 translate-x-0"
              : left > 86
                ? "right-0 translate-x-0"
                : "left-1/2 -translate-x-1/2";
          const verticalLabelClassName = shouldPlaceLabelAbove ? "bottom-12" : "top-12";

          return (
            <button
              key={point.id}
              type="button"
              onClick={() => onSelect(point.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div className="relative">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-xs font-black text-white shadow-lg transition-all duration-200 group-hover:scale-110",
                    STRATEGY_QUADRANT_TONES[point.quadrantId].point,
                    model.selectedPoint.id === point.id ? "scale-110 ring-8 ring-cyan-100/70" : "ring-4 ring-white/60",
                  )}
                >
                  {point.rank}
                </div>
                <div
                  className={cn(
                    "absolute min-w-[84px] max-w-[116px] rounded-2xl border px-2.5 py-2 text-center shadow-sm backdrop-blur transition-all",
                    horizontalLabelClassName,
                    verticalLabelClassName,
                    STRATEGY_QUADRANT_TONES[point.quadrantId].label,
                    model.selectedPoint.id === point.id ? "opacity-100" : "opacity-90 group-hover:opacity-100",
                  )}
                >
                  <p className="whitespace-pre-line text-[11px] font-bold leading-4">{point.shortName}</p>
                  <p className="mt-1 text-[10px] font-semibold opacity-80">점수 {point.strategicScore}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RadarChart({
  data1,
  data2,
  color1,
  color2,
  className,
}: {
  data1: OfferProfile;
  data2: OfferProfile;
  color1: string;
  color2: string;
  className?: string;
}) {
  const center = 150;
  const radius = 100;
  const angleStep = (Math.PI * 2) / RADAR_AXES.length;

  const getPoints = (profile: OfferProfile) =>
    RADAR_AXES
      .map((axis, index) => {
        const value = profile[axis] / 100;
        const x = center + radius * value * Math.cos(index * angleStep - Math.PI / 2);
        const y = center + radius * value * Math.sin(index * angleStep - Math.PI / 2);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg
      viewBox="0 0 300 300"
      className={cn("mx-auto h-full w-full max-w-sm overflow-visible", className)}
    >
      {[0.2, 0.4, 0.6, 0.8, 1].map((level) => (
        <polygon
          key={level}
          points={RADAR_AXES
            .map(
              (_, index) =>
                `${center + radius * level * Math.cos(index * angleStep - Math.PI / 2)},${
                  center + radius * level * Math.sin(index * angleStep - Math.PI / 2)
                }`,
            )
            .join(" ")}
          fill="none"
          stroke="#dbe4ef"
          strokeWidth="1"
        />
      ))}
      {RADAR_AXES.map((_, index) => (
        <line
          key={`line-${RADAR_LABELS[index]}`}
          x1={center}
          y1={center}
          x2={center + radius * Math.cos(index * angleStep - Math.PI / 2)}
          y2={center + radius * Math.sin(index * angleStep - Math.PI / 2)}
          stroke="#dbe4ef"
          strokeWidth="1"
        />
      ))}
      {RADAR_LABELS.map((label, index) => {
        const x = center + (radius + 26) * Math.cos(index * angleStep - Math.PI / 2);
        const y = center + (radius + 18) * Math.sin(index * angleStep - Math.PI / 2);
        return (
          <text
            key={label}
            x={x}
            y={y}
            fontSize="10"
            fontWeight="700"
            fill="#64748b"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
      <polygon points={getPoints(data1)} fill={color1} fillOpacity="0.28" stroke={color1} strokeWidth="2.5" />
      <polygon points={getPoints(data2)} fill={color2} fillOpacity="0.28" stroke={color2} strokeWidth="2.5" />
    </svg>
  );
}
