---
category: Feedback
---

# Picker Selector

### Introduction

Provides a collection of multiple options for users to choose from, supporting single-column selection and multi-column cascading. It is usually used in conjunction with the [Popup](/material/smartui?comId=popup&appType=miniapp) component.

### Import

Import the component in `app.json` or `index.json`. For a detailed introduction, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-picker": "@tuya-miniapp/smart-ui/lib/picker/index"
}
```

## Code Demo

### Basic Usage

In single column mode, the `active-index` attribute can control the selected item of the picker; `change-animation` can enable the transition animation effect for the selected value change of the picker.

```html
<smart-picker 
  columns="{{ columns }}"
  active-index="{{3}}"
  change-animation
  bind:change="onChange" 
/>
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou'],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`Current value: ${value}, Current index: ${index}`);
  },
});
```

### Multi-column Usage

`disabled` `v2.3.5` attribute can disable this column; `style` attribute can set the style of this column; `fontStyle` `v2.3.5` attribute can set the font style of this column; `activeIndex` can set the selected item of the column.

```html
<smart-picker active-style="color: #000;" columns="{{ columns }}" bind:change="onChange" />
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
        style: 'flex: none;width: auto;min-width: 61px;',
        fontStyle: 'font-size: 16px;'
      },
      {
        values: ['.'],
        disabled: true,
        style: 'flex: none;width: 8px;display:flex;justify-content: center;'
      },
      {
        values: new Array(20).fill(1).map((x, i) => i),
        style: 'flex: none;width: auto;min-width: 61px;',
        unit: 'Kg',
      },
    ],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`Current value: ${value}, Current index: ${index}`);
  },
});
```

### Default Selected Item

A single-column picker can set the initial selected item's index directly through the `default-index` property.

```html
<smart-picker
  columns="{{ columns }}"
  default-index="{{ 2 }}"
  bind:change="onChange"
/>
```

### Display Top Bar

```html
<smart-picker
  show-toolbar
  title="Title"
  columns="{{ columns }}"
  bind:cancel="onCancel"
  bind:confirm="onConfirm"
/>
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou'],
  },

  onConfirm(event) {
    const { picker, value, index } = event.detail;
    Toast(`Current value: ${value}, Current index: ${index}`);
  },

  onCancel() {
    Toast('Cancelled');
  },
});
```

### Multi-column Linkage

```html
<smart-picker columns="{{ columns }}" bind:change="onChange" />
```

```javascript
const cities = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou'],
  Fujian: ['Fuzhou', 'Xiamen', 'Putian', 'Sanming', 'Quanzhou'],
};

Page({
  data: {
    columns: [
      {
        values: Object.keys(cities),
        className: 'column1',
      },
      {
        values: cities['Zhejiang'],
        className: 'column2',
        defaultIndex: 2,
      },
    ],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, cities[value[0]]);
  },
});
```

### Disabled Options

The options can be an object structure, and you can disable an option by setting `disabled`.

```html
<smart-picker columns="{{ columns }}" />
```

```javascript
Page({
  data: {
    columns: [
      { text: 'Hangzhou', disabled: true },
      { text: 'Ningbo' },
      { text: 'Wenzhou' },
    ],
  },
});
```

### Loading State

When the Picker data is obtained asynchronously, the `loading` attribute can display a loading indicator.

```html
<smart-picker columns="{{ columns }}" loading />
```

### Set Column Style Order `v2.2.0`

By setting the `order` property for columns, you can set the order of columns. The higher the order of the relevant column, the further back it goes, similar to the `flex order` property in CSS, only changing the order from a style perspective; the logic remains unchanged.

```html
<smart-picker columns="{{ columns }}" />
```

```javascript
Page({
  data: {
    columns: [
      {
        values: ["Zhejiang", "Fujian"],
        order: 2
      },
      {
        values: ["Hangzhou", "Ningbo", "Wenzhou", "Jiaxing", "Huzhou"],
        order: 1
      },
    ],
  },
});
```

### Loop List `2.7.0`

`loop` can enable loop rendering of lists, which will be connected end-to-end and loop infinitely

```html
    
<smart-picker loop columns="{{ columns }}" bind:change="onChange" />
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
      },
    ],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`Current value: ${value}, current index: ${index}`);
  },
});
```

### More 3D `2.7.0`

`full-height` property allows for more space to display and see more 3D-flipped items; of course, you can also override the component's height style to customize the visible space you need.

```html
    
