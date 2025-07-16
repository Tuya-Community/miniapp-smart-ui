import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    show1: false,
    show2: false,
    show3: false,
    show4: false,
  },

  methods: {
    toggle(type) {
      this.setData({
        [type]: !this.data[type],
      });
    },

    toggleActionSheet1() {
      this.toggle('show1');
    },

    toggleActionSheet2() {
      this.toggle('show2');
    },

    toggleActionSheet3() {
      this.toggle('show3');
    },
    toggleActionSheet4() {
      this.toggle('show4');
    },
  },
});
