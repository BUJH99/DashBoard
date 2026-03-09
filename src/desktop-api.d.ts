import type { DesktopApi } from "../shared/desktop-api-contracts";

export {};

declare global {
  interface Window {
    desktopAPI: DesktopApi;
  }
}
