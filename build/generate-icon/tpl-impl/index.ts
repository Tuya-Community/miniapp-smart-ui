import { SmartComponent } from '../../common/component';

SmartComponent({
  classes: ['info-class'],
  props: {
    dot: Boolean,
    info: null,
    size: null,
    color: String,
    customStyle: String,
    classPrefix: {
      type: String,
      value: 'smart-icon',
    },
  },

  methods: {
    onClick() {
      this.$emit('click');
    },
  },
});
