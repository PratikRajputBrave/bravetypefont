const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const buildDir = path.join(process.cwd(), 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// 1. Generate SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#FAF7F2"/>
  <rect x="32" y="32" width="448" height="448" rx="96" fill="#FFFFFF" stroke="#EFE8DD" stroke-width="16"/>
  <rect x="96" y="96" width="320" height="320" rx="64" fill="#E86A33"/>
  <path d="M192 192 H320 V232 H276 V344 H236 V232 H192 V192 Z" fill="#FFFFFF"/>
</svg>`;

fs.writeFileSync(path.join(buildDir, 'icon.svg'), svgContent, 'utf-8');

// 2. Helper to create a valid uncompressed/deflated PNG file for electron-builder
function createValidPNG(width, height) {
  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type RGBA
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte (0) per scanline
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Draw warm paper background (#FAF7F2) with rounded orange inner square (#E86A33)
      const margin = Math.floor(width * 0.18);
      const isInner = x >= margin && x < width - margin && y >= margin && y < height - margin;

      if (isInner) {
        rawData[pxOffset] = 0xE8;     // R
        rawData[pxOffset + 1] = 0x6A; // G
        rawData[pxOffset + 2] = 0x33; // B
        rawData[pxOffset + 3] = 0xFF; // A
      } else {
        rawData[pxOffset] = 0xFA;     // R
        rawData[pxOffset + 1] = 0xF7; // G
        rawData[pxOffset + 2] = 0xF2; // B
        rawData[pxOffset + 3] = 0xFF; // A
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

const pngBuffer = createValidPNG(512, 512);
fs.writeFileSync(path.join(buildDir, 'icon.png'), pngBuffer);
console.log('Generated build/icon.png (512x512) and build/icon.svg vector assets for BraveType.');
