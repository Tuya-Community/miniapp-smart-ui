import { SmartComponent } from '../common/component';

const wrapBatteryD =
  'M6.5,0 C6.77614237,-5.07265313e-17 7,0.223857625 7,0.5 L7,1 L9.5,1 C10.3284271,1 11,1.67157288 11,2.5 L11,17.5 C11,18.3284271 10.3284271,19 9.5,19 L1.5,19 C0.671572875,19 0,18.3284271 0,17.5 L0,2.5 C0,1.67157288 0.671572875,1 1.5,1 L4,1 L4,0.5 C4,0.223857625 4.22385763,5.07265313e-17 4.5,0 L6.5,0 Z M9.5,2 L1.5,2 C1.22385763,2 1,2.22385763 1,2.5 L1,17.5 C1,17.7761424 1.22385763,18 1.5,18 L9.5,18 C9.77614237,18 10,17.7761424 10,17.5 L10,2.5 C10,2.22385763 9.77614237,2 9.5,2 Z';

SmartComponent({
  props: {
    type: {
      type: String,
      value: 'vertical',
    },
    size: {
      type: Number,
      value: 10,
    },
    value: {
      type: Number,
      observer: 'init',
      value: 70,
    },
    highColor: {
      type: String,
      value: '#70CF98',
    },
    middleColor: {
      type: String,
      value: '#F5A623',
    },
    lowColor: {
      type: String,
      value: '#FF4444',
    },
    backgroundColor: String,
    color: String
  },

  data: {
    svgUrl: '',
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      const bgColor = this.getBgColor();

      let IValue = this.data.value;

      if (IValue > 100) {
        IValue = 100;
      } else if (IValue < 0) {
        IValue = 0;
      }
      const top = 17 - ((17 - 3) * IValue) / 100;

      // 左上、右上、右下、左下
      const points = `2 ${top} 9 ${top} 9 17 2 17`;

      const insideColor = this.calcColor(top);

      const svgNode = `<svg
        width="${1.1 * this.data.size}px"
        height="${1.9 * this.data.size}px"
        viewBox="0 0 11 19"
      >
        <path d='${wrapBatteryD}' fill='${this.data.backgroundColor || bgColor}' />
        <polygon points='${points}' fill='${insideColor}' />
      </svg>`;

      this.setData({
        svgUrl: this.toSvgCssBackground(svgNode),
      });
    },

    getBgColor() {
      const WX: any = wx;
      const bgColor = WX.getThemeInfo();
      if (bgColor && bgColor['--app-B1-N3']) {
        return bgColor['--app-B1-N3'];
      }

      const d: any = wx.getSystemInfoSync();
      if (d && d.theme === 'light') {
        return '#fff';
      }
      return 'rgba(0, 0, 0, 0.5)';
    },

    calcColor(top) {
      // 自定义电量的颜色分配规则
      if (this.data.color) {
        return this.data.color;
      }
      if (top <= 14.2 && top >= 3) {
        return this.data.highColor;
      }
      if (top <= 15.6 && top > 14.2) {
        return this.data.middleColor;
      }
      return this.data.lowColor;
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
      return `background-image: url("data:image/svg+xml,${res}"); width: ${
        1.1 * this.data.size
      }px; height: ${1.9 * this.data.size}px; background-repeat: no-repeat; transform: ${
        this.data.type === 'horizontal' ? 'rotate(90deg)' : '0'
      }`;
    },
  },
});
