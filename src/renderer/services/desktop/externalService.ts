import { getDesktopApi } from "./desktopApi";

function isWebUrl(target: string) {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(target);
}

function openWithBrowserFallback(target: string) {
  if (!isWebUrl(target)) {
    return false;
  }

  if (typeof window === "undefined" || typeof window.open !== "function") {
    return false;
  }

  try {
    window.open(target, "_blank", "noopener,noreferrer");
    return true;
  } catch {
    return false;
  }
}

export async function openExternalTarget(target: string) {
  const trimmedTarget = target.trim();
  if (!trimmedTarget) {
    throw new Error("열 대상이 비어 있습니다.");
  }

  const desktopApi = typeof window !== "undefined" ? getDesktopApi() : undefined;

  try {
    if (desktopApi?.external?.openUrl) {
      await desktopApi.external.openUrl(trimmedTarget);
      return;
    }
  } catch (error) {
    if (openWithBrowserFallback(trimmedTarget)) {
      return;
    }

    throw error;
  }

  if (openWithBrowserFallback(trimmedTarget)) {
    return;
  }

  throw new Error("링크나 문서를 열 수 없습니다.");
}

export async function openExternalUrl(url: string) {
  await openExternalTarget(url);
}
