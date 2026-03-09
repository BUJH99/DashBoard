import { Pill, ProgressBar } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";
import { getLocationInsight } from "./locationInsights";

type CommuteInsightSectionProps = {
  selectedCompany: DashboardController["companies"]["selectedCompany"];
};

export function CommuteInsightSection({
  selectedCompany,
}: CommuteInsightSectionProps) {
  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">기업별 메모</h3>
          <p className="mt-1 text-sm text-slate-500">
            {selectedCompany.name} 통근 메모를 저장해 두면 좌측 현황 목록에 바로 반영됩니다.
          </p>
        </div>
        <Pill className="border-slate-200 bg-slate-100 text-slate-700">{selectedCompany.location}</Pill>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800">위치 판단 메모</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {getLocationInsight(selectedCompany.location)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800">선호도 / 적합도</p>
          <div className="mt-3 space-y-3">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">선호도</span>
                <span className="font-semibold text-slate-800">{selectedCompany.preference}%</span>
              </div>
              <ProgressBar value={selectedCompany.preference} color="#4f46e5" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">적합도</span>
                <span className="font-semibold text-slate-800">{selectedCompany.fit}%</span>
              </div>
              <ProgressBar value={selectedCompany.fit} color="#10b981" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
