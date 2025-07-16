import { CheckmarkCircle, Right } from '@tuya-miniapp/icons';
import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

const steps = [
  {
    text: '步骤一',
    desc: '描述信息',
  },
  {
    text: '步骤二',
    desc: '描述信息',
  },
  {
    text: '步骤三',
    desc: '描述信息',
  },
  {
    text: '步骤四',
    desc: '描述信息',
  },
];

SmartComponent({
  data: {
    active: 1,
    steps,
    customIcon: CheckmarkCircle,
    inActiveIcon: Right,
  },

  methods: {
    nextStep() {
      this.setData({
        active: ++this.data.active % 4,
      });
    },

    onClick(event) {
      Toast({
        context: this,
        message: `Index: ${event.detail}`,
      });
    },
  },
});
