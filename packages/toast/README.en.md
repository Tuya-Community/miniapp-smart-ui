---
category: Feedback
---

# Toast Notifications

### Introduction

Displays a black translucent notification in the middle of the page, suitable for message notifications, loading prompts, operation result prompts, etc.

### Import

Introduce the component in `app.json` or `index.json`, for detailed introduction see [Getting Started](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-toast": "@tuya-miniapp/smart-ui/lib/toast/index"
}
```

## Code Examples

### Text Notification

```javascript
import ToastInstance from '@tuya-miniapp/smart-ui/toast/toast';

ToastInstance('This is a notification, recommended not to exceed fifteen characters~');
```

```html
<smart-toast id="smart-toast" />
```

### Loading Notification

Use the `ToastInstance.loading` method to show a loading prompt, and use the `forbidClick` property to disable background clicks. You can also customize the loading icon type using the `loadingType` property.

```javascript
ToastInstance.loading({
  message: 'Loading...',
  forbidClick: true,
});

// Custom loading icon
ToastInstance.loading({
  message: 'Loading...',
  forbidClick: true,
  loadingType: 'spinner',
});
```

### Success/Failure Notification

```javascript
ToastInstance.success('Success message');
ToastInstance.fail('Failure message');
```

### Warning Notification

```js
ToastInstance.warn('Warning message');
```

### Dynamically Update Notification

```javascript
const toast = ToastInstance.loading({
  duration: 0, // Keep toast displayed
  forbidClick: true,
  message: 'Countdown 3 seconds',
  selector: '#custom-selector',
  width: 88,
});

let second = 3;
const timer = setInterval(() => {
  second--;
  if (second) {
    toast.setData({
      message: `Countdown ${second} seconds`,
    });
  } else {
    clearInterval(timer);
    ToastInstance.clear();
  }
}, 1000);
```

```html
<smart-toast id="custom-selector" />
```

### OnClose Callback Function

```javascript
ToastInstance({
  type: 'success',
  message: 'Submission successful',
  onClose: () => {
    console.log('Execute OnClose function');
  },
});
```

## API

### Methods

| Method Name    | Parameters   | Return Value     | Description   |
| ---------- | ------------ | ---------- | --------- |
| ToastInstance                     | `options \| message` | toast instance | Display notification                        |
| ToastInstance.clear               | `clearAll`           | `void`     | Close notification                        |
| ToastInstance.fail                | `options \| message` | toast instance | Display failure notification                    |
| ToastInstance.loading             | `options \| message` | toast instance | Display loading notification                    |
| ToastInstance.resetDefaultOptions | -                    | `void`     | Reset default configuration, effective for all Toasts |
| ToastInstance.setDefaultOptions   | `options`            | `void`     | Modify default configuration, effective for all Toasts |
| ToastInstance.success             | `options \| message` | toast instance | Display success notification                    |

### Options

| Parameter        | Description                                                                              | Type       | Default Value        |
| ----------- | --------------------------------------------------------------------------------- | ---------- | ------------- |
| context     | The scope of the selector, you can pass in the `this` of a custom component as context                            | _object_   | Current page      |
| duration    | Display duration(ms), when the value is 0, the toast will not disappear    | _number_   | `2000`        |
| forbidClick | Whether to disable background clicks            | _boolean_  | `false`       |
| loadingType | Type of loading icon, optional value is `spinner`       | _string_   | `circular`    |
| mask        | Whether to show the mask layer         | _boolean_  | `false`       |
| message     | Content                       | _string_   | `''`          |
| onClose     | Callback function on close            | _Function_ | -             |
| position    | Position, optional values are `top` `middle` `bottom`           | _string_   | `middle`      |
| selector    | Custom selector                | _string_   | `#smart-toast` |
| type        | Notification type, optional values are `loading` `success` `fail` `warn` `html` (`warn` supported from `^v2.0.0`) | _string_   | `text`        |
| zIndex      | z-index level                | _number_   | `1000`        |
| width `v2.1.7`     | Custom popup width                     | _number_   | `''`        |
| nativeDisabled `v2.5.0`     | Disable local gestures during the popup open period?       | _boolean_   | `false`        |

### Slot

| Name | Description       |
| ---- | ---------- |
| -    | Custom content |

### Style Variables

The component provides the following CSS variables for custom styling. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                                 | Description |
| ----------------------------- | -------------------------------------- | ---- |
| --toast-min-width | _88px_ | Minimum width prompt |
| --toast-max-width | _70%_ | Maximum width of the notification |
| --toast-font-size | _14px_ | Notification font size |
| --toast-text-color | _#fff_ | Notification text color |
| --toast-line-height | _20px_ | Notification line height |
| --toast-border-radius | _10px_ | Notification border radius |
| --toast-background-color | _fade(@black, 70%)_ | Notification background color |
| --toast-icon-size | _36px_ | Notification icon size |
| --toast-text-padding | _@padding-xs @padding-sm_ | Notification text padding |
| --toast-default-padding | _16px_ | Default notification padding |
| --toast-default-width | _88px_ | Default notification width |
| --toast-default-min-height | _88px_ | Default minimum height of the notification |
