import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type OfferNotesSectionProps = {
  offers: [DashboardController["offer"]["selectedOfferA"], DashboardController["offer"]["selectedOfferB"]];
};

export function OfferNotesSection({
  offers,
}: OfferNotesSectionProps) {
  const [offerA, offerB] = offers;
  const averageA = Math.round(
    (offerA.profile.salary +
      offerA.profile.wlb +
      offerA.profile.growth +
      offerA.profile.location +
      offerA.profile.culture) /
      5,
  );
  const averageB = Math.round(
    (offerB.profile.salary +
      offerB.profile.wlb +
      offerB.profile.growth +
      offerB.profile.location +
      offerB.profile.culture) /
      5,
  );
  const leadOffer = averageA >= averageB ? offerA : offerB;
  const gap = Math.abs(averageA - averageB);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
      <SurfaceCard className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900">비교 해석</h3>
            <p className="mt-1 text-sm text-slate-500">
              점수 평균과 메모를 기반으로 지금 읽어야 할 핵심 포인트를 정리했습니다.
            </p>
          </div>
          <Pill className="border-slate-200 bg-slate-100 text-slate-700">Decision Notes</Pill>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Current Lead</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">{leadOffer.label}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            현재 평균 점수 기준으로 {leadOffer.label}이 {gap}점 앞서 있습니다. 다만 보상과 성장, 워라밸의 우선순위를 어떻게 두는지에 따라 최종 해석은 달라질 수 있습니다.
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          {[
            `${offerA.label}은 ${offerA.notes[0]} 쪽 강점이 두드러집니다.`,
            `${offerB.label}은 ${offerB.notes[0]} 포인트가 비교 우위입니다.`,
            `최종 선택 전에는 ${offerA.label}의 '${offerA.profile.bonus}'와 ${offerB.label}의 '${offerB.profile.bonus}' 성격 차이를 다시 확인하는 편이 좋습니다.`,
          ].map((note) => (
            <div key={note} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600">
              {note}
            </div>
          ))}
        </div>
      </SurfaceCard>

      <div className="grid gap-6 md:grid-cols-2">
        {offers.map((offer, index) => (
          <SurfaceCard key={offer.id} className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{offer.label}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  기본 {offer.profile.base} / 보너스 {offer.profile.bonus}
                </p>
              </div>
              <Pill
                className={
                  index === 0
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }
              >
                {index === 0 ? "회사 A" : "회사 B"}
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
    </div>
  );
}
