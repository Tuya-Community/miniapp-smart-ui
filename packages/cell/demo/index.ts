import { Sun } from '@tuya-miniapp/icons';
import { Checkmark } from '@tuya-miniapp/icons';
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
