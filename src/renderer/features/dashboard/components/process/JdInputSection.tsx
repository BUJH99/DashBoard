import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type JdInputSectionProps = {
  jdScanner: DashboardController["jdScanner"];
};

export function JdInputSection({
  jdScanner,
}: JdInputSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">JD 텍스트 입력</h3>
        <p className="mt-1 text-sm text-slate-500">
          공고 요구사항을 붙여 넣으면 현재 포트폴리오와 비교해 부족한 항목을 정리합니다.
        </p>
      </div>
      <textarea
        value={jdScanner.jdScan.text}
        onChange={(event) => jdScanner.setText(event.target.value)}
        className="min-h-[320px] w-full rounded-3xl border border-slate-200 px-4 py-4 outline-none focus:border-cyan-300"
        placeholder="공고 상세 요구사항을 여기에 붙여 넣으세요."
      />
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={jdScanner.runJdAnalysis}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          분석 실행
        </button>
        <Pill className="border-slate-200 bg-slate-100 text-slate-700">
          상태: {jdScanner.jdScan.phase}
        </Pill>
      </div>
    </SurfaceCard>
  );
}
