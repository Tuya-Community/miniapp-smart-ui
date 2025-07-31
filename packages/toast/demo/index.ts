import { SmartComponent } from '../../common/component';
import ToastInstance from '../../toast/toast';

SmartComponent({
  methods: {
    showToast() {
      ToastInstance({
        context: this,
        message: I18n.t('promptContent'),
      });
    },

    showLongToast() {
      ToastInstance({
        context: this,
        message: I18n.t('toastDemoTip1'),
      });
    },

    showLoadingToast() {
      ToastInstance.loading({
        context: this,
        message: I18n.t('loading') + '...',
        forbidClick: true,
      });
    },

    showCustomLoadingToast() {
      ToastInstance.loading({
        context: this,
        message: I18n.t('loading') + '...',
        forbidClick: true,
        loadingType: 'spinner',
      });
    },

    showSuccessToast() {
      ToastInstance.success({ context: this, message: I18n.t('successMessage') });
    },

    showFailToast() {
      ToastInstance.fail({ context: this, message: I18n.t('failurePrompt') });
    },

    showWarnToast() {
      ToastInstance.warn({ context: this, message: I18n.t('warningPrompt') });
    },

    showCustomizedToast() {
      const text = second => `${I18n.t('countdown')} ${second} ${I18n.t('second')}`;
      const toast = ToastInstance.loading({
        context: this,
        duration: 0,
        forbidClick: true,
        message: text(3),
        width: 88,
      });

      let second = 3;
      const timer = setInterval(() => {
        second--;
        if (second) {
          toast?.setData({ message: text(second) });
        } else {
          clearInterval(timer);
          ToastInstance.clear();
        }
      }, 1000);
    },

    showCustomizedWidthToast() {
      ToastInstance.loading({
        context: this,
        message: I18n.t('loading') + '...',
        forbidClick: true,
        width: 200,
      });
    },
    showBottomToast() {
      ToastInstance({
        context: this,
        position: 'bottom',
        message: I18n.t('promptContent'),
      });
    },
    showTopToast() {
      ToastInstance({
        context: this,
        position: 'top',
        message: I18n.t('promptContent'),
      });
    },
  },
});
