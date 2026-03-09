import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Code2, Info, Save } from "lucide-react";
import type { DashboardTab } from "../../../shared/dashboard-state-contracts";
import type { DashboardShellCopy, DashboardTabMeta } from "../features/dashboard/config/dashboardChrome";
import type { NavSection } from "../features/dashboard/types";
import { ScrollArea } from "../components/ui/ScrollArea";
import { Pill } from "../components/ui/primitives";
import { cn } from "../lib/cn";

function NavItem({
  icon: Icon,
  label,
  isActive,
  expanded,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center rounded-2xl border border-transparent text-left transition-all duration-300",
        expanded
          ? "mx-2 w-[calc(100%-16px)] justify-start gap-3 px-3.5 py-2.5"
          : "mx-auto h-12 w-12 justify-center px-0 py-0",
        isActive
          ? "border-slate-900/15 bg-[linear-gradient(135deg,_rgba(7,18,46,0.98),_rgba(10,24,58,0.94))] text-white shadow-[0_14px_28px_rgba(2,6,23,0.18)]"
          : "text-slate-700 hover:border-slate-200 hover:bg-white/60 hover:text-slate-950",
      )}
      title={label}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
          isActive ? "text-white" : "text-slate-600",
        )}
      >
        <Icon className="h-[18px] w-[18px] stroke-[2.1]" />
      </span>
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap text-[14px] font-semibold tracking-[-0.02em] transition-all duration-300",
          expanded ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0",
          isActive && "font-black",
        )}
      >
        {label}
      </span>
    </button>
  );
}

type AppShellProps = {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (value: boolean) => void;
  navSections: NavSection[];
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  activeMeta: DashboardTabMeta;
  shellCopy: DashboardShellCopy;
  selectedCompanyName: string;
  dashboardStateMessage: string | null;
  onSaveDashboardState: () => void;
  children: ReactNode;
};

export function AppShell({
  isSidebarExpanded,
  setIsSidebarExpanded,
  navSections,
  activeTab,
  setActiveTab,
  activeMeta,
  shellCopy,
  selectedCompanyName,
  dashboardStateMessage,
  onSaveDashboardState,
  children,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#f8fbff,_#eef4fb_55%,_#e8eef7)] font-sans text-slate-900">
      <aside
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={cn(
          "career-sidebar sticky top-0 flex h-screen shrink-0 flex-col bg-transparent px-3 py-3 text-slate-300 transition-[width] duration-300 ease-out",
          isSidebarExpanded ? "w-[292px]" : "w-[92px]",
        )}
      >
        <div
          className={cn(
            "rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(255,255,255,0.48))] shadow-[0_28px_60px_rgba(148,163,184,0.18)] backdrop-blur-[28px] transition-all duration-300",
            isSidebarExpanded ? "px-5 py-5" : "px-3 py-4",
          )}
        >
          <div className={cn("flex items-center", isSidebarExpanded ? "gap-3" : "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#22d3ee,_#2563eb)] text-white shadow-lg shadow-cyan-500/25">
              <Code2 className="h-4.5 w-4.5" />
            </div>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isSidebarExpanded ? "max-w-[170px] opacity-100" : "max-w-0 opacity-0",
              )}
            >
              <p className="text-[15px] font-black tracking-[-0.02em] text-slate-950">{shellCopy.brandTitle}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {shellCopy.brandSubtitle}
              </p>
            </div>
          </div>
        </div>
        <ScrollArea
          className={cn(
            "mt-3 flex-1 rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.62),_rgba(255,255,255,0.4))] shadow-[0_24px_48px_rgba(148,163,184,0.18)] backdrop-blur-[28px] transition-all duration-300",
            isSidebarExpanded ? "px-1 py-4" : "px-0 py-3",
          )}
        >
          {navSections.map((section) => (
            <div
              key={section.title}
              className={cn(
                "mx-2 mb-4 rounded-[22px] border border-white/5 bg-white/[0.03] transition-all duration-300",
                isSidebarExpanded ? "px-1 py-2" : "px-0 py-2",
              )}
            >
              <div
                className={cn(
                  "overflow-hidden px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 transition-all duration-300",
                  isSidebarExpanded ? "max-h-6 pb-1 opacity-100" : "max-h-0 pb-0 opacity-0",
                )}
              >
                {section.title}
              </div>
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  expanded={isSidebarExpanded}
                  isActive={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </div>
          ))}
        </ScrollArea>
        <div
          className={cn(
            "mt-3 rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.6),_rgba(255,255,255,0.38))] shadow-[0_22px_44px_rgba(148,163,184,0.16)] backdrop-blur-[28px] transition-all duration-300",
            isSidebarExpanded ? "px-4 py-4" : "px-3 py-2.5",
          )}
        >
          <div className={cn("flex items-center", isSidebarExpanded ? "gap-3" : "justify-center")}>
            <div
              className={cn(
                "flex items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-bold text-white",
                isSidebarExpanded ? "h-10 w-10 text-sm" : "h-9 w-9 text-[13px]",
              )}
            >
              HW
            </div>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isSidebarExpanded
                  ? "max-h-10 max-w-[150px] opacity-100"
                  : "max-h-0 max-w-0 opacity-0",
              )}
            >
              <p className="text-[14px] font-black tracking-[-0.02em] text-slate-950">{shellCopy.workspaceTitle}</p>
              <p className="text-[10px] font-medium tracking-[0.01em] text-slate-500">{shellCopy.workspaceSubtitle}</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-10 py-5 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-[40px] font-black tracking-tight text-slate-900">{activeMeta.title}</h1>
              <p className="mt-1 text-[14px] text-slate-500">{activeMeta.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">{shellCopy.headerBadgeLabel}</Pill>
              <Pill className="border-slate-200 bg-slate-100 text-slate-700">{selectedCompanyName}</Pill>
              {dashboardStateMessage ? (
                <Pill className="border-slate-200 bg-white text-slate-700">{dashboardStateMessage}</Pill>
              ) : null}
              <button
                type="button"
                onClick={onSaveDashboardState}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Save className="h-4 w-4" />
                {shellCopy.saveButtonLabel}
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50"
                aria-label={shellCopy.helpButtonLabel}
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
        <ScrollArea className="flex-1 p-6 lg:p-8">{children}</ScrollArea>
      </main>
    </div>
  );
}
