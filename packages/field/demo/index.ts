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
    },
    numberFormatValue: 12345.67,
    numberFormatValueDe: 12345.67,
  },

  methods: {
    onClickIcon() {
      wx.showToast({
        icon: 'none',
        title: I18n.t('clickTheIcon'),
      });
    },
    onNumberFormatInput(e) {
      this.setData({
        numberFormatValue: e.detail,
      });
      console.log(e.detail, '--onNumberFormatInput');
    },
    onNumberFormatInputDe(e) {
      this.setData({
        numberFormatValueDe: e.detail,
      });
      console.log(e.detail, '--onNumberFormatInputDe');
    },
  },
});
