import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktopAPI", {
  coverletters: {
    getConfig: () => ipcRenderer.invoke("coverletters:get-config"),
    list: () => ipcRenderer.invoke("coverletters:list"),
    read: (name: string) => ipcRenderer.invoke("coverletters:read", name),
    save: (payload: unknown) => ipcRenderer.invoke("coverletters:save", payload),
  },
  dashboardState: {
    read: () => ipcRenderer.invoke("dashboard-state:read"),
    save: (payload: unknown) => ipcRenderer.invoke("dashboard-state:save", payload),
  },
  external: {
    openUrl: (url: string) => ipcRenderer.invoke("external:open-url", url),
  },
});
