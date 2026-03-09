import { useEffect } from "react";
import type { DashboardStateSynchronizationOptions } from "./dashboardSynchronizationTypes";

export function useDashboardJdScannerSynchronization({
  dashboardState,
  jdScan,
  setDashboardState,
  setJdScan,
}: Pick<
  DashboardStateSynchronizationOptions,
  "dashboardState" | "jdScan" | "setDashboardState" | "setJdScan"
>) {
  useEffect(() => {
    setJdScan((current) =>
      current.text === dashboardState.jdScanner.text
        ? current
        : { ...current, text: dashboardState.jdScanner.text },
    );
  }, [dashboardState.jdScanner.text, setJdScan]);

  useEffect(() => {
    setDashboardState((current) =>
      current.jdScanner.text === jdScan.text
        ? current
        : {
            ...current,
            jdScanner: {
              text: jdScan.text,
            },
          },
    );
  }, [jdScan.text, setDashboardState]);
}
