import { useEffect } from "react";
import { reconcileDashboardUiState } from "../../domain/dashboardUiState";
import type { DashboardStateSynchronizationOptions } from "./dashboardSynchronizationTypes";

export function useDashboardUiStateReconciliation({
  setDashboardState,
  companyTargets,
  postings,
  essayQuestions,
  schedule,
  offerCatalog,
  fallbackOfferA,
  fallbackOfferB,
}: Pick<
  DashboardStateSynchronizationOptions,
  | "setDashboardState"
  | "companyTargets"
  | "postings"
  | "essayQuestions"
  | "schedule"
  | "offerCatalog"
  | "fallbackOfferA"
  | "fallbackOfferB"
>) {
  useEffect(() => {
    setDashboardState((current) => {
      const nextUi = reconcileDashboardUiState(current.ui, {
        companyIds: companyTargets.map((item) => item.id),
        jobPostingIds: postings.map((item) => item.id),
        checklistPostingIds: postings.map((item) => item.id),
        essayIds: essayQuestions.map((item) => item.id),
        scheduleIds: schedule.map((item) => item.id),
        offerIds: offerCatalog.map((item) => item.id),
        fallbackOfferA,
        fallbackOfferB,
      });

      if (nextUi === current.ui) {
        return current;
      }

      return {
        ...current,
        ui: nextUi,
      };
    });
  }, [
    companyTargets,
    essayQuestions,
    fallbackOfferA,
    fallbackOfferB,
    offerCatalog,
    postings,
    schedule,
    setDashboardState,
  ]);
}
