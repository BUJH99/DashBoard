import type { DashboardController } from "../useDashboardController";
import { CompanyNotesSection } from "./process/CompanyNotesSection";
import { CompanyOverviewSection } from "./process/CompanyOverviewSection";
import { CompanyPostingFilterSection } from "./process/CompanyPostingFilterSection";
import { JdInputSection } from "./process/JdInputSection";
import { JdResultSection } from "./process/JdResultSection";
import { KanbanBoardSection } from "./process/KanbanBoardSection";
import { PostingCardsSection } from "./process/PostingCardsSection";
import { StrategyMatrixSection } from "./process/StrategyMatrixSection";
import { StrategySummarySection } from "./process/StrategySummarySection";

export function KanbanTab({ controller }: { controller: DashboardController }) {
  return <KanbanBoardSection companies={controller.companies} />;
}

export function StrategyTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <StrategyMatrixSection companies={controller.companies} />
      <div className="grid gap-6">
        <StrategySummarySection companies={controller.companies} overview={controller.overview} />
        <PostingCardsSection
          title="관련 공고"
          description="선택 기업과 연결된 공고를 우선순위와 함께 확인합니다."
          postings={controller.companies.relatedPostings}
          badgeMode="priority"
        />
      </div>
    </div>
  );
}

export function CompanyTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid min-h-[720px] gap-6 xl:grid-cols-[0.34fr_0.66fr]">
      <CompanyPostingFilterSection companies={controller.companies} />
      <div className="grid gap-6">
        <CompanyOverviewSection companies={controller.companies} />
        <div className="grid gap-6 xl:grid-cols-2">
          <PostingCardsSection
            title="관련 공고"
            postings={controller.companies.relatedPostings}
            badgeMode="deadline"
          />
          <CompanyNotesSection companies={controller.companies} />
        </div>
      </div>
    </div>
  );
}

export function JdScannerTab({ controller }: { controller: DashboardController }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <JdInputSection jdScanner={controller.jdScanner} />
      <JdResultSection jdScanner={controller.jdScanner} />
    </div>
  );
}
