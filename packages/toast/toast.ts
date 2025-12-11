import appLog from '../common/appLog';
import { getCurrentPage } from '../common/utils';
import { isObj } from '../common/validator';
import tyApi from '../common/ty';

type ToastMessage = string | number;
type ToastContext =
  | WechatMiniprogram.Component.TrivialInstance
  | WechatMiniprogram.Page.TrivialInstance;

interface ToastOptions {
  show?: boolean;
  type?: string;
  mask?: boolean;
  zIndex?: number;
  nativeDisabled?: boolean;
  context?: (() => ToastContext) | ToastContext;
  position?: string;
  duration?: number;
  textColor?: string;
  iconColor?: string;
  selector?: string;
  forbidClick?: boolean;
  ignoreQueue?: boolean;
  loadingType?: string;
  message?: ToastMessage;
  width?: number;
  onClose?: () => void;
}

const defaultOptions = {
  type: 'text',
  mask: false,
  nativeDisabled: false,
  message: '',
  show: true,
  zIndex: 1000,
  duration: 2000,
  ignoreQueue: false,
  position: 'middle',
  forbidClick: false,
  loadingType: 'circular',
  selector: '#smart-toast',
  width: '',
};

const queueRef = {
  value: [] as WechatMiniprogram.Component.TrivialInstance[],
};

const preDisRef = {
  value: {} as Record<string, boolean>,
};
// @ts-expect-error
let currentOptions: ToastOptions = { ...defaultOptions };

function parseOptions(message): ToastOptions {
  return isObj(message) ? message : { message };
}

export const contextRef = {
  value: {} as Record<string, ToastContext | null>,
};

function Toast(toastOptions: ToastOptions | ToastMessage) {
  const options = {
    ...currentOptions,
    ...parseOptions(toastOptions),
  } as ToastOptions;
  appLog.info('start open Toast');
  const context =
    (typeof options.context === 'function' ? options.context() : options.context) ||
    contextRef.value[options.selector as string] ||
    getCurrentPage();
  const toast = context.selectComponent(options.selector as string);
  appLog.info(`toast selector: ${options.selector}`);
  appLog.info(`toast component ${toast ? 'success' : 'fail'}`);
  if (!toast) {
    console.warn(
      `未找到 ${options.selector || '#smart-toast'} 节点，请确认 selector 及 context 是否正确`
    );
    appLog.info(
      `未找到 ${options.selector || '#smart-toast'} 节点，请确认 selector 及 context 是否正确`
    );
    return;
  }

  delete options.context;
  delete options.selector;

  toast.clear = () => {
    toast.setData({ show: false });
    if (options.nativeDisabled) {
      tyApi.nativeDisabled(false);
    }
    preDisRef.value[options.selector as string] = false;
    if (options.onClose) {
      options.onClose();
    }
  };

  queueRef.value.push(toast);
  toast.setData(options);
  if (options.nativeDisabled) {
    tyApi.nativeDisabled(true);
  }
  if (preDisRef.value[options.selector as any] && !options.nativeDisabled) {
    tyApi.nativeDisabled(false);
  }
  preDisRef.value[options.selector as any] = options.nativeDisabled || false;
  clearTimeout(toast.timer);

  if (options.duration != null && options.duration > 0) {
    toast.timer = setTimeout(() => {
      toast.clear();
      queueRef.value = queueRef.value.filter(item => item !== toast);
      appLog.info(`toast ${options.selector} cleared`);
    }, options.duration);
  }

  return toast;
}

const createMethod = (type: string) => (options: ToastOptions | ToastMessage) => {
  if (type === 'success') {
    tyApi.notificationVibrate({ type: 'success' });
  } else if (type === 'fail') {
    tyApi.notificationVibrate({ type: 'error' });
  } else if (type === 'warn') {
    tyApi.notificationVibrate({ type: 'warning' });
  }
  return Toast({
    type,
    ...parseOptions(options),
  });
};

Toast.loading = createMethod('loading');
Toast.success = createMethod('success');
Toast.fail = createMethod('fail');
Toast.warn = createMethod('warn');

Toast.clear = () => {
  queueRef.value.forEach(toast => {
    toast.clear();
  });
  queueRef.value = [];
};

Toast.setDefaultOptions = (options: ToastOptions) => {
  Object.assign(currentOptions, options);
};

Toast.resetDefaultOptions = () => {
  // @ts-expect-error
  currentOptions = { ...defaultOptions };
};

export default Toast;
