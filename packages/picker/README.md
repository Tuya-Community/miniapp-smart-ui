---
category: 反馈
---

# Picker 选择器

### 介绍

提供多个选项集合供用户选择，支持单列选择和多列级联，通常与 [弹出层](/material/smartui?comId=popup&appType=miniapp) 组件配合使用。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-picker": "@tuya-miniapp/smart-ui/lib/picker/index"
}
```

## 代码演示

### 基础用法

```html
<smart-picker 
  columns="{{ columns }}"
  change-animation
  bind:change="onChange" 
/>
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
});
```

### 多列用法

```html
    
<smart-picker active-style="color: #000;" columns="{{ columns }}" bind:change="onChange" />
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
        style: 'flex: none;width: auto;min-width: 61px;',
        fontStyle: 'font-size: 16px;'
      },
      {
        values: ['.'],
        disabled: true,
        style: 'flex: none;width: 8px;display:flex;justify-content: center;'
      },
      {
        values: new Array(20).fill(1).map((x, i) => i),
        style: 'flex: none;width: auto;min-width: 61px;',
        unit: 'Kg',
      },
    ],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
});
```

### 默认选中项

单列选择器可以直接通过`default-index`属性设置初始选中项的索引值。

```html
<smart-picker
  columns="{{ columns }}"
  default-index="{{ 2 }}"
  bind:change="onChange"
/>
```

### 展示顶部栏

```html
<smart-picker
  show-toolbar
  title="标题"
  columns="{{ columns }}"
  bind:cancel="onCancel"
  bind:confirm="onConfirm"
/>
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  },

  onConfirm(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },

  onCancel() {
    Toast('取消');
  },
});
```

### 多列联动

```html
<smart-picker columns="{{ columns }}" bind:change="onChange" />
```

```javascript
const citys = {
  浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  福建: ['福州', '厦门', '莆田', '三明', '泉州'],
};

Page({
  data: {
    columns: [
      {
        values: Object.keys(citys),
        className: 'column1',
      },
      {
        values: citys['浙江'],
        className: 'column2',
        defaultIndex: 2,
      },
    ],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
  },
});
```

### 禁用选项

选项可以为对象结构，通过设置 disabled 来禁用该选项。

```html
<smart-picker columns="{{ columns }}" />
```

```javascript
Page({
  data: {
    columns: [
      { text: '杭州', disabled: true },
      { text: '宁波' },
      { text: '温州' },
    ],
  },
});
```

### 加载状态

当 Picker 数据是通过异步获取时，可以通过 `loading` 属性显示加载提示。

```html
<smart-picker columns="{{ columns }}" loading />
```

### 设置列的样式顺序 `v2.2.0`

通过设置列的 `order` 属性可以设置列的顺序，对应列的order越大，就会越靠后，同css的`flex order` 属性，只是从样式层面改变列的顺序，逻辑还是不变。  

```html
<smart-picker columns="{{ columns }}" />
```

```javascript
Page({
  data: {
    columns: [
      {
        values: ["浙江", "福建"],
        order: 2
      },
      {
        values: ["杭州", "宁波", "温州", "嘉兴", "湖州"],
        order: 1
      },
    ],
  },
});
```

### 循环列表 `2.7.0`

`loop` 属性可以开启列表的循环渲染，列表会首尾相连，无限循环

```html
    
<smart-picker loop columns="{{ columns }}" bind:change="onChange" />
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
      },
    ],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
});
```

### 更多3D `2.7.0`

`fullHeight` 属性可以展示更多的空间，看到更多3D翻转的项；当然你也可以覆盖组件的高度样式，来自定义需要可视的空间

```html
    
