import React, { useEffect, useState } from 'react';
import { Star, Sliders, Maximize2 } from 'lucide-react';
import { FontFamily, FontStyle } from '../../types/font';
import { ensureFontLoaded } from '../../utils/fontLoader';
import { StyleSelector } from './StyleSelector';
import { GlyphGrid } from './GlyphGrid';
import { MetadataTable } from './MetadataTable';

interface FontInspectorProps {
  family: FontFamily | null;
  selectedStyle: FontStyle | null;
  onSelectStyle: (style: FontStyle) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  previewText: string;
  onPreviewTextChange: (text: string) => void;
  onOpenDetailModal: () => void;
  developerMode?: boolean;
}

export const FontInspector: React.FC<FontInspectorProps> = ({
  family,
  selectedStyle,
  onSelectStyle,
  isFavorite,
  onToggleFavorite,
  previewText,
  onPreviewTextChange,
  onOpenDetailModal,
  developerMode = false,
}) => {
  const [fontFamilyCss, setFontFamilyCss] = useState<string>('sans-serif');
  const [specimenSize, setSpecimenSize] = useState<number>(36);

  const activeStyle = selectedStyle || (family ? family.sampleStyle : null);

  useEffect(() => {
    if (activeStyle) {
      const fontCssName = ensureFontLoaded(activeStyle);
      setFontFamilyCss(fontCssName);
    }
  }, [activeStyle]);

  if (!family) {
    return (
      <aside className="w-80 lg:w-96 h-full bg-paper-cream border-l border-paper-border p-6 flex flex-col items-center justify-center text-center select-none flex-shrink-0">
        <p className="text-sm font-medium text-charcoal-subtle">
          Select a font family to inspect details & glyph character map.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-80 lg:w-96 h-full bg-paper-cream border-l border-paper-border flex flex-col flex-shrink-0 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-paper-border/60 flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <h2 className="font-bold text-lg text-charcoal-main tracking-tight truncate">{family.familyName}</h2>
          <p className="text-xs text-charcoal-subtle">
            {family.styles.length} {family.styles.length === 1 ? 'style' : 'styles'} available
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenDetailModal}
            title="Expand Full Specimen Spec Sheet"
            className="p-2 rounded-xl text-charcoal-subtle hover:text-accent-orange hover:bg-paper-card transition-colors border border-transparent hover:border-paper-border"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            className="p-2 rounded-xl text-charcoal-subtle hover:text-accent-orange hover:bg-paper-card transition-colors border border-transparent hover:border-paper-border"
          >
            <Star size={18} className={isFavorite ? 'text-accent-orange fill-accent-orange' : ''} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Custom Preview Textbox at Top of Right Panel */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
            Custom Preview Text
          </label>
          <input
            type="text"
            value={previewText}
            onChange={e => onPreviewTextChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-paper-card border border-paper-border text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-accent-orange"
          />
        </div>

        {/* Style / Weight Selector */}
        <StyleSelector
          styles={family.styles}
          selectedStyle={activeStyle}
          onSelectStyle={onSelectStyle}
        />

        {/* Large Preview Specimen Canvas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
              Specimen Preview
            </label>
            <div className="flex items-center gap-1 text-xs text-charcoal-subtle">
              <Sliders size={12} />
              <input
                type="range"
                min={18}
                max={72}
                value={specimenSize}
                onChange={e => setSpecimenSize(Number(e.target.value))}
                className="w-20 accent-accent-orange cursor-pointer"
              />
              <span className="w-8 text-right font-medium">{specimenSize}px</span>
            </div>
          </div>

          <div className="p-4 bg-paper-card border border-paper-border rounded-2xl min-h-[120px] flex items-center justify-center overflow-hidden shadow-paper-sm">
            <p
              style={{
                fontFamily: `'${fontFamilyCss}', sans-serif`,
                fontSize: `${specimenSize}px`,
                fontWeight: activeStyle?.weight || 400
              }}
              className="text-charcoal-main w-full text-center break-words leading-snug"
            >
              {previewText || 'The quick brown fox jumps over the lazy dog'}
            </p>
          </div>
        </div>

        {/* Glyph / Character Set Grid */}
        <GlyphGrid fontFamilyCss={fontFamilyCss} />

        {/* Metadata Table */}
        <MetadataTable family={family} style={activeStyle} developerMode={developerMode} />
      </div>
    </aside>
  );
};
