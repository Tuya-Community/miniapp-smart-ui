import CheckmarkCircle from '@tuya-miniapp/icons/dist/svg/CheckmarkCircle';
import CheckmarkCircleVoid from '@tuya-miniapp/icons/dist/svg/CheckmarkCircleVoid';
import { getAllRect } from '../common/utils';
import { SmartComponent } from '../common/component';
import { canIUseModel } from '../common/version';

SmartComponent({
  field: true,

  classes: ['icon-class'],

  props: {
    value: {
      type: Number,
      observer(value: number) {
        if (value !== this.data.innerValue) {
          this.setData({ innerValue: value });
        }
      },
    },
    readonly: Boolean,
    disabled: Boolean,
    allowHalf: Boolean,
    size: null,
    icon: {
      type: String,
      value: CheckmarkCircle,
    },
    voidIcon: {
      type: String,
      value: CheckmarkCircleVoid,
    },
    color: {
      type: String,
      value: 'var(--app-M4)',
    },
    voidColor: {
      type: String,
      value: 'var(--app-B3-N7)',
    },
    disabledColor: {
      type: String,
      value: 'var(--app-B3-N7)',
    },
    count: {
      type: Number,
      value: 5,
      observer(value: number) {
        this.setData({ innerCountArray: Array.from({ length: value }) });
      },
    },
    gutter: null,
    touchable: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    innerValue: 0,
    innerCountArray: Array.from({ length: 5 }),
  },

  methods: {
    onSelect(event: WechatMiniprogram.CustomEvent) {
      const { data } = this;
      const { score } = event.currentTarget.dataset;
      if (!data.disabled && !data.readonly) {
        this.setData({ innerValue: score + 1 });

        if (canIUseModel()) {
          this.setData({ value: score + 1 });
        }

        wx.nextTick(() => {
          this.$emit('input', score + 1);
          this.$emit('change', score + 1);
        });
      }
    },

    onTouchMove(event: WechatMiniprogram.TouchEvent) {
      const { touchable } = this.data;
      if (!touchable) return;

      const { clientX } = event.touches[0];

      getAllRect(this, '.smart-rate__icon').then(list => {
        const target = list
          .sort((cur, next) => cur.dataset.score - next.dataset.score)
          .find(item => clientX >= item.left && clientX <= item.right);

        if (target != null) {
          this.onSelect({
            ...event,
            currentTarget: target as unknown as WechatMiniprogram.Target,
          });
        }
      });
    },
  },
});
