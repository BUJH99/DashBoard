import type { DashboardActionContext } from "../dashboardActionContext";

export function createDashboardInterviewActions({
  setDashboardState,
  setUiState,
  activeFlashcardQuestion,
}: DashboardActionContext) {
  const setFlashcardMode = (mode: "default" | "shuffled") => {
    setDashboardState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        flashcardMode: mode,
        activeFlashcardIndex: 0,
      },
    }));
  };

  const setActiveFlashcardIndex = (index: number) => {
    setUiState("activeFlashcardIndex", index);
  };

  const recordFlashcardFeedback = (feedback: "hard" | "easy") => {
    if (!activeFlashcardQuestion) {
      return;
    }

    setDashboardState((current) => ({
      ...current,
      interview: {
        flashcardFeedback: {
          ...current.interview.flashcardFeedback,
          [activeFlashcardQuestion]: feedback,
        },
      },
    }));
  };

  return {
    setFlashcardMode,
    setActiveFlashcardIndex,
    recordFlashcardFeedback,
  };
}
