---
category: 通用
---

# Battery 电池

### 介绍

电池，可自定义颜色

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-battery": "@tuya-miniapp/smart-ui/lib/battery/index"
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

| 参数             | 说明                                             | 类型                       | 默认值     |
| ---------------- | ------------------------------------------------ | -------------------------- | ---------- |
| background-color | 电量背景色                                       | _string_                   | -          |
| high-color       | 电量高的颜色                                     | _string_                   | `#70CF98`  |
| low-color        | 电量低的颜色                                     | _string_                   | `#FF4444`  |
| middle-color     | 电量中的颜色                                     | _string_                   | `#F5A623`  |
| size             | 尺寸                                             | _number_                   | 10         |
| type             | 电池方向                                         | `vertical` \| `horizontal` | `vertical` |
| value            | 电量值                                           | _number_                   | 70         |
| color `v2.6.2` | 电量的颜色（优先级最高）                           | _string_                   | -         |

