export interface FontStyle {
  id: string;
  name: string; // e.g. "Regular", "Bold", "Thin Italic"
  weight: number; // e.g. 400, 700
  weightName: string; // e.g. "Thin", "Light", "Regular", "SemiBold", "Bold", "Black"
  width?: string; // e.g. "Normal", "Condensed", "Expanded"
  postScriptName: string;
  filePath: string;
  fileName?: string;
  fileSize?: number;
  fileSizeFormatted?: string;
  mtimeMs?: number;
  format: 'TrueType' | 'OpenType' | 'WOFF' | 'WOFF2' | 'Collection' | 'Unknown';
  isVariable: boolean;
  glyphCount?: number;
}

export interface FontFamily {
  id: string;
  familyName: string;
  styles: FontStyle[];
  category: 'Sans-serif' | 'Serif' | 'Monospace' | 'Display' | 'Handwriting' | 'Other';
  postScriptNames: string[];
  isVariable: boolean;
  sampleStyle: FontStyle;

  // Reserved V2 Architecture Placeholders (Unused in V1)
  aiCategory?: string;
  aiTags?: string[];
  similarFontIds?: string[];
  fontPairings?: string[];
}

export type PreviewMode =
  | 'Sentence'
  | 'Paragraph'
  | 'Alphabet'
  | 'Numbers'
  | 'Logo'
  | 'Poster'
  | 'Heading'
  | 'Button'
  | 'Business Card';

export interface CategoryFilter {
  type: 'all' | 'favorites' | 'recents' | 'collection';
  collectionId?: string;
  name: string;
}

export interface ScanProgressData {
  count: number;
  total: number;
  statusText: string;
  currentFamily?: string;
}
