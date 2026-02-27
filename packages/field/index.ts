import { nextTick } from '../common/utils';
import { SmartComponent } from '../common/component';
import { commonProps, inputProps, textareaProps } from './props';
import Xmark from '@tuya-miniapp/icons/dist/svg/Xmark';
import { InputDetails } from './types';
import tyApi from '../common/ty';
import { formatNumber, parseFormattedNumber } from './numberFormat';

SmartComponent({
  field: true,

  classes: ['input-class', 'right-icon-class', 'label-class'],

  props: {
    ...commonProps,
    ...inputProps,
    ...textareaProps,
    size: String,
    icon: String,
    label: String,
    error: Boolean,
    center: Boolean,
    isLink: Boolean,
    leftIcon: String,
    rightIcon: String,
    autosize: null,
    required: Boolean,
    interError: Boolean,
    inputAlign: {
      type: String,
    },
    subLabel: String,
    cardMode: Boolean,
    iconClass: String,
    clickable: Boolean,
    customStyle: String,
    errorMessage: String,
    arrowDirection: String,
    showWordLimit: Boolean,
    errorMessageAlign: String,
    hiddenLabel: Boolean,
    readonly: {
      type: Boolean,
      observer: 'setShowClear',
    },
    clearable: {
      type: Boolean,
      observer: 'setShowClear',
    },
    clearTrigger: {
      type: String,
      value: 'focus',
    },
    border: {
      type: Boolean,
      value: false,
    },
    titleWidth: {
      type: String,
      value: '6.2em',
    },
    clearIcon: {
      type: String,
      value: Xmark,
    },
    extraEventParams: {
      type: Boolean,
      value: false,
    },
    numberFormat: {
      type: Boolean,
      value: false,
    },
    locale: {
      type: String,
      value: '',
    },
  },

  data: {
    focused: false,
    innerValue: '',
    showClear: false,
  },

  watch: {
    value(this: WechatMiniprogram.Component.TrivialInstance, value) {
      if (value !== this.value) {
        this.value = value;
        this.updateDisplayValue();
        this.setShowClear();
      }
    },
    numberFormat() {
      this.updateDisplayValue();
    },
    locale() {
      this.updateDisplayValue();
    },
    clearTrigger() {
      this.setShowClear();
    },
  },

  created() {
    this.value = this.data.value;
    this.updateDisplayValue();
  },

  methods: {
    formatValue(value: string) {
      const { maxlength } = this.data;

      if (maxlength !== -1 && value.length > maxlength) {
        return value.slice(0, maxlength);
      }

      return value;
    },

    // 更新显示值（根据 numberFormat 决定是否格式化）
    updateDisplayValue() {
      const { numberFormat, locale } = this.data;
      let displayValue = this.value || '';

      if (numberFormat && displayValue) {
        displayValue = formatNumber(displayValue, locale);
      }

      this.setData({ innerValue: displayValue });
    },

    onInput(event: WechatMiniprogram.Input | WechatMiniprogram.TextareaInput) {
      const { value = '' } = event.detail || {};
      const { numberFormat, locale } = this.data;

      let rawValue = value;

      // 如果启用了数字格式化，需要将格式化后的输入值解析为原始格式
      if (numberFormat) {
        rawValue = parseFormattedNumber(value, locale);
      }

      const formatValue = this.formatValue(rawValue);

      this.value = formatValue;

      // 更新显示值
      this.updateDisplayValue();
      this.setShowClear();

      return this.emitChange({
        ...event.detail,
        value: formatValue,
      });
    },

    onFocus(event: WechatMiniprogram.InputFocus | WechatMiniprogram.TextareaFocus) {
      tyApi.selectionVibrate();
      this.focused = true;
      this.setShowClear();
      this.$emit('focus', event.detail);
    },

    onBlur(event: WechatMiniprogram.InputBlur | WechatMiniprogram.TextareaBlur) {
      this.focused = false;
      this.setShowClear();
      this.$emit('blur', event.detail);
    },

    onClickIcon() {
      this.$emit('click-icon');
    },

    onClickInput(event: WechatMiniprogram.TouchEvent) {
      this.$emit('click-input', event.detail);
    },

    onClear() {
      this.value = '';
      this.updateDisplayValue();
      this.setShowClear();

      nextTick(() => {
        this.emitChange({ value: '' });
        this.$emit('clear', '');
      });
    },

    onConfirm(event: WechatMiniprogram.InputConfirm | WechatMiniprogram.TextareaConfirm) {
      const { value = '' } = event.detail || {};
      const { numberFormat, locale } = this.data;

      let rawValue = value;

      // 如果启用了数字格式化，需要解析为原始格式
      if (numberFormat) {
        rawValue = parseFormattedNumber(value, locale);
      }

      this.value = rawValue;
      this.updateDisplayValue();
      this.setShowClear();
      this.$emit('confirm', rawValue);
    },

    setValue(value: string) {
      this.value = value;
      this.updateDisplayValue();
      this.setShowClear();

      this.emitChange({ value });
    },

    onLineChange(event: WechatMiniprogram.TextareaLineChange) {
      this.$emit('linechange', event.detail);
    },

    onKeyboardHeightChange(
      event:
        | WechatMiniprogram.InputKeyboardHeightChange
        | WechatMiniprogram.TextareaKeyboardHeightChange
    ) {
      this.$emit('keyboardheightchange', event.detail);
    },

    onBindNicknameReview(event) {
      this.$emit('nicknamereview', event.detail);
    },

    emitChange(detail: InputDetails) {
      const { extraEventParams } = this.data;

      this.setData({ value: detail.value });

      let result: InputDetails | undefined;

      const data = extraEventParams
        ? {
            ...detail,
            callback: (data: InputDetails) => {
              result = data;
              this.value = data.value;
              this.updateDisplayValue();
            },
          }
        : detail.value;

      this.$emit('input', data);
      this.$emit('change', data);

      return result;
    },

    setShowClear() {
      const { clearable, readonly, clearTrigger } = this.data;
      const { focused, value } = this;

      let showClear = false;

      if (clearable && !readonly) {
        const hasValue = !!value;
        const trigger = clearTrigger === 'always' || (clearTrigger === 'focus' && focused);

        showClear = hasValue && trigger;
      }

      this.setView({ showClear });
    },

    noop() {},
  },
});
