import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  data: {
    activeIndex: 3,
    column1: [I18n.t('hangzhou'), I18n.t('ningbo'), I18n.t('wenzhou'), I18n.t('jiaxing'), I18n.t('huzhou')],
    column2: [
      { text: I18n.t('hangzhou'), disabled: true },
      { text: I18n.t('ningbo') },
      { text: I18n.t('wenzhou') },
    ],
    column3: {
      [I18n.t('zhejiang')]: [I18n.t('hangzhou'), I18n.t('ningbo'), I18n.t('wenzhou'), I18n.t('jiaxing'), I18n.t('huzhou')],
      [I18n.t('fujian')]: [I18n.t('fuzhou'), I18n.t('xiamen'), I18n.t('putian'), I18n.t('sanming'), I18n.t('quanzhou')],
    },
    column4: [
      {
        values: [I18n.t('zhejiang'), I18n.t('fujian')],
        className: 'column1',
        unit: I18n.t('province'),
      },
      {
        values: [I18n.t('hangzhou'), I18n.t('ningbo'), I18n.t('wenzhou'), I18n.t('jiaxing'), I18n.t('huzhou')],
        className: 'column2',
        defaultIndex: 2,
        unit: I18n.t('city'),
      },
    ],
    column5: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
        style: 'flex: none;width: auto;min-width: 61px;',
        fontStyle: 'font-size: 16px;'
      },
      {
        values: ['.'],
        disabled: true,
        style: 'flex: none;width: 8px;display:flex;justify-content: center;'
      },
      {
        values: new Array(20).fill(1).map((x, i) => i),
        style: 'flex: none;width: auto;min-width: 61px;',
        unit: 'Kg',
        unitGap: '10rpx'
      },
    ],
    column6: [
      {
        values: [I18n.t('zhejiang'), I18n.t('fujian')],
        order: 2
      },
      {
        values: [I18n.t('hangzhou'), I18n.t('ningbo'), I18n.t('wenzhou'), I18n.t('jiaxing'), I18n.t('huzhou')],
        order: 1
      },
    ],
    column7: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
      },
    ]
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
    animationStart() {
      console.log('animationStart');
    },
    animationEnd() {
      console.log('animationEnd');
    }
  },
});
