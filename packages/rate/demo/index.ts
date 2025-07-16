import Icloud from '@tuya-miniapp/icons/dist/svg/Icloud';
import XmarkIcloud from '@tuya-miniapp/icons/dist/svg/XmarkIcloud';
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
        context: this,
        message: '当前值：' + event.detail,
      });
    },
  },
});
