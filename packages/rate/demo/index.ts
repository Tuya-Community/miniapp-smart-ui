import { Icloud } from '@tuya-miniapp/icons';
import { XmarkIcloud } from '@tuya-miniapp/icons';
import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  data: {
    value1: 3,
    value2: 3,
    value3: 3,
    value4: 2.5,
    value5: 4,
    value6: 3,
    value8: 2,
    icon: Icloud,
    voidIcon: XmarkIcloud,
  },

  methods: {
    onChange(event) {
      Toast({
        selector: '#smart-toast-rate',
        context: this,
        message: I18n.t('currentValue') + event.detail,
      });
    },
  },
});
