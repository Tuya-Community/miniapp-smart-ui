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
```

### Horizontal Orientation

```html
<smart-battery type="horizontal" value="100" />
```

## API

### Props

| Property         | Description                                        | Type                       | Default     |
| ---------------- | -------------------------------------------------- | -------------------------- | ----------  |
| background-color | Battery background color                           | _string_                   | -           |
| color            | Battery color (highest priority)                   | _string_                   | -           |
| high-color       | Color when battery level is high                   | _string_                   | `#70CF98`   |
| low-color        | Color when battery level is low                    | _string_                   | `#FF4444`   |
| middle-color     | Color when battery level is medium                 | _string_                   | `#F5A623`   |
| size             | Size                                               | _number_                   | 10          |
| type             | Battery orientation                                | `vertical` \| `horizontal` | `vertical`  |
| value            | Battery level                                      | _number_                   | 70          |