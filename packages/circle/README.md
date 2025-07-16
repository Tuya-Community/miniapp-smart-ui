---
category: 展示
---

# Circle 环形进度条

### 介绍

圆环形的进度条组件，支持进度渐变动画。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](#/quickstart#yin-ru-zu-jian)。

```json
"usingComponents": {
  "smart-circle": "@tuya-miniapp/smart-ui/circle/index"
}
```

## 代码演示

### 基础用法

`percent`属性表示进度条的目标进度。

```html
<smart-circle percent="{{20}}"></smart-circle>
```

### Circle

<!-- prettier-ignore -->
|属性名|描述|类型|默认值|
|---|---|---|---|
className|类名|string|undefined|
children|子元素|ReactNode|undefined|
style|样式|CSSProperties|undefined|
size|尺寸|string|'100px'|
trackWidth|滑槽宽度|string|'10px'|
trackColor|滑槽颜色|string|'#d3d3d3'|
fillColor|填充颜色|string|'#007AFF'|
percent|百分比|number|0|
maskColor|遮罩颜色|string|'#ffffff'|
