const fs = require('fs');
const path = require('path');

// Fix winCodeSign cache directory on Windows to prevent 7za symlink extraction error
const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || 'C:\\Users\\Brave', 'AppData', 'Local');
const cacheDir = path.join(localAppData, 'electron-builder', 'Cache', 'winCodeSign');

if (fs.existsSync(cacheDir)) {
  try {
    const entries = fs.readdirSync(cacheDir);
    for (const entry of entries) {
      const fullPath = path.join(cacheDir, entry);
      const darwinLibDir = path.join(fullPath, 'darwin', '10.12', 'lib');
      if (fs.existsSync(darwinLibDir)) {
        // Create empty dummy files for symlinks if missing to avoid 7zip error
        const libcrypto = path.join(darwinLibDir, 'libcrypto.dylib');
        const libssl = path.join(darwinLibDir, 'libssl.dylib');
        if (!fs.existsSync(libcrypto)) fs.writeFileSync(libcrypto, '');
        if (!fs.existsSync(libssl)) fs.writeFileSync(libssl, '');
      }
    }
    console.log('Processed winCodeSign cache directory.');
  } catch (err) {
    console.log('Notice: winCodeSign cache check:', err.message);
  }
}
