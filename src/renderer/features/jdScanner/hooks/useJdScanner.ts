import { useEffect, useState } from "react";
import type { JdScanState } from "../../dashboard/types";

export function useJdScanner(initialText: string) {
  const [jdScan, setJdScan] = useState<JdScanState>({
    phase: "idle",
    text: initialText,
  });

  useEffect(() => {
    if (jdScan.phase !== "loading") {
      return;
    }
    const timer = window.setTimeout(() => {
      setJdScan((current) => (current.phase === "loading" ? { ...current, phase: "result" } : current));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [jdScan.phase]);

  return {
    jdScan,
    setJdScan,
  };
}
