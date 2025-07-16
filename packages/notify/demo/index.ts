import { SmartComponent } from '../../common/component';
import Notify from '../../notify/notify';

SmartComponent({
  methods: {
    showNotify() {
      Notify({
        context: this,
        message: I18n.t('notificationContent'),
        duration: 0,
        transition: 'fade',
      });
    },

    showCustomColor() {
      Notify({
        context: this,
        message: I18n.t('customColor'),
        color: '#ad0000',
        background: '#ffe1e1',
      });

      Notify.clear();
    },

    showCustomDuration() {
      Notify({
        context: this,
        duration: 1000,
        message: I18n.t('customDuration'),
      });
    },

    showNotifyByType(event) {
      const { type } = event.currentTarget.dataset;
      Notify({
        type,
        context: this,
        message: I18n.t('notificationContent'),
      });
    },

    showSafe() {
      Notify({
        context: this,
        message: I18n.t('notificationContent'),
        safeAreaInsetTop: true,
      });
    },
  },
});
