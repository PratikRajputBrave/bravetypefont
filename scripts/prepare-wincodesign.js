const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || 'C:\\Users\\Brave', 'AppData', 'Local');
const cacheDir = path.join(localAppData, 'electron-builder', 'Cache', 'winCodeSign');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Find any .7z archive in cacheDir
const files = fs.readdirSync(cacheDir);
const archiveFile = files.find(f => f.endsWith('.7z'));

if (archiveFile) {
  const archivePath = path.join(cacheDir, archiveFile);
  const targetDir = path.join(cacheDir, 'winCodeSign-2.6.0');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Use 7zip tool in node_modules to extract skipping symlink creation errors
  const sevenZipPath = path.join(process.cwd(), 'node_modules', '7zip-bin', 'win', 'x64', '7za.exe');
  if (fs.existsSync(sevenZipPath)) {
    try {
      execSync(`"${sevenZipPath}" x -y "${archivePath}" "-o${targetDir}"`, { stdio: 'ignore' });
    } catch (e) {
      // 7zip may return exit code for symlink warning, which is fine
    }

    // Create dummy files for darwin symlinks so electron-builder finds a valid folder
    const darwinLib = path.join(targetDir, 'darwin', '10.12', 'lib');
    if (fs.existsSync(darwinLib)) {
      const cryptoFile = path.join(darwinLib, 'libcrypto.dylib');
      const sslFile = path.join(darwinLib, 'libssl.dylib');
      if (!fs.existsSync(cryptoFile)) fs.writeFileSync(cryptoFile, '');
      if (!fs.existsSync(sslFile)) fs.writeFileSync(sslFile, '');
    }

    // Copy to any temporary subfolder expected by electron-builder
    for (const f of files) {
      if (f !== archiveFile && f !== 'winCodeSign-2.6.0') {
        const tempSub = path.join(cacheDir, f);
        if (fs.existsSync(tempSub) && fs.statSync(tempSub).isDirectory()) {
          const darwinSub = path.join(tempSub, 'darwin', '10.12', 'lib');
          if (!fs.existsSync(darwinSub)) {
            fs.mkdirSync(darwinSub, { recursive: true });
          }
          fs.writeFileSync(path.join(darwinSub, 'libcrypto.dylib'), '');
          fs.writeFileSync(path.join(darwinSub, 'libssl.dylib'), '');
        }
      }
    }
    console.log('Successfully prepared winCodeSign cache directory.');
  }
}
