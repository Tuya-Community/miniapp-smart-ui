---
category: Data Entry
---

# Slider

### Introduction

A slider input bar used for selecting a value within a given range.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, refer to [Getting Started](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-slider": "@tuya-miniapp/smart-ui/lib/normal-slider/index"
}
```

## Code Examples

### Basic Slider

> Note that the instanceId value is mandatory and must be a string that doesn't start with a digit. Each slider instance should have a different instanceId.

```html
<smart-slider
  instanceId="slider1"
  trackStyle="height:4px"
  barStyle="height:4px"
  value="{{currentValue}}"
  bind:end="onChange"
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

Setting the `step` attribute enables interval dragging mode.

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
  bind:end="onChange"
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

Set `hideThumbButton` to `true` to hide the slider thumb.

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
  bind:end="onChange"
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

### Wrap-around Slider

Set `parcel` to true to make the slider thumb enclosed within the slider track.

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
  bind:end="onChange"
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

### Custom Style Slider 1

You can customize slider track, bar, and thumb styles using `trackStyle`, `barStyle`, and `thumbStyle`.

```html
<smart-slider
  instanceId="slider5"
  trackStyle="height:45px;border-radius:8px;"
  barStyle="height:45px;border-radius:8px;"
  thumbStyle="width:15px;height:50px;background:#BBC5D4;border:2px solid #FFFFFF;box-shadow:0px 0px 2px 0px rgba(0, 0, 0, 0.5);border-radius:2px;"
  value="{{currentValue}}"
  bind:end="onChange"
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

### Custom Style Slider 2

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
  bind:end="onChange"
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

### Dual Slider

Slider with two thumbs requires:

```json
"usingComponents": {
  "smart-range-slider": "@tuya-miniapp/smart-ui/lib/slider/index"
}
```

Add the `range` attribute to enable dual thumb mode. Make sure the value is an array.

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

## API

### Props

| Parameter                        | Description                                     | Type        | Default  |
| -------------------------------- | ----------------------------------------------- | ----------- | -------- |
| active-step-style                | Active step style                               | _string_    | null     |
| bar-style                        | Bar style                                       | _string_    | null     |
| class-name                       | CSS class name                                  | _string_    | null     |
| direction                        | Slider direction ("horizontal"                  | "vertical") | _string_ | null |
| disable                          | Whether to disable the slider                   | _boolean_   | false    |
| enable-touch                     | Whether to enable touch jump                    | _boolean_   | true     |
| enable-touch-bar                 | Whether to enable bar touch offset              | _boolean_   | false    |
| hidden                           | Whether to hide the component                   | _boolean_   | null     |
| hide-bar-on-first-render         | Whether to hide the bar on first render         | _boolean_   | false    |
| hide-thumb                       | Whether to hide the thumb                       | _boolean_   | false    |
| hide-thumb-button                | Whether to hide the thumb button                | _boolean_   | false    |
| hot-area-style                   | Clickable area style                            | _string_    | null     |
| instance-id                      | Unique ID                                       | _string_    | null     |
| max                              | Maximum value                                   | _number_    | 100      |
| min                              | Minimum value                                   | _number_    | 0        |
| parcel                           | Whether to enable parcel mode                   | _boolean_   | false    |
| parcel-margin                    | Margin in parcel mode                           | _number_    | 0        |
| parcel-thumb-height              | Thumb height in parcel mode                     | _number_    | null     |
| parcel-thumb-width               | Thumb width in parcel mode                      | _number_    | null     |
| reverse                          | Reverse the slider                              | _boolean_   | false    |
| show-steps                       | Whether to show step indicators                 | _boolean_   | false    |
| show-text                        | Whether to display text on the bar              | _boolean_   | null     |
| step                             | Step value                                      | _number_    | 1        |
| step-style                       | Step style                                      | _string_    | null     |
| text-style                       | Text style                                      | _string_    | null     |
| text-template                    | Text format template, e.g., "Ratio {{text}} %"  | _string_    | null     |
| thumb-height                     | Thumb height                                    | _number_    | null     |
| thumb-style                      | Thumb style                                     | _string_    | null     |
| thumb-style-calc                 | Dynamic thumb style calculation                 | _null_      | null     |
| thumb-style-render-formatter     | Custom thumb style renderer formatter           | _null_      | null     |
| thumb-style-render-value-reverse | Whether to reverse thumb style rendering value  | _boolean_   | false    |
| thumb-style-render-value-scale   | Custom thumb style rendering scale              | _number_    | 1        |
| thumb-style-render-value-start   | Custom thumb style rendering start value        | _number_    | 1        |
| thumb-width                      | Thumb width                                     | _number_    | null     |
| thumb-wrap-style                 | Thumb wrap style                                | _null_      | null     |
| track-style                      | Track style                                     | _string_    | null     |
| value                            | Initial value for the right thumb/single slider | _number_    | 0        |

### Slot

| Name  | Description     |
| ----- | -------- |
| bar `v.2.4.0` | Slider slot |
| thumb `v.2.4.0` | Thumb slot |

### Events

| Event Name  | Description                  | Parameter                            |
| ----------- | ---------------------------- | ------------------------------------ |
| bind:change | Triggered after value change | event.detail.value: Current progress |
| bind:end    | Triggered on drag release    | event.detail.value: Current progress |
| bind:start  | Triggered before dragging    | event.detail.value: Current progress |

## Dual Slider API

### Dual Slider Props

| Parameter         | Description                                                   | Type                 | Default   |
| ----------------- | ------------------------------------------------------------- | -------------------- | --------- |
| active-color      | Active state color of the progress bar                        | _string_             | `#1989fa` |
| bar-height        | Height of the progress bar, default in `px`                   | _string \| number_   | `2px`     |
| disabled          | Whether to disable the slider                                 | _boolean_            | `false`   |
| inactive-color    | Default color of the progress bar                             | _string_             | `#e5e5e5` |
| max               | Maximum value                                                 | _number_             | `100`     |
| min               | Minimum value                                                 | _number_             | `0`       |
| range `v1.8.4`    | Whether to enable dual slider mode                            | _boolean_            | `false`   |
| step              | Step length                                                   | _number_             | `1`       |
| use-button-slot   | Whether to use button slot                                    | _boolean_            | `false`   |
| value             | Current progress percentage, array format in dual slider mode | _number \| number[]_ | `0`       |
| vertical `v1.8.5` | Whether to display vertically                                 | _boolean_            | `false`   |

