---
category: 展示
---

# Tag 标签

### 介绍

用于标记关键词和概括主要内容。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](#/quickstart#yin-ru-zu-jian)。

```json
"usingComponents": {
  "smart-tag": "@tuya-miniapp/smart-ui/tag/index"
}
```

## 代码演示

### 基础用法

通过 `type` 属性控制标签颜色，默认为灰色。

```html
<smart-tag type="primary">标签</smart-tag>
<smart-tag type="success">标签</smart-tag>
<smart-tag type="danger">标签</smart-tag>
<smart-tag type="warning">标签</smart-tag>
```

### 空心样式

设置 `plain` 属性设置为空心样式。

```html
<smart-tag plain type="primary">标签</smart-tag>
<smart-tag plain type="success">标签</smart-tag>
<smart-tag plain type="danger">标签</smart-tag>
<smart-tag plain type="warning">标签</smart-tag>
```

### 圆角样式

通过 `round` 设置为圆角样式。

```html
<smart-tag round type="primary">标签</smart-tag>
<smart-tag round type="success">标签</smart-tag>
<smart-tag round type="danger">标签</smart-tag>
<smart-tag round type="warning">标签</smart-tag>
```

### 标记样式

通过 `mark` 设置为标记样式(半圆角)。

```html
<smart-tag mark type="primary">标签</smart-tag>
<smart-tag mark type="success">标签</smart-tag>
<smart-tag mark type="danger">标签</smart-tag>
<smart-tag mark type="warning">标签</smart-tag>
```

### 自定义颜色

```html
<smart-tag color="#f2826a">标签</smart-tag>
<smart-tag color="#7232dd">标签</smart-tag>
<smart-tag color="#7232dd" plain>标签</smart-tag>
<smart-tag color="#ffe1e1" text-color="#ad0000">标签</smart-tag>
```

### 标签大小

```html
<smart-tag type="danger">标签</smart-tag>
<smart-tag type="danger" size="medium">标签</smart-tag>
<smart-tag type="danger" size="large">标签</smart-tag>
```

### 可关闭标签

添加 `closeable` 属性表示标签是可关闭的，关闭标签时会触发 `close` 事件，在 `close` 事件中可以执行隐藏标签的逻辑。

```html
<smart-tag
  ty:if="{{ show.primary }}"
  closeable
  size="medium"
  type="primary"
  id="primary"
  bind:close="onClose"
>
  标签
</smart-tag>
<smart-tag
  ty:if="{{ show.success }}"
  closeable
  size="medium"
  type="success"
  id="success"
  bind:close="onClose"
>
  标签
</smart-tag>
```

```js
Page({
  data: {
    show: {
      primary: true,
      success: true,
    },
  },
  onClose(event) {
    this.setData({
      [`show.${event.target.id}`]: false,
    });
  },
});
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型，可选值为 `primary` `success` `danger` `warning` | _string_ | - |
| size | 大小, 可选值为 `large` `medium` | _string_ | - |
| color | 标签颜色 | _string_ | - |
| plain | 是否为空心样式 | _boolean_ | `false` |
| round | 是否为圆角样式 | _boolean_ | `false` |
| mark | 是否为标记样式 | _boolean_ | `false` |
| text-color | 文本颜色，优先级高于 `color` 属性 | _string_ | `white` |
| closeable | 是否为可关闭标签 | _boolean_ | `false` |

### Slot

| 名称 | 说明                |
| ---- | ------------------- |
| -    | 自定义 Tag 显示内容 |

### Events

| 事件名 | 说明           | 回调参数 |
| ------ | -------------- | -------- |
| bind:close  | 关闭标签时触发 | -        |

### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |
