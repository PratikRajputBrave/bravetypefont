/// <reference types="vite/client" />

interface Window {
  api: {
    getCachedFonts: () => Promise<any[]>;
    scanFonts: (customDirs?: string[]) => Promise<any[]>;
    onScanProgress: (callback: (data: { count: number; total: number; statusText: string; currentFamily?: string }) => void) => () => void;
    getStore: () => Promise<any>;
    saveStore: (data: any) => Promise<any>;
    resetStore: () => Promise<any>;
    openFontLocation: (filePath: string) => Promise<boolean>;
    copyToClipboard: (text: string) => Promise<boolean>;
    exportBackup: () => Promise<{ success: boolean; filePath?: string }>;
    importBackup: () => Promise<{ success: boolean; data?: any; error?: string }>;
    checkForUpdates: () => Promise<{ hasUpdate: boolean; currentVersion: string; latestVersion?: string; releaseNotes?: string }>;
    setLaunchAtStartup: (enabled: boolean) => Promise<boolean>;
    getAppVersion: () => Promise<string>;
  };
}
