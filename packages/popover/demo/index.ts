import { SmartComponent } from '../../common/component';
import { Sun } from '@tuya-miniapp/icons';

SmartComponent({
  data: {
    sunMaxFill: Sun,
    show: true,
    controlledShow: false,
  },

  methods: {
    onShow(e) {
      this.setData({ show: e.detail });
    },
    onToggleControlled() {
      this.setData({
        controlledShow: !this.data.controlledShow,
      });
    },
    onToggleControlledClose() {
      this.setData({
        controlledShow: false,
      });
    },
  },
});
