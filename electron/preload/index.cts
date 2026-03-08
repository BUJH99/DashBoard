import type { DesktopApi } from "../../shared/desktop-contracts.js";
import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS } from "../main/ipc/channels.cjs";

const desktopApi: DesktopApi = {
  coverletters: {
    getConfig: () => ipcRenderer.invoke(IPC_CHANNELS.coverletters.getConfig),
    list: () => ipcRenderer.invoke(IPC_CHANNELS.coverletters.list),
    read: (name) => ipcRenderer.invoke(IPC_CHANNELS.coverletters.read, name),
    save: (payload) => ipcRenderer.invoke(IPC_CHANNELS.coverletters.save, payload),
  },
  dashboardState: {
    read: () => ipcRenderer.invoke(IPC_CHANNELS.dashboardState.read),
    save: (payload) => ipcRenderer.invoke(IPC_CHANNELS.dashboardState.save, payload),
  },
  external: {
    openUrl: (url) => ipcRenderer.invoke(IPC_CHANNELS.external.openUrl, url),
  },
};

contextBridge.exposeInMainWorld("desktopAPI", desktopApi);
