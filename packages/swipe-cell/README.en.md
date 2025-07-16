Sure, here is the translation:

---

category: Feedback

---

# SwipeCell

### Introduction

A cell component that can slide left and right to display action buttons.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, see [Quickstart](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-swipe-cell": "@tuya-miniapp/smart-ui/lib/swipe-cell/index"
}
```

## Code Demonstration

### Basic Usage

```html
<smart-swipe-cell right-width="{{ 65 }}" left-width="{{ 65 }}">
  <view slot="left" class="smart-swipe-cell__left">Select</view>
  <smart-cell-group>
    <smart-cell title="Cell" value="Content" />
  </smart-cell-group>
  <view slot="right" class="smart-swipe-cell__right">Delete</view>
</smart-swipe-cell>
```

### Asynchronous Closing

When `async-close` is enabled, you can bind the `close` event to customize the close behavior when swiping on both sides.

```html
<smart-swipe-cell
  id="swipe-cell"
  right-width="{{ 65 }}"
  left-width="{{ 65 }}"
  async-close
  bind:close="onClose"
>
  <view slot="left">Select</view>
  <smart-cell-group>
    <smart-cell title="Cell" value="Content" />
  </smart-cell-group>
  <view slot="right">Delete</view>
</smart-swipe-cell>
```

```js
Page({
  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: 'Are you sure you want to delete?',
        }).then(() => {
          instance.close();
        });
        break;
    }
  },
});
```

### Actively Open

```html
<smart-swipe-cell
  id="swipe-cell2"
  right-width="{{ 65 }}"
  left-width="{{ 65 }}"
  name="Example"
  bind:open="onOpen"
>
  <view slot="left" class="smart-swipe-cell__left">Select</view>
  <smart-cell-group>
    <smart-cell title="Cell" value="Content" />
  </smart-cell-group>
  <view slot="right" class="smart-swipe-cell__right">Delete</view>
</smart-swipe-cell>
```

```js
import ToastInstance from '@tuya-miniapp/smart-ui/dist/toast/toast';

Page({
  onOpen(event) {
    const { position, name } = event.detail;
    switch (position) {
      case 'left':
        ToastInstance({
          context: this,
          message: `${name}${position} part triggered the open event`,
        });
        break;
      case 'right':
        ToastInstance({
          context: this,
          message: `${name}${position} part triggered the open event`,
        });
        break;
    }
  },
});
```

## API

### Props

| Parameter   | Description                                  | Type              | Default |
| ----------- | -------------------------------------------- | ----------------- | ------- |
| async-close | Whether to close asynchronously               | _boolean_         | `false` |
| disabled    | Whether to disable sliding                    | _boolean_         | `false` |
| left-width  | Width of the left sliding area                | _number_          | `0`     |
| name        | Identifier, can be retrieved from close event | _string \| number_| -       |
| right-width | Width of the right sliding area               | _number_          | `0`     |

### Slot

| Name  | Description           |
| ----- | --------------------- |
| -     | Custom display content |
| left  | Left sliding content   |
| right | Right sliding content  |

### Events

| Event Name  | Description   | Parameter                                                  |
| ----------- | ------------- | ---------------------------------------------------------- |
| bind:click  | Triggered on click | Click position on close (`left` `right` `cell` `outside`)   |
| bind:close  | Triggered on close | { position: 'left' \| 'right', instance, name: string }    |
| bind:open   | Triggered on open  | { position: 'left' \| 'right', name: string }             |

### Close Parameter

| Parameter  | Type     | Description                                   |
| ---------- | -------- | --------------------------------------------  |
| instance   | _object_ | SwipeCell instance                            |
| name       | Identifier  | _string_                                     |
| position   | _string_ | Click position on close (`left` `right` `cell` `outside`) |

### Methods

You can access the SwipeCell instance via selectComponent and call instance methods.

| Method Name | Parameters                  | Return | Description           |
| ----------- | --------------------------- | ------ | --------------------- |
| close       | -                           | -      | Collapse the cell sidebar |
| open        | position: `left \| right`   | -      | Open the cell sidebar    |