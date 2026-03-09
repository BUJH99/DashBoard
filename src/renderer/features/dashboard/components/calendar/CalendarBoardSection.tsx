import FullCalendar from "@fullcalendar/react";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { fullCalendarButtonText, fullCalendarLocale, fullCalendarPlugins } from "../../../calendar/fullCalendarOptions";
import type { DashboardController } from "../../useDashboardController";

type CalendarBoardSectionProps = {
  calendar: DashboardController["calendar"];
};

export function CalendarBoardSection({
  calendar,
}: CalendarBoardSectionProps) {
  return (
    <SurfaceCard className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[22px] font-black tracking-tight text-slate-900">일정 캘린더</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              면접, 과제, 마감 일정을 월간 기준으로 관리합니다.
            </p>
          </div>
          <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">FullCalendar</Pill>
        </div>
      </div>
      <div className="career-calendar p-4">
        <FullCalendar
          plugins={fullCalendarPlugins}
          locale={fullCalendarLocale}
          initialView="dayGridMonth"
          initialDate="2026-03-01"
          height={720}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listMonth",
          }}
          buttonText={fullCalendarButtonText}
          dayMaxEventRows={3}
          nowIndicator
          selectable
          events={calendar.calendarEvents}
          eventClick={(info) => {
            calendar.setSelectedScheduleId(Number(info.event.id));
          }}
          dateClick={(info) => {
            const sameDayEvent = calendar.upcomingSchedule.find((event) => event.date === info.date.getDate());
            if (sameDayEvent) {
              calendar.setSelectedScheduleId(sameDayEvent.id);
              return;
            }

            calendar.createScheduleEvent(info.date.getDate());
          }}
        />
      </div>
    </SurfaceCard>
  );
}
