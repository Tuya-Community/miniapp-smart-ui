---
category: Data Entry
new: true
---

# Calendar

> Added since v2.0.0

### Introduction

The calendar component is used to select dates or date ranges.

### Import

Introduce the component in `app.json` or `index.json`. For details, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-calendar": "@tuya-miniapp/smart-ui/lib/calendar/index"
}
```

## Code Demonstration

### Selecting a Single Date

The following demonstrates the usage of the calendar component with a cell. After the date selection is completed, the `select` event will be triggered.

```html
<smart-calendar
  title="Date Selection"
  min-date="{{ minDayDate }}"
  max-date="{{ maxDayDate }}"
  default-date="{{ curDayDate }}"
  bind:select="setCurDay"
/>
```

```js
Page({
  data: {
    curDayDate: new Date(2024, 0, 15).getTime(),
    minDayDate: new Date(2024, 0, 4).getTime(),
    maxDayDate: new Date(2024, 1, 20).getTime(),
  },

  setCurDay(event) {
    const date = event.detail;
    this.setData({
      curDayDate: new Date(date).getTime(),
    });
  },
});
```

### Custom Date Style

Use the `dayClassMap` property to set styles for specific dates.

```html
<smart-calendar
  title="Date Selection"
  min-date="{{ minDayDate }}"
  max-date="{{ maxDayDate }}"
  default-date="{{ curDayDate }}"
  bind:select="setCurDay"
  day-class-map="{{dayClassMap}}"
/>
```

```js
Page({
  data: {
    curDayDate: new Date(2024, 0, 15).getTime(),
    minDayDate: new Date(2024, 0, 4).getTime(),
    maxDayDate: new Date(2024, 1, 20).getTime(),
    dayClassMap: {
      '2024-01-17': "calendar-disabled"
    }
  },

  setCurDay(event) {
    const date = event.detail;
    this.setData({
      curDayDate: new Date(date).getTime(),
    });
  },
});
```

Define the CSS class in the `app.less` file:

> Note: The CSS class must be placed in the app.less file to take effect.

```css
.calendar-disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

### Selecting a Single Week Range

Set `type` to `week` to select a week's time range. At this time, the `select` event returns the date in array structure, and the array contains the start and end selected dates.

```html
<smart-calendar
  title="Select Single Week Range"
  type="week"
  min-date="{{ minWeekDayDate }}"
  max-date="{{ maxWeekDayDate }}"
  default-date="{{ curWeekDayDate }}"
  bind:select="setWeekCurDay"
/>
```

```js
Page({
  data: {
    minWeekDayDate: new Date(2024, 0, 4).getTime(),
    maxWeekDayDate: new Date(2024, 1, 20).getTime(),
    curWeekDayDate: [
      new Date(2024, 0, 15).getTime(),
      new Date(2024, 0, 21).getTime(),
    ],
  },

  setWeekCurDay(event) {
    const date = event.detail;
    this.setData({
      curWeekDayDate: [date[0]?.getTime(), date[1]?.getTime()],
    });
  },
});
```

### Selecting a Date Range

Set `type` to `range` to select a date range. At this time, the `select` event returns the date in array structure, with the first item being the start date and the second item being the end date.

```html
<smart-calendar
  title="Select Date Range"
  type="range"
  default-date="{{ curRangeDayDate }}"
  min-date="{{ minRangeDayDate }}"
  max-date="{{ maxRangeDayDate }}"
  bind:select="setRangeCurDay"
/>
```

```js
Page({
  data: {
    curRangeDayDate: [
      new Date(2024, 0, 10).getTime(),
      new Date(2024, 0, 20).getTime(),
    ],
    minRangeDayDate: new Date(2024, 0, 4).getTime(),
    maxRangeDayDate: new Date(2024, 1, 20).getTime(),
  },

  setRangeCurDay(event) {
    const date = event.detail;
    this.setData({
      curRangeDayDate: [date[0]?.getTime(), date[1]?.getTime()],
    });
  },
});
```

### Selecting a Month

Set `type` to `month` to select the month. At this time, the `select` event returns the date of the first day of the month.

