import type { ScheduleEvent } from "../../types";
import { DEFAULT_DASHBOARD_SCHEDULE_ENTRIES } from "../../../../../../shared/dashboard-editable-data";

export const DASHBOARD_REFERENCE_DATE = new Date("2026-03-09T09:00:00+09:00");

export const CALENDAR_YEAR = 2026;

export const CALENDAR_MONTH_INDEX = 2;

export const schedule: ScheduleEvent[] = DEFAULT_DASHBOARD_SCHEDULE_ENTRIES.map((entry) => ({
  ...entry,
}));
