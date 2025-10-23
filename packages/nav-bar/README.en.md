---
category: Navigation
---

# NavBar

### Introduction

Provides navigation functionality for the page, commonly used at the top of the page.

### Import

Introduce the component in `app.json` or `index.json`, for details see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-nav-bar": "@tuya-miniapp/smart-ui/lib/nav-bar/index"
}
```

## Code Demos

### Home Page

The text style on the home page is left-aligned by default and bold. Clicking the left text triggers an event; the `background` property from `v2.7.0` can set the background color of the nav-bar.

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
    ty.showToast({ title: 'Click the title', icon: 'none' });
  },
});
```

```less
.demo-nav-bar {
  margin-top: 16px;
}
```

### Secondary Page

Text style on the secondary page is centered, with a back arrow displayed on the left. Clicking the center text or the left arrow triggers an event.

```html
<smart-nav-bar
  title="Settings"
  left-arrow
  bind:click-right="onClickRight"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
<smart-nav-bar
  title="Settings"
  custom-class="demo-nav-bar"
  right-text="Delete"
  right-text-color="#F04C4C"
  left-arrow
  bind:click-right-text="onClickRightText"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
<smart-nav-bar
  title="Settings"
  custom-class="demo-nav-bar"
  right-text="Delete"
  right-text-color="#F04C4C"
  left-text="Cancel"
  bind:click-right-text="onClickRightText"
  bind:click-left-text="onClickLeftText"
  bind:click-title="onClickTitle"
/>
```

```js
Page({
  onClickLeft() {
    wx.showToast({ title: 'click to return', icon: 'none' });
  },
  onClickLeftText() {
    wx.showToast({ title: 'click left text', icon: 'none' });
  },
  onClickRightText() {
    wx.showToast({ title: 'click right text', icon: 'none' });
  },
  onClickTitle() {
    wx.showToast({ title: 'click title', icon: 'none' });
  },
  onClickRight() {
    wx.showToast({ title: 'click right', icon: 'none' });
  },
});
```

## Right Icon

```html
<smart-nav-bar
  title="Settings"
  left-arrow
  right-icon="{{ iconMore }}"
  right-icon-size="32px"
  right-icon-color="var(--app-B2-N1, rgba(0, 0, 0, 1))"
  bind:click-right-icon="onClickRightIcon"
/>
<smart-nav-bar
  title="Settings"
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
    wx.showToast({ title: 'click right icon', icon: 'none' });
  },
});
```



## Custom Icons

Customizable icon styles for a richer display.

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
    ty.showToast({ title: 'click to return', icon: 'none' });
  },

  onClickLeftIcon() {
    ty.showToast({ title: 'click left icon', icon: 'none' });
  },

  onClickLeftText() {
    ty.showToast({ title: 'click left text', icon: 'none' });
  },

  onClickTitle() {
    ty.showToast({ title: 'click title', icon: 'none' });
  },

  onClickRight() {
    ty.showToast({ title: 'click right', icon: 'none' });
  },
});
```

```less
.nav-bar-icon-home {
  margin-left: 16px;
}
```

### Left Title

Some secondary page titles are on the left, or may be accompanied by an icon.

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
    ty.showToast({ title: 'click to return', icon: 'none' });
  },

  onClickLeftIcon() {
    ty.showToast({ title: 'click left icon', icon: 'none' });
  },

  onClickLeftText() {
    ty.showToast({ title: 'click left text', icon: 'none' });
  },

  onClickRight() {
    ty.showToast({ title: 'click right', icon: 'none' });
  },
});
```

## API

### Props

| Parameter           | Description                          | Type      | Default  |
| ------------------- | ------------------------------------ | --------- | -------- |
| border              | Whether to display the bottom border | _boolean_ | `true` `v2.0.0` `false` `v2.7.0`   |
| custom-style        | Custom style for the root node      | _string_  | -        |
| fixed               | Whether to fix at the top           | _boolean_ | `false`  |
| left-arrow          | Whether to show the left arrow       | _boolean_ | `false`  |
| left-text           | Left text                           | _string_  | `''`     |
| left-text-type `v2.0.0`     | Left text style type, options: `home`, `title`, `back` | _string_  | `back`   |
| left-icon `v2.0.0`        | Left icon                             | _string_  | `''`     |
| left-icon-size `v2.0.0`   | Left icon size, default is 32      | _string \| number_ | `32`    |
| round `v2.1.0`            | Whether to show rounded corners     | _boolean_ | `false`  |
| placeholder         | Whether to enable placeholder when fixed at the top | _boolean_ | `false`  |
| right-text          | Right text                          | _string_  | `''`     |
| safe-area-inset-top | Whether to leave top safe distance (status bar height) | _boolean_ | `true`   |
| title               | Title                               | _string_  | `''`     |
| z-index             | Element z-index                     | _number_  | `1`      |
| right-text-color `v2.7.0` | Right text color                   | _string_  | -        |
| right-icon `v2.7.0` | Right icon                          | _string_  | -        |
| right-icon-color `v2.7.0` | Right icon color                   | _string_  | -        |
| right-icon-size `v2.7.0` | Right icon size                    | _number_  | `32px`   |
| left-icon-color `v2.7.0` | Left icon color                    | _string_  | -        |
| background `v2.7.0` | Overall background color            | _string_  | -        |

