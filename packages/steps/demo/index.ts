import { Right } from '@tuya-miniapp/icons';
import { CheckmarkCircle } from '@tuya-miniapp/icons';
import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

const steps = [
  {
    text: I18n.t('step1'),
    desc: I18n.t('descriptionInformation'),
  },
  {
    text: I18n.t('stepTwo'),
    desc: I18n.t('descriptionInformation'),
  },
  {
    text: I18n.t('stepThree'),
    desc: I18n.t('descriptionInformation'),
  },
  {
    text: I18n.t('stepFour'),
    desc: I18n.t('descriptionInformation'),
  },
];

SmartComponent({
  data: {
    active: 1,
    steps,
    customIcon: CheckmarkCircle,
    inActiveIcon: Right,
  },

  methods: {
    nextStep() {
      this.setData({
        active: ++this.data.active % 4,
      });
    },

    onClick(event) {
      Toast({
        context: this,
        selector: '#smart-toast-steps',
        message: `Index: ${event.detail}`,
      });
    },
  },
});
