---
category: Feedback
---

# CountDown

### Introduction

Used to display countdown values in real time, supporting millisecond precision.

### Import

Introduce the component in `app.json` or `index.json`, detailed explanation can be found in [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-count-down": "@tuya-miniapp/smart-ui/lib/count-down/index"
}
```

## Code Demonstration

### Basic Usage

The `time` attribute represents the total duration of the countdown, in milliseconds.

```html
<smart-count-down time="{{ time }}" />
```

```js
Page({
  data: {
    time: 30 * 60 * 60 * 1000,
  },
});
```

### Custom Format

Set the content of the countdown text through the `format` attribute.

```html
<smart-count-down time="{{ time }}" format="DD day HH hour mm minute ss seconds" />
```

### Millisecond Rendering

The countdown renders once per second by default, setting the `millisecond` attribute can enable millisecond-level rendering.

```html
<smart-count-down millisecond time="{{ time }}" format="HH:mm:ss:SSS" />
```

### Custom Style

After setting the `use-slot` attribute, you can customize the countdown style. You need to get the `timeData` object through the `bind:change` event and render it yourself, format see the table below.

```html
<smart-count-down use-slot time="{{ time }}" bind:change="onChange">
  <text class="item">{{ timeData.hours }}</text>
  <text class="item">{{ timeData.minutes }}</text>
  <text class="item">{{ timeData.seconds }}</text>
</smart-count-down>
```

```js
Page({
  data: {
    time: 30 * 60 * 60 * 1000,
    timeData: {},
  },

  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
});
```

```css
.item {
  display: inline-block;
  width: 22px;
  margin-right: 5px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #1989fa;
  border-radius: 2px;
}
```

### Manual Control

After obtaining the component instance through the `selectComponent` selector, you can call the `start`, `pause`, and `reset` methods.

```html
<smart-count-down
  class="control-count-down"
  millisecond
  time="{{ 3000 }}"
  auto-start="{{ false }}"
  format="ss:SSS"
  bind:finish="finished"
/>

<smart-grid clickable column-num="3">
  <smart-grid-item text="Start" icon="play-circle-o" bindclick="start" />
  <smart-grid-item text="Pause" icon="pause-circle-o" bindclick="pause" />
  <smart-grid-item text="Reset" icon="replay" bindclick="reset" />
</smart-grid>
```

```js
Page({
  start() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.start();
  },

  pause() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.pause();
  },

  reset() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.reset();
  },

  finished() {
    Toast('Countdown finished');
  },
});
```

## API

### Props

| Parameter   | Description                                  | Type      | Default     |
| ----------- | -------------------------------------------- | --------- | ----------- |
| auto-start  | Whether to automatically start the countdown | _boolean_ | `true`      |
| format      | Time format. DD-Day, HH-Hour, mm-Minute, ss-Second, SSS-Millisecond | _string_   | `HH:mm:ss`  |
| millisecond | Whether to enable millisecond-level rendering | _boolean_ | `false`     |
| time        | Duration of the countdown in milliseconds    | _number_  | -           |
| use-slot    | Whether to use custom style slot             | _boolean_ | `false`     |

### Events

| Event Name  | Description                                 | Callback Params |
| ----------- | ------------------------------------------- | --------------- |
| bind:change | Triggered when the time changes. Only triggers after `use-slot` is enabled | timeData        |
| bind:finish | Triggered when the countdown ends           | -               |

### timeData Format

| Name         | Description  | Type     |
| ------------ | ------------ | -------- |
| days         | Remaining days     | _number_ |
| hours        | Remaining hours    | _number_ |
| milliseconds | Remaining milliseconds | _number_ |
| minutes      | Remaining minutes  | _number_ |
| seconds      | Remaining seconds  | _number_ |

### Methods

You can get the CountDown instance through [selectComponent](/material/smartui?comId=faq&appType=miniapp) and call instance methods.

| Method Name | Parameter | Return Value | Description                                          |
| ----------- | --------- | ------------ | ---------------------------------------------------- |
| pause       | -         | -            | Pause the countdown                                  |
| reset       | -         | -            | Reset the countdown. If `auto-start` is `true`, it will automatically start the countdown after resetting |
| start       | -         | -            | Start the countdown                                  |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                             | Description |
| ----------------------------- | ----------------------------------------- | ----------- |
| --count-down-text-color | _var(--app-B6-N2, rgba(0, 0, 0, 0.7))_ | Text Color |
| --count-down-font-size | _14px_ | Font Size |
| --count-down-line-height | _20px_ | Line Height |