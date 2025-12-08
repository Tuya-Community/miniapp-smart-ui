---
category: Display
new: true
version: v2.3.0
---

# Circle Circular Progress Bar

### Introduction

A circular progress bar component supporting gradient animation.

> Refactored after v2.3.0

### Import

Introduce the component in `app.json` or `index.json`, for detailed instructions see [Getting Started](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-circle": "@tuya-miniapp/smart-ui/lib/circle/index"
}
```

```warning:⚠️Note
WeChat Mini Programs will no longer be supported from v2.3.9.
```

## Code Examples

### Basic Usage

The `percent` property represents the target progress of the progress bar.

```html
<smart-circle percent="{{50}}" trackWidth="{{10}}"></smart-circle>
```

### Notch Circle

The `mode` property represents the type, angle, and angle2 are semicircular types. The `angle-offset`  `v2.7.4` property is used to set the starting angle offset for semicircular types (`angle`, `angle2`), in degrees. The larger the value, the larger the gap in the circle. The default value is -1, which means using the default offset.

```html
<smart-circle percent="{{50}}" mode="angle">
</smart-circle>
<smart-circle percent="{{50}}" mode="angle2">
</smart-circle>
<smart-circle percent="{{50}}" mode="angle2" angle-offset="{{30}}">
</smart-circle>
```

### Without Round Corners

Set the `round` property to false for right angles.

```html
<smart-circle percent="{{50}}" mode="angle" round="{{false}}">
</smart-circle>
```

### Custom Colors

`fillColor` can set a custom color, and `fillColorStops` sets gradient colors.

```html
<smart-circle percent="{{50}}" mode="angle" round="{{false}}" fillColor="#DE23CB">
</smart-circle>
<smart-circle percent="{{50}}" mode="angle" round="{{false}}" fillColorStops="{{gradientColor}}">
</smart-circle>
```

```js
Page({
  data: {
    gradientColor: {
      '0%': '#2361DE',
      '50%': '#23DEB5',
    },
  }
})
```

### Custom Width

```html
<smart-circle percent="{{60}}" trackWidth="15" mode="angle" round="{{false}}">
</smart-circle>
```

## API

### props

| Property Name              | Description  | Type          | Default Value              |
| -------------------------- | ------------ | ------------- | -------------------------- |
| angle-offset  `v2.7.4`  | Angle Offset | number        | -1                         |
| children                   | Children     | ReactNode     | undefined                  |
| class-name                 | Class Name   | string        | undefined                  |
| custom-style `v2.3.3`      | Style        | CSSProperties | undefined                  |
| fill-color                 | Fill Color   | string        | '#007AFF'                  |
| mask-color       | Mask Color   | string        | 'transparent'     |
| mode `v2.3.0`              | Style Mode   | string        | `basic`, `angle`, `angle2` |
| percent                    | Percentage   | number        | 0                          |
| round `v2.3.0`             | Mask Color   | string        | `true`                     |
| size                       | Size         | string        | '100px'                    |
| style `@deprecated v2.1.7` | Style        | CSSProperties | undefined                  |
| track-color                | Track Color  | string        | '#d3d3d3'                  |
| track-width                | Track Width  | number        | 10                         |

### Style Variables

The component provides the following CSS variables for styling customization, see the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp) for usage instructions.

| Name                                     | Default Value | Description                  |
| ---------------------------------------- | ------------- | ---------------------------- |
| --circle-text-color `@deprecated v2.3.0` | _#323233_     | Text color inside the circle |
