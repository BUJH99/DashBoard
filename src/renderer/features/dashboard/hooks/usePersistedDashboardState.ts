import { useEffect, useRef, useState } from "react";
import type { DashboardLocalState, DashboardStateSync } from "../types";
import {
  readDashboardState as readDashboardStateService,
  saveDashboardState as saveDashboardStateService,
} from "../../../services/desktop/dashboardStateService";

type UsePersistedDashboardStateOptions = {
  applyState: (state: DashboardLocalState) => void;
  buildState: () => DashboardLocalState;
};

export function usePersistedDashboardState({
  applyState,
  buildState,
}: UsePersistedDashboardStateOptions) {
  const [dashboardStateSync, setDashboardStateSync] = useState<DashboardStateSync>({
    phase: "idle",
    message: null,
    lastSavedAt: null,
  });
  const applyStateRef = useRef(applyState);
  const buildStateRef = useRef(buildState);

  applyStateRef.current = applyState;
  buildStateRef.current = buildState;

  useEffect(() => {
    void (async () => {
      setDashboardStateSync({
        phase: "loading",
        message: null,
        lastSavedAt: null,
      });
      try {
        const payload = await readDashboardStateService();
        applyStateRef.current(payload.state);
        setDashboardStateSync({
          phase: "idle",
          message: null,
          lastSavedAt: payload.savedAt ?? null,
        });
      } catch (error) {
        setDashboardStateSync({
          phase: "error",
          message: error instanceof Error ? error.message : "??쒕낫???곹깭 濡쒕뱶 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.",
          lastSavedAt: null,
        });
      }
    })();
  }, []);

  const clearDashboardStateMessage = () => {
    setDashboardStateSync((current) => ({
      ...current,
      message: null,
    }));
  };

  const saveDashboardState = async () => {
    setDashboardStateSync((current) => ({
      phase: "saving",
      message: null,
      lastSavedAt: current.lastSavedAt,
    }));

    try {
      const payload = await saveDashboardStateService(buildStateRef.current());
      setDashboardStateSync({
        phase: "idle",
        message: "濡쒖뺄 ?곹깭 ??λ맖",
        lastSavedAt: payload.savedAt,
      });
    } catch (error) {
      setDashboardStateSync((current) => ({
        phase: "error",
        message: error instanceof Error ? error.message : "??쒕낫???곹깭 ???以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.",
        lastSavedAt: current.lastSavedAt,
      }));
    }
  };

  return {
    dashboardStateSync,
    clearDashboardStateMessage,
    saveDashboardState,
    setDashboardStateSync,
  };
}
