import type { DesktopApi } from "../../../../shared/desktop-contracts";

export function getDesktopApi(): DesktopApi {
  return window.desktopAPI;
}
