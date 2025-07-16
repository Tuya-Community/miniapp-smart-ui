import { SmartComponent } from '../common/component';

SmartComponent({
  props: {
    title: String,
    border: {
      type: Boolean,
      value: false,
    },
    inset: Boolean,
  },
});
