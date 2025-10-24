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
        this.updateCurrentIndex(this.data.currentIndex);
        this.updateVisibleOptions();
      },
    },
    defaultIndex: {
      type: Number,
      value: 0,
    },
    changeAnimation: {
      type: Boolean,
      value: false,
    },
    fontStyle: {
      type: String,
      value: '',
    },
    activeIndex: {
      type: null,
      observer(activeIndex) {
        if (!this.data.isInit) return;
        this.updateCurrentIndex(activeIndex);
        this.updateVisibleOptions();
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
      observer() {
        if (!this.data.isInit) return;
        this.updateCurrentIndex(this.data.currentIndex);
        this.updateVisibleOptions();
      },
    },
  },
  data: {
    isInit: false,
    maxText: '',
    optionsVIndexList: [] as any[], // 渲染的 options index 列表
    animationIndex: 0,
    currentIndex: 0,
    isDestroy: false,
  },

  created() {
    this.setData({
      instanceId: getId(),
    });
    this.updateUint(this.data.options);
    const { activeIndex, defaultIndex } = this.data;
    const currIndex = activeIndex !== null ? activeIndex : defaultIndex;
    this.updateCurrentIndex(currIndex);
    this.updateVisibleOptions();
    this.setData({
      isInit: true,
    });
  },
  destroyed() {
    this.setData({
      isDestroy: true,
    });
  },

  methods: {
    updateCurrentIndex(currIndex) {
      const count = this.data.options.length;
      let animationIndex = this.getAnimationIndex(currIndex);
      animationIndex = this.adjustIndex(animationIndex);
      let currActiveIndex =
        this.data.loop && count > 1 ? ((animationIndex + 1) % count) - 1 : animationIndex;
      if (currActiveIndex < 0) {
        currActiveIndex += count;
      }
      this.setData({
        currentIndex: currActiveIndex,
        animationIndex: animationIndex,
      });
    },
    updateVisibleOptions() {
      const optionsVIndexList = this.getVisibleOptions(this.data.animationIndex);
      this.setData({
        optionsVIndexList: optionsVIndexList,
      });
    },
    getAnimationIndex(currentIndex) {
      const { animationIndex } = this.data;
      const length = this.data.options.length || 1;
      if (this.data.loop && length > 1) {
        const newAnimationIndex = this.getNewAnimationIndex(
          animationIndex,
          currentIndex,
          length,
          this.data.loop
        );
        return newAnimationIndex;
      }
      return currentIndex;
    },
    getCount() {
      return this.data.options.length;
    },

    vibrateShort(count?: number, time = DEFAULT_DURATION) {
      if (this.data.vibrateTimer) {
        clearInterval(this.data.vibrateTimer);
        this.setData({
          vibrateTimer: null,
        });
      }
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
        ty.vibrateShort({ type: 'light' });
      }, time / count - 20);
      this.setData({
        vibrateTimer: timer,
      });
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

    getVisibleOptions(currentIndex?: number) {
      let animationIndex = Math.round(
        currentIndex !== undefined ? currentIndex : this.data.animationIndex
      );
      const vOptionLength = this.data.visibleItemCount * 4 - 2;
      const rotateAngle = 360 / vOptionLength;
      const partCount = Math.floor(this.data.visibleItemCount / 2) + 3;
      const newArr = new Array(vOptionLength).fill('');
      const newValueArr = new Array(partCount * 2 + 1).fill('');
      if (this.data.loop && this.data.options.length > 1) {
        // 循环模式：根据 options 首尾填充 newValueArr 数组
        const optionsLength = this.data.options.length;
        if (optionsLength === 0) {
          // 如果没有选项，填充空值
          newValueArr.fill('');
        } else {
          newValueArr.forEach((item, index) => {
            // 计算相对于中心的偏移量
            const offset = index - partCount;
            // 计算目标索引，支持循环
            const targetAnimationIndex = animationIndex + offset;
            let targetIndex = ((targetAnimationIndex + 1) % optionsLength) - 1;
            if (targetIndex < 0) {
              targetIndex += optionsLength;
            }

            newValueArr[index] = targetIndex;
          });
        }
      } else {
        if (animationIndex < 0) {
          animationIndex = 0;
        }
        if (animationIndex > this.data.options.length - 1) {
          animationIndex = this.data.options.length - 1;
        }
        newValueArr.forEach((item, index) => {
          const valueIndex =
            animationIndex - partCount + index >= 0
              ? animationIndex - partCount + index
              : undefined;
          if (valueIndex === undefined) {
            return;
          }
          newValueArr[index] = valueIndex;
        });
      }
      let rotate = (animationIndex * rotateAngle) % 360;
      if (rotate < 0) {
        rotate += 360;
      }
      const rotateIndex = Math.round(rotate / rotateAngle);

      // 环形结构填充：以rotateIndex为中心，向两边扩展填充newValueArr
      const centerIndex = rotateIndex; // 中心位置
      const halfLength = Math.floor(newValueArr.length / 2); // newValueArr的一半长度

      // 从中心位置开始，向两边填充
      for (let i = 0; i < newValueArr.length; i++) {
        const targetIndex = (centerIndex - halfLength + i + vOptionLength) % vOptionLength; // 确保索引在0-17范围内
        newArr[targetIndex] = newValueArr[i];
      }
      return newArr;
    },
    getNewAnimationIndex(animationIndex, currentIndex, length, loop) {
      const curOptionsNewIndex = Math.floor((animationIndex + 1) / length) * length + currentIndex;
      const preOptionsNewIndex = curOptionsNewIndex - length;
      const afterOptionsNewIndex = curOptionsNewIndex + length;
      const newAnimationIndex = !loop
        ? currentIndex
        : Math.abs(preOptionsNewIndex - animationIndex) >
          Math.abs(curOptionsNewIndex - animationIndex)
        ? Math.abs(curOptionsNewIndex - animationIndex) >
          Math.abs(afterOptionsNewIndex - animationIndex)
          ? afterOptionsNewIndex
          : curOptionsNewIndex
        : Math.abs(preOptionsNewIndex - animationIndex) >
          Math.abs(afterOptionsNewIndex - animationIndex)
        ? afterOptionsNewIndex
        : preOptionsNewIndex;
      return newAnimationIndex;
    },
    adjustIndex(index: number) {
      const { data } = this;
      const count = this.getCount();
      if (this.data.loop && count > 1) {
        for (let i = 0; i < count; i++) {
          const targetIndex = index + i;
          let optionIndex = ((targetIndex + 1) % count) - 1;
          if (optionIndex < 0) {
            optionIndex += count;
          }
          if (
            !this.isDisabled(data.options[optionIndex]) &&
            data.options[optionIndex] !== undefined
          ) {
            return targetIndex;
          }
        }
        return 0;
      }
      const currentIndex = range(index, 0, count);
      for (let i = currentIndex; i < count; i++) {
        if (!this.isDisabled(data.options[i]) && data.options[i] !== undefined) return i;
      }
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (!this.isDisabled(data.options[i]) && data.options[i] !== undefined) return i;
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
      let currentIndex = ((index + 1) % this.data.options.length) - 1;
      if (currentIndex < 0) {
        currentIndex += this.data.options.length;
      }
      this.setData({
        currentIndex,
        animationIndex: index,
      });
    },

    getValue() {
      const { data } = this;
      return isObj(data.options[data.currentIndex])
        ? data.options[data.currentIndex][data.valueKey]
        : data.options[data.currentIndex];
    },

    activeIndexChange(index: number) {
      let currentIndex = ((index + 1) % this.data.options.length) - 1;
      if (currentIndex < 0) {
        currentIndex += this.data.options.length;
      }
      const isSame = currentIndex === this.data.activeIndex;
      this.setData({
        currentIndex,
        animationIndex: index,
      });
      !isSame && this.$emit('change', index);
    },

    animationIndexChange(index: number) {
      this.setData({
        animationIndex: index,
      });
    },

    animationStart() {
      this.$emit('animation-start');
    },
    animationEnd() {
      this.$emit('animation-end');
    },
  },
});
