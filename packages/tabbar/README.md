---
category: 导航
---

# Tabbar 标签栏

### 介绍

底部导航栏，用于在不同页面之间进行切换。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-tabbar": "@tuya-miniapp/smart-ui/lib/tabbar/index",
  "smart-tabbar-item": "@tuya-miniapp/smart-ui/lib/tabbar-item/index"
}
```

## 代码演示

### 基础用法

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item icon="home-o">标签</smart-tabbar-item>
  <smart-tabbar-item icon="search">标签</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o">标签</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">标签</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 0,
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
  },
});
```

### 通过名称匹配

在标签指定`name`属性的情况下，`v-model`的值为当前标签的`name`。

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item name="home" icon="home-o">标签</smart-tabbar-item>
  <smart-tabbar-item name="search" icon="search">标签</smart-tabbar-item>
  <smart-tabbar-item name="friends" icon="friendsmart-o">标签</smart-tabbar-item>
  <smart-tabbar-item name="setting" icon="setting-o">标签</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 'home',
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },
});
```

### 显示徽标

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item icon="home-o">标签</smart-tabbar-item>
  <smart-tabbar-item icon="search" dot>标签</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o" info="5">标签</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o" info="20">标签</smart-tabbar-item>
</smart-tabbar>
```

### 自定义图标

可以通过 slot 自定义图标，其中 icon slot 代表未选中状态下的图标，icon-active slot 代表选中状态下的图标。

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item info="3">
    <image
      slot="icon"
      src="{{ icon.normal }}"
      mode="aspectFit"
      style="width: 30px; height: 18px;"
    />
    <image
      slot="icon-active"
      src="{{ icon.active }}"
      mode="aspectFit"
      style="width: 30px; height: 18px;"
    />
    自定义
  </smart-tabbar-item>
  <smart-tabbar-item icon="search">标签</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">标签</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 0,
    icon: {
      normal: 'https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png',
      active: 'https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png',
    },
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },
});
```

### 自定义颜色

```html
<smart-tabbar
  active="{{ active }}"
  active-color="#07c160"
  inactive-color="#000"
  bind:change="onChange"
>
  <smart-tabbar-item icon="home-o">标签</smart-tabbar-item>
  <smart-tabbar-item icon="search">标签</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o">标签</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">标签</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 0,
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },
});
```

### 切换标签事件

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item icon="home-o">标签1</smart-tabbar-item>
  <smart-tabbar-item icon="search">标签2</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o">标签3</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">标签4</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 0,
  },
  onClick(event) {
    ty.showToast({
      title: `点击标签 ${event.detail + 1}`,
      icon: 'none',
    });
  },
});
```

### 使用插槽

```html
<smart-tabbar
  active="{{ active }}"
  data-key="active"
  custom-class="tabbar-position"
  safe-area-inset-bottom="{{ false }}"
  bind:change="onChange"
>

  <image style="height: 40px;width:40px;margin: 6px 10px;" src="{{icon.left}}" slot="left" />
  <smart-tabbar-item>
    <smart-icon name="{{defaultIcon1}}" slot="icon"  />
    <smart-icon name="{{defaultIcon1}}" color="red" slot="icon-active"  />
    标签1
  </smart-tabbar-item>
  <smart-tabbar-item>
    <smart-icon name="{{defaultIcon2}}" slot="icon"  />
    <smart-icon name="{{defaultIcon2}}" color="red" slot="icon-active"  />
    标签2
  </smart-tabbar-item>
  <smart-tabbar-item>
    <smart-icon name="{{defaultIcon3}}" slot="icon"  />
    <smart-icon name="{{defaultIcon3}}" color="red" slot="icon-active"  />
    标签3
  </smart-tabbar-item>
  <smart-tabbar-item>
    <smart-icon name="{{defaultIcon4}}" slot="icon"  />
    <smart-icon name="{{defaultIcon4}}" color="red" slot="icon-active"  />
    标签4
  </smart-tabbar-item>
</smart-tabbar>
```

```javascript
import Tornado from '@tuya-miniapp/icons/dist/svg/Tornado';
import Timer from '@tuya-miniapp/icons/dist/svg/Timer';
import TorSnownado from '@tuya-miniapp/icons/dist/svg/Snow';
import Connect from '@tuya-miniapp/icons/dist/svg/Connect';

Page({
  data: {
    active: 0,
    icon: {
      left: 'https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png',
    },
    defaultIcon1: Tornado,
    defaultIcon2: Timer,
    defaultIcon3: TorSnownado,
    defaultIcon4: Connect,
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },
});
```

