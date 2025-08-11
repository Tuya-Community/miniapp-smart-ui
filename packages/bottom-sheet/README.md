---
category: 反馈
new: true
---

# BottomSheet 底部弹窗

### 介绍

底部弹窗面板，与 Popup 和 ActionSheet 的区别在于，安全区通过内边距覆盖，适用于需要和底部无缝粘合的场景。v2.0.0 开始加入。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-bottom-sheet": "@tuya-miniapp/smart-ui/bottom-sheet/index"
}
```

## 代码演示

### 基础用法

传入一个 `title` 文本，将会往上弹出现一个带标题的底部弹窗。

```html
<smart-bottom-sheet
  title="Title"
  show="{{ show }}"
  bind:close="onClose"
/>
```

```javascript
Page({
  data: {
    show: false,
  },

  onClose() {
    this.setData({ show: false });
  },
});
```

### 自定义面板

通过传入子元素节点来自定义面板

```html
<smart-bottom-sheet
  show="{{ show }}"
  title="Title"
  bind:close="onClose"
>
  <view class="content" />
  <view class="footer">
    <smart-button type="info" block>完成</smart-button>
  </view>
</smart-bottom-sheet>
```

```css
.content {
  display: flex;
  justify-content: center;
  font-size: 20px;
  background: var(--app-B1, #f6f7fb);
  color: var(--app-B4-N1, #3d3d3d);
}

.footer {
  margin: 16px 0;
}
```

```javascript
Page({
  data: {
    show: false,
  },

  onClose() {
    this.setData({ show: false });
  },
});
```

### 最大高度限制

底部弹窗默认最大高度不允许超过屏幕的 50%，但可以通过 `--bottom-sheet-max-height` 自定义最大高度，在 v2.5.0 版本及之后内容触发最大高度组件内部会自动滚动！

```html
<smart-bottom-sheet
  show="{{ show }}"
  title="Title"
  bind:close="onClose"
>
  <view style="background-color: red; height: 100px;" />
  <view style="background-color: blue; height: 100px;" />
  <view style="background-color: black; height: 100px;" />
  <view style="background-color: yellow; height: 100px;" />
  <view style="background-color: pink; height: 100px;" />
</smart-bottom-sheet>
```

```javascript
Page({
  data: {
    show: false,
  },

  onClose() {
    this.setData({ show: false });
  },
});
```

### 固定高度 `v2.5.0`

`content-height` 可以设置内容区域的高度；当设置了 `content-height` 后, 组件的最大高度就会失效，可以自定义在内部书写内容。

```html
<smart-bottom-sheet
  show="{{ show }}"
  title="Title"
  bind:close="onClose"
  content-height="500px"
>
  <scroll-view scroll-y style="height: 300px">
    <view style="background-color: red; height: 100px;" />
    <view style="background-color: blue; height: 100px;" />
    <view style="background-color: black; height: 100px;" />
    <view style="background-color: yellow; height: 100px;" />
    <view style="background-color: pink; height: 100px;" />
  </scroll-view>
  <view style="background-color: white; height: 100px;" />
  <view style="background-color: orange; height: 100px;" />
</smart-bottom-sheet>
```

```javascript
Page({
  data: {
    show: false,
  },

  onClose() {
    this.setData({ show: false });
  },
});
```



### 使用插槽插入标题 `v2.6.1`

```html
<smart-bottom-sheet
  show="{{ show }}"
  bind:close="onClose"
>
  <view slot="title">title</view>
  <view style="background-color: orange; height: 100px;" />
</smart-bottom-sheet>
```

```javascript
Page({
  data: {
    show: false,
  },

  onClose() {
    this.setData({ show: false });
  },
});
```


## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示底部弹窗 | _boolean_ | `false` |
| title | 标题 | _string_ | - |
| icon-size | 标题中关闭按钮的大小 | _string \| number_ | `24` |
| icon-color | 标题中关闭按钮的颜色 | _string_ | `--app-B4-N3` \|\| `rgba(0, 0, 0, 0.5)` |
| round | 是否显示圆角 | _boolean_ | `true` |
| z-index | z-index 层级 | _number_ | `100` |
| overlay | 是否显示遮罩层 | _boolean_ | `true` |
| close-on-click-overlay | 点击遮罩是否关闭菜单 | _boolean_ | `true` |
| native-disabled `v2.5.0`     | 开启弹框期间是否禁用本地手势; 会在弹框开始进入动画时调用 `ty.nativeDisabled(true)`, 在弹框关闭动画结束时调用 `ty.nativeDisabled(false)` 恢复异层组件的点击能力；由于`ty.nativeDisabled` 是全局生效的，所以多个弹框组件同时打开时注意是否传 `native-disabled`属性和关闭的时机，防止 `native-disabled` 属性失效       | _boolean_   | `false`        |
| content-height `v2.5.0` | 内容区域高度，当设置此值时，组件的 max-height 将会失效       | _number \| string_   | `false`        |
| max-height `v2.6.0` | 整个组件的最大高度    | _number \| string_   | -     |
| show-close `v2.6.1` | 是否展示关闭图标      | _boolean_   | -        |



### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| bind:close | 点击关闭按钮时触发 | - |
| bind:before-enter  | 遮罩进入前触发       | -    |
| bind:enter         | 遮罩进入中触发       | -    |
| bind:after-enter   | 遮罩进入后触发       | -    |
| bind:before-leave  | 遮罩离开前触发       | -    |
| bind:leave         | 遮罩离开中触发       | -    |
| bind:after-leave   | 遮罩离开后触发       | -    |
| bind:click-overlay | 点击遮罩层时触发 | - |

### Slot

| 名称          | 说明           |
| ------------- | -------------- |
| - | 内容 |
| title `v2.6.1` | 标题插槽 |

### 外部样式类

| 类名                   | 说明                |
| ---------------------- | ------------------- |
| custom-class | 根节点样式类        |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --bottom-sheet-width        | _100%_                           | 底部弹窗的宽度    |
| --bottom-sheet-min-height        | _auto_                         | 底部弹窗的最小高度    |
| --bottom-sheet-max-height  | _50%_    | 底部弹窗的最大高度    |
| --bottom-sheet-padding  | _0 16px_    | 底部弹窗内容区域的内边距    |
| --bottom-sheet-icon-margin  | _16px 16px 0 0_    | 底部弹窗的关闭 icon 外边距    |
| --bottom-sheet-header-height  | _56px_    | 底部弹窗的头部高度    |
| --bottom-sheet-header-color  | _var(--app-B4-N1, rgba(0, 0, 0, 1))_  | 底部弹窗的头部文字颜色   |
| --bottom-sheet-header-font-size  | _17px_    | 底部弹窗的头部文字大小    |
| --bottom-sheet-header-font-weight  | _600_    | 底部弹窗的头部字重    |
| --bottom-sheet-font-color  | _var(--app-B4-N1, rgba(0, 0, 0, 1))_    | 底部弹窗的文字颜色    |
| --bottom-sheet-header-padding `v2.5.0`  | _0 16px_    | 底部弹窗头部的内边距    |
