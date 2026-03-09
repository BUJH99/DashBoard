import type { DashboardController } from "../useDashboardController";
import { buildCoverLetterMarkdown } from "../../coverLetters/utils";
import { CalendarBoardSection } from "./calendar/CalendarBoardSection";
import { CalendarScheduleSection } from "./calendar/CalendarScheduleSection";
import {
  CoverLetterDraftSection,
  CoverLetterPresetSection,
} from "./coverLetters/CoverLetterEditorSection";
import { CoverLetterFileListSection } from "./coverLetters/CoverLetterFileListSection";
import { CoverLetterPreviewSection } from "./coverLetters/CoverLetterPreviewSection";
import { EssayLinkSection } from "./interview/EssayLinkSection";
import { InterviewFlashcardSection } from "./interview/InterviewFlashcardSection";

export function InterviewTab({ controller }: { controller: DashboardController }) {
  const linkedExperiences = controller.interview.experienceLibrary.filter((experience) =>
    controller.essays.selectedEssay.linkedExperienceIds.includes(experience.id),
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[0.52fr_0.48fr]">
      <InterviewFlashcardSection interview={controller.interview} />
      <EssayLinkSection essays={controller.essays} linkedExperiences={linkedExperiences} />
    </div>
  );
}

export function CalendarTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <CalendarBoardSection calendar={controller.calendar} />
      <CalendarScheduleSection calendar={controller.calendar} />
    </div>
  );
}

export function CoverLettersTab({ controller }: { controller: DashboardController }) {
  const previewContent = buildCoverLetterMarkdown(
    controller.coverLetters.coverLetterDraft.meta.title,
    controller.coverLetters.coverLetterDraft.questionItems,
  );

  return (
    <div className="grid min-h-[980px] gap-6 xl:grid-cols-[0.44fr_0.56fr] xl:grid-rows-[720px_auto]">
      <div className="xl:col-start-1 xl:row-start-1">
        <CoverLetterFileListSection coverLetters={controller.coverLetters} />
      </div>
      <div className="xl:col-start-2 xl:row-start-1">
        <CoverLetterPresetSection coverLetters={controller.coverLetters} />
      </div>
      <div className="xl:col-start-1 xl:row-start-2">
        <CoverLetterDraftSection coverLetters={controller.coverLetters} />
      </div>
      <div className="xl:col-start-2 xl:row-start-2">
        <CoverLetterPreviewSection content={previewContent} />
      </div>
    </div>
  );
}
