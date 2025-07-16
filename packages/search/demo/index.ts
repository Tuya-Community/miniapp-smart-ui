import { SmartComponent } from '../../common/component';
import { TriangleDown } from '@tuya-miniapp/icons';

SmartComponent({
  data: {
    value: '',
    icon: TriangleDown,
  },

  methods: {
    onChange(e) {
      this.setData({
        value: e.detail,
      });
    },

    onSearch(event) {
      if (event.detail) {
        wx.showToast({
          title: I18n.t('searchText') + ': ' + event.detail,
          icon: 'none',
        });
      }
    },

    onClick() {
      if (this.data.value) {
        wx.showToast({
          title: I18n.t('searchText') + ': ' + this.data.value,
          icon: 'none',
        });
      }
    },

    onCancel() {
      wx.showToast({
        title: I18n.t('cancel'),
        icon: 'none',
      });
    },

    onClear() {
      wx.showToast({
        title: I18n.t('clear'),
        icon: 'none',
      });
    },
  },
});
