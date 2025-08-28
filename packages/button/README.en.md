---
category: General
---

# Button

### Introduction

Buttons are used to trigger actions, such as submitting a form.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-button": "@tuya-miniapp/smart-ui/lib/button/index"
}
```

## Code Examples

### Button Types

Supports five types: `default`, `primary`, `info`, `warning`, and `danger`. Default is `default`.

```html
<smart-button type="default">Default Button</smart-button>
<smart-button type="primary">Primary Button</smart-button>
<smart-button type="info">Info Button</smart-button>
<smart-button type="warning">Warning Button</smart-button>
<smart-button type="danger">Danger Button</smart-button>
```

### Plain Button

Set the button as plain using the `plain` attribute. The text is the button color, and the background is white.

```html
<smart-button plain type="primary">Plain Button</smart-button>
<smart-button plain type="info">Plain Button</smart-button>
```

### Thin Border

Enable a 0.5px border using the `hairline` attribute, implemented via pseudo-classes.

```html
<smart-button plain hairline type="primary">Thin Border Button</smart-button>
<smart-button plain hairline type="info">Thin Border Button</smart-button>
```

### Disabled State

Disable the button with the `disabled` attribute. The `bind:click` event won't trigger.

```html
<smart-button disabled type="primary">Disabled State</smart-button>
<smart-button disabled type="info">Disabled State</smart-button>
```

### Loading State

```html
<smart-button loading type="primary" />
<smart-button loading type="primary" loading-type="spinner" />
<smart-button loading type="info" loading-text="Loading..." />
```

### Button Shape

```html
<smart-button square type="primary">Square Button</smart-button>
<smart-button round type="info">Round Button</smart-button>
```

### Icon Button

Set an icon with the `icon` attribute. Supports all icons in the Icon component or an icon URL.

```html
<smart-button icon="{{ iconAdd }}" type="primary" />
<smart-button icon="{{ iconAdd }}" type="primary">Button</smart-button>
<smart-button icon="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" type="info">
  Button
</smart-button>
```

### Button Sizes

Supports four sizes: `large`, `normal`, `small`, `mini`. Default is `normal`.

```html
<smart-button type="primary" size="large">Large Button</smart-button>
<smart-button type="primary" size="normal">Normal Button</smart-button>
<smart-button type="primary" size="small">Small Button</smart-button>
<smart-button type="primary" size="mini">Mini Button</smart-button>
```

### Block Element

Set the element type as block with the `block` attribute.

```html
<smart-button type="primary" block>Block Element</smart-button>
```

### Custom Colors

Customize button color with the `color` attribute.

```html
<smart-button color="#7232dd">Single Color Button</smart-button>
<smart-button color="#7232dd" plain>Single Color Button</smart-button>
<smart-button color="linear-gradient(to right, #4bb0ff, #6149f6)">
  Gradient Button
