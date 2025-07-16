---
category: Navigation
---

# Tabbar

### Introduction

Bottom navigation bar for switching between different pages.

### Import

Import the component in `app.json` or `index.json`. For a detailed introduction, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-tabbar": "@tuya-miniapp/smart-ui/lib/tabbar/index",
  "smart-tabbar-item": "@tuya-miniapp/smart-ui/lib/tabbar-item/index"
}
```

## Code Demonstration

### Basic Usage

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item icon="home-o">Label</smart-tabbar-item>
  <smart-tabbar-item icon="search">Label</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o">Label</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">Label</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 0,
  },
  onChange(event) {
    // event.detail is the index of the current selected item
    this.setData({ active: event.detail });
  },
});
```

### Match by Name

When specifying the `name` property for tag, the `v-model` value is the `name` of the current tag.

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item name="home" icon="home-o">Label</smart-tabbar-item>
  <smart-tabbar-item name="search" icon="search">Label</smart-tabbar-item>
  <smart-tabbar-item name="friends" icon="friendsmart-o">Label</smart-tabbar-item>
  <smart-tabbar-item name="setting" icon="setting-o">Label</smart-tabbar-item>
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

### Show Badge

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item icon="home-o">Label</smart-tabbar-item>
  <smart-tabbar-item icon="search" dot>Label</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o" info="5">Label</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o" info="20">Label</smart-tabbar-item>
</smart-tabbar>
```

### Custom Icon

Icons can be customized through slots, where the icon slot represents the icon in an unselected state and the icon-active slot represents the icon in a selected state.

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
    Custom
  </smart-tabbar-item>
  <smart-tabbar-item icon="search">Label</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">Label</smart-tabbar-item>
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

### Custom Colors

```html
<smart-tabbar
  active="{{ active }}"
  active-color="#07c160"
  inactive-color="#000"
  bind:change="onChange"
>
  <smart-tabbar-item icon="home-o">Label</smart-tabbar-item>
  <smart-tabbar-item icon="search">Label</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o">Label</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">Label</smart-tabbar-item>
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

### Tab Switch Event

```html
<smart-tabbar active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item icon="home-o">Label 1</smart-tabbar-item>
  <smart-tabbar-item icon="search">Label 2</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o">Label 3</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">Label 4</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 0,
  },
  onClick(event) {
    wx.showToast({
      title: `Clicked on label ${event.detail + 1}`,
      icon: 'none',
    });
  },
});
```

### Using Slots

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
    Label 1
  </smart-tabbar-item>
  <smart-tabbar-item>
    <smart-icon name="{{defaultIcon2}}" slot="icon"  />
    <smart-icon name="{{defaultIcon2}}" color="red" slot="icon-active"  />
    Label 2
  </smart-tabbar-item>
  <smart-tabbar-item>
    <smart-icon name="{{defaultIcon3}}" slot="icon"  />
    <smart-icon name="{{defaultIcon3}}" color="red" slot="icon-active"  />
    Label 3
  </smart-tabbar-item>
  <smart-tabbar-item>
    <smart-icon name="{{defaultIcon4}}" slot="icon"  />
    <smart-icon name="{{defaultIcon4}}" color="red" slot="icon-active"  />
    Label 4
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

### Custom tabBar Integration

