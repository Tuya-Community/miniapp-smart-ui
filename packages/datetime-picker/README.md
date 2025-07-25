---
category: 数据录入
---

# DatetimePicker 时间选择

### 介绍

用于选择时间，支持日期、时分等时间维度，通常与 [弹出层](/material/smartui?comId=popup&appType=miniapp) 组件配合使用。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-datetime-picker": "@tuya-miniapp/smart-ui/lib/datetime-picker/index"
}
```

## 代码演示

### 选择完整时间

`value` 为时间戳。

```html
<smart-datetime-picker
  type="datetime"
  value="{{ currentDate }}"
  min-date="{{ minDate }}"
  max-date="{{ maxDate }}"
  bind:input="onInput"
/>
```

```javascript
Page({
  data: {
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2018, 0, 1).getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
});
```

### 选择日期（年月日）

`value` 为时间戳，通过传入 `formatter-map` `v2.2.0` 属性可以对内部的日期进行替换。  
`columns-order` `v2.2.0`属性可以设置列的顺序，对应列的order越大，就会越靠后，同css的`flex order` 属性，只是从样式层面改变列的顺序，逻辑还是不变。  

```html
<smart-datetime-picker
  type="date"
  value="{{ currentDate }}"
  columns-order="{{ columnsOrder }}"
  bind:input="onInput"
  min-date="{{ minDate }}"
  formatter-map="{{ formatterMap }}"
