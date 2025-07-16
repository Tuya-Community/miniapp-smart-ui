import { SmartComponent } from '../../common/component';

const zhCNOptions = [
  {
    text: '浙江省',
    value: '330000',
    options: [
      {
        text: '杭州市',
        value: '330100',
        options: [
          {
            text: '上城区',
            value: '330102',
          },
          {
            text: '下城区',
            value: '330103',
          },
          {
            text: '江干区',
            value: '330104',
          },
        ],
      },
      {
        text: '宁波市',
        value: '330200',
        options: [
          {
            text: '海曙区',
            value: '330203',
          },
          {
            text: '江北区',
            value: '330205',
          },
          {
            text: '北仑区',
            value: '330206',
          },
        ],
      },
      {
        text: '温州市',
        value: '330300',
        options: [
          {
            text: '鹿城区',
            value: '330302',
          },
          {
            text: '龙湾区',
            value: '330303',
          },
          {
            text: '瓯海区',
            value: '330304',
          },
        ],
      },
    ],
  },
  {
    text: '江苏省',
    value: '320000',
    options: [
      {
        text: '南京市',
        value: '320100',
        options: [
          {
            text: '玄武区',
            value: '320102',
          },
          {
            text: '秦淮区',
            value: '320104',
          },
          {
            text: '建邺区',
            value: '320105',
          },
        ],
      },
      {
        text: '无锡市',
        value: '320200',
        options: [
          {
            text: '锡山区',
            value: '320205',
          },
          {
            text: '惠山区',
            value: '320206',
          },
          {
            text: '滨湖区',
            value: '320211',
          },
        ],
      },
      {
        text: '徐州市',
        value: '320300',
        options: [
          {
            text: '鼓楼区',
            value: '320302',
          },
          {
            text: '云龙区',
            value: '320303',
          },
          {
            text: '贾汪区',
            value: '320305',
          },
        ],
      },
    ],
  },
];

const asyncOptions1 = [
  {
    text: '浙江省',
    value: '330000',
    options: [],
  },
];
const asyncOptions2 = [
  { text: '杭州市', value: '330100' },
  { text: '宁波市', value: '330200' },
];

SmartComponent({
  data: {
    area: '地区',
    options: zhCNOptions,
    selectArea: '请选择地区',
    baseState: {
      show: false,
      value: '',
      result: '',
    },
    asyncState: {
      show: false,
      value: undefined,
      result: '',
      options: asyncOptions1,
    },
    customFieldState: {
      show: false,
      value: '',
      result: '',
    },
  },

  methods: {
    onClick(e) {
      const { stateKey } = e.currentTarget.dataset;
      this.setData({
        [`${stateKey}.show`]: true,
      });
    },
    onClose(e) {
      const { stateKey } = e.currentTarget.dataset;
      this.setData({
        [`${stateKey}.show`]: false,
      });
    },
    onFinish(e) {
      const { stateKey } = e.currentTarget.dataset;
      const { selectedOptions, value } = e.detail;
      const result = selectedOptions.map((option) => option.text).join('/');

      this.setData({
        [`${stateKey}.value`]: value,
        [`${stateKey}.result`]: result,
      });
      this.onClose(e);
    },
    loadDynamicOptions(e) {
      const { value } = e.detail;
      if (value === '330000') {
        setTimeout(() => {
          this.setData({
            'asyncState.options[0].options': asyncOptions2,
          });
        }, 500);
      }
    },
  },
});
