import { SmartComponent } from '../../common/component';
import { Sun } from '@tuya-miniapp/icons';

SmartComponent({
  data: {
    sunMaxFill: Sun,
    show: true,
  },

  methods: {
    onShow(e) {
      this.setData({ show: e.detail });
    },
  },
});
