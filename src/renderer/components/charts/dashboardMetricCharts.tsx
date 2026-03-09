import type { KpiMetric } from "../../features/dashboard/types";
import { cn } from "../../lib/cn";
import { Pill, SurfaceCard } from "../ui/primitives";
import { Sparkline } from "./chartPrimitives";

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
        <Pill
          className={cn(
            metric.trend.startsWith("+")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-100 text-slate-600",
          )}
        >
          {metric.trend}
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
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${progress}%`, backgroundColor: colorHex }}
        />
      </div>
      <div className="w-24 shrink-0 text-right text-xs text-slate-400">{expectedDate}</div>
    </div>
  );
}

export function SemiCircleGauge({
  value,
  target,
  label,
  colorHex,
}: {
  value: number;
  target: number;
  label: string;
  colorHex: string;
}) {
  const radius = 40;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const targetAngle = (target / 100) * 180;
  const targetX = 50 - 45 * Math.cos(targetAngle * (Math.PI / 180));
  const targetY = 50 - 45 * Math.sin(targetAngle * (Math.PI / 180));

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 55" className="h-auto w-32 overflow-visible">
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke={colorHex}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
        <line x1="50" y1="50" x2={targetX} y2={targetY} stroke="#334155" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
      <div className="mt-1 text-center">
        <p className="text-lg font-bold text-slate-800">{value}%</p>
        <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
        <p className="text-[10px] text-slate-400">목표: {target}%</p>
      </div>
    </div>
  );
}
