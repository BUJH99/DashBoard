import type { DashboardActionContext } from "../dashboardActionContext";

export function createDashboardJdScannerActions({ setJdScan }: DashboardActionContext) {
  const runJdAnalysis = () => {
    setJdScan((current) => ({
      ...current,
      phase: "loading",
    }));
  };

  return {
    runJdAnalysis,
  };
}
