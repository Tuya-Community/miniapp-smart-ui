import Left from '@tuya-miniapp/icons/dist/svg/Left';
import { SmartComponent } from '../common/component';

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
    fixed: Boolean,
    placeholder: Boolean,
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
    leftArrowAriaLabel: {
      type: String,
      value: '',
    },
    leftIconAriaLabel: {
      type: String,
      value: '',
    },
    rightIconAriaLabel: {
      type: String,
      value: '',
    },
  },

  data: {
    leftArrowIcon: Left,
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
  },
});
