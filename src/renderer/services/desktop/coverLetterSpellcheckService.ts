import type {
  CoverLetterSpellcheckRequest,
  CoverLetterSpellcheckResponse,
} from "../../../../shared/cover-letter-spellcheck-service-contracts";
import { getDesktopApi } from "./desktopApi";

async function fetchCoverLetterSpellcheckApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/cover-letter-spellcheck/${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "자기소개서 맞춤법 검사 API 요청에 실패했습니다.");
  }

  return response.json() as Promise<T>;
}

export function checkCoverLetterSpelling(
  payload: CoverLetterSpellcheckRequest,
): Promise<CoverLetterSpellcheckResponse> {
  const desktopApi = getDesktopApi();

  if (desktopApi?.coverLetterSpellcheck) {
    return desktopApi.coverLetterSpellcheck.check(payload);
  }

  return fetchCoverLetterSpellcheckApi<CoverLetterSpellcheckResponse>("check", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
