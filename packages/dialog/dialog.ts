import appLog from '../common/appLog';
import { getCurrentPage } from '../common/utils';

export const queueRef = {
  value: [] as WechatMiniprogram.Component.TrivialInstance[],
};
export type Action = 'confirm' | 'cancel' | 'overlay';

type DialogContext =
  | WechatMiniprogram.Page.TrivialInstance
  | WechatMiniprogram.Component.TrivialInstance;

// eslint-disable-next-line @typescript-eslint/ban-types
type AnyObject = {};

interface DialogOptions {
  lang?: string;
  show?: boolean;
  title?: string;
  icon?: boolean | string;
  iconColor?: string;
  iconSize?: string;
  nativeDisabled?: boolean;
  width?: string | number | null;
  zIndex?: number;
  theme?: string;
  context?: (() => DialogContext) | DialogContext;
  message?: string;
  overlay?: boolean;
  selector?: string;
  ariaLabel?: string;
  customStyle?: string;
  transition?: string;
  autoClose?: boolean;
  beforeClose?: null | ((action: Action, value?: string) => Promise<void | boolean> | void);
  businessId?: number;
  sessionFrom?: string;
  overlayStyle?: string;
  appParameter?: string;
  messageAlign?: string;
  sendMessageImg?: string;
  showMessageCard?: boolean;
  sendMessagePath?: string;
  sendMessageTitle?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  closeOnClickOverlay?: boolean;
  confirmButtonOpenType?: string;
  value?: null | string;
  ignoreQueue?: boolean;
  password?: boolean;
  placeholder?: string;
  maxlength?: number;
}

interface DialogInputOptions extends DialogOptions {
  value: string;
  type?: string;
  password?: boolean;
  placeholder?: string;
  maxlength?: number;
  emptyDisabled?: boolean;
  onInput?: (value: string) => void;
}

const defaultOptions: DialogOptions = {
  show: false,
  title: '',
  width: null,
  theme: 'default',
  message: '',
  zIndex: 100,
  overlay: true,
  selector: '#smart-dialog',
  beforeClose: null,
  transition: 'scale',
  customStyle: '',
  autoClose: true,
  messageAlign: '',
  overlayStyle: '',
  confirmButtonText: '确认',
  cancelButtonText: '取消',
  showConfirmButton: true,
  showCancelButton: false,
  closeOnClickOverlay: false,
  confirmButtonOpenType: '',
  icon: false,
  nativeDisabled: false,
  ignoreQueue: false,
  value: null,
  password: false,
  placeholder: '',
  maxlength: 20,
};

let currentOptions: DialogOptions = { ...defaultOptions };

export const contextRef = {
  value: {} as Record<string, DialogContext | null>,
};

const Dialog = (options: DialogOptions) => {
  options = {
    ...currentOptions,
    ...options,
  };
  const prom = new Promise<WechatMiniprogram.Component.TrivialInstance>((resolve, reject) => {
    appLog.info('start open dialog');
    const context =
      (typeof options.context === 'function' ? options.context() : options.context) ||
      contextRef.value[options.selector as string] ||
      getCurrentPage();
    const selector = options.selector as string;
    appLog.info(`dialog selector: ${selector}`);
    appLog.info(`queue : ${JSON.stringify(queueRef.value)}`);
    const dialog = context.selectComponent(options.selector as string);
    appLog.info(`dialog component ${dialog ? 'success' : 'fail'}`);
    if (
      !options.ignoreQueue &&
      queueRef.value.length > 0 &&
      queueRef.value.find(item => dialog && item && item.id === dialog.id)
    ) {
      console.warn(`相同选择器的 Dialog 调用过于频繁，${dialog.id} 已忽略重复调用`);
      appLog.info(`相同选择器的 Dialog 调用过于频繁，${dialog.id} 已忽略重复调用`);
      return;
    }

    delete options.context;
    delete options.selector;

    if (dialog) {
      const optionsWithInputValue: DialogOptions & { inputValue?: string } = {
        ...options,
      };
      if (typeof options.value === 'string') {
        optionsWithInputValue.inputValue = options.value;
      }

      dialog.setData({
        callback: (action: Action, instance: WechatMiniprogram.Component.TrivialInstance) => {
          /**
           * 在声明式调用的情况下，在 close 后需要手动清空队列
           */
          queueRef.value = queueRef.value.filter(item => item.id !== dialog.id);
          action === 'confirm' ? resolve(instance) : reject(instance);
          appLog.info(`dialog ${dialog.id} callback`);
        },
        ...optionsWithInputValue,
      });

      wx.nextTick(() => {
        appLog.info(`start open dialog ${dialog.id}`);
        dialog.setData({ show: true });
      });

      queueRef.value.push(dialog);
    } else {
      console.warn(
        `未找到 ${(selector ?? '#smart-dialog').replace(
          '#',
          ''
        )} 节点，请确认 selector 及 context 是否正确`
      );
      appLog.info(
        `未找到 ${(selector ?? '#smart-dialog').replace(
          '#',
          ''
        )} 节点，请确认 selector 及 context 是否正确`
      );
    }
  });
  prom.catch(err => {
    appLog.info(`Dialog promise Error`, err);
    console.log(err, '---Dialog-error');
    queueRef.value = [];
  });
  return prom;
};

Dialog.alert = (options: DialogOptions) => Dialog(options);

Dialog.confirm = (options: DialogOptions) =>
  Dialog({
    showCancelButton: true,
    ...options,
  });

Dialog.input = ((options: DialogInputOptions) =>
  Dialog({ showCancelButton: true, ...options, value: options.value ?? '' })) as (
  options: DialogInputOptions
) => Promise<
  WechatMiniprogram.Component.Instance<
    {
      /**
       * 输入框的当前值
       */
      inputValue: string;
    },
    AnyObject,
    AnyObject
  >
>;

Dialog.close = () => {
  queueRef.value.forEach(dialog => {
    dialog.close();
  });
  queueRef.value = [];
};

Dialog.stopLoading = () => {
  queueRef.value.forEach(dialog => {
    dialog.stopLoading();
  });
};

Dialog.currentOptions = currentOptions;
Dialog.defaultOptions = defaultOptions;

Dialog.setDefaultOptions = (options: DialogOptions) => {
  currentOptions = { ...currentOptions, ...options };
  Dialog.currentOptions = currentOptions;
};

Dialog.resetDefaultOptions = () => {
  currentOptions = { ...defaultOptions };
  Dialog.currentOptions = currentOptions;
};

Dialog.resetDefaultOptions();

export default Dialog;
