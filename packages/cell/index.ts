import { Up as upIcon } from '@tuya-miniapp/icons';
import { Down as downIcon } from '@tuya-miniapp/icons';
import { Left as leftIcon } from '@tuya-miniapp/icons';
import { Right as rightIcon } from '@tuya-miniapp/icons';
import { link } from '../mixins/link';
import { SmartComponent } from '../common/component';

SmartComponent({
  classes: ['title-class', 'label-class', 'value-class', 'right-icon-class', 'hover-class'],

  mixins: [link],

  props: {
    title: null,
    value: null,
    icon: String,
    label: String,
    isLink: Boolean,
    required: Boolean,
    clickable: Boolean,
    titleWidth: String,
    customStyle: String,
    arrowDirection: String,
    useLabelSlot: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    titleStyle: String,
  },

  data: {
    arrowIcons: {
      up: upIcon,
      down: downIcon,
      left: leftIcon,
      right: rightIcon,
    },
    arrowIcon: rightIcon,
  },

  methods: {
    onClick(event: WechatMiniprogram.TouchEvent) {
      this.$emit('click', event.detail);
      this.jumpLink();
    },
  },
});
