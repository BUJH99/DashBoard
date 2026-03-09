import type { DashboardLocalState } from "../../types";
import type { DashboardActionContext } from "../dashboardActionContext";

type ScheduleEntry = DashboardLocalState["calendar"]["scheduleEntries"][number];

function getNextScheduleId(entries: ScheduleEntry[]) {
  return entries.reduce((maxId, entry) => Math.max(maxId, entry.id), 0) + 1;
}

export function createDashboardCalendarActions({
  setDashboardState,
  companyTargets,
}: DashboardActionContext) {
  const updateScheduleEvent = (
    eventId: number,
    patch: Partial<ScheduleEntry>,
  ) => {
    setDashboardState((current) => ({
      ...current,
      calendar: {
        ...current.calendar,
        scheduleEntries: current.calendar.scheduleEntries.map((event) =>
          event.id === eventId
            ? {
                ...event,
                ...patch,
              }
            : event,
        ),
      },
    }));
  };

  const createScheduleEvent = (date?: number) => {
    setDashboardState((current) => {
      const nextId = getNextScheduleId(current.calendar.scheduleEntries);
      const selectedCompany =
        companyTargets.find((company) => company.id === current.ui.selectedCompanyId) ??
        companyTargets[0];
      const selectedScheduleEvent =
        current.calendar.scheduleEntries.find(
          (event) => event.id === current.ui.selectedScheduleId,
        ) ?? current.calendar.scheduleEntries[0];
      const nextEvent: ScheduleEntry = {
        id: nextId,
        date: date ?? selectedScheduleEvent?.date ?? 10,
        title: `${selectedCompany?.name ?? "지원"} 새 일정`,
        type: "task",
        time: "09:00",
        company: selectedCompany?.name ?? selectedScheduleEvent?.company ?? "지원 준비",
      };

      return {
        ...current,
        ui: {
          ...current.ui,
          selectedScheduleId: nextEvent.id,
        },
        calendar: {
          ...current.calendar,
          scheduleEntries: [...current.calendar.scheduleEntries, nextEvent],
        },
      };
    });
  };

  const deleteScheduleEvent = (eventId: number) => {
    setDashboardState((current) => {
      if (current.calendar.scheduleEntries.length <= 1) {
        return current;
      }

      const currentIndex = current.calendar.scheduleEntries.findIndex(
        (event) => event.id === eventId,
      );
      const nextEntries = current.calendar.scheduleEntries.filter(
        (event) => event.id !== eventId,
      );
      const fallbackEvent =
        nextEntries[Math.min(Math.max(currentIndex, 0), nextEntries.length - 1)] ??
        nextEntries[0];

      return {
        ...current,
        ui: {
          ...current.ui,
          selectedScheduleId:
            current.ui.selectedScheduleId === eventId
              ? fallbackEvent.id
              : current.ui.selectedScheduleId,
        },
        calendar: {
          ...current.calendar,
          scheduleEntries: nextEntries,
        },
      };
    });
  };

  return {
    updateScheduleEvent,
    createScheduleEvent,
    deleteScheduleEvent,
  };
}
