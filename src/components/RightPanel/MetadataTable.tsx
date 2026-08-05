import React, { useState } from 'react';
import { FontFamily, FontStyle } from '../../types/font';
import { FolderOpen, Copy, Check, Info, FileText, Code2 } from 'lucide-react';

interface MetadataTableProps {
  family: FontFamily;
  style: FontStyle | null;
  developerMode?: boolean;
}

export const MetadataTable: React.FC<MetadataTableProps> = ({ family, style, developerMode = false }) => {
  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const currentStyle = style || family.sampleStyle;
  const fileName = currentStyle.fileName || (currentStyle.filePath ? currentStyle.filePath.split(/[\\/]/).pop() : 'Unknown');

  const handleOpenFolder = () => {
    if (window.api && currentStyle.filePath) {
      window.api.openFontLocation(currentStyle.filePath);
    }
  };

  const handleCopyCss = () => {
    const cssSnippet = `font-family: '${family.familyName}', sans-serif;\nfont-weight: ${currentStyle.weight};`;
    if (window.api) {
      window.api.copyToClipboard(cssSnippet);
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    }
  };

  const handleCopyFontName = () => {
    if (window.api) {
      window.api.copyToClipboard(family.familyName);
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    }
  };

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-charcoal-subtle uppercase tracking-wider flex items-center gap-1.5">
          <Info size={13} />
          Font Metadata
        </label>

        {developerMode && (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-orangeLight text-accent-orange">
            <Code2 size={11} />
            Dev Mode
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCopyFontName}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-paper-card border border-paper-border text-xs font-medium text-charcoal-main hover:border-paper-borderDark transition-colors shadow-paper-sm"
        >
          {copiedName ? <Check size={13} className="text-green-600" /> : <FileText size={13} />}
          <span>{copiedName ? 'Copied Name!' : 'Copy Name'}</span>
        </button>

        <button
          onClick={handleCopyCss}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-paper-card border border-paper-border text-xs font-medium text-charcoal-main hover:border-paper-borderDark transition-colors shadow-paper-sm"
        >
          {copiedCss ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
          <span>{copiedCss ? 'Copied CSS!' : 'Copy CSS'}</span>
        </button>
      </div>

      <div className="bg-paper-card border border-paper-border rounded-2xl p-3.5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
          <span className="text-charcoal-subtle">Family Name</span>
          <span className="font-semibold text-charcoal-main">{family.familyName}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
          <span className="text-charcoal-subtle">Style Name</span>
          <span className="font-semibold text-charcoal-main">{currentStyle.name}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
          <span className="text-charcoal-subtle">Weight</span>
          <span className="font-medium text-charcoal-main">{currentStyle.weight} ({currentStyle.weightName})</span>
        </div>

        {currentStyle.width && (
          <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
            <span className="text-charcoal-subtle">Width</span>
            <span className="font-medium text-charcoal-main">{currentStyle.width}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
          <span className="text-charcoal-subtle">Font Format</span>
          <span className="font-medium text-charcoal-main">{currentStyle.format}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
          <span className="text-charcoal-subtle">Variable Font</span>
          <span className={`font-semibold ${family.isVariable ? 'text-accent-orange' : 'text-charcoal-muted'}`}>
            {family.isVariable ? 'Yes' : 'No'}
          </span>
        </div>

        {currentStyle.fileSizeFormatted && (
          <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
            <span className="text-charcoal-subtle">File Size</span>
            <span className="font-mono text-[11px] text-charcoal-main">{currentStyle.fileSizeFormatted}</span>
          </div>
        )}

        {currentStyle.glyphCount !== undefined && currentStyle.glyphCount > 0 && (
          <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
            <span className="text-charcoal-subtle">Glyph Count</span>
            <span className="font-mono text-[11px] text-charcoal-main">{currentStyle.glyphCount} glyphs</span>
          </div>
        )}

        {/* Extended Developer Mode Metadata */}
        {developerMode && (
          <>
            <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
              <span className="text-charcoal-subtle">PostScript Name</span>
              <span className="font-mono text-[11px] text-accent-orange font-semibold truncate max-w-[170px]" title={currentStyle.postScriptName}>
                {currentStyle.postScriptName}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
              <span className="text-charcoal-subtle">OpenType Tables</span>
              <span className="font-mono text-[11px] text-charcoal-main">cmap, head, hhea, OS/2, name</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
              <span className="text-charcoal-subtle">Unicode Coverage</span>
              <span className="font-mono text-[11px] text-charcoal-main">Basic Latin, Latin-1 Supp</span>
            </div>
          </>
        )}

        <div className="flex items-center justify-between py-1 border-b border-paper-border/60">
          <span className="text-charcoal-subtle">File Name</span>
          <span className="font-mono text-[11px] text-charcoal-main truncate max-w-[180px]" title={fileName}>
            {fileName}
          </span>
        </div>

        <div className="pt-1 flex items-start justify-between gap-2">
          <span className="text-charcoal-subtle shrink-0">File Path</span>
          <div className="flex flex-col items-end gap-1.5 min-w-0">
            <span className="font-mono text-[10px] text-charcoal-subtle break-all text-right max-h-12 overflow-hidden">
              {currentStyle.filePath}
            </span>
            <button
              onClick={handleOpenFolder}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-paper-cream border border-paper-border text-[11px] font-semibold text-accent-orange hover:bg-accent-orangeLight transition-colors"
            >
              <FolderOpen size={13} />
              <span>Show in Explorer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
