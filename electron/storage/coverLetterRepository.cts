import type {
  CoverLetterConfig,
  CoverLetterReadResult,
  CoverLetterSavePayload,
  CoverLetterSaveResponse,
} from "../../shared/desktop-contracts.js";
import { promises as fs } from "node:fs";
import path from "node:path";
import { coverLettersDir, requiredMetaKeys } from "./filePaths.cjs";
import {
  buildFileName,
  buildRecord,
  normalizeMeta,
  parseFrontmatter,
  sanitizeFileName,
  serializeFrontmatter,
  validateMeta,
} from "./frontmatter.cjs";

async function ensureCoverLettersDir() {
  await fs.mkdir(coverLettersDir, { recursive: true });
}

export async function getCoverLetterConfig(): Promise<CoverLetterConfig> {
  await ensureCoverLettersDir();
  return {
    folderName: "coverletters_md",
    relativePath: "coverletters_md",
    namingPattern: "{year}__{companySlug}__{jobTrackSlug}__{docType}.md",
    requiredFrontmatter: [...requiredMetaKeys, "year"],
  };
}

export async function listCoverLetters() {
  await ensureCoverLettersDir();
  const names = (await fs.readdir(coverLettersDir))
    .filter((name) => name.toLowerCase().endsWith(".md"))
    .sort();
  const records = await Promise.all(
    names.map(async (name) => {
      const filePath = path.resolve(coverLettersDir, sanitizeFileName(name));
      const [content, stat] = await Promise.all([fs.readFile(filePath, "utf8"), fs.stat(filePath)]);
      const parsed = parseFrontmatter(content);
      return buildRecord(name, normalizeMeta(parsed.meta), parsed.body, stat.mtime.toISOString());
    }),
  );

  return records.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
}

export async function readCoverLetter(name: string): Promise<CoverLetterReadResult> {
  await ensureCoverLettersDir();
  const safeName = sanitizeFileName(name);
  const filePath = path.resolve(coverLettersDir, safeName);
  const [content, stat] = await Promise.all([fs.readFile(filePath, "utf8"), fs.stat(filePath)]);
  const parsed = parseFrontmatter(content);
  const meta = normalizeMeta(parsed.meta);
  return {
    file: buildRecord(safeName, meta, parsed.body, stat.mtime.toISOString()),
    content: parsed.body,
    meta,
  };
}

export async function saveCoverLetter(payload: CoverLetterSavePayload): Promise<CoverLetterSaveResponse> {
  await ensureCoverLettersDir();
  const meta = normalizeMeta(payload.meta);
  const issues = validateMeta(meta);
  if (issues.length > 0) {
    throw new Error(issues.join(" "));
  }

  const fileName = buildFileName(meta);
  const targetPath = path.resolve(coverLettersDir, sanitizeFileName(fileName));
  const originalName = payload.originalName ? sanitizeFileName(payload.originalName) : null;
  const originalPath = originalName ? path.resolve(coverLettersDir, originalName) : null;

  try {
    await fs.access(targetPath);
    if (originalName !== fileName) {
      throw new Error("A file with the same naming contract already exists.");
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  await fs.writeFile(
    targetPath,
    `${serializeFrontmatter(meta)}\n${String(payload.content ?? "").trimStart()}`,
    "utf8",
  );

  if (originalPath && originalName && originalName !== fileName) {
    try {
      await fs.unlink(originalPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  return {
    savedName: fileName,
    files: await listCoverLetters(),
    detail: await readCoverLetter(fileName),
  };
}
