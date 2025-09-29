import { SmartComponent } from '../common/component';
import { isDef } from '../common/validator';
import { pickerProps } from '../picker/shared';
import { range, replacePlaceholders } from '../common/utils';

const currentYear = new Date().getFullYear();

function isValidDate(date: number) {
  return isDef(date) && !isNaN(new Date(date).getTime());
}

function padZero(val: string | number) {
  return `00${val}`.slice(-2);
}

function times(n: number, iteratee: (index: number) => string): string[] {
  let index = -1;
  const result = Array(n < 0 ? 0 : n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

function getTrueValue(formattedValue: string) {
  if (formattedValue === undefined) {
    formattedValue = '1';
  }
  while (isNaN(parseInt(formattedValue, 10))) {
    formattedValue = formattedValue.slice(1);
  }
  return parseInt(formattedValue, 10);
}

function getMonthEndDay(year: number, month: number): number {
  return 32 - new Date(year, month - 1, 32).getDate();
}

function findIntersection(range1, range2) {
  const [start1, end1] = range1;
  const [start2, end2] = range2;

  // 确定交集的开始和结束
  const intersectionStart = Math.max(start1, start2);
  const intersectionEnd = Math.min(end1, end2);

  // 检查是否有交集
  if (intersectionStart <= intersectionEnd) {
    return [intersectionStart, intersectionEnd];
  }
  return []; // 没有交集
}

const defaultFormatter = (type: 'year' | 'month' | 'day' | 'hour' | 'minute', value: string) =>
  value;

SmartComponent({
  classes: ['active-class', 'toolbar-class', 'column-class'],

  props: {
    ...pickerProps,
    value: {
      type: null,
      observer: 'updateValue',
    },
    filter: null,
    type: {
      type: String,
      value: 'datetime',
      observer: 'updateValue',
    },
    showToolbar: {
      type: Boolean,
      value: true,
    },
    locale: {
      type: Object,
    },
    formatter: {
      type: null,
      value: defaultFormatter,
    },
    amText: {
      type: String,
      value: 'AM',
    },
    pmText: {
      type: String,
      value: 'PM',
    },
    columnsOrder: {
      type: Array,
      value: [],
    },
    is12HourClock: {
      type: Boolean,
      value: false,
    },
    minDate: {
      type: Number,
      value: new Date(currentYear - 10, 0, 1).getTime(),
      observer: 'updateValue',
    },
    maxDate: {
      type: Number,
      value: new Date(currentYear + 10, 11, 31).getTime(),
      observer: 'updateValue',
    },
    minHour: {
      type: Number,
      value: 0,
      observer: 'updateValue',
    },
    maxHour: {
      type: Number,
      value: 23,
      observer: 'updateValue',
    },
    minMinute: {
      type: Number,
      value: 0,
      observer: 'updateValue',
    },
    maxMinute: {
      type: Number,
      value: 59,
      observer: 'updateValue',
    },
    formatterMap: {
      type: Object,
      value: undefined,
    },
    columnStyles: {
      type: Object,
      value: undefined,
    },
    fontStyles: {
      type: Object,
      value: undefined,
    },
  },

  data: {
    part: 'am',
    innerValue: Date.now(),
    isCreated: false,
    columns: [] as {
      values: any[];
      order?: number;
      unit?: string;
      style?: string;
      fontStyle?: string;
      activeIndex: number;
    }[],
  },

  created() {
    const innerValue = this.correctValue(this.data.value);
    this.updateColumnValue(innerValue);
    if (innerValue !== this.data.value) {
      this.$emit('input', innerValue);
    }
    this.setData({
      isCreated: true,
    });
  },

  methods: {
    updateValue() {
      const { value, innerValue, isCreated } = this.data;
      if (!isCreated) return;
      const val = this.correctValue(value);
      const isEqual = val === innerValue;
      this.updateColumnValue(val);
      if (!isEqual) {
        this.$emit('input', val);
      }
    },

    getPicker() {
      if (this.picker == null) {
        this.picker = this.selectComponent('.smart-datetime-picker');

        const { picker } = this;
        const { setColumnValues } = picker;
        picker.setColumnValues = (...args: any) => setColumnValues.apply(picker, [...args, false]);
      }

      return this.picker;
    },

    getTimeBoundary() {
      const { type, is12HourClock, minHour, maxHour, minMinute, maxMinute } = this.data;
      if (type === 'time' && is12HourClock) {
        if (minHour === 1 && maxHour === 24) {
          return {
            minHour: 0,
            maxHour: 23,
            minMinute,
            maxMinute,
          };
        }
      }
      return {
        minHour,
        maxHour,
        minMinute,
        maxMinute,
      };
    },
    formatterFunc(type: string, value: string | number, data: any) {
      if (type === 'part') {
        return value === 'am' ? data.amText : data.pmText;
      }
      const { formatterMap, formatter = defaultFormatter } = this?.data ?? data;
      const mapDetail = formatterMap?.[type];
      if (typeof mapDetail === 'string') {
        return replacePlaceholders(mapDetail, { [type]: value });
      }
      if (typeof mapDetail === 'object') {
        return mapDetail[value] ?? formatter(type, value);
      }
      return formatter(type, value);
    },

    updateColumns(values: Array<string | number>) {
      const { locale, columnStyles, fontStyles } = this.data;
      const results = this.getOriginColumns().map((column, index) => {
        const value = values[index];
        const list = column.values.map(value => this.formatterFunc(column.type, value, this.data));
        const activeIndex = list.findIndex(item => item === value);
        return {
          values: list,
          order: column.order,
          unit: locale?.[column.type],
          style: columnStyles?.[column.type],
          fontStyle: fontStyles?.[column.type],
          activeIndex: activeIndex === -1 ? 0 : activeIndex,
          loop: !['12HourClock', 'year'].includes(column.type),
        };
      });
      return this.setData({ columns: results });
    },

    getOriginColumns() {
      const { part, filter, is12HourClock, type, amText, pmText, columnsOrder } = this.data;
      const { minHour, maxHour } = this.getTimeBoundary();
      const results = this.getRanges().map(({ type: timeType, range }, index) => {
        const order = columnsOrder[index];
        let values = times(range[1] - range[0] + 1, index => {
          const value = range[0] + index;
          if (is12HourClock && type === 'time' && timeType === 'hour') {
            if (part === 'pm') {
              if (value === 12) return '12';
              return padZero(value - 12);
            }
            if (value === 0) return '12';
            return padZero(value);
          }
          return timeType === 'year' ? `${value}` : padZero(value);
        });

        if (filter) {
          values = filter(timeType, values);
        }

        return { type: timeType, values, order };
      });
      if (is12HourClock && type === 'time') {
        return [
          {
            type: '12HourClock',
            values: minHour > 11 ? [pmText] : maxHour < 12 ? [amText] : [amText, pmText],
            order: columnsOrder[0],
          },
          ...results.map((item, index) => ({ ...item, order: columnsOrder[index + 1] })),
        ].filter(Boolean);
      }
      return results;
    },

    getRanges() {
      const { data } = this;
      if (data.type === 'time' && data.is12HourClock) {
        const { minHour, maxHour, minMinute, maxMinute } = this.getTimeBoundary();
        const { part } = data;
        const time12Range = part === 'pm' ? [12, 23] : [0, 11];
        return [
          {
            type: 'hour',
            range: findIntersection(time12Range, [minHour, maxHour]),
          },
          {
            type: 'minute',
            range: [minMinute, maxMinute],
          },
        ];
      }
      if (data.type === 'time') {
        const { minHour, maxHour, minMinute, maxMinute } = this.getTimeBoundary();
        return [
          {
            type: 'hour',
            range: [minHour, maxHour],
          },
          {
            type: 'minute',
            range: [minMinute, maxMinute],
          },
        ];
      }

      const { maxYear, maxDate, maxMonth, maxHour, maxMinute } = this.getBoundary(
        'max',
        data.innerValue
      );
      const { minYear, minDate, minMonth, minHour, minMinute } = this.getBoundary(
        'min',
        data.innerValue
      );

      const result = [
        {
          type: 'year',
          range: [minYear, maxYear],
        },
        {
          type: 'month',
          range: [minMonth, maxMonth],
        },
        {
          type: 'day',
          range: [minDate, maxDate],
        },
        {
          type: 'hour',
          range: [minHour, maxHour],
        },
        {
          type: 'minute',
          range: [minMinute, maxMinute],
        },
      ];

      if (data.type === 'date') result.splice(3, 2);
      if (data.type === 'year-month') result.splice(2, 3);
      return result;
    },

    correctValue(value: any) {
      const { data } = this;
      // validate value
      const isDateType = data.type !== 'time';
      if (isDateType && !isValidDate(value)) {
        value = data.minDate;
      } else if (!isDateType && !value) {
        const { minHour } = data;
        value = `${padZero(minHour)}:00`;
      }

      // time type
      if (!isDateType) {
        const { minHour, maxHour, minMinute, maxMinute } = this.getTimeBoundary();
        let [hour, minute] = value.split(':');
        if (Number(hour) === 24) {
          hour = 0;
        }
        hour = padZero(range(hour, minHour, maxHour));
        minute = padZero(range(minute, minMinute, maxMinute));

        return `${hour}:${minute}`;
      }

      // date type
      value = Math.max(value, data.minDate);
      value = Math.min(value, data.maxDate);

      return value;
    },

    getBoundary(type: string, innerValue: number) {
      const value = new Date(innerValue);
      const boundary = new Date(this.data[`${type}Date`]);
      const year = boundary.getFullYear();
      let month = 1;
      let date = 1;
      let hour = 0;
      let minute = 0;

      if (type === 'max') {
        month = 12;
        date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
      }

      if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;
        if (value.getMonth() + 1 === month) {
          date = boundary.getDate();
          if (value.getDate() === date) {
            hour = boundary.getHours();
            if (value.getHours() === hour) {
              minute = boundary.getMinutes();
            }
          }
        }
      }

      return {
        [`${type}Year`]: year,
        [`${type}Month`]: month,
        [`${type}Date`]: date,
        [`${type}Hour`]: hour,
        [`${type}Minute`]: minute,
      };
    },

    onCancel() {
      this.$emit('cancel');
    },

    onConfirm() {
      this.$emit('confirm', this.data.innerValue);
    },

    onChange() {
      const { data } = this;
      let value;

      const picker = this.getPicker();
      const indexes = picker.getIndexes();
      if (data.type === 'time' && data.is12HourClock) {
        const originColumns = this.getOriginColumns();
        const [partText, hour, minute] = indexes.map(
          (item, index) => originColumns[index].values[item]
        );
        const part = partText === this.data.pmText ? 'pm' : 'am';
        this.setData({
          part,
        });
        value = `${
          part === 'pm'
            ? hour === '12'
              ? 12
              : Number(hour) + 12
            : hour === '12'
            ? 0
            : Number(hour)
        }:${Number(minute)}`;
      } else if (data.type === 'time') {
        const originColumns = this.getOriginColumns();
        value = `${+originColumns[0].values[indexes[0]]}:${+originColumns[1].values[indexes[1]]}`;
      } else {
        const originColumns = this.getOriginColumns();
        const values = indexes.map((value, index) => originColumns[index].values[value]);
        const year = getTrueValue(values[0]);
        const month = getTrueValue(values[1]);
        const maxDate = getMonthEndDay(year, month);
        let date = getTrueValue(values[2]);
        if (data.type === 'year-month') {
          date = 1;
        }
        date = date > maxDate ? maxDate : date;
        let hour = 0;
        let minute = 0;
        if (data.type === 'datetime') {
          hour = getTrueValue(values[3]);
          minute = getTrueValue(values[4]);
        }
        value = new Date(year, month - 1, date, hour, minute);
      }
      value = this.correctValue(value);
      this.updateColumnValue(value);
      picker.value = value;
      this.$emit('input', value);
      this.$emit('change', picker);
    },

    updateColumnValue(value) {
      let values: string[] = [];
      const { columns, part, value: outerValue, ...rest } = this.data;
      rest.innerValue = value;
      const dataStr = JSON.stringify(rest);
      if (dataStr === this.preDataStr) return;
      this.preDataStr = dataStr;
      const { type, is12HourClock } = this.data;
      const formatter = this.formatterFunc;
      if (type === 'time' && is12HourClock) {
        const [hour, minute] = value.split(':');
        const part = Number(hour) < 12 ? 'am' : 'pm';
        this.setData({
          part,
        });
        values = [
          formatter('part', part, this.data),
          formatter(
            'hour',
            part === 'am'
              ? hour === '0'
                ? '12'
                : hour
              : hour === '12'
              ? '12'
              : padZero(Number(hour) - 12),
            this.data
          ),
          formatter('minute', minute, this.data),
        ];
      } else if (type === 'time') {
        const pair = value.split(':');
        values = [formatter('hour', pair[0], this.data), formatter('minute', pair[1], this.data)];
      } else {
        const date = new Date(value);
        values = [
          formatter('year', `${date.getFullYear()}`, this.data),
          formatter('month', padZero(date.getMonth() + 1), this.data),
        ];
        if (type === 'date') {
          values.push(formatter('day', padZero(date.getDate()), this.data));
        }
        if (type === 'datetime') {
          values.push(
            formatter('day', padZero(date.getDate()), this.data),
            formatter('hour', padZero(date.getHours()), this.data),
            formatter('minute', padZero(date.getMinutes()), this.data)
          );
        }
      }
      this.setData({ innerValue: value });
      this.updateColumns(values);
      // picker.setValues(values);
      // return this.set({ innerValue: value })
      //   .then(() => this.updateColumns())
      //   .then(() => picker.setValues(values));
    },
    onAnimationStart() {
      this.$emit('animation-start');
    },
    onAnimationEnd() {
      this.$emit('animation-end');
    },
  },
});
