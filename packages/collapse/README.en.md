---
category: Display
---

# Collapse

### Introduction

Place a set of content in multiple collapsible panels. Clicking the panel title can expand or collapse its content.

### Import

Import the component in `app.json` or `index.json`. See detailed instructions in [Quickstart](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-collapse": "@tuya-miniapp/smart-ui/lib/collapse/index",
  "smart-collapse-item": "@tuya-miniapp/smart-ui/lib/collapse-item/index"
}
```

## Code Demonstration

### Basic Usage

Control the expanded panel list with `value`. `activeNames` is in array format.

```html
<smart-collapse value="{{ activeNames }}" bind:change="onChange">
  <smart-collapse-item title="Title 1" name="1">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
  <smart-collapse-item title="Title 2" name="2">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
  <smart-collapse-item title="Title 3" name="3" disabled>
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
</smart-collapse>
```

```javascript
Page({
  data: {
    activeNames: ['1'],
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
});
```

### Accordion

Set `accordion` to enable accordion mode, which allows only one panel to expand. In this mode, `activeName` is in string format.

```html
<smart-collapse accordion value="{{ activeName }}" bind:change="onChange">
  <smart-collapse-item title="Title 1" name="1">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
  <smart-collapse-item title="Title 2" name="2">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
  <smart-collapse-item title="Title 3" name="3">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
</smart-collapse>
```

```javascript
Page({
  data: {
    activeName: '1',
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
});
```

### Event Listeners

`smart-collapse` provides `change`, `open`, and `close` events. The `change` event triggers when panels switch, the `open` event triggers when a panel opens, and the `close` event triggers when a panel closes.

```html
<smart-collapse
  value="{{ activeNames }}"
  bind:change="onChange"
  bind:open="onOpen"
  bind:close="onClose"
>
  <smart-collapse-item title="Title 1" name="1">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
  <smart-collapse-item title="Title 2" name="2">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
  <smart-collapse-item title="Title 3" name="3">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
</smart-collapse>
```

```javascript
Page({
  data: {
    activeNames: ['1'],
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onOpen(event) {
    Toast(`Opened: ${event.detail}`);
  },
  onClose(event) {
    Toast(`Closed: ${event.detail}`);
  },
});
```

### Custom Title Content

```html
<smart-collapse value="{{ activeNames }}" bind:change="onChange">
  <smart-collapse-item name="1">
    <view slot="title">Title 1<smart-icon name="question-o" /></view>
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
  <smart-collapse-item title="Title 2" name="2" icon="shop-o">
    Code is meant to be read by humans and incidentally runs on machines.
  </smart-collapse-item>
</smart-collapse>
```

```javascript
Page({
  data: {
    activeNames: ['1'],
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
});
```

## API

### Collapse Props

| Parameter | Description             | Type                                                                    | Default |
| --------- | ----------------------- | ----------------------------------------------------------------------- | ------- |
| accordion | Enable accordion mode   | _boolean_                                                               | `false` |
| border    | Display outer border    | _boolean_                                                               | `true`  |
| value     | Names of active panels  | Non-accordion mode: _(string \| number)[]_<br>Accordion mode: _string \| number_ | -       |

### Collapse Event

| Event Name | Description               | Parameter                          |
| ---------- | ------------------------- | ---------------------------------- |
| change     | Triggered when panels switch | activeNames: _string \| Array_      |
| close      | Triggered when a panel closes | currentName: _string \| number_      |
| open       | Triggered when a panel opens | currentName: _string \| number_      |

### CollapseItem Props

| Parameter  | Description                                                | Type              | Default |
| ---------- | ---------------------------------------------------------- | ----------------- | ------- |
| border     | Display inner border                                       | _boolean_         | `true`  |
| clickable  | Enable click feedback                                      | _boolean_         | `false` |
| disabled   | Disable the panel                                          | _boolean_         | `false` |
| icon       | Name or image link for the left icon in the title bar      | _string_          | -       |
| is-link    | Show arrow on the right of the title bar and enable click feedback | _boolean_         | `true`  |
| label      | Description in the title bar                               | _string_          | -       |
| name       | Unique identifier, defaults to index value                 | _string \| number_| `index` |
| size       | Size of the title bar, with `large` as an optional value   | _string_          | -       |
| title      | Content on the left side of the title bar                  | _string \| number_| -       |
| value      | Content on the right side of the title bar                 | _string \| number_| -       |

### CollapseItem Slot

| Name        | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| -           | Panel content                                                         |
| icon        | Custom `icon`                                                         |
| right-icon  | Custom right button, default is `arrow`. Requires `is-link` to be `false` to be effective |
| title       | Custom `title`                                                        |
| value       | Custom display content                                                |

### Collapse External Style Classes

| Class Name     | Description       |
| -------------- | ----------------- |
| custom-class   | Root node style class |

### CollapseItem External Style Classes

| Class Name      | Description       |
| --------------- | ----------------- |
| content-class   | Content style class |
| custom-class    | Root node style class |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                                          | Default Value                                 | Description                                |
| --------------------------------------------- | --------------------------------------------- | ------------------------------------------ |
| --collapse-item-transition-duration           | _0.3s_                                        | Duration of the collapse item transition   |
| --collapse-item-content-padding               | _15px_                                        | Padding for the collapse item content      |
| --collapse-item-content-font-size             | _13px_                                        | Font size of the collapse item content     |
| --collapse-item-content-line-height           | _1.5_                                         | Line height of the collapse item content   |
| --collapse-item-content-text-color            | _#969799_                                     | Text color of the collapse item content    |
| --collapse-item-content-background-color      | _var(--app-B6, #fff)_                         | Background color of the collapse item content |
| --collapse-item-title-disabled-color          | _#c8c9cc_                                     | Color of the disabled collapse item title  |