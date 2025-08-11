 ---
category: Layout
---

# Layout

### Introduction

Layout provides two components, `smart-row` and `smart-col`, for row and column layout.

### Import

Import the components in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-row": "@tuya-miniapp/smart-ui/lib/row/index",
  "smart-col": "@tuya-miniapp/smart-ui/lib/col/index"
}
```

## Code Demonstration

### Basic Usage

The Layout component provides a `24-column grid` and sets the width percentage of columns by adding the `span` attribute on `Col`. In addition, the `offset` attribute can be added to set the column offset width, calculated the same way as the span.

```html
<smart-row>
  <smart-col span="8" custom-class="dark">span: 8</smart-col>
  <smart-col span="8" custom-class="light">span: 8</smart-col>
  <smart-col span="8" custom-class="dark">span: 8</smart-col>
</smart-row>

<smart-row>
  <smart-col span="4" custom-class="dark">span: 4</smart-col>
  <smart-col span="10" offset="4" custom-class="light">offset: 4, span: 10</smart-col>
</smart-row>

<smart-row>
  <smart-col offset="12" span="12" custom-class="dark">offset: 12, span: 12</smart-col>
</smart-row>
```

less style：

```less
.dark,
.light {
  color: #fff;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 10px;
  background-clip: content-box;
}

.dark {
  background-color: #39a9ed;
}

.light {
  background-color: #66c6f2;
}
```

### Setting Column Gap

The `gutter` attribute can be used to set the spacing between column elements. The default spacing is 0.

```html
<smart-row gutter="20">
  <smart-col span="8" custom-class="dark">span: 8</smart-col>
  <smart-col span="8" custom-class="light">span: 8</smart-col>
  <smart-col span="8" custom-class="dark">span: 8</smart-col>
</smart-row>
```
less样式：

```less
.dark,
.light {
  color: #fff;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 10px;
  background-clip: content-box;
}

.dark {
  background-color: #39a9ed;
}

.light {
  background-color: #66c6f2;
}
```

## API

### Row Props

| Parameter | Description                                  | Type               | Default |
| --------- | -------------------------------------------- | ------------------ | ------- |
| gutter    | Spacing between column elements (in px)      | _string \| number_ | -       |

### Col Props

| Parameter | Description           | Type               | Default |
| --------- | --------------------- | ------------------ | ------- |
| offset    | Column element offset | _string \| number_ | -       |
| span      | Column element width  | _string \| number_ | -       |

### External Style Classes

| Class Name    | Description     |
| ------------- | --------------- |
| custom-class  | Root node style |
### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                                          | Default Value                                 | Description                                |
| --------------------------------------------- | --------------------------------------------- | ------------------------------------------ |
| --collapse-item-transition-duration           | _0.3s_                                        | Duration of the collapse item transition   |
| --collapse-item-content-padding               | _15px_                                        | Padding for the collapse item content      |
| --collapse-item-content-font-size             | _13px_                                        | Font size of the collapse item content     |
| --collapse-item-content-line-height           | _1.5_                                         | Line height of the collapse item content   |
| --collapse-item-content-text-color            | _#969799_                                     | Text color of the collapse item content    |
| --collapse-item-content-background-color      | _var(--app-B6, #fff)_                         | Background color of the collapse item content |
| --collapse-item-title-disabled-color          | _#c8c9cc_                                     | Color of the disabled collapse item title  |