import { SmartComponent } from '../common/component';
import { getRect, requestAnimationFrame } from '../common/utils';
import Xmark from '@tuya-miniapp/icons/dist/svg/Xmark';
import Right from '@tuya-miniapp/icons/dist/svg/Right';

SmartComponent({
  props: {
    text: {
      type: String,
      value: '',
      observer: 'init',
    },
    btnText: {
      type: String,
      value: '',
      observer: 'init',
    },
    btnTextColor: {
      type: String,
      value: '',
      observer: 'init',
    },
    mode: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: 'info',
    },
    url: {
      type: String,
      value: '',
    },
    openType: {
      type: String,
      value: 'navigateTo',
    },
    rightIconColor: {
      type: String,
      value: '',
    },
    leftIconColor: {
      type: String,
      value: '',
    },
    delay: {
      type: Number,
      value: 1,
    },
    customStyle: {
      type: String,
      value: '',
    },
    customHoverClass: {
      type: String,
      value: '',
    },
    rightIconStyle: {
      type: String,
      value: '',
    },
    leftIconStyle: {
      type: String,
      value: '',
    },
    speed: {
      type: Number,
      value: 60,
      observer: 'init',
    },
    scrollable: null,
    leftIcon: {
      type: String,
      value: '',
    },
    color: String,
    background: String,
    wrapable: Boolean,
  },

  data: {
    Xmark,
    Right,
    show: true,
  },

  created() {
    this.resetAnimation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear',
    });
  },

  destroyed() {
    this.timer && clearTimeout(this.timer);
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      requestAnimationFrame(() => {
        Promise.all([
          getRect(this, '.smart-notice-bar__content'),
          getRect(this, '.smart-notice-bar__wrap'),
        ]).then(rects => {
          const [contentRect, wrapRect] = rects;
          const { speed, scrollable, delay } = this.data;
          if (
            contentRect == null ||
            wrapRect == null ||
            !contentRect.width ||
            !wrapRect.width ||
            scrollable === false
          ) {
            return;
          }

          if (scrollable || wrapRect.width < contentRect.width) {
            const duration = ((wrapRect.width + contentRect.width) / speed) * 1000;

            this.wrapWidth = wrapRect.width;
            this.contentWidth = contentRect.width;
            this.duration = duration;
            this.animation = wx.createAnimation({
              duration,
              timingFunction: 'linear',
              delay,
            });

            this.scroll(true);
          }
        });
      });
    },

    scroll(isInit = false) {
      this.timer && clearTimeout(this.timer);
      this.timer = null;

      this.setData({
        animationData: this.resetAnimation
          .translateX(isInit ? 0 : this.wrapWidth)
          .step()
          .export(),
      });

      requestAnimationFrame(() => {
        this.setData({
          animationData: this.animation.translateX(-this.contentWidth).step().export(),
        });
      });

      this.timer = setTimeout(() => {
        this.scroll();
      }, this.duration + this.data.delay);
    },

    onClickIcon(event) {
      if (this.data.mode === 'closeable') {
        this.timer && clearTimeout(this.timer);
        this.timer = null;

        this.setData({ show: false });
        this.$emit('close', event.detail);
      }
    },

    onClickBtnText(event) {
      this.$emit('btnClick', event);
    },

    onClick(event: WechatMiniprogram.TouchEvent) {
      const { url, mode, openType } = this.data;
      if (mode === 'link' && url) {
        if (openType === 'redirectTo') {
          wx.redirectTo({ url });
        } else if (openType === 'navigateTo') {
          wx.navigateTo({ url });
        }
      }
      this.$emit('click', event);
    },
  },
});
