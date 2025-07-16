import { SmartComponent } from '../../common/component';
import Dialog from '../../dialog/dialog';

SmartComponent({
  data: {
    checked: true,
    checked2: true,
  },

  methods: {
    onChange({ detail }) {
      this.setData({ checked: detail });
    },

    onChange2({ detail }) {
      Dialog.confirm({
        context: this,
        title: '提示',
        message: '是否切换开关？',
      }).then(() => {
        this.setData({ checked2: detail });
      });
    },

    onClick() {
      Dialog.confirm({
        context: this,
        title: '提示',
        message: '冒泡事件',
      });
    },
  },
});
