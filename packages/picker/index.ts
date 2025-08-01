import { SmartComponent } from '../common/component';
import { pickerProps } from './shared';

interface Option {
  // @ts-ignore
  disabled?: boolean;
  [key: string]: string;
}
interface Column {
  values: Array<Option | string>;
  defaultIndex?: number;
  activeIndex?: number;
  unit?: string;
}

SmartComponent({
  classes: ['hairline-class', 'active-class', 'toolbar-class', 'column-class'],

  props: {
    ...pickerProps,
    valueKey: {
      type: String,
      value: 'text',
    },
    toolbarPosition: {
      type: String,
      value: 'top',
    },
    defaultIndex: {
      type: Number,
      value: 0,
    },
    activeIndex: {
      type: Number,
      value: -1,
    },
    unit: {
      type: String,
      value: '',
    },
    columns: {
      type: Array,
      value: [],
      observer(columns = []) {
        this.simple = columns.length && !columns[0].values;

        if (Array.isArray(this.children) && this.children.length) {
          this.setColumns().catch(() => {});
        }
      },
    },
  },

  data: {
    animating: false,
  },

  beforeCreate() {
    Object.defineProperty(this, 'children', {
      get: () => this.selectAllComponents('.smart-picker__column') || [],
    });
  },

  methods: {
    noop() {},

    setColumns() {
      const { data } = this;
      const columns = this.simple ? [{ values: data.columns }] : data.columns;
      const stack = columns.map((column: Column, index: number) =>
        this.setColumnValues(index, column.values)
      );
      return Promise.all(stack);
    },

    emit(event: WechatMiniprogram.TouchEvent) {
      const { type } = event.currentTarget.dataset;
      if (this.simple) {
        this.$emit(type, {
          value: this.getColumnValue(0),
          index: this.getColumnIndex(0),
        });
      } else {
        this.$emit(type, {
          value: this.getValues(),
          index: this.getIndexes(),
        });
      }
    },

    onChange(event: WechatMiniprogram.CustomEvent) {
      if (this.simple) {
        this.$emit('change', {
          picker: this,
          value: this.getColumnValue(0),
          index: this.getColumnIndex(0),
        });
      } else {
        this.$emit('change', {
          picker: this,
          value: this.getValues(),
          index: event.currentTarget.dataset.index,
        });
      }
    },

    // get column instance by index
    getColumn(index: number) {
      return this.children[index];
    },

    // get column value by index
    getColumnValue(index: number) {
      const column = this.getColumn(index);
      return column && column.getValue();
    },

    // set column value by index
    setColumnValue(index: number, value: any) {
      const column = this.getColumn(index);

      if (column == null) {
        return Promise.reject(new Error('setColumnValue: The corresponding column does not exist'));
      }

      return column.setValue(value);
    },

    // get column option index by column index
    getColumnIndex(columnIndex: number) {
      return (this.getColumn(columnIndex) || {}).data.currentIndex;
    },

    // set column option index by column index
    setColumnIndex(columnIndex: number, optionIndex: number) {
      const column = this.getColumn(columnIndex);

      if (column == null) {
        return Promise.reject(new Error('setColumnIndex: The corresponding column does not exist'));
      }

      return column.setIndex(optionIndex);
    },

    // get options of column by index
    getColumnValues(index: number) {
      return (this.children[index] || {}).data.options;
    },

    // set options of column by index
    setColumnValues(index: number, options: any[], needReset = true) {
      const column = this.children[index];

      if (column == null) {
        return Promise.reject(
          new Error('setColumnValues: The corresponding column does not exist')
        );
      }

      const isSame = JSON.stringify(column.data.options) === JSON.stringify(options);

      if (isSame) {
        return Promise.resolve();
      }

      return column.set({ options }).then(() => {
        if (needReset) {
          column.setIndex(0);
        }
      });
    },

    // get values of all columns
    getValues() {
      return this.children.map(child => child.getValue());
    },

    // set values of all columns
    setValues(values: any[]) {
      const stack = values.map((value, index) => this.setColumnValue(index, value));
      return Promise.all(stack);
    },

    // get indexes of all columns
    getIndexes() {
      return this.children.map(child => child.data.currentIndex);
    },

    // set indexes of all columns
    setIndexes(indexes: number[]) {
      const stack = indexes.map((optionIndex, columnIndex) =>
        this.setColumnIndex(columnIndex, optionIndex)
      );
      return Promise.all(stack);
    },
    animationStart() {
      if (this.data.animating) return;
      this.setData({
        animating: true,
      });
      this.$emit('animation-start');
    },
    animationEnd() {
      if (!this.data.animating) return;
      this.setData({
        animating: false,
      });
      this.$emit('animation-end');
    },
  },
});
