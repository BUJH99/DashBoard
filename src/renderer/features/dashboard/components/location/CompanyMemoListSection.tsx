import { MapPin } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { buildEmptyCommuteNote, formatCommuteNoteSummary, hasCommuteNoteContent, normalizeCommuteNote } from "../../../location/commuteNotes";
import { getCompanyTypeTone } from "../viewUtils";

type CompanyMemoListSectionProps = {
  companies: DashboardController["companies"];
  companyCommuteNotes: DashboardController["dashboardState"]["location"]["companyCommuteNotes"];
};

export function CompanyMemoListSection({
  companies,
  companyCommuteNotes,
}: CompanyMemoListSectionProps) {
  return (
    <SurfaceCard className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h3 className="font-bold text-slate-900">기업별 메모 현황</h3>
      </div>
      <div className="space-y-2 p-4">
        {companies.companyTargets.map((company) => {
          const companyNote = normalizeCommuteNote(
            companyCommuteNotes[company.id] ?? buildEmptyCommuteNote(),
          );

          return (
            <button
              key={company.id}
              type="button"
              onClick={() => companies.updateSelectedCompanyId(company.id)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition",
                companies.selectedCompany.id === company.id
                  ? "border-cyan-300 bg-cyan-50/50 shadow-sm"
                  : "border-transparent hover:bg-slate-50",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800">{company.name}</span>
                  {hasCommuteNoteContent(companyNote) ? (
                    <p className="mt-1 text-[11px] font-medium text-cyan-700">
                      {formatCommuteNoteSummary(companyNote)}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-400">아직 통근 메모가 없습니다.</p>
                  )}
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                    getCompanyTypeTone(company.type),
                  )}
                >
                  {company.type}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {company.location}
              </p>
            </button>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
