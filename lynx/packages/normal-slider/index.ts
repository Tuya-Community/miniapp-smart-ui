import { getRect } from '../common/utils';
import { SmartComponent } from '../common/component';

SmartComponent({
  props: {
    className: {
      type: String,
      value: '',
    },
    disable: {
      type: Boolean,
      value: false,
    },
    // 右滑块初始值/单向滑条初始值
    value: {
      type: Number,
      value: 0,
      observer(value) {
        this.setData({ nativeValue: this.format(value) });
      },
    },
    // 最小值
    min: {
      type: Number,
      value: 0,
    },
    // 最大值
    max: {
      type: Number,
      value: 100,
    },
    // 阶段值
    step: {
      type: Number,
      value: 1,
    },
    // 滑块样式
    thumbStyle: {
      type: String,
    },
    thumbWrapStyle: {
      type: null,
    },
    // 轨道样式
    trackStyle: {
      type: String,
    },
    // 滑条样式
    barStyle: {
      type: String,
    },
    // step样式
    stepStyle: {
      type: String,
    },
    // step样式
    activeStepStyle: {
      type: String,
    },
    // 方向 "horizontal" | "vertical"
    direction: {
      type: String,
    },
    // 隐藏滑块
    hideThumb: {
      type: Boolean,
      value: false,
    },
    // 显示阶段提示
    showSteps: {
      type: Boolean,
      value: false,
    },
    // 反转
    reverse: {
      type: Boolean,
      value: false,
    },
    // 使用触摸跳跃
    enableTouch: {
      type: Boolean,
      value: true,
    },
    // 使用触摸bar增加偏移
    enableTouchBar: {
      type: Boolean,
      value: false,
    },
    // 唯一ID
    instanceId: {
      type: String,
    },
    // 在bar上显示文本
    showText: {
      type: Boolean,
    },
    // bar文本样式
    textStyle: {
      type: String,
    },
    // 文本格式化，例如 textTemplate="比率 {{text}} %"
    textTemplate: {
      type: String,
    },
    // 动态计算thumb样式，如 { background: "rgba(0,0,0, {{text}}/100)" }
    thumbStyleCalc: {
      type: null,
    },
    // 首次渲染时隐藏bar
    hideBarOnFirstRender: {
      type: Boolean,
      value: false,
    },
    // 点击热区样式
    hotAreaStyle: {
      type: String,
    },
    hideThumbButton: {
      type: Boolean,
      value: false,
    },
    thumbStyleRenderFormatter: {
      type: null,
    },
    thumbStyleRenderValueScale: {
      type: Number,
      value: 1,
    },
    thumbStyleRenderValueStart: {
      type: Number,
      value: 1,
    },
    thumbWidth: Number,
    thumbHeight: Number,
    thumbStyleRenderValueReverse: {
      type: Boolean,
      value: false,
    },
    hidden: Boolean,
    parcel: {
      type: Boolean,
      value: false,
    },
    parcelThumbWidth: Number,
    parcelThumbHeight: Number,
    parcelMargin: {
      type: Number,
      value: 0,
    },
  },
  data: { nativeValue: 0, ticks: [] as number[] },
  watch: {
    'min,max,step'() {
      this.setData({ nativeValue: this.format(this.data.nativeValue) });
      this.updateTicks();
    },
  },
  created() {
    this.setData({ nativeValue: this.format(this.data.value) });
    this.updateTicks();
  },
  destroyed() {
    this.generation = (this.generation || 0) + 1;
  },
  methods: {
    format(value) {
      const { min, max, step } = this.data;
      const increment = step > 0 ? step : 1;
      return Math.max(
        min,
        Math.min(
          max,
          Number((Math.round((Number(value) - min) / increment) * increment + min).toFixed(8))
        )
      );
    },
    updateTicks() {
      const { min, max, step } = this.data;
      const ticks: number[] = [];
      if (step > 0 && max > min)
        for (let n = min; n <= max && ticks.length < 201; n += step) ticks.push(n);
      this.setData({ ticks });
    },
    pointer(event) {
      return (
        (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0])
      );
    },
    async setFromPointer(point, commit = false) {
      if (!point || this.data.disable) return;
      const { generation } = this;
      const revision = (this.pointerRevision || 0) + 1;
      this.pointerRevision = revision;
      const rect = await getRect(this, '.smart-normal-slider__track');
      if (
        generation !== this.generation ||
        revision !== this.pointerRevision ||
        this.data.disable ||
        !rect
      )
        return;
      const vertical = this.data.direction === 'vertical';
      const total = vertical ? rect.height : rect.width;
      if (!(total > 0)) return;
      const thumbSize = vertical ? this.data.parcelThumbHeight : this.data.parcelThumbWidth;
      const inset = this.data.parcel ? (thumbSize || 20) / 2 + (this.data.parcelMargin || 0) : 0;
      const usable = total - 2 * inset;
      if (!(usable > 0)) return;
      let ratio =
        ((vertical ? point.clientY : point.clientX) - (vertical ? rect.top : rect.left) - inset) /
        usable;
      if (this.data.reverse) ratio = 1 - ratio;
      const value = this.format(this.data.min + ratio * (this.data.max - this.data.min));
      this.setData({ nativeValue: value });
      this.$emit('change', { value });
      if (commit) this.$emit('end', { value });
    },
    onNativeStart(event) {
      if (this.data.disable) return;
      this.generation = (this.generation || 0) + 1;
      this.startValue = this.data.nativeValue;
      this.dragging = false;
      this.$emit('start', { value: this.data.nativeValue });
    },
    onNativeMove(event) {
      if (this.data.disable) return;
      this.dragging = true;
      this.pendingMove = this.setFromPointer(this.pointer(event));
    },
    onNativeEnd(event) {
      if (!this.dragging || this.data.disable) return;
      this.suppressTapUntil = Date.now() + 250;
      const point = event && this.pointer(event);
      if (point) this.pendingMove = this.setFromPointer(point);
      const { generation } = this;
      Promise.resolve(this.pendingMove).then(() => {
        if (generation === this.generation && !this.data.disable)
          this.$emit('end', { value: this.data.nativeValue });
      });
      this.dragging = false;
    },
    onNativeCancel() {
      this.generation = (this.generation || 0) + 1;
      this.dragging = false;
      this.suppressTapUntil = Date.now() + 250;
      this.setData({ nativeValue: this.startValue });
      this.$emit('cancel', { value: this.startValue });
    },
    onNativeTap(event) {
      if (this.data.disable || !this.data.enableTouch || Date.now() < this.suppressTapUntil) return;
      this.setFromPointer(this.pointer(event), true);
    },
  },
});
