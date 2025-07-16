import { SmartComponent } from '../common/component';
import { button } from '../mixins/button';
import { link } from '../mixins/link';

SmartComponent({
  classes: ['icon-class', 'text-class', 'info-class'],

  mixins: [link, button],

  props: {
    text: String,
    dot: Boolean,
    info: String,
    icon: String,
    size: String,
    color: String,
    classPrefix: {
      type: String,
      value: 'smart-icon',
    },
    disabled: Boolean,
    loading: Boolean,
  },

  methods: {
    onClick(event: WechatMiniprogram.CustomEvent) {
      this.$emit('click', event.detail);
      this.jumpLink();
    },
  },
});
