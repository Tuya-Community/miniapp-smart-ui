import CheckmarkIcon from '@tuya-miniapp/icons/dist/svg/Checkmark';
import { useParent } from '../common/relation';
import { SmartComponent } from '../common/component';

function emit(
  target: WechatMiniprogram.Component.TrivialInstance,
  value: boolean | any[]
) {
  target.$emit('input', value);
  target.$emit('change', value);
}

SmartComponent({
  field: true,

  relation: useParent('checkbox-group'),

  classes: ['icon-class', 'label-class'],

  props: {
    value: Boolean,
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
      value: 20,
    },
  },

  data: {
    parentDisabled: false,
    direction: 'vertical',
    icon: CheckmarkIcon,
  },

  methods: {
    emitChange(value: boolean) {
      if (this.parent) {
        this.setParentValue(this.parent, value);
      } else {
        emit(this, value);
      }
    },

    toggle() {
      const { parentDisabled, disabled, value } = this.data;
      if (!disabled && !parentDisabled) {
        this.emitChange(!value);
      }
    },

    onClickLabel() {
      const { labelDisabled, parentDisabled, disabled, value } = this.data;
      if (!disabled && !labelDisabled && !parentDisabled) {
        this.emitChange(!value);
      }
    },

    setParentValue(
      parent: WechatMiniprogram.Component.TrivialInstance,
      value: boolean
    ) {
      const parentValue = parent.data.value.slice();
      const { name } = this.dataset;
      const { max } = parent.data;

      if (value) {
        if (max && parentValue.length >= max) {
          return;
        }

        if (parentValue.indexOf(name) === -1) {
          parentValue.push(name);
          emit(parent, parentValue);
        }
      } else {
        const index = parentValue.indexOf(name);
        if (index !== -1) {
          parentValue.splice(index, 1);
          emit(parent, parentValue);
        }
      }
    },
  },
});
