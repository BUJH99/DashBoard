import type { ScheduleEvent } from "../dashboard/types";

export function mapScheduleToCalendarEvents(
  schedule: ScheduleEvent[],
  year: number,
  monthIndex: number,
) {
  return schedule.map((event) => {
    const start = new Date(year, monthIndex, event.date);
    const [hours, minutes] = event.time.split(":").map(Number);
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start);
    end.setHours(
      start.getHours() + (event.type === "interview" ? 1 : 0),
      start.getMinutes() + (event.type === "deadline" ? 30 : 0),
    );

    const palette =
      event.type === "interview"
        ? { bg: "#7c3aed", border: "#7c3aed" }
        : event.type === "deadline"
          ? { bg: "#e11d48", border: "#e11d48" }
          : event.type === "test"
            ? { bg: "#0284c7", border: "#0284c7" }
            : { bg: "#f59e0b", border: "#f59e0b" };

    return {
      id: String(event.id),
      title: event.title,
      start,
      end,
      extendedProps: {
        originalEvent: event,
        company: event.company,
      },
      backgroundColor: palette.bg,
      borderColor: palette.border,
    };
  });
}
