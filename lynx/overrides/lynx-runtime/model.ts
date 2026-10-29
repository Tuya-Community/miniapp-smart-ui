export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function calendarParts(value: number) {
  if (value === null || value === undefined) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    weekday: date.getDay(),
    days: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
  };
}

export function snap(value: number, min: number, max: number, step: number) {
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  if (max <= min) return min;
  return clamp(
    Number((min + Math.round((clamp(value, min, max) - min) / safeStep) * safeStep).toFixed(10)),
    min,
    max
  );
}

export function point(event: any, axis: 'x' | 'y', identifier?: number) {
  const touches = event.touches?.length ? event.touches : event.changedTouches;
  const touch =
    touches &&
    (identifier == null
      ? touches[0]
      : Array.from(touches).find((t: any) => t.identifier === identifier));
  if (!touch) return null;
  const key = axis === 'x' ? 'clientX' : 'clientY';
  const pageKey = axis === 'x' ? 'pageX' : 'pageY';
  return {
    value: touch[key] ?? touch[pageKey],
    identifier: touch.identifier,
    space: touch[key] == null ? 'page' : 'client',
  };
}

export function endsTouch(event: any, identifier?: number) {
  return (
    !event?.changedTouches ||
    identifier == null ||
    Array.from(event.changedTouches).some((t: any) => t.identifier === identifier)
  );
}

export function selectIndex(options: any[], wanted: number, loop: boolean) {
  const count = options.length;
  if (!count) return -1;
  const start = loop
    ? ((Math.round(wanted) % count) + count) % count
    : clamp(Math.round(wanted), 0, count - 1);
  for (let i = start; i < count; i++)
    if (options[i] !== undefined && !options[i]?.disabled) return i;
  for (let i = start - 1; i >= 0; i--)
    if (options[i] !== undefined && !options[i]?.disabled) return i;
  return -1;
}

export function resolveColor(
  value: string,
  vars: Record<string, string> = {},
  fallback = '#323233',
  depth = 0
): string {
  if (!value || value === 'currentColor' || depth > 10) return fallback;
  if (!value.startsWith('var(')) return value;
  const body = value.slice(4, -1);
  const split = body.indexOf(',');
  const key = (split < 0 ? body : body.slice(0, split)).trim();
  const next = vars[key] || (split < 0 ? fallback : body.slice(split + 1).trim());
  return resolveColor(next, vars, fallback, depth + 1);
}

export function pickerTextColor(data: any, vars: Record<string, string>, selected: boolean) {
  const styleColor = (style: string) => {
    let result = '';
    String(style || '')
      .split(';')
      .forEach(entry => {
        const match = /^\s*color\s*:\s*(.+?)\s*$/i.exec(entry);
        if (match) result = match[1].replace(/\s*!important\s*$/i, '');
      });
    return result === 'inherit' || result === 'currentColor' ? '' : result;
  };
  const normal = styleColor(data.fontStyle);
  const active = selected ? styleColor(data.activeStyle) : '';
  const token = selected ? '--picker-option-selected-text-color' : '--picker-option-text-color';
  // Resolve on the logic side: the current iOS host resolves the equivalent
  // inherited/nested CSS variables to transparent even though rows have text.
  return resolveColor(active || normal || `var(${token}, var(--app-B6-N1, #000000))`, vars);
}

export function pickerTextWeight(data: any, vars: Record<string, string>, selected: boolean) {
  let explicit = '';
  const style = `${data.fontStyle || ''};${selected ? data.activeStyle || '' : ''}`;
  style.split(';').forEach(entry => {
    const match = /^\s*font-weight\s*:\s*(.+?)\s*$/i.exec(entry);
    if (match) explicit = match[1].replace(/\s*!important\s*$/i, '');
  });
  const fallback = selected ? '700' : '500';
  const token = selected ? '--picker-option-selected-font-weight-bold' : '--font-weight-bold';
  return resolveColor(explicit || `var(${token}, ${fallback})`, vars, fallback);
}

