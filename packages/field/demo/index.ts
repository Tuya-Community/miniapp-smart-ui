import { SmartComponent } from '../../common/component';
import { Sun } from '@tuya-miniapp/icons';
SmartComponent({
  data: {
    value: '',
    password: '',
    num: 2000,
    value2: '12345',
    message: '',
    sunIcon: Sun,
    autoHeight: {
      maxHeight: 200,
      minHeight: 100,
    }
  },

  methods: {
    onClickIcon() {
      wx.showToast({
        icon: 'none',
        title: I18n.t('clickTheIcon'),
      });
    },
    onFieldFocus(e) {
      wx.showToast({
        icon: 'none',
        title: 'Focus: ' + JSON.stringify(e.detail),
      });
    },
    onFieldBlur(e) {
      wx.showToast({
        icon: 'none',
        title: 'Blur: ' + JSON.stringify(e.detail),
      });
    },
    onFieldClickIcon(e) {
      wx.showToast({
        icon: 'none',
        title: 'Click Icon',
      });
    },
    onFieldClickInput(e) {
      wx.showToast({
        icon: 'none',
        title: 'Click Input',
      });
    },
    onFieldClear(e) {
      wx.showToast({
        icon: 'none',
        title: 'Clear',
      });
    },
    onFieldConfirm(e) {
      wx.showToast({
        icon: 'none',
        title: 'Confirm: ' + e.detail,
      });
    },
    onFieldInput(e) {
      console.log('Input:', e.detail);
    },
    onFieldChange(e) {
      console.log('Change:', e.detail);
    },
  },
});
