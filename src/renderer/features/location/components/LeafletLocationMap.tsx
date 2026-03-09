import { useRef } from "react";
import type { CompanyTarget } from "../../dashboard/types";
import { Pill } from "../../../components/ui/primitives";
import { useLeafletLocationMap } from "../hooks/useLeafletLocationMap";

export function LeafletLocationMap({
  companies,
  selectedCompanyId,
  onSelectCompany,
}: {
  companies: CompanyTarget[];
  selectedCompanyId: number;
  onSelectCompany: (id: number) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) ?? companies[0];
  const { tileState } = useLeafletLocationMap({
    containerRef: mapContainerRef,
    companies,
    selectedCompanyId,
    onSelectCompany,
  });

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
      <div className="absolute left-4 top-4 z-[500] rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Leaflet Map</p>
        <p className="mt-1 text-sm font-bold text-slate-900">{selectedCompany.name}</p>
        <p className="mt-1 text-xs text-slate-500">{selectedCompany.location}</p>
      </div>
      {tileState === "error" ? (
        <div className="absolute inset-0 z-[450] flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-rose-200 bg-white px-5 py-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-rose-700">Map tiles unavailable</p>
            <p className="mt-2 text-xs text-slate-500">Check your network connection and try loading the map again.</p>
          </div>
        </div>
      ) : null}
      <div
        ref={mapContainerRef}
        className="min-h-[360px] w-full"
        aria-label="Company location map"
      />
      <div className="absolute bottom-4 left-4 z-[500] flex flex-wrap gap-2">
        <Pill className="border-slate-200 bg-white/90 text-slate-700">Route fit</Pill>
        <Pill className="border-slate-200 bg-white/90 text-slate-700">Transit view</Pill>
        <Pill className="border-slate-200 bg-white/90 text-slate-700">OpenStreetMap</Pill>
      </div>
    </div>
  );
}
