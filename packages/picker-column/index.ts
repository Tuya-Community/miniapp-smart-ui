import { SmartComponent } from '../common/component';
import { range } from '../common/utils';
import { isObj } from '../common/validator';
import ty from '../common/ty';

const DEFAULT_DURATION = 400;

SmartComponent({
  classes: ['active-class'],

  props: {
    valueKey: String,
    className: String,
    itemHeight: Number,
    disabled: Boolean,
    visibleItemCount: Number,
    activeStyle: {
      type: String,
      value: '',
    },
    options: {
      type: Array,
      value: [],
      observer(value) {
        if (!this.data.isInit) return;
        this.updateUint(value);
        this.updateVisibleOptions(this.data.currentIndex);
      },
    },
    defaultIndex: {
      type: Number,
      value: 0,
    },
    changeAnimation: {
      type: Boolean,
      value: true,
    },
    fontStyle: {
      type: String,
      value: '',
    },
    activeIndex: {
      type: Number,
      value: -1,
      observer(index: number) {
        if (!this.data.isInit) return;
        this.setIndex(index, false, this.data.changeAnimation);
      },
    },
    unit: {
      type: String,
      value: '',
    },
    animationTime: {
      type: Number,
      value: 300,
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
    playing: false,
    isInit: false,
    maxText: '',
    timer: null as any,
    preOffsetList: [] as number[],
  },

  created() {
    const { defaultIndex, activeIndex, options } = this.data;
    this.updateUint(options);
    this.setIndex(
      activeIndex !== -1 ? activeIndex : defaultIndex,
      false,
      this.data.changeAnimation
    );
    this.setData({
      isInit: true,
    });
  },

  methods: {
    getCount() {
      return this.data.options.length;
    },

    onTouchStart(event: WechatMiniprogram.TouchEvent) {
      if (this.data.disabled) {
        return;
      }
      if (this.data.timer) {
        clearTimeout(this.data.timer);
        this.setData({
          timer: null,
        });
      }
      if (!this.data.playing) {
        this.$emit('animation-start');
      }
      this.setData({
        startY: event.touches[0].clientY,
        startOffset: this.data.offset,
        duration: 100,
        playing: true,
        timer: null,
        preOffsetList: [this.data.offset],
      });
    },

    onTouchMove(event: WechatMiniprogram.TouchEvent) {
      if (this.data.disabled) {
        return;
      }
      const { data } = this;
      const { preOffsetList } = data;
      const deltaY = event.touches[0].clientY - data.startY;
      const offset = range(
        data.startOffset + deltaY,
        -(this.getCount() * data.itemHeight),
        data.itemHeight
      );
      const direction = this.checkIsDown(offset);
      // 上一次滚动的索引
      const preIndex = range(
        Math.round(-preOffsetList[preOffsetList.length - 1] / data.itemHeight),
        0,
        this.getCount() - 1
      );
      // 最终定位索引
      const index = range(Math.round(-offset / data.itemHeight), 0, this.getCount() - 1);
      if (
        (direction === 'up' && index < data.renderStart + 8) ||
        (direction === 'down' && index > data.renderStart + data.renderNum - 8)
      ) {
        this.updateVisibleOptions(index);
      }
      // 索引变化时 粗发震动反馈
      if (index !== preIndex) {
        // @ts-ignore
        this.vibrateShort();
      }
      const animationIndex = Math.abs(-offset / data.itemHeight);
      this.setData({
        offset,
        animationIndex: animationIndex,
        preOffsetList: [...data.preOffsetList, offset],
        animate: false,
      });
    },

    async onTouchEnd() {
      const { data } = this;
      if (data.disabled) {
        return;
      }
      const { preOffsetList } = data;
      let preOffset = Math.max(
        Math.abs(preOffsetList[preOffsetList.length - 3] - preOffsetList[preOffsetList.length - 4]),
        Math.abs(preOffsetList[preOffsetList.length - 2] - preOffsetList[preOffsetList.length - 3]),
        Math.abs(preOffsetList[preOffsetList.length - 1] - preOffsetList[preOffsetList.length - 2])
      );
      if (isNaN(preOffset)) preOffset = 0;
      preOffset = Math.min(preOffset, 40);
      // 三次同样的距离 说明用户一直在顶部或者底部滑动  或在move途中已经是上下边缘了
      const isSameTouch =
        (preOffsetList[preOffsetList.length - 1] === preOffsetList[preOffsetList.length - 2] &&
          preOffsetList[preOffsetList.length - 2] === preOffsetList[preOffsetList.length - 3]) ||
        preOffsetList[preOffsetList.length - 1] === -(this.getCount() * data.itemHeight) ||
        preOffsetList[preOffsetList.length - 1] === data.itemHeight;
      // 是否是向下滚动
      const direction = this.checkIsDown();
      // 当滚动速度比较慢时(<3) 不增加惯性滚动距离
      const offset =
        Math.abs(preOffset) < 3 || isSameTouch || !direction
          ? data.offset
          : data.offset + (direction === 'down' ? -preOffset : preOffset) * 10;
      // 有数字的最大滚动距离
      const countHeight = (this.getCount() - 1) * data.itemHeight;
      // 动画最大滚动距离 上下各加一个 data.itemHeight 的滚动空间
      const animationOffset = range(offset, -(this.getCount() * data.itemHeight), data.itemHeight);

      // 最终定位滚动位置
      const finOffset =
        animationOffset < -countHeight ? -countHeight : animationOffset > 0 ? 0 : animationOffset;
      // 获取索引
      const index = range(Math.round(-finOffset / data.itemHeight), 0, this.getCount() - 1);
      // 获取索引的标准距离
      const offsetData = -index * data.itemHeight;
      // 增加惯性音效
      if (Math.abs(offsetData - data.offset) > data.itemHeight && !isSameTouch) {
        const countVibrate = Math.abs(offsetData - data.offset) / data.itemHeight;
        // @ts-ignore
        this.vibrateShort(Math.floor(countVibrate), data.animationTime);
      }
      // 最终定位索引
      this.setData({
        duration: isSameTouch ? 150 : data.animationTime,
        animationIndex: index,
        offset: offsetData,
        animate: true,
      });

      // 更新列表
      if (
        (direction === 'up' && index < data.renderStart + 8) ||
        (direction === 'down' && index > data.renderStart + data.renderNum - 8)
      ) {
        await this.updateVisibleOptions(index);
      }

      // 更新索引
      if (index !== data.currentIndex) {
        return this.setData({
          timer: setTimeout(
            async () => {
              this.setIndex(index, true, false);
              // await this.setData({
              //   timer: null,
              //   currentIndex: index,
              //   // animationIndex: index,
              // });
              // this.$emit('change', index);
            },
            isSameTouch ? 150 : data.animationTime
          ),
        });
      }
      this.setData({
        playing: false,
      });
      this.$emit('animation-end');
    },
    checkIsDown(curr?: number) {
      const { data } = this;
      const { preOffsetList } = data;
      const currOffset = curr === undefined ? preOffsetList[preOffsetList.length - 1] : curr;
      const preOffset =
        curr === undefined
          ? preOffsetList[preOffsetList.length - 2]
          : preOffsetList[preOffsetList.length - 1];
      if (currOffset === undefined || preOffset === undefined || currOffset === preOffset) return;
      return currOffset < preOffset ? 'down' : 'up';
    },

    vibrateShort(count?: number, time = 1000) {
      if (!count) {
        ty.vibrateShort({ type: 'light' });
        return;
      }
      let has = 0;
      const timer = setInterval(() => {
        if (has >= count) {
          clearInterval(timer);
          return;
        }
        has++;
        this.vibrateShort();
      }, time / count - 20);
    },

    onClickItem(event: WechatMiniprogram.TouchEvent) {
      if (this.data.disabled) return;
      const { index } = event.currentTarget.dataset;
      if (index === this.data.currentIndex || index < 0 || index > this.data.options.length - 1) {
        return;
      }
      this.vibrateShort(Math.abs(index - this.data.currentIndex), DEFAULT_DURATION);
      this.setIndex(index, true, true);
    },

    updateUint(options: any[]) {
      const { unit, valueKey } = this.data;
      if (unit) {
        let maxText = '';
        options.forEach(option => {
          const value = isObj(option) ? option[valueKey]?.toString() : option?.toString();
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
        // 选项多于 20 个时，进行列表优化
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
      return isObj(option) && data.valueKey in option ? option[data.valueKey] : option;
    },

    setIndex(index: number, userAction?: boolean, animate?: boolean, time = DEFAULT_DURATION) {
      const { data } = this;
      index = this.adjustIndex(index) || 0;
      const offset = -index * data.itemHeight;
      if (!data.playing) {
        this.$emit('animation-start');
        this.setData({
          playing: true,
        });
      }
      if (index !== data.currentIndex) {
        // 需要动画的情况下，保持最大的截取
        this.updateVisibleOptions(index);
        if (animate) {
          return this.set({
            currentIndex: index,
            animationIndex: index,
            offset,
            animate: true,
            duration: time,
          }).then(() => {
            if (!userAction) {
              this.setData({
                playing: false,
              });
              this.$emit('animation-end');
              return;
            }
            this.$emit('change', index);
            this.setData({
              playing: false,
            });
            this.$emit('animation-end');
          });
        }

        return this.set({
          offset,
          currentIndex: index,
          animationIndex: index,
          animate: !!animate,
        }).then(() => {
          if (!userAction) {
            this.setData({
              playing: false,
            });
            this.$emit('animation-end');
            return;
          }
          this.$emit('change', index);
          this.setData({
            playing: false,
          });
          this.$emit('animation-end');
        });
      }

      this.setData({
        playing: false,
      });
      this.$emit('animation-end');
      return this.set({ offset });
    },

    setValue(value: string) {
      const { options } = this.data;
      for (let i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i, false, this.data.changeAnimation);
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
