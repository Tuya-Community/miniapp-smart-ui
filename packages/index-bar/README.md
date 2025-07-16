---
category: 导航
---

# IndexBar 索引栏

### 介绍

用于列表的索引分类显示和快速定位。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-index-bar": "@tuya-miniapp/smart-ui/lib/index-bar/index",
  "smart-index-anchor": "@tuya-miniapp/smart-ui/lib/index-anchor/index"
}
```

## 代码演示

### 基础用法

点击索引栏时，会自动跳转到对应的`IndexAnchor`锚点位置。

```html
<smart-index-bar>
  <view>
    <smart-index-anchor index="A" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
  </view>

  <view>
    <smart-index-anchor index="B" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
  </view>

  ...
</smart-index-bar>
```

### 自定义索引列表

可以通过`index-list`属性自定义展示的索引字符列表。

```html
<smart-index-bar index-list="{{ indexList }}">
  <view>
    <smart-index-anchor index="1">标题1</smart-index-anchor>
    <smart-cell title="文本" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
  </view>

  <view>
    <smart-index-anchor index="2">标题2</smart-index-anchor>
    <smart-cell title="文本" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
  </view>

  ...
</smart-index-bar>
```

```javascript
Page({
  data: {
    indexList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
});
```

## API

### IndexBar Props

| 参数              | 说明                       | 类型                   | 默认值    |
| ----------------- | -------------------------- | ---------------------- | --------- |
| highlight-color   | 索引字符高亮颜色           | _string_               | `#07c160` |
| index-list        | 索引字符列表               | _string[] \| number[]_ | `A-Z`     |
| sticky            | 是否开启锚点自动吸顶       | _boolean_              | `true`    |
| sticky-offset-top | 锚点自动吸顶时与顶部的距离 | _number_               | `0`       |
| z-index           | z-index 层级               | _number_               | `1`       |
| scrollable `v2.1.7`          | SideBar 是否可滚动定位               | _boolean_               | `false`       |

### IndexAnchor Props

| 参数     | 说明                     | 类型               | 默认值  |
| -------- | ------------------------ | ------------------ | ------- |
| index    | 索引字符                 | _string \| number_ | -       |
| use-slot | 是否使用自定义内容的插槽 | _boolean_          | `false` |

### IndexBar Events

| 事件名 | 说明           | 回调参数        |
| ------ | -------------- | --------------- |
| select | 选中字符时触发 | index: 索引字符 |

### IndexAnchor Slots

| 名称 | 说明                             |
| ---- | -------------------------------- |
| -    | 锚点位置显示内容，默认为索引字符 |


### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --index-bar-index-font-size | _10px_ | 索引字体大小 |
| --index-bar-index-line-height | _14px_ | 索引行高 |

## 常见问题

### 嵌套在滚动元素中 IndexAnchor 失效？

由于 `<IndexBar />` 内部使用 wx.pageScrollTo 滚动到指定位置，因此只支持页面级滚动，无法在滚动元素中嵌套使用，例如：`view` 使用 `overflow: scroll;` 或者 `scroll-view`，具体可查看[微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/wx.pageScrollTo.html)。
