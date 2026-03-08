import type {
  CoverLetterConfig,
  CoverLetterListResponse,
  CoverLetterReadResult,
  CoverLetterSavePayload,
  CoverLetterSaveResponse,
} from "../../../../shared/desktop-contracts";
import { getDesktopApi } from "./desktopApi";

export function getCoverLetterConfig(): Promise<CoverLetterConfig> {
  return getDesktopApi().coverletters.getConfig();
}

export function listCoverLetters(): Promise<CoverLetterListResponse> {
  return getDesktopApi().coverletters.list();
}

export function readCoverLetter(name: string): Promise<CoverLetterReadResult> {
  return getDesktopApi().coverletters.read(name);
}

export function saveCoverLetter(payload: CoverLetterSavePayload): Promise<CoverLetterSaveResponse> {
  return getDesktopApi().coverletters.save(payload);
}
