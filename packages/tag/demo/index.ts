import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    show: {
      success: true,
      primary: true,
    },
  },

  methods: {
    onClose(event) {
      this.setData({
        [`show.${event.target.id}`]: false,
      });
    },
  },
});
