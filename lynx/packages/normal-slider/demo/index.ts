import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    currentValue: 50,
    range: [10, 40],
  },

  methods: {
    onRangeChange(event) {
      this.setData({
        range: event.detail,
      });
    },
  },
});
