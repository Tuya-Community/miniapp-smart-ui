---
category: Data Entry
---

# Slider

### Introduction

A sliding input bar used for selecting a value within a given range.

### Import

Introduce the component in `app.json` or `index.json`. For detailed information, see [Getting Started](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-slider": "@tuya-miniapp/smart-ui/lib/normal-slider/index"
}
```

## Code Demonstrations

### Basic Slider

> Note: The instanceId value is mandatory and should be a string value that does not start with a number. Each slider instance should have a different instanceId.

```html
<smart-slider
  instanceId="slider1"
  trackStyle="height:4px"
  barStyle="height:4px"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### Interval Slider

Set the `step` attribute to enable interval drag mode.

```html
<smart-slider
  instanceId="slider2"
  trackStyle="height:8px"
  barStyle="height:8px"
  thumbStyle="width:18px;height:18px;"
  stepStyle="width:4px;height:4px;"
  activeStepStyle="background:#fff;"
  showSteps="{{true}}"
  step="{{10}}"
  min="{{0}}"
  max="{{100}}"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### Interval Slider with Hidden Thumb

Set `hideThumbButton` to `true` to hide the slide thumb.

```html
<smart-slider
  instanceId="slider3"
  trackStyle="height:40px;border-radius:16px;"
  barStyle="height:40px;border-radius:16px;"
  thumbStyle="width:18px;height:18px;"
  stepStyle="width:4px;height:12px;border-radius:4px;"
  activeStepStyle="width:4px;height:12px;border-radius:4px;background:#fff;"
  hideThumbButton="{{true}}"
  showSteps="{{true}}"
  step="{{30}}"
  min="{{0}}"
  max="{{90}}"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### Draggable Slider

Set `parcel` to `true` to allow the slider thumb to be enclosed within the slider track.

```html
<smart-slider
  instanceId="slider4"
  parcel="{{true}}"
  parcelMargin="{{2}}"
  trackStyle="height:26px;border-radius:13px;"
  barStyle="height:22px;border-radius:13px;"
  thumbStyle="width:20px;height:20px;background:#fff;border-radius:50%;"
  parcelThumbWidth="{{18}}"
  parcelThumbHeight="{{18}}"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### Draggable Slider with Custom Style 1

You can customize the style of the slider track, bar, and thumb using `trackStyle`, `barStyle`, and `thumbStyle`.

```html
<smart-slider
  instanceId="slider5"
  trackStyle="height:45px;border-radius:8px;"
  barStyle="height:45px;border-radius:8px;"
  thumbStyle="width:15px;height:50px;background:#BBC5D4;border:2px solid #FFFFFF;box-shadow:0px 0px 2px 0px rgba(0, 0, 0, 0.5);border-radius:2px;"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### Draggable Slider with Custom Style 2

```html
<smart-slider
  instanceId="slider6"
  parcel="{{true}}"
  parcelMargin="{{2}}"
  trackStyle="height:26px;border-radius:5px;"
  barStyle="height:22px;border-radius:5px;"
  parcelThumbWidth="{{3}}"
  parcelThumbHeight="{{16}}"
  thumbStyle="width:5px;height:16px;background:#fff;"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### Dual Thumb Slider

A slider with two thumbs requires:

```json
"usingComponents": {
  "smart-range-slider": "@tuya-miniapp/smart-ui/lib/slider/index"
}
```

```html
<smart-range-slider
  min="{{0}}"
  max="{{100}}"
  value="{{range}}"
  bind:change="onRangeChange"
  bar-height="4px"
  inactive-color="#D8D9DC"
  active-color="#007AFF"
/>
```

```js
Page({
  data: {
    range: [10, 40],
  },
  onRangeChange(event) {
    this.setData({
      range: event.detail,
    });
  },
});
```


### Vertical

```html
<smart-slider
  instanceId="slider7"
  direction="vertical"
  reverse
  step="{{5}}"
  min="{{0}}"
  max="{{100}}"
  parcel
  parcelMargin="{{2}}"
  useParcelPadding="{{false}}"
  parcelThumbWidth="{{12}}"
  parcelThumbHeight="{{2}}"
  thumbStyle="width: 12px;height:2px;border-radius:2px;background: #FFFFFF;"
  trackStyle="width:48px;height:203px;border-radius:10px;background:rgba(0, 0, 0, 0.08);"
  barStyle="width:48px;height:114px;background:#1989FA;"
/>
```

## API

### Props

| Parameter                        | Description                             | Type         | Default   |
| -------------------------------- | --------------------------------------- | ------------ | --------- |
| active-step-style                | Active step style                       | _string_     | null      |
| bar-style                        | Bar style                               | _string_     | null      |
| class-name                       | CSS class name                          | _string_     | null      |
| direction                        | Slider direction ("horizontal"          | "vertical")  | _string_  | null |
| disable                          | Disable slider                          | _boolean_    | false     |
| enable-touch                     | Enable touch stepping                   | _boolean_    | true      |
| enable-touch-bar                 | Enable touch bar offsetting             | _boolean_    | false     |
| hidden                           | Hide component                          | _boolean_    | null      |
| hide-bar-on-first-render         | Hide bar on first render                | _boolean_    | false     |
| hide-thumb                       | Hide thumb                              | _boolean_    | false     |
| hide-thumb-button                | Hide thumb button                       | _boolean_    | false     |
| hot-area-style                   | Hot area style                          | _string_     | null      |
| instance-id                      | Unique ID                               | _string_     | null      |
| max                              | Maximum value                           | _number_     | 100       |
| min                              | Minimum value                           | _number_     | 0         |
| parcel                           | Enable parcel mode                      | _boolean_    | false     |
| parcel-margin                    | Parcel mode thumb margin                | _number_     | 0         |
| parcel-thumb-height              | Parcel mode thumb height                | _number_     | null      |
| parcel-thumb-width               | Parcel mode thumb width                 | _number_     | null      |
| reverse                          | Reverse slider                          | _boolean_    | false     |
| show-steps                       | Show step indicators                    | _boolean_    | false     |
| show-text                        | Show text on bar                        | _boolean_    | null      |
| step                             | Step value                              | _number_     | 1         |
| step-style                       | Step style                              | _string_     | null      |
| text-style                       | Text style                              | _string_     | null      |
| text-template                    | Text formatting template, e.g., "Rate {{text}} %" | _string_ | null  |
| thumb-height                     | Thumb height                            | _number_     | null      |
| thumb-style                      | Thumb style                             | _string_     | null      |
| thumb-style-calc                 | Dynamic thumb style calculation         | _null_       | null      |
| thumb-style-render-formatter     | Custom thumb style render formatter     | _null_       | null      |
| thumb-style-render-value-reverse | Reverse thumb style render value        | _boolean_    | false     |
| thumb-style-render-value-scale   | Custom thumb style render value scale   | _number_     | 1         |
| thumb-style-render-value-start   | Custom thumb style render start value   | _number_     | 1         |
| thumb-width                      | Thumb width                             | _number_     | null      |
| thumb-wrap-style                 | Thumb wrap style                        | _null_       | null      |
| track-style                      | Track style                             | _string_     | null      |
| value                            | Initial value for right thumb/slider    | _number_     | 0         |

### Slot

| Name  | Description     |
| ----- | -------- |
| bar | Slider slot |
| thumb | Thumb slot |

### Events

| Event Name   | Description                  | Parameters                    |
| ------------ | ---------------------------- | ----------------------------- |
| bind:change  | Triggered on value change    | event.detail.value: current progress |
| bind:end     | Triggered on drag end        | event.detail.value: current progress |
| bind:start   | Triggered before dragging    | event.detail.value: current progress |