import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  data: {
    value: 1,
    value2: 1,
    value3: 1,
  },

  methods: {
    onChange(event) {
      Toast.loading({
        context: this,
        selector: '#smart-toast-stepper',
        forbidClick: true,
      });

      setTimeout(() => {
        Toast.clear();
        this.setData({ value: event.detail });
      }, 500);
    },

    onFocus(event) {
      Toast({
        context: this,
        selector: '#smart-toast-stepper',
        message: `Focus: ${JSON.stringify(event.detail)}`,
      });
    },

    onBlur(event) {
      Toast({
        context: this,
        selector: '#smart-toast-stepper',
        message: `Blur: value is ${event.detail.value}`,
      });
      this.setData({ value3: event.detail.value });
    },

    onOverlimit(event) {
      Toast({
        context: this,
        selector: '#smart-toast-stepper',
        message: `Overlimit: ${event.detail}`,
      });
    },
  },
});
