import React from 'react';
import { PreviewMode } from '../../types/font';

interface PreviewModeSelectorProps {
  currentMode: PreviewMode;
  onSelectMode: (mode: PreviewMode) => void;
}

const MODES: PreviewMode[] = [
  'Sentence',
  'Paragraph',
  'Alphabet',
  'Numbers',
  'Heading',
  'Logo',
  'Poster',
  'Button',
  'Business Card'
];

export const PreviewModeSelector: React.FC<PreviewModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
      {MODES.map(mode => {
        const isActive = currentMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onSelectMode(mode)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'bg-accent-orange text-white shadow-paper-sm font-semibold'
                : 'bg-paper-card text-charcoal-muted hover:bg-paper-border hover:text-charcoal-main border border-paper-border/60'
            }`}
          >
            {mode}
          </button>
        );
      })}
    </div>
  );
};
