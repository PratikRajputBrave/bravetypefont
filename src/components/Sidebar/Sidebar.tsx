import React, { useState } from 'react';
import { Search, Grid, Star, Clock, FolderPlus, Settings, RefreshCw, ArrowUpAZ } from 'lucide-react';
import { CategoryFilter, FontFamily } from '../../types/font';
import { Collection } from '../../types/store';
import { CollectionFolderItem } from './CollectionFolderItem';
import { CreateFolderModal } from './CreateFolderModal';
import { BrandLogo } from '../Branding/BrandLogo';

interface SidebarProps {
  fonts: FontFamily[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  favoritesCount: number;
  recentCount: number;
  collections: Collection[];
  onCreateCollection: (name: string) => void;
  onDuplicateCollection: (id: string) => void;
  onRenameCollection: (id: string, name: string) => void;
  onDeleteCollection: (id: string) => void;
  onSortCollections: () => void;
  onDropFontToCollection: (fontId: string, collectionId: string) => void;
  onOpenSettings: () => void;
  onRescan: () => void;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  fonts,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  favoritesCount,
  recentCount,
  collections,
  onCreateCollection,
  onDuplicateCollection,
  onRenameCollection,
  onDeleteCollection,
  onSortCollections,
  onDropFontToCollection,
  onOpenSettings,
  onRescan,
  isLoading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className="w-64 h-full bg-paper-cream border-r border-paper-border flex flex-col flex-shrink-0 select-none">
      {/* App Logo & Header */}
      <div className="p-4 flex items-center justify-between border-b border-paper-border/60">
        <BrandLogo size="md" showSubtitle={true} subtitleText="Font Manager" />

        <button
          onClick={onRescan}
          disabled={isLoading}
          title="Rescan System Fonts"
          className="p-1.5 rounded-xl text-charcoal-subtle hover:text-accent-orange hover:bg-paper-border/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin text-accent-orange' : ''} />
        </button>
      </div>

      {/* Sidebar Quick Search */}
      <div className="p-3.5 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-subtle" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search fonts (Ctrl+F)..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-paper-bg border border-paper-border text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all"
          />
        </div>
      </div>

      {/* Categories Nav */}
      <div className="px-2 py-2 flex-1 overflow-y-auto space-y-5">
        <div className="space-y-0.5">
          <div className="px-3 pb-1 text-[11px] font-semibold text-charcoal-subtle tracking-wider uppercase">
            Categories
          </div>
          <button
            onClick={() => onSelectCategory({ type: 'all', name: 'All Fonts' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory.type === 'all'
                ? 'bg-paper-card text-accent-orange shadow-paper-sm border border-paper-border'
                : 'text-charcoal-muted hover:bg-paper-border/40 hover:text-charcoal-main'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Grid size={16} className={selectedCategory.type === 'all' ? 'text-accent-orange' : 'text-charcoal-subtle'} />
              <span>All Fonts</span>
            </div>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-paper-border/60 text-charcoal-subtle font-medium">
              {fonts.length}
            </span>
          </button>

          <button
            onClick={() => onSelectCategory({ type: 'favorites', name: 'Favorites' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory.type === 'favorites'
                ? 'bg-paper-card text-accent-orange shadow-paper-sm border border-paper-border'
                : 'text-charcoal-muted hover:bg-paper-border/40 hover:text-charcoal-main'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star size={16} className={selectedCategory.type === 'favorites' ? 'text-accent-orange fill-accent-orange' : 'text-charcoal-subtle'} />
              <span>Favorites</span>
            </div>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-paper-border/60 text-charcoal-subtle font-medium">
              {favoritesCount}
            </span>
          </button>

          <button
            onClick={() => onSelectCategory({ type: 'recents', name: 'Recently Used' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory.type === 'recents'
                ? 'bg-paper-card text-accent-orange shadow-paper-sm border border-paper-border'
                : 'text-charcoal-muted hover:bg-paper-border/40 hover:text-charcoal-main'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock size={16} className={selectedCategory.type === 'recents' ? 'text-accent-orange' : 'text-charcoal-subtle'} />
              <span>Recently Used</span>
            </div>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-paper-border/60 text-charcoal-subtle font-medium">
              {recentCount}
            </span>
          </button>
        </div>

        {/* Manual Collections Section */}
        <div className="space-y-1">
          <div className="px-3 flex items-center justify-between pb-1">
            <span className="text-[11px] font-semibold text-charcoal-subtle tracking-wider uppercase">
              Manual Collections
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={onSortCollections}
                title="Sort Collections Alphabetically (A-Z)"
                className="p-1 rounded-lg text-charcoal-subtle hover:text-accent-orange hover:bg-paper-border/60 transition-colors"
              >
                <ArrowUpAZ size={15} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                title="Create Collection Folder"
                className="p-1 rounded-lg text-charcoal-subtle hover:text-accent-orange hover:bg-paper-border/60 transition-colors"
              >
                <FolderPlus size={15} />
              </button>
            </div>
          </div>

          <div className="space-y-0.5">
            {collections.map(col => (
              <CollectionFolderItem
                key={col.id}
                collection={col}
                isSelected={selectedCategory.type === 'collection' && selectedCategory.collectionId === col.id}
                onSelect={() => onSelectCategory({ type: 'collection', collectionId: col.id, name: col.name })}
                onRename={newName => onRenameCollection(col.id, newName)}
                onDuplicate={() => onDuplicateCollection(col.id)}
                onDelete={() => onDeleteCollection(col.id)}
                onDropFont={fontId => onDropFontToCollection(fontId, col.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Settings Button */}
      <div className="p-3 border-t border-paper-border/60">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal-muted hover:bg-paper-card hover:text-charcoal-main hover:shadow-paper-sm transition-all"
        >
          <Settings size={17} className="text-charcoal-subtle" />
          <span>Settings (Ctrl+,)</span>
        </button>
      </div>

      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={onCreateCollection}
      />
    </aside>
  );
};
