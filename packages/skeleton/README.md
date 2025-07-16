---
category: 展示
---

# Skeleton 骨架屏

### 介绍

用于在内容加载过程中展示一组占位图形。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-skeleton": "@tuya-miniapp/smart-ui/lib/skeleton/index"
}
```

## 代码演示

### 基础用法

通过`title`属性显示标题占位图，通过`row`属性配置占位段落行数。

```html
<smart-skeleton title row="3" />
```

### 显示头像

通过`avatar`属性显示头像占位图。

```html
<smart-skeleton title avatar row="3" />
```

### 展示子组件

将`loading`属性设置成`false`表示内容加载完成，此时会隐藏占位图，并显示`Skeleton`的子组件。

```html
<smart-skeleton title avatar row="3" loading="{{ loading }}">
  <view>实际内容</view>
</smart-skeleton>
```

```js
Page({
  data: {
    loading: true,
  },
  onReady() {
    this.setData({
      loading: false,
    });
  },
});
```

## API

### Props

| 参数         | 说明                                        | 类型                 | 默认值  |
| ------------ | ------------------------------------------- | -------------------- | ------- |
| animate      | 是否开启动画                                | _boolean_            | `true`  |
| avatar       | 是否显示头像占位图                          | _boolean_            | `false` |
| avatar-shape | 头像占位图形状，可选值为`square`            | _string_             | `round` |
| avatar-size  | 头像占位图大小                              | _string \| number_   | `32px`  |
| loading      | 是否显示占位图，传`false`时会展示子组件内容 | _boolean_            | `true`  |
| row          | 段落占位图行数                              | _number_             | `0`     |
| row-width    | 段落占位图宽度，可传数组来设置每一行的宽度  | _string \| string[]_ | `100%`  |
| title        | 是否显示标题占位图                          | _boolean_            | `false` |
| title-width  | 标题占位图宽度                              | _string \| number_   | `40%`   |

### 外部样式类

| 类名         | 说明           |
| ------------ | -------------- |
| avatar-class | 头像占位样式类 |
| custom-class | 根节点样式类   |
| row-class    | 段落占位样式类 |
| title-class  | 标题占位样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --skeleton-padding            | _0 @padding-md_                        | 骨架屏内边距         |
| --skeleton-row-height         | _16px_                                 | 骨架屏行高           |
| --skeleton-row-background-color | _var(--app-B3, #ffffff)_             | 骨架屏行背景颜色     |
| --skeleton-row-margin-top     | _12px_                                 | 骨架屏行上边距       |
| --skeleton-avatar-background-color | _var(--app-B3, #ffffff)_          | 骨架屏头像背景颜色   |
| --skeleton-animation-duration | _1.2s_                                 | 动画持续时间         |