```html
<smart-calendar
  title="Select Month"
  type="month"
  min-date="{{ minMonthDate }}"
  max-date="{{ maxMonthDate }}"
  default-date="{{ curMonthDate }}"
  bind:select="setCurMonth"
/>
```

```js
Page({
  data: {
    curMonthDate: new Date(2024, 6, 1).getTime(),
    minMonthDate: new Date(2024, 2, 1).getTime(),
    maxMonthDate: new Date(2025, 9, 31).getTime(),
  },
  setCurMonth(event) {
    const date = event.detail;
    this.setData({
      curMonthDate: date.getTime(),
    });
  },
});
```

### Selecting a Year

Set `type` to `year` to select the year. At this time, the `select` event returns the date of the first day of the year.

```html
<smart-calendar
  title="Select Year"
  type="year"
  default-date="{{ curYearDate }}"
  min-date="{{ minYearDate }}"
  max-date="{{ maxYearDate }}"
  bind:select="setCurYear"
/>
```

```js
Page({
  data: {
    curYearDate: new Date(2017, 6, 1).getTime(),
    minYearDate: new Date(2012, 0, 1).getTime(),
    maxYearDate: new Date(2029, 10, 31).getTime(),
  },
  setCurYear(event) {
    const date = event.detail;
    this.setData({
      curYearDate: date.getTime(),
    });
  },
});
```

### Custom Colors

Use the `color` property to customize the color of the calendar, which affects the selected date and the bottom button.

```html
<smart-calendar color="#07c160" />
```

### Custom Date Range

Define the range of the calendar through `min-date` and `max-date`. Note that the interval between `min-date` and `max-date` should not be too large, otherwise it will cause severe performance issues.

```html
<smart-calendar
  min-date="{{ minDate }}"
  max-date="{{ maxDate }}"
/>
```

```js
Page({
  data: {
    minDate: new Date(2010, 0, 1).getTime(),
    maxDate: new Date(2010, 0, 31).getTime(),
  },
});
```

### Custom Button Text

Set the button text through `confirm-text`.

```html
<smart-calendar
  type="range"
  confirm-text="Done"
/>
```

### Custom Popup Position

Customize the popup position through the `position` property. The optional values are `top`, `left`, `right`.

```html
<smart-calendar show="{{ show }}" round="false" position="right" />
```

### Custom Start Day of the Week

Set which day of the week to start through the `first-day-of-week` property.

```html
<smart-calendar first-day-of-week="{{ 1 }}" />
```

### Flat Display

Set `poppable` to `false`, and the calendar will be displayed directly on the page instead of appearing as a popup.

```html
<smart-calendar
  title="Calendar"
  poppable="{{ false }}"
  show-confirm="{{ false }}"
  class="calendar"
/>
```

### Custom Cell Style

Use the `dayClassMap` property to set class names for specified dates.

```html
<smart-calendar
  title="Calendar"
  poppable="{{ false }}"
  show-confirm="{{ false }}"
  day-class-map="{{ dayClassMap }}"
/>
```

```js
Page({
  data: {
    dayClassMap: {
      '2024-11-20': 'bottom-point'
    }
  },
});
```

Define the `bottom-point` CSS class in `app.less`:

```css
.bottom-point {
  /* ... */
}
```

## API

### locale
The default configuration is `en`. For configuration parameters, please refer to the following JSON.
```js
{
  shortWeekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // Weekdays
  subFormatter: 'YYYY-MM', // Subtitle formatting, only allows YYYYMM
}
```

### Props

