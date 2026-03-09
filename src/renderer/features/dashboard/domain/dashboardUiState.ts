import type { DashboardLocalState } from "../types";

type DashboardUiState = DashboardLocalState["ui"];

type ReconcileDashboardUiStateOptions = {
  companyIds: number[];
  jobPostingIds: number[];
  checklistPostingIds: number[];
  essayIds: number[];
  scheduleIds: number[];
  offerIds: string[];
  fallbackOfferA: string;
  fallbackOfferB: string;
};

function resolveSelection<T>(current: T, candidates: readonly T[], fallback: T) {
  return candidates.includes(current) ? current : fallback;
}

export function reconcileDashboardUiState(
  ui: DashboardUiState,
  options: ReconcileDashboardUiStateOptions,
): DashboardUiState {
  const nextCompanyId = resolveSelection(
    ui.selectedCompanyId,
    options.companyIds,
    options.companyIds[0] ?? ui.selectedCompanyId,
  );
  const nextChecklistPostingId = resolveSelection(
    ui.selectedChecklistPostingId,
    options.checklistPostingIds,
    options.checklistPostingIds[0] ?? ui.selectedChecklistPostingId,
  );
  const nextJobPostingId = resolveSelection(
    ui.selectedJobPostingId,
    options.jobPostingIds,
    options.jobPostingIds[0] ?? ui.selectedJobPostingId,
  );
  const nextEssayId = resolveSelection(
    ui.selectedEssayId,
    options.essayIds,
    options.essayIds[0] ?? ui.selectedEssayId,
  );
  const nextScheduleId = resolveSelection(
    ui.selectedScheduleId,
    options.scheduleIds,
    options.scheduleIds[0] ?? ui.selectedScheduleId,
  );
  const nextOfferA = resolveSelection(
    ui.selectedOfferA,
    options.offerIds,
    options.fallbackOfferA,
  );
  const nextOfferB = resolveSelection(
    ui.selectedOfferB,
    options.offerIds,
    options.fallbackOfferB,
  );

  if (
    nextCompanyId === ui.selectedCompanyId &&
    nextJobPostingId === ui.selectedJobPostingId &&
    nextChecklistPostingId === ui.selectedChecklistPostingId &&
    nextEssayId === ui.selectedEssayId &&
    nextScheduleId === ui.selectedScheduleId &&
    nextOfferA === ui.selectedOfferA &&
    nextOfferB === ui.selectedOfferB
  ) {
    return ui;
  }

  return {
    ...ui,
    selectedCompanyId: nextCompanyId,
    selectedJobPostingId: nextJobPostingId,
    selectedChecklistPostingId: nextChecklistPostingId,
    selectedEssayId: nextEssayId,
    selectedScheduleId: nextScheduleId,
    selectedOfferA: nextOfferA,
    selectedOfferB: nextOfferB,
  };
}
