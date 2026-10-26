// components/month-list.js
import { getMonths } from '../calendar-utils/utils';
import { SmartComponent } from '../common/component';
import tyApi from '../common/ty';

const currentYear = new Date().getFullYear();
const minMonthDate = new Date(currentYear - 10, 1, 1).getTime();
const maxMonthDate = new Date(currentYear + 10, 12, 31).getTime();

SmartComponent({
  /**
   * 组件的属性列表
   */
  props: {
    date: {
      type: null,
    },
    color: {
      type: String,
      value: '#3678e3',
    },
    minDate: {
      type: null,
      value: minMonthDate,
    },
    maxDate: {
      type: null,
      value: maxMonthDate,
    },
    readonly: {
      type: Boolean,
      value: false,
    },
    monthsFormatter: {
      type: null,
      value: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    },
    visibleIndex: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getMonthList(newVal);
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    months: [] as any,
    currentMonth: null as any,
  },

  created() {
    this.getMonthList(0);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMonthList(visibleIndex: number) {
      const { minDate, maxDate, monthsFormatter = [] } = this.data;

      const currentDate = new Date(this.data.date);
      const curDate = new Date(
        currentDate.getFullYear() + visibleIndex,
        currentDate.getMonth(),
        currentDate.getDay()
      );
      const cur = curDate.getFullYear();
      const curMonthDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1);

      const start = new Date(cur, 0, 1, 0, 0, 0).getTime();
      const end = new Date(cur, 11, 31, 23, 59, 59).getTime();

      const minDateTime = new Date(minDate).getTime();
      const maxDateTime = new Date(maxDate).getTime();

      const months = getMonths(start, end);

      const monthlist = months.map(date => {
        const monthVal = new Date(date).getMonth();
        const time = new Date(date).getTime();
        let isDisabled = false;
        if (minDate && maxDate) {
          isDisabled = time < minDateTime || time > maxDateTime;
        }
        return {
          value: date,
          month: monthVal,
          text: monthsFormatter[monthVal] || monthVal + 1,
          type: isDisabled ? 'disabled' : '',
        };
      });

      this.setData({
        months: monthlist,
        currentMonth: curMonthDate.getTime(),
      });
      this.$emit('changemonthtitle', curDate.getTime());
    },
    onClick(event) {
      if (this.data.readonly) return;
      const { index } = event.currentTarget.dataset;
      const item = this.data.months[index];
      if (item.type !== 'disabled') {
        this.$emit('click', item.value);
        this.setData({
          date: item.value,
        });
        tyApi.vibrateShort({ type: 'light' });
      }
    },
  },
});
