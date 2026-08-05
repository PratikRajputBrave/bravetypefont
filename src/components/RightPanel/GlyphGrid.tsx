import React, { useState } from 'react';
import { getCharacterSets } from '../../utils/glyphUtils';

interface GlyphGridProps {
  fontFamilyCss: string;
}

export const GlyphGrid: React.FC<GlyphGridProps> = ({ fontFamilyCss }) => {
  const categories = getCharacterSets();
  const [activeTab, setActiveTab] = useState<number>(0);

  const currentCategory = categories[activeTab];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
          Character Set Preview
        </label>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 bg-paper-cream border border-paper-border p-1 rounded-xl">
        {categories.map((cat, idx) => (
          <button
            key={cat.title}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 py-1 text-[11px] font-medium rounded-lg truncate transition-all ${
              activeTab === idx
                ? 'bg-paper-card text-accent-orange font-semibold shadow-paper-sm'
                : 'text-charcoal-subtle hover:text-charcoal-main'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Characters Grid */}
      <div className="p-3 bg-paper-card border border-paper-border rounded-2xl max-h-44 overflow-y-auto">
        <div className="grid grid-cols-6 gap-1.5 text-center">
          {currentCategory.characters.map((char, index) => (
            <div
              key={index}
              style={{ fontFamily: `'${fontFamilyCss}', sans-serif` }}
              className="h-9 flex items-center justify-center rounded-xl bg-paper-bg border border-paper-border/60 text-base text-charcoal-main hover:bg-accent-orangeLight hover:border-accent-orange hover:text-accent-orange transition-colors cursor-pointer"
              title={`Character: ${char} (Unicode U+${char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()})`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
