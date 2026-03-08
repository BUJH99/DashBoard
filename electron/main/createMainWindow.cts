import path from "node:path";
import { BrowserWindow, shell } from "electron";
import { isExternalUrl, startInternalRendererServer } from "./rendererServer.cjs";

export async function createMainWindow() {
  const rendererUrl = await startInternalRendererServer();
  const appIconPath = path.join(__dirname, "..", "..", "build-resources", "icon.ico");
  const win = new BrowserWindow({
    width: 1520,
    height: 980,
    minWidth: 1280,
    minHeight: 820,
    autoHideMenuBar: true,
    icon: appIconPath,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "..", "preload.cjs"),
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) {
      void shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (isExternalUrl(url)) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  await win.loadURL(rendererUrl);
  return win;
}
