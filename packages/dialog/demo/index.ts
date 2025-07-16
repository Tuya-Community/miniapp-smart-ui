import { SmartComponent } from '../../common/component';
import Dialog, { Action } from '../../dialog/dialog';

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
      Dialog.alert({
        context: this,
        title: 'Title',
        theme: 'round-button',
        icon: false,
        message,
      });
    },

    onClickThemeAlert2() {
      console.log('=== 222 click theme alert');
      Dialog.alert({
        context: this,
        theme: 'round-button',
        message,
      });
    },

    onClickAlert() {
      Dialog.alert({
        context: this,
        title: 'Title',
        icon: false,
        message,
      });
    },

    onClickAlert2() {
      Dialog.alert({
        context: this,
        message: 'Title',
      });
    },

    onClickConfirm() {
      Dialog.confirm({
        context: this,
        title: 'Title',
        icon: false,
        message,
        cancelButtonText: 'Sub Action',
      });
    },

    onClickConfirmIcon() {
      Dialog.confirm({
        context: this,
        title: 'Title',
        icon: true,
        message,
        cancelButtonText: 'Sub Action',
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
      Dialog.input({
        context: this,
        title: 'Title',
        value: this.data.inputValue,
        cancelButtonText: 'Sub Action',
        beforeClose,
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

      Dialog.confirm({
        context: this,
        title: 'Title',
        icon: false,
        message,
        beforeClose,
      });
    },

    onClose() {
      this.setData({
        show: false,
      });
    },
  },
});
