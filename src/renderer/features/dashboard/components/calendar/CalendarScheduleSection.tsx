import {
  Clock3,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { GlassSelect } from "../../../../components/ui/GlassSelect";
import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
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

export function CalendarScheduleSection({
  calendar,
}: CalendarScheduleSectionProps) {
  const selectedScheduleEvent = calendar.selectedScheduleEvent;

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
                  calendar.updateScheduleEvent(selectedScheduleEvent.id, {
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
                  calendar.updateScheduleEvent(selectedScheduleEvent.id, {
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
                  calendar.updateScheduleEvent(selectedScheduleEvent.id, {
                    type: value as typeof selectedScheduleEvent.type,
                  })
                }
                options={calendar.eventTypeOptions}
                tone="amber"
                size="sm"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">일자</span>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={selectedScheduleEvent.date}
                  onChange={(event) =>
                    calendar.updateScheduleEvent(selectedScheduleEvent.id, {
                      date: Number(event.target.value || 1),
                    })
                  }
                  className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-slate-700">시간</span>
                <input
                  type="time"
                  value={selectedScheduleEvent.time}
                  onChange={(event) =>
                    calendar.updateScheduleEvent(selectedScheduleEvent.id, {
                      time: event.target.value,
                    })
                  }
                  className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                />
              </label>
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
