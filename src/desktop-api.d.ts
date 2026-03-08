import type { DesktopApi } from "../shared/desktop-contracts";

export {};

declare global {
  interface Window {
    desktopAPI: DesktopApi;
  }
}
