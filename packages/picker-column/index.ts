import { SmartComponent } from '../common/component';
import { range } from '../common/utils';
import { isObj } from '../common/validator';
import ty from '../common/ty';

const DEFAULT_DURATION = 400;

const compIdList: string[] = [];
const getId = () => {
  const id = 'smart-picker-column-' + compIdList.length;
  compIdList.push(id);
  return id;
};

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
        this.updateVisibleOptions();
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
      observer(index: number) {
        if (!this.data.isInit) return;
        this.setIndex(index);
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
    loop: {
      type: Boolean,
      value: false,
    },
  },
  data: {
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

    optionsVIndexList: [] as any[], // 渲染的 options index 列表
    offsetActiveIndex: 0,
    endTimer: null as any,
    offsetList: [] as number[],
    moving: false,
    movingDirection: 'down',
    startY: 0,
    offsetting: 0,
    animationIndex: 0,
  },

  created() {
    this.setData({
      instanceId: getId(),
    });
    this.updateUint(this.data.options);
    const animationIndex = this.checkIndex();
    this.updateVisibleOptions(animationIndex);
    this.setData({
      isInit: true,
    });
  },

  methods: {
    checkIndex() {
      const { activeIndex, defaultIndex } = this.data;
      const animationIndex = activeIndex !== undefined ? activeIndex : defaultIndex;
      const index = this.adjustIndex(animationIndex);
      if (activeIndex === index) return index;
      this.setData({
        activeIndex: index,
      });
      return index;
    },
    getCount() {
      return this.data.options.length;
    },

    onTouchStart(event: WechatMiniprogram.TouchEvent) {
      if (this.data.disabled) {
        return;
      }

      if (this.data.endTimer) {
        clearInterval(this.data.endTimer);
      }
      const { pageY } = event.touches[0];
      this.setData({
        startY: pageY,
        moving: false,
        startOffset: this.data.animationIndex * this.data.itemHeight,
        preOffsetting: this.data.animationIndex * this.data.itemHeight,
        offsetList: [],
        endTimer: null,
      });
    },

    onTouchMove(event: WechatMiniprogram.TouchEvent) {
      if (this.data.disabled) {
        return;
      }
      const { pageY } = event.touches[0];
      const offsetY = pageY - this.data.startY;
      const offsetting = -this.data.startOffset + offsetY;
      const newOffsetList = [...this.data.offsetList, offsetting];
      const animationIndex = -offsetting / this.data.itemHeight;
      const preIndexLast = Math.abs(this.data.animationIndex % 1);
      const curIndexLast = Math.abs(animationIndex % 1);
      const offsetCompare = offsetting - this.data.preOffsetting;
      const direction =
        offsetCompare < 0 ? 'down' : offsetCompare > 0 ? 'up' : this.data.movingDirection;
      if (
        (direction === 'down' && preIndexLast <= 0.5 && curIndexLast > 0.5) ||
        (direction === 'up' && preIndexLast >= 0.5 && curIndexLast < 0.5)
      ) {
        this.updateVisibleOptions(animationIndex);
        // ownerInstance.callMethod('vibrateShort');
      }

      if (!this.data.moving) {
        this.$emit('animation-start');
      }

      this.updateVisibleOptions(animationIndex);

      this.setData({
        moving: true,
        animationIndex,
        preOffsetting: offsetting,
        offsetList: newOffsetList,
        movingDirection: direction,
      });
    },

    async onTouchEnd() {
      if (this.data.disabled || !this.data.moving) {
        return;
      }
      const preOffsetList = this.data.offsetList;
      // 计算最后几帧的平均速度，用于惯性滚动
      let recentVelocity = 0;
      /** -1: 向下, 1: 向上, 0: 无滚动 */
      let scrollDirection = 0;

      if (preOffsetList.length >= 2) {
        // 计算速度，优先使用最后几帧的数据
        let recentOffset = 0;
        let recentTime = 0;

        if (preOffsetList.length >= 3) {
          // 有3个或以上数据点，使用最后3个点计算速度
          recentOffset =
            preOffsetList[preOffsetList.length - 1] - preOffsetList[preOffsetList.length - 3];
          recentTime = 2; // 2帧间隔
        } else if (preOffsetList.length === 2) {
          // 只有2个数据点，使用这2个点计算速度
          recentOffset = preOffsetList[1] - preOffsetList[0];
          recentTime = 1; // 1帧间隔
        }

        // 计算速度 (px/ms)
        recentVelocity = Math.abs(recentOffset) / (recentTime * 16);
        // 确定滚动方向
        if (recentOffset > 0) {
          scrollDirection = 1; // 向上滚动
        } else if (recentOffset < 0) {
          scrollDirection = -1; // 向下滚动
        }
      }

      // 惯性滚动参数配置
      const minVelocity = 0.1; // 最小速度阈值，低于此值停止滚动
      const maxInertiaDistance = this.data.itemHeight * 8; // 最大惯性滚动距离

      // 计算惯性滚动距离
      let inertiaDistance = 0;
      if (recentVelocity > minVelocity) {
        // 使用物理公式计算惯性距离：distance = velocity^2 / (2 * friction)
        // 这里简化处理，直接使用速度乘以一个系数
        inertiaDistance = recentVelocity * 200; // 200ms的惯性时间

        // 限制最大滚动距离
        if (inertiaDistance > maxInertiaDistance) {
          inertiaDistance = maxInertiaDistance;
        }

        // 根据滚动方向确定正负值
        inertiaDistance *= scrollDirection;
      }

      const sideCount = Math.floor(this.data.visibleItemCount / 2);

      // 计算最终目标位置 和 index
      let targetOffset =
        Math.round((this.data.preOffsetting + inertiaDistance) / this.data.itemHeight) *
        this.data.itemHeight;
      let currTargetActiveIndex = -targetOffset / this.data.itemHeight + sideCount;
      currTargetActiveIndex = this.adjustIndex(currTargetActiveIndex);
      targetOffset = -(currTargetActiveIndex - sideCount) * this.data.itemHeight;
      const animationOffset = Math.abs(targetOffset - this.data.preOffsetting);

      // 如果动画时间大于150ms，并且滚动距离大于itemHeight，则需要进行动态更新列表
      if (this.data.animationTime > 150 && animationOffset > this.data.itemHeight) {
        const midTime = 20;
        const count = Math.floor((this.data.animationTime - 150) / midTime);
        const midOffset = (targetOffset - this.data.preOffsetting) / count;
        let startCount = 0;
        const endTimer = setInterval(() => {
          startCount++;
          const currOffset = this.data.preOffsetting + midOffset;
          const currIndex = -currOffset / this.data.itemHeight + sideCount;
          if (startCount >= count) {
            this.updateVisibleOptions(currTargetActiveIndex);
            clearInterval(endTimer);
            return;
          }
          this.updateVisibleOptions(currIndex);
        }, midTime);
        this.setData({
          endTimer,
        });
      } else {
        this.updateVisibleOptions(currTargetActiveIndex);
      }
      this.setData({
        animationIndex: currTargetActiveIndex,
        moving: false,
        duration: this.data.animationTime,
      });

      setTimeout(() => {
        this.$emit('animation-end');
      }, this.data.animationTime);
    },

    vibrateShort(count?: number, time = DEFAULT_DURATION) {
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
      this.setIndex(index);
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

    updateVisibleOptions(currentIndex?: number) {
      let animationIndex = Math.round(
        currentIndex !== undefined ? currentIndex : this.data.animationIndex
      );
      const newArr = new Array(18).fill('');
      const newValueArr = new Array(10).fill('');
      if (this.data.loop) {
        newValueArr.forEach((item, index) => {
          const valueIndex = (animationIndex - 5 + index) % this.data.options.length;
          const listIndex = valueIndex < 0 ? this.data.options.length - 1 + valueIndex : valueIndex;
          newValueArr[index] = listIndex;
        });
      } else {
        if (animationIndex < 0) {
          animationIndex = 0;
        }
        if (animationIndex > this.data.options.length - 1) {
          animationIndex = this.data.options.length - 1;
        }
        newValueArr.forEach((item, index) => {
          const valueIndex =
            animationIndex - 5 + index >= 0 ? animationIndex - 5 + index : undefined;
          if (valueIndex === undefined) {
            return;
          }
          newValueArr[index] = this.data.options[valueIndex] ?? '';
        });
      }
      const rotate = (animationIndex * 20) % 360;
      const rotateIndex = Math.round(rotate / 20);

      // 环形结构填充：以rotateIndex为中心，向两边扩展填充newValueArr
      const centerIndex = rotateIndex; // 中心位置
      const halfLength = Math.floor(newValueArr.length / 2); // newValueArr的一半长度

      // 从中心位置开始，向两边填充
      for (let i = 0; i < newValueArr.length; i++) {
        const targetIndex = (centerIndex - halfLength + i + 18) % 18; // 确保索引在0-17范围内
        newArr[targetIndex] = newValueArr[i];
      }
      this.setData({
        optionsVIndexList: newArr,
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
      return 0;
    },

    isDisabled(option: any) {
      return isObj(option) && option.disabled;
    },

    getOptionText(option: any) {
      const { data } = this;
      return isObj(option) && data.valueKey in option ? option[data.valueKey] : option;
    },

    setValue(value: string) {
      const { options } = this.data;
      for (let i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i);
        }
      }
      return Promise.resolve();
    },

    setIndex(index: number) {
      this.setData({
        activeIndex: index,
        animationIndex: index,
      });
    },

    getValue() {
      const { data } = this;
      return data.options[data.activeIndex];
    },

    activeIndexChange(index: number) {
      this.setData({
        activeIndex: index,
        animationIndex: index,
      });
      this.$emit('change', index);
    },

    animationIndexChange(index: number) {
      this.setData({
        animationIndex: index,
      });
    },
  },
});
