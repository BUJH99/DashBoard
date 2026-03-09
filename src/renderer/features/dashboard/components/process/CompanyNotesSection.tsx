import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type CompanyNotesSectionProps = {
  companies: DashboardController["companies"];
};

export function CompanyNotesSection({
  companies,
}: CompanyNotesSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <h3 className="mb-4 text-lg font-bold text-slate-900">기업 메모</h3>
      <div className="space-y-3">
        {companies.selectedCompanyDetail.news.map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4">
        <p className="font-semibold text-slate-800">연결된 자기소개서</p>
        <p className="mt-2 text-sm text-slate-500">
          {companies.companyCoverLetters.length > 0
            ? companies.companyCoverLetters.map((item) => item.name).join(", ")
            : "현재 선택 기업에 연결된 자기소개서 파일이 없습니다."}
        </p>
      </div>
    </SurfaceCard>
  );
}
