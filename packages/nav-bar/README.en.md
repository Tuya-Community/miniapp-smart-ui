---
category: Navigation
---

# NavBar

### Introduction

Provides navigation functionality for the page, commonly used at the top of the page.

### Import

Import the component in `app.json` or `index.json`, for detailed introduction see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-nav-bar": "@tuya-miniapp/smart-ui/lib/nav-bar/index"
}
```

## Code Demos

### Home Page

The text style on the home page is aligned to the left and bold by default, clicking on the left text triggers an event; the `background` `v2.7.0` property can set the background color of the nav-bar.

```html
<smart-nav-bar
  left-text="Home"
  left-text-type="home"
  bind:click-left-text="onClickLeftText"
/>
<smart-nav-bar
  background="#E4EDFF"
  left-text="HomeHomeHomeHomeHome"
  left-text-type="home"
  bind:click-left-text="onClickLeftText"
/>
```

```js
Page({
  onClickLeftText() {
    ty.showToast({ title: 'Clicked left text', icon: 'none' });
  },
});
```

### Second Page-Single Icon

When the title content in the middle is relatively long, and the content on both sides is relatively short, you can set `v2.7.3` `side-width` to `min`.

```html
<smart-nav-bar
  title="ScheduleScheduleScheduleSchedule"
  left-arrow
  right-icon="{{ iconMore }}"
  side-width="min"
  right-icon-size="24px"
  bind:click-right="onClickRight"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
```

```js
import More from '@tuya-miniapp/icons/dist/svg/More';

Page({
  data: {
    iconMore: More,
  },
  onClickLeft() {
    ty.showToast({ title: 'Clicked back', icon: 'none' });
  },
  onClickTitle() {
    ty.showToast({ title: 'Clicked central text', icon: 'none' });
  },
  onClickRight() {
    ty.showToast({ title: 'Clicked right side', icon: 'none' });
  },
});
```

### Second Page-Common Cases

```html
<smart-nav-bar
  title="ScheduleScheduleScheduleSchedule"
  left-arrow
  right-icon="{{ iconMore }}"
  side-width="mid"
  right-icon-size="24px"
  bind:click-right="onClickRight"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
>
  <smart-icon
    slot="right"
    size="24px"
    style="margin-right: 16px;"
    name="{{ iconHouse }}"
  />
</smart-nav-bar>
<smart-nav-bar
  title="ScheduleScheduleScheduleSchedule"
  side-width="mid"
  right-text="Confirm"
  left-text="Cancel"
  right-text-color="#F04C4C"
  bind:click-right-text="onClickRightText"
  bind:click-left-text="onClickLeftText"
  bind:click-title="onClickTitle"
/>
<smart-nav-bar
  title="ScheduleScheduleScheduleSchedule"
  left-arrow
  side-width="mid"
  right-text="Confirm"
  right-text-color="#F04C4C"
  bind:click-right-text="onClickRightText"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
```

```js
import House from '@tuya-miniapp/icons/dist/svg/House';
import More from '@tuya-miniapp/icons/dist/svg/More';

Page({
  data: {
    iconHouse: House,
    iconMore: More,
  },
  onClickLeft() {
    ty.showToast({ title: 'Clicked back', icon: 'none' });
  },
  onClickLeftText() {
    ty.showToast({ title: 'Clicked left text', icon: 'none' });
  },
  onClickRightText() {
    ty.showToast({ title: 'Clicked right text', icon: 'none' });
  },
  onClickTitle() {
    ty.showToast({ title: 'Clicked central text', icon: 'none' });
  },
  onClickRight() {
    ty.showToast({ title: 'Clicked right side', icon: 'none' });
  },
});
```

### Second Page-Short Title

When there are many operation contents on both sides, you can set `v2.7.3` `side-width` to `max` to reduce the size of the title area.

```html
<smart-nav-bar
  title="ScheduleSchedule"
  left-arrow
  side-width="max"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
<smart-nav-bar
  title="ScheduleSchedule"
  left-text="Abbrechen"
  right-text="Speichern"
  right-text-color="#F04C4C"
  side-width="max"
  bind:click-left-text="onClickLeftText"
  bind:click-title="onClickTitle"
  bind:click-right-text="onClickRightText"
/>
<smart-nav-bar
  title="ScheduleSchedule"
  left-arrow
  right-text="Speichern"
  right-text-color="#F04C4C"
  side-width="max"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
  bind:click-right-text="onClickRightText"
