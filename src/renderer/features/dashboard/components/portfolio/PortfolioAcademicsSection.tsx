import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PortfolioAcademicsSectionProps = {
  portfolio: DashboardController["portfolio"];
};

export function PortfolioAcademicsSection({
  portfolio,
}: PortfolioAcademicsSectionProps) {
  return (
    <SurfaceCard className="p-5">
      <h3 className="font-semibold text-slate-900">수업 / 성적</h3>
      <div className="mt-4 space-y-3">
        {portfolio.data.coursework.map((course) => (
          <div key={course.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{course.name}</p>
                <p className="mt-1 text-sm text-slate-500">학점 {course.grade}</p>
              </div>
              <Pill className="border-slate-200 bg-slate-100 text-slate-700">연관도 {course.relevance}</Pill>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Pill key={tag} className="border-slate-200 bg-slate-100 text-slate-700">
                  {tag}
                </Pill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
