import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    // day
    curDayDate: new Date(2024, 1, 1, 0, 0, 0).getTime(),
    minDayDate: new Date(2023, 0, 4).getTime(),
    maxDayDate: new Date(2024, 3, 20).getTime(),

    // weekday
    curWeekDayDate: [new Date(2024, 0, 15).getTime(), new Date(2024, 0, 21).getTime()],
    minWeekDayDate: new Date(2024, 0, 4).getTime(),
    maxWeekDayDate: new Date(2024, 1, 20).getTime(),

    // range
    curRangeDayDate: [new Date(2024, 0, 10).getTime(), new Date(2024, 0, 20).getTime()],
    minRangeDayDate: new Date(2024, 0, 4).getTime(),
    maxRangeDayDate: new Date(2024, 1, 20).getTime(),

    // month
    curMonthDate: new Date(2024, 6, 1).getTime(),
    minMonthDate: new Date(2024, 2, 1).getTime(),
    maxMonthDate: new Date(2025, 9, 31).getTime(),

    // year
    curYearDate: new Date(2025, 0, 23).getTime(),
    minYearDate: new Date(2024, 10, 12).getTime(),
    maxYearDate: new Date(2029, 10, 31).getTime(),

    // locale
    confirmText: I18n.t('confirm'),
    confirmDisabledText: I18n.t('confirm'),
    firstDayOfWeek: 0,
    locale: {
      shortWeekDays: [
        I18n.t('week0'),
        I18n.t('week1'),
        I18n.t('week2'),
        I18n.t('week3'),
        I18n.t('week4'),
        I18n.t('week5'),
        I18n.t('week6'),
      ],
      subFormatter: 'YYYY' + I18n.t('year') + 'MM' + I18n.t('month'),
    },
    locale2: {
      subFormatter: 'YYYY' + I18n.t('year'),
      monthsFormatter: [
        I18n.t('cal_Jan'),
        I18n.t('cal_Feb'),
        I18n.t('cal_Mar'),
        I18n.t('cal_Apr'),
        I18n.t('cal_May'),
        I18n.t('cal_Jun'),
        I18n.t('cal_Jul'),
        I18n.t('cal_Aug'),
        I18n.t('cal_Sept'),
        I18n.t('cal_Oct'),
        I18n.t('cal_Nov'),
        I18n.t('cal_Dec'),
      ],
    },
    showDayPicker: false,
    dayClassMap: {
      '2024-01-17': 'calendar-disabled',
    },
    type: 'single',
  },

  methods: {
    setCurDay(event) {
      const date = event.detail;
      this.setData({
        curDayDate: new Date(date).getTime(),
        showDayPicker: false,
      });
    },
    setWeekCurDay(event) {
      const date = event.detail;
      this.setData({
        curWeekDayDate: [date[0].getTime(), date[1].getTime()],
      });
    },
    setRangeCurDay(event) {
      const date = event.detail;
      this.setData({
        curRangeDayDate: [date[0]?.getTime(), date[1]?.getTime()],
      });
    },
    setCurMonth(event) {
      const date = event.detail;
      this.setData({
        curMonthDate: date.getTime(),
      });
    },
    setCurYear(event) {
      const date = event.detail;
      this.setData({
        curYearDate: date.getTime(),
      });
    },
    onShowDayPicker() {
      this.setData({
        showDayPicker: !this.data.showDayPicker,
      });
    },
    selectDate(e) {},
    changeType(e) {
      this.setData({
        type: e?.target?.dataset?.type,
      });
    },
  },
});
