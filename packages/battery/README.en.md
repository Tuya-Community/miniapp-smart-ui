---
category: General
---

# Battery

### Introduction

Battery, customizable colors

### Import

Import the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-battery": "@tuya-miniapp/smart-ui/lib/battery/index"
}
```

## Code Examples

### Basic Usage

```html
<smart-battery size="20" value="100" />
<smart-battery value="80" />
<smart-battery value="50" />
<smart-battery value="20" />
<smart-battery value="0" />
<smart-battery in-charging value="80" />
```

### Horizontal

```html
<smart-battery type="horizontal" value="100" />
<smart-battery type="horizontal" />
<smart-battery type="horizontal" value="10" />
<smart-battery type="horizontal" value="3" />
<smart-battery type="horizontal" value="0" />
```

### Basic Usage(With Percent)

```html
<smart-battery size="20" value="100" />
<smart-battery value="80" />
<smart-battery value="50" />
<smart-battery value="20" />
<smart-battery value="0" />
<smart-battery in-charging value="80" />
```

### Horizontal(With Percent)

```html
<smart-battery type="horizontal" value="100" />
<smart-battery type="horizontal" />
<smart-battery type="horizontal" value="10" />
<smart-battery type="horizontal" value="3" />
<smart-battery type="horizontal" value="0" />
```

## API

### Props

| Property         | Description                           | Type                       | Default    |
| ---------------- | ------------------------------------- | -------------------------- | ---------- |
| background-color | Battery background color              | _string_                   | -          |
| color `v2.6.2`   | Battery color (highest priority)      | _string_                   | -          |
| high-color       | Color when battery level is high      | _string_                   | `#70CF98`  |
| middle-color     | Color when battery level is medium    | _string_                   | `#F5A623`  |
| low-color        | Color when battery level is low       | _string_                   | `#FF4444`  |
| in-charging `v2.10.0`      | Whether the battery is charging       | _boolean_                  | `false`    |
| charging-color `v2.10.0`      | Charging Color        | _string_                  | `var(--battery-body-charging-background, #2fc755)`    |
| show-text  `v2.10.0`       | Whether to display battery level text | _boolean_                  | `false`    |
| size             | Size                                  | _number_                   | 10         |
| type             | Battery orientation                   | `vertical` \| `horizontal` | `vertical` |
| value            | Battery level                         | _number_                   | 70         |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name             | Default Value         | Description                     |
| -------------------- | --------------------- | ------------------------------- |
| --battery-body-base-background `v2.10.0`     | _rgba(0, 0, 0, 0.25)_ | Battery body background         |
| --battery-body-charging-background `v2.10.0` | _#2fc755_             | Charging state background       |
| --battery-body-high-background `v2.10.0`   | _var(--app-B1-N1, rgba(0, 0, 0, 0.9))_  | High battery background color   |
| --battery-body-middle-background `v2.10.0`   | _#ffcb00_             | Medium battery level background |
| --battery-body-low-background `v2.10.0`      | _#ee652e_             | Low battery level background    |
| --battery-slash-border-color `v2.10.0`       | _var(--smart-ui-battery-slash-border-color, #ffffff)_  | Slash border color              |
| --battery-text-color `v2.10.0`    | _var(--smart-ui-battery-text-color, rgba(0, 0, 0, 0.6))_  | Battery level text color        |
