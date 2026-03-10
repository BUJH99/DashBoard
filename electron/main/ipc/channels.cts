export const IPC_CHANNELS = {
  coverletters: {
    getConfig: "coverletters:get-config",
    list: "coverletters:list",
    read: "coverletters:read",
    save: "coverletters:save",
    remove: "coverletters:remove",
  },
  coverLetterSpellcheck: {
    check: "cover-letter-spellcheck:check",
  },
  dashboardState: {
    read: "dashboard-state:read",
    save: "dashboard-state:save",
  },
  industryNews: {
    crawl: "industry-news:crawl",
  },
  external: {
    openUrl: "external:open-url",
  },
} as const;
