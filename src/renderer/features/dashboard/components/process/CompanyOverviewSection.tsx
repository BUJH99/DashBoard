import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type CompanyOverviewSectionProps = {
  companies: DashboardController["companies"];
};

export function CompanyOverviewSection({
  companies,
}: CompanyOverviewSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {companies.selectedCompany.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{companies.selectedCompany.location}</p>
        </div>
        <Pill className="border-slate-200 bg-slate-100 text-slate-700">
          {companies.selectedCompany.status}
        </Pill>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.58fr_0.42fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="font-semibold text-slate-900">기업 설명</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {companies.selectedCompanyDetail.description}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {companies.selectedCompanyDetail.roleDescription}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900">핵심 기술 스택</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {companies.selectedCompanyDetail.techStack.map((tech) => (
              <Pill key={tech} className="border-slate-200 bg-slate-100 text-slate-700">
                {tech}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
