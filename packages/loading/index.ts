import { SmartComponent } from '../common/component';

SmartComponent({
  props: {
    color: String,
    vertical: Boolean,
    type: {
      type: String,
      value: 'circular',
    },
    size: String,
    textSize: String,
  },

  data: {
    array12: Array.from({ length: 12 }),
  },
});
