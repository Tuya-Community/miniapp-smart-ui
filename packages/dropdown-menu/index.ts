import { SmartComponent } from '../common/component';
import { useChildren } from '../common/relation';
import { addUnit, getRect, getSystemInfoSync } from '../common/utils';
import { TriangleDown } from '@tuya-miniapp/icons';
import ty from '../common/ty';
let ARRAY: WechatMiniprogram.Component.TrivialInstance[] = [];

SmartComponent({
  field: true,
  classes: ['title-class'],

  relation: useChildren('dropdown-item', function () {
    this.updateItemListData();
  }),

  props: {
    activeColor: {
      type: String,
      observer: 'updateChildrenData',
    },
    overlay: {
      type: Boolean,
      value: true,
      observer: 'updateChildrenData',
    },
    zIndex: {
      type: Number,
      value: 10,
    },
    duration: {
      type: Number,
      value: 200,
      observer: 'updateChildrenData',
    },
    direction: {
      type: String,
      value: 'down',
      observer: 'updateChildrenData',
    },
    safeAreaTabBar: {
      type: Boolean,
      value: false,
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true,
      observer: 'updateChildrenData',
    },
    closeOnClickOutside: {
      type: Boolean,
      value: true,
    },
    triangleColor: {
      type: String,
      value: '#CCCCCC',
      observer: 'updateChildrenData',
    },
  },

  data: {
    triangleDown: TriangleDown,
    activeColorStatic: '',
    itemListData: [] as Record<string, unknown>[],
  },

  mounted() {
    const themeInfo = ty.getThemeInfo() ?? {};
    const activeColorStatic = this.data.activeColor || themeInfo['--app-M1'] || '#3678E3';
    this.setData({ activeColorStatic });
  },

  beforeCreate() {
    const { windowHeight } = getSystemInfoSync();
    this.windowHeight = windowHeight;
    ARRAY.push(this);
  },

  destroyed() {
    ARRAY = ARRAY.filter(item => item !== this);
  },

  methods: {
    updateItemListData() {
      this.setData({
        itemListData: this.children.map(child => child.data),
      });
    },

    updateChildrenData() {
      this.children.forEach(child => {
        child.updateDataFromParent();
      });
    },

    toggleItem(active: number) {
      this.children.forEach((item, index) => {
        const { showPopup } = item.data;
        if (index === active) {
          item.toggle();
        } else if (showPopup) {
          item.toggle(false, { immediate: true });
        }
      });
    },

    close() {
      this.children.forEach(child => {
        child.toggle(false, { immediate: true });
      });
    },

    getChildWrapperStyle() {
      const { zIndex, direction } = this.data;

      return getRect(this, '.smart-dropdown-menu').then(rect => {
        const { top = 0, bottom = 0 } = rect;
        const offset = direction === 'down' ? bottom : top;

        let wrapperStyle = `z-index: ${zIndex};`;

        if (direction === 'down') {
          wrapperStyle += `top: ${addUnit(offset)};`;
        } else {
          wrapperStyle += `top: 0;height: ${addUnit(offset)}`;
        }

        return wrapperStyle;
      });
    },

    onTitleTap(event: WechatMiniprogram.TouchEvent) {
      const { index } = event.currentTarget.dataset;
      const child = this.children[index];

      if (!child.data.disabled) {
        ARRAY.forEach(menuItem => {
          if (menuItem && menuItem.data.closeOnClickOutside && menuItem !== this) {
            menuItem.close();
          }
        });

        this.toggleItem(index);
      }
    },
  },
});
