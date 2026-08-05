import React from 'react';
import { LayoutGrid, List, Sliders } from 'lucide-react';
import { CategoryFilter, PreviewMode } from '../../types/font';
import { PreviewModeSelector } from './PreviewModeSelector';

interface HeaderBarProps {
  category: CategoryFilter;
  fontCount: number;
  previewText: string;
  onPreviewTextChange: (text: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  category,
  fontCount,
  previewText,
  onPreviewTextChange,
  fontSize,
  onFontSizeChange,
  viewMode,
  onViewModeChange,
  previewMode,
  onPreviewModeChange,
}) => {
  return (
    <header className="bg-paper-bg border-b border-paper-border px-6 py-4 space-y-3.5 select-none">
      {/* Top Header Row: Category Title & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-xl font-bold tracking-tight text-charcoal-main">{category.name}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-paper-cream border border-paper-border text-charcoal-muted">
            {fontCount} families
          </span>
        </div>

        {/* Layout controls */}
        <div className="flex items-center gap-4">
          {/* Size slider */}
          <div className="flex items-center gap-2 bg-paper-cream border border-paper-border px-3 py-1.5 rounded-xl shadow-paper-sm">
            <Sliders size={14} className="text-charcoal-subtle" />
            <input
              type="range"
              min={14}
              max={72}
              value={fontSize}
              onChange={e => onFontSizeChange(Number(e.target.value))}
              className="w-24 accent-accent-orange cursor-pointer"
            />
            <span className="text-xs font-semibold text-charcoal-main w-8 text-right">{fontSize}px</span>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-paper-cream border border-paper-border p-1 rounded-xl shadow-paper-sm">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-paper-card text-accent-orange shadow-paper-sm' : 'text-charcoal-subtle hover:text-charcoal-main'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-paper-card text-accent-orange shadow-paper-sm' : 'text-charcoal-subtle hover:text-charcoal-main'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview Input Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Type custom preview text here..."
          value={previewText}
          onChange={e => onPreviewTextChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl bg-paper-card border border-paper-border text-charcoal-main placeholder-charcoal-subtle font-medium text-sm shadow-paper-sm focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all"
        />
        {previewText && (
          <button
            onClick={() => onPreviewTextChange('The quick brown fox jumps over the lazy dog')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-charcoal-subtle hover:text-accent-orange"
          >
            Reset
          </button>
        )}
      </div>

      {/* Preview Preset Modes */}
      <PreviewModeSelector currentMode={previewMode} onSelectMode={onPreviewModeChange} />
    </header>
  );
};
