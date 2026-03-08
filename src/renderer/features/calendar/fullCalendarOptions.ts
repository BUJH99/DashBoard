import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";

export const fullCalendarPlugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];
export const fullCalendarLocale = koLocale;
export const fullCalendarButtonText = {
  today: "?ㅻ뒛",
  month: "?붽컙",
  week: "二쇨컙",
  list: "由ъ뒪??",
};
