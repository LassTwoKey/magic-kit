/**
 * Конвертация Hex → RGB.
 * Поддерживает 3- и 6-символьные форматы, с `#` или без.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace('#', '');

  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }

  const num = parseInt(h, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Конвертация RGB (0-255) → Hex (#RRGGBB).
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Конвертация HSV → RGB.
 * h: 0-360, s: 0-100, v: 0-100 → { r, g, b } (0-255)
 */
export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const sNorm = s / 100;
  const vNorm = v / 100;

  const c = vNorm * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vNorm - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Конвертация RGB → HSV.
 * r, g, b: 0-255 → { h: 0-360, s: 0-100, v: 0-100 }
 */
export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;

  let h = 0;

  if (d !== 0) {
    if (max === rNorm) {
      h = 60 * (((gNorm - bNorm) / d) % 6);
    } else if (max === gNorm) {
      h = 60 * ((bNorm - rNorm) / d + 2);
    } else {
      h = 60 * ((rNorm - gNorm) / d + 4);
    }
  }

  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;

  return { h: Math.round(h), s: Math.round(s), v: Math.round(v) };
}

/**
 * Конвертация Hex → HSV.
 */
export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsv(r, g, b);
}

/**
 * Конвертация HSV → Hex.
 */
export function hsvToHex(h: number, s: number, v: number): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}
