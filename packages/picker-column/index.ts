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
      type: null,
      observer(index: number) {
        if (!this.data.isInit) return;
        this.setIndex(index);
        this.updateVisibleOptions(index);
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
    isInit: false,
    maxText: '',
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
      const animationIndex = activeIndex !== null ? activeIndex : defaultIndex;
      const index = this.adjustIndex(animationIndex);
      this.setData({
        activeIndex: Math.abs(index % this.data.options.length),
        animationIndex: index,
      });
      return index;
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

    updateVisibleOptions(currentIndex?: number) {
      let animationIndex = Math.round(
        currentIndex !== undefined ? currentIndex : this.data.animationIndex
      );
      const vOptionLength = this.data.visibleItemCount * 4 - 2;
      const rotateAngle = 360 / vOptionLength;
      const partCount = Math.floor(this.data.visibleItemCount / 2) + 3;
      const newArr = new Array(vOptionLength).fill('');
      const newValueArr = new Array(partCount * 2 + 1).fill('');
      if (this.data.loop) {
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
            let targetIndex = animationIndex + offset;

            // 处理循环逻辑
            if (targetIndex < 0) {
              // 向前循环：从末尾开始
              targetIndex = ((targetIndex % optionsLength) + optionsLength) % optionsLength;
            } else if (targetIndex >= optionsLength) {
              // 向后循环：从开头开始
              targetIndex %= optionsLength;
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
      const rotate = (animationIndex * rotateAngle) % 360;
      const rotateIndex = Math.round(rotate / rotateAngle);

      // 环形结构填充：以rotateIndex为中心，向两边扩展填充newValueArr
      const centerIndex = rotateIndex; // 中心位置
      const halfLength = Math.floor(newValueArr.length / 2); // newValueArr的一半长度

      // 从中心位置开始，向两边填充
      for (let i = 0; i < newValueArr.length; i++) {
        const targetIndex = (centerIndex - halfLength + i + vOptionLength) % vOptionLength; // 确保索引在0-17范围内
        newArr[targetIndex] = newValueArr[i];
      }
      this.setData({
        optionsVIndexList: newArr,
      });
    },
    adjustIndex(index: number) {
      const { data } = this;
      const count = this.getCount();

      index = this.data.loop ? index : range(index, 0, count);
      for (let i = index; i < count; i++) {
        const targetIndex = this.data.loop ? Math.abs(i % count) : i;
        if (!this.isDisabled(data.options[targetIndex])) return i;
      }
      for (let i = index - 1; i >= 0; i--) {
        const targetIndex = this.data.loop ? Math.abs(i % count) : i;
        if (!this.isDisabled(data.options[targetIndex])) return i;
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
        activeIndex: Math.abs(index % this.data.options.length),
        animationIndex: index,
      });
    },

    getValue() {
      const { data } = this;
      return data.options[data.activeIndex];
    },

    activeIndexChange(index: number) {
      const isSame = index === this.data.activeIndex;
      this.setData({
        activeIndex: Math.abs(index % this.data.options.length),
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
