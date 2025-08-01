import { Check } from '@tuya-miniapp/icons';
import { SmartComponent } from '../common/component';

SmartComponent({
  classes: [
    'main-item-class',
    'content-item-class',
    'main-active-class',
    'content-active-class',
    'main-disabled-class',
    'content-disabled-class',
  ],

  props: {
    items: {
      type: Array,
      observer: 'updateSubItems',
    },
    activeId: null,
    mainActiveIndex: {
      type: Number,
      value: 0,
      observer: 'updateSubItems',
    },
    height: {
      type: null,
      value: 300,
    },
    max: {
      type: Number,
      value: Infinity,
    },
    selectedIcon: {
      type: String,
      value: Check,
    },
  },

  data: {
    subItems: [],
  },

  methods: {
    // 当一个子项被选择时
    onSelectItem(event: WechatMiniprogram.TouchEvent) {
      const { item } = event.currentTarget.dataset;
      const isArray = Array.isArray(this.data.activeId);
      // 判断有没有超出右侧选择的最大数
      const isOverMax = isArray && this.data.activeId.length >= this.data.max;
      // 判断该项有没有被选中, 如果有被选中，则忽视是否超出的条件
      const isSelected = isArray
        ? this.data.activeId.indexOf(item.id) > -1
        : this.data.activeId === item.id;

      if (!item.disabled && (!isOverMax || isSelected)) {
        this.$emit('click-item', item);
      }
    },

    // 当一个导航被点击时
    onClickNav(event: WechatMiniprogram.CustomEvent) {
      const index = event.detail as unknown as number;
      const item = this.data.items[index];
      if (!item.disabled) {
        this.$emit('click-nav', { index });
      }
    },

    // 更新子项列表
    updateSubItems() {
      const { items, mainActiveIndex } = this.data;
      const { options = [] } = items[mainActiveIndex] || {};

      this.setData({ subItems: options });
    },
  },
});
