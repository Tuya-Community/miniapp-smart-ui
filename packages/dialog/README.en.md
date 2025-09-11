---
category: Feedback
---

# Dialog

### Introduction

A modal dialog box that is commonly used for message prompts, message confirmations, or to complete specific interactions within the current page. It supports both function calls and component invocation.

### Introduction

Introduce the component in `app.json` or `index.json`. For detailed instructions, see [Getting Started](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-dialog": "@tuya-miniapp/smart-ui/lib/dialog/index"
}
```

## Code Demonstration

### Message Prompt

Used to display some messages, containing only a confirm button.

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

DialogInstance.alert({
  title: 'Title',
  message: 'Dialog content',
}).then(() => {
  // on close
});

DialogInstance.alert({
  message: 'Dialog content',
}).then(() => {
  // on close
});
```

### Message Confirmation

Used for message confirmation, containing both a cancel and a confirm button.

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

DialogInstance.confirm({
  title: 'Title',
  message: 'Dialog content',
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  });
```

### Input Box

Used for text input. The default maximum input limit `maxLength` is `20`.

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

const beforeClose = (action: 'confirm' | 'cancel' | 'overlay', value?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (action === 'confirm') {
        // Intercept confirmation operation if there is no input value
        resolve(!!value);
      } else {
        resolve(true);
      }
    }, 1000);
  });
}

DialogInstance.input({
  title: 'Title',
  value: '',
  beforeClose,
  cancelButtonText: 'Sub Action',
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  });
```

### Rounded Button Style

Set the theme option to `round-button` to display a dialog box with rounded button style.

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

DialogInstance.alert({
  title: 'Title',
  message: 'Dialog content',
  theme: 'round-button',
}).then(() => {
  // on close
});

DialogInstance.alert({
  message: 'Dialog content',
  theme: 'round-button',
}).then(() => {
  // on close
});
```

### Asynchronous Close

You can pass in a callback function using the `beforeClose` property to perform specific operations before the dialog box closes.

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

const beforeClose = (action) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (action === 'confirm') {
        resolve(true);
      } else {
        // intercept cancel operation
        resolve(false);
      }
    }, 1000);
  });

DialogInstance.confirm({
  title: 'Title',
  message: 'Dialog content',
  beforeClose,
});
```

### Custom Icon `v2.6.3`

The icon attribute supports passing in an SVG string, and it uses the SmartUI Icon component underneath. The icon attribute essentially passes the name property to the icon component.

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';
import AlarmIcon from '@tuya-miniapp/icons/dist/svg/Alarm';

DialogInstance.confirm({
  context: this,
  title: 'Title',
  icon: AlarmIcon,
  iconColor: '#1989fa',
  iconSize: '36px',
  message: 'Body',
  cancelButtonText: 'Sub Action',
  confirmButtonText: 'Confirm',
}).then(() => {
  // on close
});
```

### Component Invocation

If you need to embed components or other custom content inside the dialog box, you can use component invocation.

```html
<smart-dialog
  use-slot
  title="Title"
  show="{{ show }}"
  show-cancel-button
  confirm-button-open-type="getUserInfo"
  bind:close="onClose"
  bind:getuserinfo="getUserInfo"
>
  <image src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" />
</smart-dialog>
```

```js
Page({
  data: {
    show: true,
  },

  getUserInfo(event) {
    console.log(event.detail);
  },

  onClose(event) {
    if(event.detail === 'confirm') {
      this.setData({
        show: false,
      });
    }
  },
});
```

### Custom Styling

If you need custom styling, it is recommended to use `custom-class`, as the `className` attribute is not recommended (it won't be effective in custom components). Here's how to use it:

#### Component Invocation

```html
<smart-dialog
  title="Title"
  message="Dialog content"
  show="{{ show }}"
  custom-class="my-custom-class"
