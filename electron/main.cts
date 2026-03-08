import { createReadStream, promises as fs } from "node:fs";
import { createServer, type Server } from "node:http";
import path from "node:path";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import {
  ensureDashboardStateFile,
  getCoverLetterConfig,
  listCoverLetters,
  readCoverLetter,
  readDashboardState,
  saveCoverLetter,
  saveDashboardState,
} from "./local-data.cjs";

let internalRendererServer: Server | null = null;
let internalRendererUrl: string | null = null;

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url) && !(internalRendererUrl && url.startsWith(internalRendererUrl));
}

function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".map": "application/json; charset=utf-8",
  };
  return types[ext] ?? "application/octet-stream";
}

async function startInternalRendererServer() {
  if (internalRendererServer && internalRendererUrl) {
    return internalRendererUrl;
  }

  const distRoot = path.join(__dirname, "..", "dist");
  await fs.access(path.join(distRoot, "index.html"));

  internalRendererServer = createServer(async (req, res) => {
    try {
      const requestPath = req.url ? decodeURIComponent(req.url.split("?")[0]) : "/";
      const normalizedPath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
      const distBase = path.resolve(distRoot);
      let filePath = path.resolve(distRoot, normalizedPath);

      if (!filePath.startsWith(distBase)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          filePath = path.join(filePath, "index.html");
        }
      } catch {
        filePath = path.join(distRoot, "index.html");
      }

      res.setHeader("Content-Type", getContentType(filePath));
      createReadStream(filePath).pipe(res);
    } catch {
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  await new Promise<void>((resolve, reject) => {
    internalRendererServer?.once("error", reject);
    internalRendererServer?.listen(0, "127.0.0.1", () => resolve());
  });

  const address = internalRendererServer.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to resolve internal renderer server address.");
  }

  internalRendererUrl = `http://127.0.0.1:${address.port}`;
  return internalRendererUrl;
}

async function createMainWindow() {
  const rendererUrl = await startInternalRendererServer();
  const appIconPath = path.join(__dirname, "..", "build-resources", "icon.ico");
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
      preload: path.join(__dirname, "preload.cjs"),
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
}

app.whenReady().then(async () => {
  await ensureDashboardStateFile();

  ipcMain.handle("coverletters:get-config", async () => getCoverLetterConfig());
  ipcMain.handle("coverletters:list", async () => ({ files: await listCoverLetters() }));
  ipcMain.handle("coverletters:read", async (_event, name: string) => readCoverLetter(name));
  ipcMain.handle("coverletters:save", async (_event, payload: unknown) => saveCoverLetter(payload as never));
  ipcMain.handle("dashboard-state:read", async () => ({
    state: await readDashboardState(),
    savedAt: new Date().toISOString(),
  }));
  ipcMain.handle("dashboard-state:save", async (_event, payload: unknown) => ({
    state: await saveDashboardState(payload),
    savedAt: new Date().toISOString(),
  }));
  ipcMain.handle("external:open-url", async (_event, url: string) => {
    await shell.openExternal(url);
  });

  await createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (internalRendererServer) {
    internalRendererServer.close();
    internalRendererServer = null;
    internalRendererUrl = null;
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
