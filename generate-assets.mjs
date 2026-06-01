/**
 * Gerador de ícones e splash screen — JARVIS
 * Desenha o ícone arc-reactor programaticamente (sem imagem externa)
 */

import { createCanvas } from 'canvas';
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

function drawJarvisIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  // ── Fundo circular escuro ──
  ctx.fillStyle = '#0a0e1a';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // ── Anel externo azul ──
  const ringGrad = ctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r * 0.92);
  ringGrad.addColorStop(0, 'rgba(0,212,255,0.9)');
  ringGrad.addColorStop(1, 'rgba(0,100,180,0.3)');
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
  ctx.stroke();

  // ── Anel interno fino ──
  ctx.strokeStyle = 'rgba(0,212,255,0.35)';
  ctx.lineWidth = size * 0.015;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();

  // ── Hexágono central (arc reactor) ──
  const hexR = r * 0.28;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + hexR * Math.cos(angle);
    const y = cy + hexR * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  const hexGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hexR);
  hexGrad.addColorStop(0, '#ffffff');
  hexGrad.addColorStop(0.3, '#00d4ff');
  hexGrad.addColorStop(1, '#0060a0');
  ctx.fillStyle = hexGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,212,255,0.8)';
  ctx.lineWidth = size * 0.02;
  ctx.stroke();

  // ── Raios do arc reactor (6 linhas do hexágono ao anel) ──
  ctx.strokeStyle = 'rgba(0,212,255,0.4)';
  ctx.lineWidth = size * 0.012;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    ctx.beginPath();
    ctx.moveTo(cx + hexR * Math.cos(angle), cy + hexR * Math.sin(angle));
    ctx.lineTo(cx + r * 0.62 * Math.cos(angle), cy + r * 0.62 * Math.sin(angle));
    ctx.stroke();
  }

  // ── Brilho central ──
  const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.25);
  glowGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
  glowGrad.addColorStop(0.4, 'rgba(0,212,255,0.4)');
  glowGrad.addColorStop(1, 'rgba(0,212,255,0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toBuffer('image/png');
}

function drawJarvisSplash(w, h) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Fundo
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#0a0e1a');
  bg.addColorStop(0.5, '#0d1f3c');
  bg.addColorStop(1, '#0a0e1a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Ícone centralizado (ligeiramente acima)
  const iconSize = Math.min(w, h) * 0.35;
  const cx = w / 2;
  const cy = h * 0.42;

  // Glow externo
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, iconSize * 0.8);
  glow.addColorStop(0, 'rgba(0,212,255,0.2)');
  glow.addColorStop(1, 'rgba(0,212,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, iconSize * 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Desenha ícone JARVIS
  const iconCanvas = createCanvas(iconSize, iconSize);
  const iconCtx = iconCanvas.getContext('2d');
  const buf = drawJarvisIcon(iconSize);
  // Redraw inline at position
  const r = iconSize / 2;
  const icx = r, icy = r;

  ctx.save();
  ctx.translate(cx - iconSize / 2, cy - iconSize / 2);

  // Fundo
  iconCtx.fillStyle = '#0a0e1a';
  iconCtx.beginPath();
  iconCtx.arc(icx, icy, r, 0, Math.PI * 2);
  iconCtx.fill();

  // Ring externo
  iconCtx.strokeStyle = 'rgba(0,212,255,0.9)';
  iconCtx.lineWidth = iconSize * 0.04;
  iconCtx.beginPath();
  iconCtx.arc(icx, icy, r * 0.82, 0, Math.PI * 2);
  iconCtx.stroke();

  // Ring interno
  iconCtx.strokeStyle = 'rgba(0,212,255,0.35)';
  iconCtx.lineWidth = iconSize * 0.015;
  iconCtx.beginPath();
  iconCtx.arc(icx, icy, r * 0.62, 0, Math.PI * 2);
  iconCtx.stroke();

  // Hexágono
  const hexR = r * 0.28;
  iconCtx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = icx + hexR * Math.cos(angle);
    const y = icy + hexR * Math.sin(angle);
    i === 0 ? iconCtx.moveTo(x, y) : iconCtx.lineTo(x, y);
  }
  iconCtx.closePath();
  const hg = iconCtx.createRadialGradient(icx, icy, 0, icx, icy, hexR);
  hg.addColorStop(0, '#ffffff');
  hg.addColorStop(0.3, '#00d4ff');
  hg.addColorStop(1, '#0060a0');
  iconCtx.fillStyle = hg;
  iconCtx.fill();

  // Raios
  iconCtx.strokeStyle = 'rgba(0,212,255,0.4)';
  iconCtx.lineWidth = iconSize * 0.012;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    iconCtx.beginPath();
    iconCtx.moveTo(icx + hexR * Math.cos(angle), icy + hexR * Math.sin(angle));
    iconCtx.lineTo(icx + r * 0.62 * Math.cos(angle), icy + r * 0.62 * Math.sin(angle));
    iconCtx.stroke();
  }

  // Brilho
  const gg = iconCtx.createRadialGradient(icx, icy, 0, icx, icy, r * 0.25);
  gg.addColorStop(0, 'rgba(255,255,255,0.9)');
  gg.addColorStop(0.4, 'rgba(0,212,255,0.4)');
  gg.addColorStop(1, 'rgba(0,212,255,0)');
  iconCtx.fillStyle = gg;
  iconCtx.beginPath();
  iconCtx.arc(icx, icy, r * 0.25, 0, Math.PI * 2);
  iconCtx.fill();

  ctx.drawImage(iconCanvas, 0, 0);
  ctx.restore();

  // Nome JARVIS
  const fontSize = Math.min(w, h) * 0.065;
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = `${fontSize * 0.3}px`;
  ctx.fillText('JARVIS', cx, cy + iconSize * 0.7);

  // Tagline
  const tagSize = Math.min(w, h) * 0.025;
  ctx.fillStyle = 'rgba(0,212,255,0.6)';
  ctx.font = `${tagSize}px Arial, sans-serif`;
  ctx.fillText('JUST A RATHER VERY INTELLIGENT SYSTEM', cx, cy + iconSize * 0.7 + tagSize * 2.2);

  return canvas.toBuffer('image/png');
}

// ── ÍCONES ──
console.log('Gerando ícones JARVIS...');
for (const [folder, size] of Object.entries(iconSizes)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  const buf = drawJarvisIcon(size);
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), buf);
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), buf);
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), buf);
  console.log(`  ✓ ${folder} (${size}x${size})`);
}

// ── SPLASH ──
console.log('\nGerando splash JARVIS...');
for (const [folder, { w, h }] of Object.entries(splashPort)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), drawJarvisSplash(w, h));
  console.log(`  ✓ ${folder} (${w}x${h})`);
}
for (const [folder, { w, h }] of Object.entries(splashLand)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), drawJarvisSplash(w, h));
  console.log(`  ✓ ${folder} (${w}x${h})`);
}

// ── Splash drawable padrão ──
fs.writeFileSync(path.join(ANDROID_BASE, 'drawable', 'splash.png'), drawJarvisSplash(1080, 1920));

console.log('\n✅ Assets JARVIS gerados!');
