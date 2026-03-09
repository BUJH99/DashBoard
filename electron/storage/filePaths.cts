import path from "node:path";

export const workspaceRoot = process.defaultApp
  ? path.resolve(__dirname, "..", "..", "..")
  : path.dirname(process.execPath);

export const coverLettersDir = path.resolve(workspaceRoot, "coverletters_md");
export const dashboardStatePath = path.resolve(workspaceRoot, "dashboard_local_state.json");
export const requiredMetaKeys = [
  "companyId",
  "companyName",
  "companySlug",
  "jobTrack",
  "docType",
  "updatedAt",
] as const;
