import { SmartComponent } from '../../common/component';
import { Sun } from '@tuya-miniapp/icons';

SmartComponent({
  data: {
    sunMaxFill: Sun,
    show: true,
  },

  methods: {
    onClose(e) {
      this.setData({ show: false });
    },
  },
});
