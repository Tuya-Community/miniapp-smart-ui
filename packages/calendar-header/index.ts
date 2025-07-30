import { SmartComponent } from '../common/component';
import { Left as LeftIcon } from '@tuya-miniapp/icons';
import { Right as RightIcon } from '@tuya-miniapp/icons';

SmartComponent({
  props: {
    title: {
      type: String,
      value: 'Select Date',
    },
    rightText: {
      type: String,
      value: 'Save',
    },
    subtitle: String,
    showTitle: Boolean,
    showSubtitle: Boolean,
    defaultWeeks: Array,
    hideWeek: Boolean,
    iconColor: {
      type: String,
      value: 'rgba(0, 0, 0, 0.7)',
    },
    showConfirm: {
      type: Boolean,
      value: true,
    },
    firstDayOfWeek: {
      type: Number,
      observer: 'initWeekDay',
    },
  },

  data: {
    weekdays: [] as Array<string>,
    LeftIcon,
    RightIcon,
  },

  created() {
    this.initWeekDay();
  },

  methods: {
    initWeekDay() {
      const { defaultWeeks } = this.properties;
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
    onPrev() {
      this.$emit('click-prev');
    },
    onNext() {
      this.$emit('click-next');
    },
    onSave() {
      this.$emit('click-save');
    },
  },
});
