import { SmartComponent } from '../../common/component';
import PlayIcon from '@tuya-miniapp/icons/dist/svg/Play';
import ReplayIcon from '@tuya-miniapp/icons/dist/svg/Refresh';
import PauseIcon from '@tuya-miniapp/icons/dist/svg/Pause';
import Toast from '../../toast/toast';

SmartComponent({
  data: {
    time: 30 * 60 * 60 * 1000,
    PlayIcon,
    ReplayIcon,
    PauseIcon,
    timeData: {},
  },

  methods: {
    onChange(e) {
      this.setData({
        timeData: e.detail,
      });
    },

    start() {
      const countDown = this.selectComponent('.control-count-down');
      countDown.start();
    },

    pause() {
      const countDown = this.selectComponent('.control-count-down');
      countDown.pause();
    },

    reset() {
      const countDown = this.selectComponent('.control-count-down');
      countDown.reset();
    },

    finished() {
      Toast({
        context: this,
        selector: '#smart-toast-count-down',
        message: I18n.t('countdownEnded'),
      });
    },
  },
});
