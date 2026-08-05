import React from 'react';
import { FontFamily, PreviewMode } from '../../types/font';
import { FontCard } from './FontCard';
import { SearchX, Type } from 'lucide-react';

interface FontGridProps {
  fonts: FontFamily[];
  loading: boolean;
  selectedFontId?: string;
  favorites: string[];
  onSelectFont: (font: FontFamily) => void;
  onDoubleClickFont: (font: FontFamily) => void;
  onToggleFavorite: (fontId: string) => void;
  previewText: string;
  previewMode: PreviewMode;
  fontSize: number;
  viewMode: 'grid' | 'list';
}

export const FontGrid: React.FC<FontGridProps> = ({
  fonts,
  loading,
  selectedFontId,
  favorites,
  onSelectFont,
  onDoubleClickFont,
  onToggleFavorite,
  previewText,
  previewMode,
  fontSize,
  viewMode,
}) => {
  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-56 rounded-2xl bg-paper-cream border border-paper-border p-5 space-y-4 animate-pulse">
            <div className="h-5 bg-paper-border/60 rounded-lg w-2/3"></div>
            <div className="h-20 bg-paper-border/40 rounded-xl w-full"></div>
            <div className="h-4 bg-paper-border/60 rounded-lg w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (fonts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-paper-cream border border-paper-border flex items-center justify-center text-charcoal-subtle mb-4 shadow-paper-sm">
          <SearchX size={32} />
        </div>
        <h3 className="text-lg font-bold text-charcoal-main mb-1">No Fonts Found</h3>
        <p className="text-sm text-charcoal-muted max-w-sm">
          We couldn't find any installed font matching your search query or active collection filter.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
            : 'flex flex-col gap-3'
        }
      >
        {fonts.map(family => (
          <FontCard
            key={family.id}
            family={family}
            isSelected={selectedFontId === family.id}
            isFavorite={favorites.includes(family.id)}
            onSelect={() => onSelectFont(family)}
            onDoubleClick={() => onDoubleClickFont(family)}
            onToggleFavorite={() => onToggleFavorite(family.id)}
            previewText={previewText}
            previewMode={previewMode}
            fontSize={fontSize}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};
