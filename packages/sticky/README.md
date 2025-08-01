---
category: 布局
---

# Sticky 粘性布局

### 介绍

Sticky 组件与 CSS 中`position: sticky`属性实现的效果一致，当组件在屏幕范围内时，会按照正常的布局排列，当组件滚出屏幕范围时，始终会固定在屏幕顶部。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-sticky": "@tuya-miniapp/smart-ui/lib/sticky/index"
}
```

## 代码演示

### 基础用法

将内容包裹在`Sticky`组件内即可。

```html
<smart-sticky>
  <smart-button type="primary">基础用法</smart-button>
</smart-sticky>
```

### 吸顶距离

通过`offset-top`属性可以设置组件在吸顶时与顶部的距离。

```html
<smart-sticky offset-top="{{ 50 }}">
  <smart-button type="info">吸顶距离</smart-button>
</smart-sticky>
```

### 指定容器

通过`container`属性可以指定组件的容器，页面滚动时，组件会始终保持在容器范围内，当组件即将超出容器底部时，会返回原位置。

```html
<view id="container" style="height: 150px;">
  <smart-sticky container="{{ container }}">
    <smart-button type="warning">指定容器</smart-button>
  </smart-sticky>
</view>
```

```js
Page({
  data: {
    container: null,
  },

  onReady() {
    this.setData({
      container: () => wx.createSelectorQuery().select('#container'),
    });
  },
});
```

### 嵌套在 scroll-view 内使用

通过 `scroll-top` 与 `offset-top` 属性可以实现在 scroll-view 内嵌套使用。

```html
<scroll-view
  bind:scroll="onScroll"
  scroll-y
  id="scroller"
  style="height: 200px;"
>
  <view style="height: 400px; padding-top: 50px;">
    <smart-sticky scroll-top="{{ scrollTop }}" offset-top="{{ offsetTop }}">
      <smart-button type="warning">嵌套在 scroll-view 内</smart-button>
    </smart-sticky>
  </view>
</scroll-view>
```

```js
Page({
  data: {
    scrollTop: 0,
    offsetTop: 0,
  },

  onScroll(event) {
    wx.createSelectorQuery()
      .select('#scroller')
      .boundingClientRect((res) => {
        this.setData({
          scrollTop: event.detail.scrollTop,
          offsetTop: res.top,
        });
      })
      .exec();
  },
});
```

## API

### Props

| 参数       | 说明                                                         | 类型       | 默认值 |
| ---------- | ------------------------------------------------------------ | ---------- | ------ |
| container  | 一个函数，返回容器对应的 NodesRef 节点                       | _function_ | -      |
| offset-top | 吸顶时与顶部的距离，单位`px`                                 | _number_   | `0`    |
| scroll-top | 当前滚动区域的滚动位置，非 `null` 时会禁用页面滚动事件的监听 | _number_   | -      |
| z-index    | 吸顶时的 z-index                                             | _number_   | `99`   |

### Events

| 事件名      | 说明       | 回调参数                                       |
| ----------- | ---------- | ---------------------------------------------- |
| bind:scroll | 滚动时触发 | { scrollTop: 距离顶部位置, isFixed: 是否吸顶 } |
