import icons from './config';
// import iconsConfig from '@tuya-miniapp/icons/dist/config';
import { SmartComponent } from '../../common/component';
function kebabCase(name: string) {
  const currName = name.replace(
    /[A-Z]/g,
    (word) => '-' + word.toLocaleLowerCase()
  );
  return currName.slice(1);
}
const svgPath =
  "M192 448C192 624.736 335.264 768 512 768s320-143.264 320-320a319.872 319.872 0 0 0-160-277.184V160a64 64 0 0 0-64-64h-192a64 64 0 0 0-64 64v10.816A319.872 319.872 0 0 0 192 448z m224-384h192a32 32 0 0 0 0-64h-192a32 32 0 0 0 0 64z";


const iconsArr = Object.keys(icons).map((name) => ({
  name: kebabCase(name),
  value: icons[name],
}));

SmartComponent({
  data: {
    active: 0,
    icons: iconsArr,
    iconWarning: icons.Warning,
    iconAlarm: icons.Alarm,
    svgPath,
  },

  methods: {
    onSwitch(event) {
      this.setData({
        active: event.detail.index,
      });
    },
  },
});
