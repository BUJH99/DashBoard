import type { LucideIcon } from "lucide-react";
import type {
  ApplicationChecklistItem,
  DashboardTab,
} from "../../../../../shared/dashboard-state-contracts";

export type NavSection = {
  title: string;
  items: { id: DashboardTab; label: string; icon: LucideIcon }[];
};

export type ApplicationChecklistRecord = {
  postingId: number;
  items: ApplicationChecklistItem[];
};

export type DashboardStateSync = {
  phase: "idle" | "loading" | "saving" | "error";
  message: string | null;
  lastSavedAt: string | null;
};
