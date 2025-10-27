import { SmartComponent } from '../common/component';
import { useParent } from '../common/relation';
import { button } from '../mixins/button';
import { link } from '../mixins/link';

SmartComponent({
  mixins: [link, button],

  relation: useParent('goods-action'),

  props: {
    text: String,
    color: String,
    size: {
      type: String,
      value: 'normal',
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    type: {
      type: String,
      value: 'danger',
    },
    customStyle: {
      type: String,
      value: '',
    },
    isFirst: Boolean,
    isLast: Boolean,
  },

  methods: {
    onClick(event: WechatMiniprogram.CustomEvent) {
      this.$emit('click', event.detail);
      this.jumpLink();
    },

    updateStyle() {
      if (this.parent == null) {
        return;
      }

      const { index } = this;
      const { children = [] } = this.parent;

      // this.setData({
      //   isFirst: index === 0 && children.length > 1,
      //   isLast: index === children.length - 1 && children.length > 1,
      // });

      this.setData({
        length: children.length,
      });
    },
  },
});
