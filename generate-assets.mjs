/**
 * Gerador de ícones e splash screen — Barcelos na NET
 * Usa a logo oficial: logo.png
 */

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

const ANDROID_BASE = './android/app/src/main/res';

const iconSizes = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};

const splashPort = {
  'drawable-port-mdpi':    { w: 320,  h: 480  },
  'drawable-port-hdpi':    { w: 480,  h: 800  },
  'drawable-port-xhdpi':   { w: 720,  h: 1280 },
  'drawable-port-xxhdpi':  { w: 960,  h: 1600 },
  'drawable-port-xxxhdpi': { w: 1280, h: 1920 },
};

const splashLand = {
  'drawable-land-mdpi':    { w: 480,  h: 320  },
  'drawable-land-hdpi':    { w: 800,  h: 480  },
  'drawable-land-xhdpi':   { w: 1280, h: 720  },
  'drawable-land-xxhdpi':  { w: 1600, h: 960  },
  'drawable-land-xxxhdpi': { w: 1920, h: 1280 },
};

const logo = await loadImage('./logo.png');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  // Fundo branco (para ícones sem transparência no Android)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  // Logo com padding de 4%
  const pad = size * 0.04;
  ctx.drawImage(logo, pad, pad, size - pad * 2, size - pad * 2);
  return canvas.toBuffer('image/png');
}

function drawSplash(w, h) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Fundo branco limpo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Logo centralizada
  const iconSize = Math.min(w, h) * 0.40;
  const cx = w / 2 - iconSize / 2;
  const cy = h / 2 - iconSize / 2 - h * 0.04;
  ctx.drawImage(logo, cx, cy, iconSize, iconSize);

  // Nome do app
  ctx.fillStyle = '#1a5c50';
  ctx.font = `bold ${Math.min(w, h) * 0.046}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Barcelos na NET', w / 2, cy + iconSize + h * 0.07);

  // Tagline
  ctx.fillStyle = '#888888';
  ctx.font = `${Math.min(w, h) * 0.026}px Arial, sans-serif`;
  ctx.fillText('Notícias • Cultura • Entretenimento', w / 2, cy + iconSize + h * 0.11);

  return canvas.toBuffer('image/png');
}

// ── ÍCONES ──
console.log('Gerando ícones com logo oficial...');
for (const [folder, size] of Object.entries(iconSizes)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  const buf = drawIcon(size);
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), buf);
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), buf);
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), buf);
  console.log(`  ✓ ${folder} (${size}x${size})`);
}

// ── SPLASH PORTRAIT ──
console.log('\nGerando splash screens...');
for (const [folder, { w, h }] of Object.entries(splashPort)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), drawSplash(w, h));
  console.log(`  ✓ ${folder} (${w}x${h})`);
}

// ── SPLASH LANDSCAPE ──
for (const [folder, { w, h }] of Object.entries(splashLand)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), drawSplash(w, h));
  console.log(`  ✓ ${folder} (${w}x${h})`);
}

console.log('\n✅ Assets com logo original gerados!');