<smart-picker loop full-height columns="{{ columns }}" bind:change="onChange" />
```

```javascript
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  data: {
    columns: [
      {
        values: new Array(100).fill(1).map((x, i) => i),
      },
    ],
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`Current value: ${value}, current index: ${index}`);
  },
});
```

## API

### Props

| Parameter          | Description                     | Type      | Default  |
| ------------------ | ------------------------------- | --------- | -------- |
| active-index       | Current selected item index for single-column picker,<br>refer to Columns configuration for multi-column picker | _number_  | `-1`    |
| cancel-button-text | Cancel button text                                                        | _string_  | `Cancel` |
| columns            | Array of objects to configure data displayed in each column               | _Array_   | `[]`     |
| confirm-button-text| Confirm button text                                                       | _string_  | `Confirm`|
| default-index      | Default selected item index for single-column picker,<br>refer to Columns configuration for multi-column picker | _number_  | `0`     |
| item-height        | Option height                                                             | _number_  | `44`    |
| loading            | Whether to show loading state                                             | _boolean_ | `false` |
| show-toolbar       | Whether to show the top bar                                               | _boolean_ | `false` |
| title              | Top bar title                                                             | _string_  | `''`    |
| toolbar-position   | Top bar position, optional value is `bottom`                              | _string_  | `top`   |
| unit               | Default unit for single-column picker,<br>refer to Columns configuration for multi-column picker | _number_  | ''      |
| value-key          | Key corresponding to text in option object                                | _string_  | `text`  |
| visible-item-count | Number of visible options  | _3 \| 5 \| 7 \| 9_  | `5`     |
| active-style `v2.0.0`  | Style in selected state         | _string_  | `''`    |
| change-animation `v2.2.0`  | Whether the component requires a transition animation when the value selected by data-driven changes (excluding the animation of finger interactive scrolling). | _boolean_  | `false`  |
| animation-time `v2.3.7`  | Transition animation and the delay time for selection callback (Unit: ms)           | _number_  | `800` `v2.3.7` `300` `v2.6.0`     |
| loop `v2.7.0`  | Loop List           | _boolean_  | `false`    |
| font-style `v2.7.0`  | Font style has lower priority than within columns           | _string_  | -    |
| full-height `v2.7.0`  | Does the height directly equal `visibleItemCount * itemHeight`, the component will default to reduce the outer visible height by `* 0.9`.     | _boolean_  | `false`   |

### Events

The events of the Picker component return different parameters depending on whether `columns` is single-column or multi-column.

| Event Name    | Description         | Parameters                                                                                     |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| bind:cancel   | Triggered when cancel button is clicked | Single column: selected value, index of selected value<br>Multi-column: all selected values, indexes of selected values |
| bind:change   | Triggered when the option changes | Single column: Picker instance, selected value, index of selected value<br>Multi-column: Picker instance, all selected values, index of the current column |
| bind:confirm  | Triggered when confirm button is clicked | Single column: selected value, index of selected value<br>Multi-column: all selected values, indexes of selected values |
| bind:animation-start `v2.3.0` | Component internal animation starts | -  |
| bind:animation-end `v2.3.0` | The internal animation of the component has ended. | -  |

### Columns Data Structure

When passing in multi-column data, `columns` is an array of objects. Each object in the array configures each column, and each column has the following `key`.

| Key           | Description                         |
| ------------- | ----------------------------------- |
| active-index  | Index of the currently selected item, default is -1 |
| default-index | Index of the initially selected item, default is 0  |
| style `v2.0.0` | Column style                       |
| fontStyle `v2.3.5` | Column text style  |
| unit          | Unit corresponding to the column, default is empty |
| values        | Array of options corresponding to the column       |
| order `v2.2.0`  | Set the order of columns, similar to `flex order` property, only changing the order from a style perspective; logic remains unchanged | _number_  | -     |
| disabled `v2.3.5`  | Disable this column   | _boolean_  | `false`     |

### External Style Classes

| Class Name      | Description        |
| --------------- | ------------------ |
| column-class    | Column style class |
| custom-class    | Root node style class |
| toolbar-class   | Top bar style class |
| hairline-class `v2.6.0` | Style class of the dividing line |

### Methods

You can get the picker instance through [selectComponent](/material/smartui?comId=faq&appType=miniapp) and call its instance methods.

| Method Name     | Parameter          | Return Value | Description                  |
| --------------- | ------------------ | ------------ | ---------------------------- |
| getColumnIndex  | columnIndex        | optionIndex  | Get the index of the selected item in the corresponding column |
| getColumnValue  | columnIndex        | value        | Get the selected value in the corresponding column |
| getColumnValues | columnIndex        | values       | Get all options in the corresponding column |
| getIndexes      | -                  | indexes      | Get the indexes corresponding to the selected values in all columns |
| getValues       | -                  | values       | Get the selected values in all columns |
| setColumnIndex  | columnIndex, optionIndex | -          | Set the index of the selected item in the corresponding column |
| setColumnValue  | columnIndex, value | -            | Set the selected value in the corresponding column |
| setColumnValues | columnIndex, values | -           | Set all options in the corresponding column |
| setIndexes      | indexes            | -            | Set the indexes corresponding to the selected values in all columns |
| setValues       | values             | -            | Set the selected values in all columns |

### Style Variables

The component provides the following CSS variables for custom styling. For usage, please refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).
| Name                              | Default Value                               | Description                       |
| --------------------------------- | -------------------------------------------- | --------------------------------- |
| --picker-background-color         | _var(--app-B4, #ffffff)_                     | Picker background color           |
| --picker-padding                  | _16px_                                       | Picker padding                    |
| --picker-toolbar-height           | _44px_                                       | Toolbar height                    |
| --picker-title-font-size          | _16px_                                       | Title font size                   |
| --picker-action-padding           | _0 @padding-md_                              | Action button padding             |
| --picker-action-font-size         | _14px_                                       | Action button font size           |
| --picker-confirm-action-color     | _#576b95_                                    | Confirm button color              |
| --picker-cancel-action-color      | _#969799_                                    | Cancel button color               |
| --picker-option-font-size         | _16px_                                       | Option font size                  |
| --picker-option-unit-font-size    | _12px_                                       | Unit font size                    |
| --picker-option-text-color        | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_       | Option text color                 |
| --picker-option-unit-text-color   | _var(--app-B6-N4, rgba(0, 0, 0, 0.4))_       | Unit text color                   |
| --picker-loading-icon-color       | _#1989fa_                                    | Loading icon color                |
| --picker-loading-mask-color       | _var(--app-B4, #ffffff)_                     | Loading mask color                |
| --picker-option-disabled-opacity  | _0.3_      | Disabled option opacity           |
| --picker-option-selected-text-color | _var(--app-B6-N1, rgba(0, 0, 0, 1))_       | Selected option text color        |
| --picker-option-unit-mid-size `v2.4.0` | _0_  `v2.4.0` _4px_ `v2.6.0` | Spacing between units and content text |
| --picker-option-selected-font-weight-bold `v2.6.0` | _700_ | Font weight of selected text |
