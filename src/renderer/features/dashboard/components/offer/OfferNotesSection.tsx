import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type OfferNotesSectionProps = {
  offers: [DashboardController["offer"]["selectedOfferA"], DashboardController["offer"]["selectedOfferB"]];
};

export function OfferNotesSection({
  offers,
}: OfferNotesSectionProps) {
  return (
    <div className="grid gap-6">
      {offers.map((offer) => (
        <SurfaceCard key={offer.id} className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{offer.label}</h3>
              <p className="mt-1 text-sm text-slate-500">
                기본 {offer.profile.base} / 보너스 {offer.profile.bonus}
              </p>
            </div>
            <Pill className="border-slate-200 bg-slate-100 text-slate-700">
              {offer.companyId ? "기업 오퍼" : "비교 시나리오"}
            </Pill>
          </div>
          <div className="space-y-3">
            {offer.notes.map((note) => (
              <div key={note} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                {note}
              </div>
            ))}
          </div>
        </SurfaceCard>
      ))}
    </div>
  );
}
