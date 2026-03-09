import type { DashboardController } from "../useDashboardController";
import { CalendarBoardSection } from "./calendar/CalendarBoardSection";
import { CalendarScheduleSection } from "./calendar/CalendarScheduleSection";
import { CoverLetterEditorSection } from "./coverLetters/CoverLetterEditorSection";
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
  return (
    <div className="grid min-h-[760px] gap-5 xl:grid-cols-[0.32fr_0.68fr]">
      <CoverLetterFileListSection coverLetters={controller.coverLetters} />
      <div className="grid gap-6">
        <CoverLetterEditorSection coverLetters={controller.coverLetters} />
        <CoverLetterPreviewSection content={controller.coverLetters.coverLetterDraft.content} />
      </div>
    </div>
  );
}