### Slot

| Name  | Description               |
| ----- | -------------------------- |
| left  | Custom content for the left area |
| right | Custom content for the right area |
| title | Custom title               |

### Events

| Event Name        | Description              | Parameters |
| ------------------| -------------------------| ---------- |
| bind:click-left   | Triggered when clicking the left return icon | -          |
| bind:click-right  | Triggered when clicking the right button     | -          |
| bind:click-title `v2.0.0` | Triggered when clicking the center title | -          |
| bind:click-left-icon `v2.0.0` | Triggered when clicking the left icon | -          |
| bind:click-left-text `v2.0.0` | Triggered when clicking the left text | -          |
| bind:click-right-icon `v2.7.0` | Triggered when clicking the right icon | -          |
| bind:click-right-text `v2.7.0` | Triggered when clicking the right text | -          |

### External Style Classes

| Class Name     | Description      |
| ---------------| -----------------|
| custom-class   | Root node style class |
| title-class    | Title style class |
| left-icon-class `v2.0.0` | Left icon style class |
| right-text-class `v2.1.0` | Right text style class |
| right-icon-class `v2.7.0` | Right icon style class |
| left-text-class `v2.7.0` | Left text style class |

### Style Variables

The component provides the following CSS variables for custom styles. For usage instructions, refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description |
| ----------------------------- | --------------------------------------- | ----------- |
| --nav-bar-height              | _var(--app-device-navbar-height, 46px)_ | Nav bar height |
| --nav-bar-round-min-height `v2.1.0` | _56px_    | Minimum height when rounded corners are present |
| --nav-bar-round-border-radius `v2.1.0` | _16px 16px 0px 0px_    | Whether to show nav bar rounded corners |
| --nav-bar-background-color     | _var(--app-B2, #ffffff)_     | Nav bar background color |
| --nav-bar-arrow-color          | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Nav bar arrow color |
| --nav-bar-icon-size `@deprecated v2.7.0` | _32px_       | Nav bar icon size |
| --nav-bar-icon-color           | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Nav bar icon color |
| --nav-bar-icon-margin `@deprecated v2.7.0` | _0_         | Nav bar icon margin |
| --nav-bar-text-font-size `v2.1.0` | _16px_     | Nav bar text size |
| --nav-bar-text-color           | _var(--app-B2-N2, rgba(0, 0, 0, 1))_ | Nav bar text color |
| --nav-bar-title-font-size      | _17px_    | Nav bar title text size |
| --nav-bar-title-font-weight    | _600_     | Nav bar title font weight |
| --nav-bar-title-text-color     | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Nav bar title text color |
| --nav-bar-home-font-size       | _22px_    | Nav bar home text size |
| --nav-bar-home-font-weight     | _600_    | Nav bar home font weight |
| --nav-bar-home-text-color      | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Nav bar home text color |
| --nav-bar-right-text-color `v2.5.1` | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Nav bar right text color |
| --nav-bar-title-max-width `v2.6.0` | _56%_ `v2.6.0` _calc(100% - 98px - 16px)_ `v2.7.0`   | Width of the Navigation Bar Title | Width of the nav bar title |
| --nav-bar-side-width `v2.7.0` | _98px_     | Side width |
| --nav-bar-text-padding `v2.7.0` | _20px_    | Text padding on both sides |
| --nav-bar-icon-padding `v2.7.0` | _16px_    | Icon padding on both sides |
| --nav-bar-title-margin `v2.7.0` | _16px_    | Title margin |
| --nav-bar-home-max-width `v2.7.0` | _calc(100% - 98px - 16px)_  | Maximum width of the left title when on the home page |
| --nav-bar-left-title-padding `v2.7.0`  | _8px_   | Left padding in left title mode |
