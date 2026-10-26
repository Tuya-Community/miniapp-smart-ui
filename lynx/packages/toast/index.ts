import { Success, Alarm, Error } from './icons';
import { SmartComponent } from '../common/component';
import { registerToastContext, unregisterToastContext } from './toast';
import appLog from '../common/appLog';

SmartComponent({
  props: {
    show: Boolean,
    mask: Boolean,
    message: String,
    forbidClick: Boolean,
    nativeDisabled: Boolean,
    iconColor: {
      type: String,
      value: 'white',
    },
    textColor: String,
    zIndex: {
      type: Number,
      value: 1000,
    },
    type: {
      type: String,
      value: 'text',
    },
    loadingType: {
      type: String,
      value: 'circular',
    },
    position: {
      type: String,
      value: 'middle',
    },
    width: {
      type: Number,
    },
  },
  data: {
    success: Success,
    error: Error,
    warn: Alarm,
  },
  mounted: function () {
    if (!this.id) return;
    const repeated = registerToastContext(`#${this.id}`, this);
    if (repeated) {
      console.error(`Toast component #${this.id} repeated!`);
      appLog.info(`Toast component #${this.id} repeated!`);
    }
    appLog.info(`Toast #${this.id} mounted`);
  },
  destroyed: function () {
    if (!this.id) return;
    unregisterToastContext(`#${this.id}`, this);
    appLog.info(`Toast #${this.id} destroyed`);
  },
  methods: {
    // for prevent touchmove
    noop() {},
  },
});
