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
      ty.showToast({ title: I18n.t('clickToReturn'), icon: 'none' });
    },
    onClickLeftIcon() {
      ty.showToast({ title: I18n.t('clickToLeftIcon'), icon: 'none' });
    },
    onClickLeftText() {
      ty.showToast({ title: I18n.t('clickToLeftText'), icon: 'none' });
    },
    onClickRightText() {
      ty.showToast({ title: I18n.t('clickToRightText'), icon: 'none' });
    },
    onClickTitle() {
      ty.showToast({ title: I18n.t('clickToTitle'), icon: 'none' });
    },
    onClickRight() {
      ty.showToast({ title: I18n.t('clickToRight'), icon: 'none' });
    },
    onClickRightIcon() {
      ty.showToast({ title: I18n.t('clickToRightIcon'), icon: 'none' });
    },
  },
});
