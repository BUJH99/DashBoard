import type { DashboardLocalState } from "../../types";
import type { DashboardActionContext } from "../dashboardActionContext";

type PostingEntry = DashboardLocalState["postings"]["entries"][number];

function getNextPostingId(entries: PostingEntry[]) {
  return entries.reduce((maxId, entry) => Math.max(maxId, entry.id), 0) + 1;
}

function parseKeywords(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function createDashboardPostingActions({
  setDashboardState,
  companyTargets,
}: DashboardActionContext) {
  const selectJobPosting = (postingId: number) => {
    setDashboardState((current) => {
      const selectedPosting =
        current.postings.entries.find((posting) => posting.id === postingId) ??
        current.postings.entries[0];

      if (!selectedPosting) {
        return current;
      }

      const selectedCompany =
        companyTargets.find((company) => company.id === selectedPosting.targetCompanyId) ??
        companyTargets[0];

      return {
        ...current,
        ui: {
          ...current.ui,
          selectedCompanyId: selectedPosting.targetCompanyId,
          selectedJobPostingId: selectedPosting.id,
          selectedChecklistPostingId: selectedPosting.id,
        },
        location: {
          ...current.location,
          routeDestination: selectedCompany?.name ?? selectedPosting.company,
        },
      };
    });
  };

  const updateJobPosting = (
    postingId: number,
    patch: Partial<PostingEntry>,
  ) => {
    setDashboardState((current) => {
      const currentPosting =
        current.postings.entries.find((posting) => posting.id === postingId) ??
        current.postings.entries[0];

      if (!currentPosting) {
        return current;
      }

      const nextTargetCompanyId =
        patch.targetCompanyId ?? currentPosting.targetCompanyId;
      const nextCompanyName =
        companyTargets.find((company) => company.id === nextTargetCompanyId)?.name ??
        patch.company ??
        currentPosting.company;
      const nextEntries = current.postings.entries.map((posting) =>
        posting.id === postingId
          ? {
              ...posting,
              ...patch,
              company: nextCompanyName,
            }
          : posting,
      );
      const isSelectedPosting = current.ui.selectedJobPostingId === postingId;

      return {
        ...current,
        ui: isSelectedPosting
          ? {
              ...current.ui,
              selectedCompanyId: nextTargetCompanyId,
            }
          : current.ui,
        location: isSelectedPosting
          ? {
              ...current.location,
              routeDestination: nextCompanyName,
            }
          : current.location,
        postings: {
          ...current.postings,
          entries: nextEntries,
        },
      };
    });
  };

  const updateJobPostingKeywords = (postingId: number, value: string) => {
    updateJobPosting(postingId, {
      keywords: parseKeywords(value),
    });
  };

  const createJobPosting = () => {
    setDashboardState((current) => {
      const nextId = getNextPostingId(current.postings.entries);
      const selectedCompany =
        companyTargets.find((company) => company.id === current.ui.selectedCompanyId) ??
        companyTargets[0];
      const nextPosting: PostingEntry = {
        id: nextId,
        targetCompanyId: selectedCompany?.id ?? 1,
        company: selectedCompany?.name ?? "새 기업",
        title: `${selectedCompany?.name ?? "새 기업"} 신규 채용공고`,
        role: "new-role",
        deadline: "2026-03-31",
        stage: "서류 제출",
        fit: 75,
        burden: 55,
        urgency: 70,
        locationFit: 75,
        growth: 78,
        selfIntroReady: 60,
        keywords: ["RTL", "SystemVerilog"],
        summary: "요구사항과 어필 포인트를 여기에 정리합니다.",
      };

      return {
        ...current,
        ui: {
          ...current.ui,
          selectedCompanyId: nextPosting.targetCompanyId,
          selectedJobPostingId: nextPosting.id,
          selectedChecklistPostingId: nextPosting.id,
          postingCompanyFilter: String(nextPosting.targetCompanyId),
        },
        location: {
          ...current.location,
          routeDestination: nextPosting.company,
        },
        postings: {
          ...current.postings,
          entries: [...current.postings.entries, nextPosting],
        },
      };
    });
  };

  const deleteJobPosting = (postingId: number) => {
    setDashboardState((current) => {
      if (current.postings.entries.length <= 1) {
        return current;
      }

      const currentIndex = current.postings.entries.findIndex(
        (posting) => posting.id === postingId,
      );
      const nextEntries = current.postings.entries.filter(
        (posting) => posting.id !== postingId,
      );
      const fallbackPosting =
        nextEntries[Math.min(Math.max(currentIndex, 0), nextEntries.length - 1)] ??
        nextEntries[0];
      const fallbackCompany =
        companyTargets.find((company) => company.id === fallbackPosting.targetCompanyId) ??
        companyTargets[0];

      return {
        ...current,
        ui: {
          ...current.ui,
          selectedCompanyId:
            current.ui.selectedJobPostingId === postingId
              ? fallbackPosting.targetCompanyId
              : current.ui.selectedCompanyId,
          selectedJobPostingId:
            current.ui.selectedJobPostingId === postingId
              ? fallbackPosting.id
              : current.ui.selectedJobPostingId,
          selectedChecklistPostingId:
            current.ui.selectedChecklistPostingId === postingId
              ? fallbackPosting.id
              : current.ui.selectedChecklistPostingId,
          postingCompanyFilter:
            current.ui.selectedJobPostingId === postingId
              ? String(fallbackPosting.targetCompanyId)
              : current.ui.postingCompanyFilter,
        },
        location:
          current.ui.selectedJobPostingId === postingId
            ? {
                ...current.location,
                routeDestination: fallbackCompany?.name ?? fallbackPosting.company,
              }
            : current.location,
        postings: {
          ...current.postings,
          entries: nextEntries,
        },
      };
    });
  };

  return {
    selectJobPosting,
    updateJobPosting,
    updateJobPostingKeywords,
    createJobPosting,
    deleteJobPosting,
  };
}
