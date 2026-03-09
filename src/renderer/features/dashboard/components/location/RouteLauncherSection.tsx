import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type RouteLauncherSectionProps = {
  location: DashboardController["location"];
  selectedCompanyName: string;
  routeSearchError: string | null;
  setRouteSearchError: (value: string | null) => void;
};

export function RouteLauncherSection({
  location,
  selectedCompanyName,
  routeSearchError,
  setRouteSearchError,
}: RouteLauncherSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">출발지 / 목적지 네이버지도 열기</h3>
          <p className="mt-1 text-sm text-slate-500">
            출발지와 목적지를 입력한 뒤 네이버 지도 대중교통 경로를 바로 엽니다.
          </p>
        </div>
        <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">대중교통 기준</Pill>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-slate-700">출발지</span>
          <input
            value={location.routeOrigin}
            onChange={(event) => {
              location.setRouteOrigin(event.target.value);
              if (routeSearchError) {
                setRouteSearchError(null);
              }
            }}
            placeholder="출발지 입력"
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {location.originPresets.map((origin) => (
              <button
                key={origin.value}
                type="button"
                onClick={() => {
                  location.setRouteOrigin(origin.value);
                  setRouteSearchError(null);
                }}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  location.routeOrigin === origin.value
                    ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {origin.label}
              </button>
            ))}
          </div>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-slate-700">목적지</span>
          <input
            value={location.routeDestination}
            onChange={(event) => {
              location.setRouteDestination(event.target.value);
              if (routeSearchError) {
                setRouteSearchError(null);
              }
            }}
            placeholder="목적지 입력"
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            const origin = location.routeOrigin.trim();
            const destination = location.routeDestination.trim();
            if (!origin || !destination) {
              setRouteSearchError("출발지와 목적지를 모두 입력해 주세요.");
              return;
            }
            setRouteSearchError(null);
            location.openTransitDirections();
          }}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          네이버 지도 열기
        </button>
        <button
          type="button"
          onClick={() => {
            location.setRouteDestination(selectedCompanyName);
            setRouteSearchError(null);
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          선택 기업으로 목적지 맞추기
        </button>
      </div>
      {routeSearchError ? (
        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {routeSearchError}
        </div>
      ) : null}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-600">
        현재 목적지: <span className="font-semibold text-slate-800">{location.routeDestination}</span>
      </div>
    </SurfaceCard>
  );
}
