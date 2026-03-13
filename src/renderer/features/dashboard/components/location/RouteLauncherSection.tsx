import { useMemo, useState } from "react";
import { ArrowUpRight, Navigation2 } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type RouteLauncherSectionProps = {
  location: DashboardController["location"];
  selectedCompanyName: string;
  routeSearchError: string | null;
  setRouteSearchError: (value: string | null) => void;
};

const SUBWAY_LINE_COLORS: Record<string, string> = {
  "1": "#0052A4",
  "2": "#00A84D",
  "3": "#EF7C1C",
  "4": "#00A5DE",
  "5": "#996CAC",
  "6": "#CD7C2F",
  "7": "#747F00",
  "8": "#E6186C",
  "9": "#BDB092",
  "101": "#77C4A3",
  "102": "#F5A200",
  "103": "#D4003B",
  "104": "#0C8E72",
  "105": "#003DA5",
  "106": "#B7C452",
  "107": "#81A914",
  "108": "#0090D2",
  "109": "#6789CA",
  "110": "#FDA600",
  "111": "#6FB245",
  "112": "#A17800",
  "151": "#9A6292",
  "201": "#7CA8D5",
  "202": "#ED8B00",
};

function withAlpha(color: string, alphaHex: string) {
  return color.startsWith("#") && color.length === 7 ? `${color}${alphaHex}` : color;
}

function getLineTone(lineId: string) {
  const color = SUBWAY_LINE_COLORS[lineId] ?? "#0F172A";

  return {
    fill: color,
    soft: withAlpha(color, "18"),
    border: withAlpha(color, "55"),
  };
}

