---
category: Feedback
---

# Switch

### Introduction

Used for toggling between on and off states.

### Import

Import the component in `app.json` or `index.json`, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp) for details.

```json
"usingComponents": {
  "smart-switch": "@tuya-miniapp/smart-ui/lib/switch/index"
}
```

## Code Demonstration

### Basic Usage

```html
<smart-switch checked="{{ checked }}" bind:change="onChange" />
<smart-switch checked="{{ !checked }}" bind:change="onChange" />
```

```javascript
Page({
  data: {
    checked: true,
  },

  onChange({ detail }) {
    // Must manually update the checked state
    this.setData({ checked: detail });
  },
});
```

### Disabled State

```html
<smart-switch checked="{{ checked }}" disabled />
```

### Loading State

```html
<smart-switch checked="{{ checked }}" loading />
```

### Custom Size

The `size` attribute can set the size of the component.

```html
<smart-switch checked="{{ checked }}" size="24px" />
```

### Custom Colors

Setting `active-color` can set the color after selection, and `inactive-color` can set the color when not selected.

```html
<smart-switch
  checked="{{ checked }}"
  active-color="#07c160"
  inactive-color="#ee0a24"
/>
```

### Gradient Color `v2.5.0`

All attributes that CSS background can achieve can also be achieved by `active-color` and `inactive-color`.

```html
<smart-switch
  checked="{{ checked }}"
  active-color="linear-gradient(to right, #ff7e5f, #987AFF)"
  inactive-color="linear-gradient(to right, #407e5f, #841AFF)"
/>
```

### Asynchronous Control

```html
<smart-switch checked="{{ checked }}" bind:change="onChange" />
```

```js
Page({
  data: {
    checked: true,
  },

  onChange({ detail }) {
    wx.showModal({
      title: 'Prompt',
      content: 'Switch the toggle?',
      success: (res) => {
        if (res.confirm) {
          this.setData({ checked2: detail });
        }
      },
    });
  },
});
```

### Prevent Bubbling

The `stop-click-propagation` attribute can prevent bubbling.

```html
<smart-switch checked="{{ checked }}" stop-click-propagation bind:change="onChange" />
```

### Usage in Lists

```html
<smart-cell-group>
  <smart-cell title="Title">
    <smart-switch
      checked="{{ checked }}"
      bind:change="onChange"
    />    
  </smart-cell>
</smart-cell-group>
```

### Support copy

```html
<smart-switch
  activeText="ON"
  inactiveText="OFF"
/>
```

## API

### Props

| Parameter                      | Description                | Type      | Default   |
| ------------------------------ | -------------------------- | --------- | --------- |
| active-color                   | Background color when on   | _string_  | `#1989fa` |
| active-value                   | Value when on              | _any_     | `true`    |
| checked                        | Switch checked state       | _any_     | `false`   |
| disabled                       | Whether it is disabled     | _boolean_ | `false`   |
| inactive-color                 | Background color when off  | _string_  | `#fff`    |
| inactive-value                 | Value when off             | _any_     | `false`   |
| loading                        | Whether it is loading      | _boolean_ | `false`   |
| name                           | Identifier when submitting | _string_  | -         |
| size                           | Switch size                | _string_  | `30px`    |
| stop-click-propagation `v1.0.2`| Whether to prevent bubbling| _boolean_ | `false`   |

### Events

| Event Name     | Description            | Parameter                       |
| -------------- | ---------------------- | -------------------------------- |
| bind:change    | Callback for switch state change | event.detail: Whether the switch is selected |

### External Style Classes

| Class Name     | Description            |
| -------------- | ---------------------- |
| custom-class   | Root node style class  |
| node-class     | Node style class       |

### Style Variables

The component provides the following CSS variables for custom styling. See [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp) for usage.

| Name                          | Default Value                            | Description |
| ----------------------------- | ---------------------------------------- | ----------- |
| --switch-width                | _1.5338em_            | Switch width |
| --switch-height               | _0.867em_             | Switch height |
| --switch-node-size            | _0.867em_      | Switch node size |
| --switch-node-z-index         | _1_      | Switch node z-index |
| --switch-node-background-color| _#fff_       | -             |
| --switch-node-box-shadow      | _0 3px 1px 0 rgba(0, 0, 0, 0.05),_    | Switch node shadow |
| --switch-background-color     | _var(--app-B4-N6, rgba(0, 0, 0, 0.2))_   | Switch background color |
| --switch-on-background-color  | _#1989fa_       | Switch on background color |
| --switch-transition-duration  | _0.3s_        | Switch transition duration |
| --switch-disabled-opacity     | _0.4_          | Switch disabled opacity |
| --switch-border `@deprecated v2.5.0`             | _0.08em solid rgba(0, 0, 0, 0.1)_     | Switch border |
| --switch-node-on-background-color `v2.4.0` | _var(--switch-node-background-color, #fff)_ | Background color of the sphere when turned on |
| --switch-padding `v2.5.0` | _0.08em_ | Internal padding |
| --switch-label-font-size | `12px` | Font Size |
| --switch-label-active-color | `var(--app-B3, #ffffff)` | Text color on open |
| --switch-label-inactive-color | `var(--app-B3, #ffffff)` | Text color when turned off |