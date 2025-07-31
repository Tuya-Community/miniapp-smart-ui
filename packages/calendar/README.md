---
category: 数据录入
new: true
---

# Calendar 日历

> v2.0.0 开始加入

### 介绍

日历组件用于选择日期或日期区间。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-calendar": "@tuya-miniapp/smart-ui/lib/calendar/index"
}
```

## 代码演示

### 选择单个日期

下面演示了结合单元格来使用日历组件的用法，日期选择完成后会触发`select`事件。

```html
<smart-calendar
  title="日期选择"
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

### 自定义日期样式

使用 `dayClassMap` 属性可设置指定日期的样式,

```html
<smart-calendar
  title="日期选择"
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

在 `app.less` 文件中定义 css 类：

> 注意 css 类必须放在 app.less 文件中才可生效

```css
.calendar-disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

### 选择单个周范围

设置`type`为`week`后可以选择一个周的时间范围，此时`select`事件返回的 date 为数组结构，数组包含开始和结束选中的日期。

```html
<smart-calendar
  title="选择单个周范围"
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
      curWeekDayDate: [date[0], date[1]],
    });
  },
});
```

### 选择时间段

设置`type`为`range`后可以选择日期区间，此时`select`事件返回的 date 为数组结构，数组第一项为开始时间，第二项为结束时间。

```html
<smart-calendar
  title="选择时间段"
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

### 选择月份

设置`type`为`month`后可以选择月份，此时`select`事件返回的 date 为当月的第一天。


```html
<smart-calendar
  title="选择月份"
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

### 选择年份


设置`type`为`year`后可以选择年份，此时`select`事件返回的 date 为当年的第一天。


```html
<smart-calendar
  title="选择年份"
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


### 自定义颜色

通过`color`属性可以自定义日历的颜色，对选中日期和底部按钮生效。

```html
<smart-calendar color="#07c160" />
```

### 自定义日期范围

通过`min-date`和`max-date`定义日历的范围，需要注意的是`min-date`和`max-date`的区间不宜过大，否则会造成严重的性能问题。

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

### 自定义按钮文字

通过`confirm-text`设置按钮文字

```html
<smart-calendar
  type="range"
  confirm-text="完成"
/>
```

### 自定义弹出位置

通过`position`属性自定义弹出层的弹出位置，可选值为`top`、`left`、`right`。

```html
<smart-calendar show="{{ show }}" round="false" position="right" />
```

### 自定义周起始日

通过 `first-day-of-week` 属性设置一周从哪天开始。

```html
<smart-calendar first-day-of-week="{{ 1 }}" />
```

### 平铺展示

将`poppable`设置为`false`，日历会直接展示在页面内，而不是以弹层的形式出现。

```html
<smart-calendar
  title="日历"
  poppable="{{ false }}"
  show-confirm="{{ false }}"
  class="calendar"
/>
```

### 单元格样式自定义

通过 `dayClassMap` 属性，可设置指定日期的 class 类名

```html
<smart-calendar
  title="日历"
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

在 app.less 中定义 bottom-point css 类：

```css
.bottom-point {
  /* ... */
}
```


## API

### locale
默认配置为 en，配置参数参考下面的JSON
```js
{
  shortWeekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // 周名称
  subFormatter: 'YYYY-MM', // 副标题格式化，只允许YYYYMM
}
```

### Props

