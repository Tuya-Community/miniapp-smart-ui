import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    active: 0,
  },

  methods: {
    onSwitch(event) {
      this.setData({
        active: event.detail.index,
      });
    },
  },
});
