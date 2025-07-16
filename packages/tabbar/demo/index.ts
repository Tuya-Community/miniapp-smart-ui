import { Tornado } from '@tuya-miniapp/icons';
import { Timer } from '@tuya-miniapp/icons';
import { Snow } from '@tuya-miniapp/icons';
import { Connect } from '@tuya-miniapp/icons';
import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    active: 0,
    active2: 'home',
    active3: 0,
    active4: 0,
    active5: 0,
    active6: 0,
    icon: {
      normal: '',
      active:
        'https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png',
    },
    defaultIcon1: Tornado,
    defaultIcon2: Timer,
    defaultIcon3: Snow,
    defaultIcon4: Connect,
  },

  methods: {
    onChange(event) {
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: event.detail });
    },

    handleChange(event) {
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: event.detail });
      wx.showToast({ title: `${I18n.t('clickTheTab')} ${event.detail + 1}`, icon: 'none' });
    },
  },
});