| 参数                    | 说明                                                                | 类型                               | 默认值              |
| ----------------------- | ------------------------------------------------------------------- | ---------------------------------- | ------------------- |
| color                   | 主题色，对底部按钮和选中日期生效                                    | _string_                           | `#ee0a24`           |
| confirm-text            | 确认按钮的文字                                                      | _string_                           | `确定`              |
| default-date `v1.10.21` | 默认选中的日期，`type`为`range`时为数组，传入 `null` 表示默认不选择 | _timestamp \| timestamp[] \| null_ | 今天                |
| first-day-of-week       | 设置周起始日                                                        | _0~6_                              | `0`                 |
| locale                  | 多语言包                                                            | _Object_                           | [默认配置](#locale) |
| max-date                | 可选择的最大日期                                                    | _timestamp_                        | 当前日期的六个月后  |
| min-date                | 可选择的最小日期                                                    | _timestamp_                        | 当前日期            |
| poppable                | 是否以弹层的形式展示日历                                            | _boolean_                          | `true`              |
| readonly `v1.9.1`       | 是否为只读状态，只读状态下不能选择日期                              | _boolean_                          | `false`             |
| row-height              | 日期行高                                                            | _number \| string_                 | `64`                |
| show-confirm   | 是否展示确认按钮   | _boolean_      | `true`      |
| show-subtitle   | 是否展示日历副标题（年月）      | _boolean_     | `true`     |
| show-title | 是否展示日历标题 | _boolean_ | `true` |
| title | 日历标题 | _string_ | `日期选择` |
| day-class-map `v2.1.0` | 日期单元格样式 | Object | null |
| type | 选择类型:<br>`single`表示选择单个日期，<br>`range`表示选择日期区间，<br>`week`表示选择周，<br>`month`表示选择月，<br>`year`表示选择年 | _string_ | `single` |
| headerIconColor | 头部栏左右箭头 icon 颜色 | _string_ | `rgba(0, 0, 0, 0.7)` |

### Range Props

当 Calendar 的 `type` 为 `range` 时，支持以下 props:

| 参数               | 说明                                          | 类型               | 默认值                   |
| ------------------ | --------------------------------------------- | ------------------ | ------------------------ |
| max-range `v2.3.9`         | 日期区间最多可选天数，默认无限制              | _number \| string_ | -                        |
| range-prompt `v2.3.9`       | 范围选择超过最多可选天数时的提示文案          | _string \| null_   | `Days selected over x days` |
| show-range-prompt `v2.3.9`  | 范围选择超过最多可选天数时，是否展示提示文案  | _boolean_          | `true`                   |
| allow-same-day `v2.3.9`     | 是否允许日期范围的起止时间为同一天            | _boolean_          | `false`                  |

### Poppable Props

当 Calendar 的 `poppable` 为 `true` 时，支持以下 props:

| 参数                   | 说明                                    | 类型      | 默认值   |
| ---------------------- | --------------------------------------- | --------- | -------- |
| close-on-click-overlay | 是否在点击遮罩层后关闭                  | _boolean_ | `true`   |
| position               | 弹出位置，可选值为 `top` `right` `left` | _string_  | `bottom` |
| round                  | 是否显示圆角弹窗                        | _boolean_ | `true`   |
| safe-area-inset-bottom | 是否开启底部安全区适配                  | _boolean_ | `true`   |
| show                   | 是否显示日历弹窗                        | _boolean_ | `false`  |

### Events

| 事件名                       | 说明                                                               | 回调参数                       |
| ---------------------------- | ------------------------------------------------------------------ | ------------------------------ |
| bind:click-subtitle `v1.8.1` | 点击日历副标题时触发                                               | _WechatMiniprogram.TouchEvent_ |
| bind:close                   | 关闭弹出层时触发                                                   | -                              |
| bind:closed                  | 关闭弹出层且动画结束后触发                                         | -                              |
| bind:confirm                 | 日期选择完成后触发，若`show-confirm`为`true`，则点击确认按钮后触发 | _value: Date \| Date[]_        |
| bind:open                    | 打开弹出层时触发                                                   | -                              |
| bind:opened                  | 打开弹出层且动画结束后触发                                         | -                              |
| bind:over-range              | 范围选择超过最多可选天数时触发                                     | -                              |
| bind:select                  | 点击任意日期时触发                                                 | _value: Date \| Date[]_        |
| bind:unselect                | 当 Calendar 的 `type` 为 `multiple` 时,点击已选中的日期时触发      | _value: Date_                  |

### 方法

通过 selectComponent 可以获取到 Calendar 实例并调用实例方法。

| 方法名 | 说明                   | 参数 | 返回值 |
| ------ | ---------------------- | ---- | ------ |
| reset  | 重置选中的日期到默认值 | -    | -      |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。
| 名称                                          | 默认值                                         | 描述                                   |
| --------------------------------------------- | ---------------------------------------------- | -------------------------------------- |
| --calendar-background-color                   | _var(--app-B6, #fff)_                          | 日历背景色                             |
| --calendar-popup-height `v2.5.0`                       | _848rpx_                                          | 日历弹窗高度                           |
| --calendar-header-box-shadow                  | _0 2px 10px rgba(125, 126, 128, 0.16)_          | 日历头部盒子阴影                       |
| --calendar-header-title-height                | _44px_                                         | 日历头部标题高度                       |
| --calendar-header-title-font-size             | _16px_                                         | 日历头部标题字体大小                   |
| --calendar-header-title-font-color            | _var(--app-B4-N1, rgba(0, 0, 0, 1))_           | 日历头部标题字体颜色                   |
| --calendar-header-subtitle-font-size          | _14px_                                         | 日历头部副标题字体大小                 |
| --calendar-weekdays-height                    | _30px_                                         | 星期栏高度                             |
| --calendar-weekdays-font-size                 | _12px_                                         | 星期字体大小                           |
| --calendar-weekdays-font-color                | _var(--app-B4-N1, rgba(0, 0, 0, 1))_           | 星期字体颜色                           |
| --calendar-month-title-font-size              | _14px_                                         | 月份标题字体大小                       |
| --calendar-month-mark-color                   | _fade(@gray-4, 60%)_                           | 月份标记颜色                           |
| --calendar-month-mark-font-size               | _160px_                                        | 月份标记字体大小                       |
| --calendar-day-height                         | _100rpx_                                       | 日期单元格高度                         |
| --calendar-cell-item-font-size                | _15px_                                         | 日期字体大小                           |
| --calendar-cell-item-width                    | _104rpx_                                       | 日历单元格项宽度                        |
| --calendar-cell-item-height                   | _104rpx_                                       | 日历单元格项高度                        |
| --calendar-cell-item-font-color               | _var(--app-B4-N1, rgba(0, 0, 0, 1))_           | 日历单元格项字体颜色                   |
| --calendar-cell-item-border-radius            | _104rpx_                                       | 日历单元格项圆角半径                   |
| --calendar-day-font-weight                    | _500_                                          | 日期字体字重                           |
| --calendar-day-select-border-radius           | _34rpx_                                        | 选中的单元格边框圆角                   |
| --calendar-range-edge-color                   | _#fff_                                         | 日期范围边缘颜色                       |
| --calendar-range-edge-background-color        | _#3678e3_                                      | 日期范围边缘背景色                     |
| --calendar-range-middle-color                 | _#fff_                                         | 日期范围中间颜色                       |
| --calendar-range-middle-background-opacity    | _0.1_                                          | 日期范围中间背景透明度                 |
| --calendar-selected-day-size                  | _34px_                                         | 选中日期大小                           |
| --calendar-selected-day-color                 | _#fff_                                         | 选中日期文字颜色                       |
| --calendar-info-font-size                     | _10px_                                         | 日历信息字体大小                       |
| --calendar-info-line-height                   | _14px_                                         | 日历信息行高                           |
| --calendar-selected-day-background-color      | _#3678e3_                                      | 选中日期背景颜色                       |
| --calendar-day-disabled-color                 | _#c8c9cc_                                      | 禁用日期颜色                           |
| --calendar-confirm-button-height              | _36px_                                         | 确认按钮高度                           |
| --calendar-confirm-button-margin              | _7px 0_                                        | 确认按钮边距                           |
| --calendar-confirm-button-line-height         | _34px_                                         | 确认按钮行高                           |
| --calendar-text-color                         | _#000_                                         | 日历文字颜色                           |
| --calendar-header-save-color                  | _#1989fa_                                      | 日历头部保存按钮颜色                   |
| --calendar-header-icon-bg-color               | _var(--app-B2-N9, rgba(0, 0, 0, 0.05))_        | 日历头部图标背景色                     |
| --calendar-header-icon-color               | _var(--app-B1-N2, rgba(0, 0, 0, 0.7))_        | 日历头部图标背景色                     |