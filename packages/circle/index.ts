import { SmartComponent } from '../common/component';
// @ts-ignore

SmartComponent({
  props: {
    className: String,
    style: String,
    size: {
      type: Number,
      value: 100,
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
    percent: {
      type: Number,
      value: 0,
      observer(val) {
        this.updateTransform(val);
      },
    },
    maskColor: {
      type: String,
      value: 'var(--app-B1)',
    },
  },

  data: { transformLeft: '', transformRight: '' },

  methods: {
    updateTransform(val) {
      const percent = Math.min(100, Math.max(0, val));
      const deg = (percent / 100) * 360;
      this.setData({
        transformLeft: `rotate(${deg >= 180 ? deg - 180 : 0}deg)`,
        transformRight: `rotate(${deg < 180 ? deg : 180}deg)`,
      });
    },
  },
});
