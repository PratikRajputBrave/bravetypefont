import React, { useState, useEffect } from 'react';
import { useFontManager } from '../../hooks/useFontManager';
import { Sidebar } from '../Sidebar/Sidebar';
import { HeaderBar } from '../CenterArea/HeaderBar';
import { FontGrid } from '../CenterArea/FontGrid';
import { FontInspector } from '../RightPanel/FontInspector';
import { FontDetailModal } from '../Modals/FontDetailModal';
import { SettingsModal } from '../Modals/SettingsModal';
import { SplashScreen } from '../Splash/SplashScreen';

export const AppLayout: React.FC = () => {
  const {
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
    recentFonts,
    settings,
    updateSettings,
    exportBackup,
    importBackup,
    resetStoreData,
    rescanFonts,
  } = useFontManager();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + F -> Focus search input
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        if (input) input.focus();
      }
      // Ctrl + R -> Rescan fonts
      else if (e.ctrlKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        rescanFonts();
      }
      // Ctrl + , -> Open Settings
      else if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
      // Esc -> Close Modals
      else if (e.key === 'Escape') {
        setIsDetailModalOpen(false);
        setIsSettingsOpen(false);
      }
      // Enter -> Open Font Details
      else if (e.key === 'Enter' && !isDetailModalOpen && !isSettingsOpen && selectedFont) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsDetailModalOpen(true);
        }
      }
      // Delete -> Delete Collection if selected
      else if (e.key === 'Delete' && selectedCategory.type === 'collection' && selectedCategory.collectionId) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const targetCol = collections.find(c => c.id === selectedCategory.collectionId);
          if (targetCol && confirm(`Delete collection "${targetCol.name}"?`)) {
            deleteCollection(selectedCategory.collectionId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rescanFonts, selectedFont, isDetailModalOpen, isSettingsOpen, selectedCategory, collections, deleteCollection]);

  return (
    <div className="relative flex h-screen w-screen bg-paper-bg overflow-hidden text-charcoal-main font-sans select-none antialiased">
      {/* Premium Startup Splash Screen */}
      {!isSplashFinished && (
        <SplashScreen
          onComplete={() => setIsSplashFinished(true)}
          scanProgress={scanProgress}
          enableStartupSound={settings.enableStartupSound !== false}
          isDataLoaded={!loading || fonts.length > 0}
        />
      )}

      {/* LEFT SIDEBAR */}
      <Sidebar
        fonts={fonts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        favoritesCount={favorites.length}
        recentCount={recentFonts.length}
        collections={collections}
        onCreateCollection={createCollection}
        onDuplicateCollection={duplicateCollection}
        onRenameCollection={renameCollection}
        onDeleteCollection={deleteCollection}
        onSortCollections={sortCollectionsAlphabetically}
        onDropFontToCollection={addFontToCollection}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRescan={rescanFonts}
        isLoading={loading}
      />

      {/* CENTER MAIN AREA */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-paper-bg overflow-hidden">
        <HeaderBar
          category={selectedCategory}
          fontCount={filteredFonts.length}
          previewText={previewText}
          onPreviewTextChange={setPreviewText}
          fontSize={settings.previewSize}
          onFontSizeChange={sz => updateSettings({ previewSize: sz })}
          viewMode={settings.viewMode}
          onViewModeChange={mode => updateSettings({ viewMode: mode })}
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
        />

        <FontGrid
          fonts={filteredFonts}
          loading={loading}
          selectedFontId={selectedFont?.id}
          favorites={favorites}
          onSelectFont={selectFont}
          onDoubleClickFont={family => {
            selectFont(family);
            setIsDetailModalOpen(true);
          }}
          onToggleFavorite={toggleFavorite}
          previewText={previewText}
          previewMode={previewMode}
          fontSize={settings.previewSize}
          viewMode={settings.viewMode}
        />
      </main>

      {/* RIGHT INSPECTOR PANEL */}
      <FontInspector
        family={selectedFont}
        selectedStyle={selectedStyle}
        onSelectStyle={selectStyle}
        isFavorite={selectedFont ? favorites.includes(selectedFont.id) : false}
        onToggleFavorite={() => selectedFont && toggleFavorite(selectedFont.id)}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        onOpenDetailModal={() => setIsDetailModalOpen(true)}
        developerMode={settings.developerMode}
      />

      {/* MODALS */}
      <FontDetailModal
        family={selectedFont}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isFavorite={selectedFont ? favorites.includes(selectedFont.id) : false}
        onToggleFavorite={() => selectedFont && toggleFavorite(selectedFont.id)}
        previewText={previewText}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onRescan={rescanFonts}
        isLoading={loading}
        onExportBackup={exportBackup}
        onImportBackup={importBackup}
        onResetStore={resetStoreData}
      />
    </div>
  );
};
