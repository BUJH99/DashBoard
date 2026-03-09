import type { ScheduleEvent } from "../../types";

export const DASHBOARD_REFERENCE_DATE = new Date("2026-03-09T09:00:00+09:00");

export const CALENDAR_YEAR = 2026;

export const CALENDAR_MONTH_INDEX = 2;

export const schedule: ScheduleEvent[] = [
  { id: 1, date: 10, title: "LX세미콘 면접 사전 점검", type: "interview", time: "19:30", company: "LX세미콘" },
  { id: 2, date: 11, title: "LX세미콘 1차 면접", type: "interview", time: "10:00", company: "LX세미콘" },
  { id: 3, date: 12, title: "리벨리온 과제 제출", type: "task", time: "20:00", company: "리벨리온" },
  { id: 4, date: 14, title: "삼성전자 DS 자기소개서 마감", type: "deadline", time: "18:00", company: "삼성전자 DS" },
  { id: 5, date: 15, title: "텔레칩스 면접 리허설", type: "interview", time: "14:00", company: "텔레칩스" },
  { id: 6, date: 16, title: "파두 통근 메모 보완", type: "task", time: "09:00", company: "파두" },
  { id: 7, date: 18, title: "SK하이닉스 인적성", type: "test", time: "13:00", company: "SK하이닉스" },
];
