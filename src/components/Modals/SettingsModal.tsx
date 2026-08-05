import React, { useState } from 'react';
import { X, Settings, RefreshCw, FolderPlus, Trash2, Volume2, VolumeX, Info, Code2, Download, Upload, RefreshCcw, Sparkles, Rocket } from 'lucide-react';
import { AppSettings } from '../../types/store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onRescan: () => void;
  isLoading: boolean;
  onExportBackup: () => Promise<{ success: boolean; filePath?: string }>;
  onImportBackup: () => Promise<{ success: boolean; error?: string }>;
  onResetStore: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onRescan,
  isLoading,
  onExportBackup,
  onImportBackup,
  onResetStore,
}) => {
  const [newDir, setNewDir] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'advanced' | 'about'>('general');
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);
  const [backupMsg, setBackupMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddDirectory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDir.trim() && !settings.customFontDirs.includes(newDir.trim())) {
      onUpdateSettings({
        customFontDirs: [...settings.customFontDirs, newDir.trim()]
      });
      setNewDir('');
    }
  };

  const handleRemoveDirectory = (dir: string) => {
    onUpdateSettings({
      customFontDirs: settings.customFontDirs.filter(d => d !== dir)
    });
  };

  const handleCheckUpdates = async () => {
    setUpdateMsg('Checking for updates...');
    if (window.api) {
      const res = await window.api.checkForUpdates();
      setUpdateMsg(res.releaseNotes || 'You are on the latest version v1.0.0.');
    } else {
      setUpdateMsg('BraveType v1.0.0 is up to date.');
    }
  };

  const handleExport = async () => {
    const res = await onExportBackup();
    if (res.success) {
      setBackupMsg('Backup exported successfully.');
      setTimeout(() => setBackupMsg(null), 3000);
    }
  };

  const handleImport = async () => {
    const res = await onImportBackup();
    if (res.success) {
      setBackupMsg('Backup restored successfully.');
      setTimeout(() => setBackupMsg(null), 3000);
    } else if (res.error) {
      setBackupMsg(`Import failed: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-main/30 backdrop-blur-xs p-6 select-none">
      <div className="w-full max-w-xl h-[85vh] bg-paper-card rounded-3xl shadow-paper-lg border border-paper-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-paper-cream border-b border-paper-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-accent-orangeLight text-accent-orange">
              <Settings size={20} />
            </div>
            <div>
              <h3
                style={{ fontFamily: "'Transcity', 'Inter', system-ui, -apple-system, sans-serif" }}
                className="font-bold text-lg text-charcoal-main"
              >
                BraveType Settings
              </h3>
              <p className="text-xs text-charcoal-subtle">Configure application preferences & options</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-charcoal-subtle hover:text-charcoal-main hover:bg-paper-card">
            <X size={18} />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 py-2.5 bg-paper-cream/60 border-b border-paper-border/60 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'general'
                ? 'bg-accent-orange text-white shadow-paper-sm'
                : 'bg-paper-card text-charcoal-muted hover:bg-paper-border border border-paper-border/60'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'advanced'
                ? 'bg-accent-orange text-white shadow-paper-sm'
                : 'bg-paper-card text-charcoal-muted hover:bg-paper-border border border-paper-border/60'
            }`}
          >
            Advanced & Backup
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'about'
                ? 'bg-accent-orange text-white shadow-paper-sm'
                : 'bg-paper-card text-charcoal-muted hover:bg-paper-border border border-paper-border/60'
            }`}
          >
            About & Release Notes
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Startup Typing Sound Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-paper-cream border border-paper-border">
                <div className="flex items-center gap-3">
                  {settings.enableStartupSound ? (
                    <Volume2 size={18} className="text-accent-orange" />
                  ) : (
                    <VolumeX size={18} className="text-charcoal-subtle" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-charcoal-main block">Startup Typing Sound</span>
                    <span className="text-[11px] text-charcoal-subtle block">Play mechanical keyboard click sound during splash typing</span>
                  </div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ enableStartupSound: !settings.enableStartupSound })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    settings.enableStartupSound
                      ? 'bg-accent-orange text-white border-accent-orange shadow-paper-sm'
                      : 'bg-paper-card text-charcoal-muted border-paper-border hover:bg-paper-border/60'
                  }`}
                >
                  {settings.enableStartupSound ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Launch at Startup */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-paper-cream border border-paper-border">
                <div className="flex items-center gap-3">
                  <Rocket size={18} className="text-accent-orange" />
                  <div>
                    <span className="text-xs font-semibold text-charcoal-main block">Launch at Startup</span>
                    <span className="text-[11px] text-charcoal-subtle block">Automatically start BraveType when Windows starts</span>
                  </div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ launchAtStartup: !settings.launchAtStartup })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    settings.launchAtStartup
                      ? 'bg-accent-orange text-white border-accent-orange shadow-paper-sm'
                      : 'bg-paper-card text-charcoal-muted border-paper-border hover:bg-paper-border/60'
                  }`}
                >
                  {settings.launchAtStartup ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Default Preview Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
                  Default Preview Text
                </label>
                <input
                  type="text"
                  value={settings.defaultPreviewText}
                  onChange={e => onUpdateSettings({ defaultPreviewText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-paper-cream border border-paper-border text-sm text-charcoal-main focus:outline-none focus:border-accent-orange"
                />
              </div>

              {/* Default Font Size */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
                  <span>Default Font Size</span>
                  <span className="text-charcoal-main font-bold">{settings.previewSize}px</span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={72}
                  value={settings.previewSize}
                  onChange={e => onUpdateSettings({ previewSize: Number(e.target.value) })}
                  className="w-full accent-accent-orange cursor-pointer"
                />
              </div>

              {/* Grid vs List View */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
                  Default View Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ viewMode: 'grid' })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      settings.viewMode === 'grid'
                        ? 'bg-accent-orange text-white border-accent-orange shadow-paper-sm'
                        : 'bg-paper-cream text-charcoal-muted border-paper-border hover:bg-paper-border/50'
                    }`}
                  >
                    Grid View
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ viewMode: 'list' })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      settings.viewMode === 'list'
                        ? 'bg-accent-orange text-white border-accent-orange shadow-paper-sm'
                        : 'bg-paper-cream text-charcoal-muted border-paper-border hover:bg-paper-border/50'
                    }`}
                  >
                    List View
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Developer Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-paper-cream border border-paper-border">
                <div className="flex items-center gap-3">
                  <Code2 size={18} className="text-accent-orange" />
                  <div>
                    <span className="text-xs font-semibold text-charcoal-main block">Developer Mode</span>
                    <span className="text-[11px] text-charcoal-subtle block">Reveal PostScript names, OpenType tables & technical parameters</span>
                  </div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ developerMode: !settings.developerMode })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    settings.developerMode
                      ? 'bg-accent-orange text-white border-accent-orange shadow-paper-sm'
                      : 'bg-paper-card text-charcoal-muted border-paper-border hover:bg-paper-border/60'
                  }`}
                >
                  {settings.developerMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Custom Font Directories */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
                  Custom Font Scan Directories
                </label>
                <form onSubmit={handleAddDirectory} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. D:\MyCustomFonts"
                    value={newDir}
                    onChange={e => setNewDir(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-paper-cream border border-paper-border text-charcoal-main focus:outline-none focus:border-accent-orange"
                  />
                  <button
                    type="submit"
                    disabled={!newDir.trim()}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-paper-cream border border-paper-border text-xs font-semibold text-charcoal-main hover:bg-accent-orangeLight hover:text-accent-orange disabled:opacity-50 transition-colors"
                  >
                    <FolderPlus size={14} />
                    <span>Add</span>
                  </button>
                </form>

                {settings.customFontDirs.length > 0 && (
                  <div className="space-y-1 max-h-28 overflow-y-auto pt-1">
                    {settings.customFontDirs.map(dir => (
                      <div key={dir} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-paper-cream border border-paper-border text-xs">
                        <span className="font-mono text-charcoal-main truncate max-w-xs">{dir}</span>
                        <button
                          onClick={() => handleRemoveDirectory(dir)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Backup & Restore */}
              <div className="space-y-2 pt-2 border-t border-paper-border">
                <label className="block text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
                  Offline Backup & Restore
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl bg-paper-cream border border-paper-border text-xs font-semibold text-charcoal-main hover:bg-paper-border/60 transition-colors"
                  >
                    <Download size={14} />
                    <span>Export Backup JSON</span>
                  </button>

                  <button
                    onClick={handleImport}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl bg-paper-cream border border-paper-border text-xs font-semibold text-charcoal-main hover:bg-paper-border/60 transition-colors"
                  >
                    <Upload size={14} />
                    <span>Import Backup JSON</span>
                  </button>
                </div>
                {backupMsg && (
                  <p className="text-xs font-medium text-accent-orange pt-1 text-center">{backupMsg}</p>
                )}
              </div>

              {/* Reset Store */}
              <div className="pt-2 border-t border-paper-border flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-charcoal-main block">Reset All Settings</span>
                  <span className="text-[11px] text-charcoal-subtle block">Restore factory settings & empty custom collections</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all settings to defaults?')) {
                      onResetStore();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  <RefreshCcw size={13} />
                  <span>Reset Store</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* About App Box */}
              <div className="p-5 rounded-2xl bg-paper-cream border border-paper-border space-y-3">
                <div className="flex items-baseline justify-between">
                  <h4
                    style={{ fontFamily: "'Transcity', 'Inter', system-ui, -apple-system, sans-serif" }}
                    className="text-xl font-bold text-charcoal-main"
                  >
                    BraveType - Font Manager Tool
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent-orangeLight text-accent-orange">
                    v1.0.0
                  </span>
                </div>

                <p className="text-xs text-charcoal-muted">
                  Professional Windows Font Management Application engineered for graphic designers, UI/UX designers, branding agencies, and digital creators.
                </p>

                <div className="pt-2 border-t border-paper-border/60 flex items-center justify-between text-xs text-charcoal-subtle">
                  <span>Developer: <strong className="text-charcoal-main" style={{ fontFamily: "'Transcity', 'Inter', sans-serif" }}>Brave Studios</strong></span>
                  <span>Copyright © Brave Studios</span>
                </div>
              </div>

              {/* Check for updates */}
              <div className="p-4 rounded-2xl bg-paper-cream border border-paper-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent-orange" />
                    <span className="text-xs font-bold text-charcoal-main">Software Updates</span>
                  </div>
                  <button
                    onClick={handleCheckUpdates}
                    className="px-3 py-1.5 rounded-xl bg-accent-orange text-white text-xs font-semibold hover:bg-accent-orangeHover transition-colors shadow-paper-sm"
                  >
                    Check for Updates
                  </button>
                </div>
                {updateMsg && (
                  <p className="text-xs font-medium text-charcoal-muted bg-paper-card p-3 rounded-xl border border-paper-border">
                    {updateMsg}
                  </p>
                )}
              </div>

              {/* Release Notes */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">
                  What's New in Version 1.0.0
                </h5>
                <div className="p-4 rounded-2xl bg-paper-card border border-paper-border text-xs space-y-2 text-charcoal-main">
                  <p className="font-semibold text-accent-orange">• Initial Public Beta Release</p>
                  <p>• High-performance instant font metadata caching system (`fontCache.json`)</p>
                  <p>• Progressive background system font scanner for 2000+ fonts</p>
                  <p>• Viewport observer lazy `@font-face` rendering engine</p>
                  <p>• 9 Preview Presets (*Sentence*, *Paragraph*, *Alphabet*, *Numbers*, *Logo*, *Poster*, *Heading*, *Button*, *Business Card*)</p>
                  <p>• Offline Manual Collections, Favorites, and Keyboard Shortcuts</p>
                  <p>• Complete offline privacy — zero data collection, zero cloud dependencies</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rescan & Actions Footer */}
        <div className="p-4 bg-paper-cream border-t border-paper-border flex items-center justify-between">
          <button
            onClick={onRescan}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-paper-card border border-paper-border text-xs font-semibold text-charcoal-main hover:bg-paper-border/60 disabled:opacity-50 transition-colors shadow-paper-sm"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-accent-orange' : ''} />
            <span>Clear Cache & Rescan</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-accent-orange text-white text-xs font-semibold hover:bg-accent-orangeHover transition-colors shadow-paper-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
