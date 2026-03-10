import type {
  CoverLetterDeletePayload,
  CoverLetterSavePayload,
} from "../../shared/cover-letter-contracts.js";
import type { CoverLetterSpellcheckRequest } from "../../shared/cover-letter-spellcheck-service-contracts.js";
import type { DashboardLocalState } from "../../shared/dashboard-state-contracts.js";
import type { IndustryNewsCrawlRequest } from "../../shared/industry-news-service-contracts.js";
import { ipcMain, shell } from "electron";
import { checkCoverLetterSpelling } from "../services/coverLetterSpellcheck.cjs";
import {
  getCoverLetterConfig,
  listCoverLetters,
  readCoverLetter,
  removeCoverLetters,
  saveCoverLetter,
} from "../storage/coverLetterRepository.cjs";
import {
  readDashboardState,
  saveDashboardState,
} from "../storage/dashboardStateRepository.cjs";
import { crawlIndustryNews } from "../services/industryNewsCrawler.cjs";
import { IPC_CHANNELS } from "./ipc/channels.cjs";

export function registerIpcHandlers() {
  ipcMain.handle(IPC_CHANNELS.coverletters.getConfig, async () => getCoverLetterConfig());
  ipcMain.handle(IPC_CHANNELS.coverletters.list, async () => ({ files: await listCoverLetters() }));
  ipcMain.handle(IPC_CHANNELS.coverletters.read, async (_event, name: string) => readCoverLetter(name));
  ipcMain.handle(
    IPC_CHANNELS.coverletters.save,
    async (_event, payload: CoverLetterSavePayload) => saveCoverLetter(payload),
  );
  ipcMain.handle(
    IPC_CHANNELS.coverletters.remove,
    async (_event, payload: CoverLetterDeletePayload) => removeCoverLetters(payload),
  );
  ipcMain.handle(
    IPC_CHANNELS.coverLetterSpellcheck.check,
    async (_event, payload: CoverLetterSpellcheckRequest) => checkCoverLetterSpelling(payload),
  );
  ipcMain.handle(IPC_CHANNELS.dashboardState.read, async () => ({
    state: await readDashboardState(),
    savedAt: new Date().toISOString(),
  }));
  ipcMain.handle(
    IPC_CHANNELS.dashboardState.save,
    async (_event, payload: DashboardLocalState) => ({
      state: await saveDashboardState(payload),
      savedAt: new Date().toISOString(),
    }),
  );
  ipcMain.handle(IPC_CHANNELS.industryNews.crawl, async (_event, payload: IndustryNewsCrawlRequest) =>
    crawlIndustryNews(payload),
  );
  ipcMain.handle(IPC_CHANNELS.external.openUrl, async (_event, url: string) => {
    await shell.openExternal(url);
  });
}
