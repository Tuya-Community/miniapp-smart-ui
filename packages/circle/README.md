---
category: 展示
new: true
version: v2.3.0
---

# Circle 环形进度条

### 介绍

圆环形的进度条组件，支持进度渐变动画。

> v2.3.0 之后重构

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-circle": "@tuya-miniapp/smart-ui/lib/circle/index"
}
```

```warning:⚠️注意
从 v2.3.9 开始将不支持微信小程序。
```

## 代码演示

### 基础用法

`percent`属性表示进度条的目标进度。

```html
<smart-circle percent="{{50}}" trackWidth="{{10}}"></smart-circle>
```

### 缺口圆角

`mode`属性表示类型，angle、angle2 为半圆类型，`angle-offset` 属性用于设置半圆类型（`angle`、`angle2`）的起始角度偏移，单位为度。值越大，圆环的缺口越大。默认值为 -1，表示使用默认偏移。

```html
<smart-circle percent="{{50}}" mode="angle">
</smart-circle>
<smart-circle percent="{{50}}" mode="angle2">
</smart-circle>
<smart-circle percent="{{50}}" mode="angle2" angle-offset="{{30}}">
</smart-circle>
```

### 不使用圆角

`round`属性设置为 false 为直角。

```html
<smart-circle percent="{{50}}" mode="angle" round="{{false}}">
</smart-circle>
```

### 自定义颜色

`fillColor` 可设置自定义颜色，`fillColorStops` 设置渐变色，

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

### 自定义宽度

```html
<smart-circle percent="{{60}}" trackWidth="15" mode="angle" round="{{false}}">
</smart-circle>
```

## API

### props

| 属性名                     | 描述     | 类型          | 默认值                     |
| -------------------------- | -------- | ------------- | -------------------------- |
| angle-offset               | 角度偏移 | number        | -1                         |
| children                   | 子元素   | ReactNode     | undefined                  |
| class-name                 | 类名     | string        | undefined                  |
| custom-style `v2.3.3`      | 样式     | CSSProperties | undefined                  |
| fill-color                 | 填充颜色 | string        | '#007AFF'                  |
| mask-color                 | 遮罩颜色 | string        | '#ffffff'                  |
| mode `v2.3.0`              | 样式风格 | string        | `basic`、`angle`、`angle2` |
| percent                    | 百分比   | number        | 0                          |
| round `v2.3.0`             | 遮罩颜色 | string        | `true`                     |
| size                       | 尺寸     | string        | '100px'                    |
| style `@deprecated v2.1.7` | 样式     | CSSProperties | undefined                  |
| track-color                | 滑槽颜色 | string        | '#d3d3d3'                  |
| track-width                | 滑槽宽度 | number        | 10                         |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                                     | 默认值    | 描述             |
| ---------------------------------------- | --------- | ---------------- |
| --circle-text-color `@deprecated v2.3.0` | _#323233_ | 圆环内的文字颜色 |
