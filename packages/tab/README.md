---
category: 布局
---

# Tab 标签页

### 介绍

选项卡组件，用于在不同的内容区域之间进行切换。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-tab": "@tuya-miniapp/smart-ui/lib/tab/index",
  "smart-tabs": "@tuya-miniapp/smart-ui/lib/tabs/index"
}
```

## 代码演示

### 基础用法

通过`active`设定当前激活标签对应的索引值，默认情况下启用第一个标签。

```html
<smart-tabs active="{{ active }}" bind:change="onChange">
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2">内容 2</smart-tab>
  <smart-tab title="标签 3">内容 3</smart-tab>
  <smart-tab title="标签 4">内容 4</smart-tab>
</smart-tabs>
```

```js
Page({
  data: {
    active: 1,
  },

  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
});
```

### 通过名称匹配

在标签指定`name`属性的情况下，`active`的值为当前标签的`name`（此时无法通过索引值来匹配标签）。

```html
<smart-tabs active="a">
  <smart-tab title="标签 1" name="a">内容 1</smart-tab>
  <smart-tab title="标签 2" name="b">内容 2</smart-tab>
  <smart-tab title="标签 3" name="c">内容 3</smart-tab>
</smart-tabs>
```

### 横向滚动

多于 5 个标签时，Tab 可以横向滚动。

```html
<smart-tabs active="{{ active }}">
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2">内容 2</smart-tab>
  <smart-tab title="标签 3">内容 3</smart-tab>
  <smart-tab title="标签 4">内容 4</smart-tab>
  <smart-tab title="标签 5">内容 5</smart-tab>
  <smart-tab title="标签 6">内容 6</smart-tab>
</smart-tabs>
```

### 禁用标签

设置`disabled`属性即可禁用标签。如果需要监听禁用标签的点击事件，可以在`smart-tabs`上监听`disabled`事件。

```html
<smart-tabs bind:disabled="onClickDisabled">
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2" disabled>内容 2</smart-tab>
  <smart-tab title="标签 3">内容 3</smart-tab>
</smart-tabs>
```

```javascript
Page({
  onClickDisabled(event) {
    wx.showToast({
      title: `标签 ${event.detail.name} 已被禁用`,
      icon: 'none',
    });
  },
});
```

### 样式风格

`Tab`支持两种样式风格：`line`和`card`，默认为`line`样式，可以通过`type`属性修改样式风格。

```html
<smart-tabs type="card">
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2">内容 2</smart-tab>
  <smart-tab title="标签 3">内容 3</smart-tab>
</smart-tabs>
```

### 点击事件

可以在`smart-tabs`上绑定`click`事件，在回调参数的`event.detail`中可以取得被点击标签的标题和标识符。

```html
<smart-tabs bind:click="onClick">
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2">内容 2</smart-tab>
</smart-tabs>
```

```javascript
Page({
  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
});
```

### 粘性布局

通过`sticky`属性可以开启粘性布局，粘性布局下，当 Tab 滚动到顶部时会自动吸顶。

```html
<smart-tabs sticky>
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2">内容 2</smart-tab>
  <smart-tab title="标签 3">内容 3</smart-tab>
  <smart-tab title="标签 4">内容 4</smart-tab>
</smart-tabs>
```

### 切换动画

可以通过`animated`来设置是否启用切换 tab 时的动画。

```html
<smart-tabs animated>
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2">内容 2</smart-tab>
  <smart-tab title="标签 3">内容 3</smart-tab>
  <smart-tab title="标签 4">内容 4</smart-tab>
</smart-tabs>
```

### 滑动切换

通过`swipeable`属性可以开启滑动切换标签页。

```html
<smart-tabs swipeable>
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2">内容 2</smart-tab>
  <smart-tab title="标签 3">内容 3</smart-tab>
  <smart-tab title="标签 4">内容 4</smart-tab>
</smart-tabs>
```

### 嵌套 popup

如果将 smart-tabs 嵌套在 smart-popup 等会隐藏内容的组件或节点内，当 smart-tabs 显示时下划线将不会正常显示。

此时可以通过使用 `ty:if` 手动控制 smart-tabs 的渲染来规避这种场景。

```html
<smart-popup show="{{ show }}">
  <smart-tabs ty:if="{{ show }}">
    <smart-tab title="标签 1">内容 1</smart-tab>
    <smart-tab title="标签 2">内容 2</smart-tab>
    <smart-tab title="标签 3">内容 3</smart-tab>
    <smart-tab title="标签 4">内容 4</smart-tab>
  </smart-tabs>
