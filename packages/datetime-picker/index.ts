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
    part: 0,
    innerValue: Date.now(),
    columns: [],
  },

  created() {
    const innerValue = this.correctValue(this.data.value);
    this.updateColumnValue(innerValue);
    if (innerValue !== this.data.value) {
      this.$emit('input', innerValue);
    }
  },

  methods: {
    updateValue() {
      const { data } = this;
      const val = this.correctValue(data.value);
      const isEqual = val === data.innerValue;
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

    formatterFunc(type: string, value: string | number, data: any) {
      if (type === 'part') {
        return value === 0 ? data.amText : data.pmText;
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
          activeIndex,
        };
      });
      return this.set({ columns: results });
    },

    getOriginColumns() {
      const { filter, is12HourClock, type, amText, pmText, columnsOrder } = this.data;
      const results = this.getRanges().map(({ type, range }, index) => {
        const order = columnsOrder[index];
        let values = times(range[1] - range[0] + 1, index => {
          const value = range[0] + index;
          return type === 'year' ? `${value}` : padZero(value);
        });

        if (filter) {
          values = filter(type, values);
        }

        return { type, values, order };
      });
      if (is12HourClock && type === 'time') {
        return [
          {
            type: '12HourClock',
            values: [amText, pmText],
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
        const { part } = data;
        return [
          {
            type: 'hour',
            range: [
              Math.max(part ? 13 : 1, data.minHour) - (part ? 12 : 0),
              Math.min(part ? 24 : 12, data.maxHour) - (part ? 12 : 0),
            ],
          },
          {
            type: 'minute',
            range: [data.minMinute, data.maxMinute],
          },
        ];
      }
      if (data.type === 'time') {
        return [
          {
            type: 'hour',
            range: [data.minHour, data.maxHour],
          },
          {
            type: 'minute',
            range: [data.minMinute, data.maxMinute],
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

    correctValue(value: any, isOutSide?: boolean) {
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
        let [hour, minute] = value.split(':');
        if (Number(hour) === 0 && data.minHour > 0) {
          hour = 24;
        }
        if (Number(hour) === 24 && data.maxHour < 24) {
          hour = 0;
        }
        hour = padZero(range(hour, data.minHour, data.maxHour));
        minute = padZero(range(minute, data.minMinute, data.maxMinute));

        if (isOutSide && Number(hour) === 24) {
          hour = 0;
        }

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
        const [part, hour, minute] = indexes;
        this.setData({
          part,
        });
        const originColumns = this.getOriginColumns();
        value = `${
          (part ? 12 : 0) +
          Number(
            originColumns[1].values[
              hour > originColumns[1].values.length - 1 ? originColumns[1].values.length - 1 : hour
            ]
          )
        }:${Number(
          originColumns[2].values[
            minute > originColumns[2].values.length - 1
              ? originColumns[2].values.length - 1
              : minute
          ]
        )}`;
      } else if (data.type === 'time') {
        const originColumns = this.getOriginColumns();
        value = `${+originColumns[0].values[indexes[0]]}:${+originColumns[1].values[indexes[1]]}`;
      } else {
        const originColumns = this.getOriginColumns();
        const indexes = picker.getIndexes();
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
      value = this.correctValue(value, true);

      this.updateColumnValue(value);
      picker.value = value;
      this.$emit('input', value);
      this.$emit('change', picker);
    },

    updateColumnValue(value) {
      let values: string[] = [];
      const { type, is12HourClock } = this.data;
      const formatter = this.formatterFunc;
      const picker = this.getPicker();
      if (type === 'time' && is12HourClock) {
        const [hour, minute] = value.split(':');
        const part = Number(hour) > 0 && Number(hour) < 13 ? 0 : 1;
        this.setData({
          part,
        });
        values = [
          formatter('part', part, this.data),
          formatter(
            'hour',
            part ? (!hour ? '12' : (hour - 12).toString().padStart(2, '0')) : hour,
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
