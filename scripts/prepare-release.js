const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = process.cwd();
const releaseDir = path.join(rootDir, 'Release');

if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

// 1. Write Version.txt
const version = '1.0.0';
fs.writeFileSync(path.join(releaseDir, 'Version.txt'), version, 'utf-8');

// 2. Copy Distribution Documentation
const docsToCopy = ['README.md', 'CHANGELOG.md', 'LICENSE', 'SECURITY.md', 'PRIVACY.md'];
for (const file of docsToCopy) {
  const src = path.join(rootDir, file);
  const dest = path.join(releaseDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

// 3. Generate SHA256 Checksums
const filesInRelease = fs.readdirSync(releaseDir).filter(f => f !== 'SHA256.txt');
let sha256Lines = [];

for (const file of filesInRelease) {
  const filePath = path.join(releaseDir, file);
  if (fs.statSync(filePath).isFile()) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');
    sha256Lines.push(`${hex}  ${file}`);
  }
}

fs.writeFileSync(path.join(releaseDir, 'SHA256.txt'), sha256Lines.join('\n'), 'utf-8');
console.log(`Release folder prepared successfully in ${releaseDir}`);
