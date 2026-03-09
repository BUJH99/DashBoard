import { openExternalUrl } from "../../../../services/desktop/externalService";
import { buildEmptyCommuteNote, normalizeCommuteNote } from "../../../location/commuteNotes";
import type { CommuteNote } from "../../types";
import type { DashboardActionContext } from "../dashboardActionContext";

export function createDashboardLocationActions({
  setDashboardState,
  selectedCompanyId,
  commuteNotesSeed,
  transitDirectionsUrl,
}: DashboardActionContext) {
  const updateCommuteNote = (patch: Partial<CommuteNote>) => {
    setDashboardState((current) => {
      const currentNote = normalizeCommuteNote(
        current.location.companyCommuteNotes[selectedCompanyId] ??
          commuteNotesSeed[selectedCompanyId] ??
          buildEmptyCommuteNote(),
      );

      return {
        ...current,
        location: {
          ...current.location,
          companyCommuteNotes: {
            ...current.location.companyCommuteNotes,
            [selectedCompanyId]: {
              ...currentNote,
              ...patch,
            },
          },
        },
      };
    });
  };

  const setRouteOrigin = (value: string) =>
    setDashboardState((current) => ({
      ...current,
      location: {
        ...current.location,
        routeOrigin: value,
      },
    }));

  const setRouteDestination = (value: string) =>
    setDashboardState((current) => ({
      ...current,
      location: {
        ...current.location,
        routeDestination: value,
      },
    }));

  const openTransitDirections = () => openExternalUrl(transitDirectionsUrl);

  return {
    updateCommuteNote,
    setRouteOrigin,
    setRouteDestination,
    openTransitDirections,
  };
}
