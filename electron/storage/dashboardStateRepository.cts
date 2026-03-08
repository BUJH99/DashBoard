import type { DashboardLocalState } from "../../shared/desktop-contracts.js";
import { promises as fs } from "node:fs";
import { dashboardStatePath } from "./filePaths.cjs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function buildDefaultDashboardStateFile(): DashboardLocalState {
  return {
    ui: {
      activeTab: "overview",
      postingQuery: "",
      postingCompanyFilter: "all",
      selectedCompanyId: 1,
      selectedOfferA: "?쇱꽦?꾩옄 (DS)",
      selectedOfferB: "由щ꺼由ъ삩",
      portfolioSubTab: "showcase",
      selectedChecklistPostingId: 101,
      selectedEssayId: 301,
      industryFilter: "All",
      flashcardMode: "default",
      activeFlashcardIndex: 0,
      selectedScheduleId: 2,
      selectedCoverLetterName: null,
    },
    location: {
      routeOrigin: "吏?",
      routeDestination: "?쇱꽦?꾩옄 (DS/LSI)",
      companyCommuteNotes: {},
    },
    checklists: {
      applicationChecklists: {},
    },
    interview: {
      flashcardFeedback: {},
    },
    jdScanner: {
      text: `?곕??ы빆
- Verilog / SystemVerilog 湲곕컲 RTL ?ㅺ퀎 寃쏀뿕
- UVM 寃利??섍꼍 ?댄빐
- AMBA AXI, FPGA ?꾨줈?좏??댄븨 寃쏀뿕
- ??꾨젰 ?ㅺ퀎 ?먮뒗 CDC 遺꾩꽍 寃쏀뿕`,
    },
    overview: {
      taskChecked: {},
    },
  };
}

export async function ensureDashboardStateFile() {
  try {
    await fs.access(dashboardStatePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    await fs.writeFile(dashboardStatePath, JSON.stringify(buildDefaultDashboardStateFile(), null, 2), "utf8");
  }
}

export async function readDashboardState() {
  await ensureDashboardStateFile();
  const defaults = buildDefaultDashboardStateFile();
  const raw = await fs.readFile(dashboardStatePath, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) {
      return defaults;
    }
    return {
      ui: { ...defaults.ui, ...(isRecord(parsed.ui) ? parsed.ui : {}) },
      location: { ...defaults.location, ...(isRecord(parsed.location) ? parsed.location : {}) },
      checklists: { ...defaults.checklists, ...(isRecord(parsed.checklists) ? parsed.checklists : {}) },
      interview: { ...defaults.interview, ...(isRecord(parsed.interview) ? parsed.interview : {}) },
      jdScanner: { ...defaults.jdScanner, ...(isRecord(parsed.jdScanner) ? parsed.jdScanner : {}) },
      overview: { ...defaults.overview, ...(isRecord(parsed.overview) ? parsed.overview : {}) },
    };
  } catch {
    await fs.writeFile(dashboardStatePath, JSON.stringify(defaults, null, 2), "utf8");
    return defaults;
  }
}

export async function saveDashboardState(payload: unknown) {
  const defaults = buildDefaultDashboardStateFile();
  const nextState = isRecord(payload)
    ? {
        ui: { ...defaults.ui, ...(isRecord(payload.ui) ? payload.ui : {}) },
        location: { ...defaults.location, ...(isRecord(payload.location) ? payload.location : {}) },
        checklists: { ...defaults.checklists, ...(isRecord(payload.checklists) ? payload.checklists : {}) },
        interview: { ...defaults.interview, ...(isRecord(payload.interview) ? payload.interview : {}) },
        jdScanner: { ...defaults.jdScanner, ...(isRecord(payload.jdScanner) ? payload.jdScanner : {}) },
        overview: { ...defaults.overview, ...(isRecord(payload.overview) ? payload.overview : {}) },
      }
    : defaults;

  await fs.writeFile(dashboardStatePath, JSON.stringify(nextState, null, 2), "utf8");
  return nextState;
}
