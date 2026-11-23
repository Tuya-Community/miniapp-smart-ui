type PageShow = (...args: unknown[]) => unknown;

export interface PageWithShow {
  onShow?: PageShow;
}

interface PageShowSubscription {
  listeners: Set<() => void>;
  notify: PageShow;
  previous?: PageShow;
  hadOwnOnShow: boolean;
}

const subscriptions = new WeakMap<PageWithShow, PageShowSubscription>();

export function subscribeToPageShow(page: PageWithShow, listener: () => void) {
  let subscription = subscriptions.get(page);
  if (!subscription) {
    const previous = page.onShow;
    const listeners = new Set<() => void>();
    const notify = function (this: PageWithShow, ...args: unknown[]) {
      try {
        return previous?.apply(this, args);
      } finally {
        listeners.forEach(callback => callback());
      }
    };
    subscription = {
      listeners,
      notify,
      previous,
      hadOwnOnShow: Object.prototype.hasOwnProperty.call(page, 'onShow'),
    };
    page.onShow = notify;
    subscriptions.set(page, subscription);
  }

  const current = subscription;
  current.listeners.add(listener);
  return () => {
    current.listeners.delete(listener);
    if (current.listeners.size || subscriptions.get(page) !== current) return;

    if (page.onShow === current.notify) {
      if (current.hadOwnOnShow) {
        page.onShow = current.previous;
      } else {
        delete page.onShow;
      }
    }
    subscriptions.delete(page);
  };
}