</smart-popup>
```

### 异步切换

通过 `before-change` 事件可以在切换标签前执行特定的逻辑，实现切换前校验、异步切换的目的

```html
<smart-tabs active="{{ active }}" use-before-change="{{ true }}" bind:change="onChange" bind:before-change="onBeforeChange" >
  <smart-tab title="标签 1">内容 1</smart-tab>
  <smart-tab title="标签 2">内容 2</smart-tab>
  <smart-tab title="标签 3">内容 3</smart-tab>
  <smart-tab title="标签 4">内容 4</smart-tab>
</smart-tabs>
```

```js
Page({
  data: {
    active: 1,
  },

  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  onBeforeChange(event) {
    const { callback, title } = event.detail;
    
    wx.showModal({
      title: '异步切换',
      content: `确定要切换至 ${title} tab吗？`,
      success: (res) => {
        if (res.confirm) {
          callback(true)
        } else if (res.cancel) {
          callback(false)
        }
      },
    })
  }
});
```


### 副标题

通过 `subtitle` 可以设置二级标题

```html
<smart-tabs active="{{ 1 }}" bind:change="onChange" swipe-threshold="7" title-active-color="#1989FA">
  <smart-tab
    wx:for="{{ tabsRenders }}"
    wx:key="name"
    title="{{ item.name }}"
    subtitle="{{ item.content }}"
    subtitle-style="color: black;"
  >
  </smart-tab>
</smart-tabs>
```

```js
Page({
  data: {
    active: 1,
    tabsRenders: [
      { name: '周一', content: '12' },
      { name: '周二', content: '13' },
      { name: '周三', content: '14' },
      { name: '周四', content: '15' },
      { name: '周五', content: '16' },
      { name: '周六', content: '17' },
      { name: '周日', content: '18' },
    ],
  },

  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  }
});
```


## API

### Tabs Props

| 参数                         | 说明                                                           | 类型               | 默认值    |
| ---------------------------- | -------------------------------------------------------------- | ------------------ | --------- |
| active                       | 当前选中标签的标识符                                           | _string_ | `0`       |
| animated                     | 是否开启切换标签内容时的转场动画                               | _boolean_          | `false`   |
| border                       | 是否展示外边框，仅在 `line` 风格下生效                         | _boolean_          | `false`   |
| color                        | 标签主题色，仅在非`card`模式可用 | _string_           | `#ee0a24` |
| duration                     | 动画时间，单位秒                                               | _number_           | `0.3`     |
| ellipsis                     | 是否省略过长的标题文字                                         | _boolean_          | `true`    |
| lazy-render                  | 是否开启标签页内容延迟渲染(不销毁组件)                                     | _boolean_          | `true`    |
| inactive-destroy `v2.1.0`      | 标签未被选择时是否销毁tab插槽内容               | _boolean_          | `false`    |
| line-height                  | 底部条高度，默认单位`px`                                       | _string \| number_ | `3px`     |
| line-width                   | 底部条宽度，默认单位`px`                                       | _string \| number_ | `40px`    |
| offset-top                   | 粘性定位布局下与顶部的最小距离，单位`px`                       | _number_           | -         |
| sticky                       | 是否使用粘性定位布局                                           | _boolean_          | `false`   |
| swipe-threshold              | 滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动 | _number_           | `5`       |
| swipeable                    | 是否开启手势滑动切换                                           | _boolean_          | `false`   |
| title-active-color           | 标题选中态颜色                                                 | _string_           | -         |
| title-inactive-color         | 标题默认态颜色                                                 | _string_           | -         |
| type                         | 样式风格，可选值为`card`                                       | _string_           | `line`    |
| use-before-change `v1.10.10` | 是否开启切换前校验                                             | _boolean_          | `false`   |
| z-index                      | z-index 层级                                                   | _number_           | `1`       |

### Tab Props

| 参数        | 说明                       | 类型               | 默认值       |
| ----------- | -------------------------- | ------------------ | ------------ |
| disabled    | 是否禁用标签               | _boolean_          | `false`      |
| dot         | 是否显示小红点             | _boolean_          | -            |
| info        | 图标右上角提示信息         | _string \| number_ | -            |
| name        | 标签名称，作为匹配的标识符 | _string_ | - |
| title       | 标题                       | _string_           | -            |
| title-style | 自定义标题样式             | _string_           | -            |
| subtitle `v2.3.5`       | 二级标题                       | _string_           | -            |
| subtitle-style `v2.3.5` | 自定义二级标题样式             | _string_           | -            |

