import { cn } from "../../../../lib/cn";
import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type CompanyPostingFilterSectionProps = {
  companies: DashboardController["companies"];
};

export function CompanyPostingFilterSection({
  companies,
}: CompanyPostingFilterSectionProps) {
  return (
    <SurfaceCard className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h3 className="font-bold text-slate-900">공고 목록</h3>
      </div>
      <div className="space-y-3 p-4">
        <input
          value={companies.postingQuery}
          onChange={(event) => companies.setPostingQuery(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          placeholder="기업명, 직무, 키워드 검색"
        />
        <select
          value={companies.postingCompanyFilter}
          onChange={(event) => companies.setPostingCompanyFilter(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
        >
          <option value="all">전체 기업</option>
          {companies.companyTargets.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2 p-3">
        {companies.filteredPostings.map((posting) => (
          <button
            key={posting.id}
            type="button"
            onClick={() => companies.updateSelectedCompanyId(posting.targetCompanyId)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition",
              companies.selectedCompany.id === posting.targetCompanyId
                ? "border-cyan-300 bg-cyan-50/50 shadow-sm"
                : "border-transparent hover:bg-slate-50",
            )}
          >
            <div>
              <p className="font-semibold text-slate-800">{posting.company}</p>
              <p className="mt-1 text-sm text-slate-500">{posting.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">D-{posting.daysLeft}</p>
              <p className="mt-1 text-xs text-slate-400">우선순위 {posting.priority}</p>
            </div>
          </button>
        ))}
      </div>
    </SurfaceCard>
  );
}
