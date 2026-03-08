export {};

declare global {
  interface Window {
    desktopAPI: {
      coverletters: {
        getConfig(): Promise<{
          folderName: string;
          relativePath: string;
          namingPattern: string;
          requiredFrontmatter: string[];
        }>;
        list(): Promise<{ files: unknown[] }>;
        read(name: string): Promise<unknown>;
        save(payload: unknown): Promise<unknown>;
      };
      dashboardState: {
        read(): Promise<unknown>;
        save(payload: unknown): Promise<unknown>;
      };
      external: {
        openUrl(url: string): Promise<void>;
      };
    };
  }
}
