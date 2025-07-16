import { SmartComponent } from '../common/component';
import { WHITE } from '../common/color';
import { getCurrentPage, getSystemInfoSync } from '../common/utils';
import { contextRef } from './notify';

SmartComponent({
  props: {
    message: String,
    background: String,
    type: {
      type: String,
      value: 'danger',
    },
    color: {
      type: String,
      value: WHITE,
    },
    duration: {
      type: Number,
      value: 3000,
    },
    zIndex: {
      type: Number,
      value: 110,
    },
    safeAreaInsetTop: {
      type: Boolean,
      value: false,
    },
    useSlot: {
      type: Boolean,
      value: false,
    },
    transition: {
      type: String,
      value: 'slide-down',
    },
    top: null,
  },

  data: {
    show: false,
    onOpened: null as unknown as () => void,
    onClose: null as unknown as () => void,
    onClick: null as unknown as (detail: Record<string, null>) => void,
  },

  created() {
    const { statusBarHeight } = getSystemInfoSync();
    this.setData({ statusBarHeight });
  },
  mounted: function () {
    contextRef.value = getCurrentPage();
  },

  methods: {
    show() {
      const { duration, onOpened } = this.data;

      clearTimeout(this.timer);
      this.setData({ show: true });

      wx.nextTick(onOpened);

      if (duration > 0 && duration !== Infinity) {
        this.timer = setTimeout(() => {
          this.hide();
        }, duration);
      }
    },

    hide() {
      const { onClose } = this.data;

      clearTimeout(this.timer);
      this.setData({ show: false });

      wx.nextTick(onClose);
    },

    onTap(event: WechatMiniprogram.TouchEvent) {
      const { onClick } = this.data;
      if (onClick) {
        onClick(event.detail);
      }
    },
  },
});
