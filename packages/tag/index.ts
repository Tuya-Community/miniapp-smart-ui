import { Xmark } from '@tuya-miniapp/icons';
import { SmartComponent } from '../common/component';

SmartComponent({
  props: {
    size: String,
    mark: Boolean,
    color: String,
    plain: Boolean,
    round: Boolean,
    textColor: {
      type: String,
      // value:'#fff'
    },
    type: {
      type: String,
      value: 'default',
    },
    closeable: Boolean,
  },
  data: {
    crossIcon: Xmark,
    closeColor: '#fff',
  },

  methods: {
    onClose() {
      this.$emit('close');
    },
  },
});
