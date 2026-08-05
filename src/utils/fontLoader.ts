import { FontStyle } from '../types/font';

const loadedFontFamilies = new Set<string>();

/**
 * Dynamically injects a `@font-face` CSS rule into document head for a given font style.
 * Uses local-font:// protocol to load font binary directly from Windows filesystem.
 */
export function ensureFontLoaded(style: FontStyle): string {
  if (!style || !style.filePath) return 'sans-serif';

  const fontId = `ag-font-${style.postScriptName.replace(/[^a-zA-Z0-9-]/g, '-')}`;

  if (loadedFontFamilies.has(fontId)) {
    return fontId;
  }

  try {
    const formattedPath = style.filePath.replace(/\\/g, '/');
    const fontUrl = `local-font://${formattedPath}`;

    let formatHint = 'truetype';
    if (style.format === 'OpenType') formatHint = 'opentype';
    else if (style.format === 'WOFF') formatHint = 'woff';
    else if (style.format === 'WOFF2') formatHint = 'woff2';

    const fontFaceRule = `
      @font-face {
        font-family: '${fontId}';
        src: url('${fontUrl}') format('${formatHint}');
        font-weight: ${style.weight || 400};
        font-style: ${style.name.toLowerCase().includes('italic') ? 'italic' : 'normal'};
        font-display: swap;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-font-id', fontId);
    styleEl.textContent = fontFaceRule;
    document.head.appendChild(styleEl);

    loadedFontFamilies.add(fontId);
    return fontId;
  } catch (err) {
    console.error('Failed to inject @font-face rule:', err);
    return 'sans-serif';
  }
}
