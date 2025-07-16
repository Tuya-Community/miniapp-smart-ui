import { SmartComponent } from '../../common/component';
import { Sun } from '@tuya-miniapp/icons';
SmartComponent({
  data: {
    value: '',
    password: '',
    num: 2000,
    value2: '12345',
    message: '',
    sunIcon: Sun
  },

  methods: {
    onClickIcon() {
      wx.showToast({
        icon: 'none',
        title: I18n.t('clickTheIcon'),
      });
    },
  },
});
