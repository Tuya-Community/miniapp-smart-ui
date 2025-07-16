---
category: Display
new: true
---

# Tag

> v2.0.0 Start joining

### Introduction

Used to mark keywords and summarize key content.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-tag": "@tuya-miniapp/smart-ui/lib/tag/index"
}
```

## Code Demonstration

### Basic Usage

Control the tag color through the `type` attribute, with the default being gray.

```html
<smart-tag type="primary">Tag</smart-tag>
<smart-tag type="success">Tag</smart-tag>
<smart-tag type="danger">Tag</smart-tag>
<smart-tag type="warning">Tag</smart-tag>
```

### Hollow Style

Set the `plain` attribute for a hollow style.

```html
<smart-tag plain type="primary">Tag</smart-tag>
<smart-tag plain type="success">Tag</smart-tag>
<smart-tag plain type="danger">Tag</smart-tag>
<smart-tag plain type="warning">Tag</smart-tag>
```

### Round Style

Set it to round style through the `round` attribute.

```html
<smart-tag round type="primary">Tag</smart-tag>
<smart-tag round type="success">Tag</smart-tag>
<smart-tag round type="danger">Tag</smart-tag>
<smart-tag round type="warning">Tag</smart-tag>
```

### Mark Style

Set it to mark style (semi-round) through the `mark` attribute.

```html
<smart-tag mark type="primary">Tag</smart-tag>
<smart-tag mark type="success">Tag</smart-tag>
<smart-tag mark type="danger">Tag</smart-tag>
<smart-tag mark type="warning">Tag</smart-tag>
```

### Custom Color

```html
<smart-tag color="rgba(16, 208, 208, 1)">Tag</smart-tag>
<smart-tag color="rgba(16, 208, 208, 0.2)" text-color="rgba(16, 208, 208, 1)">Tag</smart-tag>
<smart-tag color="rgba(16, 208, 208, 1)" plain>Tag</smart-tag>
```

### Tag Size

```html
<smart-tag type="danger">Tag</smart-tag>
<smart-tag type="danger" size="medium">Tag</smart-tag>
<smart-tag type="danger" size="large">Tag</smart-tag>
```

### Closeable Tag

Add the `closeable` attribute to indicate that the tag is closeable. When closing the tag, the `close` event will be triggered, and in the `close` event, the logic for hiding the tag can be executed.

```html
<smart-tag
  ty:if="{{ show.primary }}"
  closeable
  size="medium"
  type="primary"
  id="primary"
  bind:close="onClose"
>
  Tag
</smart-tag>
<smart-tag
  ty:if="{{ show.success }}"
  closeable
  size="medium"
  type="success"
  id="success"
  bind:close="onClose"
>
  Tag
</smart-tag>
```

```js
Page({
  data: {
    show: {
      primary: true,
      success: true,
    },
  },
  onClose(event) {
    this.setData({
      [`show.${event.target.id}`]: false,
    });
  },
});
```

## API

### Props

| Parameter  | Description                                               | Type      | Default |
| ---------- | --------------------------------------------------------- | --------- | ------- |
| closeable  | Whether it's a closeable tag                              | _boolean_ | `false` |
| color      | Tag color                                                 | _string_  | -       |
| mark       | Whether it's a mark style                                 | _boolean_ | `false` |
| plain      | Whether it's a hollow style                               | _boolean_ | `false` |
| round      | Whether it's a round style                                | _boolean_ | `false` |
| size       | Size, optional values are `large` `medium`                | _string_  | -       |
| text-color | Text color, has higher priority than the `color` attribute | _string_  | `white` |
| type       | Type, optional values are `primary` `success` `danger` `warning` | _string_  | -       |

### Slot

| Name | Description       |
| ---- | ----------------- |
| -    | Custom Tag content |

### Events

| Event name | Description       | Callback parameters |
| ---------- | ----------------- | ------------------- |
| bind:close | Triggered when the tag is closed | -                 |

### External Style Classes

| Class name    | Description          |
| ------------- | -------------------- |
| custom-class  | Root node style class |

### Style Variables

The component provides the following CSS variables for custom styles. For the usage method, please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name | Default Value | Description |
| --------------------------------- | ------------------ | ---- |
| --tag-padding        | _2px 8px_                           | Component padding    |
| --tag-text-color        | _#fff_                         | Text color    |
| --tag-border-radius  | _4px_    | Component outer radius    |
| --tag-line-height  | _17px_    | Default text line height    |
| --tag-medium-line-height  | _20px_    | Medium size text line height    |
| --tag-large-line-height  | _22px_    | Large size text line height    |
| --tag-font-size  | _12px_  | Default font size   |
| --tag-medium-font-size  | _14px_    | Medium size font size    |
| --tag-large-font-size  | _16px_    | Large size font size    |
| --tag-round-border-radius  | _999px_    | Round mode component outer radius    |
| --tag-default-color  | _#969799_    | Default mode background color or border color    |
| --tag-danger-color  | _#ee0a24_    | Danger mode background color or border color    |
| --tag-primary-color  | _#1989fa_    | Primary mode background color or border color    |
| --tag-success-color  | _#07c160_    | Success mode background color or border color    |
| --tag-warning-color  | _#ff976a_    | Warning mode background color or border color    |
| --tag-plain-background-color  | _transparent_    | Hollow mode background color    |