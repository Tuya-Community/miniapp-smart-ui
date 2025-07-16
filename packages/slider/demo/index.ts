import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    currentValue: 50,
  },

  methods: {
    onChange(event) {
      wx.showToast({
        icon: 'none',
        title: `当前值：${event.detail}`,
      });
    },

    onDrag(event) {
      this.setData({
        currentValue: event.detail.value,
      });
    },
  },
});
