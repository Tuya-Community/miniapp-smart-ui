import { Plus } from '@tuya-miniapp/icons';
import { House } from '@tuya-miniapp/icons';
import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    iconPlus: Plus,
    iconHouse: House,
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

    onClickTitle() {
      wx.showToast({ title: I18n.t('clickToTitle'), icon: 'none' });
    },

    onClickRight() {
      wx.showToast({ title: I18n.t('clickToRight'), icon: 'none' });
    },
  },
});
