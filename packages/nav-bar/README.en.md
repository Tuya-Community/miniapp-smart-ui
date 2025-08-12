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

The text style on the homepage is left-aligned and bold by default. Clicking the left text triggers an event.

```html
<smart-nav-bar
  left-text="HomeHomeHomeHomeHome"
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
### Secondary Page

The text style on the secondary page is centered, with a return arrow displayed on the left. Clicking the central text or the left arrow triggers an event.

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

## Custom Icons

You can customize the icon styles for a richer display.

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
### Left Title

For some secondary pages, the title is on the left side, sometimes accompanied by an icon.

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

## Left and Right Text

When both left and right texts are present, you can also use `round` and `safe-area-inset-top` to create a navigation bar suitable for different scenarios.

```html
<smart-nav-bar
  title="Home"
  left-text="Back"
  right-text="Save"
  left-arrow
  bind:click-left="onClickLeft"
  bind:click-left-text="onClickLeftText"
  bind:click-right="onClickRight"
  bind:click-title="onClickTitle"
/>
```

```html
<smart-nav-bar
  title="Timer Setting"
  round="{{true}}"
  left-text="Cancel"
  right-text="Save"
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
  title="Setting"
  round="{{true}}"
  safe-area-inset-top="{{false}}"
  left-arrow="{{true}}"
  right-text="Reset"
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

### Using Slots

Customize content through slots.

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

| Parameter           | Description                             | Type      | Default  |
| ------------------- | --------------------------------------- | --------- | -------  |
| border              | Whether to show bottom border           | _boolean_ | `true`   |
| custom-style        | Custom styles for root node             | _string_  | -        |
| fixed               | Whether to fix at the top               | _boolean_ | `false`  |
| left-arrow          | Whether to show the left arrow          | _boolean_ | `false`  |
| left-text           | Text on the left side                   | _string_  | `''`     |
| left-text-type `v2.0.0`           | The style type of the text on the left side, with a range of `home`、`title`、`back`                           | _string_  | `back`    |
| left-icon `v2.0.0`         | Left Icon                           | _string_  | `''`    |
| left-icon-size `v2.0.0`        | Left-side icon size, default is 32                           | _string \| number_  | `32`    |
| round `v2.1.0`               | Whether to show rounded corners                     | _boolean_ | `false` |
| placeholder         | Whether to leave space when fixed at top| _boolean_ | `false`  |
| right-text          | Text on the right side                  | _string_  | `''`     |
| safe-area-inset-top | Leave top safe distance (status bar height) | _boolean_ | `true`   |
| title               | Title                                   | _string_  | `''`     |
| z-index             | Element z-index                         | _number_  | `1`      |

### Slot

| Name  | Description                |
| ----- | -------------------------- |
| left  | Custom left area content   |
| right | Custom right area content  |
| title | Custom title               |

### Events

| Event Name         | Description               | Parameter |
| ------------------ | ------------------------- | --------- |
| bind:click-left    | Triggered on clicking left back icon | -         |
| bind:click-right   | Triggered on clicking right button | -         |
| bind:click-title `v2.0.0` | Triggered on the central title is clicked | -    |
| bind:click-left-icon `v2.0.0` | Triggered on clicking left icon | -    |
| bind:click-left-text `v2.0.0` | Triggered on clicking left text | -    |

### External Style Classes

| Class Name     | Description          |
| -------------- | -------------------- |
| custom-class   | Root node style class |
| title-class    | Title style class    |
| left-icon-class `v2.0.0` | Left icon style class |
| right-text-class `v2.1.0` | Right text style class |

### Style Variables

The component offers the following CSS variables for custom styles. For usage, please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                            | Description |
| ----------------------------- | ---------------------------------------- | ----------- |
| --nav-bar-height | _var(--app-device-navbar-height, 46px)_ | Navigation bar height |
| --nav-bar-round-min-height `v2.1.0`    | _56px_                               | Minimum height when the navigation bar has rounded corners |
| --nav-bar-round-border-radius `v2.1.0` | 16px 16px 0px 0px                  | Border radius for the navigation bar rounded corners       |
| --nav-bar-background-color | _var(--app-B2, #ffffff)_ | Navigation bar background color |
| --nav-bar-arrow-color | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Navigation bar arrow color |
| --nav-bar-icon-size | _32px_ | Navigation bar icon size |
| --nav-bar-icon-color | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Navigation bar icon color |
| --nav-bar-icon-margin | _0_ | Navigation bar icon margin |
| --nav-bar-text-font-size `v2.1.0`      | _16px_                               | Navigation bar text font size |
| --nav-bar-text-color | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Navigation bar text color |
| --nav-bar-title-font-size | _var(--font-size-lg)_ | Navigation bar title font size |
| --nav-bar-title-font-weight | _600_ | Navigation bar title font weight |
| --nav-bar-title-text-color | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Navigation bar title text color |
| --nav-bar-home-font-size | _22px_ | Navigation bar home font size |
| --nav-bar-home-font-weight | _600_ | Navigation bar home font weight |
| --nav-bar-home-text-color | _var(--app-B2-N1, rgba(0, 0, 0, 1))_ | Navigation bar home text color |
| --nav-bar-right-text-color `v2.5.1`     | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | Text color on the right side of the navigation bar |
| --nav-bar-title-max-width `v2.6.0`     | _56%_   | Width of the Navigation Bar Title |
