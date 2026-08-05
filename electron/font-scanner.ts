import fs from 'fs';
import path from 'path';
import fontkit from 'fontkit';
import { app } from 'electron';

export interface ScannedStyle {
  id: string;
  name: string;
  weight: number;
  weightName: string;
  width?: string;
  postScriptName: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  mtimeMs: number;
  format: 'TrueType' | 'OpenType' | 'WOFF' | 'WOFF2' | 'Collection' | 'Unknown';
  isVariable: boolean;
  glyphCount?: number;
}

export interface ScannedFamily {
  id: string;
  familyName: string;
  styles: ScannedStyle[];
  category: 'Sans-serif' | 'Serif' | 'Monospace' | 'Display' | 'Handwriting' | 'Other';
  postScriptNames: string[];
  isVariable: boolean;
  sampleStyle: ScannedStyle;
  // V2 Future Expansion Placeholders
  aiCategory?: string;
  aiTags?: string[];
  similarFontIds?: string[];
  fontPairings?: string[];
}

export interface FontCacheFile {
  version: string;
  lastScanned: number;
  families: ScannedFamily[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getWeightName(weight: number, styleName: string): string {
  const lowerStyle = styleName.toLowerCase();
  if (lowerStyle.includes('thin') || weight <= 100) return 'Thin';
  if (lowerStyle.includes('extra light') || lowerStyle.includes('extralight') || weight <= 200) return 'Extra Light';
  if (lowerStyle.includes('light') || weight <= 300) return 'Light';
  if (lowerStyle.includes('medium') || weight === 500) return 'Medium';
  if (lowerStyle.includes('semi bold') || lowerStyle.includes('semibold') || weight === 600) return 'SemiBold';
  if (lowerStyle.includes('extra bold') || lowerStyle.includes('extrabold') || (weight >= 800 && weight < 900)) return 'ExtraBold';
  if (lowerStyle.includes('black') || lowerStyle.includes('heavy') || weight >= 900) return 'Black';
  if (lowerStyle.includes('bold') || weight === 700) return 'Bold';
  return 'Regular';
}

function detectCategory(family: string, subFamily: string): 'Sans-serif' | 'Serif' | 'Monospace' | 'Display' | 'Handwriting' | 'Other' {
  const name = (family + ' ' + subFamily).toLowerCase();
  if (name.includes('mono') || name.includes('code') || name.includes('console') || name.includes('courier')) return 'Monospace';
  if (name.includes('script') || name.includes('hand') || name.includes('cursive') || name.includes('brush')) return 'Handwriting';
  if (name.includes('sans') || name.includes('arial') || name.includes('segoe') || name.includes('roboto') || name.includes('helvetica') || name.includes('calibri')) return 'Sans-serif';
  if (name.includes('serif') || name.includes('times') || name.includes('georgia') || name.includes('garamond') || name.includes('cambria')) return 'Serif';
  if (name.includes('display') || name.includes('poster') || name.includes('gothic') || name.includes('black')) return 'Display';
  return 'Sans-serif';
}

const CACHE_VERSION = '1.0.0';

export class FontScannerService {
  private cachePath: string;
  private cache: FontCacheFile | null = null;

  constructor() {
    const userData = app.getPath('userData');
    this.cachePath = path.join(userData, 'fontCache.json');
    this.loadCache();
  }

  private loadCache(): FontCacheFile | null {
    try {
      if (fs.existsSync(this.cachePath)) {
        const raw = fs.readFileSync(this.cachePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === CACHE_VERSION && Array.isArray(parsed.families)) {
          this.cache = parsed;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read font cache, starting fresh scan:', err);
    }
    return null;
  }

  public getCachedFamilies(): ScannedFamily[] {
    return this.cache ? this.cache.families : [];
  }

  private saveCache(families: ScannedFamily[]) {
    try {
      const data: FontCacheFile = {
        version: CACHE_VERSION,
        lastScanned: Date.now(),
        families
      };
      this.cache = data;
      fs.writeFileSync(this.cachePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write fontCache.json:', err);
    }
  }

  public async scanFonts(
    customDirs: string[] = [],
    onProgress?: (progress: { count: number; total: number; statusText: string; currentFamily?: string }) => void
  ): Promise<ScannedFamily[]> {
    const fontDirectories: string[] = [];

    // System font directory
    const winDir = process.env.WINDIR || 'C:\\Windows';
    const sysFonts = path.join(winDir, 'Fonts');
    if (fs.existsSync(sysFonts)) fontDirectories.push(sysFonts);

    // User font directory
    const localAppData = process.env.LOCALAPPDATA;
    if (localAppData) {
      const userFonts = path.join(localAppData, 'Microsoft', 'Windows', 'Fonts');
      if (fs.existsSync(userFonts)) fontDirectories.push(userFonts);
    }

    // Custom user directories
    for (const dir of customDirs) {
      if (dir && fs.existsSync(dir) && !fontDirectories.includes(dir)) {
        fontDirectories.push(dir);
      }
    }

    const fontFiles: { path: string; mtimeMs: number; size: number }[] = [];
    const validExts = ['.ttf', '.otf', '.woff', '.woff2', '.ttc'];

    if (onProgress) {
      onProgress({ count: 0, total: 100, statusText: 'Scanning system directories...' });
    }

    for (const dir of fontDirectories) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          if (validExts.includes(ext)) {
            const fullPath = path.join(dir, file);
            try {
              const stat = fs.statSync(fullPath);
              fontFiles.push({
                path: fullPath,
                mtimeMs: stat.mtimeMs,
                size: stat.size
              });
            } catch {
              // Ignore stat errors for individual files
            }
          }
        }
      } catch (err) {
        console.warn(`Could not read directory ${dir}:`, err);
      }
    }

    const totalFiles = fontFiles.length;
    const existingCacheMap = new Map<string, ScannedStyle>();
    if (this.cache) {
      for (const fam of this.cache.families) {
        for (const st of fam.styles) {
          existingCacheMap.set(st.filePath, st);
        }
      }
    }

    const familyMap = new Map<string, { familyName: string; category: any; styles: ScannedStyle[] }>();
    let processedCount = 0;

    for (const fileInfo of fontFiles) {
      processedCount++;
      const filePath = fileInfo.path;
      const fileName = path.basename(filePath);

      if (onProgress && (processedCount % 20 === 0 || processedCount === totalFiles)) {
        onProgress({
          count: processedCount,
          total: totalFiles,
          statusText: `Parsing font files... (${processedCount}/${totalFiles})`,
          currentFamily: fileName
        });
      }

      // Check cache hit by filePath and mtimeMs
      const cachedStyle = existingCacheMap.get(filePath);
      if (cachedStyle && cachedStyle.mtimeMs === fileInfo.mtimeMs) {
        // Fast path cache hit!
        const familyKey = cachedStyle.postScriptName.split('-')[0].toLowerCase() || fileName.toLowerCase();
        const familyName = cachedStyle.id.split('-')[0] || fileName;

        if (!familyMap.has(familyKey)) {
          familyMap.set(familyKey, {
            familyName,
            category: detectCategory(familyName, cachedStyle.name),
            styles: []
          });
        }
        familyMap.get(familyKey)!.styles.push(cachedStyle);
        continue;
      }

      // Parse binary file safely with fontkit
      try {
        let fkFontObj: any = null;
        try {
          fkFontObj = fontkit.openSync(filePath);
        } catch {
          continue; // Skip corrupted font file
        }

        const fontsToProcess = fkFontObj.fonts ? fkFontObj.fonts : [fkFontObj];

        for (const font of fontsToProcess) {
          if (!font || !font.familyName) continue;

          const rawFamilyName = font.familyName.trim();
          if (!rawFamilyName) continue;

          const familyKey = rawFamilyName.toLowerCase();
          const styleSubfamily = font.subfamilyName || 'Regular';
          const postScriptName = font.postscriptName || `${rawFamilyName}-${styleSubfamily}`;

          let weight = 400;
          if (font['OS/2'] && font['OS/2'].usWeightClass) {
            weight = font['OS/2'].usWeightClass;
          } else if (styleSubfamily.toLowerCase().includes('bold')) {
            weight = 700;
          } else if (styleSubfamily.toLowerCase().includes('light')) {
            weight = 300;
          }

          let width = 'Normal';
          if (font['OS/2'] && font['OS/2'].usWidthClass) {
            const wClass = font['OS/2'].usWidthClass;
            if (wClass <= 3) width = 'Condensed';
            else if (wClass >= 7) width = 'Expanded';
          }

          const isVariable = !!(font.variationAxes && Object.keys(font.variationAxes).length > 0);
          const formatExt = path.extname(filePath).toLowerCase();
          let format: ScannedStyle['format'] = 'TrueType';
          if (formatExt === '.otf') format = 'OpenType';
          else if (formatExt === '.woff') format = 'WOFF';
          else if (formatExt === '.woff2') format = 'WOFF2';
          else if (formatExt === '.ttc') format = 'Collection';

          const styleObj: ScannedStyle = {
            id: `${familyKey}-${styleSubfamily.toLowerCase().replace(/\s+/g, '-')}-${weight}`,
            name: styleSubfamily,
            weight,
            weightName: getWeightName(weight, styleSubfamily),
            width,
            postScriptName,
            filePath,
            fileName,
            fileSize: fileInfo.size,
            fileSizeFormatted: formatBytes(fileInfo.size),
            mtimeMs: fileInfo.mtimeMs,
            format,
            isVariable,
            glyphCount: font.numGlyphs || 0
          };

          if (!familyMap.has(familyKey)) {
            familyMap.set(familyKey, {
              familyName: rawFamilyName,
              category: detectCategory(rawFamilyName, styleSubfamily),
              styles: []
            });
          }

          const existing = familyMap.get(familyKey)!;
          if (!existing.styles.some(s => s.postScriptName === postScriptName)) {
            existing.styles.push(styleObj);
          }
        }
      } catch {
        // Skip font file on any parse error
      }
    }

    const result: ScannedFamily[] = [];

    familyMap.forEach((entry, familyKey) => {
      entry.styles.sort((a, b) => a.weight - b.weight);

      const sampleStyle = entry.styles.find(s => s.name.toLowerCase() === 'regular') || entry.styles[0];
      const isVariable = entry.styles.some(s => s.isVariable);

      result.push({
        id: familyKey.replace(/[^a-z0-9]/g, '-'),
        familyName: entry.familyName,
        styles: entry.styles,
        category: entry.category,
        postScriptNames: entry.styles.map(s => s.postScriptName),
        isVariable,
        sampleStyle
      });
    });

    result.sort((a, b) => a.familyName.localeCompare(b.familyName));

    // Save updated cache
    this.saveCache(result);

    if (onProgress) {
      onProgress({ count: totalFiles, total: totalFiles, statusText: 'Complete' });
    }

    return result;
  }
}