/>
```

#### API Call

```html
<smart-dialog id="smart-dialog" custom-class="my-custom-class" />
```

## API

### Methods

| Method Name  | Parameters | Return Value | Description |
| -------- | --------- | --------- | --------- |
| DialogInstance                     | `options` | `Promise` | Show dialog box |
| DialogInstance.alert               | `options` | `Promise` | Show message alert dialog box |
| DialogInstance.close               | -         | `void`    | Close the popup and clear the cache queue |
| DialogInstance.confirm             | `options` | `Promise` | Show message confirmation dialog box |
| DialogInstance.input               | `options` | `Promise` | Show input box dialog box |
| DialogInstance.resetDefaultOptions | -         | `void`    | Reset default options, effective for all Dialogs |
| DialogInstance.setDefaultOptions   | `options` | `void`    | Modify default options, effective for all Dialogs |
| DialogInstance.stopLoading         | -         | `void`    | Stop button loading state |

### Options

When calling Dialog via a function, the following options are supported:

| Parameter     | Description  | Type   | Default Value |
| ------------ | --------- | -------------- | --------- |
| icon         | Whether to display the warning icon or the name value of the icon    | _boolean \| string`v2.6.3`_          | `false`   |
| iconColor `v2.6.3`   | icon color | _string_           | `#F04C4C`      |
| iconSize `v2.6.3`   | icon size | _string_           | -      |
| maxlength    | Maximum input length, unlimited when set to -1 | _number_           | `20`      |
| message      | Text content, supports line breaks using `\n` | _string_           | -         |
| messageAlign | Message alignment, options are `left` `right` | _string_           | `center`  |
| password     | Whether it is a password type | _boolean_          | `false`   |
| placeholder  | Placeholder when the input box is empty | _string_           | -         |
| theme        | Style theme, options are `round-button` | _string_           | `default` |
| title        | Title | _string_           | -         |
| value        | Initial value of the input box | _string_           | -         |
| width        | Dialog box width, default unit is `px` | _string \| number_ | `320px`   |
| zIndex       | z-index level | _number_           | `100`     |
| customStyle | Custom style | _string_ | '' |
| selector | Custom selector | _string_ | `#smart-dialog` |
| cancelButtonText | Cancel button text | _string_ | `Cancel` |
| closeOnClickOverlay | Whether to close the dialog when clicking on the overlay | _boolean_ | `false` |
| confirmButtonText | Confirm button text | _string_ | `Confirm` |
| overlay | Whether to show overlay | _boolean_ | `true` |
| overlayStyle | Custom overlay style | _object_ | - |
| showCancelButton | Whether to show cancel button | _boolean_ | `false` |
| showConfirmButton | Whether to show confirm button | _boolean_ | `true` |
| beforeClose | Callback function before closing, returning `false` can prevent closing, supports returning Promise | _(action) => boolean \| Promise\<boolean\>_ | - |
| context | The selection range of the selector, you can pass in the `this` of a custom component as context | _object_ | Current page |
| transition | Animation name, options are `fade` `none` | _string_ | `scale` |
| nativeDisabled `v2.3.8` | Whether to disable local gestures during the pop-up period | _boolean_ | `false` |
| autoClose `v2.6.3` | Whether to automatically close after callback click | _boolean_ | `true` |

### Props

The following Props are supported when calling Dialog via component invocation:

| Parameter              | Description  | Type   | Default Value |
| ----------------- | --------- | ------------ | --------- |
| confirm-button-id | Identifier for the confirm button, used as the id value for the underlying native button component | _string_           | -         |
| icon         | Whether to display the warning icon or the name value of the icon    | _boolean \| string`v2.6.3`_          | `false`   |
| icon-color `v2.6.3`   | icon color | _string_           | `#F04C4C`      |
| icon-size `v2.6.3`   | icon size | _string_           | -      |
| maxlength         | Maximum input length, unlimited when set to -1 | _number_           | `20`      |
| message           | Text content, supports line breaks using `\n` | _string_           | -         |
| message-align     | Message alignment, options are `left` `right` | _string_           | `center`  |
| password          | Whether it is a password type | _boolean_          | `false`   |
| placeholder       | Placeholder when the input box is empty | _string_           | -         |
| show              | Whether to display the dialog box | _boolean_          | -         |
| theme             | Style theme, options are `round-button` | _string_           | `default` |
| title             | Title | _string_           | -         |
| value             | Initial value of the input box | _string_           | -         |
| width             | Dialog box width, default unit is `px` | _string \| number_ | `320px`   |
| z-index           | z-index level | _number_           | `100`     |
| custom-style | Custom style | _string_ | '' |
| show-confirm-button | Whether to show confirm button | _boolean_ | `true` |
| cancel-button-color | Font color of the cancel button | _string_ | `#333` |
| cancel-button-text | Text of the cancel button | _string_ | `Cancel` |
| close-on-click-overlay | Whether to close the dialog when clicking on the overlay | _boolean_ | `false` |
| confirm-button-color | Font color of the confirm button | _string_ | `#ee0a24` |
| confirm-button-text | Text of the confirm button | _string_ | `Confirm` |
| overlay | Whether to show overlay | _boolean_ | `true` |
| overlay-style | Custom overlay style | _object_ | - |
| show-cancel-button | Whether to show cancel button | _boolean_ | `false` |
| use-cancel-button-slot | Whether to use a custom slot for the cancel button | _boolean_ | `false` |
| use-confirm-button-slot | Whether to use a custom slot for the confirm button | _boolean_ | `false` |
| use-slot | Whether to use a custom slot for content | _boolean_ | `false` |
| use-title-slot | Whether to use a custom slot for the title | _boolean_ | `false` |
| before-close | Callback function before closing, returning `false` can prevent closing, supports returning Promise | _(action, value?: string) => boolean \| Promise\<boolean\>_ | - |
| transition | Animation name, options are `fade` | _string_ | `scale` |
| autoClose `v2.6.3` | Whether to automatically close after callback click | _boolean_ | `false` |

