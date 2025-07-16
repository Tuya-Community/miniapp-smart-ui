import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  methods: {
    onChange(event) {
      Toast({
        context: this,
        selector: '#smart-toast-slider',
        message: `${I18n.t('switchTo')}${event.detail}${I18n.t('item')}`
      });
    },
  },
});