### Dual Slider Events

| Event Name      | Description                              | Parameter                            |
| --------------- | ---------------------------------------- | ------------------------------------ |
| bind:change     | Triggered after progress value changes   | event.detail: Current progress       |
| bind:drag       | Triggered when dragging the progress bar | event.detail.value: Current progress |
| bind:drag-end   | Triggered when dragging ends             | -                                    |
| bind:drag-start | Triggered when dragging starts           | -                                    |

### Dual Slider External Style Classes

| Class Name   | Description           |
| ------------ | --------------------- |
| custom-class | Root node style class |

### Dual Slider Slots

| Name                  | Description                                      | Parameter           |
| --------------------- | ------------------------------------------------ | ------------------- |
| button                | Custom slider button                             | _{ value: number }_ |
| left-button `v1.8.4`  | Custom left slider button (in dual slider mode)  | _{ value: number }_ |
| right-button `v1.8.4` | Custom right slider button (in dual slider mode) | _{ value: number }_ |

### Style Variables

Dual Slider Style Variables  
  
The component provides the following CSS variables that can be used for custom styling. Refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp) for usage instructions.

| Name                          | Default Value                           | Description              |
| ----------------------------- | ---------------------------------------- | ------------------------ |
| --slider-active-background-color  | _#1989fa_                               | Active state background color |
| --slider-inactive-background-color| _#ebedf0_                               | Inactive state background color |
| --slider-disabled-opacity         | _0.3_                                   | Disabled state opacity        |
| --slider-bar-height               | _2px_                                   | Slider bar height             |
| --slider-button-width             | _24px_                                  | Slider button width           |
| --slider-button-height            | _24px_                                  | Slider button height          |
| --slider-button-border-radius     | _50%_                                   | Slider button border radius   |
| --slider-button-background-color  | _#fff_                                  | Slider button background color|
| --slider-button-box-shadow        | _0 1px 2px rgba(0, 0, 0, 0.5)_          | Slider button box shadow      |
| --slider-thumb-color              | _var(--app-B3, #ffffff)_                | Slider thumb color            |