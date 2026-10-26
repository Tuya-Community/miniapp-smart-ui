import { SmartComponent } from '../common/component';

SmartComponent({
  props: {
    title: String,
    insetBorderRadius: null,
    border: {
      type: Boolean,
      value: false,
    },
    inset: Boolean,
  },
});
