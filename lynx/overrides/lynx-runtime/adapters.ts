import {
  pickerRows,
  pickerTextColor,
  pickerTextWeight,
  pickerEdges,
  point,
  endsTouch,
  selectIndex,
  resolveColor,
  iconSource,
  svgSource,
  imageVisual,
  snap,
  clamp,
  calendarParts,
} from './model';
import { icons } from './icons';
import { themeVars, paletteConsumer, configProvider } from './palette';
import { normalSlider } from './normal-slider';
import { getRect } from '../common/utils';

declare const ty: any;

type Options = Record<string, any>;
function hook(options: Options, name: string, callback: (this: any, ...args: any[]) => void) {
  const previous = options[name];
  options[name] = function (this: any, ...args: any[]) {
    previous?.apply(this, args);
    callback.apply(this, args);
  };
}
function observe(options: Options, keys: string[], refresh: string) {
  keys.forEach(key => {
    const prop = options.props[key];
    const definition = typeof prop === 'object' && prop !== null ? { ...prop } : { type: prop };
    const old = definition.observer;
    definition.observer = function (this: any, ...args: any[]) {
      if (typeof old === 'function') old.apply(this, args);
      else if (old) this[old]?.(...args);
      this[refresh]?.();
    };
    options.props[key] = definition;
  });
}

function theme(options: Options, method: string) {
  paletteConsumer(options, method);
  hook(options, 'created', function (this: any) {
    this._refreshLynxTheme = () => this[method]?.();
    // Public host API, optional on WeChat. No global polling/timer.
    const host = typeof ty !== 'undefined' ? ty : wx;
    host.onThemeChange?.(this._refreshLynxTheme);
    this[method]();
  });
  hook(options, 'destroyed', function (this: any) {
    const host = typeof ty !== 'undefined' ? ty : wx;
    host.offThemeChange?.(this._refreshLynxTheme);
  });
}
function color(owner: any, value: string, fallback?: string) {
  return resolveColor(value, themeVars(owner), fallback);
}

function icon(options: Options) {
  options.methods.refreshLynxIcon = function (this: any) {
    const { name, color: explicit, customStyle } = this.data;
    const styleColor = /(?:^|;)\s*color\s*:\s*([^;]+)/.exec(customStyle || '')?.[1];
    const resolved = color(
      this,
      explicit || styleColor || 'var(--icon-color, var(--app-B4-N1, #323233))'
    );
    const key = name?.replace(/[-_]/g, '').toLowerCase();
    const src = iconSource(icons[key] || name || '', resolved);
    this.setData({ lynxIconSrc: src, lynxIconSvg: svgSource(src) });
  };
  observe(options, ['name', 'color', 'customStyle'], 'refreshLynxIcon');
  theme(options, 'refreshLynxIcon');
}

function image(options: Options) {
  options.methods.refreshLynxImage = function (this: any) {
    const tint = this.data.tintColor ? color(this, this.data.tintColor) : '';
    const visual = imageVisual(this.data.src, tint, this.data.fit);
    this.setData({ lynxImageTint: tint, lynxImageMask: visual.mask, lynxImageSvg: visual.svg });
  };
  observe(options, ['src', 'tintColor', 'fit'], 'refreshLynxImage');
  theme(options, 'refreshLynxImage');
}

function calendar(options: Options) {
  options.methods.refreshLynxCalendar = function (this: any) {
    const { type, originCurrentDateMonthly, months, visibleIndex } = this.data;
    this.setData({
      lynxCalendarDate: calendarParts(
        type === 'month' ? originCurrentDateMonthly : months?.[visibleIndex]
      ),
    });
  };
  options.watch = { ...(options.watch || {}) };
  ['type', 'months', 'visibleIndex', 'originCurrentDateMonthly'].forEach(key => {
    hook(options.watch, key, function (this: any) {
      this.refreshLynxCalendar();
    });
  });
  hook(options, 'created', function (this: any) {
    this.refreshLynxCalendar();
  });
}

function calendarMonth(options: Options) {
  options.methods.refreshLynxCalendarMonth = function (this: any) {
    this.setData({ lynxMonthDate: calendarParts(this.data.date) });
  };
  observe(options, ['date'], 'refreshLynxCalendarMonth');
  hook(options, 'created', function (this: any) {
    this.refreshLynxCalendarMonth();
  });
}

