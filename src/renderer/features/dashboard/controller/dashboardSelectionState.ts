import { buildEmptyCommuteNote, normalizeCommuteNote } from "../../location/commuteNotes";
import { buildNaverTransitDirectionsUrl } from "../../location/naverDirections";
import type {
  CommuteNote,
  CompanyTarget,
  DashboardLocalState,
  EnrichedPosting,
  EssayQuestion,
  FlashcardItem,
  OfferCatalogEntry,
  OriginPreset,
  ScheduleEvent,
} from "../types";

type BuildDashboardCompanySnapshotOptions = {
  companyTargets: CompanyTarget[];
  postings: EnrichedPosting[];
  selectedCompanyId: number;
  selectedJobPostingId: number;
  companySlugMap: Record<number, string>;
  coverLetterSlugify: (value: string) => string;
};

export function buildDashboardCompanySnapshot({
  companyTargets,
  postings,
  selectedCompanyId,
  selectedJobPostingId,
  companySlugMap,
  coverLetterSlugify,
}: BuildDashboardCompanySnapshotOptions) {
  const snapshotCompany =
    companyTargets.find((company) => company.id === selectedCompanyId) ?? companyTargets[0];
  const snapshotCompanyPosting =
    postings.find(
      (posting) =>
        posting.id === selectedJobPostingId && posting.targetCompanyId === snapshotCompany.id,
    ) ??
    postings.find((posting) => posting.targetCompanyId === snapshotCompany.id) ??
    postings[0];
  const snapshotCompanySlug =
    companySlugMap[snapshotCompany.id] ?? coverLetterSlugify(snapshotCompany.name);

  return {
    snapshotCompany,
    snapshotCompanyPosting,
    snapshotCompanySlug,
  };
}

type BuildDashboardSelectionStateOptions = {
  dashboardState: DashboardLocalState;
  postings: EnrichedPosting[];
  schedule: ScheduleEvent[];
  essayQuestions: EssayQuestion[];
  offerCatalog: OfferCatalogEntry[];
  flashcardDeck: FlashcardItem[];
  selectedCompany: CompanyTarget;
  companyTargets: CompanyTarget[];
  commuteNotesSeed: Record<number, CommuteNote>;
  originPresets: OriginPreset[];
};

function normalizePlaceName(value: string) {
  return value.trim().toLowerCase();
}

function resolveOriginMetadata(originPresets: OriginPreset[], origin: string) {
  const normalizedOrigin = normalizePlaceName(origin);

  return (
    originPresets.find((item) => normalizePlaceName(item.value) === normalizedOrigin) ??
    originPresets.find((item) => normalizePlaceName(item.label) === normalizedOrigin) ??
    null
  );
}

function resolveDestinationMetadata(
  companyTargets: CompanyTarget[],
  originPresets: OriginPreset[],
  destination: string,
) {
  const normalizedDestination = normalizePlaceName(destination);
  const matchedCompany =
    companyTargets.find((company) => normalizePlaceName(company.name) === normalizedDestination) ??
    null;

  if (matchedCompany) {
    return {
      lat: matchedCompany.lat,
      lng: matchedCompany.lng,
      type: matchedCompany.naverPlaceType ?? "PLACE_POI",
      placeId: matchedCompany.naverPlaceId ?? null,
    };
  }

  const matchedOriginPreset = resolveOriginMetadata(originPresets, destination);
  if (matchedOriginPreset) {
    return {
      lat: matchedOriginPreset.lat,
      lng: matchedOriginPreset.lng,
      type: matchedOriginPreset.type,
      placeId: matchedOriginPreset.placeId ?? null,
    };
  }

  return {
    lat: null,
    lng: null,
    type: "ADDRESS_POI" as const,
    placeId: null,
  };
}

export function buildDashboardSelectionState({
  dashboardState,
  postings,
  schedule,
  essayQuestions,
  offerCatalog,
  flashcardDeck,
  selectedCompany,
  companyTargets,
  commuteNotesSeed,
  originPresets,
}: BuildDashboardSelectionStateOptions) {
  const activeFlashcardIndex = Math.min(
    Math.max(dashboardState.ui.activeFlashcardIndex ?? 0, 0),
    Math.max(flashcardDeck.length - 1, 0),
  );
  const activeFlashcard = flashcardDeck[activeFlashcardIndex] ?? null;

  const selectedScheduleEvent =
    schedule.find((event) => event.id === dashboardState.ui.selectedScheduleId) ?? schedule[0];
  const selectedJobPosting =
    postings.find((posting) => posting.id === dashboardState.ui.selectedJobPostingId) ?? postings[0];
  const selectedChecklistPosting =
    postings.find((posting) => posting.id === dashboardState.ui.selectedChecklistPostingId) ?? postings[0];
  const selectedEssay =
    essayQuestions.find((essay) => essay.id === dashboardState.ui.selectedEssayId) ?? essayQuestions[0];
  const selectedOfferA =
    offerCatalog.find((entry) => entry.id === dashboardState.ui.selectedOfferA) ?? offerCatalog[0];
  const selectedOfferB =
    offerCatalog.find((entry) => entry.id === dashboardState.ui.selectedOfferB) ?? offerCatalog[1] ?? offerCatalog[0];

  const selectedCommuteNote = normalizeCommuteNote(
    dashboardState.location.companyCommuteNotes[selectedCompany.id] ??
      commuteNotesSeed[selectedCompany.id] ??
      buildEmptyCommuteNote(),
  );
  const routeOrigin = dashboardState.location.routeOrigin.trim();
  const routeDestination = dashboardState.location.routeDestination.trim() || selectedCompany.name;
  const selectedOrigin = resolveOriginMetadata(originPresets, routeOrigin);
  const resolvedDestination = resolveDestinationMetadata(
    companyTargets,
    originPresets,
    routeDestination,
  );
  const transitDirectionsUrl = buildNaverTransitDirectionsUrl({
    origin: routeOrigin,
    originLat: selectedOrigin?.lat,
    originLng: selectedOrigin?.lng,
    originType: selectedOrigin?.type,
    originPlaceId: selectedOrigin?.placeId,
    destination: routeDestination,
    destinationLat: resolvedDestination.lat,
    destinationLng: resolvedDestination.lng,
    destinationType: resolvedDestination.type,
    destinationPlaceId: resolvedDestination.placeId,
  });

  return {
    activeFlashcardIndex,
    activeFlashcard,
    selectedScheduleEvent,
    selectedJobPosting,
    selectedChecklistPosting,
    selectedEssay,
    selectedOfferA,
    selectedOfferB,
    selectedCommuteNote,
    transitDirectionsUrl,
  };
}
