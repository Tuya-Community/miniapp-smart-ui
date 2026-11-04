import { SmartComponent } from '../common/component';
import { themeVars } from '../lynx-runtime/palette';
import { circleSvg, resolveColor, svgSource } from '../lynx-runtime/model';

declare const ty: any;
SmartComponent({
  props: {
    className: String,
    customStyle: String,
    size: { type: String, value: '100px' },
    trackWidth: { type: Number, value: 10 },
    trackColor: { type: String, value: '#d3d3d3' },
    fillColor: { type: String, value: '#007AFF' },
    maskColor: { type: String, value: 'transparent' },
    fillColorStops: null,
    angleOffset: { type: Number, value: -1 },
    percent: { type: Number, value: 0 },
    mode: { type: String, value: 'basic' },
    round: { type: Boolean, value: true },
  },
  watch: {
    'percent,mode,angleOffset,trackWidth,trackColor,fillColor,maskColor,fillColorStops,round'() {
      this.refresh();
    },
  },
  created() {
    this.refresh();
    this.themeListener = () => this.refresh();
    if (typeof ty !== 'undefined') ty.onThemeChange?.(this.themeListener);
  },
  destroyed() {
    if (typeof ty !== 'undefined') ty.offThemeChange?.(this.themeListener);
  },
  methods: {
    refresh() {
      const vars = themeVars(this);
      const data = { ...this.data };
      ['trackColor', 'fillColor', 'maskColor'].forEach(key => {
        data[key] = resolveColor(data[key], vars);
      });
      if (data.fillColorStops)
        data.fillColorStops = Object.fromEntries(
          Object.entries(data.fillColorStops).map(([at, value]) => [
            at,
            resolveColor(String(value), vars),
          ])
        );
      const uri = circleSvg(data);
      this.setData({ lynxCircleSrc: uri, lynxCircleSvg: svgSource(uri) });
    },
  },
});
