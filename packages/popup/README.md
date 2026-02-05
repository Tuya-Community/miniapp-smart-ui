---
category: 反馈
---

# Popup 弹出层

### 介绍

弹出层容器，用于展示弹窗、信息提示等内容，支持多个弹出层叠加展示。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-popup": "@tuya-miniapp/smart-ui/lib/popup/index"
}
```

## 代码演示

### 基础用法

通过`show`属性控制弹出层是否展示。

```html
<smart-cell title="展示弹出层" is-link bind:click="showPopup" />

<smart-popup show="{{ show }}" bind:close="onClose">内容</smart-popup>
```

```javascript
Page({
  data: {
    show: false,
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
});
```

### 弹出位置

通过`position`属性设置弹出位置，默认居中弹出，可以设置为`top`、`bottom`、`left`、`right`。

```html
<smart-popup show="{{ show }}" position="top" custom-style="height: 20%;" bind:close="onClose" />
```

### 关闭图标

设置`closeable`属性后，会在弹出层的右上角显示关闭图标，并且可以通过`close-icon`属性自定义图标，使用`close-icon-position`属性可以自定义图标位置。

```html
<smart-popup
  show="{{ show }}"
  closeable
  position="bottom"
  custom-style="height: 20%"
  bind:close="onClose"
/>

<!-- 自定义图标 -->
<smart-popup
  show="{{ show }}"
  closeable
  close-icon="close"
  position="bottom"
  custom-style="height: 20%"
  bind:close="onClose"
/>

<!-- 图标位置 -->
<smart-popup
  show="{{ show }}"
  closeable
  close-icon-position="top-left"
  position="bottom"
  custom-style="height: 20%"
  bind:close="onClose"
/>
```

### 圆角弹窗

设置`round`属性后，弹窗会根据弹出位置添加不同的圆角样式。

```html
<smart-popup
  show="{{ show }}"
  round
  position="bottom"
  custom-style="height: 20%"
  bind:close="onClose"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| close-icon | 关闭图标名称或图片链接 | _string_ | `cross` |
| close-icon-position | 关闭图标位置，可选值为 `top-left`<br>`bottom-left` `bottom-right` | _string_ | `top-right` |
| close-on-click-overlay | 是否在点击遮罩层后关闭 | _boolean_ | `true` |
| closeable | 是否显示关闭图标 | _boolean_ | `false` |
| custom-style | 自定义弹出层样式 | _string_ | `''` |
| duration | 动画时长，单位为毫秒 | _number \| object_ | `300` |
| lock-scroll | 是否锁定背景滚动 | _boolean_ | `true` |
| overlay | 是否显示遮罩层 | _boolean_ | `true` |
| overlay-style | 自定义遮罩层样式 | _string_ | `''` |
| position | 弹出位置，可选值为 `top` `bottom` `right` `left` | _string_ | `center` |
| round | 是否显示圆角 | _boolean_ | `false` |
| safe-area-inset-bottom | 是否留出底部安全距离，v2.7.1 开始默认关闭 | _boolean_ | `false` |
| safe-area-inset-bottom-min `v1.1.0` | 是否需要预留出一个最小的底部安全距离，用于在 safeArea 底部为 0 时进行追加，需要在 safeAreaInsetBottom 为 true 时生效 | _number_ | `0` |
| safe-area-inset-top | 是否留出顶部安全距离（状态栏高度） | _boolean_ | `false` |
| safe-area-tab-bar | 是否留出底部 tabbar 安全距离（在使用 tabbar 组件 & 小程序自定义 tabbar 时，popup 组件层级无法盖住 tabbar） | _boolean_ | `false` |
| show | 是否显示弹出层 | _boolean_ | `false` |
| z-index | z-index 层级 | _number_ | `100` |
| native-disabled `v2.3.8` | 开启弹框期间是否禁用本地手势; 会在弹框开始进入动画时调用 `ty.nativeDisabled(true)`, 在弹框关闭动画结束时调用 `ty.nativeDisabled(false)` 恢复异层组件的点击能力；由于`ty.nativeDisabled` 是全局生效的，所以多个弹框组件同时打开时注意是否传 `native-disabled`属性和关闭的时机，防止 `native-disabled` 属性失效 | _boolean_ | `false` |
| full-cover-view `v2.11.1` | 是否使用 cover-view 包裹弹层，用于覆盖原生组件（如 map、video）时使用 | _boolean_ | `false` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| bind:after-enter | 进入后触发 | - |
| bind:after-leave | 离开后触发 | - |
| bind:before-enter | 进入前触发 | - |
| bind:before-leave | 离开前触发 | - |
| bind:click-overlay | 点击遮罩层时触发 | - |
| bind:close | 关闭弹出层时触发 | - |
| bind:enter | 进入中触发 | - |
| bind:leave | 离开中触发 | - |

### 外部样式类

| 类名 | 说明 |
| --- | --- |
| custom-class | 根节点样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --popup-background-color | _var(--app-B4, #ffffff)_ | 弹窗背景颜色 |
| --popup-round-border-radius | _16px_ | 圆形边框半径 |
| --popup-close-icon-size | _24px_ | 关闭图标大小 |
| --popup-close-icon-color | _#969799_ | 关闭图标颜色 |
| --popup-close-icon-margin | _12px_ | 关闭图标边距 |
| --popup-close-icon-z-index | _1_ | 关闭图标层级 |
