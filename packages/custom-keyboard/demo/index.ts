import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    value: '222',
  },

  methods: {
    onChange(v) {
      console.log('onChange value =====>', v.detail);
    },
    onConfirm(v) {
      console.log('onConfirm value ====>', v.detail);
    },
    handleBtn() {
      this.setData({ value: '1234' });
    },
  },
});