function loading(options: Options) {
  options.methods.refreshLynxLoading = function (this: any) {
    const value = color(
      this,
      this.data.iconColor || this.data.color || 'var(--loading-spinner-color, #1989FA)'
    );
    this.setData({
      lynxLoadingColor: value,
      lynxLoadingSpokes: Array.from({ length: 8 }, (_, i) => i),
    });
  };
  observe(options, ['color', 'iconColor', 'type', 'size'], 'refreshLynxLoading');
  theme(options, 'refreshLynxLoading');
}

function picker(options: Options) {
  options.data = { ...(options.data || {}), lynxLayerReady: false };
  options.props.lynxDatetime = {
    type: Boolean,
    value: false,
    observer: 'refreshLynxPicker',
  };
  options.methods.refreshLynxPicker = function (this: any) {
    const edge = pickerEdges(themeVars(this), this.data.lynxDatetime);
    this.setData({ lynxPickerEdgeColor: edge.color, lynxPickerEdgeImage: edge.image });
  };
  theme(options, 'refreshLynxPicker');
  // The columns have an explicitly sized viewport and a local absolute origin.
  // Reveal their native drawing layer only after that viewport has been laid out.
  hook(options, 'mounted', function (this: any) {
    getRect(this, '.smart-picker__columns').then(rect => {
      if (!this._lynxDisposed && rect?.height > 0) this.setData({ lynxLayerReady: true });
    });
  });
  hook(options, 'destroyed', function (this: any) {
    this._lynxDisposed = true;
  });
}

function pickerColumn(options: Options) {
  const { methods } = options;
  methods.refreshLynxRows = function (this: any) {
    if (this._lynxDisposed) return;
    const vars = themeVars(this);
    const rows = pickerRows(this.data);
    this.setData({
      lynxTextColor: pickerTextColor(this.data, vars, false),
      lynxTextWeight: pickerTextWeight(this.data, vars, false),
      lynxOffset: rows[0]?.top || 0,
      lynxRows: rows.map(row => ({
        ...row,
        textColor: pickerTextColor(this.data, vars, row.selected),
        textWeight: pickerTextWeight(this.data, vars, row.selected),
      })),
    });
  };
  [
    'updateCurrentIndex',
    'updateVisibleOptions',
    'setIndex',
    'animationIndexChange',
    'activeIndexChange',
  ].forEach(name => {
    const original = methods[name];
    methods[name] = function (this: any, ...args: any[]) {
      const result = original?.apply(this, args);
      this.refreshLynxRows();
      return result;
    };
  });
  // Empty data and negative/out-of-bounds updates must not produce NaN.
  methods.setIndex = function (this: any, virtual: number) {
    const index = selectIndex(this.data.options, virtual, this.data.loop);
    this.setData({
      currentIndex: Math.max(0, index),
      animationIndex:
        this.data.loop && index >= 0
          ? virtual +
            index -
            (((virtual % this.data.options.length) + this.data.options.length) %
              this.data.options.length)
          : Math.max(0, index),
    });
    this.refreshLynxRows();
    return Promise.resolve();
  };
  methods.onLynxStart = function (this: any, event: any) {
    if (this.data.disabled || !this.data.options.length) return;
    const p = point(event, 'y');
    if (!p) return;
    this.setData({ lynxDragging: true });
    this._lynxTouch = {
      ...p,
      start: this.data.animationIndex || 0,
      last: p.value,
      time: Date.now(),
      velocity: 0,
    };
    this.animationStart();
  };
  methods.onLynxMove = function (this: any, event: any) {
    const gesture = this._lynxTouch;
    if (!gesture || this.data.disabled) return;
    const p = point(event, 'y', gesture.identifier);
    if (!p || p.space !== gesture.space) return;
    const now = Date.now();
    gesture.velocity = (gesture.last - p.value) / Math.max(1, now - gesture.time);
    gesture.last = p.value;
    gesture.time = now;
    const height = Math.max(1, this.data.itemHeight || 44);
    const value = gesture.start + (gesture.value - p.value) / height;
    this.setData({
      animationIndex: this.data.loop
        ? value
        : clamp(value, 0, Math.max(0, this.data.options.length - 1)),
    });
    this.refreshLynxRows();
  };
  methods.settleLynx = function (this: any, virtual: number) {
    const old = this.data.currentIndex;
    const index = selectIndex(this.data.options, virtual, this.data.loop);
    this.setIndex(virtual);
    if (index >= 0 && old !== index) {
      this.$emit('change', this.data.animationIndex);
      this.vibrateShort();
    }
    this.animationEnd();
  };
  methods.onLynxEnd = function (this: any, event: any) {
    const gesture = this._lynxTouch;
    if (!gesture || !endsTouch(event, gesture.identifier)) return;
    this._lynxTouch = null;
    this.setData({ lynxDragging: false });
    const momentum =
      Date.now() - gesture.time < 80
        ? clamp((gesture.velocity * 120) / Math.max(1, this.data.itemHeight || 44), -8, 8)
        : 0;
    this.settleLynx(Math.round(this.data.animationIndex + momentum));
  };
  methods.onLynxCancel = function (this: any) {
    if (!this._lynxTouch) return;
    const { start } = this._lynxTouch;
    this._lynxTouch = null;
    this.setData({ lynxDragging: false });
    this.setIndex(start);
    this.animationEnd();
  };
  methods.onLynxTap = function (this: any, event: any) {
    if (this.data.disabled) return;
    const { virtual } = event.currentTarget.dataset;
    this.settleLynx(Number(virtual));
  };
  observe(
    options,
    [
      'options',
      'activeIndex',
      'itemHeight',
      'visibleItemCount',
      'valueKey',
      'fontStyle',
      'activeStyle',
      'loop',
    ],
    'refreshLynxRows'
  );
  theme(options, 'refreshLynxRows');
  hook(options, 'destroyed', function (this: any) {
    this._lynxDisposed = true;
    this._lynxTouch = null;
    clearInterval(this.data.vibrateTimer);
  });
}

