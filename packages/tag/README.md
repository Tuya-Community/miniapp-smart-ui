---
category: 展示
new: true
---

# Tag 标签

> v2.0.0 开始加入

### 介绍

用于标记关键词和概括主要内容。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-tag": "@tuya-miniapp/smart-ui/lib/tag/index"
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
<smart-tag color="rgba(16, 208, 208, 1)">标签</smart-tag>
<smart-tag color="rgba(16, 208, 208, 0.2)" text-color="rgba(16, 208, 208, 1)">标签</smart-tag>
<smart-tag color="rgba(16, 208, 208, 1)" plain>标签</smart-tag>
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

| 参数       | 说明                                                  | 类型      | 默认值  |
| ---------- | ----------------------------------------------------- | --------- | ------- |
| closeable  | 是否为可关闭标签                                      | _boolean_ | `false` |
| color      | 标签颜色                                              | _string_  | -       |
| mark       | 是否为标记样式                                        | _boolean_ | `false` |
| plain      | 是否为空心样式                                        | _boolean_ | `false` |
| round      | 是否为圆角样式                                        | _boolean_ | `false` |
| size       | 大小, 可选值为 `large` `medium`                       | _string_  | -       |
| text-color | 文本颜色，优先级高于 `color` 属性                     | _string_  | `white` |
| type       | 类型，可选值为 `primary` `success` `danger` `warning` | _string_  | -       |

### Slot

| 名称 | 说明                |
| ---- | ------------------- |
| -    | 自定义 Tag 显示内容 |

### Events

| 事件名     | 说明           | 回调参数 |
| ---------- | -------------- | -------- |
| bind:close | 关闭标签时触发 | -        |

### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |


### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --tag-padding        | _2px 8px_                           | 组件padding    |
| --tag-text-color        | _#fff_                         | 文字颜色    |
| --tag-border-radius  | _4px_    | 组件外部radius    |
| --tag-line-height  | _17px_    | 文字默认行高    |
| --tag-medium-line-height  | _20px_    | medium尺寸文字行高    |
| --tag-large-line-height  | _22px_    | large尺寸文字行高    |
| --tag-font-size  | _12px_  | 字体默认大小   |
| --tag-medium-font-size  | _14px_    | medium尺寸字体大小    |
| --tag-large-font-size  | _16px_    | large尺寸字体大小    |
| --tag-round-border-radius  | _999px_    | round模式组件外部radius    |
| --tag-default-color  | _#969799_    | default模式背景色或边框色    |
| --tag-danger-color  | _#ee0a24_    | danger模式背景色或边框色    |
| --tag-primary-color  | _#1989fa_    | primary模式背景色或边框色    |
| --tag-success-color  | _#07c160_    | success模式背景色或边框色    |
| --tag-warning-color  | _#ff976a_    | warning模式背景色或边框色    |
| --tag-plain-background-color  | _transparent_    | 空心模式背景色    |
