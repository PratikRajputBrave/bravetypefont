import { app, BrowserWindow, ipcMain, protocol, shell, clipboard, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { FontScannerService } from './font-scanner';
import { StoreService } from './store-service';
import { LoggerService } from './logger-service';
import { UpdateService } from './update-service';

let mainWindow: BrowserWindow | null = null;
let fontScanner: FontScannerService;
let storeService: StoreService;
let logger: LoggerService;
let updateService: UpdateService;

// Register custom protocol scheme privileges before app ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-font',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      bypassCSP: true
    }
  }
]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'BraveType - Font Manager Tool',
    backgroundColor: '#FAF7F2',
    frame: true,
    titleBarStyle: 'default',
    autoHideMenuBar: app.isPackaged,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
      devTools: !app.isPackaged
    }
  });

  // Apply menu removal ONLY in production builds (app.isPackaged)
  if (app.isPackaged) {
    mainWindow.removeMenu();
    Menu.setApplicationMenu(null);
  }

  // Security: Block unexpected new windows/popups
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // Security: Block external navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost:5173') && !url.startsWith('file://')) {
      event.preventDefault();
    }
  });

  // Disable DevTools in production
  if (app.isPackaged) {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  logger = new LoggerService();
  fontScanner = new FontScannerService();
  storeService = new StoreService();
  updateService = new UpdateService();

  // Register dynamic protocol for local font files streaming
  protocol.handle('local-font', (request) => {
    try {
      let fontPath = request.url.replace(/^local-font:\/\//, '');
      fontPath = decodeURIComponent(fontPath);

      if (fontPath.startsWith('/') && fontPath.charAt(2) === ':') {
        fontPath = fontPath.slice(1);
      }
      fontPath = path.normalize(fontPath.replace(/\//g, '\\'));

      if (fs.existsSync(fontPath)) {
        const ext = path.extname(fontPath).toLowerCase();
        let mimeType = 'font/ttf';
        if (ext === '.otf') mimeType = 'font/otf';
        else if (ext === '.woff') mimeType = 'font/woff';
        else if (ext === '.woff2') mimeType = 'font/woff2';

        const data = fs.readFileSync(fontPath);
        return new Response(data, {
          headers: { 'Content-Type': mimeType }
        });
      }
    } catch (err) {
      logger.error('Error serving local font via protocol:', err);
    }
    return new Response('Font file not found', { status: 404 });
  });

  // IPC Handlers
  ipcMain.handle('font:get-cached', async () => {
    return fontScanner.getCachedFamilies();
  });

  ipcMain.handle('font:scan', async (_event, customDirs?: string[]) => {
    try {
      const fonts = await fontScanner.scanFonts(customDirs, (progress) => {
        if (mainWindow) {
          mainWindow.webContents.send('font:scan-progress', progress);
        }
      });
      return fonts;
    } catch (err) {
      logger.error('Error scanning Windows fonts:', err);
      return [];
    }
  });

  ipcMain.handle('store:get', async () => {
    return storeService.getStore();
  });

  ipcMain.handle('store:save', async (_event, data: any) => {
    return storeService.saveStore(data);
  });

  ipcMain.handle('store:reset', async () => {
    return storeService.resetStore();
  });

  ipcMain.handle('system:open-location', async (_event, filePath: string) => {
    if (filePath && fs.existsSync(filePath)) {
      shell.showItemInFolder(filePath);
      return true;
    }
    return false;
  });

  ipcMain.handle('system:copy-clipboard', async (_event, text: string) => {
    if (text) {
      clipboard.writeText(text);
      return true;
    }
    return false;
  });

  ipcMain.handle('system:export-backup', async () => {
    if (!mainWindow) return { success: false };
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export BraveType Backup',
      defaultPath: `BraveType-Backup-v1.0.0.json`,
      filters: [{ name: 'JSON Backup', extensions: ['json'] }]
    });

    if (filePath) {
      try {
        const store = storeService.getStore();
        fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
        logger.info(`Exported store backup to ${filePath}`);
        return { success: true, filePath };
      } catch (err) {
        logger.error('Export backup failed:', err);
      }
    }
    return { success: false };
  });

  ipcMain.handle('system:import-backup', async () => {
    if (!mainWindow) return { success: false };
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Import BraveType Backup',
      filters: [{ name: 'JSON Backup', extensions: ['json'] }],
      properties: ['openFile']
    });

    if (filePaths && filePaths.length > 0) {
      try {
        const raw = fs.readFileSync(filePaths[0], 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const restored = storeService.saveStore(parsed);
          logger.info(`Imported store backup from ${filePaths[0]}`);
          return { success: true, data: restored };
        }
      } catch (err) {
        logger.error('Import backup failed:', err);
        return { success: false, error: 'Invalid or corrupted JSON backup file.' };
      }
    }
    return { success: false };
  });

  ipcMain.handle('system:check-updates', async () => {
    return updateService.checkForUpdates();
  });

  ipcMain.handle('system:set-launch-startup', async (_event, enabled: boolean) => {
    try {
      app.setLoginItemSettings({
        openAtLogin: enabled,
        path: process.execPath
      });
      return true;
    } catch (err) {
      logger.error('Failed to set login item settings:', err);
      return false;
    }
  });

  ipcMain.handle('system:get-version', async () => {
    return app.getVersion() || '1.0.0';
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
