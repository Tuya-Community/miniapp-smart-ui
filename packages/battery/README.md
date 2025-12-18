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

### 基础用法(百分比)

```html
<smart-battery size="20" value="100" />
<smart-battery value="80" />
<smart-battery value="50" />
<smart-battery value="20" />
<smart-battery value="0" />
<smart-battery in-charging value="80" />
```

### 水平(百分比)

```html
<smart-battery type="horizontal" value="100" />
<smart-battery type="horizontal" />
<smart-battery type="horizontal" value="10" />
<smart-battery type="horizontal" value="3" />
<smart-battery type="horizontal" value="0" />
```

## API

### Props

| 参数             | 说明                     | 类型                       | 默认值     |
| ---------------- | ------------------------ | -------------------------- | ---------- |
| background-color | 电量背景色               | _string_                   | -          |
| color `v2.6.2`   | 电量的颜色（优先级最高） | _string_                   | -          |
| high-color       | 电量高的颜色             | _string_                   | `#70CF98`  |
| inCharging `v2.8.1`      | 是否处于充电状态         | _boolean_                  | `false`    |
| low-color        | 电量低的颜色             | _string_                   | `#FF4444`  |
| middle-color     | 电量中的颜色             | _string_                   | `#F5A623`  |
| showText `v2.8.1`        | 是否显示电量文本         | _boolean_                  | `false`    |
| size             | 尺寸                     | _number_                   | 10         |
| type             | 电池方向                 | `vertical` \| `horizontal` | `vertical` |
| value            | 电量值                   | _number_                   | 70         |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                                        | 默认值                | 描述           |
| ------------------------------------------- | --------------------- | -------------- |
| --smart-ui-battery-body-base-background     | _rgba(0, 0, 0, 0.25)_ | 电池主体背景色 |
| --smart-ui-battery-body-charging-background | _#2fc755_             | 充电状态背景色 |
| --smart-ui-battery-body-high-background     | _rgba(0, 0, 0, 0.9)_  | 高电量背景色   |
| --smart-ui-battery-body-low-background      | _#ee652e_             | 低电量背景色   |
| --smart-ui-battery-body-middle-background   | _#ffcb00_             | 中电量背景色   |
| --smart-ui-battery-slash-border-color       | _#ffffff_             | 斜线边框颜色   |
| --smart-ui-battery-text-color               | _rgba(0, 0, 0, 0.6)_  | 电量文本颜色   |
