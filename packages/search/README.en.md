---
category: Data Entry
---

# Search

### Introduction

An input box component for search scenarios.

### Import

Import the component in `app.json` or `index.json`. For detailed introduction, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-search": "@tuya-miniapp/smart-ui/lib/search/index"
}
```

## Code Demonstration

### Basic Usage

In `smart-search`, value is used to control the text in the search box.

```html
<smart-search value="{{ value }}" placeholder="Please enter search keywords" />
```


### Simple style

In `smart-search`, value is used to control the text in the search box. Background can be adjusted via css variables.

```css
.easy-demo {
  --search-background-color: transparent;
  --search-body-background-color: var(--app-B3, #fff);
}
```
```html
<smart-search
  custom-class="easy-demo"
  model:value="{{ value }}"
  shape="round"
  search-text="Search"
  placeholder="Please enter search keywords"
  bind:search="onSearch"
/>
```



### Event Listening

`smart-search` provides search and cancel events. The search event is triggered when the user clicks the search button on the keyboard. The cancel event is triggered when the user clicks the cancel button on the right side of the search box.

```html
<smart-search
  value="{{ value }}"
  placeholder="Please enter search keywords"
  show-action
  search-text="Search"
  action-text="cancel"
  bind:search="onSearch"
  bind:cancel="onCancel"
  bind:clear="onClear"
/>
```

### Search Box Content Alignment

The `input-align` attribute can set the alignment of the content in the search box.

```html
<smart-search
  value="{{ value }}"
  input-align="center"
  placeholder="Please enter search keywords"
/>
```

### Disable Search Box

The `disabled` attribute can set the component to a disabled state.

```html
<smart-search disabled value="{{ value }}" placeholder="Please enter search keywords" />
```

### Custom Button

`smart-search` supports customizing the cancel button on the right, using a slot named action, and setting use-action-slot to true.

```html
<smart-search
  value="{{ value }}"
  label="Address"
  shape="round"
  placeholder="Please enter search keywords"
  use-action-slot
  bind:change="onChange"
  bind:search="onSearch"
>
  <view slot="action" bind:tap="onClick">Search</view>
</smart-search>

<smart-search
    value="{{ value }}"
    shape="round"
    placeholder="Please enter search keywords"
    bind:search="onSearch"
    bind:change="onChange"
  >
    <view slot="search-button" bind:tap="onClick">Search</view>
    <view slot="label">Address<smart-icon class="icon" name="{{icon}}" size="12px" /></view>
  </smart-search>
```

```css
.searchBtn {
  padding: 0 16px;
}
.icon {
  margin: 0 8px 0 4px;
}
```

```javascript
Page({
  data: {
    value: '',
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
    Toast('Search ' + this.data.value);
  },
  onClick() {
    Toast('Search ' + this.data.value);
  },
});
```

## API

### Props

| Parameter             | Description                                                                                                                                                   | Type               | Default  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------- |
| action-text   | Cancel button text                                                                                                                                            | _string_           | `Cancel` |
| background            | Background color of the search box                                                                                                                            | _string_           | `#f2f2f2`|
| clear-icon  | Clear [icon](/material/smartui?comId=icon&appType=miniapp) or image link                                                                                                                       | _string_           | `close`  |
| clear-trigger | When to show the clear icon, `always` means displayed when the input box is not empty, <br>`focus` means displayed when the input box is focused and not empty | _string_           | `focus`  |
| clearable             | Whether to enable the clear control                                                                                                                           | _boolean_          | `true`   |
| cursor-spacing        | The distance between the bottom of the input box and the keyboard when it is focused                                                                          | _number_           | `0`      |
| disabled              | Whether to disable the input box                                                                                                                              | _boolean_          | `false`  |
| error                 | Whether to mark the input content in red                                                                                                                      | _boolean_          | `false`  |
| focus                 | Autofocus                                                                                                                                                     | _boolean_          | `false`  |
| input-align           | Input box content alignment, optional values are `center` `right`                                                                                             | _string_           | `left`   |
| label                 | Text on the left side of the search box                                                                                                                       | _string_           | -        |
| left-icon             | Icon name or image link on the left side of the input box. Optional values are in the Icon component (ineffective if use-left-icon-slot is set)              | _string_           | `search` |
| maxlength             | Maximum input length, setting to -1 means no limit                                                                                                            | _number_           | `-1`     |
| name                  | Identifier when submitting within a form                                                                                                                      | _string_           | -        |
| placeholder           | Placeholder when the input box is empty                                                                                                                       | _string_           | -        |
| placeholder-style     | Style of the placeholder                                                                                                                                      | _string_           | -        |
| readonly              | Read-only                                                                                                                                                     | _boolean_          | `false`  |
| right-icon            | Icon name or image link on the right side of the input box. Optional values are in the Icon component (ineffective if use-right-icon-slot is set)            | _string_           | -        |
| shape                 | Shape, optional value is `round`                                                                                                                              | _string_           | `square` |
| show-action           | Whether to show the cancel button on the right side of the search box                                                                                         | _boolean_          | `false`  |
| use-action-slot       | Whether to use action slot                                                                                                                                    | _boolean_          | `false`  |
| use-left-icon-slot    | Whether to use the icon slot on the left side of the input box                                                                                                | _boolean_          | `false`  |
| use-right-icon-slot   | Whether to use the icon slot on the right side of the input box                                                                                               | _boolean_          | `false`  |
| value                 | Current input value                                                                                                                                           | _string \| number_ | -        |
| search-text `v2.0.0`       | Search button text                                                                                     | _string_ | -         |

### Events

| Event Name        | Description                  | Parameters                   |
| ----------------- | ---------------------------- | ---------------------------- |
| bind:blur         | Triggered when input loses focus   | -                              |
| bind:cancel       | Triggered when search is canceled | -                              |
| bind:change       | Triggered when input content changes | event.detail: Current input value |
| bind:clear        | Triggered when clear control is clicked | -                              |
| bind:click-input  | Triggered when search area is clicked | -                              |
| bind:focus        | Triggered when input is focused   | -                              |
| bind:search       | Triggered when search is confirmed | event.detail: Current input value |

### Slot

| Name        | Description                                                                       |
| ----------- | --------------------------------------------------------------------------------- |
| action      | Custom button on the right side of the search box, shown only when `use-action-slot` is true |
| label       | Custom text on the left side of the search box                                    |
| left-icon   | Custom icon on the left side of the input box, shown only when `use-left-icon-slot` is true  |
| right-icon  | Custom icon on the right side of the input box, shown only when `use-right-icon-slot` is true |
| search-button `v2.0.0` | Custom search button |

### External Style Classes

| Class Name    | Description      |
| ------------- | ---------------- |
| cancel-class  | Cancel button style class |
| custom-class  | Root node style class |
| field-class   | Search box style class |
| input-class   | Input box style class  |


### Style Variables

The component provides the following CSS variables for custom styles. Refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp) for usage instructions.

