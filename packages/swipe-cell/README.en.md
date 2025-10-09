---
category: Feedback
---

# SwipeCell

### Introduction

A cell component that can be swiped left or right to reveal action buttons.

### Import

Import the component in `app.json` or `index.json`. For details, see [Getting Started](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-swipe-cell": "@tuya-miniapp/smart-ui/lib/swipe-cell/index"
}
```

## Code Demonstration

### Basic Usage

```html
<smart-swipe-cell right-width="{{ 65 }}" left-width="{{ 65 }}" bind:tabClose="onTabClose">
  <view slot="left" class="smart-swipe-cell__left">Select</view>
  <smart-cell-group>
    <smart-cell title="Cell" value="Content" />
  </smart-cell-group>
  <view slot="right" class="smart-swipe-cell__right">Delete</view>
</smart-swipe-cell>
```

```js
Page({
  onTabClose(event) {
    console.log('onTabClose: ', event.detail);
  },
});
```

### Asynchronous Closing

When `async-close` is enabled, you can customize the close behavior when clicking on the sliding content by binding the `close` event.

```html
<smart-swipe-cell
  id="swipe-cell"
  right-width="{{ 65 }}"
  left-width="{{ 65 }}"
  async-close
  bind:close="onAsyncClose"
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
  onAsyncClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: 'Are you sure to delete?',
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
          type: 'primary',
          message: `${name} ${position} part shows that the open event has been triggered`,
        });
        break;
      case 'right':
        ToastInstance({
          context: this,
          type: 'primary',
          message: `${name} ${position} part shows that the open event has been triggered`,
        });
        break;
    }
  },
});
```

## API

### Props

| Parameter    | Description                                | Type               | Default  |
| ------------ | ------------------------------------------ | ------------------ | -------- |
| async-close  | Whether to close asynchronously             | _boolean_          | `false` |
| disabled     | Whether to disable swiping                 | _boolean_          | `false` |
| left-width   | Width of the left swipe area               | _number_           | `0`     |
| name         | Identifier, which can be retrieved in the close event's parameters | _string \| number_ | -        |
| right-width  | Width of the right swipe area              | _number_           | `0`     |

### Slot

| Name  | Description           |
| ----- | --------------------- |
| -     | Custom display content |
| left  | Left swipe content     |
| right | Right swipe content    |

### Events

| Event Name                     | Description   | Parameters                                                  |
| ------------------------------ | -------------- | ---------------------------------------------------------- |
| bind:click                     | Triggered on click | Click position during close (`left`, `right`, `cell`, `outside`) |
| bind:tabClose `v2.7.0`        | Triggered on close  | Position during close (`left`, `right`)                   |
| bind:close                     | Triggered on asynchronous close | { position: 'left' \| 'right', instance, name: string } |
| bind:open                      | Triggered on open   | { position: 'left' \| 'right', name: string }            |

### close Parameters

| Parameter  | Type     | Description                                      |
| ---------- | -------- | ------------------------------------------------ |
| instance   | _object_ | SwipeCell instance                               |
| name       | Identifier | _string_                                        |
| position   | _string_ | Click position during close (`left`, `right`, `cell`, `outside`) |

### Methods

You can obtain the SwipeCell instance through selectComponent and call its methods.

| Method Name | Parameters                  | Return Value | Description            |
| ----------- | --------------------------- | ------------ | ---------------------- |
| close       | -                           | -            | Collapse the sidebar of the cell |
| open        | position: `left \| right`  | -            | Open the sidebar of the cell |