/>
```

```js
Page({
  data: {
    currentDate: new Date(2018, 2, 31).getTime(),
    minDate: new Date(2018, 0, 1).getTime(),
    columnsOrder: [3, 2, 1],
    formatterMap: {
      year: '{{year}}年',
      month: {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
      },
      day: '{{day}}日'
    },
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
});
```

### 选择日期（年月）

`value` 为时间戳。

```html
<smart-datetime-picker
  type="year-month"
  value="{{ currentDate }}"
  min-date="{{ minDate }}"
  bind:input="onInput"
/>
```

```js
Page({
  data: {
    currentDate: new Date().getTime(),
    minDate: new Date(2018, 0, 1).getTime(),
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
});
```

### 选择时间

`value` 为字符串。

```html
<smart-datetime-picker
  type="time"
  data-type="time"
  value="{{ currentDate }}"
  min-hour="{{ minHour }}"
  max-hour="{{ maxHour }}"
  bind:input="onInput"
/>
```

```js
Page({
  data: {
    currentDate: '12:00',
    minHour: 10,
    maxHour: 20,
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
});
```

### 选择时间-12小时模式 `v2.6.0`

当设置`type: 'time'`时，可以开启`is-12-hour-clock`属性实现12小时选择模式；`am-text`、`pm-text` 可以分别设置上午和下午的文案。  
`font-styles` 和 `column-styles` 内的 `12HourClock` `v2.6.0` 可以修改对应12小时时区的样式。

```html
<smart-datetime-picker
  type="time"
  data-type="time"
  is-12-hour-clock
  value="{{ currentDate }}"
  font-styles="{{ fontStyles }}"
  bind:input="onInput"
/>
```

```js
Page({
  data: {
    currentDate: '11:00',
    fontStyles: {
      '12HourClock': 'font-size: 14px;'
    },
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
});
```


### 关闭值改变动画（v2.2.0）

`change-animation` `v2.2.0` 属性设置为`false`可以关闭因为`value`属性改变导致的组件更新动画效果。  

```html
<smart-datetime-picker
  type="time"
  data-type="time"
  value="{{ currentDate }}"
  max-hour="{{ 24 }}"
  min-hour="{{ 1 }}"
  change-animation="{{ false }}"
  bind:input="onInput"
/>
```

```js
Page({
  data: {
    currentDate: '11:00',
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
});
```

### 选项过滤器

通过传入 `filter` 函数，可以对选项数组进行过滤，实现自定义时间间隔。

```html
<smart-datetime-picker
  type="time"
  value="{{ currentDate }}"
  filter="{{ filter }}"
/>
```

```js
Page({
  data: {
    currentDate: '12:00',
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 5 === 0);
      }
      return options;
    },
  },
});
```

### 样式风格 `2.3.7`

`active-style` 可以修改选中项的样式；`column-styles` 可以设置每一列的样式；`font-styles` 可以设置每一列文字的样式。

```html
<smart-datetime-picker
  show-toolbar="{{ false }}"
    type="datetime"
    data-type="datetime"
    value="{{ currentDate1 }}"
    active-style="{{ activeStyle }}"
    column-styles="{{ columnStyles }}"
    font-styles="{{ fontStyles }}"
    bind:input="onInput"
/>
```

```javascript
Page({
  data: {
    currentDate: new Date().getTime(),
    columnStyles: {
      year: "background: rgba(0, 0, 0, 0.1)",
    },
    fontStyles: {
      month: "color: rgb(23, 138, 237);",
    },
    activeStyle: "color: rgb(235, 87, 41);"
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
});
```

## API

### Props

| 参数                | 说明                                                                           | 类型                       | 默认值     |
| ------------------- | ------------------------------------------------------------------------------ | -------------------------- | ---------- |
| cancel-button-text  | 取消按钮文字     | _string_                   | `取消`     |
| confirm-button-text | 确认按钮文字       | _string_                   | `确认`     |
| filter              | 选项过滤函数(`type` 可能值为 `year`, `month`, `day`, `hour`, `minute`)         | _(type, values) => values_ | -          |
| item-height         | 选项高度    | _number_                   | `44`       |
| loading             | 是否显示加载状态     | _boolean_                  | `false`    |
| locale              | 设置时间单位                   | Locale    |            |
| max-date            | 可选的最大时间，精确到分钟     | _number_                   | 十年后     |
| max-hour            | 可选的最大小时，针对 time 类型       | _number_                   | `23`       |
| max-minute          | 可选的最大分钟，针对 time 类型    | _number_                   | `59`       |
| min-date            | 可选的最小时间，精确到分钟    | _number_                   | 十年前     |
| min-hour            | 可选的最小小时，针对 time 类型    | _number_                   | `0`        |
| min-minute          | 可选的最小分钟，针对 time 类型      | _number_                   | `0`        |
| show-toolbar        | 是否显示顶部栏    | _boolean_      | `true`     |
| title               | 顶部栏标题         | _string_    | `''`       |
| type                | 类型，可选值为 `date` `time` `year-month` <br> <strong>不建议动态修改</strong> | _string_                   | `datetime` |
| value               | 当前选中值    | _string \| number \| Date_ | -     |
| visible-item-count  | 可见的选项个数      | _number_       | `6`        |
| formatter-map `v2.2.0` | 字符串替换(`type` 可选值为 `year`, `month`, `day`, `hour`, `minute`)      | _Record<type, string \| Record<string, string>>_       | -        |
| change-animation `v2.2.0`  | 组件受数据驱动选择值改变时是否需要动画过度效果（不包含手指交互滚动的动画）            | _boolean_  | `false`     |
| is-12-hour-clock `v2.6.0`  | 当设置 `type: 'time'` 时，此属性可开启12小时选择模式         | _boolean_  | `false`     |
| am-text `v2.2.0`  | 12小时选择模式时上午的文案            | _string_  | `AM`     |
| pm-text `v2.2.0`  | 12小时选择模式时下午的文案            | _string_  | `PM`     |
| columns-order `v2.2.0`  | 设置列的顺序，同`flex order`属性，只是从样式角度修改列的顺序，逻辑还是不变            | _string[]_  | `[]`     |
| animation-time `v2.3.7`  | 过渡动画以及选择回调延迟的时间(单位ms)           | _number_  | `800` `v2.3.7` `300` `v2.6.0`     |
| columnStyles `v2.3.7`  | 任意列的样式          | _Record\<string, string>_  | -     |
| font-styles `v2.3.7`  | 任意列的字体样式           | _Record\<string, string>_  | -     |
| active-style `v2.3.7`  | 选中项的样式           | _string_  | -     |

### Events

| 事件名称     | 说明                     | 回调参数   |
| ------------ | ------------------------ | ---------- |
| bind:cancel  | 点击取消按钮时触发的事件 | -          |
| bind:change  | 当值变化时触发的事件     | 组件实例   |
| bind:confirm | 点击完成按钮时触发的事件 | 当前 value |
| bind:input   | 当值变化时触发的事件     | 当前 value |
| bind:animation-start `v2.3.2` | 组件内部动画开始 | -  |
| bind:animation-end `v2.3.2` | 组件内部动画结束 | -  |

### change 事件

在`change`事件中，可以获取到组件实例，对组件进行相应的更新等操作：

| 函数                           | 说明                                       |
| ------------------------------ | ------------------------------------------ |
| getColumnValue(index)          | 获取对应列中选中的值                       |
| getColumnValues(index)         | 获取对应列中所有的备选值                   |
| getValues()                    | 获取所有列中被选中的值，返回一个数组       |
| setColumnValue(index, value)   | 设置对应列中选中的值                       |
| setColumnValues(index, values) | 设置对应列中所有的备选值                   |
| setValues(values)              | `values`为一个数组，设置所有列中被选中的值 |

### 外部样式类

| 类名          | 说明         |
| ------------- | ------------ |
| active-class  | 选中项样式类 |
| column-class  | 列样式类     |
| toolbar-class | 顶部栏样式类 |

### Locale 结构

| 属性   | 说明     |
| ------ | -------- |
| day    | 日单位   |
| hour   | 小时单位 |
| minute | 分钟单位 |
| month  | 月单位   |
| second | 秒单位   |
| year   | 年单位   |


### 样式变量

请参考 picker 组件文档说明 - 样式变量