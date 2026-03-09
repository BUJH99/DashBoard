import type {
  CoverLetterConfig,
  CoverLetterReadResult,
  CoverLetterSavePayload,
  CoverLetterSaveResponse,
} from "../../shared/cover-letter-contracts.js";
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

type FileSystemApi = Pick<
  typeof fs,
  "access" | "mkdir" | "readdir" | "readFile" | "stat" | "unlink" | "writeFile"
>;

export class CoverLetterFileRepository {
  constructor(
    private readonly directoryPath: string,
    private readonly fileSystem: FileSystemApi = fs,
  ) {}

  async ensureDirectory() {
    await this.fileSystem.mkdir(this.directoryPath, { recursive: true });
  }

  async getConfig(): Promise<CoverLetterConfig> {
    await this.ensureDirectory();
    return {
      folderName: "coverletters_md",
      relativePath: "coverletters_md",
      namingPattern: "{year}__{companySlug}__{jobTrackSlug}__{docType}.md",
      requiredFrontmatter: [...requiredMetaKeys, "year"],
    };
  }

  async list() {
    await this.ensureDirectory();
    const names = (await this.fileSystem.readdir(this.directoryPath))
      .filter((name) => name.toLowerCase().endsWith(".md"))
      .sort();

    const records = await Promise.all(
      names.map(async (name) => {
        const filePath = path.resolve(this.directoryPath, sanitizeFileName(name));
        const [content, stat] = await Promise.all([
          this.fileSystem.readFile(filePath, "utf8"),
          this.fileSystem.stat(filePath),
        ]);
        const parsed = parseFrontmatter(content);
        return buildRecord(name, normalizeMeta(parsed.meta), parsed.body, stat.mtime.toISOString());
      }),
    );

    return records.sort((left, right) => right.lastModified.localeCompare(left.lastModified));
  }

  async read(name: string): Promise<CoverLetterReadResult> {
    await this.ensureDirectory();
    const safeName = sanitizeFileName(name);
    const filePath = path.resolve(this.directoryPath, safeName);
    const [content, stat] = await Promise.all([
      this.fileSystem.readFile(filePath, "utf8"),
      this.fileSystem.stat(filePath),
    ]);
    const parsed = parseFrontmatter(content);
    const meta = normalizeMeta(parsed.meta);

    return {
      file: buildRecord(safeName, meta, parsed.body, stat.mtime.toISOString()),
      content: parsed.body,
      meta,
    };
  }

  async save(payload: CoverLetterSavePayload): Promise<CoverLetterSaveResponse> {
    await this.ensureDirectory();
    const meta = normalizeMeta(payload.meta);
    const issues = validateMeta(meta);
    if (issues.length > 0) {
      throw new Error(issues.join(" "));
    }

    const fileName = buildFileName(meta);
    const targetPath = path.resolve(this.directoryPath, sanitizeFileName(fileName));
    const originalName = payload.originalName ? sanitizeFileName(payload.originalName) : null;
    const originalPath = originalName ? path.resolve(this.directoryPath, originalName) : null;

    try {
      await this.fileSystem.access(targetPath);
      if (originalName !== fileName) {
        throw new Error("A file with the same naming contract already exists.");
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    await this.fileSystem.writeFile(
      targetPath,
      `${serializeFrontmatter(meta)}\n${String(payload.content ?? "").trimStart()}`,
      "utf8",
    );

    if (originalPath && originalName && originalName !== fileName) {
      try {
        await this.fileSystem.unlink(originalPath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }
    }

    return {
      savedName: fileName,
      files: await this.list(),
      detail: await this.read(fileName),
    };
  }
}

const coverLetterRepository = new CoverLetterFileRepository(coverLettersDir);

export async function getCoverLetterConfig(): Promise<CoverLetterConfig> {
  return coverLetterRepository.getConfig();
}

export async function listCoverLetters() {
  return coverLetterRepository.list();
}

export async function readCoverLetter(name: string): Promise<CoverLetterReadResult> {
  return coverLetterRepository.read(name);
}

export async function saveCoverLetter(payload: CoverLetterSavePayload): Promise<CoverLetterSaveResponse> {
  return coverLetterRepository.save(payload);
}
