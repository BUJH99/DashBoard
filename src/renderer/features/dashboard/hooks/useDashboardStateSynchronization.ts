import { useDashboardChecklistSynchronization } from "./synchronization/useDashboardChecklistSynchronization";
import { useDashboardCoverLetterSelectionSynchronization } from "./synchronization/useDashboardCoverLetterSelectionSynchronization";
import { useDashboardJdScannerSynchronization } from "./synchronization/useDashboardJdScannerSynchronization";
import { useDashboardRouteDestinationSynchronization } from "./synchronization/useDashboardRouteDestinationSynchronization";
import { useDashboardStateMessageAutoClear } from "./synchronization/useDashboardStateMessageAutoClear";
import { useDashboardUiStateReconciliation } from "./synchronization/useDashboardUiStateReconciliation";
import type { DashboardStateSynchronizationOptions } from "./synchronization/dashboardSynchronizationTypes";

export function useDashboardStateSynchronization(options: DashboardStateSynchronizationOptions) {
  useDashboardUiStateReconciliation(options);
  useDashboardStateMessageAutoClear(options);
  useDashboardChecklistSynchronization(options);
  useDashboardCoverLetterSelectionSynchronization(options);
  useDashboardRouteDestinationSynchronization(options);
  useDashboardJdScannerSynchronization(options);
}
