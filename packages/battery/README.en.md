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
| inCharging `v2.8.1`      | Whether the battery is charging       | _boolean_                  | `false`    |
| low-color        | Color when battery level is low       | _string_                   | `#FF4444`  |
| middle-color     | Color when battery level is medium    | _string_                   | `#F5A623`  |
| showText  `v2.8.1`       | Whether to display battery level text | _boolean_                  | `false`    |
| size             | Size                                  | _number_                   | 10         |
| type             | Battery orientation                   | `vertical` \| `horizontal` | `vertical` |
| value            | Battery level                         | _number_                   | 70         |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                                        | Default Value         | Description                     |
| ------------------------------------------- | --------------------- | ------------------------------- |
| --smart-ui-battery-body-base-background     | _rgba(0, 0, 0, 0.25)_ | Battery body background         |
| --smart-ui-battery-body-charging-background | _#2fc755_             | Charging state background       |
| --smart-ui-battery-body-high-background     | _rgba(0, 0, 0, 0.9)_  | High battery level background   |
| --smart-ui-battery-body-low-background      | _#ee652e_             | Low battery level background    |
| --smart-ui-battery-body-middle-background   | _#ffcb00_             | Medium battery level background |
| --smart-ui-battery-slash-border-color       | _#ffffff_             | Slash border color              |
| --smart-ui-battery-text-color               | _rgba(0, 0, 0, 0.6)_  | Battery level text color        |
