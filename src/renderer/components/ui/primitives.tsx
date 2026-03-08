import React from "react";
import { cn } from "../../lib/cn";

export function SurfaceCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-[24px] border border-slate-200 bg-white shadow-sm", className)}>{children}</section>;
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", className)}>{children}</span>;
}

export function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} />
    </div>
  );
}
