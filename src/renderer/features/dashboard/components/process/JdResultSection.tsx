import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type JdResultSectionProps = {
  jdScanner: DashboardController["jdScanner"];
};

export function JdResultSection({
  jdScanner,
}: JdResultSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">분석 결과</h3>
        <p className="mt-1 text-sm text-slate-500">
          추출 키워드와 현재 보유 키워드를 비교해 보완 포인트를 확인합니다.
        </p>
      </div>
      {jdScanner.result ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">커버리지</p>
                <p className="text-3xl font-black text-slate-900">{jdScanner.result.coverage}%</p>
              </div>
              <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">포트폴리오 매칭</Pill>
            </div>
            <p className="mt-3 text-sm text-slate-600">{jdScanner.result.recommendation}</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-800">추출 키워드</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {jdScanner.result.extracted.map((item) => (
                  <Pill key={item} className="border-slate-200 bg-slate-100 text-slate-700">
                    {item}
                  </Pill>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-800">매칭 항목</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {jdScanner.result.matched.map((item) => (
                  <Pill key={item} className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    {item}
                  </Pill>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-800">보완 필요</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {jdScanner.result.missing.map((item) => (
                  <Pill key={item} className="border-amber-200 bg-amber-50 text-amber-700">
                    {item}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          분석을 실행하면 추출 키워드, 매칭 항목, 부족한 항목이 여기에 표시됩니다.
        </div>
      )}
    </SurfaceCard>
  );
}
