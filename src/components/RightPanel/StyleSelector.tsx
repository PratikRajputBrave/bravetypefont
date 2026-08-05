import React from 'react';
import { FontStyle } from '../../types/font';
import { Check, ChevronDown } from 'lucide-react';

interface StyleSelectorProps {
  styles: FontStyle[];
  selectedStyle: FontStyle | null;
  onSelectStyle: (style: FontStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelectStyle }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!styles || styles.length === 0) return null;

  const currentStyle = selectedStyle || styles[0];

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-charcoal-subtle uppercase tracking-wider mb-1.5">
        Select Style / Weight ({styles.length})
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-paper-card border border-paper-border text-sm font-medium text-charcoal-main shadow-paper-sm hover:border-paper-borderDark transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">{currentStyle.name}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-paper-cream text-charcoal-muted border border-paper-border font-medium">
            {currentStyle.weight} ({currentStyle.weightName})
          </span>
        </div>
        <ChevronDown size={16} className={`text-charcoal-subtle transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-56 overflow-y-auto rounded-2xl bg-paper-card border border-paper-border shadow-paper-lg py-1.5 space-y-0.5">
          {styles.map(st => {
            const isSelected = currentStyle.postScriptName === st.postScriptName;
            return (
              <button
                key={st.id}
                onClick={() => {
                  onSelectStyle(st);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                  isSelected ? 'bg-accent-orangeLight text-accent-orange font-semibold' : 'text-charcoal-main hover:bg-paper-cream'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{st.name}</span>
                  <span className="text-[10px] text-charcoal-subtle">({st.weight})</span>
                </div>
                {isSelected && <Check size={14} className="text-accent-orange" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
