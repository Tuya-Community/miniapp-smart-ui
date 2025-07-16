import * as icons from '@tuya-miniapp/icons';
import iconsConfig from '@tuya-miniapp/icons/dist/config';
import { SmartComponent } from '../../common/component';

function kebabCase(name: string) {
  const currName = name.replace(
    /[A-Z]/g,
    (word) => '-' + word.toLocaleLowerCase()
  );
  return currName.slice(1);
}

const iconsArr = iconsConfig.map((name) => ({
  name: kebabCase(name),
  value: icons[name],
}));

SmartComponent({
  data: {
    active: 0,
    icons: iconsArr,
    iconWarning: icons.Warning,
    iconAlarm: icons.Alarm,
  },

  methods: {
    onSwitch(event) {
      this.setData({
        active: event.detail.index,
      });
    },
  },
});
