import React from 'react';
import { Type } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitleText = 'Font Manager',
}) => {
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  const containerSizes = {
    sm: 'w-7 h-7 rounded-xl',
    md: 'w-9 h-9 rounded-2xl',
    lg: 'w-12 h-12 rounded-3xl',
  };

  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm font-semibold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`${containerSizes[size]} bg-accent-orange flex items-center justify-center text-white shadow-paper-sm shrink-0`}>
        <Type size={iconSizes[size]} className="stroke-[2.5]" />
      </div>
      <div>
        <span
          style={{ fontFamily: "'Transcity', 'Inter', system-ui, -apple-system, sans-serif" }}
          className={`${titleSizes[size]} text-charcoal-main leading-tight block`}
        >
          BraveType
        </span>
        {showSubtitle && (
          <span className="text-[10px] font-medium text-charcoal-subtle tracking-wider uppercase block">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
