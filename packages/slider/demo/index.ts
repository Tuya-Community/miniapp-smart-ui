import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    currentValue: 50,
  },

  methods: {
    onChange(event) {
      wx.showToast({
        icon: 'none',
        title: `${I18n.t('currentValue')}${event.detail}`,
      });
    },

    onDrag(event) {
      this.setData({
        currentValue: event.detail.value,
      });
    },
    onDragStart(event) {
      wx.showToast({
        icon: 'none',
        title: 'Drag start',
      });
    },
    onDragEnd(event) {
      wx.showToast({
        icon: 'none',
        title: 'Drag end',
      });
    },
  },
});
