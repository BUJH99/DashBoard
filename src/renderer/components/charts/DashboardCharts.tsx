import type { CompanyTarget, FunnelStep, KpiMetric, OfferProfile } from "../../features/dashboard/types";
import { cn } from "../../lib/cn";
import { ScrollArea } from "../ui/ScrollArea";
import { Pill, ProgressBar, SurfaceCard } from "../ui/primitives";

export function Sparkline({ data, strokeColor }: { data: number[]; strokeColor: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => `${(index / (data.length - 1)) * 100},${100 - ((value - min) / range) * 80 - 10}`)
    .join(" ");
  const gradientId = `spark-${strokeColor.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 100 100" className="h-12 w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${points} 100,100`} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KpiCard({ metric }: { metric: KpiMetric }) {
  return (
    <SurfaceCard className="p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-slate-900">{metric.value}</span>
            {metric.suffix ? <span className="text-sm font-medium text-slate-500">{metric.suffix}</span> : null}
          </div>
        </div>
        <Pill className={cn(metric.trend.startsWith("+") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-600")}>
          {metric.trend} 理쒓렐
        </Pill>
      </div>
      <Sparkline data={metric.data} strokeColor={metric.color} />
    </SurfaceCard>
  );
}

export function PipelineBar({
  label,
  stage,
  progress,
  expectedDate,
  colorHex,
}: {
  label: string;
  stage: string;
  progress: number;
  expectedDate: string;
  colorHex: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-32 shrink-0 font-semibold text-slate-700">{label}</div>
      <div className="w-24 shrink-0 text-xs text-slate-500">{stage}</div>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${progress}%`, backgroundColor: colorHex }} />
      </div>
      <div className="w-24 shrink-0 text-right text-xs text-slate-400">{expectedDate}</div>
    </div>
  );
}

export function SemiCircleGauge({ value, target, label, colorHex }: { value: number; target: number; label: string; colorHex: string }) {
  const radius = 40;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const targetAngle = (target / 100) * 180;
  const targetX = 50 - 45 * Math.cos(targetAngle * (Math.PI / 180));
  const targetY = 50 - 45 * Math.sin(targetAngle * (Math.PI / 180));

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 55" className="h-auto w-32 overflow-visible">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={colorHex} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
        <line x1="50" y1="50" x2={targetX} y2={targetY} stroke="#334155" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
      <div className="mt-1 text-center">
        <p className="text-lg font-bold text-slate-800">{value}%</p>
        <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
        <p className="text-[10px] text-slate-400">紐⑺몴: {target}%</p>
      </div>
    </div>
  );
}

export function FunnelChart({ data }: { data: FunnelStep[] }) {
  const maxCount = data[0]?.count ?? 1;

  return (
    <div className="flex w-full flex-col items-center space-y-1 py-4">
      {data.map((item, index) => {
        const widthPercent = Math.max((item.count / maxCount) * 100, 18);
        const colors = ["#4f46e5", "#2563eb", "#0ea5e9", "#14b8a6", "#22c55e"];

        return (
          <div key={item.stage} className="relative flex w-full flex-col items-center">
            <div className="flex h-10 items-center justify-between rounded px-4 text-sm font-semibold text-white shadow-sm" style={{ width: `${widthPercent}%`, backgroundColor: colors[index] }}>
              <span className={cn(widthPercent < 36 ? "hidden" : "block")}>{item.stage}</span>
              <span className="text-base font-bold">{item.count}</span>
            </div>
            {index < data.length - 1 ? (
              <div className="my-1 text-[11px] font-medium text-slate-400">
                ???꾪솚??{item.count === 0 ? 0 : ((data[index + 1].count / item.count) * 100).toFixed(1)}%
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
      <span className="absolute left-4 top-2 text-xs font-bold text-yellow-600/80">?꾩쟾: ?곹뼢 吏??</span>
      <span className="absolute right-4 top-2 text-xs font-bold text-blue-600/80">1?쒖쐞: 吏묒쨷 怨듬왂</span>
      <span className="absolute bottom-4 left-4 text-xs font-bold text-slate-400">蹂대쪟/?ш퀬</span>
      <span className="absolute bottom-4 right-4 text-xs font-bold text-emerald-600/80">?뚮옖B: ?덉젙 吏??</span>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">?⑷꺽 媛?μ꽦 (Fit & Readiness) ??</span>
      <span className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs font-bold text-slate-600">???좏샇??(Preference) ??</span>
      {data.map((target) => {
        const left = `${target.fit}%`;
        const top = `${100 - target.preference}%`;
        const colorClass =
          target.type === "吏묒쨷怨듬왂"
            ? "bg-blue-500"
            : target.type === "?곹뼢吏??"
              ? "bg-amber-400"
              : "bg-emerald-500";

        return (
          <button key={target.id} type="button" onClick={() => onSelect(target.id)} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
            <div className={cn("h-4 w-4 rounded-full ring-4 ring-white transition-all group-hover:scale-125", colorClass, selectedId === target.id ? "scale-125 shadow-lg" : "shadow-sm")} />
            <span className={cn("absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm transition-opacity", selectedId === target.id ? "opacity-100" : "opacity-85")}>
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
  const axes: Array<keyof Pick<OfferProfile, "salary" | "wlb" | "growth" | "location" | "culture">> = ["salary", "wlb", "growth", "location", "culture"];
  const labels = ["?곕큺/蹂댁긽", "?뚮씪諛?", "?깆옣??", "?꾩튂/異쒗눜洹?", "議곗쭅臾명솕"];
  const center = 150;
  const radius = 100;
  const angleStep = (Math.PI * 2) / axes.length;

  const getPoints = (profile: OfferProfile) =>
    axes
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
          points={axes
            .map((_, index) => `${center + radius * level * Math.cos(index * angleStep - Math.PI / 2)},${center + radius * level * Math.sin(index * angleStep - Math.PI / 2)}`)
            .join(" ")}
          fill="none"
          stroke="#dbe4ef"
          strokeWidth="1"
        />
      ))}
      {axes.map((_, index) => (
        <line key={`line-${labels[index]}`} x1={center} y1={center} x2={center + radius * Math.cos(index * angleStep - Math.PI / 2)} y2={center + radius * Math.sin(index * angleStep - Math.PI / 2)} stroke="#dbe4ef" strokeWidth="1" />
      ))}
      {labels.map((label, index) => {
        const x = center + (radius + 26) * Math.cos(index * angleStep - Math.PI / 2);
        const y = center + (radius + 18) * Math.sin(index * angleStep - Math.PI / 2);
        return (
          <text key={label} x={x} y={y} fontSize="10" fontWeight="700" fill="#64748b" textAnchor="middle" dominantBaseline="middle">
            {label}
          </text>
        );
      })}
      <polygon points={getPoints(data1)} fill={color1} fillOpacity="0.28" stroke={color1} strokeWidth="2.5" />
      <polygon points={getPoints(data2)} fill={color2} fillOpacity="0.28" stroke={color2} strokeWidth="2.5" />
    </svg>
  );
}

export function ContributionHeatmap({ values }: { values: number[][] }) {
  const colors = ["bg-slate-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-500", "bg-emerald-700"];

  return (
    <ScrollArea axis="x" className="pb-2">
      <div className="flex gap-1">
        {values.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
            {week.map((value, dayIndex) => (
              <div key={`cell-${weekIndex}-${dayIndex}`} className={cn("h-3 w-3 rounded-sm", colors[value])} />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
