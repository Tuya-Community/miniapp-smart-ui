import { SmartComponent } from '../common/component';
import { generateRangeArray } from '../common/utils';
import { isObj } from '../common/validator';
import ty from '../common/ty';

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
        this.updateViewOptions();
        this.updateUint(value);
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
      observer() {
        if (!this.data.isInit) return;
        this.updateViewOptions();
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
    instanceId: '',
    timer: null as any,
    preOffsetList: [] as number[],
    viewOptions: [] as any[],
  },

  created() {
    this.setData({
      instanceId: getId(),
    });
    this.updateViewOptions();
    const { options } = this.data;
    this.updateUint(options);
    this.setData({
      isInit: true,
    });
  },

  methods: {
    getCount() {
      return this.data.options.length;
    },
    updateViewOptions() {
      const currActiveIndex = this.data.activeIndex < 0 ? 0 : this.data.activeIndex;
      let partNum = Math.floor(currActiveIndex / 10);
      const lastNum = this.data.activeIndex - partNum * 10;
      if (lastNum < 5 && partNum > 0) {
        partNum -= 1;
      }
      const part2Times = Math.floor(partNum / 2);
      const part2Percent = partNum % 2;
      const onePartOffset = part2Percent + part2Times;
      const twoPartOffset = part2Times;
      const isReverse = onePartOffset > twoPartOffset;
      const startPart = twoPartOffset + onePartOffset;
      const viewIndexList = !isReverse
        ? generateRangeArray(startPart * 10, startPart * 10 + 20)
        : [
            ...generateRangeArray(startPart * 10 + 10, startPart * 10 + 20),
            ...generateRangeArray(startPart * 10, startPart * 10 + 10),
          ];
      this.setData({
        viewOptions: viewIndexList,
      });
    },

    vibrateShort(count?: number, time?: number) {
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
      }, (time || this.data.animationTime) / count - 20);
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
          return this.setIndex(i, false, this.data.changeAnimation, this.data.animationTime);
        }
      }
      return Promise.resolve();
    },

    getValue() {
      const { data } = this;
      return data.options[data.activeIndex < 0 ? 0 : data.activeIndex];
    },
    viewOptionsChange(list: number[]) {
      this.setData({
        viewOptions: list,
      });
    },
    activeIndexChange(index: number) {
      this.setData({
        activeIndex: index,
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
