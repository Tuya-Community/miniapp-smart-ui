import { Check } from '@tuya-miniapp/icons';
import { canIUseModel } from '../common/version';
import { SmartComponent } from '../common/component';
import { useParent } from '../common/relation';

SmartComponent({
  field: true,

  relation: useParent('radio-group', function () {
    this.updateFromParent();
  }),

  classes: ['icon-class', 'label-class'],

  props: {
    name: null,
    value: null,
    disabled: Boolean,
    useIconSlot: Boolean,
    checkedColor: String,
    labelPosition: {
      type: String,
      value: 'right',
    },
    labelDisabled: Boolean,
    shape: {
      type: String,
      value: 'round',
    },
    iconSize: {
      type: null,
      value: 24,
    },
  },

  data: {
    direction: '',
    parentDisabled: false,
    icon: Check,
    preventDefault: false,
  },

  methods: {
    updateFromParent() {
      if (!this.parent) {
        return;
      }

      const { value, disabled: parentDisabled, direction, preventDefault } = this.parent.data;

      this.setData({
        value,
        direction,
        parentDisabled,
        preventDefault,
      });
    },

    emitChange(value: boolean) {
      const instance = this.parent || this;
      instance.$emit('input', value);
      instance.$emit('change', value);

      if (canIUseModel() && !this.properties.preventDefault) {
        instance.setData({ value });
      }
    },

    onChange() {
      if (!this.data.disabled && !this.data.parentDisabled) {
        this.emitChange(this.data.name);
      }
    },

    onClickLabel() {
      const { disabled, parentDisabled, labelDisabled, name } = this.data;
      if (!(disabled || parentDisabled) && !labelDisabled) {
        this.emitChange(name);
      }
    },
  },
});