Refer to [WeChat Official Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html) and [Code Snippets](https://developers.weixin.qq.com/s/vaXgTsmQ7hnm).

### Upside Down `v2.5.1`

The `upside-down` attribute can achieve the top-bottom inversion of the component style, allowing the title to be above the icon.

```html
<smart-tabbar upside-down active="{{ active }}" bind:change="onChange">
  <smart-tabbar-item icon="home-o">Label</smart-tabbar-item>
  <smart-tabbar-item icon="search">Label</smart-tabbar-item>
  <smart-tabbar-item icon="friendsmart-o">Label</smart-tabbar-item>
  <smart-tabbar-item icon="setting-o">Label</smart-tabbar-item>
</smart-tabbar>
```

```javascript
Page({
  data: {
    active: 0,
  },
  onChange(event) {
    // event.detail is the index of the current selected item
    this.setData({ active: event.detail });
  },
});
```

## API

### Tabbar Props

| Parameter               | Description                                        | Type      | Default Value    |
| ---------------------- | -------------------------------------------------- | --------- | ---------------- |
| active                 | Index of currently selected tab                    | _number_  | -                |
| active-color           | Color of the selected tab                          | _string_  | `--tabbar-item-active-color` \| `--app-M1` \| `#3678e3` |
| border                 | Whether to display an outer border                 | _boolean_ | `true`           |
| fixed                  | Whether to fix at the bottom                       | _boolean_ | `true`           |
| inactive-color         | Color of the non-selected tab                      | _string_  | `#7d7e80`        |
| placeholder            | Whether to generate a height-equal placeholder at tab position when fixed at bottom | _boolean_ | `false`          |
| safe-area-inset-bottom | Whether to reserve bottom safe area for iPhoneX    | _boolean_ | `true`           |
| z-index                | Element z-index                                    | _number_  | `1`              |
| upside-down `v2.5.1`   | Top-bottom inversion                               | _boolean_ | `false`          |

### Tabbar Slot

| Name        | Description           |
| ----------- | ---------------------- |
| -           | Default slot, insert sub-tabs |
| left `v2.2.0` | Slot on the left side of the tab |
| right `v2.2.0` | Slot on the right side of the tab |

### Tabbar Event

| Event Name    | Description          | Parameters                                    |
| ------------- | -------------------- | --------------------------------------------- |
| bind:change   | Triggered on tab switch | event.detail: The name or index of the currently selected tab |

### TabbarItem Props

| Parameter             | Description                                      | Type               | Default Value     |
| --------------------- | ------------------------------------------------ | ------------------ | ------------------ |
| dot                   | Whether to show a dot                            | _boolean_          | -                  |
| icon                  | Icon SVG value or image link, optional values see [Icon component](/material/smartui?comId=icon&appType=miniapp) | _string_           | -                  |
| icon-prefix           | Icon class name prefix, same as Icon component's [class-prefix attribute](/material/smartui?comId=icon&appType=miniapp#Props) | _string_           | `smart-icon`       |
| info                  | Icon upper right corner information              | _string \| number_ | -                  |
| link-type `v1.10.13` | Type of link jump, optional values are `redirectTo`, `switchTab`, `reLaunch` | _string_           | `redirectTo`       |
| name                  | Tab name as an identifier                        | _string \| number_ | Current tab index |
| url `v1.10.13`       | The address of the link to jump to, must start with `/` | _string_      | -                  |
| disabled `v2.3.5`   | Whether to disable                                 | _boolean_      | -                  |

### TabbarItem Slot

| Name        | Description           |
| ----------- | ---------------------- |
| icon        | Icon when not selected |
| icon-active | Icon when selected     |

### TabbarItem Event

| Name        | Description           |
| ----------- | ---------------------- |
| click       | Click event, there will be a callback even when setting disabled |

### Style Variables

The component provides the following CSS variables for customizing the style. For usage, refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                        | Default Value                          | Description         |
| --------------------------- | -------------------------------------- | ------------------- |
| --tabbar-height             | _55px_                                 | Tab bar height      |
| --tabbar-background-color   | _var(--app-B5, #f6f7fb)_               | Tab bar background color |
| --tabbar-border-color       | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_ | Tab bar border color |
| --tabbar-item-font-size     | _12px_                                 | Tab item font size  |
| --tabbar-item-text-color    | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_ | Tab item text color |
| --tabbar-item-active-color  | _var(--app-M1, #3678e3)_               | Active state item color |
| --tabbar-item-line-height   | _1_                                    | Tab item line height |
| --tabbar-item-icon-size     | _22px_                                 | Tab item icon size  |
| --tabbar-item-margin-bottom | _4px_                                  | Tab item bottom margin |