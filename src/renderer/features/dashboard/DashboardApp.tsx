import { useMemo, useState } from "react";
import { AppShell } from "../../app/AppShell";
import {
  CalendarTab,
  CoverLettersTab,
  InterviewTab,
} from "./components/InterviewCalendarCoverLettersTabs";
import { LocationTab, OfferTab } from "./components/DecisionTabs";
import { IndustryTab, OverviewTab } from "./components/OverviewIndustryTabs";
import { ChecklistTab, PortfolioTab } from "./components/PortfolioChecklistTabs";
import {
  CompanyTab,
  JdScannerTab,
  KanbanTab,
  PostingsTab,
  StrategyTab,
} from "./components/ProcessTabs";
import {
  DASHBOARD_NAV_SECTIONS,
  DASHBOARD_SHELL_COPY,
  DASHBOARD_TAB_META,
  sanitizeDashboardBannerMessage,
} from "./config/dashboardChrome";
import { useDashboardController } from "./useDashboardController";

export default function DashboardApp() {
  const controller = useDashboardController();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const activeMeta = DASHBOARD_TAB_META[controller.activeTab];
  const dashboardStateMessage = sanitizeDashboardBannerMessage(controller.dashboardStateMessage);

  const tabRegistry = useMemo(
    () => ({
      overview: <OverviewTab controller={controller} />,
      industry: <IndustryTab controller={controller} />,
      kanban: <KanbanTab controller={controller} />,
      strategy: <StrategyTab controller={controller} />,
      postings: <PostingsTab controller={controller} />,
      company: <CompanyTab controller={controller} />,
      jdscanner: <JdScannerTab controller={controller} />,
      offer: <OfferTab controller={controller} />,
      location: <LocationTab controller={controller} />,
      portfolio: <PortfolioTab controller={controller} />,
      checklist: <ChecklistTab controller={controller} />,
      interview: <InterviewTab controller={controller} />,
      calendar: <CalendarTab controller={controller} />,
      coverletters: <CoverLettersTab controller={controller} />,
    }),
    [controller],
  );

  return (
    <AppShell
      isSidebarExpanded={isSidebarExpanded}
      setIsSidebarExpanded={setIsSidebarExpanded}
      navSections={DASHBOARD_NAV_SECTIONS}
      activeTab={controller.activeTab}
      setActiveTab={controller.setActiveTab}
      activeMeta={activeMeta}
      shellCopy={DASHBOARD_SHELL_COPY}
      userName={controller.dashboardState.ui.userName}
      onUserNameChange={(value) => controller.setUiState("userName", value)}
      selectedCompanyName={controller.companies.selectedCompany.name}
      dashboardStateMessage={dashboardStateMessage}
      onSaveDashboardState={() => void controller.saveDashboardState()}
    >
      {tabRegistry[controller.activeTab]}
    </AppShell>
  );
}
