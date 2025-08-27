import Left from '@tuya-miniapp/icons/dist/svg/Left';
import { SmartComponent } from '../common/component';
import { getRect, getSystemInfoSync } from '../common/utils';

SmartComponent({
  classes: ['title-class', 'right-text-class', 'left-icon-class'],

  props: {
    title: String,
    fixed: {
      type: Boolean,
      observer: 'setHeight',
    },
    placeholder: {
      type: Boolean,
      observer: 'setHeight',
    },
    leftTextType: {
      type: String,
      value: 'back',
    },
    leftText: String,
    leftIcon: String,
    leftIconSize: {
      type: null,
      value: 32,
    },
    rightText: String,
    customStyle: String,
    leftArrow: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    round: {
      type: Boolean,
      value: false,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    safeAreaInsetTop: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    height: 46,
    leftArrowIcon: Left,
  },

  created() {
    const { statusBarHeight } = getSystemInfoSync();

    this.setData({
      statusBarHeight,
      height: 46 + statusBarHeight,
    });
  },

  mounted() {
    this.setHeight();
  },

  methods: {
    onClickLeft() {
      this.$emit('click-left');
    },

    onClickRight() {
      this.$emit('click-right');
    },

    onClickTitle() {
      this.$emit('click-title');
    },

    onClickLeftIcon() {
      this.$emit('click-left-icon');
    },

    onClickLeftText() {
      this.$emit('click-left-text');
    },

    setHeight() {
      if (!this.data.fixed || !this.data.placeholder) {
        return;
      }

      wx.nextTick(() => {
        getRect(this, '.smart-nav-bar').then(res => {
          if (res && 'height' in res) {
            this.setData({ height: res.height });
          }
        });
      });
    },
  },
});
