import { House } from '@tuya-miniapp/icons';
import { More } from '@tuya-miniapp/icons';
import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    iconHouse: House,
    iconMore: More,
  },
  methods: {
    onClickLeft() {
      wx.showToast({ title: I18n.t('clickToReturn'), icon: 'none' });
    },
    onClickLeftIcon() {
      wx.showToast({ title: I18n.t('clickToLeftIcon'), icon: 'none' });
    },
    onClickLeftText() {
      wx.showToast({ title: I18n.t('clickToLeftText'), icon: 'none' });
    },
    onClickRightText() {
      wx.showToast({ title: I18n.t('clickToRightText'), icon: 'none' });
    },
    onClickTitle() {
      wx.showToast({ title: I18n.t('clickToTitle'), icon: 'none' });
    },
    onClickRight() {
      wx.showToast({ title: I18n.t('clickToRight'), icon: 'none' });
    },
    onClickRightIcon() {
      wx.showToast({ title: I18n.t('clickToRightIcon'), icon: 'none' });
    },
  },
});
