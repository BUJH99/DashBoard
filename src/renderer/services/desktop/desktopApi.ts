import type { DesktopApi } from "../../../../shared/desktop-api-contracts";

export function getDesktopApi(): DesktopApi {
  return window.desktopAPI;
}