/>
```

```js
Page({
  onClickLeft() {
    ty.showToast({ title: 'Clicked back', icon: 'none' });
  },
  onClickLeftText() {
    ty.showToast({ title: 'Clicked left text', icon: 'none' });
  },
  onClickRightText() {
    ty.showToast({ title: 'Clicked right text', icon: 'none' });
  },
  onClickTitle() {
    ty.showToast({ title: 'Clicked central text', icon: 'none' });
  },
});
```

### Custom Width `v2.7.3`

At the same time, `side-width` supports passing in `100`, `100px`, `100rpx` to customize the width of both sides.

```html
<smart-nav-bar
  title="ScheduleScheduleScheduleSchedule"
  left-arrow
  side-width="100px"
  right-icon="{{ iconMore }}"
  right-icon-size="24px"
  bind:click-right="onClickRight"
  bind:click-left="onClickLeft"
  bind:click-title="onClickTitle"
/>
```

```js
import More from '@tuya-miniapp/icons/dist/svg/More';

Page({
  data: {
    iconMore: More,
  },
  onClickLeft() {
    ty.showToast({ title: 'Clicked back', icon: 'none' });
  },
  onClickTitle() {
    ty.showToast({ title: 'Clicked central text', icon: 'none' });
  },
  onClickRight() {
    ty.showToast({ title: 'Clicked right side', icon: 'none' });
  },
});
```

### Left Title

Some secondary page titles are located on the left side, or have an icon attached.

```html
<smart-nav-bar
  left-text="Home"
  left-text-type="title"
  left-icon="https://images.tuyacn.com/content-platform/hestia/1729664215ebd89f13e54.png"
  bind:click-left-icon="onClickLeftIcon"
  bind:click-left-text="onClickLeftText"
