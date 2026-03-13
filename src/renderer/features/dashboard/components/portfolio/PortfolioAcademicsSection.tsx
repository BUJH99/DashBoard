import { useEffect, useState } from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type PortfolioAcademicsSectionProps = {
  portfolio: DashboardController["portfolio"];
};

function getCourseAccent(relevance: number) {
  if (relevance >= 85) {
    return "bg-emerald-500";
  }
  return "bg-blue-500";
}

function formatSemesterLabel(value: string) {
  if (!value.trim()) {
    return "학기 미지정";
  }

  const [year, term] = value.split("-");
  if (!year || !term) {
    return value;
  }

  return `${year}년 ${term}학기`;
}

export function PortfolioAcademicsSection({
  portfolio,
}: PortfolioAcademicsSectionProps) {
  const groupedCoursework = portfolio.data.coursework.reduce<Record<string, typeof portfolio.data.coursework>>(
    (groups, course) => {
      const key = course.semester.trim() || "미분류";
      groups[key] = [...(groups[key] ?? []), course];
      return groups;
    },
    {},
  );
  const orderedSemesters = Object.keys(groupedCoursework).sort((left, right) =>
    right.localeCompare(left, "ko"),
  );
  const [expandedSemester, setExpandedSemester] = useState<string | null>(orderedSemesters[0] ?? null);

  useEffect(() => {
    if (orderedSemesters.length === 0) {
      if (expandedSemester !== null) {
        setExpandedSemester(null);
      }
      return;
    }

    if (!expandedSemester || !orderedSemesters.includes(expandedSemester)) {
      setExpandedSemester(orderedSemesters[0]);
    }
  }, [expandedSemester, orderedSemesters]);

  const activeSemester = expandedSemester && groupedCoursework[expandedSemester]
    ? expandedSemester
    : orderedSemesters[0] ?? null;

  const handleAddCoursework = (semester?: string) => {
    const nextId =
      portfolio.data.coursework.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

    portfolio.addCollectionItem("coursework");

    if (semester) {
      portfolio.updateCollectionItem("coursework", nextId, "semester", semester);
      setExpandedSemester(semester);
      return;
    }

    setExpandedSemester(activeSemester ?? semester ?? null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-slate-500">
          학기별로 과목을 추가하고, 직무 관련성 태그까지 함께 편집할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={() => handleAddCoursework()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          과목 추가
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {orderedSemesters.map((semester) => {
          const courses = groupedCoursework[semester];
          const averageRelevance = Math.round(
            courses.reduce((sum, course) => sum + course.relevance, 0) / Math.max(courses.length, 1),
          );

          return (
            <button
              key={semester}
              type="button"
              onClick={() => setExpandedSemester(semester)}
              className={cn(
                "rounded-[24px] border p-5 text-left transition",
                activeSemester === semester
                  ? "border-emerald-200 bg-emerald-50/70 shadow-[0_14px_30px_rgba(16,185,129,0.10)]"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[16px] font-black text-slate-900">{formatSemesterLabel(semester)}</p>
                  <p className="mt-1 text-xs text-slate-500">{courses.length}과목</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  평균 관련성 {averageRelevance}
                  <ChevronRight className={cn("h-3.5 w-3.5 transition", activeSemester === semester && "rotate-90")} />
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {courses.slice(0, 3).map((course) => (
                  <span
                    key={`${semester}-${course.id}`}
                    className="rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-slate-600"
                  >
                    {course.name || `과목 ${course.id}`}
                  </span>
                ))}
                {courses.length > 3 ? (
                  <span className="rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-slate-500">
                    +{courses.length - 3}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {activeSemester ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
            <div>
              <h3 className="text-[18px] font-black text-slate-900">{formatSemesterLabel(activeSemester)} 상세 미리보기</h3>
              <p className="mt-1 text-sm text-slate-500">
                과목명, 성적, 직무 관련성을 한 학기 단위로 읽기 쉽게 확인하고 바로 편집할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddCoursework(activeSemester)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              이 학기에 과목 추가
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {groupedCoursework[activeSemester].map((course) => (
              <article
                key={course.id}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-black text-slate-900">
                      {course.name || `과목 ${course.id}`}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {course.grade || "성적 미입력"}
                      </span>
                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                        관련성 {course.relevance}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => portfolio.removeCollectionItem("coursework", course.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:text-rose-500"
                    aria-label={`${course.name || `과목 ${course.id}`} 삭제`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                      <span className="font-semibold text-slate-700">학기</span>
                      <input
                        value={course.semester}
                        onChange={(event) =>
                          portfolio.updateCollectionItem("coursework", course.id, "semester", event.target.value)
                        }
                        placeholder="예: 2024-1"
                        className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      <span className="font-semibold text-slate-700">성적</span>
                      <input
                        value={course.grade}
                        onChange={(event) =>
                          portfolio.updateCollectionItem("coursework", course.id, "grade", event.target.value)
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                      />
                    </label>
                  </div>

                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold text-slate-700">과목명</span>
                    <input
                      value={course.name}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("coursework", course.id, "name", event.target.value)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                    />
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold text-slate-700">직무 관련성</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={course.relevance}
                      onChange={(event) =>
                        portfolio.updateCollectionItem(
                          "coursework",
                          course.id,
                          "relevance",
                          Number(event.target.value || 0),
                        )
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                    />
                  </label>

                  <p className="text-[13px] text-slate-400">직무 관련성</p>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={cn("h-2 rounded-full", getCourseAccent(course.relevance))}
                      style={{ width: `${Math.max(0, Math.min(100, course.relevance))}%` }}
                    />
                  </div>

                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold text-slate-700">키워드 태그</span>
                    <input
                      value={course.tags.join(", ")}
                      onChange={(event) =>
                        portfolio.updateCollectionItem("coursework", course.id, "tags", event.target.value)
                      }
                      placeholder="쉼표로 구분해 입력"
                      className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span
                        key={`${course.id}-${tag}`}
                        className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
