import { MapPin } from "lucide-react";
import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";
import { getCompanyTypeTone } from "../viewUtils";

type CompanyPostingFilterSectionProps = {
  companies: DashboardController["companies"];
};

function getCompanyTypeLabel(type: string) {
  if (type === "집중 지원") {
    return "집중공략";
  }
  if (type === "스트레치") {
    return "상향지원";
  }
  if (type === "안정 카드") {
    return "안정지원";
  }
  if (type === "균형 카드") {
    return "균형지원";
  }
  return type;
}

export function CompanyPostingFilterSection({
  companies,
}: CompanyPostingFilterSectionProps) {
  return (
    <SurfaceCard className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h3 className="font-bold text-slate-900">분석 대상 기업 리스트</h3>
      </div>
      <ScrollArea className="h-[980px] px-3 py-3">
        <div className="space-y-3">
          {companies.companyTargets.map((company) => (
            <button
              key={company.id}
              type="button"
              onClick={() => companies.updateSelectedCompanyId(company.id)}
              className={cn(
                "w-full rounded-[22px] border p-4 text-left transition-all duration-200",
                companies.selectedCompany.id === company.id
                  ? "border-cyan-300 bg-cyan-50/35 shadow-[0_10px_24px_rgba(34,211,238,0.12)]"
                  : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50/80",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="text-[16px] font-black text-slate-900">{company.name}</h4>
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{company.location}</span>
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold",
                    getCompanyTypeTone(company.type),
                  )}
                >
                  {getCompanyTypeLabel(company.type)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-[13px] font-semibold">
                <span className="text-slate-500">{company.status}</span>
                <span className="text-slate-700">선호도 {company.preference}%</span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </SurfaceCard>
  );
}
