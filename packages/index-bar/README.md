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

```warning:⚠️注意
组件是监听整个page 滚动事件来做动态的 fixed 标题元素，所以渲染此组件的页面必须配置 页面可滚动。

index.config.ts:

export default {
  navigationBarTitleText: 'Home',
  disableScroll: false,
};
```

## 代码演示

### 基础用法

点击索引栏时，会自动跳转到对应的`IndexAnchor`锚点位置。设置 `scrollable` 后可滑动定位；设置 `show-move-tip`（`v2.12.0`）可在拖动侧边栏时显示跟随手指的提示气泡。

```html
<smart-index-bar scrollable show-move-tip>
  <view wx:for="{{ indexList }}" wx:for-item="item" wx:key="item">
    <smart-index-anchor index="{{ item }}" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
  </view>
</smart-index-bar>
```

```javascript
const indexList = [];
const charCodeOfA = 'A'.charCodeAt(0);

for (let i = 0; i < 26; i++) {
  indexList.push(String.fromCharCode(charCodeOfA + i));
}

Page({
  data: {
    indexList, // A-Z 字母列表
  },
});
```

### 自定义索引列表

可以通过`index-list`属性自定义展示的索引字符列表。

```html
<smart-index-bar index-list="{{ customIndexList }}">
  <view wx:for="{{ customIndexList }}" wx:key="index">
    <smart-index-anchor use-slot index="{{ item }}">
      <text>标题{{ item }}</text>
    </smart-index-anchor>
    <smart-cell title="文本" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
  </view>
</smart-index-bar>
```

```javascript
Page({
  data: {
    customIndexList: [1, 2, 3, 4, 5, 6, 8, 9, 10],
  },
});
```

### 自定义侧边栏样式 `v2.11.0`

`sidebar-font-size` 和 `sidebar-line-height` 属性可以设置侧边栏的字体样式

```html
<smart-index-bar sidebar-font-size="16px" sidebar-line-height="20px">
  <view wx:for="{{ indexList }}" wx:for-item="item" wx:key="item">
    <smart-index-anchor index="{{ item }}" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
    <smart-cell title="文本" />
  </view>
</smart-index-bar>
```

```javascript
const indexList = [];
const charCodeOfA = 'A'.charCodeAt(0);

for (let i = 0; i < 26; i++) {
  indexList.push(String.fromCharCode(charCodeOfA + i));
}

Page({
  data: {
    indexList, // A-Z 字母列表
  },
});
```

## API

### IndexBar Props

| 参数                          | 说明                       | 类型                   | 默认值    |
| ----------------------------- | -------------------------- | ---------------------- | --------- |
| highlight-color               | 索引字符高亮颜色           | _string_               | `#07c160` |
| index-list                    | 索引字符列表               | _string[] \| number[]_ | `A-Z`     |
| sticky                        | 是否开启锚点自动吸顶       | _boolean_              | `true`    |
| sticky-offset-top             | 锚点自动吸顶时与顶部的距离 | _number_               | `0`       |
| z-index                       | z-index 层级               | _number_               | `1`       |
| scrollable `v2.1.7`           | SideBar 是否可滚动定位     | _boolean_              | `false`   |
| show-move-tip `v2.12.0`       | 是否在拖动侧边栏时显示跟随手指的提示气泡 | _boolean_ | `false`   |
| sidebar-font-size `v2.11.0`   | SideBar 字体大小           | _string_               | -         |
| sidebar-line-height `v2.11.0` | SideBar 字体行高           | _string_               | -         |

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

**IndexBar**

| 名称                                      | 默认值       | 描述                   |
| ----------------------------------------- | ------------ | ---------------------- |
| --index-bar-index-font-size               | _10px_        | 侧边栏索引字体大小     |
| --index-bar-index-line-height             | _14px_        | 侧边栏索引行高         |
| --index-bar-move-tip-text-padding `v2.12.0` | _0 10px 0 0_ | 拖动提示文字内边距     |
| --index-bar-move-tip-text-font-size `v2.12.0`     | _24px_   | 拖动提示文字字体大小   |
| --index-bar-move-tip-text-line-height `v2.12.0`   | _32px_   | 拖动提示文字行高       |
| --index-bar-move-tip-text-color `v2.12.0`        | _#fff_   | 拖动提示文字颜色       |

**IndexAnchor**

| 名称                                    | 默认值        | 描述               |
| --------------------------------------- | ------------- | ------------------ |
| --index-anchor-padding                  | _0 16px_      | 锚点内边距         |
| --index-anchor-text-color               | _rgba(0,0,0,1)_ | 锚点文字颜色     |
| --index-anchor-font-weight              | _500_         | 锚点字重           |
| --index-anchor-font-size                | _14px_        | 锚点字体大小       |
| --index-anchor-line-height              | _32px_        | 锚点行高           |
| --index-anchor-background-color         | _transparent_ | 锚点背景色         |
| --index-anchor-active-background-color  | _#ffffff_     | 锚点吸顶时背景色   |
| --index-anchor-active-text-color        | _#3678e3_     | 锚点吸顶时文字颜色 |
| --index-anchor-index-padding            | _0 4px 0 20px_ | 锚点右侧索引内边距 |

## 常见问题

### 嵌套在滚动元素中 IndexAnchor 失效？

由于 `<IndexBar />` 内部使用 ty.pageScrollTo 滚动到指定位置，因此只支持页面级滚动，无法在滚动元素中嵌套使用，例如：`view` 使用 `overflow: scroll;` 或者 `scroll-view`，具体可查看[微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ty.pageScrollTo.html)。
