---
category: Navigation
---

# Sidebar

### Introduction

Vertically displayed navigation bar for switching between different content areas.

### Import

Introduce the component in `app.json` or `index.json`, detailed introduction can be found in [Quickstart](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-sidebar": "@tuya-miniapp/smart-ui/lib/sidebar/index",
  "smart-sidebar-item": "@tuya-miniapp/smart-ui/lib/sidebar-item/index"
}
```

## Code Examples

### Basic Usage

Control the selected item by setting the `activeKey` attribute on the `smart-sidebar`.

```html
<smart-sidebar active-key="{{ activeKey }}">
  <smart-sidebar-item title="Label Name" />
  <smart-sidebar-item title="Label Name" />
  <smart-sidebar-item title="Label Name" />
</smart-sidebar>
```

```javascript
Page({
  data: {
    activeKey: 0,
  },
});
```

### Badge Hint

Set the `dot` attribute to show a small red dot in the upper right corner. Set the `badge` attribute to display the corresponding badge in the upper right corner.

```html
<smart-sidebar active-key="{{ activeKey }}">
  <smart-sidebar-item title="Label Name" dot />
  <smart-sidebar-item title="Label Name" badge="5" />
  <smart-sidebar-item title="Label Name" badge="99+" />
</smart-sidebar>
```

### Disabled Options

Disable options through the `disabled` attribute.

```html
<smart-sidebar active-key="{{ activeKey }}">
  <smart-sidebar-item title="Label Name" />
  <smart-sidebar-item title="Label Name" disabled />
  <smart-sidebar-item title="Label Name" />
</smart-sidebar>
```

### Listening to Switch Events

Set the `change` method to listen for events when switching navigation items.

```html
<smart-sidebar active-key="{{ activeKey }}" bind:change="onChange">
  <smart-sidebar-item title="Label Name 1" />
  <smart-sidebar-item title="Label Name 2" />
  <smart-sidebar-item title="Label Name 3" />
</smart-sidebar>

<smart-notify id="smart-notify" />
```

```js
import Notify from '@tuya-miniapp/smart-ui/notify/notify';

Page({
  data: {
    activeKey: 0,
  },

  onChange(event) {
    Notify({ type: 'primary', message: event.detail });
  },
});
```

## API

### Sidebar Props

| Parameter | Description           | Type               | Default |
| --------- | --------------------- | ------------------ | ------- |
| activeKey | Index of selected item | _string \| number_ | `0`     |

### Sidebar Event

| Event Name | Description           | Parameter                |
| ---------- | --------------------- | ------------------------ |
| change     | Triggered when switching badges | Index of the currently selected badge |

### Sidebar External Class

| Class Name    | Description        |
| ------------- | ------------------ |
| custom-class  | Root node style class |

### SidebarItem Props

| Parameter | Description            | Type      | Default  |
| --------- | ---------------------- | --------- | -------- |
| dot       | Whether to show the small red dot in the upper right corner | _boolean_ | `false`  |
| title     | Content                | _string_  | `''`     |
| badge     | Badge content in the upper right corner of the icon | _string \| number_ | `''`  |
| disabled  | Whether to disable this item | _boolean_ | `false` |

### SidebarItem Slot

| Name   | Description                                 |
| ------ | ------------------------------------------- |
| title  | Custom title bar, will not take effect if the `title` attribute is set |

### SidebarItem Event

| Event Name | Description           | Parameter               |
| ---------- | --------------------- | ----------------------- |
| click      | Triggered when the badge is clicked | `event.detail` is the index of the current badge |

### SidebarItem External Class

| Class Name    | Description        |
| ------------- | ------------------ |
| custom-class  | Root node style class |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description              |
| ----------------------------- | ---------------------------------------- | ------------------------ |
| --sidebar-width               | _80px_                                   | Sidebar width            |
| --sidebar-font-size           | _14px_                                   | Sidebar font size        |
| --sidebar-line-height         | _20px_                                   | Sidebar line height      |
| --sidebar-text-color          | _var(--app-B6-N1, rgba(0, 0, 0, 1))_     | Sidebar text color       |
| --sidebar-disabled-text-color | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_   | Disabled text color      |
| --sidebar-padding             | _20px @padding-sm 20px @padding-xs_      | Sidebar padding          |
| --sidebar-active-color        | _var(--app-B6, #fff)_                    | Active state color       |
| --sidebar-background-color    | _var(--app-B1, #f6f7fb)_                 | Sidebar background color |
| --sidebar-selected-font-weight| _500_                                    | Selected font weight     |
| --sidebar-selected-text-color | _var(--app-B6-N1, rgba(0, 0, 0, 1))_     | Selected text color      |
| --sidebar-selected-border-color| _#ee0a24_                              | Selected border color    |
| --sidebar-selected-background-color| _var(--app-B6, #fff)_               | Selected background color|

