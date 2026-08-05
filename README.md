# BraveType — Font Manager Tool

<p align="center">
  <img src="build/icon.png" alt="BraveType Logo" width="128" height="128" />
</p>

<h3 align="center">BraveType — Professional Windows Desktop Font Management Application</h3>

<p align="center">
  A high-performance, offline-first Windows desktop font manager built for graphic designers, UI/UX engineers, branding agencies, and digital typography enthusiasts.
</p>

<p align="center">
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-orange.svg" alt="License: MIT"></a>
  <a href="https://electronjs.org"><img src="https://img.shields.io/badge/Electron-33.2.1-47848F.svg" alt="Electron"></a>
  <a href="https://reactjs.org"><img src="https://img.shields.io/badge/React-18.3.1-61DAFB.svg" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.6.3-3178C6.svg" alt="TypeScript"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.0.1-646CFF.svg" alt="Vite"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8.svg" alt="Tailwind CSS"></a>
  <img src="https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6.svg" alt="Platform: Windows">
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Design Aesthetics](#-design-aesthetics)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Setup](#installation--local-setup)
  - [Build & Packaging](#build--packaging)
- [Data Storage & Security](#-data-storage--security)
- [Development Guidelines](#-development-guidelines)
- [License & Author](#-license--author)

---

## 🌟 Overview

System font folders on Windows (`C:\Windows\Fonts` and `%LOCALAPPDATA%\Microsoft\Windows\Fonts`) often contain thousands of typeface files (`.ttf`, `.otf`, `.woff`, `.woff2`, `.ttc`). Native Windows tools fail to provide real-time preview text customization, scale specimen waterfalls, or grouping into project folders.

**BraveType** is an offline desktop solution engineered by **Brave Studios**. It cold-boots in under **50ms** using a dual-stage metadata caching system, renders thousands of installed font families without DOM memory spikes, and organizes typefaces into drag-and-drop manual collection folders.

---

## ⚡ Key Features

- ⚡ **Instant Cold-Boot Metadata Cache (`fontCache.json`)**: Bypasses slow OS disk re-scans on boot, launching the UI instantly with pre-indexed typeface metadata.
- 🎨 **9 Type Specimen Layout Presets**: Test typefaces across 9 custom real-time layout specimen modes:
  - *Sentence*, *Paragraph*, *Alphabet*, *Numbers*, *Heading*, *Logo*, *Poster*, *Button*, and *Business Card*.
- 🚀 **Dynamic Custom Streaming Protocol (`local-font://`)**: Streams raw binary font bytes directly from disk into Chromium styles without Base64 memory bloating.
- 👁️ **Lazy Viewport Specimen Rendering**: Uses browser `IntersectionObserver` API to inject `@font-face` CSS rules strictly when font cards scroll into view, maintaining low RAM usage regardless of font count.
- 📁 **Manual Collection Folders**: Easily create, rename, duplicate, alphabetize, and drag-and-drop font families into custom project collection folders.
- 🔍 **Full Spec Sheet & Character Map Modal**: Full-screen modal featuring scaling waterfall previews (14px – 80px), full style matrices, and interactive character map grids (Uppercase, Lowercase, Numbers, Punctuation/Symbols).
- 🛠️ **Developer Mode**: Exposes OpenType table structures, PostScript names, glyph counts, Unicode coverage, and one-click CSS `font-family` snippet export.
- 🎵 **Web Audio Synthesizer**: Built-in mechanical keyboard click sound effects during splash initialization.
- 🔒 **100% Offline & Private**: Zero telemetry, zero analytics, zero external network requests.
- 💾 **JSON Backup & Restore**: One-click import and export of user favorites, custom collections, and preferences.

---

## 🎨 Design Aesthetics

BraveType features a custom **Paper Minimal Design System**:

- **Warm Neutral Canvas**: `#FAF7F2` background evoking high-grade paper stock.
- **Card Containers**: Crisp `#FFFFFF` surfaces with subtle `#EFE8DD` borders.
- **Terracotta Accent**: Soft orange `#E86A33` highlight for active states and primary actions.
- **Charcoal Typography**: High-contrast `#2C2825` main text and `#78716C` secondary metadata.

---

## 🏗️ System Architecture

BraveType leverages Electron's isolated dual-process architecture:

```
+---------------------------------------------------------------------------------------------------+
| WINDOWS OPERATING SYSTEM                                                                         |
| Fonts Directories: C:\Windows\Fonts | %LOCALAPPDATA%\Microsoft\Windows\Fonts | Custom Directories    |
+---------------------------------------------------------------------------------------------------+
                                                  ^
                                                  | Native File I/O (fontkit & fs)
                                                  v
+---------------------------------------------------------------------------------------------------+
| ELECTRON MAIN PROCESS (Node.js Engine)                                                            |
|  - main.ts                 : Window lifecycle, security handlers & IPC listeners                  |
|  - font-scanner.ts         : Fontkit binary metadata parser & fontCache.json manager             |
|  - store-service.ts        : JSON store manager for store.json (favorites, collections, settings) |
|  - logger-service.ts       : Disk logger writing to %APPDATA%/logs/app.log                        |
|  - local-font://           : Custom protocol streaming raw binary fonts directly to Chromium      |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  | IPC Bridge (ContextBridge whitelist)
                                                  v
+---------------------------------------------------------------------------------------------------+
| ELECTRON RENDERER PROCESS (Chromium Browser Engine)                                               |
|  - preload.ts              : Secure API bridge exposing window.api to React                       |
|  - useFontManager.ts       : Central custom React hook managing state & IPC orchestration         |
|  - AppLayout.tsx           : Master 3-column layout component & global shortcut listener          |
|  - FontGrid.tsx            : Lazy Virtualized specimen card layout                                |
|  - FontCard.tsx            : IntersectionObserver trigger for dynamic @font-face injection       |
+---------------------------------------------------------------------------------------------------+
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Runtime Container** | [Electron 33](https://www.electronjs.org/) | Cross-platform desktop runtime container |
| **Frontend Framework** | [React 18](https://react.dev/) | Component-based UI library |
| **Type Safety** | [TypeScript 5](https://www.typescriptlang.org/) | Static type definitions & safety |
| **Bundler & Build** | [Vite 6](https://vitejs.dev/) | High-speed frontend module bundler |
| **Styling System** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework with `@theme` engine |
| **Font Parser** | [fontkit](https://github.com/foliojs/fontkit) | Fast OpenType/TrueType binary table parser |
| **Iconography** | [Lucide React](https://lucide.dev/) | Clean vector UI icon set |
| **Packaging** | [electron-builder](https://www.electron.build/) | NSIS installer and portable EXE bundler |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | Focus global search input bar |
| <kbd>Ctrl</kbd> + <kbd>R</kbd> | Trigger background system font rescan |
| <kbd>Ctrl</kbd> + <kbd>,</kbd> | Open Settings modal |
| <kbd>Enter</kbd> | Open full specimen spec sheet for selected font |
| <kbd>Delete</kbd> | Delete currently selected collection folder |
| <kbd>Esc</kbd> | Close active modal dialog |

---

## 📁 Project Directory Structure

```
Fontbrave/
├── build/                         # App packaging icons (icon.png, icon.svg)
├── dist/                          # Compiled Vite production frontend assets
├── dist-electron/                 # Compiled Main process JS (main.js, preload.js)
├── electron/                      # Main Process TypeScript Source Code
│   ├── font-scanner.ts            # OS font directory scanner & fontkit binary parser
│   ├── logger-service.ts          # File logger writing to %APPDATA%/logs/app.log
│   ├── main.ts                    # Electron app entry, custom protocol, & IPC handlers
│   ├── preload.ts                 # Secure ContextBridge whitelist script
│   ├── store-service.ts           # Persistent storage manager for store.json
│   └── update-service.ts          # Version update checker service
├── scripts/                       # Build and packaging automation scripts
│   ├── fix-wincodesign.js         # Fixes winCodeSign cache symlink issues on Windows
│   ├── generate-icon.js           # Programmatically generates 512x512 PNG & SVG icons
│   ├── prepare-release.js         # Creates version manifests & SHA256 checksums
│   └── prepare-wincodesign.js     # Prepares 7z signing tool archives
├── src/                           # Frontend React Source Code
│   ├── components/
│   │   ├── Branding/BrandLogo.tsx # Header brand icon & title
│   │   ├── CenterArea/            # HeaderBar, FontGrid, FontCard, PreviewModeSelector
│   │   ├── Layout/AppLayout.tsx   # Master 3-column container & hotkey host
│   │   ├── Modals/                # FontDetailModal & SettingsModal
│   │   ├── RightPanel/            # FontInspector, GlyphGrid, MetadataTable, StyleSelector
│   │   ├── Sidebar/               # Sidebar, CollectionFolderItem, CreateFolderModal
│   │   └── Splash/SplashScreen.tsx # Typing splash screen & Web Audio synthesizer
│   ├── hooks/useFontManager.ts    # Central custom React state hook
│   ├── types/                     # TypeScript type definitions (font.ts, store.ts)
│   ├── utils/                     # Helper utilities (audioUtils, fontLoader, glyphUtils)
│   ├── App.tsx                    # Root App component
│   └── index.css                  # Tailwind CSS v4 design tokens & base rules
├── index.html                     # HTML root template
├── package.json                   # Build dependencies & electron-builder settings
├── tailwind.config.js             # Tailwind CSS theme extension rules
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Operating System**: Windows 10 / Windows 11 (x64 / ARM64)

### Installation & Local Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/PratikRajputBrave/bravetypefont.git
   cd bravetypefont
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch in Development Mode**:
   ```bash
   npm run dev
   ```
   *This starts the Vite dev server on port `5173` and launches Electron with HMR live reloading.*

### Build & Packaging

To compile production bundles and generate standalone Windows executables:

```bash
# Build TypeScript and bundle frontend + electron main process
npm run build

# Generate Windows NSIS Installer & Portable EXEs
npm run dist

# Prepare Release folder with SHA256 checksums
npm run release
```

Output installers will be generated in the `./Release` directory.

---

## 🔒 Data Storage & Security

BraveType stores application data offline within the Windows `%APPDATA%\bravetype-font-manager\` folder:

- `fontCache.json`: Binary metadata cache for fast startup.
- `store.json`: User collections, favorites, recent fonts history, and preferences.
- `logs/app.log`: Diagnostic logs.

### Security Highlights

- **Sandboxed Execution**: `contextIsolation: true` and `nodeIntegration: false` prevent untrusted script execution.
- **ContextBridge Whitelist**: Main-Renderer IPC communication is restricted to explicit methods defined in `electron/preload.ts`.
- **Window Open Handler**: Blocks external window popups.
- **Protocol Protection**: `local-font://` protocol normalizes slashes and validates file existence to prevent directory traversal.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License & Author

Developed with ❤️ by **Brave Studios**.

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 💼 Need a Custom Website or Software Built?

Looking for a high-performance web application, desktop software, custom dashboard, or modern website built for your brand or business? Partner with **Brave Studios** to bring your vision to life!

- 📞 **Pratik Rajput (Brave Studios)**: [9136543329](tel:9136543329) / `+91 9136543329`
- 📞 **Tanmay (Costing & Tech Stack)**: [9665916979](tel:9665916979) / `+91 9665916979`
- ✉️ **Email**: [pratikrajput.brave@gmail.com](mailto:pratikrajput.brave@gmail.com)
- 🚀 **Services**: Web Applications, Desktop Apps (Electron), Custom Websites, Software Engineering & UI/UX Design.