### 上下颠倒 `v2.5.1`

`upside-down` 属性可以实现组件的上下样式颠倒，让标题在图标的上方。

```html
<smart-tabbar upside-down active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item icon="home-o">标签</smart-tabbar-item>
  <smart-tabbar-item icon="search">标签</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o">标签</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">标签</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 0,
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
  },
});
```

### 结合自定义 tabBar

请参考 [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html) 与 [代码片段](https://developers.weixin.qq.com/s/vaXgTsmQ7hnm)。

## API

### Tabbar Props

| 参数                   | 说明                                               | 类型      | 默认值    |
| ---------------------- | -------------------------------------------------- | --------- | --------- |
| active                 | 当前选中标签的索引        | _number_  | -         |
| active-color           | 选中标签的颜色         | _string_  |  `--tabbar-item-active-color` \| `--app-M1` \| `#3678e3` |
| border                 | 是否展示外边框       | _boolean_ | `true`    |
| fixed                  | 是否固定在底部     | _boolean_ | `true`    |
| inactive-color         | 未选中标签的颜色         | _string_  | `#7d7e80` |
| placeholder            | 固定在底部时，是否在标签位置生成一个等高的占位元素 | _boolean_ | `false`   |
| safe-area-inset-bottom | 是否为 iPhoneX 留出底部安全距离       | _boolean_ | `true`    |
| z-index                | 元素 z-index            | _number_  | `1`       |
| upside-down `v2.5.1`               | 上下颠倒       | _boolean_  | `false`       |

### Tabbar Slot

| 名称        | 说明           |
| ----------- | -------------- |
| -        | 默认插槽，插入子tab页 |
| left `v2.2.0` | tab左侧的插槽   |
| right `v2.2.0` | tab右侧的插槽   |

### Tabbar Event

| 事件名      | 说明           | 参数                                     |
| ----------- | -------------- | ---------------------------------------- |
| bind:change | 切换标签时触发 | event.detail: 当前选中标签的名称或索引值 |

### TabbarItem Props

| 参数                 | 说明                                                           | 类型               | 默认值           |
| -------------------- | -------------------------------------------------------------- | ------------------ | ---------------- |
| dot                  | 是否显示小红点     | _boolean_          | -                |
| icon                 | 图标svg值或图片链接，可选值见 [Icon 组件](/material/smartui?comId=icon&appType=miniapp)               | _string_           | -                |
| icon-prefix          | 图标类名前缀，同 Icon 组件的 [class-prefix 属性](/material/smartui?comId=icon&appType=miniapp#Props) | _string_           | `smart-icon`     |
| info                 | 图标右上角提示信息      | _string \| number_ | -                |
| link-type `v1.10.13` | 链接跳转类型，可选值为 `redirectTo`、`switchTab`、`reLaunch`   | _string_           | `redirectTo`     |
| name     | 标签名称，作为匹配的标识符    | _string \| number_ | 当前标签的索引值 |
| url `v1.10.13`  | 点击后跳转的链接地址, 需要以 `/` 开头   | _string_      | -      |
| disabled `v2.3.5`  | 是否禁用   | _boolean_      | -      |

### TabbarItem Slot

| 名称        | 说明           |
| ----------- | -------------- |
| icon        | 未选中时的图标 |
| icon-active | 选中时的图标   |

### TabbarItem Event

| 名称        | 说明           |
| ----------- | -------------- |
| click        | 点击事件，设置disabled时也会有回调 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --tabbar-height               | _55px_                                 | 标签栏高度              |
| --tabbar-background-color     | _var(--app-B5, #f6f7fb)_               | 标签栏背景颜色          |
| --tabbar-border-color         | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_ | 标签栏边框颜色          |
| --tabbar-item-font-size       | _12px_                                 | 标签项字体大小          |
| --tabbar-item-text-color      | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_ | 标签项文本颜色          |
| --tabbar-item-active-color    | _var(--app-M1, #3678e3)_               | 活动状态项目颜色        |
| --tabbar-item-line-height     | _1_                                    | 标签项行高              |
| --tabbar-item-icon-size       | _22px_                                 | 标签项图标大小          |
| --tabbar-item-margin-bottom   | _4px_                                  | 标签项下边距            |