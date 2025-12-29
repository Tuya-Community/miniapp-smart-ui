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
<smart-battery value="80" />
<smart-battery value="50" />
<smart-battery value="20" />
<smart-battery value="0" />
<smart-battery in-charging value="80" />
```

### 水平

```html
<smart-battery type="horizontal" value="100" />
<smart-battery type="horizontal" />
<smart-battery type="horizontal" value="10" />
<smart-battery type="horizontal" value="3" />
<smart-battery type="horizontal" value="0" />
```

### 显示百分比

```html
<smart-battery size="20" value="100" />
<smart-battery value="80" />
<smart-battery value="50" />
<smart-battery value="20" />
<smart-battery value="0" />
<smart-battery in-charging value="80" />
```

### 水平(显示百分比)

```html
<smart-battery type="horizontal" value="100" />
<smart-battery type="horizontal" />
<smart-battery type="horizontal" value="10" />
<smart-battery type="horizontal" value="3" />
<smart-battery type="horizontal" value="0" />
```

### 自定义大小

```html
<smart-battery size="20" value="100" />
<smart-battery size="15" value="100" />
<smart-battery size="10" value="100" />
<smart-battery size="5" value="100" />
```

## API

### Props

| 参数             | 说明                     | 类型                       | 默认值     |
| ---------------- | ------------------------ | -------------------------- | ---------- |
| background-color | 电量背景色               | _string_                   | -          |
| color `v2.6.2`   | 电量的颜色（优先级最高） | _string_                   | -          |
| high-color       | 电量高的颜色             | _string_                   | `#70CF98`  |
| middle-color     | 电量中的颜色             | _string_                   | `#F5A623`  |
| low-color        | 电量低的颜色             | _string_                   | `#FF4444`  |
| in-charging `v2.10.0`      | 是否处于充电状态         | _boolean_                  | `false`    |
| charging-color `v2.10.0`      | 充电颜色        | _string_                  | `#2fc755`    |
| show-text `v2.10.0`        | 是否显示电量文本         | _boolean_                  | `false`    |
| size             | 尺寸                     | _number_                   | 10         |
| type             | 电池方向                 | `vertical` \| `horizontal` | `vertical` |
| value            | 电量值                   | _number_                   | 70         |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                                        | 默认值                | 描述           |
| ------------------------------------------- | --------------------- | -------------- |
| --battery-body-base-background `v2.10.0`     | _var(--smart-ui-battery-body-base-background, rgba(0, 0, 0, 0.25))_ | 电池主体背景色 |
| --battery-body-charging-background `v2.10.0` | _#2fc755_             | 充电状态背景色 |
| --battery-body-high-background `v2.10.0`   | _var(--app-B1-N1, rgba(0, 0, 0, 0.9))_  | 高电量背景色   |
| --battery-body-middle-background `v2.10.0`   | _#ffcb00_             | 中电量背景色   |
| --battery-body-low-background `v2.10.0`      | _#ee652e_             | 低电量背景色   |
| --battery-slash-border-color `v2.10.0`       | _var(--smart-ui-battery-slash-border-color, #ffffff)_   | 斜线边框颜色   |
| --battery-text-color `v2.10.0`  | _var(--smart-ui-battery-text-color, rgba(0, 0, 0, 0.6))_  | 电量文本颜色   |
