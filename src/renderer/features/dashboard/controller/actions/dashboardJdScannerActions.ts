import type { DashboardActionContext } from "../dashboardActionContext";

export function createDashboardJdScannerActions({ setJdScan }: DashboardActionContext) {
  const runJdAnalysis = () => {
    setJdScan((current) => ({
      ...current,
      phase: "loading",
    }));
  };

  const resetJdAnalysis = () => {
    setJdScan((current) => ({
      ...current,
      phase: "idle",
    }));
  };

  return {
    runJdAnalysis,
    resetJdAnalysis,
  };
}
