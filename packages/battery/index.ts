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
      value: 10,
      observer: 'init',
    },
    value: {
      type: Number,
      observer: 'init',
      value: 70,
    },
    highColor: {
      type: String,
      value: 'var(--app-B1-N1)',
    },
    middleColor: {
      type: String,
      value: 'var(--smart-ui-battery-body-middle-background)',
    },
    lowColor: {
      type: String,
      value: 'var(--smart-ui-battery-body-low-background)',
    },
    chargingColor: {
      type: String,
      value: 'var(--smart-ui-battery-body-charging-background)',
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
  },

  data: {
    insideColor: '',
    chargingSvg: '',
    insidePercent: 0,
    bodyStyle: '',
    dotStyle: '',
    zeroStyle: '',
    zeroInnerStyle: '',
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      const insidePercent = Math.round(Math.min(100, Math.max(0, Math.round(this.data.value))));
      const insideColor = this.calcColor(insidePercent);
      const sizeData = this.calcSize();

      let bodyStyle = '';
      let dotStyle = '';
      let zeroStyle = '';
      let zeroInnerStyle = '';

      if (sizeData) {
        const {
          width,
          height,
          dotWidth,
          dotHeight,
          dotPadding,
          zeroWidth,
          zeroHeight,
          zeroInnerWidth,
          zeroInnerHeight,
          borderRadius,
          dotBorderRadius,
          zeroBorderRadius,
        } = sizeData;

        const backgroundColorStyle = this.data.backgroundColor
          ? `background-color: ${this.data.backgroundColor};`
          : '';
        const isFull = String(insidePercent) === '100';
        if (this.data.type === 'horizontal') {
          bodyStyle = `width: ${height}px; height: ${width}px; border-radius: ${borderRadius}px; ${backgroundColorStyle}`;
          dotStyle = `width: ${dotHeight}px; height: ${dotWidth}px; margin-left: ${dotPadding}px; border-radius: ${dotBorderRadius}px; ${
            isFull ? '' : backgroundColorStyle
          }`;
          zeroStyle = `width: ${zeroHeight}px; height: ${zeroWidth}px; border-radius: ${zeroBorderRadius}px;`;
          zeroInnerStyle = `width: ${zeroInnerHeight}px; height: ${zeroInnerWidth}px;`;
        } else {
          bodyStyle = `width: ${width}px; height: ${height}px; border-radius: ${borderRadius}px; ${backgroundColorStyle}`;
          dotStyle = `width: ${dotWidth}px; height: ${dotHeight}px; margin-bottom: ${dotPadding}px; border-radius: ${dotBorderRadius}px; ${
            isFull ? '' : backgroundColorStyle
          }`;
          zeroStyle = `width: ${zeroWidth}px; height: ${zeroHeight}px; border-radius: ${zeroBorderRadius}px;`;
          zeroInnerStyle = `width: ${zeroInnerWidth}px; height: ${zeroInnerHeight}px;`;
        }
      }

      this.setData({
        insideColor,
        insidePercentStr:
          this.data.type === 'vertical' ? `height: ${insidePercent}%` : `width: ${insidePercent}%`,
        insideBotBgClass: String(insidePercent) === '100' ? 'high-bg' : 'base-bg',
        chargingSvg: this.toSvgCssBackground(chargingSvg),
        bodyStyle,
        dotStyle,
        zeroStyle,
        zeroInnerStyle,
      });
    },

    calcSize() {
      if (this.data.size === 0) {
        // 使用css变量的值
        return;
      }
      const width = 1 * this.data.size; // 10
      const height = 1.8 * this.data.size; // 18
      const borderRadius = this.data.size * 0.2; // 2

      const dotWidth = this.data.size * 0.4; // 4 !
      const dotHeight = this.data.size * 0.15; // 1.5 !
      const dotBorderRadius = this.data.size * 0.05; // 0.5
      const dotPadding = this.data.size * 0.05; // 0.5

      const zeroWidth = this.data.size * 0.4; // 4 !
      const zeroHeight = this.data.size * 1.6; // 16
      const zeroInnerWidth = this.data.size * 0.15; // 1.5 !
      const zeroInnerHeight = this.data.size * 1.6; // 16
      const zeroBorderRadius = this.data.size * 0.2; // 2
      return {
        width,
        height,
        dotWidth,
        dotHeight,
        dotPadding,
        zeroWidth,
        zeroHeight,
        zeroInnerWidth,
        zeroInnerHeight,
        borderRadius,
        dotBorderRadius,
        zeroBorderRadius,
      };
    },

    calcColor(value) {
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
      return `background-image: url("data:image/svg+xml,${res}"); width: 6px; height: 10px; background-repeat: no-repeat;`;
    },
  },
});