### Events

| Event         | Description      | Callback Parameter        |
| ------------ | -------------- | ------------ |
| bind:cancel  | Triggered when the cancel button is clicked | -                                                                        |
| bind:close   | Triggered when the dialog box is closed | event.detail: Source of the closing event, <br>enumeration is `confirm`,`cancel`,`overlay` |
| bind:confirm | Triggered when the confirm button is clicked | -          |

### Slot

| Name         | Description                |
| ---------- | ----------------------- |
| cancel-button  | Custom content of the `cancel-button` slot, `use-cancel-button-slot` must be `true`   |
| confirm-button | Custom content of the `confirm-button` slot, `use-confirm-button-slot` must be `true` |
| title          | Custom content of the `title` slot, which is ineffective if the `title` attribute is set |

### External Style Classes

| Class Name                 | Description           |
| -------------------- | -------------- |
| cancel-button-class  | Cancel button style class |
| confirm-button-class | Confirm button style class |
| custom-class         | Root node style class   |

### Style Variables

The component provides the following CSS variables for custom styles. Please refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp) for the usage method.  

| Name    | Default Value   | Description |
| ------------ | --------- | ---- |
| --dialog-cancel-color `v2.1.7` | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | Cancel button color |
| --dialog-confirm-color `v2.1.7` | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | Confirm button color |
| --dialog-confirm-font-weight `v2.5.1` | _normal_ | Weight of confirm button |
| --dialog-cancel-font-weight `v2.5.1` | _normal_ | Cancel Button Font Weight |
| --dialog-width | _311px_ | Dialog width |
| --dialog-small-screen-width | _90%_ | Small screen dialog width |
| --dialog-font-size | _16px_ | Dialog font size |
| --dialog-border-radius | _16px_ | Border radius |
| --dialog-background-color | _var(--smart-ui-dialog-background, rgba(255, 255, 255, 1))_ | Background color |
| --dialog-header-font-color | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | Header font color |
| --dialog-header-font-weight | _400_ | Header font weight |
| --dialog-header-line-height | _24px_ | Header line height |
| --dialog-header-padding `2.3.5` | _0_ | Header Title Padding |
| --dialog-header-padding-top | _24px_ | Header Title Top padding |
| --dialog-header-isolated-padding | _@padding-lg 0_ | Header padding |
| --dialog-message-padding | _24px_ | Message padding |
| --dialog-message-font-size | _16px_ | Message font size |
| --dialog-message-line-height | _20px_ | Message line height |
| --dialog-message-max-height | _60vh_ | Message max height |
| --dialog-message-text-color | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | Message text color |
| --dialog-has-title-message-font-size | _14px_ | Title message font size |
| --dialog-has-title-message-text-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | Title message text color |
| --dialog-has-title-message-padding-top | _8px_ | Title message top padding |
| --dialog-header-icon-size | _39px_ | Icon size |
| --dialog-input-height | _40px_ | Input height |
| --dialog-input-background-color | _var(--app-B4-N9, rgba(0, 0, 0, 0.05))_ | Input background color |
| --dialog-input-margin | _0 16px 24px_ | Input margin |
| --dialog-input-padding | _0 10px_ | Input padding |
| --dialog-input-border-radius | _10px_ | Input border radius |
| --dialog-input-font-size | _14px_ | Input font size |
| --dialog--round-button-border-radius `v2.3.5` | _20px_ | When setting `theme: 'round-button'` button with rounded corners |
