import { SmartComponent } from '../common/component';
import { useChildren } from '../common/relation';
import { getRect } from '../common/utils';

type TrivialInstance = WechatMiniprogram.Component.TrivialInstance;

SmartComponent({
  relation: useChildren('tabbar-item', function () {
    this.updateChildren();
  }),

  props: {
    active: {
      type: null,
      observer: 'updateChildren',
    },
    upsideDown: {
      type: Boolean,
      value: false,
    },
    activeColor: {
      type: String,
      observer: 'updateChildren',
      value: 'var(--tabbar-item-active-color, var(--app-M1, #3678e3))',
    },
    inactiveColor: {
      type: String,
      observer: 'updateChildren',
    },
    fixed: {
      type: Boolean,
      value: true,
      observer: 'setHeight',
    },
    placeholder: {
      type: Boolean,
      observer: 'setHeight',
    },
    border: {
      type: Boolean,
      value: true,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    height: 50,
  },

  methods: {
    updateChildren() {
      const { children } = this;
      if (!Array.isArray(children) || !children.length) {
        return;
      }

      children.forEach((child: TrivialInstance) => child.updateFromParent());
    },

    setHeight() {
      if (!this.data.fixed || !this.data.placeholder) {
        return;
      }

      wx.nextTick(() => {
        getRect(this, '.smart-tabbar').then(res => {
          this.setData({ height: res.height });
        });
      });
    },
  },
});
