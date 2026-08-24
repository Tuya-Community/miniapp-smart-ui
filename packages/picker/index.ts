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
  unitGap?: string | number;
}

// 超过该数量且非 loop 的列启用「窗口化」：只把当前位置附近的一段数据交给子 picker-column，
// 其余保存在逻辑层实例属性中，滚动停稳后再回中，避免把超长数组整份 setData 到渲染层 / 子组件。
const WINDOW_THRESHOLD = 2000;
const WINDOW_SIZE = 1000;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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
    fullHeight: {
      type: Boolean,
      value: false,
    },
    defaultIndex: {
      type: Number,
      value: 0,
    },
    activeIndex: {
      type: null,
      observer() {
        // 受控模式下 activeIndex（全局）变化时，若存在窗口化列需以新位置重建窗口
        if (this._hasWindow) {
          this.buildRenderColumns();
        }
      },
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
        this.buildRenderColumns();

        if (Array.isArray(this.children) && this.children.length) {
          this.setColumns().catch(() => {});
        }
      },
    },
  },

  data: {
    animating: false,
    // 交给渲染层 / 子组件的列数据（窗口化列在此仅为切片，非窗口化列为完整数据）
    renderColumns: [] as any[],
  },

  beforeCreate() {
    // 每列的窗口状态：{ windowed, start, size, full }，保存在逻辑层，不进入 data
    this._windows = [];
    this._hasWindow = false;
    this._repositioning = false;
    Object.defineProperty(this, 'children', {
      get: () => this.selectAllComponents('.smart-picker__column') || [],
    });
  },

  mounted() {
    if (![3, 5, 7, 9].includes(this.data.visibleItemCount)) {
      console.error('visibleItemCount 的值必须为 3, 5, 7, 9');
    }
  },

  methods: {
    noop() {},

    // 归一化列数据：simple 模式（columns 为一维数组）包一层
    normalizedColumns() {
      const { columns } = this.data;
      if (this.simple) {
        return [{ values: columns }];
      }
      return Array.isArray(columns) ? columns : [];
    },

    // 解析某列的初始全局下标（优先 activeIndex，其次 defaultIndex）
    resolveInitialIndex(column: Column) {
      const { defaultIndex, activeIndex } = this.data;
      const columnActive =
        column.activeIndex === null || column.activeIndex === undefined
          ? activeIndex
          : column.activeIndex;
      let index: number;
      if (columnActive !== null && columnActive !== undefined) {
        index = columnActive;
      } else if (column.defaultIndex !== undefined) {
        index = column.defaultIndex;
      } else {
        index = defaultIndex;
      }
      const { length } = column.values || [];
      return clamp(index || 0, 0, Math.max(0, length - 1));
    },

    // 判断某列是否需要窗口化
    shouldWindow(column: Column) {
      return (
        !this.data.loop &&
        !(column as any).loop &&
        Array.isArray(column.values) &&
        column.values.length > WINDOW_THRESHOLD
      );
    },

    // 基于当前 columns 计算 renderColumns 与每列窗口状态
    buildRenderColumns() {
      const columns = this.normalizedColumns();
      const windows: any[] = [];
      let hasWindow = false;

      const renderColumns = columns.map((column: Column) => {
        const values = column.values || [];
        if (!this.shouldWindow(column)) {
          windows.push({ windowed: false, start: 0, size: values.length, full: values });
          return column;
        }

        hasWindow = true;
        const globalIndex = this.resolveInitialIndex(column);
        const size = WINDOW_SIZE;
        const start = clamp(
          globalIndex - Math.floor(size / 2),
          0,
          Math.max(0, values.length - size)
        );
        const localIndex = globalIndex - start;
        windows.push({ windowed: true, start, size, full: values });
        return {
          ...column,
          values: values.slice(start, start + size),
          defaultIndex: localIndex,
          activeIndex: localIndex,
          _windowed: true,
        };
      });

      this._windows = windows;
      this._hasWindow = hasWindow;
      this.setData({ renderColumns });
    },

    // 将窗口化列停稳后回中：使当前项回到窗口中心，纯坐标平移，静止态无感
    recenterColumn(columnIndex: number) {
      const win = this._windows[columnIndex];
      if (!win || !win.windowed || this._repositioning) return;

      const column = this.getColumn(columnIndex);
      if (!column) return;

      const localIndex = column.data.currentIndex;
      const globalIndex = win.start + localIndex;
      const { size } = win;
      const newStart = clamp(
        globalIndex - Math.floor(size / 2),
        0,
        Math.max(0, win.full.length - size)
      );
      if (newStart === win.start) return;

      this._repositioning = true;
      win.start = newStart;
      const newLocal = globalIndex - newStart;
      // 同一次 setData 内同时更新切片与 active-index（局部），子组件原子接收，
      // 配合 wxs 对大跳变强制 transition:none，实现无动画的静默回中
      this.setData(
        {
          [`renderColumns[${columnIndex}].values`]: win.full.slice(newStart, newStart + size),
          [`renderColumns[${columnIndex}].activeIndex`]: newLocal,
        },
        () => {
          this._repositioning = false;
        }
      );
    },

    // 局部下标 -> 全局下标
    toGlobalIndex(columnIndex: number, localIndex: number) {
      const win = this._windows[columnIndex];
      return win && win.windowed ? win.start + localIndex : localIndex;
    },

    setColumns() {
      const columns = this.normalizedColumns();
      const stack = columns.map((column: Column, index: number) => {
        // 窗口化列由 renderColumns（wxml）响应式驱动，不走命令式全量下发
        if (this._windows[index] && this._windows[index].windowed) {
          return Promise.resolve();
        }
        return this.setColumnValues(index, column.values);
      });
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
      const columnIndex = this.simple ? 0 : event.currentTarget.dataset.index;
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
      // 停稳后再回中，保证切换发生在静止态
      this.recenterColumn(columnIndex);
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
      const win = this._windows[index];
      if (win && win.windowed) {
        // 窗口化列：在完整数据中按 valueKey 查找全局下标后跳转
        const { valueKey } = this.data;
        for (let i = 0; i < win.full.length; i++) {
          const option = win.full[i];
          const text =
            option && typeof option === 'object' && valueKey in option ? option[valueKey] : option;
          if (text === value) {
            return this.setColumnIndex(index, i);
          }
        }
        return Promise.resolve();
      }

      const column = this.getColumn(index);
      if (column == null) {
        return Promise.reject(new Error('setColumnValue: The corresponding column does not exist'));
      }
      return column.setValue(value);
    },

    // get column option index by column index
    getColumnIndex(columnIndex: number) {
      const local = (this.getColumn(columnIndex) || {}).data?.currentIndex ?? 0;
      return this.toGlobalIndex(columnIndex, local);
    },

    // set column option index by column index
    setColumnIndex(columnIndex: number, optionIndex: number) {
      const win = this._windows[columnIndex];
      if (win && win.windowed) {
        // 以目标全局下标为中心重建窗口，子组件通过 active-index 定位
        const { size } = win;
        const globalIndex = clamp(optionIndex, 0, Math.max(0, win.full.length - 1));
        const newStart = clamp(
          globalIndex - Math.floor(size / 2),
          0,
          Math.max(0, win.full.length - size)
        );
        win.start = newStart;
        this._repositioning = true;
        return this.set({
          [`renderColumns[${columnIndex}].values`]: win.full.slice(newStart, newStart + size),
          [`renderColumns[${columnIndex}].activeIndex`]: globalIndex - newStart,
        }).then(() => {
          this._repositioning = false;
        });
      }

      const column = this.getColumn(columnIndex);
      if (column == null) {
        return Promise.reject(new Error('setColumnIndex: The corresponding column does not exist'));
      }
      return column.setIndex(optionIndex);
    },

    // get options of column by index
    getColumnValues(index: number) {
      const win = this._windows[index];
      if (win && win.windowed) {
        return win.full;
      }
      return (this.children[index] || {}).data.options;
    },

    // set options of column by index
    setColumnValues(index: number, options: any[], needReset = true) {
      const win = this._windows[index];
      if (win && win.windowed) {
        // 替换完整数据并以头部为中心重建窗口
        win.full = options || [];
        const { size } = win;
        const start = needReset ? 0 : clamp(win.start, 0, Math.max(0, win.full.length - size));
        win.start = start;
        this._repositioning = true;
        return this.set({
          [`renderColumns[${index}].values`]: win.full.slice(start, start + size),
          [`renderColumns[${index}].activeIndex`]: 0,
        }).then(() => {
          this._repositioning = false;
        });
      }

      const column = this.children[index];

      if (column == null) {
        return Promise.reject(
          new Error('setColumnValues: The corresponding column does not exist')
        );
      }

      const prevOptions = column.data.options || [];
      // 先比长度（O(1)）短路：长度不同必然不同，避免对超长数组做两次 JSON.stringify
      const isSame =
        prevOptions.length === options.length &&
        JSON.stringify(prevOptions) === JSON.stringify(options);

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
      return this.children.map((child, index) =>
        this.toGlobalIndex(index, child.data.currentIndex)
      );
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