export function pickerEdges(vars: Record<string, string>, datetime: boolean) {
  if (!datetime)
    return {
      color: resolveColor('var(--hairline-color, var(--app-B6-N7, rgba(0,0,0,0.1)))', vars),
      image: 'none',
    };
  const text = resolveColor('var(--app-B6-N1, #000000)', vars);
  const white = /^(#fff(?:fff)?|rgba?\(\s*255\s*,\s*255\s*,\s*255(?:\s*[,)]))/i.test(text);
  const rgb = white ? '255,255,255' : '0,0,0';
  const gradient = `linear-gradient(to right,rgba(${rgb},0),rgba(${rgb},0.3),rgba(${rgb},0))`;
  return {
    color: 'transparent',
    image: resolveColor(
      `var(--hairline-border-image-color, var(--smart-ui-border-image, ${gradient}))`,
      vars,
      gradient
    ),
  };
}

export function pickerRows(data: any) {
  const itemHeight = Math.max(1, data.itemHeight || 44);
  const visible = Math.max(1, data.visibleItemCount || 5);
  const count = data.options.length;
  const center = Math.round(data.animationIndex || 0);
  const half = Math.ceil(visible / 2) + 1;
  const rows: Array<{
    index: number;
    virtual: number;
    text: any;
    disabled: boolean;
    selected: boolean;
    top: number;
    opacity: number;
  }> = [];
  Array.from({ length: half * 2 + 1 }, (_, i) => i - half).forEach(offset => {
    const virtual = center + offset;
    if (!data.loop && (virtual < 0 || virtual >= count)) return;
    if (!count) return;
    const index = ((virtual % count) + count) % count;
    const option = data.options[index];
    const label =
      option && typeof option === 'object' && data.valueKey in option
        ? option[data.valueKey]
        : option;
    rows.push({
      index,
      virtual,
      text: label ?? '',
      disabled: !!option?.disabled,
      selected: index === data.currentIndex,
      top: (virtual - (data.animationIndex || 0) + (visible - 1) / 2) * itemHeight,
      opacity: Math.max(
        0.15,
        1 - Math.abs(virtual - (data.animationIndex || 0)) / (visible / 2 + 1)
      ),
    });
  });
  return rows;
}

export function xml(value: unknown) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function svgUri(svg: string) {
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export function svgSource(uri: string) {
  if (!uri?.startsWith('data:image/svg+xml,')) return '';
  try {
    const body = decodeURIComponent(uri.slice(uri.indexOf(',') + 1));
    return body.match(/<svg\b[\s\S]*<\/svg>/)?.[0] || '';
  } catch {
    return '';
  }
}

export function nativeHsl(input: string) {
  return input.replace(
    /hsla?\(\s*(-?[\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)/g,
    (_, h, s, l, a) => {
      const hue = (((Number(h) % 360) + 360) % 360) / 360;
      const sat = clamp(Number(s) / 100, 0, 1);
      const light = clamp(Number(l) / 100, 0, 1);
      const channel = (offset: number) => {
        const k = (offset + hue * 12) % 12;
        return Math.round(
          255 * (light - sat * Math.min(light, 1 - light) * Math.max(-1, Math.min(k - 3, 9 - k, 1)))
        );
      };
      const rgb = [channel(0), channel(8), channel(4)].join(',');
      return a == null ? `rgb(${rgb})` : `rgba(${rgb},${clamp(Number(a), 0, 1)})`;
    }
  );
}

export function thumbPattern(template: string, value: number, options: any) {
  const input = options.thumbStyleRenderValueReverse
    ? Number(options.max ?? 100) + Number(options.min ?? 0) - value
    : value;
  const scaled = Math.trunc(
    input * (options.thumbStyleRenderValueScale ?? 1) + (options.thumbStyleRenderValueStart ?? 0)
  );
  return nativeHsl(String(template).replace(/\{\{\s*text\s*\}\}|\$?value/g, String(scaled)));
}

export function iconSource(name: string, color: string) {
  if (!name) return '';
  if (name.startsWith('data:image/svg+xml')) {
    const comma = name.indexOf(',');
    if (name.slice(0, comma).includes(';base64')) return name;
    let svg: string;
    try {
      svg = decodeURIComponent(name.slice(comma + 1));
    } catch {
      return '';
    }
    const paints: string[] = [];
    svg.replace(/\b(?:fill|stroke)=["']([^"']+)["']/g, (whole, paint) => {
      if (paint !== 'none' && paint !== 'transparent' && !paint.startsWith('url('))
        paints.push(paint);
      return whole;
    });
    const palette = new Set(paints);
    if (palette.size === 1)
      svg = svg.replace(/\b(fill|stroke)=["']([^"']+)["']/g, (whole, key, value) =>
        palette.has(value) ? `${key}="${xml(color)}"` : whole
      );
    const fill = /<svg\b[^>]*\bfill=/.test(svg) ? '' : ` fill="${xml(color)}"`;
    return svgUri(svg.replace(/<svg\b/, '<svg' + fill).replace(/currentColor/g, xml(color)));
  }
  if (/^\s*[Mm][-\d\s.,]/.test(name)) {
    return svgUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="${xml(
        name
      )}" fill="${xml(color)}" fill-rule="evenodd"/></svg>`
    );
  }
  return name;
}

// Bitmap masks and SVG rendering are separate Lynx capabilities. Never feed an
// SVG URL/data URI into mask-image (unsupported by the native renderer).
export function imageVisual(src: string, tint: string, fit = 'fill') {
  const svg = tint ? svgSource(src) : '';
  if (svg) {
    return { svg: tint ? svgSource(iconSource(src, tint)) : svg, mask: '' };
  }
  if (!src || !tint || /^data:image\/svg\+xml/i.test(src) || /\.svg(?:[?#]|$)/i.test(src)) {
    // Remote/base64 SVG remains an ordinary Image. It needs SVG XML (or a
    // bitmap resource) before it can be safely recolored by svg-render.
    return { svg: '', mask: '' };
  }
  const size =
    {
      fill: '100% 100%',
      contain: 'contain',
      cover: 'cover',
      none: 'auto',
      widthFix: '100% auto',
      heightFix: 'auto 100%',
    }[fit] || '100% 100%';
  const url = src
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
  return {
    svg: '',
    mask: `mask-image:url("${url}");mask-size:${size};mask-position:center;mask-repeat:no-repeat;background-color:${tint};`,
  };
}

export function circleSvg(data: any) {
  const width = Math.max(1, Number(data.drawingSize) || parseFloat(data.size) || 100);
  const lineWidth = clamp(+data.trackWidth || 0, 0, width);
  const radius = (width - lineWidth) / 2;
  const percent = clamp(+data.percent || 0, 0, 100) / 100;
  const basic = data.mode === 'basic';
  const offset =
    data.angleOffset === -1 || data.angleOffset == null
      ? data.mode === 'angle2'
        ? 36
        : 1
      : Math.max(+data.angleOffset, 1);
  const start = basic ? 180 : 180 - offset;
  const sweep = basic ? 360 : 180 + offset * 2;
  const coord = (deg: number) =>
    `${width / 2 + radius * Math.cos((deg * Math.PI) / 180)} ${
      width / 2 + radius * Math.sin((deg * Math.PI) / 180)
    }`;
  const arc = (fraction: number) => {
    const angle = sweep * fraction;
    if (angle >= 359.999)
      return `M${coord(start)} A${radius} ${radius} 0 1 1 ${coord(
        start + 180
      )} A${radius} ${radius} 0 1 1 ${coord(start + 360)}`;
    return `M${coord(start)} A${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${coord(
      start + angle
    )}`;
  };
  const stops = Object.entries(data.fillColorStops || {}).sort(
    ([a], [b]) => parseFloat(a) - parseFloat(b)
  );
  const defs = stops.length
    ? `<defs><linearGradient id="fill" gradientUnits="userSpaceOnUse" x1="0" x2="${width}" y1="0" y2="0">${stops
        .map(
          ([at, color]) =>
            `<stop offset="${xml(at.includes('%') ? at : at + '%')}" stop-color="${xml(color)}"/>`
        )
        .join('')}</linearGradient></defs>`
    : '';
  const cap = data.round ? 'round' : 'butt';
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${width}">${defs}<path d="${arc(
      1
    )}${basic ? 'Z' : ''}" fill="${xml(data.maskColor || 'transparent')}" stroke="${xml(
      data.trackColor
    )}" stroke-width="${lineWidth}" stroke-linecap="${cap}"/>${
      percent > 0
        ? `<path d="${arc(percent)}" fill="none" stroke="${
            stops.length ? 'url(#fill)' : xml(data.fillColor)
          }" stroke-width="${lineWidth}" stroke-linecap="${cap}"/>`
        : ''
    }</svg>`
  );
}
