---
category: 导航
---

# NavBar 导航栏

### 介绍

为页面提供导航功能，常用于页面顶部。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-nav-bar": "@tuya-miniapp/smart-ui/lib/nav-bar/index"
}
```

## 代码演示

### 首页

首页的文本样式默认左对齐并加粗，点击左侧文本时触发事件；background `v2.7.0` 属性可以设置nav-bar的背景色。

```html
<smart-nav-bar
  left-text="Home"
  left-text-type="home"
  bind:click-left-text="onClickLeftText"
/>
<smart-nav-bar
  background="#E4EDFF"
  custom-class="demo-nav-bar"
  left-text="HomeHomeHomeHomeHome"
  left-text-type="home"
  bind:click-left-text="onClickLeftText"
/>
```

```js
Page({
  onClickLeftText() {
    ty.showToast({ title: '点击标题', icon: 'none' });
  },
});
```

```less
.demo-nav-bar {
  margin-top: 16px;
}
```

### 二级页面

二级页面的文本样式居中，左侧显示返回箭头，点击中央文本或左侧箭头时触发事件。

```html
<smart-nav-bar
  title="设置"
  left-arrow
  bind:click-right="onClickRight"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
<smart-nav-bar
  title="设置"
  custom-class="demo-nav-bar"
  right-text="删除"
  right-text-color="#F04C4C"
  left-arrow
  bind:click-right-text="onClickRightText"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
<smart-nav-bar
  title="设置"
  custom-class="demo-nav-bar"
  right-text="删除"
  right-text-color="#F04C4C"
  left-text="取消"
  bind:click-right-text="onClickRightText"
  bind:click-left-text="onClickLeftText"
  bind:click-title="onClickTitle"
/>
```

```js
Page({
  onClickLeft() {
    wx.showToast({ title: '点击返回', icon: 'none' });
  },
  onClickLeftText() {
    wx.showToast({ title: '点击返回', icon: 'none' });
  },
  onClickRightText() {
    wx.showToast({ title: '点击右侧文字', icon: 'none' });
  },
  onClickTitle() {
    wx.showToast({ title: '点击标题', icon: 'none' });
  },
  onClickRight() {
    wx.showToast({ title: '点击右侧', icon: 'none' });
  },
});
```

## 右侧图标

```html
<smart-nav-bar
  title="设置"
  left-arrow
  right-icon="{{ iconMore }}"
  right-icon-size="32px"
  right-icon-color="var(--app-B2-N1, rgba(0, 0, 0, 1))"
  bind:click-right-icon="onClickRightIcon"
/>
<smart-nav-bar
  title="设置"
  left-arrow
  custom-class="demo-nav-bar"
  right-icon="{{ iconMore }}"
  right-icon-size="32px"
  right-icon-color="var(--app-B2-N1, rgba(0, 0, 0, 1))"
  bind:click-right-icon="onClickRightIcon"
>
  <smart-icon
    slot="right"
    size="32px"
    name="{{ iconHouse }}"
    color="var(--app-B2-N1, rgba(0, 0, 0, 1))"
  />
</smart-nav-bar>
```


```js
import iconHouse from '@tuya-miniapp/icons/dist/svg/House';
import iconMore from '@tuya-miniapp/icons/dist/svg/More';

Page({
  data: {
    iconHouse,
    iconMore,
  },

  onClickRightIcon() {
    wx.showToast({ title: '点击右侧图标', icon: 'none' });
  },
});
```



## 自定义图标

可自定义图标的样式，进行更丰富的展示。

```html
<smart-nav-bar
  title="Home"
  left-arrow
  left-icon="{{ iconHouse }}"
  left-icon-size="32px"
  left-icon-class="nav-bar-icon-home"
  bind:click-left="onClickLeft"
  bind:click-left-icon="onClickLeftIcon"
  bind:click-left-text="onClickLeftText"
  bind:click-title="onClickTitle"
  bind:click-right="onClickRight"
/>
```

```js
import iconHouse from '@tuya-miniapp/icons/dist/svg/House';

Page({
  data: {
    iconHouse,
  },

  onClickLeft() {
    ty.showToast({ title: '点击返回', icon: 'none' });
  },

  onClickLeftIcon() {
    ty.showToast({ title: '点击左侧图标', icon: 'none' });
  },

  onClickLeftText() {
    ty.showToast({ title: '点击返回', icon: 'none' });
  },

  onClickTitle() {
    ty.showToast({ title: '点击标题', icon: 'none' });
  },

  onClickRight() {
    ty.showToast({ title: '点击右侧', icon: 'none' });
  },
});
```

```less
.nav-bar-icon-home {
  margin-left: 16px;
}
```

### 左标题

部分二级页面标题位于左侧，或同时附带 icon。

```html
<smart-nav-bar
  left-arrow
  left-text="Home"
  left-text-type="title"
  bind:click-left="onClickLeft"
  bind:click-left-text="onClickLeftText"
  bind:click-right="onClickRight"
/>

<smart-nav-bar
  custom-class="demo-nav-bar"
  left-arrow
  left-text="Home"
  left-text-type="title"
  left-icon="https://images.tuyacn.com/content-platform/hestia/1729664215ebd89f13e54.png"
  bind:click-left="onClickLeft"
  bind:click-left-icon="onClickLeftIcon"
  bind:click-left-text="onClickLeftText"
  bind:click-right="onClickRight"
