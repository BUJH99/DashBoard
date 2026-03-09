import { createReadStream, promises as fs } from "node:fs";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import path from "node:path";
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

let internalRendererServer: Server | null = null;
let internalRendererUrl: string | null = null;

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

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

export function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url) && !(internalRendererUrl && url.startsWith(internalRendererUrl));
}

export async function startInternalRendererServer() {
  if (internalRendererServer && internalRendererUrl) {
    return internalRendererUrl;
  }

  const distRoot = path.join(__dirname, "..", "..", "..", "dist");
  await fs.access(path.join(distRoot, "index.html"));

  internalRendererServer = createServer(async (req, res) => {
    let requestPath = "/";

    try {
      requestPath = req.url ? decodeURIComponent(req.url.split("?")[0]) : "/";

      if (requestPath === "/api/coverletters/config" && req.method === "GET") {
        sendJson(res, 200, await getCoverLetterConfig());
        return;
      }

      if (requestPath === "/api/coverletters/list" && req.method === "GET") {
        sendJson(res, 200, { files: await listCoverLetters() });
        return;
      }

      if (requestPath === "/api/coverletters/read" && req.method === "GET") {
        const requestUrl = new URL(req.url ?? "", "http://127.0.0.1");
        const name = requestUrl.searchParams.get("name");

        if (!name) {
          sendJson(res, 400, { message: "name query is required." });
          return;
        }

        sendJson(res, 200, await readCoverLetter(name));
        return;
      }

      if (requestPath === "/api/coverletters/save" && req.method === "POST") {
        const payload = await readJsonBody(req);
        sendJson(res, 200, await saveCoverLetter(payload));
        return;
      }

      if (requestPath === "/api/coverletters/delete" && req.method === "POST") {
        const payload = await readJsonBody(req);
        sendJson(res, 200, await removeCoverLetters(payload));
        return;
      }

      if (requestPath === "/api/dashboard-state/read" && req.method === "GET") {
        sendJson(res, 200, {
          state: await readDashboardState(),
          savedAt: new Date().toISOString(),
        });
        return;
      }

      if (requestPath === "/api/dashboard-state/save" && req.method === "POST") {
        const payload = await readJsonBody(req);
        sendJson(res, 200, {
          state: await saveDashboardState(payload),
          savedAt: new Date().toISOString(),
        });
        return;
      }

      const normalizedPath = req.url === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal Server Error";

      if (requestPath?.startsWith("/api/")) {
        sendJson(res, 500, { message });
        return;
      }

      res.statusCode = 500;
      res.end(message);
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

export function stopInternalRendererServer() {
  if (!internalRendererServer) {
    return;
  }

  internalRendererServer.close();
  internalRendererServer = null;
  internalRendererUrl = null;
}
