import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  data: {
    value: 1,
  },

  methods: {
    onChange(event) {
      Toast.loading({
        context: this,
        selector: '#smart-toast-stepper',
        forbidClick: true,
        message: I18n.t('loading'),
      });

      setTimeout(() => {
        Toast.clear();
        this.setData({ value: event.detail });
      }, 500);
    },
  },
});
