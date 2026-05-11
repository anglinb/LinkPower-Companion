#!/usr/bin/env node
/**
 * Generates brand raster assets from authored SVGs.
 *
 * Inputs:
 *  - public/logo.svg
 *  - public/logo-dark.svg
 *  - public/app-icon-fg.png  (existing)
 *  - public/screenshots/en/02-dashboard.png
 *
 * Outputs:
 *  - public/og.png                  (1200x630)
 *  - public/twitter-card.png        (1200x600)
 *  - public/favicon.ico             (32x32)
 *  - src/app/favicon.ico            (32x32)
 *  - public/apple-touch-icon.png    (180x180)
 *  - public/icon-192.png            (192x192)
 *  - public/icon-512.png            (512x512)
 *  - public/marketing/app-icon-rounded-1024.png
 *  - public/marketing/app-icon-on-dark-2048.png
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const APP = path.join(ROOT, "src", "app");
const MARKETING = path.join(PUBLIC, "marketing");

const PRIMARY = "#1573B2";
const DEEP = "#0E5285";
const DARKER = "#093A60";
const SOFT = "#B8D4E8";
const WASH = "#E6F0F8";
const MIST = "#F2F5F8";
const INK = "#0F172A";
const MUTED = "#64748B";

await fs.mkdir(MARKETING, { recursive: true });

// ---------------------------------------------------------------------------
// Mark SVG (used for app icons / favicon)
// Stylized lightning bolt inside rounded square
// ---------------------------------------------------------------------------
const markSvg = (size, bg = PRIMARY, fg = "#FFFFFF", radius = null) => {
  const r = radius != null ? radius : Math.round(size * 0.225);
  const sx = size / 100;
  // Bolt path scaled to 100x100 viewBox
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect x="0" y="0" width="100" height="100" rx="${(r / sx).toFixed(2)}" ry="${(r / sx).toFixed(2)}" fill="${bg}"/>
  <path d="M58 16 L30 60 H46 L41 86 L72 38 H56 L62 16 Z" fill="${fg}"/>
</svg>`;
};

// Mark only (transparent bg) for compositing
const markSvgTransparent = (size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <path d="M58 16 L30 60 H46 L41 86 L72 38 H56 L62 16 Z" fill="${PRIMARY}"/>
</svg>`;

// ---------------------------------------------------------------------------
// Wordmark SVG composed at a target width with the mark + text
// ---------------------------------------------------------------------------
function wordmarkSvg({ width, color = PRIMARY, accentColor = DEEP, markBg = PRIMARY, markFg = "#FFFFFF" }) {
  const vbW = 520;
  const vbH = 120;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" viewBox="0 0 ${vbW} ${vbH}">
  <rect x="8" y="20" width="80" height="80" rx="18" ry="18" fill="${markBg}"/>
  <path d="M54 32 L34 66 H46 L42 88 L66 54 H54 L58 32 Z" fill="${markFg}"/>
  <text x="108" y="80"
    font-family="Inter, -apple-system, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif"
    font-size="64" font-weight="800" letter-spacing="-2" fill="${color}">Link<tspan fill="${accentColor}">Power</tspan></text>
</svg>`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function svgToPng(svg, outPath, { width, height, density = 384 } = {}) {
  let pipe = sharp(Buffer.from(svg), { density });
  if (width || height) pipe = pipe.resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
  const buf = await pipe.png({ compressionLevel: 9 }).toBuffer();
  await fs.writeFile(outPath, buf);
  return buf.length;
}

// ---------------------------------------------------------------------------
// 1. Favicon (32x32) and 32x32 PNG -> ICO
// ---------------------------------------------------------------------------
async function buildFavicon() {
  const svg = markSvg(32, PRIMARY, "#FFFFFF", 6);
  const png32 = await sharp(Buffer.from(svg), { density: 768 }).resize(32, 32).png().toBuffer();
  const png16 = await sharp(Buffer.from(svg), { density: 768 }).resize(16, 16).png().toBuffer();
  const png48 = await sharp(Buffer.from(svg), { density: 768 }).resize(48, 48).png().toBuffer();
  const ico = encodeIco([png16, png32, png48]);
  await fs.writeFile(path.join(PUBLIC, "favicon.ico"), ico);
  await fs.writeFile(path.join(APP, "favicon.ico"), ico);
  return ico.length;
}

// Multi-resolution ICO encoder (PNG-compressed entries)
function encodeIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const dirEntries = [];
  for (const buf of pngBuffers) {
    // Read width/height from PNG IHDR
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    const entry = Buffer.alloc(16);
    entry.writeUInt8(w >= 256 ? 0 : w, 0);   // width
    entry.writeUInt8(h >= 256 ? 0 : h, 1);   // height
    entry.writeUInt8(0, 2);                  // color count
    entry.writeUInt8(0, 3);                  // reserved
    entry.writeUInt16LE(1, 4);               // color planes
    entry.writeUInt16LE(32, 6);              // bits/pixel
    entry.writeUInt32LE(buf.length, 8);      // size
    entry.writeUInt32LE(offset, 12);         // offset
    dirEntries.push(entry);
    offset += buf.length;
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);    // reserved
  header.writeUInt16LE(1, 2);    // type 1 = icon
  header.writeUInt16LE(count, 4); // image count
  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

// ---------------------------------------------------------------------------
// 2. apple-touch-icon (180x180) — gradient bg + white bolt
// ---------------------------------------------------------------------------
async function buildAppleTouch() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1F8DCB"/>
        <stop offset="1" stop-color="${DEEP}"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="180" height="180" fill="url(#g)"/>
    <path d="M104 28 L54 108 H82 L73 154 L130 70 H102 L112 28 Z" fill="#FFFFFF"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg), { density: 384 }).resize(180, 180).png().toBuffer();
  await fs.writeFile(path.join(PUBLIC, "apple-touch-icon.png"), buf);
  return buf.length;
}

// ---------------------------------------------------------------------------
// 3. PWA icons 192/512
// ---------------------------------------------------------------------------
async function buildPwa() {
  for (const size of [192, 512]) {
    const svg = markSvg(size, PRIMARY, "#FFFFFF", Math.round(size * 0.225));
    const buf = await sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toBuffer();
    await fs.writeFile(path.join(PUBLIC, `icon-${size}.png`), buf);
  }
}

// ---------------------------------------------------------------------------
// 4. App icon marketing variants
// ---------------------------------------------------------------------------
async function buildMarketingIcons() {
  const fg = await fs.readFile(path.join(PUBLIC, "app-icon-fg.png"));

  // Rounded 1024 with continuous-corner squircle mask on transparent bg
  const size = 1024;
  const radius = Math.round(size * 0.2237); // iOS continuous corner approx
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`;
  const fgResized = await sharp(fg).resize(size, size, { fit: "cover" }).png().toBuffer();
  const rounded = await sharp(fgResized)
    .composite([{ input: Buffer.from(maskSvg), blend: "dest-in" }])
    .png()
    .toBuffer();
  await fs.writeFile(path.join(MARKETING, "app-icon-rounded-1024.png"), rounded);

  // 2048 on dark bg with subtle radial highlight
  const dim = 2048;
  const iconSize = Math.round(dim * 0.55);
  const iconRadius = Math.round(iconSize * 0.2237);
  const iconMaskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}"><rect x="0" y="0" width="${iconSize}" height="${iconSize}" rx="${iconRadius}" ry="${iconRadius}" fill="#fff"/></svg>`;
  const fgIcon = await sharp(fg).resize(iconSize, iconSize, { fit: "cover" }).png().toBuffer();
  const fgRounded = await sharp(fgIcon)
    .composite([{ input: Buffer.from(iconMaskSvg), blend: "dest-in" }])
    .png()
    .toBuffer();
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}">
    <defs>
      <radialGradient id="r" cx="0.5" cy="0.45" r="0.6">
        <stop offset="0" stop-color="#0E5285"/>
        <stop offset="1" stop-color="${DARKER}"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="${dim}" height="${dim}" fill="url(#r)"/>
  </svg>`;
  const bg = await sharp(Buffer.from(bgSvg), { density: 96 }).resize(dim, dim).png().toBuffer();
  const offset = Math.round((dim - iconSize) / 2);
  const composite = await sharp(bg)
    .composite([{ input: fgRounded, top: offset, left: offset }])
    .png()
    .toBuffer();
  await fs.writeFile(path.join(MARKETING, "app-icon-on-dark-2048.png"), composite);
}

// ---------------------------------------------------------------------------
// 5. OG image (1200x630)
// ---------------------------------------------------------------------------
async function buildOg(width = 1200, height = 630, outName = "og.png") {
  // Background SVG with subtle gradient and grid
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${WASH}"/>
      <stop offset="1" stop-color="#FFFFFF"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0 L0 0 0 40" fill="none" stroke="${SOFT}" stroke-opacity="0.25" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <!-- soft accent blob -->
  <circle cx="${width - 240}" cy="120" r="220" fill="${SOFT}" opacity="0.35"/>
  <!-- Wordmark (lower-left) -->
  <g transform="translate(72, 380)">
    <rect x="0" y="0" width="80" height="80" rx="18" ry="18" fill="${PRIMARY}"/>
    <path d="M46 12 L26 46 H38 L34 68 L58 34 H46 L50 12 Z" fill="#FFFFFF"/>
    <text x="100" y="62"
      font-family="Inter, -apple-system, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif"
      font-size="78" font-weight="900" letter-spacing="-2.5" fill="${PRIMARY}">Link<tspan fill="${DEEP}">Power</tspan></text>
  </g>
  <!-- Tagline -->
  <text x="72" y="510"
    font-family="Inter, -apple-system, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif"
    font-size="28" font-weight="600" fill="${INK}" opacity="0.78">LinkPower app · for iPhone</text>
  <text x="72" y="548"
    font-family="Inter, -apple-system, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif"
    font-size="22" font-weight="500" fill="${MUTED}">Battery telemetry · DC ports · Scheduling · over Bluetooth</text>
  <!-- URL -->
  <text x="${width - 32}" y="${height - 28}" text-anchor="end"
    font-family="Inter, -apple-system, 'SF Pro Display', system-ui, sans-serif"
    font-size="18" font-weight="500" fill="${MUTED}">linkpower.app</text>
</svg>`;

  // Render background
  const bgBuf = await sharp(Buffer.from(bgSvg), { density: 96 }).resize(width, height).png().toBuffer();

  // iPhone frame on right side, embedding existing dashboard screenshot.
  // Scale phone to fit canvas with margin (cap H at height - 60).
  const maxPhoneH = Math.min(height - 60, 560);
  const phoneH = maxPhoneH;
  const phoneW = Math.round(phoneH * (360 / 740));
  const phoneX = width - phoneW - 80;
  const phoneY = Math.round((height - phoneH) / 2);
  const screenInsetX = 14;
  const screenInsetY = 14;
  const screenW = phoneW - screenInsetX * 2;
  const screenH = phoneH - screenInsetY * 2;

  const screenshotPath = path.join(PUBLIC, "screenshots", "en", "02-dashboard.png");
  let screenshotBuf = null;
  try {
    screenshotBuf = await fs.readFile(screenshotPath);
  } catch {
    screenshotBuf = null;
  }

  // Build phone background SVG (dark frame + screen mask)
  const phoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${phoneW}" height="${phoneH}" viewBox="0 0 ${phoneW} ${phoneH}">
  <defs>
    <linearGradient id="frame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0F172A"/>
      <stop offset="1" stop-color="#1E293B"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-10%" width="140%" height="120%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="18"/>
      <feOffset dx="0" dy="20"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <rect x="0" y="0" width="${phoneW}" height="${phoneH}" rx="56" ry="56" fill="url(#frame)"/>
    <rect x="${screenInsetX}" y="${screenInsetY}" width="${screenW}" height="${screenH}" rx="44" ry="44" fill="#0F172A"/>
    <!-- Notch -->
    <rect x="${phoneW / 2 - 60}" y="22" width="120" height="28" rx="14" ry="14" fill="#000"/>
  </g>
</svg>`;

  const phoneBuf = await sharp(Buffer.from(phoneSvg), { density: 96 }).resize(phoneW, phoneH).png().toBuffer();

  // Resize screenshot to fit screen, then mask to rounded rect
  let screenComposite;
  if (screenshotBuf) {
    const resized = await sharp(screenshotBuf).resize(screenW, screenH, { fit: "cover" }).png().toBuffer();
    const screenMask = `<svg xmlns="http://www.w3.org/2000/svg" width="${screenW}" height="${screenH}"><rect x="0" y="0" width="${screenW}" height="${screenH}" rx="44" ry="44" fill="#fff"/></svg>`;
    screenComposite = await sharp(resized)
      .composite([{ input: Buffer.from(screenMask), blend: "dest-in" }])
      .png()
      .toBuffer();
  } else {
    // Fallback: render a simple battery UI inside
    const inner = `<svg xmlns="http://www.w3.org/2000/svg" width="${screenW}" height="${screenH}" viewBox="0 0 ${screenW} ${screenH}">
      <rect width="${screenW}" height="${screenH}" rx="44" fill="#FFFFFF"/>
      <text x="${screenW / 2}" y="180" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="22" fill="${MUTED}">Battery</text>
      <text x="${screenW / 2}" y="270" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="92" font-weight="800" fill="${PRIMARY}">87%</text>
      <rect x="40" y="320" width="${screenW - 80}" height="20" rx="10" fill="${WASH}"/>
      <rect x="40" y="320" width="${(screenW - 80) * 0.87}" height="20" rx="10" fill="${PRIMARY}"/>
    </svg>`;
    screenComposite = await sharp(Buffer.from(inner), { density: 96 }).resize(screenW, screenH).png().toBuffer();
  }

  // Composite phone first; then screen on top of phone aligned with frame rect
  const phoneWithScreen = await sharp(phoneBuf)
    .composite([{ input: screenComposite, top: screenInsetY, left: screenInsetX }])
    .png()
    .toBuffer();

  const og = await sharp(bgBuf)
    .composite([{ input: phoneWithScreen, top: phoneY, left: phoneX }])
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  await fs.writeFile(path.join(PUBLIC, outName), og);
  return og.length;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const results = {};
results.faviconBytes = await buildFavicon();
results.appleTouchBytes = await buildAppleTouch();
await buildPwa();
await buildMarketingIcons();
results.ogBytes = await buildOg(1200, 630, "og.png");
results.twitterBytes = await buildOg(1200, 600, "twitter-card.png");

// Verify og.png dimensions
const ogMeta = await sharp(path.join(PUBLIC, "og.png")).metadata();
results.ogMeta = { width: ogMeta.width, height: ogMeta.height };
console.log(JSON.stringify(results, null, 2));
