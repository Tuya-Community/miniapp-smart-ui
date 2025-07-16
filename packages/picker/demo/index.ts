import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  data: {
    activeIndex: 3,
    column1: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    column2: [
      { text: '杭州', disabled: true },
      { text: '宁波' },
      { text: '温州' },
    ],
    column3: {
      浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
      福建: ['福州', '厦门', '莆田', '三明', '泉州'],
    },
    column4: [
      {
        values: ['浙江', '福建'],
        className: 'column1',
        unit: '省',
      },
      {
        values: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        className: 'column2',
        defaultIndex: 2,
        unit: '市',
      },
    ],
    column5: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
      },
      {
        values: ['.'],
      },
      {
        values: new Array(10).fill(1).map((x, i) => i),
        unit: 'Kg',
      },
    ],
  },

  methods: {
    onChange1(event) {
      const { value, index } = event.detail;
      Toast({
        context: this,
        message: `Value: ${value}, Index：${index}`,
      });

      // this.setData({
      //   column1: new Array(200).fill(1).map((v, i) => `杭州${i}`),
      //   activeIndex: 50,
      // });
    },

    onConfirm(event) {
      const { value, index } = event.detail;
      Toast({
        context: this,
        message: `Value: ${value}, Index：${index}`,
      });
    },

    onCancel() {
      Toast({
        context: this,
        message: '取消',
      });
    },

    onChange2(event) {
      const { picker, value } = event.detail;
      picker.setColumnValues(1, this.data.column3[value[0]]);
      getApp().picker = picker;
    },
  },
});
