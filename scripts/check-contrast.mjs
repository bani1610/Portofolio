/**
 * Verifies the colour tokens against DESIGN.md §2.4.
 *
 * "Setiap kali token warna diubah, verifikasi ulang sebelum merge."
 * That instruction only holds if verifying is one command, so this
 * parses the real globals.css rather than a copy that can drift.
 *
 * Run: node scripts/check-contrast.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'src/app/globals.css'), 'utf8');

/** Reads `--name: oklch(L C H)` pairs out of one CSS block. */
function parseBlock(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`block not found: ${selector}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const body = css.slice(open, close);

  const tokens = {};
  const re = /--([\w-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/g;
  let m;
  while ((m = re.exec(body))) {
    tokens[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])];
  }
  return tokens;
}

// OKLCH -> linear sRGB -> gamma-encoded sRGB.
function oklchToSrgb([L, C, hDeg]) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((v) => {
    const c = Math.max(0, Math.min(1, v));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  });
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((v) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(c1, c2) {
  const a = luminance(oklchToSrgb(c1));
  const b = luminance(oklchToSrgb(c2));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

// The table in DESIGN.md §2.4, plus text-on-card which §2.4 implies but
// does not list — card is where most body text actually sits.
const CHECKS = [
  ['foreground / background', 'foreground', 'background', 4.5],
  ['muted-foreground / background', 'muted-foreground', 'background', 4.5],
  ['primary-foreground / primary', 'primary-foreground', 'primary', 4.5],
  ['input / background', 'input', 'background', 3.0],
  ['ring / background', 'ring', 'background', 3.0],
  ['foreground / card', 'foreground', 'card', 4.5],
  ['muted-foreground / card', 'muted-foreground', 'card', 4.5],
];

const THEMES = [
  ['DARK  (:root)', parseBlock(':root {')],
  ['LIGHT (.light)', parseBlock('.light {')],
];

let failures = 0;

for (const [name, tokens] of THEMES) {
  console.log(`\n== ${name} ==`);
  for (const [label, fg, bg, min] of CHECKS) {
    const a = tokens[fg];
    const b = tokens[bg];
    if (!a || !b) {
      console.log(`SKIP  ${label} (token missing)`);
      failures++;
      continue;
    }
    const ratio = contrast(a, b);
    const ok = ratio >= min;
    if (!ok) failures++;
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(32)} ${ratio.toFixed(2)}:1  (min ${min})`,
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} contrast requirement(s) not met — see DESIGN.md §2.4`);
  process.exit(1);
}
console.log('\nAll contrast requirements met (DESIGN.md §2.4).');
