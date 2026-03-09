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

export function PortfolioAcademicsSection({
  portfolio,
}: PortfolioAcademicsSectionProps) {
  return (
    <div>
      <p className="mb-6 text-[14px] text-slate-500">
        직무 관련성이 높은 전공 과목과 키워드를 함께 정리했습니다.
      </p>
      <div className="grid gap-4 xl:grid-cols-2">
        {portfolio.data.coursework.map((course) => (
          <article
            key={course.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(148,163,184,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[16px] font-black text-slate-900">{course.name}</h3>
              <div className="text-right">
                <p className="text-[18px] font-black text-slate-700">{course.grade}</p>
                <p className="mt-2 text-[12px] font-bold text-slate-700">{course.relevance}%</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] text-slate-400">직무 관련성</p>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div
                className={cn("h-2 rounded-full", getCourseAccent(course.relevance))}
                style={{ width: `${Math.max(0, Math.min(100, course.relevance))}%` }}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
