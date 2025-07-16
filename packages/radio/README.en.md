---
category: Data Entry
---

# Radio

### Introduction

Single selection from a group of options.

### Import

Import the component in `app.json` or `index.json`, as detailed in [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-radio": "@tuya-miniapp/smart-ui/lib/radio/index",
  "smart-radio-group": "@tuya-miniapp/smart-ui/lib/radio-group/index"
}
```

## Code Examples

### Basic Usage

Bind the current selected item's name with `value`.

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" custom-class="demo-radio-inline" />
  <smart-radio name="2" custom-class="demo-radio-inline" />
</smart-radio-group>
```

```css
.demo-radio-inline {
  margin: 10px 0 0 20px;
  display: inline-block !important;
}
```

```js
Page({
  data: {
    radio: '1',
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
});
```

### Disabled State

Use the `disabled` attribute to disable switching options. Setting `disabled` on `Radio` disables individual options.

```html
<smart-radio-group value="{{ radio }}" disabled bind:change="onChange">
  <smart-radio name="1" custom-class="demo-radio-inline" />
  <smart-radio name="2" custom-class="demo-radio-inline" />
</smart-radio-group>
```

### Custom Shape

Set the `shape` attribute to `square` to change the radio shape to a square.

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" shape="square" custom-class="demo-radio-inline" />
  <smart-radio name="2" shape="square" custom-class="demo-radio-inline" />
</smart-radio-group>
```

### Custom Color

Set the color of the icon in the checked state using the `checked-color` attribute.

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" custom-class="demo-radio-inline" checked-color="#10D0D0" />
  <smart-radio name="2" custom-class="demo-radio-inline" checked-color="#10D0D0" />
</smart-radio-group>
```

### Custom Size

Customize the icon size using the `icon-size` attribute.

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" icon-size="28px" custom-class="demo-radio-inline" />
  <smart-radio name="2" icon-size="28px" custom-class="demo-radio-inline" />
</smart-radio-group>
```

### Custom Text

Customize the text content through the slot child nodes.

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1">Radio 1</smart-radio>
  <smart-radio name="2">Radio 2</smart-radio>
</smart-radio-group>
```

### Horizontal Arrangement


Set the `direction` attribute to `horizontal` to change the radio group to a horizontal arrangement.

```html
<smart-radio-group
  value="{{ radio }}"
  bind:change="onChange"
  direction="horizontal"
>
  <smart-radio name="1">Radio 1</smart-radio>
  <smart-radio name="2">Radio 2</smart-radio>
</smart-radio-group>
```

### Custom Icons

Customize the icon through the `icon` slot, and set the `use-icon-slot` attribute.

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio use-icon-slot value="{{ radio }}" name="1">
    Custom Icon
    <image slot="icon" src="{{ radio === '1' ? icon.active : icon.normal }}" />
  </smart-radio>
  <smart-radio use-icon-slot value="{{ radio }}" name="2">
    Custom Icon
    <image slot="icon" src="{{ radio === '2' ? icon.active : icon.normal }}" />
  </smart-radio>
</smart-radio-group>
```

```js
Page({
  data: {
    radio: true,
    icon: {
      normal: 'https://images.tuyacn.com/content-platform/hestia/1729664215ebd89f13e54.png',
      active: 'https://images.tuyacn.com/content-platform/hestia/1730877912e76cbdb7563.png',
    },
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
});
```

### Disable Text Click

Disable radio text click by setting the `label-disabled` attribute.

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" label-disabled>Radio 1</smart-radio>
  <smart-radio name="2" label-disabled>Radio 2</smart-radio>
</smart-radio-group>
```

### Using With Cell Component

In this case, you need to import the `Cell` and `CellGroup` components.

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-cell-group>
    <smart-cell title="Radio 1" clickable data-name="1" bind:click="onClick">
      <smart-radio slot="right-icon" name="1" />
    </smart-cell>
    <smart-cell title="Radio 2" clickable data-name="2" bind:click="onClick">
      <smart-radio slot="right-icon" name="2" />
    </smart-cell>
  </smart-cell-group>
</smart-radio-group>
```

```js
Page({
  data: {
    radio: '1',
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
});
```



### prevent default UI Action

if `UI Update` Need Custom Action, you can set `prevent-default` with it!

```html
<smart-radio-group prevent-default value="{{ radio }}" bind:change="onChange">
    <smart-radio name="1">1</smart-radio>
    <smart-radio name="2">2</smart-radio>
  </smart-radio-group>
```

```js
Page({
  data: {
    radio: '1',
  },

  onChange(event) {
    ty.showModal({
      content: `onChange name: ${event.detail}`,
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            radio: event.detail
          })
        }
      }
    })
  },
});
```

## API

### RadioGroup Props

| Attribute              | Description                             | Type      | Default   |
| ---------------------- | --------------------------------------- | --------- | ---------- |
| direction     | Arrangement direction, optional `horizontal` | _string_  | `vertical` |
| disabled               | Whether to disable all radios           | _boolean_ | `false`    |
| name                   | Identifier for submission in a form      | _string_  | -          |
| value                  | Identifier for the currently selected item | _any_     | -          |
| prevent-default `v2.3.8` | prevent default ui update |_boolean_|`false`    |

### Radio Props

| Attribute          | Description                    | Type               | Default    |
| ------------------ | -----------------------------  | ------------------ | ---------  |
| checked-color      | Checked state color            | _string_           | `#1989fa`  |
| disabled           | Whether it is in disabled state | _boolean_          | `false`    |
| icon-size          | Icon size, default unit is `px` | _string \| number_ | `24px`     |
| label-disabled     | Whether to disable text click   | _boolean_          | `false`    |
| label-position     | Text position, optional `left`  | _string_           | `right`    |
| name               | Identifier                     | _string_           | -          |
| shape              | Shape, optional `square`       | _string_           | `round`    |
| use-icon-slot      | Whether to use icon slot       | _boolean_          | `false`    |

### Radio Event

| Event Name   | Description                       | Callback Parameters   |
| ------------ | --------------------------------- | --------------------- |
| bind:change  | Event triggered when the bound value changes | Name of the currently selected item |

### Radio External Style Class

| Class Name   | Description                       |
| ------------ | --------------------------------- |
| custom-class | Root Node Style Class             |
| icon-class   | Icon Style Class                  |
| label-class  | Description Information Style Class |

### RadioGroup Event

| Event Name   | Description                       | Callback Parameters   |
| ------------ | --------------------------------- | --------------------- |
| bind:change  | Event triggered when the bound value changes | Name of the currently selected item |

### Style Variables

The component offers the following CSS variables for custom styles. For usage, please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                            | Description |
| ----------------------------- | ---------------------------------------- | ----------- |
| --radio-size | 24px | Size of the radio button |
| --radio-border-color | var(--app-B6-N6, rgba(0, 0, 0, 0.2)) | Border color of the radio button |
| --radio-border-radius | 4px | Border radius of the radio button |
| --radio-transition-duration | 0.2s | Transition duration of the radio button |
| --radio-label-size | 12px | Font size of the radio button label |
| --radio-label-margin | 10px | Margin of the radio button label |
| --radio-label-color | var(--app-B6-N1, rgba(0, 0, 0, 1)) | Font color of the radio button label |
| --radio-checked-icon-color | var(--app-M4, #1989fa) | Icon color when the radio button is checked |
| --radio-disabled-label-color | var(--app-B6-N5, rgba(0, 0, 0, 0.3)) | Label color when the radio button is disabled |
| --radio-disabled-opacity | 0.3 | Opacity when the radio button is disabled |