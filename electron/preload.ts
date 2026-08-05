import { contextBridge, ipcRenderer } from 'electron';

export const api = {
  getCachedFonts: () => ipcRenderer.invoke('font:get-cached'),
  scanFonts: (customDirs?: string[]) => ipcRenderer.invoke('font:scan', customDirs),
  onScanProgress: (callback: (data: { count: number; total: number; statusText: string; currentFamily?: string }) => void) => {
    const handler = (_event: any, data: any) => callback(data);
    ipcRenderer.on('font:scan-progress', handler);
    return () => ipcRenderer.removeListener('font:scan-progress', handler);
  },
  getStore: () => ipcRenderer.invoke('store:get'),
  saveStore: (data: any) => ipcRenderer.invoke('store:save', data),
  resetStore: () => ipcRenderer.invoke('store:reset'),
  openFontLocation: (filePath: string) => ipcRenderer.invoke('system:open-location', filePath),
  copyToClipboard: (text: string) => ipcRenderer.invoke('system:copy-clipboard', text),
  exportBackup: () => ipcRenderer.invoke('system:export-backup'),
  importBackup: () => ipcRenderer.invoke('system:import-backup'),
  checkForUpdates: () => ipcRenderer.invoke('system:check-updates'),
  setLaunchAtStartup: (enabled: boolean) => ipcRenderer.invoke('system:set-launch-startup', enabled),
  getAppVersion: () => ipcRenderer.invoke('system:get-version')
};

contextBridge.exposeInMainWorld('api', api);

export type ElectronAPI = typeof api;
