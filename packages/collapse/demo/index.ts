import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  data: {
    active1: [0],
    active2: 0,
    active3: [],
    active4: [],
    title1: I18n.t('title') + '1',
    title2: I18n.t('title') + '2',
    title3: I18n.t('title') + '3',
    content1: I18n.t('codeIsWrittenForHumansToReadAndIncidentallyToRunOnMachines'),
    content2: I18n.t('codeIsWrittenForHumansToReadAndIncidentallyToRunOnMachines'),
    content3: I18n.t('codeIsWrittenForHumansToReadAndIncidentallyToRunOnMachines'),
  },

  methods: {
    onChange(event) {
      const { key } = event.currentTarget.dataset;
      this.setData({
        [key]: event.detail,
      });
    },

    onOpen(event) {
      Toast({
        context: this,
        selector: '#smart-toast-collapse',
        message: `${I18n.t('expand')}: ${event.detail}`,
      });
    },

    onClose(event) {
      Toast({
        context: this,
        selector: '#smart-toast-collapse',
        message: `${I18n.t('close')}: ${event.detail}`,
      });
    },
  },
});
