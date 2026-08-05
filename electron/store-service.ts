import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export interface CollectionData {
  id: string;
  name: string;
  fontIds: string[];
  createdAt: number;
}

export interface SettingsData {
  previewSize: number;
  viewMode: 'grid' | 'list';
  defaultPreviewText: string;
  language: string;
  customFontDirs: string[];
  enableStartupSound: boolean;
  developerMode: boolean;
  launchAtStartup: boolean;
}

export interface StoreData {
  favorites: string[];
  collections: CollectionData[];
  recentFonts: string[];
  settings: SettingsData;
}

const DEFAULT_STORE: StoreData = {
  favorites: [],
  collections: [
    { id: 'col-branding', name: 'Branding', fontIds: [], createdAt: Date.now() },
    { id: 'col-ui', name: 'UI & Web', fontIds: [], createdAt: Date.now() },
    { id: 'col-gaming', name: 'Gaming', fontIds: [], createdAt: Date.now() },
    { id: 'col-luxury', name: 'Luxury', fontIds: [], createdAt: Date.now() },
    { id: 'col-logo', name: 'Logo Fonts', fontIds: [], createdAt: Date.now() },
    { id: 'col-personal', name: 'Personal', fontIds: [], createdAt: Date.now() }
  ],
  recentFonts: [],
  settings: {
    previewSize: 28,
    viewMode: 'grid',
    defaultPreviewText: 'The quick brown fox jumps over the lazy dog',
    language: 'English',
    customFontDirs: [],
    enableStartupSound: true,
    developerMode: false,
    launchAtStartup: false
  }
};

export class StoreService {
  private filePath: string;
  private data: StoreData;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.filePath = path.join(userDataPath, 'store.json');
    this.data = this.loadStore();
  }

  private loadStore(): StoreData {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);

        // Validate JSON structure
        if (parsed && typeof parsed === 'object') {
          return {
            favorites: Array.isArray(parsed.favorites) ? parsed.favorites : DEFAULT_STORE.favorites,
            collections: Array.isArray(parsed.collections) ? parsed.collections : DEFAULT_STORE.collections,
            recentFonts: Array.isArray(parsed.recentFonts) ? parsed.recentFonts : DEFAULT_STORE.recentFonts,
            settings: {
              ...DEFAULT_STORE.settings,
              ...(parsed.settings || {})
            }
          };
        }
      }
    } catch (err) {
      console.error('Failed to read store.json, recovering with default store:', err);
    }
    return DEFAULT_STORE;
  }

  public getStore(): StoreData {
    return this.data;
  }

  public saveStore(updatedData: Partial<StoreData>): StoreData {
    this.data = {
      ...this.data,
      ...updatedData
    };
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write store.json:', err);
    }
    return this.data;
  }

  public resetStore(): StoreData {
    this.data = DEFAULT_STORE;
    this.saveStore(DEFAULT_STORE);
    return this.data;
  }
}
