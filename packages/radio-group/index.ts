import { SmartComponent } from '../common/component';
import { useChildren } from '../common/relation';

SmartComponent({
  field: true,

  relation: useChildren('radio'),

  props: {
    value: {
      type: null,
      observer: 'updateChildren',
    },
    preventDefault: {
      type: Boolean,
      value: false,
      observer: 'updateChildren',
    },
    direction: String,
    disabled: {
      type: Boolean,
      observer: 'updateChildren',
    },
  },

  methods: {
    updateChildren() {
      this.children.forEach(child => child.updateFromParent());
    },
  },
});
