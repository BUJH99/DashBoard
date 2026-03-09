import { RadarChart } from "../../../../components/charts/DashboardCharts";
import { SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type OfferRadarSectionProps = {
  offer: DashboardController["offer"];
};

export function OfferRadarSection({
  offer,
}: OfferRadarSectionProps) {
  return (
    <SurfaceCard className="p-6">
      <div className="mb-5 flex flex-wrap gap-3">
        <select
          value={offer.selectedOfferA.id}
          onChange={(event) => offer.setSelectedOfferA(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
        >
          {offer.offerCatalog.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={offer.selectedOfferB.id}
          onChange={(event) => offer.setSelectedOfferB(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
        >
          {offer.offerCatalog.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <RadarChart
        data1={offer.selectedOfferA.profile}
        data2={offer.selectedOfferB.profile}
        color1="#0ea5e9"
        color2="#8b5cf6"
      />
    </SurfaceCard>
  );
}
