import warningIcon from '@tuya-miniapp/icons/dist/svg/Warning';
import { SmartComponent } from '../common/component';
import { button } from '../mixins/button';
import { toPromise } from '../common/utils';
import type { Action } from './dialog';

SmartComponent({
  mixins: [button],
  classes: ['cancle-button-class', 'confirm-button-class'],

  props: {
    show: {
      type: Boolean,
      observer(show: boolean) {
        !show && this.stopLoading();
      },
    },
    icon: Boolean,
    title: String,
    message: String,
    theme: {
      type: String,
      value: 'default',
    },
    confirmButtonId: String,
    className: String,
    customStyle: String,
    asyncClose: Boolean,
    messageAlign: String,
    beforeClose: null,
    overlayStyle: String,
    useSlot: Boolean,
    useTitleSlot: Boolean,
    useConfirmButtonSlot: Boolean,
    useCancelButtonSlot: Boolean,
    showCancelButton: Boolean,
    closeOnClickOverlay: Boolean,
    confirmButtonOpenType: String,
    width: null,
    zIndex: {
      type: Number,
      value: 2000,
    },
    confirmButtonText: {
      type: String,
      value: 'Confirm',
    },
    cancelButtonText: {
      type: String,
      value: 'Cancel',
    },
    confirmButtonColor: {
      type: String,
    },
    cancelButtonColor: {
      type: String,
    },
    showConfirmButton: {
      type: Boolean,
      value: true,
    },
    overlay: {
      type: Boolean,
      value: true,
    },
    transition: {
      type: String,
      value: 'scale',
    },
    rootPortal: {
      type: Boolean,
      value: false,
    },
    value: null,
    password: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
    },
    maxlength: {
      type: Number,
      value: 20,
    },
  },

  data: {
    warningIcon,
    inputValue: '',
    loading: {
      confirm: false,
      cancel: false,
    },
    callback: (() => {}) as unknown as (
      action: string,
      context: WechatMiniprogram.Component.TrivialInstance
    ) => void,
  },

  methods: {
    onConfirm() {
      this.handleAction('confirm');
    },

    onCancel() {
      this.handleAction('cancel');
    },

    onClickOverlay() {
      this.close('overlay');
    },

    onInput(evt) {
      this.setData({ inputValue: evt?.detail?.value ?? '' });
    },

    close(action) {
      this.setData({ show: false });

      wx.nextTick(() => {
        this.$emit('close', action);
        const { callback } = this.data;
        if (callback) {
          callback(action, this);
        }
      });
    },

    stopLoading() {
      this.setData({
        loading: {
          confirm: false,
          cancel: false,
        },
      });
    },

    handleAction(action: Action) {
      // 避免快速点击时，dialog 已经被关闭了，但是还往下走导致 loading 一直存在
      // see /tuyarn-kit/base/ray-smart-ui/-/issues/11
      if (!this.data.show) return;
      this.$emit(action, { dialog: this, value: this.data.inputValue });

      const { asyncClose, beforeClose } = this.data;
      if (!asyncClose && !beforeClose) {
        this.close(action);
        return;
      }

      this.setData({
        [`loading.${action}`]: true,
      });

      if (beforeClose) {
        toPromise(beforeClose(action, this.data.inputValue)).then((value) => {
          if (value) {
            this.close(action);
          } else {
            this.stopLoading();
          }
        });
      }
    },
  },
});
