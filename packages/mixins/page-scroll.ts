import { isFunction } from '../common/validator';
import { getCurrentPage, isDef } from '../common/utils';

type IPageScrollOption = WechatMiniprogram.Page.IPageScrollOption;
type Scroller = (
  this: WechatMiniprogram.Component.TrivialInstance,
  event?: IPageScrollOption
) => void;

function onPageScroll(event?: IPageScrollOption) {
  const { smartPageScroller = [] } = getCurrentPage<{
    smartPageScroller: Scroller[];
  }>();

  smartPageScroller.forEach((scroller: Scroller) => {
    if (typeof scroller === 'function') {
      // @ts-ignore
      scroller(event);
    }
  });
}

export function pageScrollMixin(scroller: Scroller) {
  return Behavior({
    attached(this: WechatMiniprogram.Component.TrivialInstance) {
      const page = getCurrentPage<{ smartPageScroller: Scroller[] }>();

      if (!isDef(page)) {
        return;
      }

      const _scroller = scroller.bind(this);

      const { smartPageScroller = [] } = page;

      if (isFunction(page.onPageScroll) && page.onPageScroll !== onPageScroll) {
        smartPageScroller.push(page.onPageScroll.bind(page));
      }

      smartPageScroller.push(_scroller);

      page.smartPageScroller = smartPageScroller;
      page.onPageScroll = onPageScroll;

      this._scroller = _scroller;
    },

    detached(this: WechatMiniprogram.Component.TrivialInstance) {
      const page = getCurrentPage<{ smartPageScroller: Scroller[] }>();

      if (!isDef(page) || !isDef(page.smartPageScroller)) {
        return;
      }

      const { smartPageScroller } = page;

      const index = smartPageScroller.findIndex((v) => v === this._scroller);

      if (index > -1) {
        page.smartPageScroller.splice(index, 1);
      }

      this._scroller = undefined;
    },
  });
}