</smart-button>
```

## API

### Props

| Parameter    | Description                                              | Type      | Default      |
| ------------ | -------------------------------------------------------- | --------- | ------------ |
| block        | Whether it's a block-level element                       | _boolean_ | `false`      |
| button-id    | Identifier for native button component id value          | _string_  | -            |
| class-prefix | Icon class name prefix, same as [Icon component class-prefix](/material/smartui?comId=icon&appType=miniapp) | _string_  | `smart-icon` |
| color        | Button color, supports `linear-gradient`                 | _string_  | -            |
| custom-style | Custom style                                             | _string_  | -            |
| disabled     | Whether to disable the button                            | _boolean_ | `false`      |
| hairline     | Whether to use 0.5px border                              | _boolean_ | `false`      |
| icon         | Left icon or image URL, see [Icon component options](/material/smartui?comId=icon&appType=miniapp) | _string_  | -            |
| id           | Identifier                                               | _string_  | -            |
| loading      | Whether to display loading state                         | _boolean_ | `false`      |
| loading-size | Loading icon size                                        | _string_  | `20px`       |
| loading-text | Loading state text                                       | _string_  | -            |
| text-style   | Button Text Style                                         | _string_  | -            |
| loading-type | Loading icon type, options: `spinner`                    | _string_  | `circular`   |
| plain        | Whether it's a plain button                              | _boolean_ | `false`      |
| right-icon   | Right icon or image URL, see [Icon component options](/material/smartui?comId=icon&appType=miniapp) | _string_  | -            |
| round        | Whether it's a round button                              | _boolean_ | `false`      |
| size         | Button size, options: `normal` `large` `small` `mini`    | _string_  | `normal`     |
| square       | Whether it's a square button                             | _boolean_ | `false`      |
| type         | Button type, options: `primary` `info` `warning` `danger`| _string_  | `default`    |
| send-message-img | sendMessageImg | _string_ | Screenshot |
| send-message-path | Path for mini-program redirection in session message card | _string_ | Current share path |
| send-message-title | Session message card title | _string_ | Current title |
| session-from | Session source | _string_ | - |
| show-message-card | Display session message card | _string_ | `false` |


### Events

| Event Name  | Description                                             | Parameter |
| ----------- | ------------------------------------------------------- | --------- |
| bind:click  | Triggered when button is clicked, not in loading/disabled state | -    |
| bind:error  | Callback for errors when using open capabilities       | - |
| bind:getrealtimephonenumber `v1.10.21` | Real-time phone number verification callback when open-type=getRealtimePhoneNumber | - |
| bind:opensetting | Callback after opening the authorization settings page | - |


> Button provides a click event instead of the native tap event. When the button is disabled, the click event will not fire, but the tap event will.

### External Style Classes

| Class Name   | Description         |
| ------------ | ------------------- |
| custom-class | Root node style     |
| loading-class| Loading icon style  |
| hover-class | Style when the button is pressed |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).
| Name                                          | Default Value                                  | Description                           |
| --------------------------------------------- | ---------------------------------------------- | ------------------------------------- |
| --button-mini-height                          | _22px_                                         | Mini button height                    |
| --button-mini-min-width                       | _50px_                                         | Mini button minimum width             |
| --button-mini-font-size                       | _10px_                                         | Mini button font size                 |
| --button-small-height                         | _30px_                                         | Small button height                   |
| --button-small-font-size                      | _12px_                                         | Small button font size                |
| --button-small-min-width                      | _60px_                                         | Small button minimum width            |
| --button-normal-font-size                     | _14px_                                         | Normal button font size               |
| --button-large-height                         | _48px_                                         | Large button height                   |
| --button-default-color                        | _var(--app-B1-N1, rgba(0, 0, 0, 1))_           | Default button text color             |
| --button-default-height                       | _48px_                                         | Default button height                 |
| --button-default-font-size                    | _16px_                                         | Default button font size              |
| --button-default-background-color             | _var(--app-B3, #ffffff)_                       | Default button background color       |
| --button-default-border-color                 | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_         | Default button border color           |
| --button-primary-color                        | _#fff_                                         | Primary button text color             |
| --button-primary-background-color             | _var(--app-M3, #2dda86)_                       | Primary button background color       |
| --button-primary-border-color                 | _var(--app-M3, #2dda86)_                       | Primary button border color           |
| --button-info-color                           | _#fff_                                         | Info button text color                |
| --button-info-background-color                | _var(--app-M4, #1989fa)_                       | Info button background color          |
| --button-info-border-color                    | _var(--app-M4, #1989fa)_                       | Info button border color              |
| --button-danger-color                         | _#fff_                                         | Danger button text color              |
| --button-danger-background-color              | _var(--app-M2, #f04c4c)_                       | Danger button background color        |
| --button-danger-border-color                  | _var(--app-M2, #f04c4c)_                       | Danger button border color            |
| --button-warning-color                        | _#fff_                                         | Warning button text color             |
| --button-warning-background-color             | _var(--app-M5, #ffa000)_                       | Warning button background color       |
| --button-warning-border-color                 | _var(--app-M5, #ffa000)_                       | Warning button border color           |
| --button-line-height                          | _20px_                                         | Button line height                    |
| --button-border-width                         | _1px_                                          | Button border width                   |
| --button-border-radius                        | _10px_                                         | Button border radius                  |
| --button-round-border-radius                  | _999px_                                        | Round button border radius            |
| --button-plain-background-color               | _#fff_                                         | Plain button background color         |
| --button-disabled-opacity                     | _0.3_                                          | Disabled button opacity               |
| --button-font-weight                          | _normal_                                       | Button font weight                    |
| --button-primary-font-weight                  | _600_                                          | Primary button font weight            |