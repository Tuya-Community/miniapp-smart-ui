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

首页的文本样式默认左对齐并加粗，点击左侧文本时触发事件。

```html
<smart-nav-bar
  left-text="Home"
  left-text-type="home"
  bind:click-left-text="onClickLeftText"
/>
```

```js
Page({
  onClickLeftText() {
    ty.showToast({ title: I18n.t('clickToReturn'), icon: 'none' });
  },
});
```

### 二级页面

二级页面的文本样式居中，左侧显示返回箭头，点击中央文本或左侧箭头时触发事件。

```html
<smart-nav-bar
  title="Home"
  left-arrow
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
```

```js
Page({
  onClickLeft() {
    ty.showToast({ title: I18n.t('clickToReturn'), icon: 'none' });
  },

  onClickTitle() {
    ty.showToast({ title: I18n.t('clickToTitle'), icon: 'none' });
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
    ty.showToast({ title: I18n.t('clickToReturn'), icon: 'none' });
  },

  onClickLeftIcon() {
    ty.showToast({ title: I18n.t('clickToLeftIcon'), icon: 'none' });
  },

  onClickLeftText() {
    ty.showToast({ title: I18n.t('clickToLeftText'), icon: 'none' });
  },

  onClickTitle() {
    ty.showToast({ title: I18n.t('clickToTitle'), icon: 'none' });
  },

  onClickRight() {
    ty.showToast({ title: I18n.t('clickToRight'), icon: 'none' });
  },
});
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
    ty.showToast({ title: I18n.t('clickToReturn'), icon: 'none' });
  },

  onClickLeftIcon() {
    ty.showToast({ title: I18n.t('clickToLeftIcon'), icon: 'none' });
  },

  onClickLeftText() {
    ty.showToast({ title: I18n.t('clickToLeftText'), icon: 'none' });
  },

  onClickRight() {
    ty.showToast({ title: I18n.t('clickToRight'), icon: 'none' });
  },
});
```

## 左右文本

左右均存在文本的情况，也可以配合 `round` 及 `safe-area-inset-top` 来实现适用于不同场景的导航栏。

```html
<smart-nav-bar
  title="Home"
  left-text="返回"
  right-text="保存"
  left-arrow
  bind:click-left="onClickLeft"
  bind:click-left-text="onClickLeftText"
  bind:click-right="onClickRight"
  bind:click-title="onClickTitle"
/>
```

```html
<smart-nav-bar
  title="定时设置"
  round="{{true}}"
  left-text="取消"
  right-text="保存"
  right-text-class="demo-nav-bar__right"
  safe-area-inset-top="{{false}}"
  bind:click-left="onClickLeft"
  bind:click-left-text="onClickLeftText"
  bind:click-right="onClickRight"
  bind:click-title="onClickTitle"
/>
```

```html
<smart-nav-bar
  title="设置"
  round="{{true}}"
  safe-area-inset-top="{{false}}"
  left-arrow="{{true}}"
  right-text="重置"
  right-text-class="demo-nav-bar__right"
  bind:click-left="onClickLeft"
  bind:click-left-text="onClickLeftText"
  bind:click-right="onClickRight"
  bind:click-title="onClickTitle"
/>
```

```js
Page({
  onClickLeft() {
    ty.showToast({ title: I18n.t('clickToReturn'), icon: 'none' });
  },

  onClickLeftText() {
    ty.showToast({ title: I18n.t('clickToLeftText'), icon: 'none' });
  },

  onClickTitle() {
    ty.showToast({ title: I18n.t('clickToTitle'), icon: 'none' });
  },

  onClickRight() {
    ty.showToast({ title: I18n.t('clickToRight'), icon: 'none' });
  },
});
```

```css
.demo-nav-bar__right {
  --nav-bar-text-color: #007AFF;
}
```

### 使用插槽

通过 slot 定制内容。

```html
<smart-nav-bar
  title="Home"
  left-text="{{I18n.t('return')}}"
  left-arrow
  bind:click-left="onClickLeft"
  bind:click-left-text="onClickLeftText"
  bind:click-title="onClickTitle"
  bind:click-right="onClickRight"
  bind:click-title="onClickTitle"
>
  <smart-icon
    size="32px"
    name="{{ iconPlus }}"
    slot="right"
  />
</smart-nav-bar>
```

```js
import iconPlus from '@tuya-miniapp/icons/dist/svg/Plus';

Page({
  data: {
    iconPlus,
  },

  onClickLeft() {
    ty.showToast({ title: I18n.t('clickToReturn'), icon: 'none' });
  },

  onClickLeftText() {
    ty.showToast({ title: I18n.t('clickToLeftText'), icon: 'none' });
  },

  onClickTitle() {
    ty.showToast({ title: I18n.t('clickToTitle'), icon: 'none' });
  },

  onClickRight() {
    ty.showToast({ title: I18n.t('clickToRight'), icon: 'none' });
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

### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |
| title-class  | 标题样式类   |
| left-icon-class `v2.0.0` | 左侧图标样式类 |
| right-text-class `v2.1.0` | 右侧文字样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --nav-bar-height              | _var(--app-device-navbar-height, 46px)_                                 | 导航栏高度 |
| --nav-bar-round-min-height `v2.1.0`             | _56px_                                 | 导航栏圆角存在时的最小高度 |
| --nav-bar-round-border-radius `v2.1.0`             | _16px 16px 0px 0px_                                 | 是否显示导航栏圆角 |
| --nav-bar-background-color    | _var(--app-B2, #ffffff)_               | 导航栏背景色 |
| --nav-bar-arrow-color         | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏箭头颜色 |
| --nav-bar-icon-size           | _32px_                                 | 导航栏图标大小 |
| --nav-bar-icon-color          | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏图标颜色 |
| --nav-bar-icon-margin         | _0_                                    | 导航栏图标外边距 |
| --nav-bar-text-font-size `v2.1.0`         | _16px_   | 导航栏文字大小 |
| --nav-bar-text-color          | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏文字颜色 |
| --nav-bar-title-font-size     | _var(--font-size-lg)_                  | 导航栏标题文字大小 |
| --nav-bar-title-font-weight   | _600_                                  | 导航栏标题字重 |
| --nav-bar-title-text-color    | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏标题文字颜色 |
| --nav-bar-home-font-size      | _22px_                                 | 导航栏首页文字大小 |
| --nav-bar-home-font-weight    | _600_                                  | 导航栏首页字重 |
| --nav-bar-home-text-color     | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏首页文字颜色 |
| --nav-bar-right-text-color `v2.5.1`     | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | 导航栏右侧文字颜色 |

