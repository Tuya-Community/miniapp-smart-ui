---
category: Data Entry
---

# DatetimePicker Time Selector

### Introduction

Used for selecting a time, supporting dimensions like date, hour, and minute. It is usually used in conjunction with the [Popup](/material/smartui?comId=popup&appType=miniapp) component.

### Import

Introduce the component in `app.json` or `index.json`. For detailed introduction, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-datetime-picker": "@tuya-miniapp/smart-ui/lib/datetime-picker/index"
}
```

## Code Examples

### Select Full Time

`value` is a timestamp.

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

### Select Date (Year-Month-Day)

`value` is a timestamp. You can replace the internal date by passing in the `formatter-map` `v2.2.0` property.  
The `columns-order` `v2.2.0` property can set the order of columns; the higher the order of the column, the further it will be, similar to the CSS `flex order` property. This only changes the order from a styling perspective, not the logic.

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
      year: '{{year}} Year',
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
      day: '{{day}} Day'
    },
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
});
```

### Select Date (Year-Month)

`value` is a timestamp.

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

### Select Time

`value` is a string.

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

### Select Time - 12 Hour Mode `v2.6.0`

When setting `type: 'time'`, you can enable the `is-12-hour-clock` property to implement 12-hour selection mode; `am-text` and `pm-text` can set the text for AM and PM respectively.  
`font-styles` and `column-styles` contain a `12HourClock` key that can modify styles for the 12-hour time zone in `v2.6.0`.

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

### Disable Value Change Animation (v2.2.0)

Setting the `change-animation` `v2.2.0` property to `false` can disable the component update animation effect caused by changes in the `value` property.

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

### Option Filter

By passing in a `filter` function, you can filter the options array to implement a custom time interval.

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

### Style `2.3.7`

`active-style` can modify the style of the selected item; `column-styles` can set the style of each column; `font-styles` can set the text style of each column.

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
      year: "background: rgba(0, 0, 0, 0.4)",
    },
    fontStyles: {
      month: "color: blue;",
    },
    activeStyle: "color: red;"
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

| Parameter            | Description                                                                | Type                       | Default    |
| -------------------- | -------------------------------------------------------------------------- | -------------------------- | ---------- |
| cancel-button-text   | Cancel button text                                                          | _string_                   | `Cancel`   |
| confirm-button-text  | Confirm button text                                                         | _string_                   | `Confirm`  |
| filter               | Option filter function (`type` possible values are `year`, `month`, `day`, `hour`, `minute`) | _(type, values) => values_ | -          |
| item-height          | Option height                                                              | _number_                   | `44`       |
| loading              | Whether to show loading state                                              | _boolean_                  | `false`    |
| locale               | Set time unit                                                              | Locale                     |            |
| max-date             | Maximum selectable time, precise to the minute                             | _number_                   | Ten years later |
| max-hour             | Maximum selectable hour, for the `time` type                               | _number_                   | `23`        |
| max-minute           | Maximum selectable minute, for the `time` type                             | _number_                   | `59`       |
| min-date             | Minimum selectable time, precise to the minute                            | _number_                   | Ten years ago |
| min-hour             | Minimum selectable hour, for the `time` type                               | _number_                   | `0`        |
| min-minute           | Minimum selectable minute, for the `time` type                             | _number_                   | `0`        |
| show-toolbar         | Whether to display the top toolbar                                         | _boolean_                  | `true`     |
| title                | Top toolbar title                                                          | _string_                   | `''`       |
| type                 | Type, options are `date`, `time`, `year-month`<br><strong>dynamic modification not recommended</strong> | _string_                   | `datetime` |
| value                | Current selected value                                                     | _string \| number \| Date_ | -     |
| visible-item-count   | Number of visible options                                                  | _number_                   | `6`        |
| formatter-map `v2.2.0` | String replacement (`type` possible values are `year`, `month`, `day`, `hour`, `minute`) | _Record<type, string \| Record<string, string>>_ | -  |
| change-animation `v2.2.0` | Whether the component requires a transition animation when the value selected by data-driven changes (excluding the animation of finger interactive scrolling). | _boolean_  | `true`     |
| is-12-hour-clock `v2.6.0`  | When setting `type: 'time'`, this property can enable the 12-hour selection mode | _boolean_  | `false`     |
| am-text `v2.2.0`  | Text for AM in 12-hour selection mode                                         | _string_  | `AM`        |
| pm-text `v2.2.0`  | Text for PM in 12-hour selection mode                                         | _string_  | `PM`        |
| columns-order `v2.2.0`  | Set the order of columns, same as the `flex order` property, only changing the order from a styling perspective, not the logic | _string[]_  | `[]`     |
| animation-time `v2.3.7`  | Transition animation and the delay time for selection callback (Unit: ms)           | _number_  | `800` `v2.3.7` `300` `v2.6.0`     |
| columnStyles `v2.3.7`  | Style of any column          | _Record\<string, string>_  | -     |
| font-styles `v2.3.7`  | Font style of any column           | _Record\<string, string>_  | -     |
| active-style `v2.3.7`  | Selected Item Style           | _string_  | -     |

### Events

| Event Name       | Description                                    | Callback Parameters |
| ---------------- | ---------------------------------------------- | ------------------- |
| bind:cancel      | Event triggered when clicking the cancel button | -                   |
| bind:change      | Event triggered when the value changes          | Component instance  |
| bind:confirm     | Event triggered when clicking the confirm button | Current value       |
| bind:input       | Event triggered when the value changes          | Current value       |
| bind:animation-start `v2.3.2` | Component internal animation starts | -  |
| bind:animation-end `v2.3.2` | The internal animation of the component has ended. | -  |

### Change Event

In the `change` event, you can get the component instance to perform corresponding updates and other operations on the component:

| Function                        | Description                                   |
| ------------------------------- | --------------------------------------------- |
| getColumnValue(index)           | Get the value selected in the corresponding column |
| getColumnValues(index)          | Get all candidate values in the corresponding column |
| getValues()                     | Get the selected values in all columns, returning an array |
| setColumnValue(index, value)    | Set the value selected in the corresponding column |
| setColumnValues(index, values)  | Set all candidate values in the corresponding column |
| setValues(values)               | `values` is an array, set the selected values in all columns |

### External Style Classes

| Class Name       | Description          |
| ---------------- | --------------------- |
| active-class     | Selected item class   |
| column-class     | Column class          |
| toolbar-class    | Top toolbar class     |

### Locale Structure

| Attribute | Description    |
| --------- | -------------- |
| day       | Day unit       |
| hour      | Hour unit      |
| minute    | Minute unit    |
| month     | Month unit     |
| second    | Second unit    |
| year      | Year unit      |

### Style Variables

Please refer to the picker component documentation for style variable descriptions.