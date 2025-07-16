---
category: Feedback
---

# ActionSheet Action Panel

### Introduction

A modal panel that pops up from the bottom, containing multiple options related to the current context.

### Import

Import the component in `app.json` or `index.json`. For detailed introduction, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-action-sheet": "@tuya-miniapp/smart-ui/lib/action-sheet/index"
}
```

## Code Demonstration

### Basic Usage

An array of `actions` needs to be passed in, where each item in the array is an object. The object properties are listed in the table below the documentation.

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  bind:close="onClose"
  bind:cancel="onCancel"
  bind:select="onSelect"
/>
```

```javascript
Page({
  data: {
    show: false,
    actions: [
      { id: 0, name: 'Action', checked: true },
      { id: 1, name: 'Action', checked: false },
      { id: 2, name: 'Action', checked: false },
    ],
  },

  onCancel() {
    this.setData({ show: false });
  },

  onClose() {
    console.log('close')
  },

  onSelect(event) {
    console.log(event.detail);
  },
});
```

### Option Status

Options can be set to loading or disabled status.

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  cancel-text="Cancel"
/>
```

```javascript
Page({
  data: {
    show: false,
    actions: [
      { name: 'Colored Option', color: '#ee0a24' },
      { loading: true },
      { name: 'Disabled Option', disabled: true },
    ],
  },
});
```

### Unchecked List

After setting `actions[idx].checked` property to `false`, an unchecked state list can be displayed.

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  cancel-text="Cancel"
/>
```

```javascript
Page({
  data: {
    show: false,
    actions: [{ name: 'Action' }, { name: 'Action' }, { name: 'Action' }],
  },
});
```

### Display Cancel/Confirm Buttons

After setting the `cancel-text` and `confirm-text` properties, a cancel or confirm button will be displayed at the bottom, closing the current menu when clicked.

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  cancel-text="Cancel"
  confirm-text="Confirm"
/>
```

### Display Description Information

After setting the `description` property, a description will be displayed above the options.

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  description="This is a description"
/>
```

### Custom Panel

By setting the `title` property, you can display a title bar, and you can use slots to customize the menu content.

```html
<smart-action-sheet show="{{ show }}" title="Title">
  <view>Content</view>
</smart-action-sheet>
```

## API

### Props

| Parameter                         | Description                                                                                                         | Type      | Default             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------- | ------------------- |
| actions                           | Menu options                                                                                                        | _Array_   | `[]`                |
| active-color                      | Selected state color of the icon in the list option                                                                  | _string_  | `--app-M1` |
| cancel-text                       | Text of the cancel button                                                                                           | _string_  | -                   |
| close-on-click-action             | Whether to close after clicking an option                                                                           | _boolean_ | `true`              |
| close-on-click-overlay            | Whether clicking the overlay closes the menu                                                                        | _boolean_ | `true`              |
| confirm-text                      | Text of the confirm button         | _string_  | -                   |
| description           | Description information above the options   | _string_  | -                   |
| overlay           | Whether to display the overlay     | _boolean_ |  `true`  |
| round       | Whether to show rounded corners                                                                                     | _boolean_ | `true`              |
| safe-area-inset-bottom     | Whether to leave a safe distance at the bottom for iPhoneX                                                          | _boolean_ | `true`              |
| safe-area-inset-bottom-min `v1.1.0` | Whether to reserve a minimum bottom safe distance for when safeArea is 0, only effective when safeAreaInsetBottom is true | _number_  | `16`       |
| show         | Whether to display the action panel                                                                                 | _boolean_ | -                   |
| title           | Title                                                                                                               | _string_  | -                   |
| z-index                           | z-index level                                                                                                       | _number_  | `100`               |
| native-disabled `v2.5.0`     |  Whether to disable local gestures during the opening of the dialog; it will call `ty.nativeDisabled(true)` when the dialog starts the entrance animation, and call `ty.nativeDisabled(false)` at the end of the closing animation to restore the click ability of components on different layers. Since `ty.nativeDisabled` works globally, pay attention to whether to pass the `native-disabled` attribute and the timing of closing when multiple dialog components are opened simultaneously, to prevent the `native-disabled` attribute from being ineffective.   | _boolean_   | `false`        |

### Events

| Event Name          | Description                                             | Parameter                      |
| ------------------- | ------------------------------------------------------- | ------------------------------ |
| bind:after-enter    | Triggered after the overlay enters                       | -                              |
| bind:after-leave    | Triggered after the overlay leaves                       | -                              |
| bind:before-enter   | Triggered before the overlay enters                      | -                              |
| bind:before-leave   | Triggered before the overlay leaves                      | -                              |
| bind:cancel         | Triggered when the cancel button is clicked              | -                              |
| bind:click-overlay  | Triggered when the overlay is clicked                    | -                              |
| bind:close          | Triggered when closed                                   | -                              |
| bind:confirm        | Triggered when the confirm button is clicked             | -                              |
| bind:enter          | Triggered when the overlay is entering                   | -                              |
| bind:leave          | Triggered when the overlay is leaving                    | -                              |
| bind:select         | Triggered when an option is selected, not triggering in disabled or loading state | event.detail: Option object   |


### actions

`actions` in `API` is an array of objects, where each object configures each column with the following `key`:

| Key Name    | Description                   | Type      | Default |
| ----------- | ----------------------------- | --------- | ------- |
| className   | Adds an extra class name to the corresponding column | _string_  | -       |
| color       | Text color of the option      | _string_  | -       |
| disabled    | Whether it's in disabled state | _boolean_ | -       |
| loading     | Whether it's in loading state | _boolean_ | -       |
| name        | Title                         | _string_  | -       |
| subname     | Subtitle                      | _string_  | -       |
| sendMessageImg | Message card image in session, effective when openType="contact" | _string_ | Screenshot |
| sendMessagePath | Path to navigate to the mini-program when clicking on the message card in session, effective when openType="contact" | _string_ | Current sharing path |
| sendMessageTitle | Title of the message card in session, effective when openType="contact" | _string_ | Current title |
| showMessageCard | Whether to display the message card in session. When this parameter is set to true, the user will see "Possible mini-program to send" in the lower right corner when entering the customer service session, which allows for quick mini-program message sending upon clicking. Effective when openType="contact" | _string_ | `false` |


### External Style Classes

| Class Name     | Description            |
| -------------- | ---------------------- |
| custom-class   | Root node style class  |
| list-class     | Style class for `actions` container |

### Style Variables

The component provides the following CSS variables for custom styles. For usage, see the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                           | Default Value                           | Description |
| -----------------------------  | --------------------------------------  | ----------- |
| --action-sheet-width | _calc(100% - 32px)_ | Width of the popup |
| --action-sheet-left | _16px_ | Left position of the popup in absolute positioning |
| --action-sheet-max-height | _90%_ | Maximum height of the popup |
| --action-sheet-margin | _0 0 16px_ | Margin of the popup |
| --action-sheet-active-color | _var(--app-B1, #f6f7fb)_ | The color of the selected icon and the background color of the list when pressed |
| --action-sheet-item-disabled-opacity | _0.3_ | Opacity of the disabled list |
| --action-sheet-header-border-color | _var(--app-B4-N7, rgba(0, 0, 0, 0.1))_ | Border color of the header |
| --action-sheet-header-height | _56px_ | Height of the header |
| --action-sheet-header-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | Font color of the header |
| --action-sheet-header-font-size | _16px_ | Font size of the header |
| --action-sheet-header-font-weight | _normal_ | Font weight of the header |
| --action-sheet-description-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | Color of the description text |
| --action-sheet-description-font-size | _14px_ | Font size of the description text |
| --action-sheet-description-line-height | _20px_ | Line height of the description text |
| --action-sheet-item-background | _var(--app-B4, #ffffff)_ | Background color of the list |
| --action-sheet-item-border-radius | _0_ | Border radius of the list |
| --action-sheet-item-icon-margin | _16px 16px 0 0_ | Icon margin size of the list |
| --action-sheet-item-icon-color | _var(--app-M1, #3678e3)_ | Icon color of the list |
| --action-sheet-item-icon-size | _28px_ | Icon size of the list |
| --action-sheet-item-font-size | _16px_ | Font size of the list text |
| --action-sheet-item-font-weight | _normal_ | Font weight of the list text |
| --action-sheet-item-line-height | _24px_ | Line height of the list text |
| --action-sheet-item-text-color | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | Text color of the list |
| --action-sheet-subname-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | Font color of the second-level name in the list |
| --action-sheet-subname-font-size | _12px_ | Font size of the second-level name in the list |
| --action-sheet-subname-line-height | _20px_ | - |
| --action-sheet-confirm-text-color | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | Font color of the confirm button |
| --action-sheet-confirm-font-weight | _500_ | Font weight of the confirm button |
| --action-sheet-cancel-text-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | Font color of the cancel button |
| --action-sheet-footer-padding-top | _8px_ | Top padding of the footer content |
| --action-sheet-footer-padding-color | _var(--app-B4-N9, rgba(0, 0, 0, 0.05))_ | Spacing color between the footer content and the list |
| --action-sheet-active-icon-color `v2.2.0` | _var(--app-M1, #3678e3)_ | Color of the selected icon in the list |

## FAQ

### Why does the Slider subcomponent used in the ActionSheet render and position incorrectly?

This is because the `Slider` component may not be fully rendered when the `ActionSheet` opens, preventing us from acquiring its DOM, thus causing positioning issues. The solution is to start rendering the `Slider` component after the `onAfterEnter` event callback of the `ActionSheet`. This ensures that the `Slider` is properly rendered when we attempt to acquire its DOM. Please refer to the example below:

```html
<smart-action-sheet
  show="{{ show }}"
  title="Title"
  cancel-text="Action"
  confirm-text="Action"
  bind:close="onClose"
  bind:cancel="onClose"
  bind:confirm="onClose"
  bind:after-enter="onAfterEnter"
>
  <view class="content-number">
    <view class="demo-header">
      <text class="demo-text">{{ currentNumber }}%</text>
    </view>
    <view class="demo-slider">
      <smart-slider
        wx:if="{{ isReady }}"
        instanceId="action-sheet-slider"
        trackStyle="height:45px;border-radius:8px;"
        barStyle="height:45px;border-radius:8px;"
        thumbStyle="width:15px;height:50px;background:#BBC5D4;border:2px solid #FFFFFF;box-shadow:0px 0px 2px 0px rgba(0, 0, 0, 0.5);border-radius:2px;"
        value="{{ currentNumber }}"
        bind:change="onChange"
      />
      <view wx:else style="height: 45px;" />
    </view>
  </view>
</smart-action-sheet>
```

```javascript
Page({
  data: {
    show: false,
    isReady: false,
    currentNumber: 0,
  },

  onClose() {
    this.setData({ show: false });
  },
  
  onAfterEnter() {
    this.setData({ isReady: true })
  },

  onChange(event) {
    this.setData({ currentNumber: event.detail.value });
  },
});
```

```css
.content-number {
  padding: 10px 39px;
  background: var(--app-B1, #f6f7fb);
  text-align: center;
  color: var(--app-B4-N1, #000);
}

.demo-header {
  padding: 10px 39px;
}

.demo-text {
  font-size: 40px;
  font-weight: 600;
  line-height: 46px;
}

.demo-slider {
  margin: 23px 0;
  min-height: 45px;
}
```