| Parameter               | Description                                                                                         | Type                                | Default Value        |
| ----------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------- |
| color                   | Theme color, takes effect on the bottom button and selected date                                    | _string_                            | `#ee0a24`            |
| confirm-text            | Text of the confirmation button                                                                     | _string_                            | `Confirm`            |
| default-date `v1.10.21` | Default selected date, when `type` is `range`, it is an array; passing `null` means no default selection | _timestamp \| timestamp[] \| null_  | Today                |
| first-day-of-week       | Set the starting day of the week                                                                    | _0~6_                               | `0`                  |
| locale                  | Locale package                                                                                      | _Object_                            | [Default Configuration](#locale) |
| max-date                | Maximum selectable date                                                                             | _timestamp_                         | Six months from current date |
| min-date                | Minimum selectable date                                                                             | _timestamp_                         | Current date          |
| poppable                | Show the calendar as a popup                                                                        | _boolean_                           | `true`               |
| readonly `v1.9.1`       | Readonly state, dates cannot be selected in readonly state                                          | _boolean_                           | `false`              |
| row-height              | Date row height                                                                                     | _number \| string_                  | `64`                 |
| show-confirm            | Show the confirmation button                                                                        | _boolean_                           | `true`               |
| show-subtitle           | Show calendar subtitle (year and month)                                                             | _boolean_                           | `true`               |
| show-title              | Show calendar title                                                                                 | _boolean_                           | `true`               |
| title                   | Calendar title                                                                                      | _string_                            | `Date Selection`     |
| day-class-map `v2.1.0`    | Date cell style                                                                                     | Object                              | null                 |
| type                    | Selection type: <br>`single` for single date selection, <br>`range` for date range selection, <br>`week` for week selection, <br>`month` for month selection, <br>`year` for year selection | _string_ | `single` |
| headerIconColor | Header bar left and right arrow icon color | _string_ | `rgba(0, 0, 0, 0.7)` |

### Range Props

When the type of Calendar is set to `range`, the following props are supported:

| Parameter               | Description                                          | Type               | Default Value                   |
| ------------------ | --------------------------------------------- | ------------------ | ------------------------ |
| max-range `v2.3.9`         | The maximum number of days selectable in the date range. By default, there is no limit.              | _number \| string_ | -                        |
| range-prompt `v2.3.9`       | The prompt text when the range selection exceeds the maximum number of selectable days          | _string \| null_   | `Days selected over x days` |
| show-range-prompt `v2.3.9`  | Whether to display the prompt text when the range selection exceeds the maximum number of selectable days  | _boolean_          | `true`                   |
| allow-same-day `v2.3.9`     | Whether to allow the start and end time of the date range to be the same day            | _boolean_          | `false`                  |

### Poppable Props

When the `poppable` of Calendar is `true`, the following props are supported:

| Parameter                | Description                       | Type      | Default Value |
| ------------------------ | --------------------------------- | --------- | ------------- |
| close-on-click-overlay   | Close when clicking the overlay   | _boolean_ | `true`       |
| position                 | Popup position, optional values are `top`, `right`, `left` | _string_  | `bottom`     |
| round                    | Show rounded popup                | _boolean_ | `true`       |
| safe-area-inset-bottom   | Enable bottom safe area adaptation | _boolean_ | `true`       |
| show                     | Show the calendar popup           | _boolean_ | `false`      |

### Events

| Event Name                  | Description                                                     | Callback Parameter            |
| --------------------------- | --------------------------------------------------------------- | ----------------------------- |
| bind:click-subtitle `v1.8.1`| Triggered when the calendar subtitle is clicked                 | _WechatMiniprogram.TouchEvent_ |
| bind:close                  | Triggered when the popup layer is closed                        | -                             |
| bind:closed                 | Triggered after the popup layer is closed and the animation ends| -                             |
| bind:confirm                | Triggered after date selection is completed; if `show-confirm` is `true`, it is triggered after clicking the confirm button | _value: Date \| Date[]_  |
| bind:open                   | Triggered when the popup layer is opened                        | -                             |
| bind:opened                 | Triggered after the popup layer is opened and the animation ends | -                             |
| bind:over-range             | Triggered when the range selection exceeds the maximum selectable days | -                             |
| bind:select                 | Triggered when any date is clicked                              | _value: Date \| Date[]_        |
| bind:unselect               | Triggered when clicking a selected date if the `type` of Calendar is `multiple` | _value: Date_                  |

### Methods

You can get the Calendar instance via selectComponent and call instance methods.

| Method Name | Description                        | Parameter | Return Value |
| ------------| ---------------------------------- | ----------| -------------|
| reset       | Reset the selected date to the default value | -         | -            |

### Style Variables

The component provides the following CSS variables for custom styles. For usage, please refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).  

