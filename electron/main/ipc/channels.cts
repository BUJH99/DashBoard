export const IPC_CHANNELS = {
  coverletters: {
    getConfig: "coverletters:get-config",
    list: "coverletters:list",
    read: "coverletters:read",
    save: "coverletters:save",
  },
  dashboardState: {
    read: "dashboard-state:read",
    save: "dashboard-state:save",
  },
  external: {
    openUrl: "external:open-url",
  },
} as const;
