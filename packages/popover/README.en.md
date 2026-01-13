---
category: Feedback
new: true
version: v2.3.0
---

# Popover Popup Prompt

### Introduction

Introduced after version v2.3.0, this popup container is used to display lightweight content such as popups and information prompts.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, see [Getting Started](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-popover": "@tuya-miniapp/smart-ui/lib/popover/index"
}
```

## Code Examples

### Basic Usage

```html
<smart-popover placement="bottomLeft" show="{{show}}" bind:show-change="onShow">
  <smart-button>Bottom Left Pop</smart-button>
  <view slot="overlay">
    <smart-cell-group inset>
      <smart-cell
        title="Title"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
      <smart-cell
        title="Title"
        border="{{ false }}"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
    </smart-cell-group>
  </view>
</smart-popover>

<smart-popover placement="bottom">
  <smart-button>Bottom Pop</smart-button>
  <view slot="overlay">
    <smart-cell-group inset>
      <smart-cell
        title="Title"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
      <smart-cell
        title="Title"
        border="{{ false }}"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
    </smart-cell-group>
  </view>
</smart-popover>

<smart-popover placement="bottomRight">
  <smart-button>Bottom Right Pop</smart-button>
  <view slot="overlay">
    <smart-cell-group inset>
      <smart-cell
        title="Title"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
      <smart-cell
        title="Title"
        border="{{ false }}"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
    </smart-cell-group>
  </view>
</smart-popover>

<smart-popover placement="top">
  <smart-button>Top Pop</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
<smart-popover placement="left">
  <smart-button>Left Pop</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
<smart-popover placement="right">
  <smart-button>Right Pop</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
<smart-popover placement="bottom">
  <smart-button>Bottom Pop</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
```

```javascript
import Sun from '@tuya-miniapp/icons/dist/svg/Sun';

Page({
  data: {
    show: false,
    sunMaxFill: Sun,
  },
  methods: {
    onShow(e) {
      this.setData({ show: e.detail });
    },
  },
});
```

### Controlled Usage

Control whether the popup is displayed using the `show` attribute.

```html
<smart-popover show="{{show}}" placement="top" bind:close="onClose" bind:show-change=“onShow”>
  <smart-button>Top Pop</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
```

```js
Page({
  data: {
    show: false,
  },
  methods: {
    onClose() {
      this.setData({ show: false });
    },
    onShow(e) {
      this.setData({ show: e.detail });
    }
  },
});
```

### Popup Position

Set the popup position using the `position` attribute. The default is to pop to the right, but it can be set to `top`, `topLeft`, `topRight`, `bottom`, `bottomLeft`, `bottomRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`.

```html
<smart-popover
  show="{{ show }}"
  position="top"
  custom-style="height: 20%;"
  bind:close="onClose"
/>
```

## API

### Props
| Parameter        | Description                                                                                                                                                                       | Type      | Default |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| custom-style     | Custom popup style                                                                                                                                                                | _string_  | `''`    |
| duration         | Delay time for closing (ms)                                                                                                                                                       | number    | `3000`  |
| placement        | Position of the popup, supported values: `top`, `topLeft`, `topRight`, `bottom`, `bottomLeft`, `bottomRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom` | _string_  | `right` |
| show             | Controls whether the popup is displayed and listens for state changes, updating `currentShow` when the value changes                                                              | _boolean_ | `false` |
| trigger `v2.5.0` | Control the trigger method of the popup layer, support `tap`、`longpress`                                                                                                         | _string_  | `tap`   |

### Events

| Event Name       | Description            | Parameters |
| ---------------- | ---------------------- | ---------- |
| bind:close       | Triggered on close     | -          |
| bind:show-change | Triggered on show/hide | -          |

### Popover Slot

| Name    | Description   |
| ------- | ------------- |
| overlay | Popup content |

### External Styles

| Class Name   | Description           |
| ------------ | --------------------- |
| custom-class | Root node style class |

### Style Variables

The component provides the following CSS variables for custom styling. For usage, see [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                             | Default Value                       | Description                     |
| -------------------------------- | ----------------------------------- | ------------------------------- |
| --popover-background-color       | #fff                                | Popup background color          |
| --popover-border-radius          | 12px                                | Popup border radius             |
| --popover-box-shadow             | 0px 6px 12px 0px rgba(0, 0, 0, 0.1) | Popup box shadow                |
| --popover-overlay-color `v2.8.0` | var(--app-B1-N1, rgba(0, 0, 0, 1))  | Text color for the overlay slot |
| --popover-padding                | 12px                                | Popup padding                   |
