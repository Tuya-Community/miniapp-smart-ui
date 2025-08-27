import Sun from '@tuya-miniapp/icons/dist/svg/Sun';
import Checkmark from '@tuya-miniapp/icons/dist/svg/Checkmark';
import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    sunMaxFill: Sun,
    checkMark: Checkmark,
  },
  methods: {
    onNavTo() {
      // @ts-ignore
      ty.openInnerH5({ url: 'https://www.tuya.com', title: 'Tuya' });
    },
  },
});
