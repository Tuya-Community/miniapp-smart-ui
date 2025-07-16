import iconRight from '@tuya-miniapp/icons/dist/svg/Right';
import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    iconRight,
  },
  methods: {
    onClickLeft() {
      wx.showToast({ title: '点击返回', icon: 'none' });
    },

    onClickRight() {
      wx.showToast({ title: '点击按钮', icon: 'none' });
    },
  },
});
