---
category: Display
new: true
---

# NoticeBar

> v2.0.0 Start joining

### Introduction

Used to loop and display a set of message notifications.

### Import

Introduce the component in `app.json` or `index.json`, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp) for details.

```json
"usingComponents": {
  "smart-notice-bar": "@tuya-miniapp/smart-ui/lib/notice-bar/index"
}
```

## Code Examples

### Basic Usage

When the text is long, you can enable multi-line display by setting the `wrapable` property. The `type` can set the notification type.
```tsx
import Warning from '@tuya-miniapp/icons/dist/svg/Warning';
<smart-notice-bar
  wrapable
  type="info"
  left-icon="{{ Warning }}"
  custom-style="margin-bottom: 10px;"
  text="If they are a regular member of the household, it is recommended to set them as a family member to share all devices and smart scenes at home."
  btnText="Family Settings"
/>
<smart-notice-bar
  wrapable
  type="warning"
  left-icon="{{ Warning }}"
  custom-style="margin-bottom: 10px;"
  text="If they are a regular member of the household, it is recommended to set them as a family member to share all devices and smart scenes at home."
  btnText="Family Settings"
/>
<smart-notice-bar
  wrapable
  type="error"
  left-icon="{{ Warning }}"
  text="If they are a regular member of the household, it is recommended to set them as a family member to share all devices and smart scenes at home."
  btnText="Family Settings"
/>
```
### Basic Usage

Setting `mode` to `closeable` allows the notification to be closed and it will reappear after the page is refreshed.
```tsx
import Warning from '@tuya-miniapp/icons/dist/svg/Warning';
<smart-notice-bar
  wrapable
  mode="closeable"
  left-icon="{{ Warning }}"
  text="If they are a regular member of the household, it is recommended to set them as a family member to share all devices and smart scenes at home."
  btnText="Family Settings"
/>
```

### Overflow Scrolling

When the content length of the notice bar overflows, scrolling playback will be automatically enabled. The behavior can be controlled with the `scrollable` property. The `speed` can control the scrolling speed.

```html
<!-- When the text is short, scrolling playback can be enabled by setting the scrollable property -->
<smart-notice-bar speed="100" scrollable text="Technology is the shared soul of the people who develop it." />

<!-- When the text is long, scrolling playback can be disabled by setting the scrollable property to false -->
<smart-notice-bar
  scrollable="{{ false }}"
  text="The frequency of people swearing while reading code is the only metric for code quality."
/>
```

### Custom Styles

```tsx
import Warning from '@tuya-miniapp/icons/dist/svg/Warning';
<smart-notice-bar
  wrapable
  left-icon="{{ Warning }}"
  text="If they are a regular member of the household, it is recommended to set them as a family member to share all devices and smart scenes at home."
  btnText="Family Settings"
  background="rgba(25, 137, 250, 0.1)"
  color="#1989FA"
  leftIconColor="#0009FA"
  btnTextColor="#0009FA"
/>
```

### Link Mode

When the `mode` is set to `link`, the component will automatically display an arrow icon on the right side, and a `hover` style will be added when clicking the component. Clicking will navigate to the corresponding `url` routing address.
```tsx
import Warning from '@tuya-miniapp/icons/dist/svg/Warning';
<smart-notice-bar
  scrollable="{{ false }}"
  mode="link"
  openType="navigateTo"
  url="/pages/cell/index"
  left-icon="{{ Warning }}"
  text="If they are a regular member of the household, it is recommended to set them as a family member to share all devices and smart scenes at home."
/>
```

### Use Slots

All parts inside the component can be inserted with custom content through slots.
```tsx
import SpeakerWaveLoud from '@tuya-miniapp/icons/dist/svg/SpeakerWaveLoud';
import Warning from '@tuya-miniapp/icons/dist/svg/Warning';
<smart-notice-bar wrapable>
  <smart-icon 
    size="16" 
    color="#1989FA" 
    style="margin-right: 8px;" 
    slot="left-icon" 
    name="{{ SpeakerWaveLoud }}"
  ></smart-icon>
  <text>If they are a regular member of the household, it is recommended to set them as a family member to share all devices and smart scenes at home.</text>
  <text style="color: #1989FA">Family Settings</text>
  <smart-icon 
    size="16" 
    color="#1989FA" 
    slot="right-icon" 
    style="margin-left: 8px;" 
    name="{{ Warning }}"
  ></smart-icon>
</smart-notice-bar>
```

