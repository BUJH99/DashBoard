import type { CoverLetterSavePayload } from "../../shared/cover-letter-contracts.js";
import type { DashboardLocalState } from "../../shared/dashboard-state-contracts.js";
import { ipcMain, shell } from "electron";
import {
  getCoverLetterConfig,
  listCoverLetters,
  readCoverLetter,
  saveCoverLetter,
} from "../storage/coverLetterRepository.cjs";
import {
  readDashboardState,
  saveDashboardState,
} from "../storage/dashboardStateRepository.cjs";
import { IPC_CHANNELS } from "./ipc/channels.cjs";

export function registerIpcHandlers() {
  ipcMain.handle(IPC_CHANNELS.coverletters.getConfig, async () => getCoverLetterConfig());
  ipcMain.handle(IPC_CHANNELS.coverletters.list, async () => ({ files: await listCoverLetters() }));
  ipcMain.handle(IPC_CHANNELS.coverletters.read, async (_event, name: string) => readCoverLetter(name));
  ipcMain.handle(
    IPC_CHANNELS.coverletters.save,
    async (_event, payload: CoverLetterSavePayload) => saveCoverLetter(payload),
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
  ipcMain.handle(IPC_CHANNELS.external.openUrl, async (_event, url: string) => {
    await shell.openExternal(url);
  });
}
