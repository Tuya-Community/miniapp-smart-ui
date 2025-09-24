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
      const animationIndex = activeIndex !== undefined ? activeIndex : defaultIndex;
      const index = this.adjustIndex(animationIndex);
      this.setData({
        activeIndex: index,
        animationIndex: index,
      });
      return index;
    },
    getCount() {
      return this.data.options.length;
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
          newValueArr[index] = valueIndex;
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
      const isSame = index === this.data.activeIndex;
      this.setData({
        activeIndex: index,
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
