import { SmartComponent } from '../common/component';
import ty from '../common/ty';

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
    name: String,
    ariaLabel: {
      type: String,
      value: '',
    },
    ariaRole: {
      type: String,
      value: '',
    },
  },

  data: { themeColors: {} },
  created() {
    this.setData({ themeColors: ty.getThemeInfo() || {} });
  },
  methods: {
    onClick(event) {
      this.$emit('click', event);
    },
  },
});