| Name                                            | Default Value                                  | Description                           |
| ----------------------------------------------- | ---------------------------------------------- | ------------------------------------- |
| --calendar-background-color                     | _var(--app-B6, #fff)_                          | Calendar background color             |
| --calendar-popup-height `v2.5.0`                        | _848rpx_                                          | Calendar popup height                 |
| --calendar-header-box-shadow                    | _0 2px 10px rgba(125, 126, 128, 0.16)_         | Calendar header box shadow            |
| --calendar-header-title-height                  | _44px_                                         | Calendar header title height          |
| --calendar-header-title-font-size               | _16px_                                         | Calendar header title font size       |
| --calendar-header-title-font-color              | _var(--app-B4-N1, rgba(0, 0, 0, 1))_           | Calendar header title font color      |
| --calendar-header-subtitle-font-size            | _14px_                                         | Calendar header subtitle font size    |
| --calendar-weekdays-height                      | _30px_                                         | Weekdays bar height                   |
| --calendar-weekdays-font-size                   | _12px_                                         | Weekdays font size                    |
| --calendar-weekdays-font-color                  | _var(--app-B4-N1, rgba(0, 0, 0, 1))_           | Weekdays font color                   |
| --calendar-month-title-font-size                | _14px_                                         | Month title font size                 |
| --calendar-month-mark-color                     | _fade(@gray-4, 60%)_                           | Month mark color                      |
| --calendar-month-mark-font-size                 | _160px_                                        | Month mark font size                  |
| --calendar-day-height                           | _100rpx_                                       | Day cell height                       |
| --calendar-cell-item-font-size                  | _15px_                                         | Day font size                         |
| --calendar-cell-item-width                      | _104rpx_                                       | Calendar cell item width              |
| --calendar-cell-item-height                     | _104rpx_                                       | Calendar cell item height             |
| --calendar-cell-item-font-color                 | _var(--app-B4-N1, rgba(0, 0, 0, 1))_           | Calendar cell item font color         |
| --calendar-cell-item-border-radius              | _104rpx_                                       | Calendar cell item border radius      |
| --calendar-day-font-weight                      | _500_                                          | Day font weight                       |
| --calendar-day-select-border-radius             | _34rpx_                                        | Selected day border radius            |
| --calendar-range-edge-color                     | _#fff_                                         | Date range edge color                 |
| --calendar-range-edge-background-color          | _#3678e3_                                      | Date range edge background color      |
| --calendar-range-middle-color                   | _#fff_                                         | Date range middle color               |
| --calendar-range-middle-background-opacity      | _0.1_                                          | Date range middle background opacity  |
| --calendar-selected-day-size                    | _34px_                                         | Selected day size                     |
| --calendar-selected-day-color                   | _#fff_                                         | Selected day text color               |
| --calendar-info-font-size                       | _10px_                                         | Calendar info font size               |
| --calendar-info-line-height                     | _14px_                                         | Calendar info line height             |
| --calendar-selected-day-background-color        | _#3678e3_                                      | Selected day background color         |
| --calendar-day-disabled-color                   | _#c8c9cc_                                      | Disabled day color                    |
| --calendar-confirm-button-height                | _36px_                                         | Confirm button height                 |
| --calendar-confirm-button-margin                | _7px 0_                                        | Confirm button margin                 |
| --calendar-confirm-button-line-height           | _34px_                                         | Confirm button line height            |
| --calendar-text-color                           | _#000_                                         | Calendar text color                   |
| --calendar-header-save-color                    | _#1989fa_                                      | Calendar header save button color     |
| --calendar-header-icon-bg-color                 | _var(--app-B2-N9, rgba(0, 0, 0, 0.05))_        | Calendar header icon background color |
| --calendar-header-icon-color               | _var(--app-B1-N2, rgba(0, 0, 0, 0.7))_        | Calendar header icon background color                     |