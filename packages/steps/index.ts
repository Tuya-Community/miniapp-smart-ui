import { Checkmark } from '@tuya-miniapp/icons';
import { SmartComponent } from '../common/component';
import { GREEN, GRAY_DARK } from '../common/color';

SmartComponent({
  classes: ['desc-class'],

  props: {
    icon: String,
    steps: Array,
    active: Number,
    direction: {
      type: String,
      value: 'horizontal',
    },
    activeColor: {
      type: String,
      value: GREEN,
    },
    inactiveColor: {
      type: String,
      value: GRAY_DARK,
    },
    activeIcon: {
      type: String,
      value: Checkmark,
    },
    inactiveIcon: String,
  },

  methods: {
    onClick(event: WechatMiniprogram.TouchEvent) {
      const { index } = event.currentTarget.dataset;
      this.$emit('click-step', index);
    },
  },
});
