---
category: Data Entry
---

# Stepper

### Introduction

The stepper consists of increment buttons, decrement buttons, and an input box, used to input and adjust numbers within a certain range.

### Import

Import the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-stepper": "@tuya-miniapp/smart-ui/lib/stepper/index"
}
```

## Code Demos

### Basic Usage

Set the input value via `value` and listen to the changes through the `change` event.

```html
<smart-stepper value="{{ 1 }}" bind:change="onChange" />
```

```js
Page({
  onChange(event) {
    console.log(event.detail);
  },
});
```

### Step Size Setting

Set the value change for each increment or decrement button click through the `step` attribute. Default is `1`.

```html
<smart-stepper value="{{ 1 }}" step="2" />
```

### Restrict Input Range

Limit the input value range through `min` and `max` attributes.

```html
<smart-stepper value="{{ 5 }}" min="5" max="8" />
```

### Restrict Integer Input

Once the `integer` attribute is set, the input box will only allow integer input.

```html
<smart-stepper value="{{ 1 }}" integer />
```

### Disabled State

Disable the stepper by setting the `disabled` attribute. In the disabled state, buttons cannot be clicked and the input box cannot be modified.

```html
<smart-stepper value="{{ 1 }}" disabled />
```

### Disable Long Press

Set the `long-press` attribute to decide whether the stepper enables the long-press gesture.

```html
<smart-stepper value="{{ 1 }}" long-press="{{ false }}" />
```

### Fixed Decimal Places

Set the `decimal-length` attribute to retain a fixed number of decimal places.

```html
<smart-stepper value="{{ 1 }}" step="0.2" decimal-length="{{ 1 }}" />
```

### Asynchronous Change

If you need to change the value of the input box asynchronously, set the `async-change` attribute and manually modify the `value` in the `change` event.

```html
<smart-stepper value="{{ value }}" async-change bind:change="onChange" />
```

```js
Page({
  data: {
    value: 1,
  },

  onChange(value) {
    Toast.loading({ forbidClick: true });

    setTimeout(() => {
      Toast.clear();
      this.setData({ value });
    }, 500);
  },
});
```

### Custom Size

Set the input box width via the `input-width` attribute, and set the button size and input box height via the `button-size` attribute.

```html
<smart-stepper value="{{ 1 }}" input-width="40px" button-size="32px" />
```

## API

### Props

| Parameter              | Description                                                                        | Type               | Default  |
| ---------------------  | ---------------------------------------------------------------------------------  | ------------------ | -------  |
| always-embed `v1.9.3`  | Force the input to stay in the same layer state, defaults to non-same layer on focus (only effective on iOS) | _boolean_          | `false`  |
| async-change           | Whether to enable asynchronous changes. If enabled, the input value needs to be manually controlled | _boolean_          | `false`  |
| button-size            | Button size, default unit is `px`. Input box height will match the button size     | _string \| number_ | `28px`   |
| decimal-length         | Fixes the number of decimal places displayed                                        | _number_           | -        |
| disable-input          | Whether to disable the input box                                                    | _boolean_          | `false`  |
| disable-minus          | Whether to disable the decrement button                                             | _boolean_          | -        |
| disable-plus           | Whether to disable the increment button                                             | _boolean_          | -        |
| disabled               | Whether to disable                                                                  | _boolean_          | `false`  |
| input-width            | Input box width, default unit is `px`                                               | _string \| number_ | `32px`   |
| integer                | Whether to only allow integer input                                                 | _boolean_          | `false`  |
| long-press             | Whether to enable long-press gesture                                                | _boolean_          | `true`   |
| max                    | Maximum value                                                                       | _string \| number_ | -        |
| min                    | Minimum value                                                                       | _string \| number_ | `1`      |
| name                   | Identifier when submitting in a form                                                | _string_           | -        |
| show-minus             | Whether to show the decrement button                                                | _boolean_          | `true`   |
| show-plus              | Whether to show the increment button                                                | _boolean_          | `true`   |
| step                   | Step size                                                                           | _string \| number_ | `1`      |
| theme                  | Style theme, optional value `round`                                                 | _string_           | -        |
| value                  | Input value                                                                         | _string \| number_ | Minimum  |

### Events

| Event Name       | Description                | Callback Parameter          |
| --------------   | -------------------------- | --------------------------  |
| bind:blur        | Triggered when the input box loses focus | -                        |
| bind:change      | Event triggered when the binding value changes | event.detail: the current input value |
| bind:focus       | Triggered when the input box gains focus | -                        |
| bind:minus       | Triggered when the decrement button is clicked | -                        |
| bind:overlimit   | Triggered when an unusable button is clicked | -                        |
| bind:plus        | Triggered when the increment button is clicked | -                        |

### Slot

| Name   | Description   |
| -----  | -------------- |
| minus  | Decrement button |
| plus   | Increment button |

### External Style Classes

| Class Name           | Description         |
| -------------------  | ------------------- |
| custom-class         | Root node style class |
| input-class          | Input box style class |
| minusmart-class      | Decrement button style class |
| plusmart-class       | Increment button style class |

### Style Variables

The component provides the following CSS variables, which can be used to customize styles. See [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp) for usage instructions.

| Name                                     | Default Value                                 | Description                      |
| ---------------------------------------- | --------------------------------------------- | -------------------------------- |
| --stepper-container-background-color     | _var(--app-B6-N9, rgba(0, 0, 0, 0.05))_       | Background color                 |
| --stepper-background-border-radius       | _10px_                                        | Background border radius         |
| --stepper-padding                        | _2px_                                         | Padding                          |
| --stepper-active-color                   | _#e8e8e8_                                     | Button active color              |
| --stepper-background-color               | _var(--app-B6, #fff)_                         | Button background color          |
| --stepper-button-icon-color              | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_        | Button icon color                |
| --stepper-button-disabled-color          | _none_ `v2.1.7`  _var(--app-B6, #ffffff)_ `v2.6.1`    | Button disabled color   |
| --stepper-button-disabled-icon-color     | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_        | Button disabled icon color       |
| --stepper-button-round-theme-color       | _#ee0a24_                                     | Round style button color         |
| --stepper-btn-width                      | _44px_                                        | Button width                     |
| --stepper-btn-height                     | _28px_                                        | Button height                    |
| --stepper-input-width                    | _50px_                                        | Middle input box width           |
| --stepper-input-height                   | _28px_                                        | Middle input box height          |
| --stepper-input-font-size                | _16px_                                        | Middle input box font size       |
| --stepper-input-line-height              | _normal_                                      | Middle input box line height     |
| --stepper-input-text-color               | _var(--app-B6-N1, rgba(0, 0, 0, 1))_          | Middle input box text color      |
| --stepper-input-disabled-text-color      | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_        | Middle input box disabled text color |
| --stepper-border-radius                  | _8px_                                         | Button border radius             |
| --stepper-button-border `v2.2.0` | _0_ | Button Border |
| --stepper-button-icon-font-size `v2.2.0` | _22px_ | Font size of the icon inside the button |