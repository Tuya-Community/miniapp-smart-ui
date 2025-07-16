import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    activeTab: 0,
  },

  methods: {
    onChange(event) {
      this.setData({
        activeTab: event.detail.name,
      });
    },
  },
});
