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
  textColor: '',
  iconColor: 'white',
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

interface ToastContextEntry {
  page: ToastContext;
  instance: WechatMiniprogram.Component.TrivialInstance | null;
}

/**
 * selector -> 该 selector 下所有存活的 toast 实例。
 * 一个 selector（id）可以同时挂在多个页面（多 webview）上，因此用数组记录，
 * 而不再是「一个 selector 只对应一个 page」的单槽结构。
 * 为向后兼容，仍容忍外部直接赋值为单个 page（非数组）的旧写法。
 */
export const contextRef = {
  value: {} as Record<string, ToastContextEntry[] | ToastContext | null>,
};

/**
 * 组件挂载时登记自身。同一 selector 在「同一个页面」上重复挂载才算冲突，
 * 不同页面共用同一 selector 是被允许的（这正是「每页挂一个默认 toast」的场景）。
 * @returns 是否与同页已有实例冲突（供组件层打印 repeated 提示）。
 */
export function registerToastContext(
  selector: string,
  instance: WechatMiniprogram.Component.TrivialInstance
): boolean {
  const existing = contextRef.value[selector];
  const list: ToastContextEntry[] = Array.isArray(existing) ? existing : [];
  contextRef.value[selector] = list;

  const page = getCurrentPage() as ToastContext;
  const samePage = list.find(entry => entry.page === page);
  if (samePage) {
    samePage.instance = instance;
    return true;
  }
  list.push({ page, instance });
  return false;
}

/** 组件卸载时精确移除自身，不影响其它页面上同 selector 的实例。 */
export function unregisterToastContext(
  selector: string,
  instance: WechatMiniprogram.Component.TrivialInstance
): void {
  const existing = contextRef.value[selector];
  if (!Array.isArray(existing)) {
    return;
  }
  contextRef.value[selector] = existing.filter(entry => entry.instance !== instance);
}

/**
 * 解析目标实例所在的上下文：优先命中「当前页面」上的实例，
 * 其次退回最后挂载的实例（栈顶，覆盖跨页/非当前页场景），
 * 同时兼容外部直接赋值单个 page 的旧写法。
 */
function resolveContextEntry(selector: string): ToastContextEntry | null {
  const existing = contextRef.value[selector];
  if (!existing) {
    return null;
  }
  if (!Array.isArray(existing)) {
    // 兼容旧结构：value[selector] 直接是一个 page
    return { page: existing as ToastContext, instance: null };
  }
  if (!existing.length) {
    return null;
  }
  const currentPage = getCurrentPage() as ToastContext;
  return existing.find(entry => entry.page === currentPage) || existing[existing.length - 1];
}

function Toast(toastOptions: ToastOptions | ToastMessage) {
  const options = {
    ...currentOptions,
    ...parseOptions(toastOptions),
  } as ToastOptions;
  appLog.info('start open Toast');
  const explicitContext =
    typeof options.context === 'function' ? options.context() : options.context;
  const entry = explicitContext ? null : resolveContextEntry(options.selector as string);
  const context = explicitContext || entry?.page || getCurrentPage();
  const toast = context.selectComponent(options.selector as string) || entry?.instance || null;
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