/>
```

```js
Page({
  onClickLeft() {
    ty.showToast({ title: '点击返回', icon: 'none' });
  },

  onClickLeftIcon() {
    ty.showToast({ title: '点击左侧图标', icon: 'none' });
  },

  onClickLeftText() {
    ty.showToast({ title: '点击返回', icon: 'none' });
  },

  onClickRight() {
    ty.showToast({ title: '点击右侧', icon: 'none' });
  },
});
```

## API

### Props

| 参数                | 说明                               | 类型      | 默认值  |
| ------------------- | ---------------------------------- | --------- | ------- |
| border              | 是否显示下边框                     | _boolean_ | `true`  |
| custom-style        | 根节点自定义样式                   | _string_  | -       |
| fixed               | 是否固定在顶部                     | _boolean_ | `false` |
| left-arrow          | 是否显示左侧箭头                   | _boolean_ | `false` |
| left-text           | 左侧文案                           | _string_  | `''`    |
| left-text-type `v2.0.0`          | 左侧文本的样式类型，范围为 `home`、`title`、`back`                           | _string_  | `back`    |
| left-icon `v2.0.0`         | 左侧 Icon                           | _string_  | `''`    |
| left-icon-size `v2.0.0`        | 左侧 Icon 大小，默认为 32                           | _string \| number_  | `32`    |
| round `v2.1.0`               | 是否显示圆角                     | _boolean_ | `false` |
| placeholder         | 固定在顶部时是否开启占位           | _boolean_ | `false` |
| right-text          | 右侧文案                           | _string_  | `''`    |
| safe-area-inset-top | 是否留出顶部安全距离（状态栏高度） | _boolean_ | `true`  |
| title               | 标题                               | _string_  | `''`    |
| z-index             | 元素 z-index                       | _number_  | `1`     |
| right-text-color `v2.7.0` | 右侧文案的颜色    | _string_  | -   |
| right-icon `v2.7.0` | 右侧图标    | _string_  | -   |
| right-icon-color `v2.7.0` | 右侧图标颜色    | _string_  | -   |
| right-icon-size `v2.7.0` | 右侧图标大小    | _number_  | `32px`   |
| left-icon-color `v2.7.0` | 左侧图标颜色    | _string_  | -   |
| background `v2.7.0` | 整体背景色    | _string_  | -   |

### Slot

| 名称  | 说明               |
| ----- | ------------------ |
| left  | 自定义左侧区域内容 |
| right | 自定义右侧区域内容 |
| title | 自定义标题         |

### Events

| 事件名           | 说明               | 参数 |
| ---------------- | ------------------ | ---- |
| bind:click-left  | 点击左侧返回 icon 时触发 | -    |
| bind:click-right | 点击右侧按钮时触发 | -    |
| bind:click-title `v2.0.0` | 点击中央标题时触发 | -    |
| bind:click-left-icon `v2.0.0` | 点击左侧 icon 时触发 | -    |
| bind:click-left-text `v2.0.0` | 点击左侧文本时触发 | -    |
| bind:click-right-icon `v2.7.0` | 点击右侧图标时触发 | -    |
| bind:click-right-text `v2.7.0` | 点击右侧文本时触发 | -    |

### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |
| title-class  | 标题样式类   |
| left-icon-class `v2.0.0` | 左侧图标样式类 |
| right-text-class `v2.1.0` | 右侧文字样式类 |
| right-icon-class `v2.7.0` | 右侧图标样式类 |
| left-text-class `v2.7.0` | 左侧文字样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --nav-bar-height    | _var(--app-device-navbar-height, 46px)_     | 导航栏高度 |
| --nav-bar-round-min-height `v2.1.0`    | _56px_        | 导航栏圆角存在时的最小高度 |
| --nav-bar-round-border-radius `v2.1.0`   | _16px 16px 0px 0px_     | 是否显示导航栏圆角 |
| --nav-bar-background-color    | _var(--app-B2, #ffffff)_               | 导航栏背景色 |
| --nav-bar-arrow-color         | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏箭头颜色 |
| --nav-bar-icon-size `@deprecated v2.7.0`   | _32px_     | 导航栏图标大小 |
| --nav-bar-icon-color          | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏图标颜色 |
| --nav-bar-icon-margin `@deprecated v2.7.0`    | _0_      | 导航栏图标外边距 |
| --nav-bar-text-font-size `v2.1.0`         | _16px_   | 导航栏文字大小 |
| --nav-bar-text-color          | _var(--app-B2-N2, rgba(0, 0, 0, 1))_   | 导航栏文字颜色 |
| --nav-bar-title-font-size     | _var(--font-size-lg)_                  | 导航栏标题文字大小 |
| --nav-bar-title-font-weight   | _600_                                  | 导航栏标题字重 |
| --nav-bar-title-text-color    | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏标题文字颜色 |
| --nav-bar-home-font-size      | _22px_                                 | 导航栏首页文字大小 |
| --nav-bar-home-font-weight    | _600_                                  | 导航栏首页字重 |
| --nav-bar-home-text-color     | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏首页文字颜色 |
| --nav-bar-right-text-color `v2.5.1`  | _var(--app-B2-N1, rgba(0, 0, 0, 1))_  | 导航栏右侧文字颜色 |
| --nav-bar-title-max-width `v2.6.0` `@deprecated v2.7.0`    | _56%_   | 导航栏标题的宽度 |
| --nav-bar-side-width `v2.7.0`    | _98px_   | 两边宽度 |
| --nav-bar-text-padding `v2.7.0`    | _20px_   | 两边文字内边距 |
| --nav-bar-icon-padding `v2.7.0`    | _16px_   | 两边图标内边距 |
| --nav-bar-title-margin `v2.7.0`    | _16px_   | 标题外边距 |
| --nav-bar-home-max-width `v2.7.0`    | _calc(100% - 98px - 16px)_   | 小程序首页时左侧标题最大宽度 |
| --nav-bar-left-title-padding `v2.7.0`    | _8px_   | 左侧标题模式时的左内边距 |




