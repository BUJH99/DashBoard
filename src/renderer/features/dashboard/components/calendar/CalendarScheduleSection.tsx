import { Clock3 } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { getEventTone } from "../viewUtils";

type CalendarScheduleSectionProps = {
  calendar: DashboardController["calendar"];
};

export function CalendarScheduleSection({
  calendar,
}: CalendarScheduleSectionProps) {
  return (
    <div className="grid gap-6">
      <SurfaceCard className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-bold text-slate-900">선택 일정</h3>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <Pill className={cn("border", getEventTone(calendar.selectedScheduleEvent.type))}>
              {calendar.selectedScheduleEvent.type}
            </Pill>
            <span className="text-xs font-semibold text-slate-500">
              3월 {calendar.selectedScheduleEvent.date}일 / {calendar.selectedScheduleEvent.time}
            </span>
          </div>
          <h4 className="mt-4 text-xl font-bold text-slate-900">{calendar.selectedScheduleEvent.title}</h4>
          <p className="mt-2 text-sm text-slate-500">{calendar.selectedScheduleEvent.company}</p>
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-900">다가오는 일정</h3>
        <div className="space-y-4">
          {calendar.upcomingSchedule.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => calendar.setSelectedScheduleId(event.id)}
              className="relative w-full border-l-2 border-slate-200 pl-4 text-left"
            >
              <span
                className={cn(
                  "absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ring-4 ring-white",
                  calendar.selectedScheduleEvent.id === event.id ? "bg-cyan-500" : "bg-blue-500",
                )}
              />
              <div className="mb-1 text-xs font-bold text-slate-500">
                3월 {event.date}일 ({event.time})
              </div>
              <div className="font-semibold text-slate-800">{event.title}</div>
              <div className="mt-1 text-sm text-slate-500">{event.company}</div>
            </button>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
