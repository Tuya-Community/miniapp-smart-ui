import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  methods: {
    onChange(event) {
      Toast({ context: this, message: `切换至第${event.detail}项` });
    },
  },
});
