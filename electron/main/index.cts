import { app, BrowserWindow } from "electron";
import { ensureDashboardStateFile } from "../storage/dashboardStateRepository.cjs";
import { createMainWindow } from "./createMainWindow.cjs";
import { registerIpcHandlers } from "./registerIpcHandlers.cjs";
import { stopInternalRendererServer } from "./rendererServer.cjs";

app.whenReady().then(async () => {
  await ensureDashboardStateFile();
  registerIpcHandlers();
  await createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  stopInternalRendererServer();

  if (process.platform !== "darwin") {
    app.quit();
  }
});
