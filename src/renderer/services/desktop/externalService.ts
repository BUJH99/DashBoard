import { getDesktopApi } from "./desktopApi";

function openWithBrowserFallback(url: string) {
  if (typeof window === "undefined" || typeof window.open !== "function") {
    return false;
  }

  try {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  } catch {
    return false;
  }
}

export async function openExternalUrl(url: string) {
  const desktopApi = typeof window !== "undefined" ? getDesktopApi() : undefined;

  try {
    if (desktopApi?.external?.openUrl) {
      await desktopApi.external.openUrl(url);
      return;
    }
  } catch (error) {
    if (openWithBrowserFallback(url)) {
      return;
    }

    throw error;
  }

  if (openWithBrowserFallback(url)) {
    return;
  }

  throw new Error("외부 브라우저를 열 수 없습니다.");
}
