export function normalizeSvg(source: string) {
  if (typeof source !== 'string') throw new Error('SVG response must be text');
  const start = source.indexOf('<svg');
  const end = source.lastIndexOf('</svg>');
  if (start >= 0 && end < 0 && /^<svg\b[^>]*\/>\s*$/.test(source.slice(start))) {
    return source.slice(start).replace(/\/>\s*$/, '></svg>');
  }
  if (start < 0 || end < start) throw new Error('Invalid SVG document');
  return source.slice(start, end + 6);
}

export function svgDimensions(source: string) {
  const tag = source.slice(0, source.indexOf('>') + 1);
  const read = (key: string) => tag.match(new RegExp(`\\b${key}=["']([^"']*)["']`))?.[1];
  const box = (read('viewBox') || '')
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const dimension = (key: string, fallback: number) => {
    const value = read(key);
    return value && !value.includes('%') ? parseFloat(value) || fallback : fallback;
  };
  return { width: dimension('width', box[2] || 0), height: dimension('height', box[3] || 0) };
}

export function decodeSvgDataUri(uri: string) {
  const comma = uri.indexOf(',');
  if (comma < 0) throw new Error('Invalid SVG data URI');
  let content = uri.slice(comma + 1);
  if (uri.slice(0, comma).includes(';base64')) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let bits = 0;
    let count = 0;
    let escaped = '';
    for (let i = 0; i < content.length; i++) {
      const digit = alphabet.indexOf(content.charAt(i));
      if (digit >= 0) {
        bits = (bits << 6) | digit;
        count += 6;
        if (count >= 8) {
          count -= 8;
          escaped += `%${((bits >> count) & 255).toString(16).padStart(2, '0')}`;
        }
      }
    }
    content = decodeURIComponent(escaped);
  } else {
    content = decodeURIComponent(content);
  }
  return normalizeSvg(content);
}
