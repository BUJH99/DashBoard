import { getDesktopApi } from "./desktopApi";

export function openExternalUrl(url: string) {
  return getDesktopApi().external.openUrl(url);
}
