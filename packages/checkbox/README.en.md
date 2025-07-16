---
category: Data Entry
---

# Checkbox 

### Introduction

Select multiple options from a set of alternatives.

### Import

Introduce the component in `app.json` or `index.json`. See [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp) for detailed instructions.

```json
"usingComponents": {
  "smart-checkbox": "@tuya-miniapp/smart-ui/lib/checkbox/index",
  "smart-checkbox-group": "@tuya-miniapp/smart-ui/lib/checkbox-group/index"
}
```

## Code Demos

### Basic Usage

Bind the checkbox's checked state with `value`.

```html
<smart-checkbox
  value="{{ checked }}"
  custom-class="demo-checkbox-inline"
  bind:change="onChange"
/>
<smart-checkbox
  value="{{ checked ? false : true }}"
  custom-class="demo-checkbox-inline"
  bind:change="onChange2"
/>
```

```js
Page({
  data: {
    checked: true,
  },

  onChange(event) {
    this.setData({ checked: event.detail });
  },

  onChange2(event) {
    this.setData({ checked: !event.detail });
  },
});
```

### Disabled State

Disable the checkbox by setting the `disabled` attribute.

```html
<smart-checkbox
  disabled
  value="{{ false }}"
  custom-class="demo-checkbox-inline"
/>
<smart-checkbox
  disabled
  value="{{ true }}"
  custom-class="demo-checkbox-inline"
/>
```

### Custom Shape

Set the `shape` attribute to `square` to change the checkbox shape to a square.

```html
<smart-checkbox
  value="{{ checked }}"
  shape="square"
  custom-class="demo-checkbox-inline"
  bind:change="onChange"
/>
<smart-checkbox
  value="{{ checked ? false : true }}"
  shape="square"
  custom-class="demo-checkbox-inline"
  bind:change="onChange2"
/>
```

### Custom Color

Customize the icon color in the checked state with the `checked-color` attribute.

```html
<smart-checkbox
  value="{{ checked }}"
  checked-color="#10D0D0"
  custom-class="demo-checkbox-inline"
  bind:change="onChange"
/>
<smart-checkbox
  value="{{ checked ? false : true }}"
  checked-color="#10D0D0"
  custom-class="demo-checkbox-inline"
  bind:change="onChange2"
/>
```

### Custom Size

Customize the icon size with the `icon-size` attribute.

```html
<smart-checkbox
  icon-size="28px"
  value="{{ checked }}"
  custom-class="demo-checkbox-inline"
  bind:change="onChange"
/>
<smart-checkbox
  icon-size="28px"
  value="{{ checked ? false : true }}"
  custom-class="demo-checkbox-inline"
  bind:change="onChange2"
/>
```

## Display Text

Display text through slot child nodes.

```html
<smart-checkbox
  value="{{ checked }}"
  bind:change="onChange"
>
  Custom Text
</smart-checkbox>
```

### Custom Icon

Customize the icon through the icon slot.

```html
<smart-checkbox
  use-icon-slot
  value="{{ checked }}"
  bind:change="onChange"
>
  Custom Icon
  <image
    slot="icon"
    class="icon"
    mode="widthFix"
    src="{{ checked ? activeIcon : inactiveIcon }}"
  />
</smart-checkbox>
```

```js
Page({
  data: {
    checked: true,
    activeIcon: 'https://images.tuyacn.com/content-platform/hestia/1730877912e76cbdb7563.png',
    inactiveIcon: '',
  },

  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
});
```

### Disable Text Click

Disable checkbox text click with the `label-disabled` attribute.

```html
  <smart-checkbox
  label-disabled
  value="{{ checked }}"
  bind:change="onChange"
>
  Checkbox
</smart-checkbox>
```

### Checkbox Group

Use in conjunction with `smart-checkbox-group`. The selected value is an array, bound via `value` on the `smart-checkbox-group`, with items in the array corresponding to the `name` attribute of the selected `Checkbox`.

```html
<smart-checkbox-group value="{{ result }}" bind:change="onChange">
  <smart-checkbox name="a">Checkbox a</smart-checkbox>
  <smart-checkbox name="b">Checkbox b</smart-checkbox>
  <smart-checkbox name="c">Checkbox c</smart-checkbox>
</smart-checkbox-group>
```

```javascript
Page({
  data: {
    result: ['a', 'b'],
  },

  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },
});
```

### Limit Maximum Selections