export function RouteLauncherSection({
  location,
  selectedCompanyName,
  routeSearchError,
  setRouteSearchError,
}: RouteLauncherSectionProps) {
  const [activeLineId, setActiveLineId] = useState(location.capitalAreaSubwayLines[0]?.id ?? "1");
  const [stationQuery, setStationQuery] = useState("");

  const activeLine =
    location.capitalAreaSubwayLines.find((line) => line.id === activeLineId) ??
    location.capitalAreaSubwayLines[0];
  const activeLineTone = getLineTone(activeLine?.id ?? "");
  const matchedStations = useMemo(() => {
    const normalizedQuery = stationQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return location.capitalAreaSubwayLines.flatMap((line) =>
      line.stations
        .filter((station) => station.toLowerCase().includes(normalizedQuery))
        .map((station) => ({
          lineId: line.id,
          label: line.label,
          station,
        })),
    );
  }, [location.capitalAreaSubwayLines, stationQuery]);

  const visibleStations = stationQuery.trim().length > 0 ? matchedStations : [];

  return (
    <SurfaceCard className="p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">출발지 / 목적지 네이버지도 열기</h3>
          <p className="mt-1 text-sm text-slate-500">
            집 주소, 수도권 전철 전 노선 역, 직접 입력값 중 하나를 출발지로 바로 설정할 수 있습니다.
          </p>
        </div>
        <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">대중교통 기준</Pill>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-slate-700">집 주소</span>
              <input
                value={location.homeAddress}
                onChange={(event) => location.setHomeAddress(event.target.value)}
                placeholder="예: 경기도 수원시 영통구 ..."
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-300"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  if (location.homeAddress.trim()) {
                    location.setRouteOrigin(location.homeAddress.trim());
                    setRouteSearchError(null);
                  }
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                집 주소를 출발지로 사용
              </button>
              <span className="self-center text-xs text-slate-400">
                저장만 해두고 필요할 때 출발지로 불러올 수 있습니다.
              </span>
            </div>
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
        </div>

        <div
          className="rounded-[24px] border bg-white/80 p-4"
          style={{
            borderColor: activeLineTone.border,
            background: `linear-gradient(180deg, ${activeLineTone.soft}, rgba(255,255,255,0.96))`,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-900">수도권 전철 전 노선 / 전체 역</p>
              <p className="mt-1 text-xs text-slate-500">역 버튼을 누르면 출발지에 즉시 반영됩니다.</p>
            </div>
            <Pill className="border-slate-200 bg-slate-100 text-slate-700">
              총 {location.capitalAreaSubwayLines.reduce((sum, line) => sum + line.stations.length, 0)}역
            </Pill>
          </div>

          <label className="mt-4 grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">역 검색</span>
            <input
              value={stationQuery}
              onChange={(event) => setStationQuery(event.target.value)}
              placeholder="예: 수원, 강남, 판교"
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            {location.capitalAreaSubwayLines.map((line) => (
              (() => {
                const tone = getLineTone(line.id);
                const isActive = activeLine?.id === line.id && stationQuery.trim().length === 0;

                return (
                  <button
                    key={line.id}
                    type="button"
                    onClick={() => {
                      setActiveLineId(line.id);
                      setStationQuery("");
                    }}
                    className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5"
                    style={{
                      borderColor: isActive ? tone.fill : tone.border,
                      backgroundColor: isActive ? tone.fill : tone.soft,
                      color: isActive ? "#FFFFFF" : tone.fill,
                    }}
                  >
                    {line.label}
                  </button>
                );
              })()
            ))}
          </div>

          <div
            className="mt-4 max-h-[320px] overflow-y-auto rounded-2xl border p-3"
            style={{
              borderColor: activeLineTone.border,
              backgroundColor: withAlpha(activeLineTone.fill, "0E"),
            }}
          >
            {stationQuery.trim().length > 0 ? (
              visibleStations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visibleStations.slice(0, 120).map((item) => {
                    const tone = getLineTone(item.lineId);

                    return (
                      <button
                        key={`${item.lineId}-${item.station}`}
                        type="button"
                        onClick={() => {
                          location.setRouteOrigin(item.station);
                          setRouteSearchError(null);
                        }}
                        className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5"
                        style={{
                          borderColor: tone.border,
                          backgroundColor: tone.soft,
                          color: tone.fill,
                        }}
                      >
                        {item.label} · {item.station}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">검색된 역이 없습니다.</p>
              )
            ) : activeLine ? (
              <div className="flex flex-wrap gap-2">
                {activeLine.stations.map((station) => {
                  const isSelected = location.routeOrigin === station;

                  return (
                    <button
                      key={`${activeLine.id}-${station}`}
                      type="button"
                      onClick={() => {
                        location.setRouteOrigin(station);
                        setRouteSearchError(null);
                      }}
                      className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5"
                      style={{
                        borderColor: isSelected ? activeLineTone.fill : activeLineTone.border,
                        backgroundColor: isSelected ? activeLineTone.fill : activeLineTone.soft,
                        color: isSelected ? "#FFFFFF" : activeLineTone.fill,
                      }}
                    >
                      {station}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={async () => {
            const origin = location.routeOrigin.trim();
            const destination = location.routeDestination.trim();
            if (!origin || !destination) {
              setRouteSearchError("출발지와 목적지를 모두 입력해 주세요.");
              return;
            }
            setRouteSearchError(null);
            try {
              await location.openTransitDirections();
            } catch (error) {
              setRouteSearchError(
                error instanceof Error
                  ? `네이버 지도를 열지 못했습니다. ${error.message}`
                  : "네이버 지도를 열지 못했습니다.",
              );
            }
          }}
          className="group relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,_rgba(15,23,42,1),_rgba(15,23,42,0.92),_rgba(8,47,73,0.96))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(8,47,73,0.28)] active:translate-y-[1px] active:scale-[0.985]"
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,_rgba(103,232,249,0.32),_transparent_48%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-active:opacity-70" />
          <span className="relative flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
              <Navigation2 className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-active:translate-x-0" />
            </span>
            <span>네이버 지도 열기</span>
            <ArrowUpRight className="h-4 w-4 opacity-70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-active:translate-x-0 group-active:translate-y-0" />
          </span>
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
        <div className="mt-2 break-all text-xs text-slate-500">
          경로 URL: {location.transitDirectionsUrl}
        </div>
      </div>
    </SurfaceCard>
  );
}
