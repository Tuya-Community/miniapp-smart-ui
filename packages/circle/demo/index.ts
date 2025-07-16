import { SmartComponent } from '../../common/component';

const format = rate => Math.min(Math.max(rate, 0), 100);

SmartComponent({
  data: {
    gradientColor: {
      '0%': '#2361DE',
      '50%': '#23DEB5',
    },
  },
  methods: {
    run(e) {
      const step = parseFloat(e.currentTarget.dataset.step);
      this.setData({
        value: format((this.data.value += step)),
      });
    },
  },
});
