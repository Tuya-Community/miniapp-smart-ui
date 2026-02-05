import warningIcon from '@tuya-miniapp/icons/dist/svg/Warning';
import { SmartComponent } from '../common/component';
import { button } from '../mixins/button';
import appLog from '../common/appLog';
import { getCurrentPage, toPromise } from '../common/utils';
import { contextRef, queueRef, type Action } from './dialog';

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
    icon: null,
    iconColor: {
      type: String,
      value: '#F04C4C',
    },
    iconSize: String,
    title: String,
    message: String,
    theme: {
      type: String,
      value: 'default',
    },
    emptyDisabled: Boolean,
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
    nativeDisabled: Boolean,
    confirmButtonOpenType: String,
    width: null,
    zIndex: {
      type: Number,
      value: 2000,
    },
    autoClose: {
      type: Boolean,
      value: false,
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
    fullCoverView: {
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
    actionType: '',
    callback: (() => {}) as unknown as (
      action: string,
      context: WechatMiniprogram.Component.TrivialInstance
    ) => void,
    onInput: (() => {}) as (value: string) => void,
  },
  mounted: function () {
    if (!this.id) return;
    if (contextRef.value[`#${this.id}`]) {
      console.error(`Dialog component #${this.id} repeated!`);
      appLog.info(`Dialog component #${this.id} repeated!`);
    }
    contextRef.value[`#${this.id}`] = getCurrentPage();
    appLog.info(`Dialog #${this.id} mounted`);
  },
  destroyed: function () {
    if (!this.id) return;
    contextRef.value[`#${this.id}`] = null;
    queueRef.value = queueRef.value.filter(item => item.id !== this.id);
    appLog.info(`dialog #${this.id} destroyed`);
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
      const inputValue = evt?.detail?.value ?? '';
      this.setData({ inputValue });
      if (this.data.onInput) {
        this.data.onInput(inputValue);
      }
    },

    close(action) {
      if (this.data.autoClose) {
        this.setData({ show: false });
      }
      this.setData({ actionType: action });
      wx.nextTick(() => {
        this.$emit('close', action);
        // const { callback } = this.data;
        // console.log(callback, 'close');
        // if (callback) {
        //   callback(action, this);
        // }
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
        toPromise(beforeClose(action, this.data.inputValue)).then(value => {
          if (value) {
            this.close(action);
          } else {
            this.stopLoading();
          }
        });
      }
    },

    onBeforeEnter() {
      this.$emit('before-enter');
    },

    onEnter() {
      this.$emit('enter');
    },

    onAfterEnter() {
      this.$emit('after-enter');
    },

    onBeforeLeave() {
      this.$emit('before-leave');
    },

    onLeave() {
      this.$emit('leave');
    },

    onAfterLeave() {
      this.$emit('after-leave');
      appLog.info(`dialog #${this.id} after-leave`);
      const { callback, actionType } = this.data;
      if (callback) {
        callback(actionType, this);
      }
    },
    // 兜底防止 通过api方式打开组件失败 导致队列没有清除
    onPopUpError() {
      const { callback, actionType } = this.data;
      if (callback) {
        callback(actionType, this);
      }
    },
  },
});
