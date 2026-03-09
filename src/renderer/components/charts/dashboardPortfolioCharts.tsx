import { cn } from "../../lib/cn";
import { ScrollArea } from "../ui/ScrollArea";

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
