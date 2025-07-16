import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    radio1: '1',
    radio2: '2',
    radio3: '1',
    radio4: '1',
    radio5: '1',
    radioSize: '1',
    radioLabel: '1',
    radioShape: '1',
    icon: {
      normal:
        'https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png',
      active:
        'https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png',
    },
  },

  methods: {
    onChange(event) {
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: event.detail });
    },

    onClick(event) {
      const { name } = event.currentTarget.dataset;
      this.setData({
        radio5: name,
      });
    },
  },
});
