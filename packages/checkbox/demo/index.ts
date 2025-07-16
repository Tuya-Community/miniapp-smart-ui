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
      'https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png',
    inactiveIcon: '',
  },

  methods: {
    onChange(event) {
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: event.detail });
    },

    toggle(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },

    noop() {},
  },
});
