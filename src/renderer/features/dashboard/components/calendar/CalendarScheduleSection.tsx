import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { GlassSelect } from "../../../../components/ui/GlassSelect";
import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import {
  CALENDAR_MONTH_INDEX,
  CALENDAR_YEAR,
  DASHBOARD_REFERENCE_DATE,
} from "../../domain/seeds/calendarSeed";
import { getEventTone } from "../viewUtils";

type CalendarScheduleSectionProps = {
  calendar: DashboardController["calendar"];
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  task: "과제/준비",
  interview: "면접",
  deadline: "마감",
  test: "필기/인적성",
};

const DAYS_IN_MONTH = new Date(CALENDAR_YEAR, CALENDAR_MONTH_INDEX + 1, 0).getDate();

const QUICK_TIME_OPTIONS = [
  { label: "09:00", value: "09:00" },
  { label: "10:00", value: "10:00" },
  { label: "14:00", value: "14:00" },
  { label: "18:00", value: "18:00" },
  { label: "20:00", value: "20:00" },
] as const;

const QUICK_DATE_OPTIONS = [
  { label: "오늘", value: DASHBOARD_REFERENCE_DATE.getDate() },
  { label: "내일", value: DASHBOARD_REFERENCE_DATE.getDate() + 1 },
  { label: "+3일", value: DASHBOARD_REFERENCE_DATE.getDate() + 3 },
  { label: "+7일", value: DASHBOARD_REFERENCE_DATE.getDate() + 7 },
].map((option) => ({
  ...option,
  value: Math.min(Math.max(option.value, 1), DAYS_IN_MONTH),
}));

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function buildFullDateValue(day: number) {
  return `${CALENDAR_YEAR}-${String(CALENDAR_MONTH_INDEX + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDateDisplay(day: number) {
  const date = new Date(CALENDAR_YEAR, CALENDAR_MONTH_INDEX, day);
  return `${CALENDAR_MONTH_INDEX + 1}월 ${day}일 (${WEEKDAY_LABELS[date.getDay()]})`;
}

function formatTimeDisplay(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(CALENDAR_YEAR, CALENDAR_MONTH_INDEX, DASHBOARD_REFERENCE_DATE.getDate(), hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function QuickChipButton({
  active,
  label,
  onClick,
  tone = "slate",
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  tone?: "slate" | "cyan";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? tone === "cyan"
            ? "border-cyan-300 bg-cyan-50 text-cyan-700"
            : "border-slate-300 bg-slate-100 text-slate-700"
          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      {label}
    </button>
  );
}

export function CalendarScheduleSection({
  calendar,
}: CalendarScheduleSectionProps) {
  const selectedScheduleEvent = calendar.selectedScheduleEvent;
  const [activeIntegratedField, setActiveIntegratedField] = useState<"date" | "time" | null>(null);
  const updateSelectedSchedule = (
    patch: Partial<typeof selectedScheduleEvent>,
  ) => {
    calendar.updateScheduleEvent(selectedScheduleEvent.id, patch);
  };

  const setSelectedDate = (date: number) => {
    updateSelectedSchedule({
      date: Math.min(Math.max(date, 1), DAYS_IN_MONTH),
    });
  };

  const setSelectedTime = (time: string) => {
    updateSelectedSchedule({
      time,
    });
  };
  const fullDateValue = buildFullDateValue(selectedScheduleEvent.date);
  const dateDisplayValue = formatDateDisplay(selectedScheduleEvent.date);
  const timeDisplayValue = formatTimeDisplay(selectedScheduleEvent.time);

  return (
    <div className="grid gap-6">
      <SurfaceCard className="p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-900">선택 일정 편집</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => calendar.createScheduleEvent()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              새 일정
            </button>
            <button
              type="button"
              onClick={() => calendar.deleteScheduleEvent(selectedScheduleEvent.id)}
              disabled={!calendar.canDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </button>
            <button
              type="button"
              onClick={() => void calendar.saveChanges()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Save className="h-4 w-4" />
              일정 저장
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Pill className={cn("border", getEventTone(selectedScheduleEvent.type))}>
              {EVENT_TYPE_LABELS[selectedScheduleEvent.type] ?? selectedScheduleEvent.type}
            </Pill>
            <span className="text-xs font-semibold text-slate-500">
              3월 {selectedScheduleEvent.date}일 / {selectedScheduleEvent.time}
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-slate-700">일정 제목</span>
              <input
                value={selectedScheduleEvent.title}
                onChange={(event) =>
                  updateSelectedSchedule({
                    title: event.target.value,
                  })
                }
                className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-slate-700">기업</span>
              <GlassSelect
                ariaLabel="캘린더 일정 기업 선택"
                value={selectedScheduleEvent.company}
                onChange={(value) =>
                  updateSelectedSchedule({
                    company: value,
                  })
                }
                options={calendar.companyOptions}
                tone="blue"
                size="sm"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-slate-700">일정 유형</span>
              <GlassSelect
                ariaLabel="캘린더 일정 유형 선택"
                value={selectedScheduleEvent.type}
                onChange={(value) =>
                  updateSelectedSchedule({
                    type: value as typeof selectedScheduleEvent.type,
                  })
                }
                options={calendar.eventTypeOptions}
                tone="amber"
                size="sm"
              />
            </label>
            <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.92))] p-4 shadow-[0_12px_30px_rgba(148,163,184,0.08)] md:col-span-2">
              <p className="mb-3 text-sm font-semibold text-slate-700">일자 / 시간</p>
              <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(148,163,184,0.08)]">
                <div className="grid divide-y divide-slate-200 sm:grid-cols-[1.08fr_0.92fr] sm:divide-x sm:divide-y-0">
                  <div className={cn("px-5 py-4 transition-colors", activeIntegratedField === "date" && "bg-cyan-50/40")}>
                    {activeIntegratedField === "date" ? (
                      <input
                        type="date"
                        value={fullDateValue}
                        autoFocus
                        onBlur={() => setActiveIntegratedField(null)}
                        onChange={(event) => {
                          const nextDay = Number(event.target.value.split("-")[2] ?? selectedScheduleEvent.date);
                          setSelectedDate(nextDay);
                        }}
                        className="w-full border-0 bg-transparent p-0 text-left text-[18px] font-semibold tracking-[-0.02em] text-slate-900 outline-none md:text-[20px] [color-scheme:light]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveIntegratedField("date")}
                        className="w-full text-left text-[18px] font-semibold tracking-[-0.02em] text-slate-900 md:text-[20px]"
                      >
                        {dateDisplayValue}
                      </button>
                    )}
                  </div>
                  <div className={cn("px-5 py-4 transition-colors", activeIntegratedField === "time" && "bg-amber-50/40")}>
                    {activeIntegratedField === "time" ? (
                      <input
                        type="time"
                        value={selectedScheduleEvent.time}
                        autoFocus
                        onBlur={() => setActiveIntegratedField(null)}
                        onChange={(event) => setSelectedTime(event.target.value)}
                        className="w-full border-0 bg-transparent p-0 text-left text-[18px] font-semibold tracking-[-0.02em] text-slate-900 outline-none md:text-[20px] [color-scheme:light]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveIntegratedField("time")}
                        className="w-full text-left text-[18px] font-semibold tracking-[-0.02em] text-slate-900 md:text-[20px]"
                      >
                        {timeDisplayValue}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Date
                  </span>
                  {QUICK_DATE_OPTIONS.map((option) => (
                    <QuickChipButton
                      key={`${option.label}-${option.value}`}
                      active={selectedScheduleEvent.date === option.value}
                      label={`${option.label} ${option.value}일`}
                      onClick={() => setSelectedDate(option.value)}
                      tone="cyan"
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    Time
                  </span>
                  {QUICK_TIME_OPTIONS.map((option) => (
                    <QuickChipButton
                      key={option.value}
                      active={selectedScheduleEvent.time === option.value}
                      label={option.label}
                      onClick={() => setSelectedTime(option.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {calendar.saveMessage ? (
            <p className="mt-4 text-xs font-medium text-slate-500">{calendar.saveMessage}</p>
          ) : null}
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