### Tabs Slot

| 名称      | 说明         |
| --------- | ------------ |
| nav-left  | 标题左侧内容 |
| nav-right | 标题右侧内容 |

### Tab Slot

| 名称 | 说明       |
| ---- | ---------- |
| -    | 标签页内容 |

### Tabs Event

| 事件名    | 说明    | 参数         |
| ----- | -------------- | --------- |
| bind:before-change `v1.10.10` | tab 切换前会触发，在回调函数中返回 `false` 可终止 tab 切换，绑定事件的同时需要将`use-before-change`属性设置为`true` | `event.detail.name`: 当前切换的 tab 标识符， `event.detail.title`: 当前切换的 tab 标题， `event.detail.index`: 当前切换的 tab 下标，`event.detail.callback`: 回调函数，调用`callback(false)`终止 tab 切换 |
| bind:change      | 当前激活的标签改变时触发     | name：标签标识符，title：标题      |
| bind:click    | 点击标签时触发         | name：标签标识符，title：标题        |
| bind:disabled     | 点击被禁用的标签时触发   | name：标签标识符，title：标题      |
| bind:scroll     | 滚动时触发 | { scrollTop: 距离顶部位置, isFixed: 是否吸顶 } |

### 外部样式类

| 类名             | 说明               |
| ---------------- | ------------------ |
| custom-class     | 根节点样式类       |
| nav-class        | 标签栏样式类       |
| tab-active-class | 标签激活态样式类   |
| tab-class        | 标签样式类         |
| wrap-class       | 标签栏根节点样式类 |


### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --tabs-background-color | _var(--app-B3, #fff)_ | 背景色    |
| --tabs-default-color | _var(--app-M4)_ | 默认文字颜色    |
| --tabs-line-height | _32px_ | 默认文字字高    |
| --tabs-sub-line-height `2.3.5` | _64px_ | 默认二级文字字高    |
| --tabs-bottom-bar-height  | _3px_ | 底部滑块高度    |
| --tabs-bottom-bar-color | _var(--tabs-default-color)_ | 底部滑块背景色    |
| --tabs-card-text-color | _var(--app-B6-N3)_ | card模式文字颜色    |
| --tabs-card-text-active-color | _var(--app-B6-N1)_ | card模式选中的文字颜色    |
| --tabs-card-height | _32px_ | card模式滑块高度    |
| --tabs-card-border-radius | _8px_ | card模式radius    |
| --tabs-card-active-border-radius `v2.0.0` | _6px_ | card模式滑块radius    |
| --tabs-card-active-background-color | _var(--app-B3, #fff)_ | card模式滑块背景色  |
| --tabs-card-active-top `v2.0.0`  | _0_    | card模式滑块top定位    |
| --tabs-card-active-left `v2.0.0`  | _0_    | card模式滑块left定位    |
| --tabs-card-padding `v2.0.0`  | _2px_    | card模式padding   |
| --tab-panel-background-color `v2.0.0`  | _var(--app-B3)_    | panel背景色   |
| --tab-panel-text-color `v2.0.0`  | _var(--app-B3-N1)_    | panel文字颜色   |
| --tabs-card-background-color `v2.1.0`  | _var(--app-B6-N9, rgba(0, 0, 0, 0.05))_    | 卡片模式背景颜色   |

### 方法

通过 selectComponent 可以获取到 Tabs 实例并调用实例方法。

| 方法名 | 参数 | 返回值 | 介绍                                                       |
| ------ | ---- | ------ | ---------------------------------------------------------- |
| resize | -    | -      | 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘 |

## 常见问题

### 组件从隐藏状态切换到显示状态时，底部条位置错误？

Tabs 组件在挂载时，会获取自身的宽度，并计算出底部条的位置。如果组件一开始处于隐藏状态，则获取到的宽度永远为 0，因此无法展示底部条位置。

#### 解决方法

方法一，使用 `ty:if` 来控制组件展示，使组件重新初始化。

```html
<smart-tabs ty:if="show" />
```

方法二，调用组件的 resize 方法来主动触发重绘。

```html
<smart-tabs id="tabs" />
```

```js
this.selectComponent('#tabs').resize();
```