<smart-picker loop fullHeight columns="{{ columns }}" bind:change="onChange" />
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
      },
    ],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
});
```

## API

### Props

| 参数              | 说明                             | 类型      | 默认值  |
| ---------------- | -------------------------------- | --------- | ------- |
| active-index      | 单列选择器的当前选中项索引，<br>多列选择器请参考下方的 Columns 配置 | _number_  | `-1`    |
| cancel-button-text  | 取消按钮文字          | _string_  | `取消`  |
| columns             | 对象数组，配置每一列显示的数据        | _Array_   | `[]`    |
| confirm-button-text | 确认按钮文字               | _string_  | `确认`  |
| default-index       | 单列选择器的默认选中项索引，<br>多列选择器请参考下方的 Columns 配置 | _number_  | `0`     |
| item-height         | 选项高度                   | _number_  | `44`    |
| loading             | 是否显示加载状态                                                    | _boolean_ | `false` |
| show-toolbar        | 是否显示顶部栏       | _boolean_ | `false` |
| title               | 顶部栏标题         | _string_  | `''`    |
| toolbar-position    | 顶部栏位置，可选值为`bottom`   | _string_  | `top`   |
| unit                | 单列选择器的默认的单位，<br>多列选择器请参考下方的 Columns 配置     | _number_  | ''      |
| value-key           | 选项对象中，文字对应的 key        | _string_  | `text`  |
| visible-item-count  | 可见的选项个数    | _3 \| 5 \| 7 \| 9_   | `5`     |
| active-style `v2.0.0`  | 选中状态下的样式            | _string_  | `''`     |
| change-animation `v2.2.0`  | 组件受数据驱动选择值改变时是否需要动画过度效果（不包含手指交互滚动的动画）            | _boolean_  | `false`     |
| animation-time `v2.3.7`  | 过渡动画以及选择回调延迟的时间(单位ms)   | _number_  | `800` `v2.3.7` `300` `v2.6.0`    |
| loop `v2.7.0`  | 循环列表           | _boolean_  | `false`    |
| font-style `v2.7.0`  | 字体样式，优先级低于 columns 内的           | _string_  | -    |
| full-height `v2.7.0`  | 是否高度直接等于 `visibleItemCount * itemHeight`, 组件默认会再 `* 0.9` 缩小最外层可视的高度     | _boolean_  | `false`   |


### Events

Picker 组件的事件会根据 columns 是单列或多列返回不同的参数。

| 事件名       | 说明               | 参数                                                                                             |
| ------------ | ------------------ | ------------------------------------------------------------------------------------------------ |
| bind:cancel  | 点击取消按钮时触发 | 单列：选中值，选中值对应的索引<br>多列：所有列选中值，所有列选中值对应的索引                     |
| bind:change  | 选项改变时触发     | 单列：Picker 实例，选中值，选中值对应的索引<br>多列：Picker 实例，所有列选中值，当前列对应的索引 |
| bind:confirm | 点击完成按钮时触发 | 单列：选中值，选中值对应的索引<br>多列：所有列选中值，所有列选中值对应的索引                     |
| bind:animation-start `v2.3.0` | 组件内部动画开始 | -  |
| bind:animation-end `v2.3.0` | 组件内部动画结束 | -  |

### Columns 数据结构

当传入多列数据时，`columns`为一个对象数组，数组中的每一个对象配置每一列，每一列有以下`key`。

| key           | 说明                        |
| ------------- | --------------------------- |
| active-index  | 当前选中项的索引，默认为 -1 |
| default-index | 初始选中项的索引，默认为 0  |
| style `v2.0.0` | 列的样式  |
| fontStyle `v2.3.5` | 列的文字样式  |
| unit          | 列对应的单位，默认为空      |
| values        | 列中对应的备选值            |
| order `v2.2.0`  | 设置列的顺序，同`flex order`属性，只是从样式角度修改列的顺序，逻辑还是不变            | _number_  | -     |
| disabled `v2.3.5`  | 禁用此列   | _boolean_  | `false`     |

### 外部样式类

| 类名          | 说明         |
| ------------- | ------------ |
| column-class  | 列样式类     |
| custom-class  | 根节点样式类 |
| toolbar-class | 顶部栏样式类 |
| hairline-class `v2.6.0` | 分割线的样式类 |


### 方法

通过 selectComponent 可以获取到 picker 实例并调用实例方法。

| 方法名          | 参数                     | 返回值      | 介绍                       |
| --------------- | ------------------------ | ----------- | -------------------------- |
| getColumnIndex  | columnIndex              | optionIndex | 获取对应列选中项的索引     |
| getColumnValue  | columnIndex              | value       | 获取对应列选中的值         |
| getColumnValues | columnIndex              | values      | 获取对应列中所有选项       |
| getIndexes      | -                        | indexes     | 获取所有列选中值对应的索引 |
| getValues       | -                        | values      | 获取所有列选中的值         |
| setColumnIndex  | columnIndex, optionIndex | -           | 设置对应列选中项的索引     |
| setColumnValue  | columnIndex, value       | -           | 设置对应列选中的值         |
| setColumnValues | columnIndex, values      | -           | 设置对应列中所有选项       |
| setIndexes      | indexes                  | -           | 设置所有列选中值对应的索引 |
| setValues       | values                   | -           | 设置所有列选中的值         |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --picker-background-color | _var(--app-B4, #ffffff)_ | 选择器背景颜色 |
| --picker-padding | _16px_ | 选择器内边距 |
| --picker-toolbar-height | _44px_ | 工具栏高度 |
| --picker-title-font-size | _16px_ | 标题字体大小 |
| --picker-action-padding | _0 @padding-md_ | 操作按钮内边距 |
| --picker-action-font-size | _14px_ | 操作按钮字体大小 |
| --picker-confirm-action-color | _#576b95_ | 确认按钮颜色 |
| --picker-cancel-action-color | _#969799_ | 取消按钮颜色 |
| --picker-option-font-size | _16px_ | 选项字体大小 |
| --picker-option-unit-font-size | _12px_ | 单位字体大小 |
| --picker-option-text-color | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_ | 选项文本颜色 |
| --picker-option-unit-text-color | _var(--app-B6-N4, rgba(0, 0, 0, 0.4))_ | 单位文本颜色 |
| --picker-loading-icon-color | _#1989fa_ | 加载图标颜色 |
| --picker-loading-mask-color | _var(--app-B4, #ffffff)_ | 加载遮罩颜色 |
| --picker-option-disabled-opacity | _0.3_ | 禁用选项不透明度 |
| --picker-option-selected-text-color | _var(--app-B6-N1, rgba(0, 0, 0, 1))_ | 选中选项文本颜色 |
| --picker-option-unit-mid-size `v2.4.0` | _0_  `v2.4.0` _4px_ `v2.6.0` | 单位和内容文案的间隔 |
| --picker-option-selected-font-weight-bold `v2.6.0` | _700_ | 选中时文案的字重 |
