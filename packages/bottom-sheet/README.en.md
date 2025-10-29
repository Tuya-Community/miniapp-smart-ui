---
category: Feedback
new: true
---

# BottomSheet

### Introduction

The `BottomSheet` differs from `Popup` and `ActionSheet` in that the safe area is covered by padding, making it suitable for scenarios that require seamless adhesion to the bottom. Added since version v2.0.0.

### Import

Import the component in `app.json` or `index.json`. For details, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-bottom-sheet": "@tuya-miniapp/smart-ui/bottom-sheet/index"
}
```

## Code Examples

### Basic Usage

Passing in a `title` text will trigger a bottom popup with a title to slide up.

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

### Custom panel

Customize the panel by passing in child element nodes

```html
<smart-bottom-sheet
  show="{{ show }}"
  title="Title"
  bind:close="onClose"
>
  <view class="content" />
  <view class="footer">
    <smart-button type="info" block>Complete</smart-button>
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
### Maximum Height Limit

The default maximum height of the bottom popup is not allowed to exceed 50% of the screen, but you can customize the maximum height through `--bottom-sheet-max-height`. In version v2.5.0 and later, the content will automatically scroll inside the component when the maximum height is triggered!

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

### Fixed Height `v2.5.0`

The `content-height` can be used to set the height of the content area. Once `content-height` is set, the maximum height of the component becomes ineffective, allowing you to customize and write content inside.

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

### Insert title using slot `v2.6.1`

```html
<smart-bottom-sheet
  show="{{ show }}"
  bind:close="onClose"
>
  <view slot="title">title</view>
  <view style="background-color: orange; height: 100px;" />
</smart-bottom-sheet>
```

### Draggable `v2.7.1`

```html
<smart-bottom-sheet
  show="{{ show }}"
  bind:close="onClose"
  draggable
>
  <view style="background-color: red; height: 100px;" />
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

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to display the bottom sheet | _boolean_ | `false` |
| title | Title | _string_ | - |
| icon-size | Size of the close button in the title | _string \| number_ | `24` |
| icon-color | Color of the close button in the title | _string_ | `--app-B4-N3` \|\| `rgba(0, 0, 0, 0.5)` |
| round | Whether to display rounded corners | _boolean_ | `true` |
| z-index | z-index level | _number_ | `100` |
| overlay | Whether to display the overlay | _boolean_ | `true` |
| close-on-click-overlay | Whether clicking the overlay closes the menu | _boolean_ | `true` |
| native-disabled `v2.5.0`     |  Whether to disable local gestures during the opening of the dialog; it will call `ty.nativeDisabled(true)` when the dialog starts the entrance animation, and call `ty.nativeDisabled(false)` at the end of the closing animation to restore the click ability of components on different layers. Since `ty.nativeDisabled` works globally, pay attention to whether to pass the `native-disabled` attribute and the timing of closing when multiple dialog components are opened simultaneously, to prevent the `native-disabled` attribute from being ineffective.  | _boolean_   | `false`        |
| content-height `v2.5.0` | Content area height. When this value is set, the component's max-height will be invalid.       | _number \| string_   | `false`        |
| max-height `v2.6.0` | The maximum height of the entire component      | _number \| string_   | -        |
| show-close `v2.6.1` | Whether to display the close icon      | _boolean_   | `true`        |
| draggable `v2.7.1` | Whether dragging to adjust panel height is supported | _boolean_ | `false` |
| min-drag-height `v2.7.1` | Minimum allowed height when dragging | _number_ | `windowHeight * 0.9` |
| max-drag-height `v2.7.1` | Maximum allowed height when dragging | _number_ | `windowHeight * 0.5` |
| mid-drag-height `v2.7.1` | Middle state height when dragging | _number_ | `windowHeight * 0.1` |


### Events

| Event Name         | Description                 | Parameters |
| ------------------ | --------------------------- | ---------- |
| bind:close         | Triggered when closing popup | -         |
| bind:before-enter  | Triggered before entering   | -          |
| bind:enter         | Triggered during entering   | -          |
| bind:after-enter   | Triggered after entering    | -          |
| bind:before-leave  | Triggered before leaving    | -          |
| bind:leave         | Triggered during leaving    | -          |
| bind:after-leave   | Triggered after leaving     | -          |
| bind:click-overlay | Triggered when clicking overlay | -      |


### Slot

| name          | Description           |
| ------------- | -------------- |
| - | content |
| title `v2.6.1` | Title Slot |


### External Style Classes

| Class Name    | Description   |
| ------------- | ------------- |
| custom-class  | Root node style class |

### Style Variables

The component offers the following CSS variables for custom styles. For usage, please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                            | Description |
| ----------------------------- | ---------------------------------------- | ----------- |
| --bottom-sheet-width        | _100%_                           | Width of the bottom sheet    |
| --bottom-sheet-min-height        | _auto_                         | Minimum height of the bottom sheet    |
| --bottom-sheet-max-height  | _50%_    | Maximum height of the bottom sheet    |
| --bottom-sheet-padding  | _0 16px_    | Inner padding of the bottom popup content area    |
| --bottom-sheet-icon-margin  | _16px 16px 0 0_    | Margin of the close icon in the bottom sheet    |
| --bottom-sheet-header-height  | _56px_    | Height of the bottom sheet header    |
| --bottom-sheet-header-color  | _var(--app-B4-N1, rgba(0, 0, 0, 1))_  | Text color of the bottom sheet header   |
| --bottom-sheet-header-font-size  | _17px_    | Font size of the bottom sheet header text    |
| --bottom-sheet-header-font-weight  | _600_    | Font weight of the bottom sheet header text    |
| --bottom-sheet-font-color  | _var(--app-B4-N1, rgba(0, 0, 0, 1))_    | Text color of the bottom sheet    |
| --bottom-sheet-header-padding `v2.5.0`  | _0 16px_    | Padding of the bottom popup header    |
