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
<smart-loading /> 
<smart-loading type="spinner" />
```

### Custom Color

```html
<smart-loading color="red" /> 
<smart-loading type="spinner" color="green" />
```

### Loading Text

```html
<smart-loading size="24px">Loading...</smart-loading>
<smart-loading color="var(--app-B1-N1)" icon-color="#1989FA" size="24px">Loading...</smart-loading>
```

### Vertical Arrangement

```html
<smart-loading size="24px" vertical>Loading...</smart-loading>
```

## API

### Props

| Parameter         | Description                   | Type               | Default    |
| ----------------- | ----------------------------- | ------------------ | ---------- |
| color             | Overall Color                        | _string_           | `var(--loading-text-color, #1989FA)`  |
| size              | Size of the loading icon, default unit is `px` | _string \| number_ | `30px`     |
| text-size `v1.0.0`| Text size, default unit is `px` | _string \| number_ | `14px`     |
| type              | Type, optional value is `spinner` | _string_           | `circular` |
| vertical `v1.0.0` | Whether to vertically align icons and text | _boolean_          | `false`    |
| icon-color `v2.7.4` | Independently control the color of the icon | _string_          | `var(--loading-spinner-size, #1989FA)`    |

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
| --loading-spinner-color                | _#1989FA_                                | Spinner color                  |
| --loading-spinner-size                 | _30px_                                   | Spinner size                   |
| --loading-spinner-animation-duration   | _0.8s_                                   | Animation duration             |
