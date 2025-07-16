---
category: Data Entry
---

# Cascader

### Introduction

Cascading selector boxes are used for selecting multi-level data, with typical scenarios being province, city, and district selections.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-cascader": "@tuya-miniapp/smart-ui/lib/cascader/index"
}
```

## Code Examples

### Basic Usage

The cascading selector component can be used with Field and Popup components, as shown below:

```html
<smart-field
  value="{{ fieldValue }}"
  is-link
  readonly
  label="Region"
  placeholder="Please select your region"
  bind:tap="onClick"
/>
<smart-popup show="{{ show }}" round position="bottom">
  <smart-cascader
    ty:if="{{ show }}"
    value="{{ cascaderValue }}"
    title="Please select your region"
    options="{{ options }}"
    bind:close="onClose"
    bind:finish="onFinish"
  />
</smart-popup>
```

```js

const options = [
  {
    text: 'Zhejiang Province',
    value: '330000',
    children: [{ text: 'Hangzhou City', value: '330100' }],
  },
  {
    text: 'Jiangsu Province',
    value: '320000',
    children: [{ text: 'Nanjing City', value: '320100' }],
  },
];

Page({
  data: {
    show: false,
    options,
    fieldValue: '',
    cascaderValue: '',
  },

  onClick() {
    this.setData({
      show: true,
    });
  },

  onClose() {
    this.setData({
      show: false,
    });
  },

  onFinish(e) {
    const { selectedOptions, value } = e.detail;
    const fieldValue = selectedOptions
        .map((option) => option.text || option.name)
        .join('/');
    this.setData({
      fieldValue,
      cascaderValue: value,
    })
  },
});
```

### Custom Color

Use the `active-color` property to set the highlight color for selected options.

```html
<smart-cascader
  value="{{ cascaderValue }}"
  title="Please select your region"
  options="{{ options }}"
  active-color="#ee0a24"
  bind:close="onClose"
  bind:finish="onFinish"
/>
```

### Asynchronous Loading of Options

You can listen to the `change` event and dynamically set `options` to achieve asynchronous loading of options.

```html
<smart-field
  value="{{ fieldValue }}"
  is-link
  readonly
  label="Region"
  placeholder="Please select your region"
  bind:tap="onClick"
/>
<smart-popup show="{{ show }}" round position="bottom">
  <smart-cascader
    ty:if="{{ show }}"
    value="{{ cascaderValue }}"
    title="Please select your region"
    options="{{ options }}"
    bind:close="onClose"
    bind:change="onChange"
    bind:finish="onFinish"
  />
</smart-popup>
```

```js
Page({
  data: {
    options: [
      {
        text: 'Zhejiang Province',
        value: '330000',
        children: [],
      }
    ];
  },
  onChange(e) {
    const { value } = e.detail;
    if (value === this.data.options[0].value) {
      setTimeout(() => {
        const children = [
          { text: 'Hangzhou City', value: '330100' },
          { text: 'Ningbo City', value: '330200' },
        ];
        this.setData({
          'options[0].children': children,
        })
      }, 500);
    }
  },
});

```

## API

### Props

| Parameter        | Description                                                              | Type               | Default    |
| ---------------- | ------------------------------------------------------------------------ | ------------------ | ---------- |
| active-color     | Highlight color of the selected state                                    | _string_           | `#1989fa`  |
| close-icon       | svg value or URL of the close icon, equivalent to the Icon component's [name attribute](/material/smartui?comId=icon&appType=miniapp) | _string_           | `cross`    |
| closeable        | Whether to display the close icon                                       | _boolean_          | `true`     |
| ellipsis         | Whether to truncate long title text, closing it will cause horizontal scrolling for long text | _boolean_          | `true`     |
| options          | Data source for options                                                 | _CascaderOption[]_ | `[]`       |
| placeholder      | Placeholder text when no option is selected                             | _string_           | `Please select` |
| show-header      | Whether to display the title bar                                        | _boolean_          | `true`     |
| swipe-threshold  | Scroll threshold, horizontal scrolling will start when the number of labels exceeds the threshold and the total width exceeds the width of the label bar | _number_           | `5`        |
| swipeable        | Whether to enable left and right swipe gestures                         | _boolean_          | `false`    |
| title            | Top title                                                               | _string_           | -          |
| use-title-slot   | Whether to use a custom title slot                                      | _boolean_          | `false`    |
| value            | Value of the selected option                                            | _string \| number_ | -          |

### CascaderOption Data Structure

The `options` attribute is an array of objects where each object configures an option. The objects can include the following values:

| Key        | Description                   | Type                        |
| ---------- | ----------------------------- | --------------------------- |
| className  | Adds extra class to the corresponding column | _string \| Array \| object_ |
| color      | Text color of the option      | _string_                    |
| disabled   | Whether to disable the option | _boolean_                   |
| options    | List of child options         | _CascaderOption[]_          |
| text       | Text of the option (required) | _string_                    |
| value      | Value corresponding to the option (required) | _string \| number_          |

### Events

| Event           | Description                    | Callback Parameters                                                                              |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| bind:change     | Triggered when the selected option changes   | event.detail: _{ value: string \| number, selectedOptions: CascaderOption[], tabIndex: number }_       |
| bind:click-tab  | Triggered when a tab is clicked | event.detail: _{ tabIndex: number, title: string }_                                                  |
| bind:close      | Triggered when the close icon is clicked | -                                                                                                |
| bind:finish     | Triggered when all options are selected | event.detail: _{ value: string \| number, selectedOptions: CascaderOption[], tabIndex: number }_       |

### Slots

| Name  | Description                | Parameters |
| ----- | -------------------------- | ---------- |
| title | Custom top title           | -          |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).  

| Name                                  | Default Value                             | Description                              |
| ------------------------------------- | ----------------------------------------- | ---------------------------------------- |
| --cascader-header-height              | _48px_                                    | Cascader header height                   |
| --cascader-header-padding             | _0 16px_                                  | Cascader header padding                  |
| --cascader-title-font-size            | _16px_                                    | Cascader title font size                 |
| --cascader-title-line-height          | _20px_                                    | Cascader title line height               |
| --cascader-close-icon-size            | _22px_                                    | Cascader close icon size                 |
| --cascader-close-icon-color           | _#c8c9cc_                                 | Cascader close icon color                |
| --cascader-selected-icon-size         | _18px_                                    | Cascader selected icon size              |
| --cascader-tabs-height                | _48px_                                    | Cascader tabs height                     |
| --cascader-active-color               | _#1989fa_                                 | Cascader active item color               |
| --cascader-options-height             | _384px_                                   | Cascader options height                  |
| --cascader-option-disabled-color      | _#c8c9cc_                                 | Cascader disabled option color           |
| --cascader-tab-color                  | _var(--app-B6-N1, rgba(0, 0, 0, 1))_      | Cascader tab color                       |
| --cascader-unselected-tab-color       | _#969799_                                 | Cascader unselected tab color            |
| --cascader-tab-inactive-color         | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_    | Cascader tab inactive color              |
| --cascader-text-color                 | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_    | Cascader text color                      |