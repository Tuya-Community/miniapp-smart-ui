---
category: Data Entry
---

# Field Input Box

### Introduction

Users can enter or edit text within the text box.

### Import

Introduce the component in `app.json` or `index.json`, detailed description can be found in [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-field": "@tuya-miniapp/smart-ui/lib/field/index"
}
```

## Code Demonstration

### Basic Usage

`hidden-label` can hide the entire left content.

```html
<smart-cell-group>
  <smart-field 
    value="{{ value }}" 
    label="Title"
    placeholder="Please enter" 
    bind:change="onChange"
  />
  <smart-field 
    value="{{ value }}"
    hidden-label
    placeholder="{{I18n.t('pleaseEnter')}}" 
  />
</smart-cell-group>
```

```js
Page({
  data: {
    value: '',
    value2: '',
  },

  onChange(event) {
    // event.detail is the current input value
    console.log(event.detail);
  },
  onChange2(event) {
    this.setData({
      value2: event.detail
    })
  }
});
```

### Custom Types

Define different types of input boxes according to the `type` attribute; `card-mode` enables the card input mode.

```html
<smart-cell-group>
  <smart-field
    value="{{ password }}"
    type="password"
    label="Password"
    placeholder="Please enter"
  />
  <smart-field
    value="{{ num }}"
    card-mode
    type="number"
    sub-label="Subtitle"
    label="Title"
    placeholder="Please enter"
  />
</smart-cell-group>
```

### Disabled Input Box

`disabled` can set the entire input box to be disabled.

```html
<smart-cell-group>
  <smart-field
    placeholder="Input box disabled"
    label="Title"
    disabled
  />
  <smart-field
    card-mode
    disabled
    sub-label="Subtitle"
    label="Title"
    placeholder="Please enter"
  />
</smart-cell-group>
```

### Display Icon

Use the slot `left-icon` to insert an icon on the left side.

```html 
<smart-cell-group>
  <smart-field
    label="Title"
    placeholder="Please enter"
  >
    <smart-icon name="{{ sunIcon }}" slot="left-icon" color="#3678E3" size="22" />
  </smart-field>
  <smart-field
    value="{{ num }}"
    card-mode
    label="Title"
    placeholder="Please enter"
  >
    <image 
      slot="left-icon"
      style="height: 50px; width: 50px;"
      src="https://images.tuyacn.com/rms-static/974a30f0-a624-11ef-be03-d1a4feb99779-1731986155903.png?tyName=light-img" 
    />
  </smart-field>
</smart-cell-group>
```

### Error Message

Add the corresponding error message through the `error-message` attribute; setting `inter-error` can override the content of `placeholder`.

```html
<smart-cell-group>
  <smart-field
    label="Title"
    error-message="Please enter username"
    inter-error
    required
  />
  <smart-field
    value="{{ value2 }}"
    label="Title"
    placeholder="Please enter"
    error-message="Format error"
    required
  />
  <smart-field
    value="{{ num }}"
    card-mod
    label="Title"
    sub-label="Title"
    placeholder="Please enter"
    error-message="Format error"
    required
  >
    <image 
      slot="left-icon"
      style="height: 50px; width: 50px;"
      src="https://images.tuyacn.com/rms-static/974a30f0-a624-11ef-be03-d1a4feb99779-1731986155903.png?tyName=light-img" 
    />
  </smart-field>
</smart-cell-group>
```

### Insert Button

You can insert a button at the end of the input box through the button slot.

```html
<smart-cell-group>
  <smart-cell-group>
    <smart-field
      label="Title"
      placeholder="Please enter SMS verification code"
      type="number"
      input-align="left"
    >
      <smart-button slot="button" type="info" custom-class="button">Send Code</smart-button>
    </smart-field>
  </smart-cell-group>
</smart-cell-group>
```

### Message

When the type is set to `textarea` mode, the number of entered words and the limit number can be displayed at the end.

```html
<smart-field
  value="{{ message }}"
  label="Matters"
  type="textarea"
  placeholder="Please enter the message"
  show-word-limit
  maxlength="{{ 200 }}"
