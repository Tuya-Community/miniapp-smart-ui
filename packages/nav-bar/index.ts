import Left from '@tuya-miniapp/icons/dist/svg/Left';
import { SmartComponent } from '../common/component';
import { getRect, getSystemInfoSync } from '../common/utils';

SmartComponent({
  classes: [
    'title-class',
    'right-text-class',
    'left-icon-class',
    'right-icon-class',
    'left-text-class',
  ],

  props: {
    title: String,
    sideWidth: {
      type: null,
      value: 'max',
    },
    fixed: {
      type: Boolean,
      observer: 'setHeight',
    },
    placeholder: {
      type: Boolean,
      observer: 'setHeight',
    },
    background: String,
    leftTextType: {
      type: String,
      value: 'back',
    },
    leftText: String,
    leftIcon: String,
    leftIconColor: String,
    leftIconSize: {
      type: null,
      value: 32,
    },
    rightText: String,
    rightTextColor: String,
    rightIcon: String,
    rightIconColor: String,
    rightIconSize: {
      type: null,
      value: 32,
    },
    customStyle: String,
    leftArrow: Boolean,
    border: {
      type: Boolean,
      value: false,
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

    onClickRightIcon() {
      this.$emit('click-right-icon');
    },

    onClickLeftIcon() {
      this.$emit('click-left-icon');
    },

    onClickLeftText() {
      this.$emit('click-left-text');
    },

    onClickRightText() {
      this.$emit('click-right-text');
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
