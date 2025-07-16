import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  methods: {
    onClickIcon() {
      Toast({ context: this, message: '点击图标' });
    },

    onClickButton() {
      Toast({ context: this, message: '点击按钮' });
    },
  },
});
