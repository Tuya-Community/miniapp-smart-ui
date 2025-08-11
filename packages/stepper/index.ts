import { SmartComponent } from '../common/component';
import { isDef } from '../common/validator';
import ty from '../common/ty';
import { Minus } from '@tuya-miniapp/icons';
import { Plus } from '@tuya-miniapp/icons';

const LONG_PRESS_START_TIME = 600;
const LONG_PRESS_INTERVAL = 200;

// add num and avoid float number
function add(num1: number, num2: number) {
  const cardinal = 10 ** 10;
  return Math.round((num1 + num2) * cardinal) / cardinal;
}

function equal(value1: number | string, value2: number | string) {
  return String(value1) === String(value2);
}

SmartComponent({
  field: true,

  classes: ['input-class', 'plus-class', 'minus-class'],

  props: {
    value: {
      type: null,
    },
    integer: {
      type: Boolean,
      observer: 'check',
    },
    disabled: Boolean,
    inputWidth: String,
    buttonSize: String,
    asyncChange: Boolean,
    disableInput: Boolean,
    decimalLength: {
      type: Number,
      value: null as unknown as number,
      observer: 'check',
    },
    min: {
      type: null,
      value: 1,
      observer: 'check',
    },
    max: {
      type: null,
      value: Number.MAX_SAFE_INTEGER,
      observer: 'check',
    },
    step: {
      type: null,
      value: 1,
    },
    showPlus: {
      type: Boolean,
      value: true,
    },
    showMinus: {
      type: Boolean,
      value: true,
    },
    disablePlus: Boolean,
    disableMinus: Boolean,
    longPress: {
      type: Boolean,
      value: true,
    },
    theme: String,
    alwaysEmbed: Boolean,
  },

  data: {
    currentValue: '',
    Minus,
    Plus,
    isInit: false,
  },

  watch: {
    value() {
      this.observeValue();
    },
  },

  created() {
    const currentValue = this.format(this.data.value, true);
    if (currentValue !== this.data.value) {
      this.$emit('change', currentValue);
    }
    this.setData({
      currentValue,
      isInit: true,
    });
  },

  methods: {
    observeValue() {
      const { value, isInit } = this.data;
      if (!isInit) return;
      const currentValue = this.format(value, true);
      if (currentValue !== value) {
        this.$emit('change', currentValue);
      }
      this.setData({ currentValue });
    },

    check() {
      const val = this.format(this.data.currentValue);
      if (!equal(val, this.data.currentValue)) {
        this.setData({ currentValue: val });
      }
    },

    isDisabled(type: string) {
      const { disabled, disablePlus, disableMinus, currentValue, max, min } = this.data;

      if (type === 'plus') {
        return disabled || disablePlus || +currentValue >= +max;
      }

      return disabled || disableMinus || +currentValue <= +min;
    },

    onFocus(event: WechatMiniprogram.InputFocus) {
      this.$emit('focus', event.detail);
    },

    onBlur(event: WechatMiniprogram.InputBlur) {
      const value = this.format(event.detail.value, true);

      this.setData({ currentValue: value });

      this.emitChange(value);

      this.$emit('blur', {
        ...event.detail,
        value,
      });
    },

    // filter illegal characters
    filter(value) {
      value = String(value).replace(/[^0-9.-]/g, '');

      if (this.data.integer && value.indexOf('.') !== -1) {
        value = value.split('.')[0];
      }

      return value;
    },

    // limit value range
    format(value, isFormatAll = false) {
      value = this.filter(value);

      // format range
      value = value === '' ? 0 : +value;
      value = Math.min(this.data.max, value);
      if (isFormatAll) {
        value = Math.max(value, this.data.min);
      }

      // format decimal
      if (isDef(this.data.decimalLength) && isFormatAll) {
        value = value.toFixed(this.data.decimalLength);
      }

      return value;
    },

    onInput(event: WechatMiniprogram.Input) {
      const { value = '' } = event.detail || {};

      // allow input to be empty
      if (value === '') {
        return;
      }

      const formatted = this.format(value);

      this.emitChange(formatted);
    },

    emitChange(value: string) {
      if (!this.data.asyncChange) {
        this.setData({ currentValue: value });
      }

      this.$emit('change', value);
    },

    onChange() {
      const { type } = this;

      if (this.isDisabled(type)) {
        this.$emit('overlimit', type);
        return;
      }

      const diff = type === 'minus' ? -this.data.step : +this.data.step;

      const value = this.format(add(+this.data.currentValue, diff), true);

      this.emitChange(value);
      this.$emit(type);
      ty.vibrateShort({ type: 'light' });
    },

    longPressStep() {
      this.longPressTimer = setTimeout(() => {
        this.onChange();
        this.longPressStep();
      }, LONG_PRESS_INTERVAL);
    },

    onTap(event: WechatMiniprogram.TouchEvent) {
      const { type } = event.currentTarget.dataset;
      this.type = type;
      this.onChange();
    },

    onTouchStart(event: WechatMiniprogram.TouchEvent) {
      if (!this.data.longPress) {
        return;
      }
      clearTimeout(this.longPressTimer);

      const { type } = event.currentTarget.dataset;
      this.type = type;
      this.isLongPress = false;

      this.longPressTimer = setTimeout(() => {
        this.isLongPress = true;
        this.onChange();
        this.longPressStep();
      }, LONG_PRESS_START_TIME);
    },

    onTouchEnd() {
      if (!this.data.longPress) {
        return;
      }

      clearTimeout(this.longPressTimer);
    },
  },
});
