export interface Collection {
  id: string;
  name: string;
  fontIds: string[]; // Font Family IDs
  createdAt: number;
}

export interface AppSettings {
  previewSize: number; // in px
  viewMode: 'grid' | 'list';
  defaultPreviewText: string;
  language: string;
  customFontDirs: string[];
  enableStartupSound: boolean;
  developerMode: boolean;
  launchAtStartup: boolean;
}

export interface AppDataStore {
  favorites: string[]; // List of font family IDs
  collections: Collection[];
  recentFonts: string[]; // List of recently viewed font family IDs
  settings: AppSettings;
}