```html
<smart-checkbox-group value="{{ result }}" bind:change="onChange" max="{{ 2 }}">
  <smart-checkbox name="a">Checkbox a</smart-checkbox>
  <smart-checkbox name="b">Checkbox b</smart-checkbox>
  <smart-checkbox name="c">Checkbox c</smart-checkbox>
</smart-checkbox-group>
```

### Use with Cell Component

In this case, you need to introduce the `Cell` and `CellGroup` components, and manually trigger toggle using the checkbox's toggle method.

```html
<smart-checkbox-group value="{{ result }}" bind:change="onChange">
  <smart-cell-group>
    <smart-cell
      wx:for="{{ list }}"
      wx:key="index"
      title="Checkbox {{ item }}"
      value-class="value-class"
      clickable
      data-index="{{ index }}"
      bind:click="toggle"
    >
      <smart-checkbox
        catch:tap="noop"
        class="checkboxes-{{ index }}"
        name="{{ item }}"
      />
    </smart-cell>
  </smart-cell-group>
</smart-checkbox-group>
```

```js
Page({
  data: {
    list: ['a', 'b', 'c'],
    result: ['a', 'b'],
  },

  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() {},
});
```

```css
.value-class {
  flex: none !important;
}
```

## API

### Checkbox Props

| Attribute       | Description                      | Type               | Default   |
| --------------- | -------------------------------- | ------------------ | --------- |
| checked-color   | Checked state color              | _string_           | `#1989fa` |
| disabled        | Whether the checkbox is disabled | _boolean_          | `false`   |
| icon-size       | Icon size                        | _string \| number_ | `24px`    |
| label-disabled  | Whether to disable text click    | _boolean_          | `false`   |
| label-position  | Text position, `left` option     | _string_           | `right`   |
| name            | Checkbox name identifier         | _string_           | -         |
| shape           | Shape, `round` or `square`       | _string_           | `round`   |
| use-icon-slot   | Whether to use icon slot         | _boolean_          | `false`   |
| value           | Whether it’s checked             | _boolean_          | `false`   |

### CheckboxGroup Props

| Attribute           | Description                       | Type      | Default      |
| ------------------- | --------------------------------- | --------- | ------------ |
| direction  | Orientation, `horizontal` option  | _string_  | `vertical`   |
| disabled            | Whether all checkboxes are disabled | _boolean_ | `false`      |
| max                 | Set maximum selection count       | _number_  | `0` (no limit) |
| name                | Identifier in a form submission   | _string_  | -            |
| value               | Names of all selected items       | _Array_   | -            |

### Checkbox Event

| Event Name   | Description                    | Callback Parameter |
| ------------ | ------------------------------ | ------------------ |
| bind:change  | Triggered when the bound value changes | Current component value |

### Checkbox External Style Classes

| Class Name    | Description          |
| ------------- | -------------------- |
| custom-class  | Root node style class|
| icon-class    | Icon style class     |
| label-class   | Description style class |

### CheckboxGroup Event

| Event Name   | Description                    | Callback Parameter |
| ------------ | ------------------------------ | ------------------ |
| bind:change  | Triggered when the bound value changes | Current component value |

### Checkbox Slot

| Name | Description    |
| ---- | -------------- |
| -    | Custom text    |
| icon | Custom icon    |

### Checkbox Method

Get a checkbox instance with selectComponent and call its methods.

| Method Name | Parameters | Return Value | Description      |
| ----------- | ---------- | ------------ | ---------------- |
| toggle      | -          | -            | Toggle checked state |

### Style Variables

The component offers the following CSS variables for custom styles. For usage, please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                          | Description                       |
| ----------------------------- | -------------------------------------- | --------------------------------- |
| --checkbox-size               | _24px_                                 | Size of the checkbox              |
| --checkbox-border-color       | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_ | Border color of the checkbox      |
| --checkbox-border-radius      | _4px_                                  | Border radius of the checkbox     |
| --checkbox-transition-duration| _0.2s_                                 | Transition duration of the checkbox |
| --checkbox-label-size         | _12px_                                 | Font size of the checkbox label   |
| --checkbox-label-margin       | _10px_                                 | Margin of the checkbox label      |
| --checkbox-label-color        | _var(--app-B6-N1, rgba(0, 0, 0, 1))_   | Color of the checkbox label       |
| --checkbox-checked-icon-color | _@M4_                                  | Icon color when the checkbox is checked |
| --checkbox-disabled-label-color| _var(--app-B6-N1, rgba(0, 0, 0, 1))_  | Label color when the checkbox is disabled |
| --checkbox-disabled-opacity   | _0.3_                                  | Opacity of the checkbox when disabled |
