import { SmartComponent } from '../common/component';
import { range } from '../common/utils';
import { isObj } from '../common/validator';

const DEFAULT_DURATION = 200;

SmartComponent({
  classes: ['active-class'],

  props: {
    valueKey: String,
    className: String,
    itemHeight: Number,
    visibleItemCount: Number,
    options: {
      type: Array,
      value: [],
      observer(value) {
        this.updateUint(value);
        this.updateVisibleOptions(this.data.currentIndex);
      },
    },
    defaultIndex: {
      type: Number,
      value: 0,
    },
    activeIndex: {
      type: Number,
      value: -1,
      observer(index: number) {
        this.setIndex(index, false, true);
      },
    },
    unit: {
      type: String,
      value: '',
    },
  },
  data: {
    startY: 0,
    offset: 0,
    duration: 0,
    startOffset: 0,
    optionsV: [] as any[], // 渲染的 options
    currentIndex: -1,
    renderNum: 0,
    renderStart: 0,
    animate: false,
    maxText: '',
  },

  created() {
    const { defaultIndex, activeIndex, options } = this.data;
    this.updateUint(options);
    this.setIndex(activeIndex !== -1 ? activeIndex : defaultIndex, false, true);
  },

  methods: {
    getCount() {
      return this.data.options.length;
    },

    onTouchStart(event: WechatMiniprogram.TouchEvent) {
      this.setData({
        startY: event.touches[0].clientY,
        startOffset: this.data.offset,
        duration: 0,
      });
    },

    onTouchMove(event: WechatMiniprogram.TouchEvent) {
      const { data } = this;
      const deltaY = event.touches[0].clientY - data.startY;
      this.setData({
        offset: range(
          data.startOffset + deltaY,
          -(this.getCount() * data.itemHeight),
          data.itemHeight
        ),
      });
    },

    onTouchEnd() {
      const { data } = this;
      if (data.offset !== data.startOffset) {
        const index = range(
          Math.round(-data.offset / data.itemHeight),
          0,
          this.getCount() - 1
        );
        this.setIndex(index, true, true);
      }
    },
    onTransitionEnd() {
      const { options, visibleItemCount, currentIndex } = this.data;

      let renderNum = 0;
      let renderStart = 0;
      if (visibleItemCount < 20 && options.length > visibleItemCount) {
        // 选项多于20个时，进行列表优化
        renderNum = Math.max(visibleItemCount * 2, 20);
        renderStart = Math.max(0, currentIndex - renderNum / 2);
        const optionsV = options.slice(renderStart, renderStart + renderNum);
        this.setData({ optionsV, renderStart, renderNum, animate: false });
      } else {
        this.setData({ animate: false });
      }
      if (this.fireChange) {
        this.$emit('change', currentIndex);
      }
    },

    onClickItem(event: WechatMiniprogram.TouchEvent) {
      const { index } = event.currentTarget.dataset;
      this.setIndex(index, true, true);
    },

    updateUint(options: any[]) {
      const { unit, valueKey } = this.data;
      if (unit) {
        let maxText = '';
        options.forEach((option) => {
          const value = isObj(option)
            ? option[valueKey]?.toString()
            : option?.toString();
          if (maxText.length < value.length) {
            maxText = value;
          }
        });
        this.setData({ maxText });
      }
    },

    updateVisibleOptions(targetIndex: number) {
      const { options, visibleItemCount, currentIndex } = this.data;
      if (visibleItemCount < 20 && options.length > visibleItemCount) {
        let renderNum = 0;
        let renderStart = 0;
        // 选项多于20个时，进行列表优化
        renderNum = Math.max(visibleItemCount * 2, 20);
        renderStart = Math.max(0, targetIndex - renderNum / 2);
        const renderEnd = Math.min(options.length, renderStart + renderNum);
        if (currentIndex >= 0) {
          if (currentIndex < targetIndex) {
            renderStart = Math.max(0, currentIndex - renderNum / 2);
          }
        }
        renderNum = renderEnd - renderStart;
        const optionsV = options.slice(renderStart, renderEnd);
        return this.set({ optionsV, renderStart, renderNum });
      }
      return this.set({
        optionsV: options,
        renderStart: 0,
        renderNum: options.length,
      });
    },
    adjustIndex(index: number) {
      const { data } = this;
      const count = this.getCount();

      index = range(index, 0, count);
      for (let i = index; i < count; i++) {
        if (!this.isDisabled(data.options[i])) return i;
      }
      for (let i = index - 1; i >= 0; i--) {
        if (!this.isDisabled(data.options[i])) return i;
      }
    },

    isDisabled(option: any) {
      return isObj(option) && option.disabled;
    },

    getOptionText(option: any) {
      const { data } = this;
      return isObj(option) && data.valueKey in option
        ? option[data.valueKey]
        : option;
    },

    setIndex(index: number, userAction?: boolean, animate?: boolean) {
      const { data } = this;
      index = this.adjustIndex(index) || 0;
      const offset = -index * data.itemHeight;
      this.fireChange = false;
      if (index !== data.currentIndex) {
        // 需要动画的情况下，保持最大的截取
        if (animate) {
          return this.updateVisibleOptions(index).then(() => {
            this.set({
              currentIndex: index,
              offset,
              animate: true,
              duration: DEFAULT_DURATION,
            }).then(() => {
              if (!userAction) return;
              if ([0, data.optionsV.length - 1].includes(index)) {
                this.$emit('change', index);
                return;
              };
              this.fireChange = true;
            });
          });
        }

        return this.set({
          optionsV: data.options,
          offset,
          currentIndex: index,
          renderStart: 0,
          animate: !!animate,
        }).then(() => {
          userAction && this.$emit('change', index);
        });
      }

      return this.set({ offset });
    },

    setValue(value: string) {
      const { options } = this.data;
      for (let i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i, false, true);
        }
      }
      return Promise.resolve();
    },

    getValue() {
      const { data } = this;
      return data.options[data.currentIndex];
    },
  },
});
