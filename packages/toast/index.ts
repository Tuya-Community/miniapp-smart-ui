import Checkmark from '@tuya-miniapp/icons/dist/svg/Checkmark';
import Smark from '@tuya-miniapp/icons/dist/svg/Xmark';
import { SmartComponent } from '../common/component';

SmartComponent({
  props: {
    show: Boolean,
    mask: Boolean,
    message: String,
    forbidClick: Boolean,
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
  },
  data: {
    success: Checkmark,
    error: Smark,
  },
  methods: {
    // for prevent touchmove
    noop() {},
  },
});
