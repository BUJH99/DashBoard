import { Pill } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { CompanyComparisonRow } from "../../types";

type ComparisonDetailTableCardProps = {
  title: string;
  description: string;
  badgeLabel?: string;
  leftLabel: string;
  rightLabel: string;
  leftClassName?: string;
  rightClassName?: string;
  rows: CompanyComparisonRow[];
  headerAction?: React.ReactNode;
  className?: string;
};

export function ComparisonDetailTableCard({
  title,
  description,
  badgeLabel = "A vs B",
  leftLabel,
  rightLabel,
  leftClassName,
  rightClassName,
  rows,
  headerAction,
  className,
}: ComparisonDetailTableCardProps) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-slate-200 bg-white/78 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {headerAction}
          <Pill className="border-slate-200 bg-slate-100 text-slate-700">{badgeLabel}</Pill>
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.15fr_1fr_1fr] border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-500">
          <span>항목</span>
          <span className={cn("text-right", leftClassName)}>{leftLabel}</span>
          <span className={cn("text-right", rightClassName)}>{rightLabel}</span>
        </div>

        {rows.map((row) => {
          const isLeftStronger =
            typeof row.leftScore === "number" &&
            typeof row.rightScore === "number" &&
            row.leftScore > row.rightScore;
          const isRightStronger =
            typeof row.leftScore === "number" &&
            typeof row.rightScore === "number" &&
            row.rightScore > row.leftScore;

          return (
            <div
              key={row.label}
              className="grid grid-cols-[1.15fr_1fr_1fr] items-center border-b border-slate-200/80 px-6 py-4 last:border-b-0"
            >
              <span className="text-sm font-semibold text-slate-600">{row.label}</span>
              <span
                className={cn(
                  "text-right text-[17px] font-black tracking-tight text-slate-800",
                  isLeftStronger && leftClassName,
                )}
              >
                {row.left}
              </span>
              <span
                className={cn(
                  "text-right text-[17px] font-black tracking-tight text-slate-800",
                  isRightStronger && rightClassName,
                )}
              >
                {row.right}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
