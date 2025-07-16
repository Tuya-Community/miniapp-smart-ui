import { SmartComponent } from '../../common/component';

const zhCNOptions = [
  {
    text: I18n.t('zhejiangProvince'),
    value: '330000',
    options: [
      {
        text: I18n.t('hangzhou'),
        value: '330100',
        options: [
          {
            text: I18n.t('upperCityDistrict'),
            value: '330102',
          },
          {
            text: I18n.t('downtownDistrict'),
            value: '330103',
          },
          {
            text: I18n.t('jiangganDistrict'),
            value: '330104',
          },
        ],
      },
      {
        text: I18n.t('ningboCity'),
        value: '330200',
        options: [
          {
            text: I18n.t('haishuDistrict'),
            value: '330203',
          },
          {
            text: I18n.t('jiangbeiDistrict'),
            value: '330205',
          },
          {
            text: I18n.t('beilunDistrict'),
            value: '330206',
          },
        ],
      },
      {
        text: I18n.t('wenzhou'),
        value: '330300',
        options: [
          {
            text: I18n.t('luchengDistrict'),
            value: '330302',
          },
          {
            text: I18n.t('longwanDistrict'),
            value: '330303',
          },
          {
            text: I18n.t('ouhaiDistrict'),
            value: '330304',
          },
        ],
      },
    ],
  },
  {
    text: I18n.t('jiangsuProvince'),
    value: '320000',
    options: [
      {
        text: I18n.t('nanjing'),
        value: '320100',
        options: [
          {
            text: I18n.t('xuanwuDistrict'),
            value: '320102',
          },
          {
            text: I18n.t('qinhuaiDistrict'),
            value: '320104',
          },
          {
            text: I18n.t('jianyeDistrict'),
            value: '320105',
          },
        ],
      },
      {
        text: I18n.t('wuxi'),
        value: '320200',
        options: [
          {
            text: I18n.t('xishanDistrict'),
            value: '320205',
          },
          {
            text: I18n.t('huishanDistrict'),
            value: '320206',
          },
          {
            text: I18n.t('binhuDistrict'),
            value: '320211',
          },
        ],
      },
      {
        text: I18n.t('xuzhou'),
        value: '320300',
        options: [
          {
            text: I18n.t('gulouDistrict'),
            value: '320302',
          },
          {
            text: I18n.t('yunlongDistrict'),
            value: '320303',
          },
          {
            text: I18n.t('jiawangDistrict'),
            value: '320305',
          },
        ],
      },
    ],
  },
];

const asyncOptions1 = [
  {
    text: I18n.t('zhejiangProvince'),
    value: '330000',
    options: [],
  },
];
const asyncOptions2 = [
  { text: I18n.t('hangzhou'), value: '330100' },
  { text: I18n.t('ningboCity'), value: '330200' },
];

SmartComponent({
  data: {
    area: I18n.t('region'),
    options: zhCNOptions,
    selectArea: I18n.t('pleaseSelectARegion'),
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
