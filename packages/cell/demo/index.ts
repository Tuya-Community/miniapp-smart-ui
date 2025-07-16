import * as icons from '@tuya-miniapp/icons';
import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    sunMaxFill: icons.Sun,
    checkMark: icons.Checkmark,
  },
  methods: {
    onNavTo() {
      // @ts-ignore
      ty.openInnerH5({ url: 'https://www.tuya.com', title: 'Tuya' });
    },
  },
});