| Name | Default Value | Description |
| --- | --- | --- |
| --search-background-color | _var(--app-B3, #fff)_ | Search box background color |
| --search-body-background-color | _var(--app-B4-N9,rgba(0,0,0,0.05))_ | Search content background color |
| --search-padding | _12px var(--padding-md, 16px)_ | Search box padding |
| --search-input-height | _24px_ | Input box height |
| --search-label-padding | _0 5px_ | Label padding |
| --search-label-color | _var(--app-B4_N1, #000)_ | Label text color |
| --search-label-font-size | _var(--font-size-md)_ | Label font size |
| --search-value-font-size | _var(--font-size-md)_ | Input text font size |
| --search-left-icon-color | _var(--app-B4_N4, rgba(0,0,0,0.4))_ | Left icon color |
| --search-action-padding | _0 var(--padding-md) 0 var(--padding-sm)_ | Action button padding |
| --search-action-text-color | _var(--app-B4_N3, rgba(0,0,0,0.5))_ | Action button text color |
| --search-action-font-size | _var(--font-size-md)_ | Action button font size |
| --search-submit-font-size | _var(--font-size-md)_ | Submit button font size |
| --search-submit-color | _var(--app-M1, #3678e3)_ | Submit button color |
| --search-btn-hover-color | _var(--app-B4_N9, rgba(0,0,0,0.05))_ | Button hover color |
| --search-submit-line-width | _1px_ | Submit button line width |
| --search-submit-line-height | _12px_ | Submit button line height |
| --search-btn-hover-opacity | _0.4_ | Button hover opacity |