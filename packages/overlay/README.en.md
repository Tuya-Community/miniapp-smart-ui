---
category: Display
---

# Overlay

### Introduction

Creates an overlay to emphasize specific page elements and prevent users from taking other actions.

### Import

Import the component in `app.json` or `index.json`. For details, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-overlay": "@tuya-miniapp/smart-ui/lib/overlay/index"
}
```

## Code Examples

### Basic Usage

```html
<smart-button type="primary" bind:click="onClickShow">Show Overlay</smart-button>
<smart-overlay show="{{ show }}" bind:click="onClickHide" />
```

```js
Page({
  data: {
    show: false,
  },

  onClickShow() {
    this.setData({ show: true });
  },

  onClickHide() {
    this.setData({ show: false });
  },
});
```

### Embedding Content

You can embed any content in the overlay through the default slot.

```html
<smart-button type="primary" bind:click="onClickShow">Embed Content</smart-button>
<smart-overlay show="{{ show }}" bind:click="onClickHide">
  <view class="wrapper">
    <view class="block" catch:tap="noop" />
  </view>
</smart-overlay>
```

```js
Page({
  data: {
    show: false,
  },

  onClickShow() {
    this.setData({ show: true });
  },

  onClickHide() {
    this.setData({ show: false });
  },

  noop() {},
});
```

```css
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
```

## API

### Props

| Parameter      | Description                                         | Type               | Default |
| -------------- | --------------------------------------------------- | ------------------ | ------- |
| classmart-name | Custom class name                                   | _string_           | -       |
| custom-style   | Custom style                                        | _string_           | -       |
| duration       | Animation duration in seconds                       | _string \| number_ | `0.3`   |
| lock-scroll    | Whether to lock background scroll                   | _boolean_          | `true`  |
| show           | Whether to show the overlay                         | _boolean_          | `false` |
| z-index        | z-index level                                       | _string \| number_ | `1`     |

### Events

| Event Name  | Description      | Callback Parameters |
| ----------- | ---------------- | ------------------- |
| bind:click  | Triggered on click | -                 |

### Slots

| Name | Description                           |
| ---- | ------------------------------------- |
| -    | Default slot for embedding content in the overlay |

### External Class Styles

| Class Name     | Description               |
| -------------- | --------------------------|
| custom-class   | Class of the root element |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                             | Description |
| ----------------------------- | ----------------------------------------- | ----------- |
| --overlay-background-color | _rgba(0, 0, 0, 0.7)_ | Background color |
