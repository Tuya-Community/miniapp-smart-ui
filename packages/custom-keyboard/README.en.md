---
category: Data Entry
---

# CustomKeyboard

### Introduction

Custom numeric keypad

### Import

Import the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-custom-keyboard": "@tuya-miniapp/smart-ui/lib/custom-keyboard/index"
}
```

## Code Demonstration

### Basic Usage

```html
<smart-custom-keyboard bind:change="onChange" bind:confirm="onConfirm" />
```

```js
Page({
  onChange(v) {
    console.log('onChange value =====>', v.detail);
  },
  onConfirm(v) {
    console.log('onConfirm value ====>', v.detail);
  },
});
```

### Advanced Usage

You can add custom content through slots.

```html
<smart-custom-keyboard
  input-container-style="
    marginLeft: 56rpx;
    marginTop: 16rpx;
    marginBottom: 56rpx;
    width: 560rpx;
    height: 120rpx;
  "
  placeholder="Please enter"
  confirm-text="Confirm"
  value="123"
  confirm-color="#123321"
  bind:change="onChange"
  bind:confirm="onConfirm"
>
  <view
    slot="custom-button"
    bind:tap="handleBtn"
    style="border: 1px solid blue; borderRadius: 4px; marginRight: 4px"
    >Click</view
  >
</smart-custom-keyboard>
```

```js
Page({
  onChange(v) {
    console.log('onChange value =====>', v.detail);
  },
  onConfirm(v) {
    console.log('onConfirm value ====>', v.detail);
  },
  handleBtn() {
    console.log('click');
  },
});
```

## API

### Props

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| confirm-color         | Background color of the confirm button on the numeric keypad | _string_  | -              |
| confirm-text          | Text for the confirm button                    | _string_  | Confirm        |
| confirm-text-style    | Style for the confirm button                   | _string_  | -              |
| digital-base          | Base adaptation feature (range 1-10)           | _number_  | 10             |
| input-container-style | Input container style                          | _string_  | -              |
| ismart-hide-zero      | Whether to hide zero                           | _boolean_ | false          |
| placeholder           | Placeholder text                               | _string_  | `please input` |
| value                 | Value                                          | _string_  | -              |
| value-text-style      | Style for the current value (applicable to placeholder style) | _string_  | -              |

### Slot

| Name          | Description      |
| ------------- | ---------------- |
| custom-button | Custom right content |
```

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description           |
| ----------------------------- | --------------------------------------  | --------------------- |
| --custom-keyboard-bg-color    | _var(--app-B6, #fff)_                   | Background color      |
| --custom-keyboard-text-color  | _var(--app-B6-N2, rgba(0, 0, 0, 0.7))_  | Font color            |
| --custom-keyboard-border-color| _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_  | Border color          |
| --custom-keyboard-placeholder-color | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_ | Placeholder color    |
| --custom-keyboard-popup-bg-color | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_ | Popup background color |
| --custom-keyboard-popup-item-color | _var(--app-B6, #fff)_                | Popup item color      |
| --custom-keyboard-popup-confirm-color | _var(--app-M3, #2dda86)_         | Confirm button color  |
| --custom-keyboard-popup-text-color | _var(--app-B6-N2, rgba(0, 0, 0, 0.7))_ | Popup text color    |
| --custom-keyboard-popup-hover-color | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_ | Hover color         |
