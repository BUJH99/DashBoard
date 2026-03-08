import { promises as fs } from "node:fs";
import path from "node:path";

const workspaceRoot = process.defaultApp ? path.resolve(__dirname, "..") : path.resolve(path.dirname(process.execPath), "..");
const coverLettersDir = path.resolve(workspaceRoot, "coverletters_md");
const dashboardStatePath = path.resolve(workspaceRoot, "dashboard_local_state.json");
const requiredMetaKeys = ["companyId", "companyName", "companySlug", "jobTrack", "docType", "updatedAt"] as const;

type CoverLetterMeta = {
  year: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  jobTrack: string;
  docType: string;
  updatedAt: string;
  title?: string;
  status?: string;
  tags?: string[];
};

type CoverLetterRecord = {
  name: string;
  title: string;
  year: string;
  companyId: number | null;
  companyName: string;
  companySlug: string;
  jobTrack: string;
  docType: string;
  updatedAt: string;
  status: string;
  tags: string[];
  lastModified: string;
  contentPreview: string;
  isValid: boolean;
  issues: string[];
};

type SavePayload = {
  originalName?: string | null;
  meta: Partial<CoverLetterMeta>;
  content: string;
};

type DashboardLocalStatePayload = {
  ui: Record<string, unknown>;
  location: Record<string, unknown>;
  checklists: Record<string, unknown>;
  interview: Record<string, unknown>;
  jdScanner: Record<string, unknown>;
  overview: Record<string, unknown>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function buildDefaultDashboardStateFile(): DashboardLocalStatePayload {
  return {
    ui: {
      activeTab: "overview",
      postingQuery: "",
      postingCompanyFilter: "all",
      selectedCompanyId: 1,
      selectedOfferA: "삼성전자 (DS)",
      selectedOfferB: "리벨리온",
      portfolioSubTab: "showcase",
      selectedChecklistPostingId: 101,
      selectedEssayId: 301,
      industryFilter: "All",
      flashcardMode: "default",
      activeFlashcardIndex: 0,
      selectedScheduleId: 2,
      selectedCoverLetterName: null,
    },
    location: {
      routeOrigin: "집",
      routeDestination: "삼성전자 (DS/LSI)",
      companyCommuteNotes: {},
    },
    checklists: {
      applicationChecklists: {},
    },
    interview: {
      flashcardFeedback: {},
    },
    jdScanner: {
      text: "우대사항\n- Verilog / SystemVerilog 기반 RTL 설계 경험\n- UVM 검증 환경 이해\n- AMBA AXI, FPGA 프로토타이핑 경험\n- 저전력 설계 또는 CDC 분석 경험",
    },
    overview: {
      taskChecked: {},
    },
  };
}

async function ensureCoverLettersDir() {
  await fs.mkdir(coverLettersDir, { recursive: true });
}

export async function ensureDashboardStateFile() {
  try {
    await fs.access(dashboardStatePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    await fs.writeFile(dashboardStatePath, JSON.stringify(buildDefaultDashboardStateFile(), null, 2), "utf8");
  }
}

function parseTags(raw: string | undefined) {
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

function parseFrontmatter(markdown: string) {
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

function serializeFrontmatter(meta: CoverLetterMeta) {
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

function sanitizeFileName(name: string) {
  const safeName = path.basename(name);
  if (safeName !== name || !safeName.endsWith(".md")) {
    throw new Error("Invalid file name.");
  }
  return safeName;
}

function buildFileName(meta: CoverLetterMeta) {
  return `${meta.year}__${meta.companySlug}__${slugify(meta.jobTrack)}__${slugify(meta.docType)}.md`;
}

function normalizeMeta(input: Partial<CoverLetterMeta>) {
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

function validateMeta(meta: CoverLetterMeta) {
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

function buildRecord(fileName: string, meta: CoverLetterMeta, body: string, lastModified: string): CoverLetterRecord {
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

export async function getCoverLetterConfig() {
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
  const names = (await fs.readdir(coverLettersDir)).filter((name) => name.toLowerCase().endsWith(".md")).sort();
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

export async function readCoverLetter(name: string) {
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

export async function saveCoverLetter(payload: SavePayload) {
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

  await fs.writeFile(targetPath, `${serializeFrontmatter(meta)}\n${String(payload.content ?? "").trimStart()}`, "utf8");

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

export async function readDashboardState() {
  await ensureDashboardStateFile();
  const defaults = buildDefaultDashboardStateFile();
  const raw = await fs.readFile(dashboardStatePath, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) {
      return defaults;
    }
    return {
      ui: { ...defaults.ui, ...(isRecord(parsed.ui) ? parsed.ui : {}) },
      location: { ...defaults.location, ...(isRecord(parsed.location) ? parsed.location : {}) },
      checklists: { ...defaults.checklists, ...(isRecord(parsed.checklists) ? parsed.checklists : {}) },
      interview: { ...defaults.interview, ...(isRecord(parsed.interview) ? parsed.interview : {}) },
      jdScanner: { ...defaults.jdScanner, ...(isRecord(parsed.jdScanner) ? parsed.jdScanner : {}) },
      overview: { ...defaults.overview, ...(isRecord(parsed.overview) ? parsed.overview : {}) },
    };
  } catch {
    await fs.writeFile(dashboardStatePath, JSON.stringify(defaults, null, 2), "utf8");
    return defaults;
  }
}

export async function saveDashboardState(payload: unknown) {
  const defaults = buildDefaultDashboardStateFile();
  const nextState = isRecord(payload)
    ? {
        ui: { ...defaults.ui, ...(isRecord(payload.ui) ? payload.ui : {}) },
        location: { ...defaults.location, ...(isRecord(payload.location) ? payload.location : {}) },
        checklists: { ...defaults.checklists, ...(isRecord(payload.checklists) ? payload.checklists : {}) },
        interview: { ...defaults.interview, ...(isRecord(payload.interview) ? payload.interview : {}) },
        jdScanner: { ...defaults.jdScanner, ...(isRecord(payload.jdScanner) ? payload.jdScanner : {}) },
        overview: { ...defaults.overview, ...(isRecord(payload.overview) ? payload.overview : {}) },
      }
    : defaults;

  await fs.writeFile(dashboardStatePath, JSON.stringify(nextState, null, 2), "utf8");
  return nextState;
}
