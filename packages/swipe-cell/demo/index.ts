import { SmartComponent } from '../../common/component';
import Dialog from '../../dialog/dialog';
import Toast from '../../toast/toast';

SmartComponent({
  methods: {
    onClose(event) {
      const { position, instance } = event.detail;
      switch (position) {
        case 'left':
        case 'cell':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            context: this,
            selector: '#smart-dialog-cell',
            message: I18n.t('areYouSureYouWantToDelete'),
          })
            .then(() => {
              instance.close();
            })
            .catch(() => {
              console.log('cancel');
            });
          break;
      }
    },

    onOpen(event) {
      const { position, name } = event.detail;
      switch (position) {
        case 'left':
          Toast({
            context: this,
            selector: '#smart-toast-cell',
            message: `${name}${position}${I18n.t('partialOpenEventTriggered')}`,
          });
          break;
        case 'right':
          Toast({
            context: this,
            selector: '#smart-toast-cell',
            message: `${name}${position}${I18n.t('partialDisplayOpenEventTriggered')}`,
          });
          break;
      }
    },
  },
});
