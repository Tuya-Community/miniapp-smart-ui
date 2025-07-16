import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    show: false,
  },

  methods: {
    onChange({ detail }) {
      this.setData({ show: detail });
    },
  },
});