function slider(options: Options) {
  const { methods } = options;
  methods.format = function (this: any, value: number) {
    return snap(+value || 0, +this.data.min, +this.data.max, +this.data.step);
  };
  methods.getOffsetWidth = function (this: any, current: number, min: number) {
    return `${this.getScope() > 0 ? Math.max(0, ((current - min) * 100) / this.getScope()) : 0}%`;
  };
  const { calcOffset } = methods;
  methods.calcOffset = function (this: any) {
    return this.getScope() > 0 ? calcOffset.call(this) : '0%';
  };
  methods.onTouchStart = function (this: any, event: any) {
    if (this.data.disabled) return;
    const p = point(event, this.data.vertical ? 'y' : 'x');
    if (!p) return;
    this.buttonIndex = Number(event.currentTarget.dataset.index || 0);
    const token = (this._lynxGeneration || 0) + 1;
    this._lynxGeneration = token;
    this._lynxDrag = {
      ...p,
      origin: Array.isArray(this.value) ? this.value.slice() : this.value,
      latest: p.value,
      token,
      moving: false,
    };
    getRect(this, '.smart-slider').then(rect => {
      if (!rect || this._lynxDisposed || this._lynxDrag?.token !== token) return;
      this._lynxDrag.rect = rect;
      this.applyLynxDrag();
    });
  };
  methods.applyLynxDrag = function (this: any) {
    const g = this._lynxDrag;
    if (!g?.rect || !g.moving) return;
    const total = this.data.vertical ? g.rect.height : g.rect.width;
    if (!(total > 0)) return;
    const diff = ((g.latest - g.value) / total) * this.getRange();
    const next = Array.isArray(g.origin) ? g.origin.slice() : g.origin + diff;
    if (Array.isArray(next)) next[this.buttonIndex] += diff;
    this.newValue = next;
    this.updateValue(next, false, true);
  };
  methods.onTouchMove = function (this: any, event: any) {
    const g = this._lynxDrag;
    if (!g || this.data.disabled) return;
    const p = point(event, this.data.vertical ? 'y' : 'x', g.identifier);
    if (!p || p.space !== g.space) return;
    if (!g.moving) this.$emit('drag-start');
    g.moving = true;
    g.latest = p.value;
    this.applyLynxDrag();
  };
  methods.onTouchEnd = function (this: any, event: any) {
    const g = this._lynxDrag;
    if (!g || !endsTouch(event, g.identifier)) return;
    const final =
      event &&
      point({ changedTouches: event.changedTouches }, this.data.vertical ? 'y' : 'x', g.identifier);
    if (final && final.space === g.space) g.latest = final.value;
    this.applyLynxDrag();
    this._lynxDrag = null;
    if (g.moving && g.rect) {
      this._lynxSuppressTap = Date.now() + 300;
      this.updateValue(this.value, true);
    }
    if (g.moving) this.$emit('drag-end');
  };
  methods.onLynxCancel = function (this: any) {
    const g = this._lynxDrag;
    this._lynxDrag = null;
    if (g) this.updateValue(g.origin, false, true);
    if (g?.moving) this.$emit('drag-end');
  };
  methods.onClick = function (this: any, event: any) {
    if (this.data.disabled || Date.now() < (this._lynxSuppressTap || 0)) return;
    const token = (this._lynxGeneration || 0) + 1;
    this._lynxGeneration = token;
    getRect(this, '.smart-slider').then(rect => {
      if (!rect || this._lynxDisposed || token !== this._lynxGeneration) return;
      const touch = point(event, this.data.vertical ? 'y' : 'x');
      const coordinate = touch?.value ?? (this.data.vertical ? event.detail?.y : event.detail?.x);
      if (!Number.isFinite(coordinate) || touch?.space === 'page') return;
      const total = this.data.vertical ? rect.height : rect.width;
      if (!(total > 0)) return;
      const value =
        +this.data.min +
        ((coordinate - (this.data.vertical ? rect.top : rect.left)) / total) * this.getRange();
      if (this.isRange(this.value)) {
        const next = this.value.slice();
        next[value <= (next[0] + next[1]) / 2 ? 0 : 1] = value;
        this.updateValue(next, true);
      } else this.updateValue(value, true);
    });
  };
  hook(options, 'destroyed', function (this: any) {
    this._lynxDisposed = true;
    this._lynxDrag = null;
    this._lynxGeneration++;
  });
}

