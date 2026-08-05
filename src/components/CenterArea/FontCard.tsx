import React, { useEffect, useState, useRef } from 'react';
import { Star, Sparkles, Layers, Maximize2 } from 'lucide-react';
import { FontFamily, PreviewMode } from '../../types/font';
import { ensureFontLoaded } from '../../utils/fontLoader';

interface FontCardProps {
  family: FontFamily;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onToggleFavorite: () => void;
  previewText: string;
  previewMode: PreviewMode;
  fontSize: number;
  viewMode: 'grid' | 'list';
}

function getDisplayText(mode: PreviewMode, customText: string): string {
  switch (mode) {
    case 'Sentence':
      return customText || 'The quick brown fox jumps over the lazy dog';
    case 'Paragraph':
      return 'Typography is the craft of endowing human language with a durable visual form. It transforms raw symbols into artistic harmony.';
    case 'Alphabet':
      return 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz';
    case 'Numbers':
      return '0 1 2 3 4 5 6 7 8 9   ! @ # $ % ^ & * ( )';
    case 'Heading':
      return customText !== 'The quick brown fox jumps over the lazy dog' ? customText : 'Create Stunning Digital Experiences';
    case 'Logo':
      return (customText !== 'The quick brown fox jumps over the lazy dog' ? customText : 'ANTIGRAVITY').toUpperCase();
    case 'Poster':
      return customText !== 'The quick brown fox jumps over the lazy dog' ? customText : 'DESIGN & ART 2026';
    case 'Button':
      return customText !== 'The quick brown fox jumps over the lazy dog' ? customText : 'Get Started Now';
    case 'Business Card':
      return 'CREATIVE DIRECTOR — STUDIO';
    default:
      return customText || 'The quick brown fox jumps over the lazy dog';
  }
}

export const FontCard: React.FC<FontCardProps> = ({
  family,
  isSelected,
  isFavorite,
  onSelect,
  onDoubleClick,
  onToggleFavorite,
  previewText,
  previewMode,
  fontSize,
  viewMode,
}) => {
  const [fontFamilyCss, setFontFamilyCss] = useState<string>('sans-serif');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lazy loading via IntersectionObserver: Load font into DOM ONLY when visible
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if ((isVisible || isSelected) && family.sampleStyle) {
      const familyCssName = ensureFontLoaded(family.sampleStyle);
      setFontFamilyCss(familyCssName);
    }
  }, [isVisible, isSelected, family]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', family.id);
  };

  const displayText = getDisplayText(previewMode, previewText);

  if (viewMode === 'list') {
    return (
      <div
        ref={cardRef}
        draggable
        onDragStart={handleDragStart}
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        className={`group flex items-center justify-between p-4 rounded-2xl bg-paper-card border transition-all duration-150 cursor-pointer ${
          isSelected
            ? 'border-accent-orange ring-1 ring-accent-orange shadow-paper-md'
            : 'border-paper-border hover:border-paper-borderDark hover:shadow-paper-sm'
        }`}
      >
        <div className="w-64 pr-4 border-r border-paper-border flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-charcoal-main truncate">{family.familyName}</span>
            {family.isVariable && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-orangeLight text-accent-orange uppercase">
                Var
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-subtle">
            <span>{family.styles.length} {family.styles.length === 1 ? 'style' : 'styles'}</span>
            <span>•</span>
            <span>{family.category}</span>
          </div>
        </div>

        <div className="flex-1 px-6 overflow-hidden">
          <div
            style={{
              fontFamily: isVisible || isSelected ? `'${fontFamilyCss}', sans-serif` : 'sans-serif',
              fontSize: `${Math.min(fontSize, 40)}px`,
              fontWeight: family.sampleStyle?.weight || 400
            }}
            className="text-charcoal-main truncate leading-normal"
          >
            {displayText}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={e => {
              e.stopPropagation();
              onDoubleClick();
            }}
            title="Open Details"
            className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-charcoal-subtle hover:text-accent-orange hover:bg-paper-cream transition-all"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            className="p-2 rounded-xl text-charcoal-subtle hover:text-accent-orange hover:bg-paper-cream transition-colors"
          >
            <Star size={18} className={isFavorite ? 'text-accent-orange fill-accent-orange' : ''} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      className={`group flex flex-col justify-between p-5 rounded-2xl bg-paper-card border transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'border-accent-orange ring-1 ring-accent-orange shadow-paper-md'
          : 'border-paper-border hover:border-paper-borderDark hover:shadow-paper-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Card Info Row */}
      <div className="flex items-start justify-between gap-2 border-b border-paper-border/60 pb-3">
        <div>
          <h3 className="font-bold text-base text-charcoal-main tracking-tight group-hover:text-accent-orange transition-colors truncate">
            {family.familyName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-paper-cream text-charcoal-muted border border-paper-border">
              <Layers size={11} />
              {family.styles.length} {family.styles.length === 1 ? 'style' : 'styles'}
            </span>
            {family.isVariable && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-orangeLight text-accent-orange uppercase">
                <Sparkles size={10} />
                Variable
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={e => {
              e.stopPropagation();
              onDoubleClick();
            }}
            title="Open Details (Enter)"
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-xl text-charcoal-subtle hover:text-accent-orange hover:bg-paper-cream transition-all"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            className="p-1.5 rounded-xl text-charcoal-subtle hover:text-accent-orange hover:bg-paper-cream transition-colors"
          >
            <Star size={18} className={isFavorite ? 'text-accent-orange fill-accent-orange' : ''} />
          </button>
        </div>
      </div>

      {/* Main Preview Specimen Area */}
      <div className="py-5 flex-1 flex items-center overflow-hidden min-h-[100px]">
        <p
          style={{
            fontFamily: isVisible || isSelected ? `'${fontFamilyCss}', sans-serif` : 'sans-serif',
            fontSize: `${fontSize}px`,
            fontWeight: family.sampleStyle?.weight || 400
          }}
          className="text-charcoal-main w-full break-words line-clamp-3 leading-tight tracking-normal"
        >
          {displayText}
        </p>
      </div>

      {/* Footer Secondary Specimen Sample */}
      <div className="pt-3 border-t border-paper-border/60 flex items-center justify-between text-[11px] text-charcoal-subtle">
        <span
          style={{ fontFamily: isVisible || isSelected ? `'${fontFamilyCss}', sans-serif` : 'sans-serif' }}
          className="truncate max-w-[200px]"
        >
          Aa Bb Cc  •  1234567890
        </span>
        <span className="text-[10px] text-charcoal-subtle uppercase tracking-wider font-semibold">
          {family.category}
        </span>
      </div>
    </div>
  );
};