## API

### Props

| Prop        | Description                          | Type      | Default Value |
| ----------- | ------------------------------------ | --------- | ------------- |
| text        | Notification text content            | _string_  | `''`          |
| btn-text    | Button text content                  | _string_  | `''`          |
| btn-text-color | Button text color                | _string_  | `''`          |
| type        | Notification type, options are `info`, `warning`, `error` | _string_  | `'info'`      |
| background  | Background color of the scrolling bar | _string_  | `rgba(25, 137, 250, 0.1)` |
| color       | Notification text color              | _string_  | `#1989fa`     |
| delay       | Animation delay time (ms)            | _number_  | `1`           |
| left-icon   | Left [icon](/material/smartui?comId=icon&appType=miniapp) or image link    | _string_  | -             |
| right-icon-color | Right [icon](/material/smartui?comId=icon&appType=miniapp) color     | _string_  | -             |
| left-icon-color | Left [icon](/material/smartui?comId=icon&appType=miniapp) color       | _string_  | -             |
| left-icon-style | Left [icon](/material/smartui?comId=icon&appType=miniapp) style       | _string_  | -             |
| right-icon-style | Right [icon](/material/smartui?comId=icon&appType=miniapp) style     | _string_  | -             |
| mode        | Notice bar mode, options are `closeable`, `link` | _string_  | `''`          |
| open-type   | Method name for route navigation in `link` mode | _string_  | `navigateTo`  |
| url         | Route navigation address in `link` mode | _string_  | `''`          |
| scrollable  | Whether to enable scrolling playback, enabled by default when content length overflows | _boolean_ | -             |
| speed       | Scrolling speed (px/s)               | _number_  | `60`          |
| wrapable    | Whether to enable text wrapping, effective only when scrolling is disabled | _boolean_ | `false`       |
| custom-style | Root node style                     | _string_  | `''`          |
| custom-hover-class | Root node click style class  | _string_  | `''`          |


### Events

| Event Name  | Description       | Parameters       |
| ----------- | ----------------- | ---------------- |
| bind:click  | Triggered when the notice bar is clicked | _event: Event_ |
| bind:close  | Triggered when the notice bar is closed | _event: Event_ |
| bind:btn-click `v2.7.0` | Triggered when the button text is clicked | _event: Event_ |


### Slot

| Name        | Description                              |
| ----------- | ---------------------------------------- |
| -           | Notification text content, effective only when `text` property is empty |
| left-icon   | Custom left icon                         |
| right-icon  | Custom right icon                        |

### External Style Classes

| Class Name    | Description     |
| ------------- | --------------- |
| custom-class  | Root node style class |

### Style Variables

The component provides the following CSS variables for custom styles. Please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp) for usage.

| Name                             | Default Value                          | Description |
| -------------------------------- | -------------------------------------- | ----------- |
| --notice-bar-font-size           | _14px_                                 | Inner font size |
| --notice-bar-height              | _40px_                                 | Height in single-line mode |
| --notice-bar-icon-size           | _16px_                                 | Icon size |
| --notice-bar-line-height         | _14px_                                 | Inner font line height |
| --notice-bar-padding             | _0 var(--smart-padding-md)_            | Outer box margin in single-line mode |
| --notice-bar-text-color          | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_ `v2.0.0` _rgba(0, 0, 0, 0.5)_ `v2.8.0` | Inner font color |
| --notice-bar-wrapable-padding    | _var(--padding-xs) var(--padding-md)_  | Outer box margin in multi-line mode |
| --notice-bar-background-color    | _#E7F3FE_              | Background color of info type |
| --notice-bar-background-warning-color | _#FFF5E5_           | Background color of warning type |
| --notice-bar-background-error-color | _#FDEDED_            | Background color of error type |
| --notice-bar-info-color          | _#1989fa_                             | Color of the left icon in info type |
| --notice-bar-warning-color       | _#ffa000_                             | Color of the left icon in warning type |
| --notice-bar-error-color         | _#f04c4c_                             | Color of the left icon in error type |
| --notice-bar-right-icon-color `v2.1.7` | _rgba(0, 0, 0, 0.2)_              | right icon color    |
| --notice-bar-left-icon-margin-right | _8px_                             | Right margin of the left icon |
| --notice-bar-right-icon-margin-left | _8px_                             | Left margin of the right icon |