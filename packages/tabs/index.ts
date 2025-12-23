import { SmartComponent } from '../common/component';
import { touch } from '../mixins/touch';
import {
  getAllRect,
  getRect,
  groupSetData,
  nextTick,
  requestAnimationFrame,
} from '../common/utils';
import { isDef } from '../common/validator';
import { useChildren } from '../common/relation';
import tyApi from '../common/ty';

type TrivialInstance = WechatMiniprogram.Component.TrivialInstance;

SmartComponent({
  mixins: [touch],

  classes: ['nav-class', 'tab-class', 'tab-active-class', 'line-class', 'wrap-class'],

  relation: useChildren('tab', function () {
    this.updateTabs();
  }),

  props: {
    sticky: Boolean,
    border: Boolean,
    swipeable: Boolean,
    titleActiveColor: String,
    titleInactiveColor: String,
    color: String,
    animated: {
      type: Boolean,
      observer() {
        this.children.forEach((child, index) =>
          child.updateRender(index === this.data.currentIndex, this)
        );
      },
    },
    lineWidth: {
      type: null,
      value: 16,
      observer: 'resize',
    },
    lineHeight: {
      type: null,
      value: -1,
    },
    active: {
      type: null,
      value: 0,
      observer(name) {
        if (name !== this.getCurrentName()) {
          this.setCurrentIndexByName(name);
        }
      },
    },
    type: {
      type: String,
      value: 'line',
    },
    ellipsis: {
      type: Boolean,
      value: true,
    },
    duration: {
      type: Number,
      value: 0.3,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    swipeThreshold: {
      type: Number,
      value: 5,
      observer(value) {
        this.setData({
          scrollable: this.children.length > value || !this.data.ellipsis,
        });
      },
    },
    offsetTop: {
      type: Number,
      value: 0,
    },
    lazyRender: {
      type: Boolean,
      value: true,
    },
    useBeforeChange: {
      type: Boolean,
      value: false,
    },
    inactiveDestroy: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    tabs: [] as Record<string, unknown>[],
    scrollLeft: 0,
    scrollable: false,
    currentIndex: 0,
    container: null as unknown as () => WechatMiniprogram.NodesRef,
    skipTransition: true,
    scrollWithAnimation: false,
    lineOffsetLeft: 0,
    inited: false,
    hasSubTitle: false,
  },

  mounted() {
    requestAnimationFrame(() => {
      this.swiping = true;
      this.setData({
        container: () => this.createSelectorQuery().select('.smart-tabs'),
      });

      this.resize();
      this.scrollIntoView();
    });
  },

  methods: {
    updateTabs() {
      const { children = [], data } = this;
      this.setData({
        tabs: children.map((child: TrivialInstance) => child.data),
        scrollable: this.children.length > data.swipeThreshold || !data.ellipsis,
      });

      this.setCurrentIndexByName(data.active || this.getCurrentName());
    },

    trigger(eventName: string, child?: TrivialInstance) {
      const { currentIndex } = this.data;

      const data = this.getChildData(currentIndex, child);

      if (!isDef(data)) {
        return;
      }

      this.$emit(eventName, data);
    },

    onTap(event: WechatMiniprogram.TouchEvent) {
      const { index } = event.currentTarget.dataset;
      const child = this.children[index];

      if (child.data.disabled) {
        this.trigger('disabled', child);
        return;
      }

      this.onBeforeChange(index)
        .then(() => {
          tyApi.selectionVibrate();
          this.setCurrentIndex(index);
          nextTick(() => {
            this.trigger('click');
          });
        })
        .catch(err => {});
    },

    // correct the index of active tab
    setCurrentIndexByName(name) {
      const { children = [] } = this;
      const matched = children.filter((child: TrivialInstance) => child.getComputedName() === name);

      if (matched.length) {
        this.setCurrentIndex(matched[0].index);
      }
    },

    setCurrentIndex(currentIndex) {
      const { data, children = [] } = this;

      if (!isDef(currentIndex) || currentIndex >= children.length || currentIndex < 0) {
        return;
      }

      let hasSubTitle = false;

      groupSetData(this, () => {
        const task: any[] = [];
        children.forEach((item: TrivialInstance, index: number) => {
          const active = index === currentIndex;
          if (active !== item.data.active || !item.inited) {
            active
              ? task.push(() => item.updateRender(active, this))
              : task.unshift(() => item.updateRender(active, this));
          }
          if (item.data.subtitle) {
            hasSubTitle = true;
          }
        });
        task.forEach(fun => fun());
      });

      if (currentIndex === data.currentIndex) {
        if (!data.inited) {
          this.resize();
        }
        return;
      }

      const shouldEmitChange = data.currentIndex !== null;
      this.setData({ currentIndex, hasSubTitle });

      requestAnimationFrame(() => {
        this.resize();
        this.scrollIntoView();
      });

      nextTick(() => {
        this.trigger('input');
        if (shouldEmitChange) {
          this.trigger('change');
        }
      });
    },

    getCurrentName() {
      const activeTab = this.children[this.data.currentIndex];

      if (activeTab) {
        return activeTab.getComputedName();
      }
    },

    resize() {
      const { currentIndex, ellipsis, skipTransition, type } = this.data;

      Promise.all([
        getAllRect(this, '.smart-tab'),
        type === 'line' ? getRect(this, '.smart-tabs__line') : Promise.resolve({ width: 0 }),
      ]).then(([rects = [], lineRect]) => {
        const rect = rects?.[currentIndex];

        if (rect == null || rect === undefined) {
          return;
        }

        const { width: cardWidth, height: cardHeight } = rects[currentIndex];
        let lineOffsetLeft = rects
          .slice(0, currentIndex)
          .reduce((prev, curr) => prev + curr.width, 0);

        if (type === 'line') {
          lineOffsetLeft += (rect.width - lineRect.width) / 2 + (ellipsis ? 0 : 8);
        }

        this.setData({ lineOffsetLeft, inited: true, cardWidth, cardHeight });
        this.swiping = true;

        if (skipTransition) {
          // waiting transition end
          setTimeout(() => {
            this.setData({ skipTransition: false });
          }, this.data.duration);
        }
      });
    },

    // scroll active tab into view
    scrollIntoView() {
      const { currentIndex, scrollable, scrollWithAnimation } = this.data;

      if (!scrollable) {
        return;
      }

      Promise.all([getAllRect(this, '.smart-tab'), getRect(this, '.smart-tabs__nav')]).then(
        ([tabRects, navRect]) => {
          const tabRect = tabRects[currentIndex];
          const offsetLeft = tabRects
            .slice(0, currentIndex)
            .reduce((prev, curr) => prev + curr.width, 0);

          this.setData({
            scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2,
          });

          if (!scrollWithAnimation) {
            nextTick(() => {
              this.setData({ scrollWithAnimation: true });
            });
          }
        }
      );
    },

    onTouchScroll(event: WechatMiniprogram.CustomEvent) {
      this.$emit('scroll', event.detail);
    },

    onTouchStart(event: WechatMiniprogram.TouchEvent) {
      if (!this.data.swipeable) return;
      this.swiping = true;

      this.touchStart(event);
    },

    onTouchMove(event: WechatMiniprogram.TouchEvent) {
      if (!this.data.swipeable || !this.swiping) return;

      this.touchMove(event);
    },

    // watch swipe touch end
    onTouchEnd() {
      if (!this.data.swipeable || !this.swiping) return;

      const { direction, deltaX, offsetX } = this;
      const minSwipeDistance = 50;

      if (direction === 'horizontal' && offsetX >= minSwipeDistance) {
        const index = this.getAvaiableTab(deltaX);
        if (index !== -1) {
          this.onBeforeChange(index)
            .then(() => this.setCurrentIndex(index))
            .catch(err => {});
        }
      }

      this.swiping = false;
    },

    getAvaiableTab(direction: number) {
      const { tabs, currentIndex } = this.data;
      const step = direction > 0 ? -1 : 1;

      for (let i = step; currentIndex + i < tabs.length && currentIndex + i >= 0; i += step) {
        const index = currentIndex + i;

        if (index >= 0 && index < tabs.length && tabs[index] && !tabs[index].disabled) {
          return index;
        }
      }

      return -1;
    },
    onBeforeChange(index: number): Promise<void> {
      const { useBeforeChange } = this.data;

      if (!useBeforeChange) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        this.$emit('before-change', {
          ...this.getChildData(index),
          callback: status => (status ? resolve() : reject()),
        });
      });
    },
    getChildData(index: number, child?: TrivialInstance) {
      const currentChild = child || this.children[index];

      if (!isDef(currentChild)) {
        return;
      }

      return {
        index: currentChild.index,
        name: currentChild.getComputedName(),
        title: currentChild.data.title,
      };
    },
  },
});
