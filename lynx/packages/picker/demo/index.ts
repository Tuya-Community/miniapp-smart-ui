import tyApi from '../../common/ty';
import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

// 跨数据源复用同一滚轮的两套数据源：列的量程与步长都不同，切换后档位完全由各列 activeIndex 决定。
// 这是业务侧「开始时间 ↔ 补光时长」复用同一弹窗的最小复现。
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const range = (len: number, step = 1) => new Array(len).fill(0).map((x, i) => pad(i * step));

const startTimeColumns = () => [
  { values: range(24), unit: I18n.t('hour'), activeIndex: 3 },
  { values: range(60), unit: I18n.t('minute'), activeIndex: 30 },
];
const durationColumns = () => [
  { values: range(12), unit: I18n.t('hour'), activeIndex: 2 },
  { values: range(12, 5), unit: I18n.t('minute'), activeIndex: 4 },
];

SmartComponent({
  data: {
    isA11y: false,
    activeIndex: 3,
    column1: [
      I18n.t('hangzhou'),
      I18n.t('ningbo'),
      I18n.t('wenzhou'),
      I18n.t('jiaxing'),
      I18n.t('huzhou'),
    ],
    column2: [
      { text: I18n.t('hangzhou'), disabled: true },
      { text: I18n.t('ningbo') },
      { text: I18n.t('wenzhou') },
    ],
    column3: {
      [I18n.t('zhejiang')]: [
        I18n.t('hangzhou'),
        I18n.t('ningbo'),
        I18n.t('wenzhou'),
        I18n.t('jiaxing'),
        I18n.t('huzhou'),
      ],
      [I18n.t('fujian')]: [
        I18n.t('fuzhou'),
        I18n.t('xiamen'),
        I18n.t('putian'),
        I18n.t('sanming'),
        I18n.t('quanzhou'),
      ],
    },
    column4: [
      {
        values: [I18n.t('zhejiang'), I18n.t('fujian')],
        className: 'column1',
        unit: I18n.t('province'),
      },
      {
        values: [
          I18n.t('hangzhou'),
          I18n.t('ningbo'),
          I18n.t('wenzhou'),
          I18n.t('jiaxing'),
          I18n.t('huzhou'),
        ],
        className: 'column2',
        defaultIndex: 2,
        unit: I18n.t('city'),
      },
    ],
    column5: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
        style: 'flex: none;width: auto;min-width: 61px;',
        fontStyle: 'color: rgb(135, 180, 244);',
      },
      {
        values: ['.'],
        disabled: true,
        style: 'flex: none;width: 8px;display:flex;justify-content: center;',
      },
      {
        values: new Array(20).fill(1).map((x, i) => i),
        style: 'flex: none;width: auto;min-width: 61px;',
        unit: 'Kg',
        unitGap: '10rpx',
      },
    ],
    column6: [
      {
        values: [I18n.t('zhejiang'), I18n.t('fujian')],
        order: 2,
      },
      {
        values: [
          I18n.t('hangzhou'),
          I18n.t('ningbo'),
          I18n.t('wenzhou'),
          I18n.t('jiaxing'),
          I18n.t('huzhou'),
        ],
        order: 1,
      },
    ],
    column7: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
      },
    ],
    // 跨数据源复用同一滚轮：切换数据源后各列应停在新 columns 指定的 activeIndex 上
    reuseIsStartTime: true,
    reuseColumns: startTimeColumns(),
    reuseTip: `${I18n.t('reuseStartTime')} · 03:30`,
    // 10w 大数据量：验证超长列表的初始化与滚动性能（点击按钮按需加载，避免每次进页面都灌 10w）
    bigColumn: [] as number[],
    bigDataCost: 0,
  },

  mounted() {
    tyApi.getAccessibilityMode({
      success: res => {
        this.setData({
          isA11y: !!res.isAccessibilityMode,
        });
      },
    });
  },

  methods: {
    onChange1(event) {
      const { value, index } = event.detail;
      console.log(`Value: ${value}, Index：${index}`);
      Toast({
        context: this,
        selector: '#smart-toast-picker',
        message: `Value: ${value}, Index：${index}`,
      });
    },

    onConfirm(event) {
      const { value, index } = event.detail;
      Toast({
        context: this,
        selector: '#smart-toast-picker',
        message: `Value: ${value}, Index：${index}`,
      });
    },

    onCancel() {
      Toast({
        context: this,
        selector: '#smart-toast-picker',
        message: I18n.t('cancel'),
      });
    },

    onChange2(event) {
      const { picker, value } = event.detail;
      picker.setColumnValues(1, this.data.column3[value[0]]);
      getApp().picker = picker;
    },
    switchReuseSource() {
      const toStartTime = !this.data.reuseIsStartTime;
      this.setData({
        reuseIsStartTime: toStartTime,
        reuseColumns: toStartTime ? startTimeColumns() : durationColumns(),
        reuseTip: toStartTime
          ? `${I18n.t('reuseStartTime')} · 03:30`
          : `${I18n.t('reuseDuration')} · 02:20`,
      });
    },

    // 按需生成 10w 选项并注入，记录 setData 往返耗时
    loadBigData() {
      const bigColumn = new Array(100000).fill(0).map((x, i) => i);
      const start = Date.now();
      this.setData({ bigColumn }, () => {
        this.setData({ bigDataCost: Date.now() - start });
      });
    },
    animationStart() {
      console.log('animationStart');
    },
    animationEnd() {
      console.log('animationEnd');
    },
  },
});
