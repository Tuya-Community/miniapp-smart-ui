import { SmartComponent } from '../common/component';

SmartComponent({
  props: {
    description: String,
    image: {
      type: String,
      value: 'default',
    },
  },
});
