import { SmartComponent } from '../common/component';
import { canIUseModel } from '../common/version';
import SearchIcon from '@tuya-miniapp/icons/dist/svg/Search';
import CloseIcon from '@tuya-miniapp/icons/dist/svg/Close';
import tyApi from '../common/ty';

SmartComponent({
  field: true,

  classes: ['field-class', 'input-class', 'cancel-class'],

  props: {
    value: {
      type: String,
      value: '',
    },
    label: String,
    focus: Boolean,
    error: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    inputAlign: {
      type: String,
      value: 'left',
    },
    showAction: Boolean,
    useActionSlot: Boolean,
    useLeftIconSlot: Boolean,
    useRightIconSlot: Boolean,
    leftIcon: {
      type: String,
      value: SearchIcon,
    },
    rightIcon: String,
    placeholder: String,
    placeholderStyle: String,
    searchText: String,
    background: String,
    actionText: {
      type: String,
      value: 'Cancel',
    },
    maxlength: {
      type: Number,
      value: -1,
    },
    shape: {
      type: String,
      value: 'square',
    },
    clearable: {
      type: Boolean,
      value: true,
    },
    clearTrigger: {
      type: String,
      value: 'focus',
    },
    clearIcon: {
      type: String,
      value: CloseIcon,
    },
    cursorSpacing: {
      type: Number,
      value: 0,
    },
  },
  methods: {
    onChange(event: WechatMiniprogram.CustomEvent) {
      this.setData({ value: event.detail });
      this.$emit('change', event.detail);
    },

    onCancel() {
      /**
       * 修复修改输入框值时，输入框失焦和赋值同时触发，赋值失效
       */
      setTimeout(() => {
        if (canIUseModel()) {
          this.setData({ value: '' });
        }
        this.$emit('cancel');
        this.$emit('change', '');
      }, 200);
    },

    onSearch(event: WechatMiniprogram.CustomEvent) {
      this.$emit('search', event.detail);
    },

    goSearch() {
      this.$emit('search', this.data.value);
    },
    onFocus(event: WechatMiniprogram.CustomEvent) {
      this.$emit('focus', event.detail);
    },

    onBlur(event: WechatMiniprogram.CustomEvent) {
      this.$emit('blur', event.detail);
    },

    onClear(event: WechatMiniprogram.CustomEvent) {
      this.$emit('clear', event.detail);
    },

    onClickInput(event) {
      this.$emit('click-input', event.detail);
    },
  },
});