function bottomSheet(options: Options) {
  options.methods.onLynxDragStart = function (this: any, event: any) {
    const p = point(event, 'y');
    if (!p) return;
    this._lynxSheetDrag = {
      ...p,
      height: this.data.currentHeight || this.data.midDragHeight || this.data.windowHeight / 2,
    };
  };
  options.methods.onLynxDragMove = function (this: any, event: any) {
    const g = this._lynxSheetDrag;
    if (!g) return;
    const p = point(event, 'y', g.identifier);
    if (!p || p.space !== g.space) return;
    const max = this.data.lockMaxDrag ? this.data.maxDragHeight : this.data.windowHeight;
    this.setData({
      currentHeight: clamp(g.height + g.value - p.value, 0, max || this.data.windowHeight),
    });
  };
  options.methods.onLynxDragEnd = function (this: any) {
    if (!this._lynxSheetDrag) return;
    this._lynxSheetDrag = null;
    const value = this.data.currentHeight;
    if (this.data.closeDragHeight && value < this.data.closeDragHeight) return this.onClose();
    const positions = ['min', 'mid', 'max'];
    const h = this.data.windowHeight;
    const values = [
      this.data.minDragHeight || h * 0.1,
      this.data.midDragHeight || h * 0.5,
      this.data.maxDragHeight || h * 0.8,
    ].map(Number);
    let at = 0;
    values.forEach((v, i) => {
      if (Math.abs(v - value) < Math.abs(values[at] - value)) at = i;
    });
    this.setData({ currentHeight: values[at] });
    this.$emit('drag-position', positions[at]);
  };
  options.methods.onLynxDragCancel = function (this: any) {
    if (this._lynxSheetDrag) this.setData({ currentHeight: this._lynxSheetDrag.height });
    this._lynxSheetDrag = null;
  };
  hook(options, 'destroyed', function (this: any) {
    this._lynxSheetDrag = null;
  });
}

export function adapt<T>(name: string | undefined, options: T): T {
  const adapters: Record<string, (options: Options) => void> = {
    icon,
    image,
    calendar,
    'calendar-month': calendarMonth,
    loading,
    circle: options => paletteConsumer(options, 'refresh'),
    'config-provider': configProvider,
    slider,
    'normal-slider': normalSlider,
    'picker-column': pickerColumn,
    picker,
    'bottom-sheet': bottomSheet,
  };
  const mutable = options as Options;
  if (name) adapters[name]?.(mutable);
  if (name && ['slider', 'normal-slider', 'picker-column', 'bottom-sheet'].includes(name))
    mutable.pageLifetimes = {
      ...(mutable.pageLifetimes || {}),
      hide(this: any) {
        this.onLynxCancel?.();
        this.onNormalCancel?.();
        this.onLynxDragCancel?.();
        this._lynxGeneration = (this._lynxGeneration || 0) + 1;
      },
    };
  return options;
}
