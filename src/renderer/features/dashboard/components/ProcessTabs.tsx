import type { DashboardController } from "../useDashboardController";
import { CompanyOverviewSection } from "./process/CompanyOverviewSection";
import { CompanyPostingFilterSection } from "./process/CompanyPostingFilterSection";
import { JdInputSection } from "./process/JdInputSection";
import { JdResultSection } from "./process/JdResultSection";
import { KanbanBoardSection } from "./process/KanbanBoardSection";
import { PostingEditorSection } from "./process/PostingEditorSection";
import { PostingCardsSection } from "./process/PostingCardsSection";
import { PostingsLibrarySection } from "./process/PostingsLibrarySection";
import { StrategyMatrixSection } from "./process/StrategyMatrixSection";
import { StrategySummarySection } from "./process/StrategySummarySection";

export function KanbanTab({ controller }: { controller: DashboardController }) {
  return <KanbanBoardSection companies={controller.companies} />;
}

export function StrategyTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.22fr_0.78fr]">
      <StrategyMatrixSection companies={controller.companies} />
      <div className="grid gap-6">
        <StrategySummarySection companies={controller.companies} overview={controller.overview} />
        <PostingCardsSection
          title="관련 공고"
          description="선택 기업과 연결된 공고를 우선순위와 함께 확인합니다."
          postings={controller.companies.relatedPostings}
          badgeMode="priority"
          selectedPostingId={controller.companies.selectedJobPosting.id}
          onSelectPosting={controller.companies.setSelectedPostingId}
        />
      </div>
    </div>
  );
}

export function PostingsTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid min-h-[760px] gap-6 xl:grid-cols-[0.38fr_0.62fr]">
      <PostingsLibrarySection postings={controller.postings} />
      <PostingEditorSection postings={controller.postings} />
    </div>
  );
}

export function CompanyTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid min-h-[840px] gap-6 xl:grid-cols-[0.34fr_0.66fr]">
      <CompanyPostingFilterSection companies={controller.companies} />
      <CompanyOverviewSection companies={controller.companies} portfolio={controller.portfolio} />
    </div>
  );
}

export function JdScannerTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid min-h-[760px] gap-6 xl:grid-cols-[1fr_1fr]">
      <JdInputSection jdScanner={controller.jdScanner} />
      <JdResultSection jdScanner={controller.jdScanner} />
    </div>
  );
}
