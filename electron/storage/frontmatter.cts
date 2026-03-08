import type { CoverLetterMeta, CoverLetterRecord } from "../../shared/desktop-contracts.js";
import path from "node:path";
import { requiredMetaKeys } from "./filePaths.cjs";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTags(raw: string | undefined) {
  if (!raw) {
    return [];
  }
  const value = raw.trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseFrontmatter(markdown: string) {
  if (!markdown.startsWith("---\n")) {
    return { meta: {} as Partial<CoverLetterMeta>, body: markdown };
  }

  const endIndex = markdown.indexOf("\n---", 4);
  if (endIndex === -1) {
    return { meta: {} as Partial<CoverLetterMeta>, body: markdown };
  }

  const rawMeta = markdown.slice(4, endIndex);
  const body = markdown.slice(endIndex + 4).replace(/^\n/, "");
  const metaEntries = rawMeta
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) {
        return null;
      }
      return [line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim()] as const;
    })
    .filter((entry): entry is readonly [string, string] => Boolean(entry));

  const meta = metaEntries.reduce<Partial<CoverLetterMeta>>((accumulator, [key, value]) => {
    if (key === "tags") {
      accumulator.tags = parseTags(value);
    } else {
      accumulator[key as keyof CoverLetterMeta] = value as never;
    }
    return accumulator;
  }, {});

  return { meta, body };
}

export function serializeFrontmatter(meta: CoverLetterMeta) {
  const lines = [
    "---",
    `year: ${meta.year}`,
    `companyId: ${meta.companyId}`,
    `companyName: ${meta.companyName}`,
    `companySlug: ${meta.companySlug}`,
    `jobTrack: ${meta.jobTrack}`,
    `docType: ${meta.docType}`,
    `updatedAt: ${meta.updatedAt}`,
  ];

  if (meta.title) {
    lines.push(`title: ${meta.title}`);
  }
  if (meta.status) {
    lines.push(`status: ${meta.status}`);
  }
  if (meta.tags && meta.tags.length > 0) {
    lines.push(`tags: ${meta.tags.join(", ")}`);
  }

  lines.push("---");
  return `${lines.join("\n")}\n`;
}

export function sanitizeFileName(name: string) {
  const safeName = path.basename(name);
  if (safeName !== name || !safeName.endsWith(".md")) {
    throw new Error("Invalid file name.");
  }
  return safeName;
}

export function buildFileName(meta: CoverLetterMeta) {
  return `${meta.year}__${meta.companySlug}__${slugify(meta.jobTrack)}__${slugify(meta.docType)}.md`;
}

export function normalizeMeta(input: Partial<CoverLetterMeta>) {
  return {
    year: /^\d{4}$/.test(input.year ?? "") ? String(input.year) : String(new Date().getFullYear()),
    companyId: String(input.companyId ?? "").trim(),
    companyName: String(input.companyName ?? "").trim(),
    companySlug: slugify(String(input.companySlug ?? input.companyName ?? "").trim()),
    jobTrack: String(input.jobTrack ?? "").trim(),
    docType: slugify(String(input.docType ?? "cover-letter").trim()) || "cover-letter",
    updatedAt: String(input.updatedAt ?? new Date().toISOString()).trim(),
    title: String(input.title ?? "").trim() || undefined,
    status: String(input.status ?? "").trim() || "draft",
    tags: Array.isArray(input.tags) ? input.tags.map((item) => String(item).trim()).filter(Boolean) : [],
  } satisfies CoverLetterMeta;
}

export function validateMeta(meta: CoverLetterMeta) {
  const issues: string[] = [];
  for (const key of requiredMetaKeys) {
    if (!String(meta[key]).trim()) {
      issues.push(`Missing required frontmatter: ${key}`);
    }
  }
  if (!/^\d+$/.test(meta.companyId)) {
    issues.push("companyId must be numeric.");
  }
  if (!/^\d{4}$/.test(meta.year)) {
    issues.push("year must be a 4-digit string.");
  }
  return issues;
}

export function buildRecord(fileName: string, meta: CoverLetterMeta, body: string, lastModified: string): CoverLetterRecord {
  const issues = validateMeta(meta);
  if (buildFileName(meta) !== fileName) {
    issues.push("Filename does not match naming contract.");
  }

  return {
    name: fileName,
    title: meta.title || fileName,
    year: meta.year,
    companyId: /^\d+$/.test(meta.companyId) ? Number(meta.companyId) : null,
    companyName: meta.companyName,
    companySlug: meta.companySlug,
    jobTrack: meta.jobTrack,
    docType: meta.docType,
    updatedAt: meta.updatedAt,
    status: meta.status || "draft",
    tags: meta.tags ?? [],
    lastModified,
    contentPreview: body.slice(0, 160),
    isValid: issues.length === 0,
    issues,
  };
}