/>
```

### Replace Input Box Value

In WeChat Mini Program, the bind:input event can replace the input box value and adjust the cursor position by returning a string or an object. In Smart UI, this can be achieved by calling the callback function in the change or input parameter with the provided parameters.

```html
<smart-field
  value="{{ value }}"
  placeholder="Please enter username"
  clearable
  extra-event-params
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    value: '',
  },
  onChange(e) {
    const { value, callback } = e.detail;

    callback({
      value: value + 1,
      cursor: 0,
    });
  },
});
```

## Frequently Asked Questions

### Why does the placeholder appear bold and flicker when focusing on a real device?

Since the input component and textarea component of the WeChat Mini Program are native components, focusing will cover the corresponding position with a native input box, causing this phenomenon.

Related discussion can be seen at [WeChat Open Community](https://developers.weixin.qq.com/community/search?query=placeholder%20%E9%97%AA%E7%83%81%20%E5%8A%A0%E7%B2%97).

### Why does the placeholder cover other components like popup on a real device?

Due to the native component constraints of the WeChat Mini Program's input and textarea components, more details can be found in [Native Component Description](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html).

### Why does the placeholder of the textarea shift on real devices?

The textarea component in WeChat Mini Program has different default styles in Android and iOS. In iOS, there is default padding that cannot be set to zero.

Additionally, many CSS properties like `vertical-align` and `line-height` do not apply to `placeholder-style`.

This causes the placeholder to possibly shift on real devices.

WeChat has supported the removal of default padding since the `2.10.0` base library version, but lower versions still have this problem. More details can be found at [WeChat Open Community](https://developers.weixin.qq.com/community/develop/issue/96).

### Why does the handwriting input method lose some characters / not trigger the input event?

This is an issue with the WeChat Mini Program's input component. To accommodate handwriting input scenarios, you can get the input value in the `blur` event.

Related discussion can be seen at [WeChat Open Community](https://developers.weixin.qq.com/community/search?query=input%20%E6%89%8B%E5%86%99%E8%BE%93%E5%85%A5&page=1&block=1&random=1567079239098).

### How to enlarge the clickable area? How to trigger the keyboard by clicking the label or error message?

Upgrade to version 1.10.21 or above, and configure the `name` attribute.

## API

### Props

| Parameter                    | Description                                                                                                   | Type                | Default |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------- | ------- |
| adjust-position              | Whether the page is automatically pushed up when the keyboard pops up                                         | _boolean_           | `true`  |
| always-embed `v1.9.2`        | Force the input to stay in the same layer state. The default is that the input will switch to a different layer when focused (only effective on iOS) | _boolean_           | `false` |
| arrow-direction              | Arrow direction, optional values are `left` `up` `down`                                                       | _string_            | -       |
| auto-focus  `@deprecated Mini program not supported`                 | Auto focus, raise the keyboard                                                                                | _boolean_           | `false` |
| autosize                     | Whether to adapt the content height, only effective for textarea, <br>can pass an object, such as { maxHeight: 100, minHeight: 50 }, <br>unit is `px` | _boolean \| object_ | `false` |
| border                       | Whether to show the inner border                                                                              | _boolean_           | `false` |
| center                       | Whether to vertically center the content                                                                      | _boolean_           | `false` |
| clear-trigger `v1.8.4`       | When to show the clear icon, `always` means to display when the input box is not empty, <br>`focus` means to display when the input box is focused and not empty | _string_            | `focus` |
| clearable                    | Whether to enable the clear control                                                                           | _boolean_           | `false` |
| clickable                    | Whether to enable click feedback                                                                              | _boolean_           | `false` |
| confirm-hold                 | Whether to keep the keyboard from shrinking when clicking the button on the bottom right corner of the keyboard. Invalid when type='textarea' | _boolean_           | `false` |
| confirm-type                 | Set the text of the button on the bottom right corner of the keyboard. Only valid when type='text'             | _string_            | `done`  |
| cursor                       | Specifies the cursor position when focused                                                                    | _number_            | `-1`    |
| cursor-spacing               | The distance between the bottom of the input box and the keyboard when focused                                | _number_            | `50`    |
| custom-style                 | Custom style                                                                                                  | _string_            | -       |
| disable-default-padding      | Whether to remove the default padding on iOS, only effective for textarea                                     | _boolean_           | `true`  |
| disabled                     | Whether to disable the input box                                                                              | _boolean_           | `false` |
| error                        | Whether to mark the input content in red                                                                      | _boolean_           | `false` |
| error-message                | The error message text at the bottom, will not be displayed if empty                                          | _string_            | `''`    |
| error-message-align          | Bottom error message text alignment, optional values are `center` `right`                                     | _string_            | `''`    |
| extra-event-params `v1.10.12`| Enable event enhanced mode, will provide additional `cursor` and `keyCode` parameters in input and change events, planned to be the default behavior in the next major version | _boolean_           | `false` |
| fixed                        | If the type is `textarea` and in a `position: fixed` area, you need to explicitly specify the attribute fixed as true | _boolean_           | `false` |
| focus                        | Get focus                                                                                                     | _boolean_           | `false` |
| hold-keyboard                | Do not hide the keyboard when clicking the page while focused                                                 | _boolean_           | `false` |
| input-align                  | Input text alignment, optional values are `center` `right`                                                    | _string_            | -       |
| is-link                      | Whether to display the right arrow and enable click feedback                                                  | _boolean_           | `false` |
| label                        | Text on the left side of the input box                                                                        | _string_            | -       |
| left-icon                    | Left icon svg value or image link, optional values see [Icon component](/material/smartui?comId=icon&appType=miniapp)                               | _string_            | -       |
| maxlength                    | Maximum input length, setting it to -1 will not limit the maximum length                                      | _number_            | `-1`    |
| name                         | Identifier when submitting in the form. Can expand the clickable area by configuring `name`                    | _string_            | -       |
| password                     | Whether it is a password type                                                                                 | _boolean_           | `false` |
| placeholder                  | Placeholder text when the input box is empty                                                                  | _string_            | -       |
| placeholder-style            | Specify the style of the placeholder                                                                          | _string_            | -       |
| readonly                     | Whether it is read-only                                                                                       | _boolean_           | `false` |
| required                     | Whether to show the required asterisk of the form                                                             | _boolean_           | `false` |
| right-icon                   | Right icon svg value or image link, optional values see [Icon component](/material/smartui?comId=icon&appType=miniapp)                              | _string_            | -       |
| selection-end                | Cursor end position, valid when auto-focused, need to use with selection-start                                | _number_            | `-1`    |
| selection-start              | Cursor start position, valid when auto-focused, need to use with selection-end                                | _number_            | `-1`    |
| show-confirm-bar             | Whether to display the "Done" button above the keyboard, valid only for textarea                              | _boolean_           | `true`  |
| show-word-limit              | Whether to display the word count statistics, need to set the `maxlength` attribute                           | _boolean_           | `false` |
| size                         | Cell size, optional value is `large`                                                                          | _string_            | -       |
| title-width                  | Title width                                                                                                   | _string_            | `6.2em` |
| type                         | Can be set to any native type, such as `number` `idcard` `textarea` `digit` `nickname`                       | _string_            | `text`  |
| value                        | Current input value                                                                                           | _string \| number_  | -       |
| inter-error `v2.1.0`          | Whether the error message is inside the input box                                                             | _boolean_           | -       |
| sub-label `v2.1.0`            | Subtitle                                                                                                      | _string_            | -       |
| card-mode `v2.1.0`            | Card mode                                                                                                     | _boolean_           | -       |
| hidden-label `v2.1.0`  | Hide the content related to the left label        | _boolean_  | -       |

### Events

| Event                         | Description                                              | Callback Parameters                                                                                              |
| ----------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| bind:blur                     | Triggered when the input box loses focus                 | event.detail.value: Current input value; <br>event.detail.cursor: Cursor position (if `type` is not `textarea`, value is `0`) |
| bind:change                   | Triggered when input content changes                     | event.detail: Current input value; When extra-event-params is `true`, it is [InputDetail](#InputDetail)          |
| bind:clear                    | Triggered when the clear control is clicked              | -                                                                                                                  |
| bind:click-icon               | Triggered when the trailing icon is clicked              | -                                                                                                                  |
| bind:click-input              | Triggered when the input area is clicked                 | -                                                                                                                  |
| bind:confirm                  | Triggered when the done button is clicked                | event.detail: Current input value                                                                                 |
| bind:focus                    | Triggered when the input box gets focus                  | event.detail.value: Current input value; <br>event.detail.height: Keyboard height                                 |
| bind:input                    | Triggered when input content changes                     | event.detail: Current input value; When extra-event-params is `true`, it is [InputDetail](#InputDetail)          |
| bind:keyboardheightchange     | Triggered when the keyboard height changes              | event.detail = { height: height, duration: duration }                                                             |
| bind:linechange               | Triggered when textarea rows change, only valid for textarea | event.detail = { height: 0, heightRpx: 0, lineCount: 0 }                                                            |
| bind:nicknamereview `v1.11.5` | Triggered when the user nickname review is completed, only valid when type is "nickname" | event.detail = { pass, timeout }                                                                                     |

### InputDetail

| Parameter  | Description                                                                                                                                                                           | Type       | Default |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| callback   | Call this function with `{ value: string, cursor: number }` to replace the content of the input box, for specific usage refer to [wx-input](https://developers.weixin.qq.com/miniprogram/dev/component/input.html) | _function_ | -      |
| cursor     | Cursor position                                                                                                                                                                       | _number_   | -      |
| keyCode    | Key value                                                                                                                                                                              | _number_   | -      |
| value      | Current input value                                                                                                                                                                   | _string_   | -      |

### Slot

| Name       | Description                                                   |
| ---------- | -------------------------------------------------------------- |
| button     | Custom input box trailing button                                |
| input      | Custom input box, using this slot will invalidate related attributes and events of the input box |
| label      | Custom input box label, if `label` attribute is set, will not effective  |
| left-icon  | Custom input box head icon                                     |
| right-icon | Custom input box trailing icon                                 |

### External Style Class

| Class Name                | Description      |
| ------------------------- | ---------------- |
| custom-class `v1.10.21`   | Root node style class |
| input-class               | Input box style class |
| label-class               | Left text style class |
| right-icon-class          | Right icon style class |

### Style Variables

The component provides the following CSS variables for custom styles. For usage, please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default                                   | Description                 |
| ----------------------------- | ----------------------------------------- | --------------------------- |
| --field-label-color           | _var(--app-B6-N1, rgba(0, 0, 0, 1))_      | label color                 |
| --field-input-text-color      | _var(--app-B6-N1, rgba(0, 0, 0, 1))_    | input text color            |
| --field-input-text-font-size `v2.1.0`  | _16px_   | input text font size    |
| --field-input-error-text-color| _var(--app-M2, #f04c4c)_                  | error text color            |
| --field-placeholder-text-color| _var(--app-B6-N4, rgba(0, 0, 0, 0.4))_    | placeholder text color      |
| --field-icon-size             | _16px_                                    | icon font size              |
| --field-clear-icon-size       | _16px_                                    | clear icon font size        |
| --field-clear-icon-color      | _var(--app-B4-N4, rgba(0, 0, 0, 0.4))_    | clear icon color            |
| --field-icon-container-color  | _#969799_                                 | right icon box font color   |
| --field-error-message-color  | _var(--app-M2, #f04c4c)_   | Error prompt text color    |
| --field-error-message-text-font-size  | _14px_   | Prompt text font size    |
| --field-text-area-min-height  | _130px_   | Minimum height of textarea    |
| --field-word-limit-color  | _var(--app-B6-N4, rgba(0, 0, 0, 0.4))_   | Enter length limit text color    |
| --field-disabled-opacity `v2.1.0`  | _0.7_   | Disable transparency    |
| --field-label-font-size `v2.1.0`  | _16px_   | Label font size    |
| --field-label-line-height `v2.1.0`  | _18px_   | Label title font height    |
| --field-sub-label-font-size `v2.1.0`  | _14px_   | Subtitle font size    |
| --field-sub-label-line-height `v2.1.0`  | _16px_   | Subtitle font height    |
| --field-error-message-text-line-height `v2.1.0`  | _16px_   | Error message font height    |
| --field-subtitle-text-color `v2.1.0`  | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_   | Subtitle Color    |
| --field-left-icon-margin-right `v2.1.0`  | _10px_   | Right margin of icon    |
| --field-left-body-padding-right `v2.1.0`  | _16px_   | Right padding of the left section    |

#### card mode CSS variable
| Name                          | Default                                 | Description |
| ----------------------------- | -------------------------------------- | ---- |
| --field-card-border-radius `v2.1.0`   | _8px_   | Card border rounded corners    |
| --field-card-background `v2.1.0`   | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_   | Card input with background scenery input    |
| --field-card-width `v2.1.0`   | _105px_   | Card input width    |
| --field-card-height `v2.1.0`   | _38px_   | Card input height    |
| --field-card-padding `v2.1.0`   | _0 10px_   | Internal padding of card input box    |

#### textarea CSS variable
| Name                          | Default                                 | Description |
| ----------------------------- | -------------------------------------- | ---- |
| --field-word-limit-font-size  | _10px_   | Enter length limit for text font size    |
| --field-word-limit-line-height  | _14px_   | Enter length limit for text font height    |
| --field-word-num-full-color  | _var(--app-M2, #f04c4c)_   | The input length exceeds the limit for text color    |
| --field-textarea-background `v2.1.0`   | _var(--app-B3, #ffffff)_   | Background color of input box    |
| --field-textarea-border-radius `v2.1.0`   | _8px_   | Rounded corners of input box    |
| --field-textarea-padding `v2.1.0`   | _12px 8px_   | Enter inner margin    |
| --field-textarea-limit-padding-bottom `v2.1.0`   | _20px_   | The bottom of the input box displays the margin when limiting the number of strings    |