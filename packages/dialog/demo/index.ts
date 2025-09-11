import { SmartComponent } from '../../common/component';
import DialogInstance, { Action } from '../../dialog/dialog';

const message = 'Body';

SmartComponent({
  data: {
    show: false,
    inputValue: '',
  },

  methods: {
    showCustomDialog() {
      this.setData({ show: true });
    },

    getUserInfo(event) {
      console.log(event.detail);
    },

    onClickThemeAlert() {
      console.log('=== click theme alert');
      DialogInstance.alert({
        context: this,
        title: 'Title',
        theme: 'round-button',
        icon: false,
        message,
        confirmButtonText: I18n.t('confirm'),
        cancelButtonText: I18n.t('cancel'),
      });
    },

    onClickThemeAlert2() {
      console.log('=== 222 click theme alert');
      DialogInstance.alert({
        context: this,
        theme: 'round-button',
        message,
        showCancelButton: true,
        confirmButtonText: I18n.t('confirm'),
        cancelButtonText: I18n.t('cancel'),
      });
    },

    onClickAlert() {
      DialogInstance.alert({
        context: this,
        title: 'Title',
        icon: false,
        message,
        confirmButtonText: I18n.t('confirm'),
        cancelButtonText: I18n.t('cancel'),
      });
    },

    onClickAlert2() {
      DialogInstance.alert({
        context: this,
        message: 'Title',
        confirmButtonText: I18n.t('confirm'),
        cancelButtonText: I18n.t('cancel'),
      });
    },

    onClickConfirm() {
      DialogInstance.confirm({
        context: this,
        title: 'Title',
        icon: false,
        message,
        cancelButtonText: 'Sub Action',
        confirmButtonText: I18n.t('confirm'),
      });
    },

    onClickConfirmIcon() {
      DialogInstance.confirm({
        context: this,
        title: 'Title',
        icon: true,
        message,
        cancelButtonText: 'Sub Action',
        confirmButtonText: I18n.t('confirm'),
      });
    },

    onClickInput() {
      const beforeClose = (action: Action, value?: string): Promise<boolean> =>
        new Promise((resolve) => {
          setTimeout(() => {
            if (action === 'confirm') {
              // 不存在输入值则拦截确认操作
              resolve(!!value);
            } else {
              resolve(true);
            }
          }, 1000);
        });
        DialogInstance.input({
        context: this,
        title: 'Title',
        value: this.data.inputValue,
        cancelButtonText: 'Sub Action',
        beforeClose,
        confirmButtonText: I18n.t('confirm'),
      })
        .then((res) => {
          console.log('=== onConfirm', res);
          const inputValue = res?.data?.inputValue;
          this.setData({ inputValue });
        })
        .catch((res) => {
          console.log('=== onCancel', res);
        });
    },

    onClickAsyncClose() {
      const beforeClose = (action: Action): Promise<boolean> =>
        new Promise((resolve) => {
          setTimeout(() => {
            if (action === 'confirm') {
              resolve(true);
            } else {
              // 拦截取消操作
              resolve(false);
            }
          }, 1000);
        });

        DialogInstance.confirm({
        context: this,
        title: 'Title',
        icon: false,
        message,
        beforeClose,
        confirmButtonText: I18n.t('confirm'),
        cancelButtonText: I18n.t('cancel'),
      });
    },

    onClose(event) {
      if(event.detail === 'confirm') {
        this.setData({
          show: false,
        });
      }
    },
  },
});
