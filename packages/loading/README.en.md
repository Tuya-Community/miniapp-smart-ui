---
category: Display
---

# Loading

### Introduction

Loading icons, used to indicate a transition state.

### Import

Import the component in `app.json` or `index.json`. For details, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-loading": "@tuya-miniapp/smart-ui/lib/loading/index"
}
```

## Code Examples

### Loading Types

```html
<smart-loading /> <smart-loading type="spinner" />
```

### Custom Color

```html
<smart-loading color="#1989fa" /> <smart-loading type="spinner" color="#1989fa" />
```

### Loading Text

```html
<smart-loading size="24px">Loading...</smart-loading>
```

### Vertical Arrangement

```html
<smart-loading size="24px" vertical>Loading...</smart-loading>
```

## API

### Props

| Parameter         | Description                   | Type               | Default    |
| ----------------- | ----------------------------- | ------------------ | ---------- |
| color             | Color                        | _string_           | `#c9c9c9`  |
| size              | Size of the loading icon, default unit is `px` | _string \| number_ | `30px`     |
| text-size `v1.0.0`| Text size, default unit is `px` | _string \| number_ | `14px`     |
| type              | Type, optional value is `spinner` | _string_           | `circular` |
| vertical `v1.0.0` | Whether to vertically align icons and text | _boolean_          | `false`    |

### Slots

| Name | Description |
| ---- | ----------- |
| -    | Loading text |

### External Style Classes

| Class Name    | Description    |
| ------------- | -------------- |
| custom-class  | Root node style |
### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                                   | Default Value                           | Description                    |
| -------------------------------------- | ---------------------------------------- | ------------------------------ |
| --loading-text-color                   | _#969799_                                | Text color                     |
| --loading-text-font-size               | _14px_                                   | Text font size                 |
| --loading-text-line-height             | _20px_                                   | Text line height               |
| --loading-spinner-color                | _#c8c9cc_                                | Spinner color                  |
| --loading-spinner-size                 | _30px_                                   | Spinner size                   |
| --loading-spinner-animation-duration   | _0.8s_                                   | Animation duration             |
