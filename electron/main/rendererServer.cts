import { createReadStream, promises as fs } from "node:fs";
import { createServer, type Server } from "node:http";
import path from "node:path";

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
    try {
      const requestPath = req.url ? decodeURIComponent(req.url.split("?")[0]) : "/";
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

export function stopInternalRendererServer() {
  if (!internalRendererServer) {
    return;
  }

  internalRendererServer.close();
  internalRendererServer = null;
  internalRendererUrl = null;
}
