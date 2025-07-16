---
category: Feedback
---

# Popup

### Introduction

Popup container for displaying popups, information prompts, etc., supporting multiple layered displays.

### Import

Import the component in `app.json` or `index.json`. For details, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-popup": "@tuya-miniapp/smart-ui/lib/popup/index"
}
```

## Code Examples

### Basic Usage

Control the display of the popup using the `show` property.

```html
<smart-cell title="Show Popup" is-link bind:click="showPopup" />

<smart-popup show="{{ show }}" bind:close="onClose">Content</smart-popup>
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

### Popup Position

Set the popup position using the `position` property. The default is centered. It can be set to `top`, `bottom`, `left`, or `right`.

```html
<smart-popup
  show="{{ show }}"
  position="top"
  custom-style="height: 20%;"
  bind:close="onClose"
/>
```

### Close Icon

After setting the `closeable` property, a close icon will appear in the upper right corner of the popup. You can customize the icon with the `close-icon` property and set the icon position using `close-icon-position`.

```html
<smart-popup
  show="{{ show }}"
  closeable
  position="bottom"
  custom-style="height: 20%"
  bind:close="onClose"
/>

<!-- Custom Icon -->
<smart-popup
  show="{{ show }}"
  closeable
  close-icon="close"
  position="bottom"
  custom-style="height: 20%"
  bind:close="onClose"
/>

<!-- Icon Position -->
<smart-popup
  show="{{ show }}"
  closeable
  close-icon-position="top-left"
  position="bottom"
  custom-style="height: 20%"
  bind:close="onClose"
/>
```

### Rounded Corners

Setting the `round` property adds different rounded corner styles based on the popup position.

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

| Parameter                          | Description                                                                                                                                             | Type               | Default     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| close-icon                         | Name or URL of the close icon             | _string_           | `cross`     |
| close-icon-position                | Close icon position, options: `top-left`, `bottom-left`, `bottom-right`          | _string_           | `top-right` |
| close-on-click-overlay             | Whether to close when clicking the overlay      | _boolean_          | `true`      |
| closeable                          | Whether to show the close icon             | _boolean_          | `false`     |
| custom-style                       | Custom popup style           | _string_           | `''`        |
| duration                           | Animation duration in milliseconds        | _number \| object_ | `300`       |
| lock-scroll                        | Whether to lock background scrolling          | _boolean_          | `true`      |
| overlay                            | Whether to show overlay   | _boolean_          | `true`      |
| overlay-style                      | Custom overlay style          | _string_           | `''`        |
| position                           | Popup position, options: `top`, `bottom`, `right`, `left`         | _string_           | `center`    |
| round                              | Whether to display rounded corners          | _boolean_          | `false`     |
| safe-area-inset-bottom             | Whether to reserve bottom safe area for iPhoneX        | _boolean_          | `true`      |
| safe-area-inset-bottom-min `v1.1.0` | Whether to reserve a minimum bottom safe area to be added when the safeArea bottom is 0, effective when safeAreaInsetBottom is true                      | _number_           | `0`         |
| safe-area-inset-top                | Whether to reserve top safe distance (status bar height)       | _boolean_          | `false`     |
| safe-area-tab-bar                  | Whether to reserve bottom tabbar safe distance (when using tabbar component & custom tabbar in mini-programs, the popup cannot cover the tabbar)        | _boolean_          | `false`     |
| show                               | Whether to display the popup       | _boolean_          | `false`     |
| z-index                            | z-index level           | _number_           | `100`       |
| native-disabled `v2.3.8` |  Whether to disable local gestures during the opening of the dialog; it will call `ty.nativeDisabled(true)` when the dialog starts the entrance animation, and call `ty.nativeDisabled(false)` at the end of the closing animation to restore the click ability of components on different layers. Since `ty.nativeDisabled` works globally, pay attention to whether to pass the `native-disabled` attribute and the timing of closing when multiple dialog components are opened simultaneously, to prevent the `native-disabled` attribute from being ineffective. | _boolean_ | `false` |

### Events

| Event Name         | Description                 | Parameters |
| ------------------ | --------------------------- | ---------- |
| bind:after-enter   | Triggered after entering    | -          |
| bind:after-leave   | Triggered after leaving     | -          |
| bind:before-enter  | Triggered before entering   | -          |
| bind:before-leave  | Triggered before leaving    | -          |
| bind:click-overlay | Triggered when clicking overlay | -      |
| bind:close         | Triggered when closing popup | -         |
| bind:enter         | Triggered during entering   | -          |
| bind:leave         | Triggered during leaving    | -          |

### External Style Classes

| Class Name    | Description   |
| ------------- | ------------- |
| custom-class  | Root node style class |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description              |
| ----------------------------- | ---------------------------------------- | ------------------------ |
| --popup-background-color      | _var(--app-B4, #ffffff)_                 | Popup background color   |
| --popup-round-border-radius   | _16px_                                   | Round border radius      |
| --popup-close-icon-size       | _24px_                                   | Close icon size          |
| --popup-close-icon-color      | _#969799_                                | Close icon color         |
| --popup-close-icon-margin     | _12px_                                   | Close icon margin        |
| --popup-close-icon-z-index    | _1_                                      | Close icon z-index       |
