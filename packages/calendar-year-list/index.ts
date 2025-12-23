// components/month-list.js
import { getYears } from '../calendar-utils/utils';
import { SmartComponent } from '../common/component';
import tyApi from '../common/ty';

SmartComponent({
  /**
   * 组件的属性列表
   */
  props: {
    date: {
      type: null,
      observer(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.calcYear();
        }
      },
    },
    readonly: {
      type: Boolean,
      value: false,
    },
    minDate: {
      type: null,
      value: new Date(new Date().getFullYear() - 30, 0, 1).getTime(),
    },
    maxDate: {
      type: null,
      value: new Date(new Date().getFullYear() + 30, 11, 31).getTime(),
    },
    color: {
      type: String,
      value: '#3678e3',
    },
    currentYear: {
      type: null,
      value: new Date().getFullYear(),
    },
    yearFormatter: {
      type: null,
      value: 'YYYY',
    },
    visibleIndex: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getYearList();
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    years: [] as any,
    currentYear: null as any,
  },

  created() {
    this.getYearList();
    this.calcYear();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    calcYear() {
      const date = new Date(this.data.date);
      const cur = date.getFullYear();
      this.setData({
        currentYear: cur,
      });
    },
    getYearList() {
      const { minDate, maxDate, yearFormatter = 'YYYY', visibleIndex, date } = this.data;

      const cur = new Date(date).getFullYear();

      const offset = visibleIndex * 12;

      const start = new Date(cur + offset - 5, 0, 1).getTime();
      const end = new Date(cur + offset + 6, 11, 31).getTime();

      const minStart = new Date(minDate).getFullYear();
      const maxStart = new Date(maxDate).getFullYear();

      const years = getYears(start, end);

      const yearlist = years.map(date => {
        const yearVal = new Date(date).getFullYear();
        const curTime = new Date(date).getFullYear();
        let isDisabled = false;
        if (minDate && maxDate) {
          isDisabled = curTime < minStart || curTime > maxStart;
        }
        return {
          value: date,
          year: yearVal,
          text: yearFormatter.replace('YYYY', yearVal),
          type: isDisabled ? 'disabled' : '',
        };
      });

      this.setData({
        years: yearlist,
      });
    },
    onClick(event) {
      if (this.data.readonly) return;
      const { index } = event.currentTarget.dataset;
      const item = this.data.years[index];
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
