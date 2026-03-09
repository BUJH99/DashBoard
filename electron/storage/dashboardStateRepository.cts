import type { DashboardLocalState } from "../../shared/dashboard-state-contracts.js";
import {
  buildDefaultDashboardState,
  hydrateDashboardState,
} from "../../shared/dashboard-state.js";
import { promises as fs } from "node:fs";
import { dashboardStatePath } from "./filePaths.cjs";

type FileSystemApi = Pick<typeof fs, "access" | "readFile" | "writeFile">;

export class DashboardStateFileRepository {
  constructor(
    private readonly filePath: string,
    private readonly fileSystem: FileSystemApi = fs,
  ) {}

  async ensureFile() {
    try {
      await this.fileSystem.access(this.filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }

      await this.fileSystem.writeFile(
        this.filePath,
        JSON.stringify(buildDefaultDashboardState(), null, 2),
        "utf8",
      );
    }
  }

  async read() {
    await this.ensureFile();
    const raw = await this.fileSystem.readFile(this.filePath, "utf8");
    try {
      return hydrateDashboardState(JSON.parse(raw) as unknown);
    } catch {
      const defaults = buildDefaultDashboardState();
      await this.fileSystem.writeFile(this.filePath, JSON.stringify(defaults, null, 2), "utf8");
      return defaults;
    }
  }

  async save(payload: unknown) {
    const nextState = hydrateDashboardState(payload);
    await this.fileSystem.writeFile(this.filePath, JSON.stringify(nextState, null, 2), "utf8");
    return nextState;
  }
}

const dashboardStateRepository = new DashboardStateFileRepository(dashboardStatePath);

export function buildDefaultDashboardStateFile(): DashboardLocalState {
  return buildDefaultDashboardState();
}

export async function ensureDashboardStateFile() {
  await dashboardStateRepository.ensureFile();
}

export async function readDashboardState() {
  return dashboardStateRepository.read();
}

export async function saveDashboardState(payload: unknown) {
  return dashboardStateRepository.save(payload);
}
