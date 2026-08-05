import { useState, useEffect, useMemo, useCallback } from 'react';
import { FontFamily, FontStyle, PreviewMode, CategoryFilter, ScanProgressData } from '../types/font';
import { AppDataStore, Collection, AppSettings } from '../types/store';

const DEFAULT_PREVIEW_TEXT = 'The quick brown fox jumps over the lazy dog';

export function useFontManager() {
  const [fonts, setFonts] = useState<FontFamily[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scanProgress, setScanProgress] = useState<ScanProgressData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>({ type: 'all', name: 'All Fonts' });
  const [selectedFont, setSelectedFont] = useState<FontFamily | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<FontStyle | null>(null);
  const [previewText, setPreviewText] = useState<string>(DEFAULT_PREVIEW_TEXT);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('Sentence');

  // Persistence State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [recentFonts, setRecentFonts] = useState<string[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    previewSize: 28,
    viewMode: 'grid',
    defaultPreviewText: DEFAULT_PREVIEW_TEXT,
    language: 'English',
    customFontDirs: [],
    enableStartupSound: true,
    developerMode: false,
    launchAtStartup: false
  });

  // Fast Startup & Progressive Scan
  const init = useCallback(async () => {
    setLoading(true);
    try {
      if (window.api) {
        // Load persistent store
        const store: AppDataStore = await window.api.getStore();
        if (store) {
          if (store.favorites) setFavorites(store.favorites);
          if (store.collections) setCollections(store.collections);
          if (store.recentFonts) setRecentFonts(store.recentFonts);
          if (store.settings) {
            setSettings({
              previewSize: store.settings.previewSize || 28,
              viewMode: store.settings.viewMode || 'grid',
              defaultPreviewText: store.settings.defaultPreviewText || DEFAULT_PREVIEW_TEXT,
              language: store.settings.language || 'English',
              customFontDirs: store.settings.customFontDirs || [],
              enableStartupSound: store.settings.enableStartupSound !== false,
              developerMode: !!store.settings.developerMode,
              launchAtStartup: !!store.settings.launchAtStartup
            });
            if (store.settings.defaultPreviewText) {
              setPreviewText(store.settings.defaultPreviewText);
            }
          }
        }

        // STEP 1: Load cached metadata instantly if available
        const cached: FontFamily[] = await window.api.getCachedFonts();
        if (cached && cached.length > 0) {
          setFonts(cached);
          setSelectedFont(cached[0]);
          setSelectedStyle(cached[0].sampleStyle);
          setLoading(false); // Display UI immediately!
        }

        // Listen for live background scan progress
        const unsubscribeProgress = window.api.onScanProgress((prog) => {
          setScanProgress(prog);
        });

        // STEP 2: Background scan in non-blocking way
        const scanned: FontFamily[] = await window.api.scanFonts(store?.settings?.customFontDirs || []);
        setFonts(scanned);
        if (scanned.length > 0 && !selectedFont) {
          setSelectedFont(scanned[0]);
          setSelectedStyle(scanned[0].sampleStyle);
        }

        unsubscribeProgress();
      }
    } catch (err) {
      console.error('Error initializing font manager:', err);
    } finally {
      setLoading(false);
      setScanProgress(null);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const persistStore = useCallback((updatedPartial: Partial<AppDataStore>) => {
    if (window.api) {
      window.api.saveStore(updatedPartial);
    }
  }, []);

  // Favorite toggle
  const toggleFavorite = useCallback((fontId: string) => {
    setFavorites(prev => {
      const next = prev.includes(fontId)
        ? prev.filter(id => id !== fontId)
        : [...prev, fontId];
      persistStore({ favorites: next });
      return next;
    });
  }, [persistStore]);

  // Create Collection
  const createCollection = useCallback((name: string) => {
    if (!name.trim()) return;
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      fontIds: [],
      createdAt: Date.now()
    };
    setCollections(prev => {
      const next = [...prev, newCol];
      persistStore({ collections: next });
      return next;
    });
  }, [persistStore]);

  // Duplicate Collection
  const duplicateCollection = useCallback((collectionId: string) => {
    setCollections(prev => {
      const target = prev.find(c => c.id === collectionId);
      if (!target) return prev;
      const dup: Collection = {
        id: `col-${Date.now()}`,
        name: `${target.name} (Copy)`,
        fontIds: [...target.fontIds],
        createdAt: Date.now()
      };
      const next = [...prev, dup];
      persistStore({ collections: next });
      return next;
    });
  }, [persistStore]);

  // Rename Collection
  const renameCollection = useCallback((collectionId: string, newName: string) => {
    if (!newName.trim()) return;
    setCollections(prev => {
      const next = prev.map(c => c.id === collectionId ? { ...c, name: newName.trim() } : c);
      persistStore({ collections: next });
      return next;
    });
  }, [persistStore]);

  // Delete Collection
  const deleteCollection = useCallback((collectionId: string) => {
    setCollections(prev => {
      const next = prev.filter(c => c.id !== collectionId);
      persistStore({ collections: next });
      return next;
    });
    if (selectedCategory.type === 'collection' && selectedCategory.collectionId === collectionId) {
      setSelectedCategory({ type: 'all', name: 'All Fonts' });
    }
  }, [selectedCategory, persistStore]);

  // Sort Collections Alphabetically
  const sortCollectionsAlphabetically = useCallback(() => {
    setCollections(prev => {
      const sorted = [...prev].sort((a, b) => a.name.localeCompare(b.name));
      persistStore({ collections: sorted });
      return sorted;
    });
  }, [persistStore]);

  // Add Font to Collection
  const addFontToCollection = useCallback((fontId: string, collectionId: string) => {
    setCollections(prev => {
      const next = prev.map(c => {
        if (c.id === collectionId && !c.fontIds.includes(fontId)) {
          return { ...c, fontIds: [...c.fontIds, fontId] };
        }
        return c;
      });
      persistStore({ collections: next });
      return next;
    });
  }, [persistStore]);

  // Remove Font from Collection
  const removeFontFromCollection = useCallback((fontId: string, collectionId: string) => {
    setCollections(prev => {
      const next = prev.map(c => {
        if (c.id === collectionId) {
          return { ...c, fontIds: c.fontIds.filter(id => id !== fontId) };
        }
        return c;
      });
      persistStore({ collections: next });
      return next;
    });
  }, [persistStore]);

  // Select Font Family & Record in Recent
  const selectFont = useCallback((family: FontFamily) => {
    setSelectedFont(family);
    setSelectedStyle(family.sampleStyle);
    setRecentFonts(prev => {
      const filtered = prev.filter(id => id !== family.id);
      const next = [family.id, ...filtered].slice(0, 50);
      persistStore({ recentFonts: next });
      return next;
    });
  }, [persistStore]);

  // Select Style
  const selectStyle = useCallback((style: FontStyle) => {
    setSelectedStyle(style);
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...newSettings };
      persistStore({ settings: next });
      if (newSettings.launchAtStartup !== undefined && window.api) {
        window.api.setLaunchAtStartup(newSettings.launchAtStartup);
      }
      return next;
    });
  }, [persistStore]);

  // Backup Export & Import
  const exportBackup = useCallback(async () => {
    if (window.api) {
      return await window.api.exportBackup();
    }
    return { success: false };
  }, []);

  const importBackup = useCallback(async () => {
    if (window.api) {
      const result = await window.api.importBackup();
      if (result.success && result.data) {
        if (result.data.favorites) setFavorites(result.data.favorites);
        if (result.data.collections) setCollections(result.data.collections);
        if (result.data.settings) setSettings(result.data.settings);
      }
      return result;
    }
    return { success: false };
  }, []);

  // Reset Store
  const resetStoreData = useCallback(async () => {
    if (window.api) {
      const reset = await window.api.resetStore();
      if (reset) {
        setFavorites(reset.favorites || []);
        setCollections(reset.collections || []);
        setRecentFonts(reset.recentFonts || []);
        setSettings(reset.settings);
      }
    }
  }, []);

  // Rescan Fonts
  const rescanFonts = useCallback(async () => {
    setLoading(true);
    try {
      if (window.api) {
        const scanned: FontFamily[] = await window.api.scanFonts(settings.customFontDirs);
        setFonts(scanned);
      }
    } finally {
      setLoading(false);
      setScanProgress(null);
    }
  }, [settings.customFontDirs]);

  // Filtered Fonts List computation
  const filteredFonts = useMemo(() => {
    let list = fonts;

    if (selectedCategory.type === 'favorites') {
      list = list.filter(f => favorites.includes(f.id));
    } else if (selectedCategory.type === 'recents') {
      list = list.filter(f => recentFonts.includes(f.id));
      list.sort((a, b) => recentFonts.indexOf(a.id) - recentFonts.indexOf(b.id));
    } else if (selectedCategory.type === 'collection' && selectedCategory.collectionId) {
      const col = collections.find(c => c.id === selectedCategory.collectionId);
      const fontIdsInCol = col ? col.fontIds : [];
      list = list.filter(f => fontIdsInCol.includes(f.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(f => {
        const nameMatch = f.familyName.toLowerCase().includes(q);
        const styleMatch = f.styles.some(s =>
          s.name.toLowerCase().includes(q) ||
          s.weightName.toLowerCase().includes(q) ||
          (s.fileName && s.fileName.toLowerCase().includes(q))
        );
        const postScriptMatch = f.postScriptNames.some(ps => ps.toLowerCase().includes(q));
        return nameMatch || styleMatch || postScriptMatch;
      });
    }

    return list;
  }, [fonts, selectedCategory, favorites, recentFonts, collections, searchQuery]);

  return {
    fonts,
    filteredFonts,
    loading,
    scanProgress,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedFont,
    selectedStyle,
    selectFont,
    selectStyle,
    previewText,
    setPreviewText,
    previewMode,
    setPreviewMode,
    favorites,
    toggleFavorite,
    collections,
    createCollection,
    duplicateCollection,
    renameCollection,
    deleteCollection,
    sortCollectionsAlphabetically,
    addFontToCollection,
    removeFontFromCollection,
    recentFonts,
    settings,
    updateSettings,
    exportBackup,
    importBackup,
    resetStoreData,
    rescanFonts
  };
}
