import { SmartComponent } from '../common/component';
import LeftIcon from '@tuya-miniapp/icons/dist/svg/Left';
import RightIcon from '@tuya-miniapp/icons/dist/svg/Right';

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
      value: 'var(--calendar-header-icon_color)',
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
