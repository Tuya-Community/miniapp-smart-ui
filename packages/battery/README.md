---
category: 通用
---

# Battery 电池

### 介绍

电池，可自定义颜色

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](#/quickstart#yin-ru-zu-jian)。

```json
"usingComponents": {
  "smart-battery": "@tuya-miniapp/smart-ui/battery/index"
}
```

## 代码演示

### 基础用法

```html
<smart-battery size="20" value="100" />
```

### 水平方向

```html
<smart-battery type="horizontal" value="100" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 电池方向 | `vertical` \| `horizontal` | `vertical` |
| size | 尺寸 | _number_ | 10 |
| value | 电量值 | _number_ | 70 |
| high-color | 电量高的颜色 | _string_ | `#70CF98` |
| middle-color | 电量中的颜色 | _string_ | `#F5A623` |
| low-color | 电量低的颜色 | _string_ | `#FF4444` |
| background-color | 电量背景色 | _string_ | - |
| on-calc-color | 电量颜色计算规则回调函数，返回计算后的颜色值即可 | _() => string_ | - |
