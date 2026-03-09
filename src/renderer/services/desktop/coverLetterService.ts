import type {
  CoverLetterConfig,
  CoverLetterDeletePayload,
  CoverLetterDeleteResponse,
  CoverLetterListResponse,
  CoverLetterReadResult,
  CoverLetterSavePayload,
  CoverLetterSaveResponse,
} from "../../../../shared/cover-letter-contracts";
import { getDesktopApi } from "./desktopApi";

async function fetchCoverLetterApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/coverletters/${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "자기소개서 API 요청에 실패했습니다.");
  }

  return response.json() as Promise<T>;
}

export function getCoverLetterConfig(): Promise<CoverLetterConfig> {
  const desktopApi = getDesktopApi();
  if (desktopApi?.coverletters) {
    return desktopApi.coverletters.getConfig();
  }

  return fetchCoverLetterApi<CoverLetterConfig>("config");
}

export function listCoverLetters(): Promise<CoverLetterListResponse> {
  const desktopApi = getDesktopApi();
  if (desktopApi?.coverletters) {
    return desktopApi.coverletters.list();
  }

  return fetchCoverLetterApi<CoverLetterListResponse>("list");
}

export function readCoverLetter(name: string): Promise<CoverLetterReadResult> {
  const desktopApi = getDesktopApi();
  if (desktopApi?.coverletters) {
    return desktopApi.coverletters.read(name);
  }

  return fetchCoverLetterApi<CoverLetterReadResult>(`read?name=${encodeURIComponent(name)}`);
}

export function saveCoverLetter(payload: CoverLetterSavePayload): Promise<CoverLetterSaveResponse> {
  const desktopApi = getDesktopApi();
  if (desktopApi?.coverletters) {
    return desktopApi.coverletters.save(payload);
  }

  return fetchCoverLetterApi<CoverLetterSaveResponse>("save", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteCoverLetters(
  payload: CoverLetterDeletePayload,
): Promise<CoverLetterDeleteResponse> {
  const desktopApi = getDesktopApi();
  if (desktopApi?.coverletters) {
    return desktopApi.coverletters.remove(payload);
  }

  return fetchCoverLetterApi<CoverLetterDeleteResponse>("delete", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
