import { SmartComponent } from '../../common/component';
import Toast from '../../toast/toast';

SmartComponent({
  data: {
    minHour: 10,
    maxHour: 20,
    columnsOrder: [3, 2, 1],
    minDate: new Date(2018, 0, 1).getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate1: new Date(2018, 2, 31).getTime(),
    currentDate2: null,
    currentDate3: new Date(2018, 0, 1),
    currentDate4: '12:00',
    currentDate5: '11:00',
    loading: false,
    formatterMap: {
      year: '{{year}}年',
      month: {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
      },
      day: '{{day}}日'
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}${I18n.t('year')}`;
      }
      if (type === 'month') {
        return `${value}${I18n.t('month')}`;
      }
      return value;
    },
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 5 === 0);
      }

      return options;
    },
    locale: {
      year: I18n.t('year'),
      month: I18n.t('month'),
      day: I18n.t('sun'),
      hour: I18n.t('time'),
      minute: I18n.t('minute'),
      second: I18n.t('second'),
    },
    columnStyles: {
      year: "background: rgba(0, 0, 0, 0.1)",
    },
    fontStyles: {
      month: "color: rgb(23, 138, 237);",
      '12HourClock': 'font-size: 14px;'
    },
    activeStyle: "color: rgb(235, 87, 41);"
  },

  methods: {
    onInput(event) {
      const { detail, currentTarget } = event;
      const result = this.getResult(detail, currentTarget.dataset.type);

      Toast({
        context: this,
        selector: '#smart-toast-datetime-picker',
        message: result,
      });
    },
    onInputChange(event) {
      const { detail, currentTarget } = event;
      this.setData({
        currentDate5: detail
      })
      const result = this.getResult(detail, currentTarget.dataset.type);

      Toast({
        context: this,
        selector: '#smart-toast-datetime-picker',
        message: result,
      });
    },

    getResult(time, type) {
      const date = new Date(time);
      switch (type) {
        case 'datetime':
          return date.toLocaleString();
        case 'date':
          return date.toLocaleDateString();
        case 'year-month':
          return `${date.getFullYear()}/${date.getMonth() + 1}`;
        case 'time':
          return time;
        default:
          return '';
      }
    },
    animationStart() {
      console.log('animationStart');
    },
    animationEnd() {
      console.log('animationEnd');
    }
  },
});
