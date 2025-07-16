import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  methods: {
    onClickIcon() {
      Toast({
        context: this,
        selector: '#smart-toast-good-action',
        message: I18n.t('clickTheIcon')
      });
    },

    onClickButton() {
      Toast({
        context: this,
        selector: '#smart-toast-good-action',
        message: I18n.t('clickTheButton')
      });
    },
  },
});
