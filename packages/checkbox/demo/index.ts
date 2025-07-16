import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    checkbox1: true,
    checkbox2: true,
    checkbox3: true,
    checkboxLabel: true,
    checkboxSize: true,
    checkboxShape: true,
    list: ['a', 'b', 'c'],
    result: ['a', 'b'],
    result2: [],
    result3: [],
    result4: [],
    activeIcon:
      'https://images.tuyacn.com/content-platform/hestia/1730877912e76cbdb7563.png',
    inactiveIcon: '',
  },

  methods: {
    onChange(event) {
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: event.detail });
    },

    onChange2(event) {
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: !event.detail });
    },

    toggle(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },

    noop() {},
  },
});
