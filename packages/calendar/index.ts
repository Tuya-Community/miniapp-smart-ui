import { SmartComponent } from '../common/component';
import {
  ROW_HEIGHT,
  getPrevDay,
  getNextDay,
  getToday,
  compareDay,
  copyDates,
  calcDateNum,
  getMonths,
  getDayByOffset,
  getCurrentIndex,
  getWeekStartAndEnd,
  getInitEdgeDate,
} from '../calendar-utils/utils';
import { Day } from '../calendar-utils/types';
import Toast from '../toast/toast';

const dateEdge = getInitEdgeDate('year');

const getTime = (date: Date | number) => (date instanceof Date ? date.getTime() : date);

SmartComponent({
  props: {
    title: {
      type: String,
      value: 'Select Date',
    },
    color: String,
    show: {
      type: Boolean,
      observer(val) {
        if (val) {
          this.initRect();
          this.scrollIntoView();
        } else {
          this.setData({
            visibleIndex: 0,
          });
        }
      },
    },
    locale: {
      type: Object,
      value: {
        shortWeekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthsFormatter: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sept',
          'Oct',
          'Nov',
          'Dec',
        ],
        yearFormatter: 'YYYY',
        subFormatter: 'YYYY-MM',
        rangeStart: 'Start',
        rangeEnd: 'End',
      },
    },
    confirmText: {
      type: String,
      value: 'Confirm',
    },
    confirmDisabledText: {
      type: String,
      value: 'Confirm',
    },
    rangePrompt: String,
    showRangePrompt: {
      type: Boolean,
      value: true,
    },
    defaultDate: {
      type: null,
      value: getToday().getTime(),
      observer(val) {
        this.setData({ currentDate: val });
        this.scrollIntoView();
      },
    },
    allowSameDay: Boolean,
    type: {
      type: String,
      value: 'single',
      observer: 'reset',
    },
    minDate: {
      type: Number,
      value: dateEdge.min,
    },
    maxDate: {
      type: Number,
      value: dateEdge.max,
    },
    position: {
      type: String,
      value: 'bottom',
    },
    rowHeight: {
      type: null,
      value: ROW_HEIGHT,
    },
    round: {
      type: Boolean,
      value: true,
    },
    poppable: {
      type: Boolean,
      value: false,
    },
    showMark: {
      type: Boolean,
      value: true,
    },
    showTitle: {
      type: Boolean,
      value: true,
    },
    showConfirm: {
      type: Boolean,
      value: false,
    },
    showSubtitle: {
      type: Boolean,
      value: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true,
    },
    maxRange: {
      type: null,
      value: null,
    },
    minRange: {
      type: Number,
      value: 1,
    },
    firstDayOfWeek: {
      type: Number,
      value: 0,
    },
    readonly: Boolean,
    rootPortal: {
      type: Boolean,
      value: false,
    },
    dayClassMap: {
      type: null,
    },
  },

  data: {
    subtitle: '',
    currentDate: null as any,
    originCurrentDateMonthly: null as any,
    scrollIntoView: '',
    visibleIndex: 0,
    months: [] as number[],
    showToast: false,
  },

  watch: {
    minDate() {
      this.initRect();
    },
    maxDate() {
      this.initRect();
    },
  },

  created() {
    this.initData();
  },

  mounted() {
    this.isMounted = true;
    if (this.data.show || !this.data.poppable) {
      this.initRect();
      this.scrollIntoView();
    }
  },

  methods: {
    onPrev() {
      const visibleIndex = this.data.visibleIndex - 1;

      if (this.data.type === 'year') {
        this.setData({
          visibleIndex,
        });
        return;
      }
      if (this.data.type === 'month') {
        this.setData({
          visibleIndex,
        });
        return;
      }

      if (this.data.months[visibleIndex]) {
        this.setData({
          visibleIndex,
        });
      }
    },
    onNext() {
      const visibleIndex = this.data.visibleIndex + 1;

      if (this.data.type === 'year') {
        this.setData({
          visibleIndex,
        });
        return;
      }
      if (this.data.type === 'month') {
        this.setData({
          visibleIndex,
        });
        return;
      }

      if (this.data.months[visibleIndex]) {
        this.setData({
          visibleIndex,
        });
      }
    },
    reset() {
      const currentDate = this.getInitialDate(this.data.defaultDate);
      this.setData({ currentDate, visibleIndex: 0 });
      this.scrollIntoView();
    },

    initData() {
      const currentDate = this.getInitialDate(this.data.defaultDate);

      const months = getMonths(this.data.minDate, this.data.maxDate);
      const visibleIndex = this.data.defaultDate
        ? getCurrentIndex(currentDate, months)
        : months.length - 1;

      const isYear = this.data.type === 'year';
      const isMonth = this.data.type === 'month';

      const data = {
        currentDate,
        // 初始化时记录一份，用于month列表展示头部
        originCurrentDateMonthly: currentDate,
        months,
        visibleIndex: visibleIndex,
      };

      if (isYear || isMonth) {
        // @ts-ignore
        delete data.visibleIndex;
      }

      this.setData(data);
    },

    initRect() {
      if (!this.isMounted) return;
      this.initData();
    },

    limitDateRange(date: number, minDate: number | null = null, maxDate: number | null = null) {
      const { min, max } = getInitEdgeDate(this.data.type);

      minDate = minDate || (this.data.minDate as number) || min;
      maxDate = maxDate || (this.data.maxDate as number) || max;
      if (compareDay(date, minDate) === -1) {
        return minDate;
      }
      if (compareDay(date, maxDate) === 1) {
        return maxDate;
      }
      return date;
    },

    getInitialDate(defaultDate: number | number[] | null = null) {
      const { type, minDate, maxDate, allowSameDay } = this.data;

      if (!defaultDate) return [];

      const now = getToday().getTime();

      if (type === 'range' || type === 'week') {
        if (!Array.isArray(defaultDate)) {
          defaultDate = [];
        }

        const [startDay, endDay] = defaultDate || [];

        const startDate = getTime(startDay || now);
        const start = this.limitDateRange(
          startDate,
          minDate,
          allowSameDay ? startDate : getPrevDay(new Date(maxDate)).getTime()
        );

        const date = getTime(endDay || now);
        const end = this.limitDateRange(
          date,
          allowSameDay ? date : getNextDay(new Date(minDate)).getTime()
        );

        return [start, end];
      }

      if (type === 'multiple') {
        if (Array.isArray(defaultDate)) {
          return defaultDate.map(date => this.limitDateRange(date));
        }

        return [this.limitDateRange(now)];
      }

      if (!defaultDate || Array.isArray(defaultDate)) {
        defaultDate = now;
      }
      return this.limitDateRange(defaultDate);
    },

    scrollIntoView() {
      // if (!this.isMounted) return;
    },

    onOpen() {
      this.$emit('open');
    },

    onOpened() {
      this.$emit('opened');
    },

    onClose() {
      this.$emit('close');
    },

    onClosed() {
      this.$emit('closed');
    },

    onClickDay(event) {
      if (this.data.readonly) {
        return;
      }

      let { date } = event.detail;
      const { type, currentDate, allowSameDay } = this.data;

      if (type === 'week') {
        const { weekStart, weekEnd } = getWeekStartAndEnd(date);
        this.select(
          [
            Math.max(getTime(weekStart), getTime(this.data.minDate)),
            Math.min(getTime(weekEnd), getTime(this.data.maxDate)),
          ],
          true
        );
      } else if (type === 'range') {
        // @ts-ignore
        const [startDay, endDay] = currentDate;

        if (startDay && !endDay) {
          const compareToStart = compareDay(date, startDay);

          if (compareToStart === 1) {
            const { days } = this.selectComponent('.month').data;
            days.some((day: Day, index) => {
              const isDisabled =
                day.type === 'disabled' &&
                getTime(startDay) < getTime(day.date) &&
                getTime(day.date) < getTime(date);
              if (isDisabled) {
                ({ date } = days[index - 1]);
              }
              return isDisabled;
            });
            this.select([startDay, date], true);
          } else if (compareToStart === -1) {
            this.select([date, null]);
          } else if (allowSameDay) {
            this.select([date, date], true);
          }
        } else {
          this.select([date, null]);
        }
      } else if (type === 'multiple') {
        let selectedIndex: number;

        // @ts-ignore
        const selected = currentDate.some((dateItem: number, index: number) => {
          const equal = compareDay(dateItem, date) === 0;
          if (equal) {
            selectedIndex = index;
          }
          return equal;
        });

        if (selected) {
          // @ts-ignore
          const cancelDate = currentDate.splice(selectedIndex, 1);
          this.setData({ currentDate });
          this.unselect(cancelDate);
        } else {
          // @ts-ignore
          this.select([...currentDate, date]);
        }
      } else {
        this.select(date, true);
      }
    },

    onClickDate(event) {
      if (this.data.readonly) {
        return;
      }
      const date = event.detail;
      this.select(date, true);
      this.setData({
        visibleIndex: 0,
      });
    },

    onChangeMonthTitleDate(event) {
      if (this.data.originCurrentDateMonthly !== event.detail) {
        this.setData({
          originCurrentDateMonthly: event.detail,
        });
      }
    },

    unselect(dateArray) {
      const date = dateArray[0];
      if (date) {
        this.$emit('unselect', copyDates(date));
      }
    },

    select(date, complete?: boolean) {
      if (complete && this.data.type === 'range') {
        const valid = this.checkRange(date);

        if (!valid) {
          // auto selected to max range if type is range
          if (this.data.type === 'range' && this.data.maxRange) {
            this.emit([date[0], getDayByOffset(date[0], this.data.maxRange - 1)]);
          } else {
            this.emit(date);
          }
          return;
        }
      }

      this.emit(date);

      if (complete && !this.data.showConfirm) {
        this.onConfirm();
      }
    },

    emit(date) {
      this.setData({
        currentDate: Array.isArray(date) ? date.map(getTime) : getTime(date),
      });
      this.$emit('select', copyDates(date));
    },

    checkRange(date) {
      const { maxRange, showRangePrompt } = this.data;

      if (maxRange && calcDateNum(date) > maxRange) {
        if (showRangePrompt) {
          this.setData({
            showToast: true,
          });
          setTimeout(() => {
            this.setData({
              showToast: false,
            });
          }, 2000);
        }
        this.$emit('over-range');

        return false;
      }

      return true;
    },

    onConfirm() {
      if (this.data.type === 'range' && !this.checkRange(this.data.currentDate)) {
        return;
      }
      wx.nextTick(() => {
        // @ts-ignore
        this.$emit('confirm', copyDates(this.data.currentDate));
      });
    },

    onClickSubtitle(event: WechatMiniprogram.TouchEvent) {
      this.$emit('click-subtitle', event);
    },
  },
});
