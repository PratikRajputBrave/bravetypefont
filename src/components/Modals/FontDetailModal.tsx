import React, { useEffect, useState } from 'react';
import { X, Star, FolderOpen, Copy, Check, Layers, Sparkles } from 'lucide-react';
import { FontFamily, FontStyle } from '../../types/font';
import { ensureFontLoaded } from '../../utils/fontLoader';
import { getCharacterSets } from '../../utils/glyphUtils';

interface FontDetailModalProps {
  family: FontFamily | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  previewText: string;
}

const WATERFALL_SIZES = [14, 18, 24, 32, 48, 64, 80];

export const FontDetailModal: React.FC<FontDetailModalProps> = ({
  family,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  previewText,
}) => {
  const [activeTab, setActiveTab] = useState<'waterfall' | 'styles' | 'glyphs' | 'metadata'>('waterfall');
  const [selectedStyle, setSelectedStyle] = useState<FontStyle | null>(null);
  const [fontCssMap, setFontCssMap] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (family) {
      const map: Record<string, string> = {};
      family.styles.forEach(st => {
        map[st.id] = ensureFontLoaded(st);
      });
      setFontCssMap(map);
      setSelectedStyle(family.sampleStyle);
    }
  }, [family]);

  if (!isOpen || !family) return null;

  const currentStyle = selectedStyle || family.sampleStyle;
  const currentFontCss = fontCssMap[currentStyle.id] || 'sans-serif';
  const characterSets = getCharacterSets();

  const handleOpenFolder = () => {
    if (window.api && currentStyle.filePath) {
      window.api.openFontLocation(currentStyle.filePath);
    }
  };

  const handleCopyCss = () => {
    const css = `font-family: '${family.familyName}', sans-serif;\nfont-weight: ${currentStyle.weight};`;
    if (window.api) {
      window.api.copyToClipboard(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-main/40 backdrop-blur-xs p-6 select-none overflow-hidden">
      <div className="w-full max-w-5xl h-[88vh] bg-paper-card rounded-3xl shadow-paper-lg border border-paper-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-paper-cream border-b border-paper-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-orange flex items-center justify-center text-white font-bold text-xl shadow-paper-sm">
              {family.familyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-charcoal-main tracking-tight">{family.familyName}</h2>
                {family.isVariable && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent-orangeLight text-accent-orange uppercase">
                    <Sparkles size={12} />
                    Variable Font
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-subtle mt-0.5">
                {family.styles.length} {family.styles.length === 1 ? 'Style' : 'Styles'}  •  {family.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              className="p-2.5 rounded-2xl bg-paper-card border border-paper-border text-charcoal-subtle hover:text-accent-orange transition-colors"
            >
              <Star size={20} className={isFavorite ? 'text-accent-orange fill-accent-orange' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-paper-card border border-paper-border text-charcoal-subtle hover:text-charcoal-main transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 py-3 bg-paper-cream/60 border-b border-paper-border/60 flex items-center gap-2">
          {(['waterfall', 'styles', 'glyphs', 'metadata'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-accent-orange text-white shadow-paper-sm'
                  : 'bg-paper-card text-charcoal-muted hover:bg-paper-border hover:text-charcoal-main border border-paper-border/60'
              }`}
            >
              {tab === 'waterfall' && 'Type Specimen Waterfall'}
              {tab === 'styles' && `All Styles (${family.styles.length})`}
              {tab === 'glyphs' && 'Character Map'}
              {tab === 'metadata' && 'Technical Metadata'}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* TAB 1: WATERFALL VIEW */}
          {activeTab === 'waterfall' && (
            <div className="space-y-8">
              <div className="p-6 bg-paper-cream border border-paper-border rounded-2xl">
                <p
                  style={{
                    fontFamily: `'${currentFontCss}', sans-serif`,
                    fontWeight: currentStyle.weight
                  }}
                  className="text-4xl text-charcoal-main text-center leading-relaxed"
                >
                  {previewText || 'The quick brown fox jumps over the lazy dog'}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
                  Waterfall Scale Specimen
                </h3>
                <div className="space-y-4">
                  {WATERFALL_SIZES.map(sz => (
                    <div key={sz} className="flex items-baseline gap-6 pb-4 border-b border-paper-border/40">
                      <span className="w-12 text-xs font-semibold text-charcoal-subtle shrink-0">{sz}px</span>
                      <p
                        style={{
                          fontFamily: `'${currentFontCss}', sans-serif`,
                          fontSize: `${sz}px`,
                          fontWeight: currentStyle.weight
                        }}
                        className="text-charcoal-main truncate leading-tight flex-1"
                      >
                        {previewText || 'The quick brown fox jumps over the lazy dog'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STYLES LIST */}
          {activeTab === 'styles' && (
            <div className="space-y-4">
              {family.styles.map(st => {
                const stCss = fontCssMap[st.id] || 'sans-serif';
                return (
                  <div
                    key={st.id}
                    className="p-5 rounded-2xl bg-paper-cream border border-paper-border hover:border-accent-orange/50 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-charcoal-subtle border-b border-paper-border/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-charcoal-main">{st.name}</span>
                        <span className="px-2 py-0.5 rounded bg-paper-card text-charcoal-muted font-mono">
                          {st.weight} ({st.weightName})
                        </span>
                      </div>
                      <span className="font-mono text-[11px]">{st.postScriptName}</span>
                    </div>

                    <p
                      style={{
                        fontFamily: `'${stCss}', sans-serif`,
                        fontWeight: st.weight
                      }}
                      className="text-2xl text-charcoal-main truncate pt-2"
                    >
                      {previewText || 'The quick brown fox jumps over the lazy dog'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: GLYPHS CHARACTER MAP */}
          {activeTab === 'glyphs' && (
            <div className="space-y-8">
              {characterSets.map(cat => (
                <div key={cat.title} className="space-y-3">
                  <h3 className="text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
                    {cat.title}
                  </h3>
                  <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
                    {cat.characters.map((ch, idx) => (
                      <div
                        key={idx}
                        style={{ fontFamily: `'${currentFontCss}', sans-serif` }}
                        className="h-12 rounded-xl bg-paper-cream border border-paper-border flex items-center justify-center text-xl text-charcoal-main hover:bg-accent-orangeLight hover:border-accent-orange hover:text-accent-orange transition-all cursor-pointer"
                        title={`Character: ${ch}`}
                      >
                        {ch}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TECHNICAL METADATA */}
          {activeTab === 'metadata' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-charcoal-main">Font Specifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCss}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-paper-cream border border-paper-border text-xs font-medium text-charcoal-main hover:bg-paper-border/60 transition-colors"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied CSS!' : 'Copy CSS Snippet'}</span>
                  </button>
                  <button
                    onClick={handleOpenFolder}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-orange text-white text-xs font-semibold hover:bg-accent-orangeHover transition-colors shadow-paper-sm"
                  >
                    <FolderOpen size={14} />
                    <span>Show in Explorer</span>
                  </button>
                </div>
              </div>

              <div className="bg-paper-cream border border-paper-border rounded-2xl p-6 space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-paper-border">
                  <span className="text-charcoal-subtle">Family Name</span>
                  <span className="font-semibold text-charcoal-main">{family.familyName}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-paper-border">
                  <span className="text-charcoal-subtle">Number of Styles</span>
                  <span className="font-semibold text-charcoal-main">{family.styles.length}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-paper-border">
                  <span className="text-charcoal-subtle">Primary Category</span>
                  <span className="font-semibold text-charcoal-main">{family.category}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-paper-border">
                  <span className="text-charcoal-subtle">Format</span>
                  <span className="font-semibold text-charcoal-main">{currentStyle.format}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-paper-border">
                  <span className="text-charcoal-subtle">Variable Font</span>
                  <span className="font-semibold text-charcoal-main">{family.isVariable ? 'Yes' : 'No'}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-paper-border">
                  <span className="text-charcoal-subtle">File Path</span>
                  <span className="font-mono text-xs text-charcoal-main break-all text-right max-w-xs">
                    {currentStyle.filePath}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
