import type {
  CompanyTarget,
  FunnelStep,
  OfferProfile,
} from "../../features/dashboard/types";
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

export function StrategyMatrix({
  data,
  selectedId,
  onSelect,
}: {
  data: CompanyTarget[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="relative aspect-[4/3] w-full rounded-tr-lg border-b-2 border-l-2 border-slate-300 bg-slate-50/50">
      <div className="absolute left-0 top-0 h-1/2 w-1/2 bg-yellow-50/40" />
      <div className="absolute right-0 top-0 h-1/2 w-1/2 rounded-tr-lg bg-blue-50/40" />
      <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-slate-100/60" />
      <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-emerald-50/40" />
      <div className="absolute left-0 top-1/2 h-px w-full border-t border-dashed border-slate-400" />
      <div className="absolute left-1/2 top-0 h-full w-px border-l border-dashed border-slate-400" />
      <span className="absolute left-4 top-2 text-xs font-bold text-yellow-700/80">선호 낮음</span>
      <span className="absolute right-4 top-2 text-xs font-bold text-blue-700/80">선호 높음</span>
      <span className="absolute bottom-4 left-4 text-xs font-bold text-slate-500">적합도 낮음</span>
      <span className="absolute bottom-4 right-4 text-xs font-bold text-emerald-700/80">적합도 높음</span>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">
        적합도
      </span>
      <span className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs font-bold text-slate-600">
        선호도
      </span>
      {data.map((target) => {
        const left = `${target.fit}%`;
        const top = `${100 - target.preference}%`;
        const colorClass =
          target.type === "집중 지원"
            ? "bg-blue-500"
            : target.type === "스트레치"
              ? "bg-amber-400"
              : "bg-emerald-500";

        return (
          <button
            key={target.id}
            type="button"
            onClick={() => onSelect(target.id)}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left, top }}
          >
            <div
              className={cn(
                "h-4 w-4 rounded-full ring-4 ring-white transition-all group-hover:scale-125",
                colorClass,
                selectedId === target.id ? "scale-125 shadow-lg" : "shadow-sm",
              )}
            />
            <span
              className={cn(
                "absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm transition-opacity",
                selectedId === target.id ? "opacity-100" : "opacity-85",
              )}
            >
              {target.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function RadarChart({
  data1,
  data2,
  color1,
  color2,
}: {
  data1: OfferProfile;
  data2: OfferProfile;
  color1: string;
  color2: string;
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
    <svg viewBox="0 0 300 300" className="mx-auto h-full w-full max-w-sm overflow-visible">
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
