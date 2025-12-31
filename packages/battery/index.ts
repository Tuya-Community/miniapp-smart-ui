import { SmartComponent } from '../common/component';

const chargingSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="6px" height="10px" viewBox="0 0 6 10"><g><path d="M4.3636,1.1364C3.17988,2.32012,1.37897,4.12103,0.507568,4.99243C0.318579,5.18142,0.461728,5.5,0.729,5.5Q1.35,5.5,2.5,5.5Q1.64,7.435,1.1498,8.53795C1.01473,8.84185,1.40124,9.09876,1.6364,8.8636C2.82012,7.67988,4.62103,5.87897,5.49243,5.00757C5.68142,4.81858,5.55435,4.5,5.28708,4.5C4.54814,4.5,3.5,4.5,3.5,4.5C3.5,4.5,4.26261,2.78412,4.84601,1.47148C4.98108,1.16757,4.59876,0.901241,4.3636,1.1364" fill="#FFFFFF" fill-opacity="1"/></g></svg>';

SmartComponent({
  props: {
    type: {
      type: String,
      value: 'vertical',
    },
    size: {
      type: Number,
      value: 24,
      observer: 'init',
    },
    value: {
      type: Number,
      observer: 'init',
      value: 70,
    },
    highColor: {
      type: String,
      value: 'var(--battery-body-high-background, var(--app-B1-N1, rgba(0, 0, 0, 0.9)))',
    },
    middleColor: {
      type: String,
      value: 'var(--battery-body-middle-background, #ffcb00)',
    },
    lowColor: {
      type: String,
      value: 'var(--battery-body-low-background, #ee652e)',
    },
    chargingColor: {
      type: String,
      value: 'var(--battery-body-charging-background, #2fc755)',
    },
    inCharging: {
      type: Boolean,
      value: false,
    },
    backgroundColor: String,
    color: String,
    showText: {
      type: Boolean,
      value: false,
    },
    onCalcColor: null,
  },

  data: {
    insideColor: '',
    chargingSvg: '',
    insidePercent: 0,
    bodyStyle: '',
    dotStyle: '',
    zeroStyle: '',
    zeroInnerStyle: '',
    containStyle: '',
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      const { value, type, size } = this.data;
      const insidePercent = Math.round(Math.min(100, Math.max(0, Math.round(value))));
      const insideColor = this.calcColor(insidePercent);
      const containStyle = `width: ${size}px;height: ${size}px;`;
      const insidePercentStr =
        type === 'vertical' ? `height: ${insidePercent}%` : `width: ${insidePercent}%`;
      this.setData({
        insideColor,
        insidePercentStr,
        insideBotBgClass:
          String(insidePercent) === '100' ? 'smart-battery-high-bg' : 'smart-battery-base-bg',
        chargingSvg: this.toSvgCssBackground(chargingSvg),
        containStyle,
      });
    },

    calcColor(value) {
      if (typeof this.data.onCalcColor === 'function') {
        return this.data.onCalcColor();
      }
      if (this.data.color) {
        return this.data.color;
      }

      if (this.data.inCharging) {
        return this.data.chargingColor;
      }

      if (value > 50) {
        return this.data.highColor;
      }
      if (value > 20 && value <= 50) {
        return this.data.middleColor;
      }
      if (value <= 20) {
        return this.data.lowColor;
      }
    },
    toSvgCssBackground(svgString: string) {
      let res = svgString;
      res = svgString
        .replace(
          '<svg',
          ~svgString.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'
        )
        .replace(/"/g, "'")
        .replace(/%/g, '%25')
        .replace(/#/g, '%23')
        .replace(/{/g, '%7B')
        .replace(/}/g, '%7D')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')

        .replace(/\s+/g, ' ');
      return `background-image: url("data:image/svg+xml,${res}");`;
    },
  },
});
