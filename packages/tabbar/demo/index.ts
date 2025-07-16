import Tornado from '@tuya-miniapp/icons/dist/svg/Tornado';
import Timer from '@tuya-miniapp/icons/dist/svg/Timer';
import TorSnownado from '@tuya-miniapp/icons/dist/svg/Snow';
import Connect from '@tuya-miniapp/icons/dist/svg/Connect';
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
    defaultIcon3: TorSnownado,
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
      wx.showToast({ title: `点击标签 ${event.detail + 1}`, icon: 'none' });
    },
  },
});
