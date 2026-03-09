export type ScheduleEvent = {
  id: number;
  date: number;
  title: string;
  type: "task" | "interview" | "deadline" | "test";
  time: string;
  company: string;
};
