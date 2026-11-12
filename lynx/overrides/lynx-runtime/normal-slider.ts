import { point, endsTouch, snap, clamp, thumbPattern } from './model';
import { getRect } from '../common/utils';

export function normalSlider(options: any) {
  const oldCreated = options.created;
  options.created = function (this: any) {
    oldCreated?.call(this);
    this.refreshNormal();
  };
  options.destroyed = function (this: any) {
    this._normalDisposed = true;
    this._normalPress = null;
  };
  const refresh = function (this: any) {
    const { data } = this;
    const value = snap(+data.value, +data.min, +data.max, +data.step);
    const progress = data.max > data.min ? (value - data.min) / (data.max - data.min) : 0;
    const ratio = data.reverse ? 1 - progress : progress;
    const vertical = data.direction === 'vertical';
    const styles: string[] = [];
    const replace = (s: unknown, v: number) =>
      String(s).replace(/\{\{\s*text\s*\}\}|\$value/g, String(v));
    const cssKey = (key: string) => key.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
    Object.entries(data.thumbStyleCalc || {}).forEach(([key, value]) =>
      styles.push(cssKey(key) + ':' + replace(value, +data.value))
    );
    Object.entries(data.thumbStyleRenderFormatter || {}).forEach(([key, pattern]) =>
      styles.push(cssKey(key) + ':' + thumbPattern(String(pattern), value, data))
    );
    const count =
      data.showSteps && data.step > 0
        ? Math.min(1000, Math.floor((data.max - data.min) / data.step))
        : 0;
    this.setData({
      normalValue: value,
      normalRatio: ratio * 100,
      normalProgress: progress * 100,
      normalVertical: vertical,
      normalStart: data.reverse ? ratio * 100 : 0,
      normalThumbExtra: styles.join(';'),
      normalLabel: data.textTemplate ? replace(data.textTemplate, value) : String(value),
      normalSteps:
        count > 0
          ? Array.from({ length: count + 1 }, (_, i) => ({
              position: (100 * i) / count,
              active: data.reverse ? i / count >= ratio : i / count <= ratio,
            }))
          : [],
    });
  };
  options.methods.refreshNormal = refresh;
  Object.keys(options.props).forEach(key => {
    const p = options.props[key];
    options.props[key] =
      typeof p === 'object' && p !== null
        ? { ...p, observer: refresh }
        : { type: p, observer: refresh };
  });
  options.methods.applyNormal = function (this: any) {
    const g = this._normalPress;
    if (!g?.rect || this.data.disable) return;
    const total = this.data.direction === 'vertical' ? g.rect.height : g.rect.width;
    if (!(total > 0)) return;
    const start = this.data.direction === 'vertical' ? g.rect.top : g.rect.left;
    const useAbsolute = this.data.enableTouch && !g.onThumb;
    let ratio = useAbsolute ? (g.latest - start) / total : g.ratio + (g.latest - g.value) / total;
    ratio = clamp(ratio, 0, 1);
    if (this.data.reverse) ratio = 1 - ratio;
    const value = snap(
      +this.data.min + ratio * (this.data.max - this.data.min),
      +this.data.min,
      +this.data.max,
      +this.data.step
    );
    if (g.started !== true) {
      g.started = true;
      this.$emit('start', { value: g.original });
    }
    if (value !== this.data.normalValue) {
      this.setData({ value, normalTouched: true });
      this.refreshNormal();
      this.$emit('change', { value });
    }
    if (g.ended) {
      this._normalPress = null;
      this.$emit('end', { value });
    }
  };
  options.methods.onNormalStart = function (this: any, event: any) {
    if (this.data.disable || this.data.hidden) return;
    const p = point(event, this.data.direction === 'vertical' ? 'y' : 'x');
    if (!p || p.space !== 'client') return;
    const onThumb = !!event.currentTarget.dataset.thumb;
    if (!onThumb && !this.data.enableTouch && !this.data.enableTouchBar) return;
    const press = {
      ...p,
      onThumb,
      ratio: this.data.normalRatio / 100,
      latest: p.value,
      original: this.data.normalValue,
      started: false,
    };
    this._normalPress = press;
    getRect(this, '.smart-normal-slider__track').then(rect => {
      if (!rect || this._normalDisposed || this._normalPress !== press) return;
      this._normalPress.rect = rect;
      this.applyNormal();
    });
  };
  options.methods.onNormalMove = function (this: any, event: any) {
    const g = this._normalPress;
    if (!g) return;
    const p = point(event, this.data.direction === 'vertical' ? 'y' : 'x', g.identifier);
    if (!p || p.space !== g.space) return;
    g.latest = p.value;
    this.applyNormal();
  };
  options.methods.onNormalEnd = function (this: any, event: any) {
    const g = this._normalPress;
    if (!g || !endsTouch(event, g.identifier)) return;
    const p = point(event, this.data.direction === 'vertical' ? 'y' : 'x', g.identifier);
    if (p) g.latest = p.value;
    g.ended = true;
    this.applyNormal();
  };
  options.methods.onNormalCancel = function (this: any) {
    const g = this._normalPress;
    this._normalPress = null;
    if (!g) return;
    this.setData({ value: g.original });
    this.refreshNormal();
    this.$emit('change', { value: g.original });
    this.$emit('cancel', { value: g.original });
  };
}