/>
```

```js
Page({
  onClickLeftIcon() {
    ty.showToast({ title: 'Clicked left icon', icon: 'none' });
  },
  onClickLeftText() {
    ty.showToast({ title: 'Clicked left text', icon: 'none' });
  },
});
```

## API

### Props

| Parameter                | Description                               | Type      | Default Value  |
| ------------------- | ---------------------------------- | --------- | ------- |
| border              | Whether to show the bottom border                     | _boolean_ | `true` `v2.0.0` `false` `v2.7.0`  |
| custom-style        | Custom style for the root node                   | _string_  | -       |
| fixed               | Whether to fix at the top                     | _boolean_ | `false` |
| left-arrow          | Whether to show the left arrow                   | _boolean_ | `false` |
| left-text           | Left text                           | _string_  | `''`    |
| left-text-type `v2.0.0`          | The style type of the left text, can be `home`, `title`, `back`                           | _string_  | `back`    |
| left-icon `v2.0.0`         | Left icon                           | _string_  | `''`    |
| left-icon-size `v2.0.0`        | Left icon size, default is 32                           | _string \| number_  | `32`    |
| round `v2.1.0`               | Whether to show rounded corners                     | _boolean_ | `false` |
| placeholder         | Whether to enable placeholder when fixed at the top           | _boolean_ | `false` |
| right-text          | Right text                           | _string_  | `''`    |
| safe-area-inset-top | Whether to leave the top safe inset (status bar height) | _boolean_ | `true`  |
| title               | Title                               | _string_  | `''`    |
| z-index             | Element z-index                       | _number_  | `1`     |
| right-text-color `v2.7.0` | Color of the right text    | _string_  | -   |
| right-icon `v2.7.0` | Right icon    | _string_  | -   |
| right-icon-color `v2.7.0` | Color of the right icon    | _string_  | -   |
| right-icon-size `v2.7.0` | Size of the right icon    | _number_  | `32px`   |
| left-icon-color `v2.7.0` | Color of the left icon    | _string_  | -   |
| background `v2.7.0` | Overall background color    | _string_  | -   |
| side-width `v2.7.3` | Width of the side control bar, provides three built-in values: `min`, `mid`, `max`; also can pass specific width values    | _string\/number\/`min`\/`mid`\/`max`_  | `mid` `v2.7.3` `max` `v2.8.1`   |

### Slot

| Name  | Description               |
| ----- | ------------------ |
| left  | Custom left area content |
| right | Custom right area content |
| title | Custom title         |

### Events

| Event Name           | Description               | Parameters |
| ---------------- | ------------------ | ---- |
| bind:click-left  | Triggered when clicking the left return icon | -    |
| bind:click-right | Triggered when clicking the right button | -    |
| bind:click-title `v2.0.0` | Triggered when clicking the central title | -    |
| bind:click-left-icon `v2.0.0` | Triggered when clicking the left icon | -    |
| bind:click-left-text `v2.0.0` | Triggered when clicking the left text | -    |
| bind:click-right-icon `v2.7.0` | Triggered when clicking the right icon | -    |
| bind:click-right-text `v2.7.0` | Triggered when clicking the right text | -    |

### External Style Classes

| Class Name         | Description         |
| ------------ | ------------ |
| custom-class | Root node style class |
| title-class  | Title style class   |
| left-icon-class `v2.0.0` | Left icon style class |
| right-text-class `v2.1.0` | Right text style class |
| right-icon-class `v2.7.0` | Right icon style class |
| left-text-class `v2.7.0` | Left text style class |

### Style Variables

The component provides the following CSS variables for custom styling. Please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp) for usage.

| Name                          | Default Value                                 | Description |
| ----------------------------- | -------------------------------------- | ---- |
| --nav-bar-height    | _var(--app-device-navbar-height, 46px)_     | Nav Bar Height |
| --nav-bar-round-min-height `v2.1.0`    | _56px_        | Minimum height when rounded corners exist on the nav bar |
| --nav-bar-round-border-radius `v2.1.0`   | _16px 16px 0px 0px_     | Whether to show rounded corners on the nav bar |
| --nav-bar-background-color    | _var(--app-B2, #ffffff)_               | Nav Bar Background Color |
| --nav-bar-arrow-color         | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | Nav Bar Arrow Color |
| --nav-bar-icon-size `@deprecated v2.7.0`   | _32px_     | Nav Bar Icon Size |
| --nav-bar-icon-color          | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | Nav Bar Icon Color |
| --nav-bar-icon-margin `@deprecated v2.7.0`    | _0_      | Nav Bar Icon Margin |
| --nav-bar-text-font-size `v2.1.0`         | _16px_ `v2.1.0` _17px_ `v2.7.3`  | Nav Bar Text Size |
| --nav-bar-text-font-weight `v2.7.0`         | _600_ `v2.7.0` _normal_ `v2.7.3`   | Sidebar text font weight |
| --nav-bar-text-color          | _var(--app-B2-N2, rgba(0, 0, 0, 1))_   | Nav Bar Text Color |
| --nav-bar-title-font-size     | _17px_                  | Nav Bar Title Text Size |
| --nav-bar-title-font-weight   | _600_                                  | Nav Bar Title Font Weight |
| --nav-bar-title-text-color    | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | Nav Bar Title Text Color |
| --nav-bar-home-font-size      | _22px_                                 | Nav Bar Home Text Size |
| --nav-bar-home-font-weight    | _600_                                  | Nav Bar Home Font Weight |
| --nav-bar-home-text-color     | _var(--app-B2-N1, rgba(0, 0, 0, 1))_   | Nav Bar Home Text Color |
| --nav-bar-right-text-color `v2.5.1`  | _var(--app-B2-N1, rgba(0, 0, 0, 1))_  | Nav Bar Right Text Color |
| --nav-bar-title-max-width `v2.6.0`    | _56%_ `v2.6.0` _calc(100% - 98px - 16px)_ `v2.7.0`   | Nav Bar Title Width |
| --nav-bar-side-width `v2.7.0`    | _98px_ `v2.7.0` _80px_ `v2.7.3`   | Width of both sides |
| --nav-bar-text-padding `v2.7.0`    | _20px_ `v2.7.0` _16px_ `v2.7.3`   | Text padding on both sides |
| --nav-bar-icon-padding `v2.7.0`    | _16px_   | Icon padding on both sides |
| --nav-bar-title-margin `v2.7.0`    | _16px_   | Title margin |
| --nav-bar-home-max-width `v2.7.0`    | _calc(100% - 98px - 16px)_   | Maximum width of the left title on the home page of the mini program |
| --nav-bar-left-title-padding `v2.7.0`    | _8px_   | Left padding when in left title mode |
| --nav-bar-side-width-min `v2.7.3`    | _40px_   | Sidebar min width |
| --nav-bar-side-width-max `v2.7.3`    | _105px_   | Max width when sidebar is open |