---
category: 导航
---

# Sidebar 侧边导航

### 介绍

垂直展示的导航栏，用于在不同的内容区域之间进行切换。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-sidebar": "@tuya-miniapp/smart-ui/lib/sidebar/index",
  "smart-sidebar-item": "@tuya-miniapp/smart-ui/lib/sidebar-item/index"
}
```

## 代码演示

### 基础用法

通过在`smart-sidebar`上设置`activeKey`属性来控制选中项。

```html
<smart-sidebar active-key="{{ activeKey }}">
  <smart-sidebar-item title="标签名" />
  <smart-sidebar-item title="标签名" />
  <smart-sidebar-item title="标签名" />
</smart-sidebar>
```

```javascript
Page({
  data: {
    activeKey: 0,
  },
});
```

### 徽标提示

设置`dot`属性后，会在右上角展示一个小红点。设置`badge`属性后，会在右上角展示相应的徽标。

```html
<smart-sidebar active-key="{{ activeKey }}">
  <smart-sidebar-item title="标签名" dot />
  <smart-sidebar-item title="标签名" badge="5" />
  <smart-sidebar-item title="标签名" badge="99+" />
</smart-sidebar>
```

### 禁用选项

通过`disabled`属性禁用选项。

```html
<smart-sidebar active-key="{{ activeKey }}">
  <smart-sidebar-item title="标签名" />
  <smart-sidebar-item title="标签名" disabled />
  <smart-sidebar-item title="标签名" />
</smart-sidebar>
```

### 监听切换事件

设置`change`方法来监听切换导航项时的事件。

```html
<smart-sidebar active-key="{{ activeKey }}" bind:change="onChange">
  <smart-sidebar-item title="标签名 1" />
  <smart-sidebar-item title="标签名 2" />
  <smart-sidebar-item title="标签名 3" />
</smart-sidebar>

<smart-notify id="smart-notify" />
```

```js
import Notify from '@tuya-miniapp/smart-ui/notify/notify';

Page({
  data: {
    activeKey: 0,
  },

  onChange(event) {
    Notify({ type: 'primary', message: event.detail });
  },
});
```

## API

### Sidebar Props

| 参数      | 说明         | 类型               | 默认值 |
| --------- | ------------ | ------------------ | ------ |
| activeKey | 选中项的索引 | _string \| number_ | `0`    |

### Sidebar Event

| 事件名 | 说明           | 参数               |
| ------ | -------------- | ------------------ |
| change | 切换徽章时触发 | 当前选中徽章的索引 |

### Sidebar 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### SidebarItem Props

| 参数  | 说明                 | 类型      | 默认值  |
| ----- | -------------------- | --------- | ------- |
| dot   | 是否显示右上角小红点 | _boolean_ | `false` |
| title | 内容                 | _string_  | `''`    |
| badge | 图标右上角徽标的内容 | _string \| number_ | `''` |
| disabled | 是否禁用该项 | _boolean_ | `false` |

### SidebarItem Slot

| 名称  | 说明                                        |
| ----- | ------------------------------------------- |
| title | 自定义标题栏，如果设置了`title`属性则不生效 |

### SidebarItem Event

| 事件名 | 说明           | 参数                            |
| ------ | -------------- | ------------------------------- |
| click  | 点击徽章时触发 | `event.detail` 为当前徽章的索引 |

### SidebarItem 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --sidebar-width               | _80px_                                 | 侧边栏宽度          |
| --sidebar-font-size           | _14px_                                 | 侧边栏字体大小      |
| --sidebar-line-height         | _20px_                                 | 侧边栏行高          |
| --sidebar-text-color          | _var(--app-B6-N1, rgba(0, 0, 0, 1))_   | 侧边栏文本颜色      |
| --sidebar-disabled-text-color | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_ | 禁用状态文本颜色    |
| --sidebar-padding             | _20px @padding-sm 20px @padding-xs_    | 侧边栏内边距        |
| --sidebar-active-color        | _var(--app-B6, #fff)_                  | 活动状态颜色        |
| --sidebar-background-color    | _var(--app-B1, #f6f7fb)_               | 侧边栏背景颜色      |
| --sidebar-selected-font-weight| _500_                                  | 选中状态字体粗细    |
| --sidebar-selected-text-color | _var(--app-B6-N1, rgba(0, 0, 0, 1))_   | 选中状态文本颜色    |
| --sidebar-selected-border-color| _#ee0a24_                             | 选中状态边框颜色    |
| --sidebar-selected-background-color| _var(--app-B6, #fff)_             | 选中状态背景颜色    |