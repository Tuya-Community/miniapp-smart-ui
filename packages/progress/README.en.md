<!-- ---
category: Display
--- -->

# Progress

### Introduction

Used to display the current progress of an operation.

### Import

Import the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-progress": "@tuya-miniapp/smart-ui/lib/progress/index"
}
```

## Code Demonstration

### Basic Usage

The progress bar is blue by default. Use the `percentage` attribute to set the current progress.

```html
<smart-progress percentage="50" />
```

### Line Thickness

You can set the thickness of the progress bar using `stroke-width`.

```html
<smart-progress :percentage="50" stroke-width="8" />
```

### Inactive

When the `inactive` attribute is set, the progress bar will be grayed out.

```html
<smart-progress inactive percentage="50" />
```

### Custom Styles

You can customize the text using the `pivot-text` attribute and the progress bar color with the `color` attribute.

```html
<smart-progress pivot-text="Orange" color="#f2826a" percentage="25" />

<smart-progress pivot-text="Red" color="#ee0a24" percentage="50" />

<smart-progress
  percentage="75"
  pivot-text="Purple"
  pivot-color="#7232dd"
  color="linear-gradient(to right, #be99ff, #7232dd)"
/>
```

## API

### Props

| Parameter    | Description                 | Type               | Default Value    |
| ------------ | --------------------------- | ------------------ | ---------------- |
| color        | Progress bar color          | _string_           | `#1989fa`        |
| inactive     | Whether to gray out         | _boolean_          | `false`          |
| percentage   | Progress percentage         | _number_           | `0`              |
| pivot-color  | Text background color       | _string_           | Same as bar color|
| pivot-text   | Text display                | _string_           | Progress percentage text |
| show-pivot   | Whether to show progress text | _boolean_        | `true`           |
| stroke-width | Progress bar thickness, default unit is `px` | _string \| number_ | `4px`          |
| text-color   | Progress text color         | _string_           | `#fff`           |
| track-color  | Track color                 | _string_           | `#e5e5e5`        |

### External Style Classes

| Class Name    | Description                |
| ------------- | -------------------------- |
| custom-class  | Root node style class      |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                             | Description |
| ----------------------------- | ----------------------------------------- | ----------- |
| --progress-height | _4px_ | - |
| --progress-background-color | _#ebedf0_ | - |
| --progress-pivot-padding | _0 5px_ | - |
| --progress-color | _#1989fa_ | - |
| --progress-pivot-font-size | _10px_ | - |
| --progress-pivot-line-height | _1.6_ | - |
| --progress-pivot-background-color | _#1989fa_ | - |
| --progress-pivot-text-color | _#fff_ | - |
