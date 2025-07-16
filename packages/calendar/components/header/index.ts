import { SmartComponent } from '../../../common/component';

SmartComponent({
  props: {
    title: {
      type: String,
      value: '日期选择',
    },
    subtitle: String,
    showTitle: Boolean,
    showSubtitle: Boolean,
    defaultWeeks: Array,
    firstDayOfWeek: {
      type: Number,
      observer: 'initWeekDay',
    },
  },

  data: {
    weekdays: [] as Array<string>,
  },

  created() {
    this.initWeekDay();
  },

  methods: {
    initWeekDay() {
      const defaultWeeks = this.properties.defaultWeeks;
      const firstDayOfWeek = this.data.firstDayOfWeek || 0;

      this.setData({
        weekdays: [
          ...defaultWeeks.slice(firstDayOfWeek, 7),
          ...defaultWeeks.slice(0, firstDayOfWeek),
        ],
      });
    },

    onClickSubtitle(event: WechatMiniprogram.TouchEvent) {
      this.$emit('click-subtitle', event);
    },
  },
});
