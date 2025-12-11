/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
import { SmartComponent } from '../common/component';
// @ts-ignore
import Render from './index.rjs';

const idListRef = {
  value: [] as string[],
};

SmartComponent({
  props: {
    className: String,
    customStyle: String,
    size: {
      type: String,
      value: '100px',
    },
    trackWidth: {
      type: Number,
      value: 10,
    },
    trackColor: {
      type: String,
      value: '#d3d3d3',
    },
    fillColor: {
      type: String,
      value: '#007AFF',
    },
    maskColor: {
      type: String,
      value: 'transparent',
    },
    fillColorStops: {
      type: null,
    },
    angleOffset: {
      type: Number,
      value: -1,
    },
    percent: {
      type: Number,
      value: 0,
      observer(val) {
        if (this.render && this.data.dpr) {
          this.render.init(this.data, this.data.angleOffset);
        }
      },
    },
    mode: {
      type: String,
      // basic | angle
      value: 'basic',
    },
    round: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    canvasId: '',
    dpr: 0,
    width: 100,
    height: 100,
  },
  watch: {
    dpr() {
      if (this.render) {
        this.render.init(this.data, this.data.angleOffset);
      }
    },
  },
  created() {
    this.initId();
    this.initSize();
    this.render = new Render(this);
  },
  mounted() {
    this.initRate();
  },

  destroyed() {
    idListRef.value = idListRef.value.filter(id => id !== this.data.canvasId);
  },

  methods: {
    initId() {
      if (this.data.canvasId) return;
      const id = `smart-ui-circle_${String(+new Date()).slice(-4)}_${String(Math.random()).slice(
        -2
      )}`;
      if (idListRef.value.includes(id)) {
        this.initId();
        return;
      }
      this.setData({
        canvasId: id,
      });
      idListRef.value.push(id);
    },
    initSize() {
      const sizeVal = this.parseSize();
      this.setData({
        width: +sizeVal,
        height: +sizeVal,
      });
    },
    parseSize() {
      if (typeof this.data.size === 'number') return this.data.size;
      if (typeof this.data.size === 'string') {
        const res = this.data.size.match(/\d+/);
        if (res) {
          return res[0];
        }
      }

      return this.data.size;
    },
    initRate() {
      wx.getSystemInfo({
        success: res => {
          const dpr = res.pixelRatio; // 获取设备像素比
          const sizeVal = this.parseSize();
          const params = {
            canvasWidth: +sizeVal,
            canvasHeight: +sizeVal,
            width: +sizeVal,
            height: +sizeVal,
            lineWidth: this.data.trackWidth,
            dpr: dpr,
            canvasId: this.data.canvasId,
          };

          this.setData(params);
        },
      });
    },
  },
});
