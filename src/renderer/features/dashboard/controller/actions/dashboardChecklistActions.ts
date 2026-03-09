import { toggleChecklistBlocked, toggleChecklistDone, updateChecklistNote } from "../../../checklist/mutations";
import { ensureChecklistCollection } from "../../domain/dashboardSelectors";
import type { DashboardActionContext } from "../dashboardActionContext";

export function createDashboardChecklistActions({
  setDashboardState,
  checklistTemplates,
  selectedChecklistPostingId,
}: DashboardActionContext) {
  const toggleChecklistItemDone = (itemId: string) => {
    setDashboardState((current) => ({
      ...current,
      checklists: {
        ...current.checklists,
        applicationChecklists: toggleChecklistDone(
          ensureChecklistCollection(
            current.checklists.applicationChecklists,
            checklistTemplates,
            selectedChecklistPostingId,
          ),
          selectedChecklistPostingId,
          itemId,
        ),
      },
    }));
  };

  const toggleChecklistItemBlocked = (itemId: string) => {
    setDashboardState((current) => ({
      ...current,
      checklists: {
        ...current.checklists,
        applicationChecklists: toggleChecklistBlocked(
          ensureChecklistCollection(
            current.checklists.applicationChecklists,
            checklistTemplates,
            selectedChecklistPostingId,
          ),
          selectedChecklistPostingId,
          itemId,
        ),
      },
    }));
  };

  const updateChecklistItemNote = (itemId: string, note: string) => {
    setDashboardState((current) => ({
      ...current,
      checklists: {
        ...current.checklists,
        applicationChecklists: updateChecklistNote(
          ensureChecklistCollection(
            current.checklists.applicationChecklists,
            checklistTemplates,
            selectedChecklistPostingId,
          ),
          selectedChecklistPostingId,
          itemId,
          note,
        ),
      },
    }));
  };

  return {
    toggleChecklistItemDone,
    toggleChecklistItemBlocked,
    updateChecklistItemNote,
  };
}
