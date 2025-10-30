import { getSystemInfoSync } from '../../common/version';
import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    closeDragHeight: 0,
  },
  created() {
    const { windowHeight } = getSystemInfoSync();
    this.setData({ closeDragHeight: windowHeight * 0.4 });
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
    toggleActionSheet5() {
      this.toggle('show5');
    },

    toggleActionSheet6() {
      this.toggle('show6');
    },
  },
});
