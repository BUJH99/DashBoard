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
  companySlugMap: Record<number, string>;
  coverLetterSlugify: (value: string) => string;
};

export function buildDashboardCompanySnapshot({
  companyTargets,
  postings,
  selectedCompanyId,
  companySlugMap,
  coverLetterSlugify,
}: BuildDashboardCompanySnapshotOptions) {
  const snapshotCompany =
    companyTargets.find((company) => company.id === selectedCompanyId) ?? companyTargets[0];
  const snapshotCompanyPosting =
    postings.find((posting) => posting.targetCompanyId === snapshotCompany.id) ?? postings[0];
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
  commuteNotesSeed: Record<number, CommuteNote>;
  originPresets: OriginPreset[];
};

export function buildDashboardSelectionState({
  dashboardState,
  postings,
  schedule,
  essayQuestions,
  offerCatalog,
  flashcardDeck,
  selectedCompany,
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
  const selectedOrigin =
    originPresets.find((origin) => origin.value === dashboardState.location.routeOrigin) ?? null;
  const transitDirectionsUrl = buildNaverTransitDirectionsUrl({
    origin: dashboardState.location.routeOrigin,
    originLat: selectedOrigin?.lat,
    originLng: selectedOrigin?.lng,
    originType: selectedOrigin?.type,
    destination: selectedCompany.name,
    destinationLat: selectedCompany.lat,
    destinationLng: selectedCompany.lng,
  });

  return {
    activeFlashcardIndex,
    activeFlashcard,
    selectedScheduleEvent,
    selectedChecklistPosting,
    selectedEssay,
    selectedOfferA,
    selectedOfferB,
    selectedCommuteNote,
    transitDirectionsUrl,
  };
}
