import { MapPin } from "lucide-react";
import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";
import { getCompanyTypeTone, kanbanColumns } from "../viewUtils";

type KanbanBoardSectionProps = {
  companies: DashboardController["companies"];
};

export function KanbanBoardSection({
  companies,
}: KanbanBoardSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">지원 상태 칸반</h2>
          <p className="mt-1 text-sm text-slate-500">
            기업별 진행 상태를 단계별 보드로 확인하고, 카드 클릭으로 선택 기업을 바꿀 수 있습니다.
          </p>
        </div>
        <Pill className="border-slate-200 bg-slate-100 text-slate-700">실시간 분류</Pill>
      </div>
      <ScrollArea axis="x" className="pb-2">
        <div className="flex gap-4">
          {kanbanColumns.map((column) => {
            const items = companies.companyTargets.filter((company) => company.stage === column.id);
            return (
              <div
                key={column.id}
                className={cn(
                  "w-72 shrink-0 rounded-3xl border-t-4 border-x border-b border-slate-200 shadow-sm",
                  column.accent,
                  column.bg,
                )}
              >
                <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-700">{column.title}</h3>
                  <Pill className="border-slate-200 bg-white text-slate-600">{items.length}</Pill>
                </div>
                <div className="space-y-3 p-3">
                  {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm text-slate-400">
                      현재 이 단계에 있는 기업이 없습니다.
                    </div>
                  ) : null}
                  {items.map((company) => (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => companies.updateSelectedCompanyId(company.id)}
                      className={cn(
                        "w-full rounded-2xl border bg-white p-4 text-left transition hover:shadow-md",
                        companies.selectedCompany.id === company.id
                          ? "border-cyan-300 shadow-md"
                          : "border-slate-200",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{company.name}</p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {company.location}
                          </p>
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
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                        <span>선호도 {company.preference}%</span>
                        <span>적합도 {company.fit}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </SurfaceCard>
  );
}
