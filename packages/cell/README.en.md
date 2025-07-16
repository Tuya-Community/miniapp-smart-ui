---
category: Display
---

# Cell

### Introduction

Cells are individual display items in a list.

### Import

Introduce the component in `app.json` or `index.json`, detailed introduction can be found in [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-cell": "@tuya-miniapp/smart-ui/lib/cell/index",
  "smart-cell-group": "@tuya-miniapp/smart-ui/lib/cell-group/index"
}
```

## Code Examples

### Basic Usage

`Cell` can be used alone or in combination with `CellGroup`. `CellGroup` can provide top and bottom borders for `Cell`s.

```html
<smart-cell-group>
  <smart-cell title="Cell" value="Content" is-link />
  <smart-cell
    title="Cell"
    value="Content"
    label="Description"
    border="{{ false }}"
    is-link
  />
</smart-cell-group>
```

### Card Style

By using the `inset` attribute of `CellGroup`, cells can be turned into rounded card style (supported from version 1.7.2).

```html
<smart-cell-group inset>
  <smart-cell title="Cell" value="Content" is-link />
  <smart-cell title="Cell" value="Content" label="Description" border="{{ false }}" is-link />
</smart-cell-group>
```

### Display Icons

Use the `icon` attribute to display an icon on the left side of the title.

```html
<smart-cell
  title="Cell"
  value="Content"
  icon="{{ sunMaxFill }}"
  border="{{ false }}"
  is-link
/>
<smart-cell
  title="Custom Icon"
  value="Content"
  border="{{ false }}"
  is-link
>
  <smart-icon
    class="cell-icon"
    slot="icon"
    name="{{ sunMaxFill }}"
    size="24px"
    color="#3678E3"
  />
</smart-cell>
```

### Display Arrow

When the `is-link` attribute is set, an arrow will be shown on the right side of the cell, and the arrow direction can be controlled by the `arrow-direction` attribute.

```html
<smart-cell title="Cell" is-link />
<smart-cell title="Cell" is-link value="Content" />
<smart-cell title="Cell" is-link value="Content" arrow-direction="down" />
```

### Page Navigation

You can navigate to a page using the `url` attribute and control the type of navigation using the `link-type` attribute.

```html
<smart-cell title="URL Navigate (navigateTo)" is-link url="/pages/dashboard/index" />
<smart-cell title="URL Redirect (redirectTo)" is-link url="/pages/dashboard/index" link-type="redirectTo" />
<smart-cell title="Open H5 Container (openInnerH5)" is-link bind:click="onNavTo" border="{{ false }}" />
```

### Group Titles

You can specify group titles using the `title` attribute of `CellGroup`.

```html
<smart-cell-group title="Group 1">
  <smart-cell title="Cell" is-link border="{{ false }}" />
</smart-cell-group>
<smart-cell-group title="Group 2">
  <smart-cell title="Cell" is-link border="{{ false }}" />
</smart-cell-group>
```

### Other Types

You can also use other components for display

```html
<smart-cell title="Title">
  <smart-switch checked="{{ true }}" size="24px" />
</smart-cell>
<smart-cell title="Title">
  <smart-icon name="{{ checkMark }}" color="#3678E3" size="28px" />
</smart-cell>
<smart-cell title="Title">
  <smart-checkbox value="{{ false }}" shape="square" />
</smart-cell>
<smart-cell title="Title">
  <smart-checkbox value="{{ false }}" />
</smart-cell>
<smart-cell
  title="Title"
  label="Bedroom"
  is-link
  border="{{ false }}"
>
  <smart-icon
    class="cell-icon"
    slot="icon"
    name="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
    size="50px"
  />
</smart-cell>
```

### Using Slots

If the above usage does not meet your needs, you can use slots to customize the content.

```html
<smart-cell value="Content" icon="{{ sunMaxFill }}" is-link>
  <view slot="title">
    <view class="title">Cell</view>
    <smart-tag type="danger">Tag</smart-tag>
  </view>
</smart-cell>
<smart-cell title="Cell" border="{{ false }}">
  <smart-icon slot="right-icon" name="search" />
</smart-cell>
```

## API

### CellGroup Props

| Parameter | Description                 | Type      | Default |
| --------- | --------------------------- | --------- | ------- |
| border    | Whether to show the border  | _boolean_ | `true`  |
| inset     | Show as rounded card style  | _boolean_ | `false` |
| title     | Group title                 | _string_  | `-`     |

### CellGroup External Classes

| Class Name    | Description       |
| ------------- | ----------------- |
| custom-class  | Root node style   |

### Cell Props

| Parameter        | Description                                                 | Type               | Default       |
| ---------------- | ----------------------------------------------------------- | ------------------ | ------------- |
| arrow-direction  | Arrow direction, options are `left` `up` `down`             | _string_           | -             |
| border           | Whether to show the bottom border                           | _boolean_          | `true`        |
| clickable        | Whether to enable click feedback                            | _boolean_          | `false`       |
| icon             | Left icon svg value or image URL, see available options in [Icon Component](/material/smartui?comId=icon&appType=miniapp) | _string_           | -             |
| is-link          | Whether to show the right arrow and enable click feedback   | _boolean_          | `false`       |
| label            | Description information below the title                     | _string_           | -             |
| link-type        | Link type to navigate, options are `redirectTo` `switchTab` `reLaunch` | _string_           | `navigateTo` |
| required         | Whether to show the required asterisk                       | _boolean_          | `false`       |
| title            | Left title                                                  | _string \| number_ | -             |
| title-style      | Title style                                                 | _string_           | -             |
| title-width      | Title width (include units)                                 | _string_           | -             |
| url              | URL to navigate to on click                                 | _string_           | -             |
| use-label-slot   | Whether to use the label slot                               | _boolean_          | `false`       |
| value            | Right side content                                          | _string \| number_ | -             |

### Cell Event

| Event Name | Description               | Parameters |
| ---------- | ------------------------- | ---------  |
| bind:click | Triggered when the cell is clicked | -       |

### Cell Slot

| Name       | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| -          | Custom `value` content; ineffective if `value` attribute is set |
| icon       | Custom `icon` content; ineffective if `icon` attribute is set  |
| label      | Custom `label` content; requires setting the `use-label-slot` attribute |
| right-icon | Custom right button, defaults to `arrow`; ineffective if `is-link` attribute is set |
| title      | Custom `title` content; ineffective if `title` attribute is set |

### Cell External Classes

| Class Name   | Description     |
| -------------| ----------------|
| custom-class | Root node style |
| label-class  | Description style |
| title-class  | Title style     |
| value-class  | Right content style |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                                      | Default Value                                 | Description                               |
| ----------------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| --cell-font-size                          | _16px_                                        | Cell font size                            |
| --cell-line-height                        | _24px_                                        | Cell line height                          |
| --cell-vertical-padding                   | _16px_                                        | Cell vertical padding                     |
| --cell-horizontal-padding                 | _16px_                                        | Cell horizontal padding                   |
| --cell-text-color                         | _var(--app-B6-N1, rgba(0, 0, 0, 1))_          | Cell text color                           |
| --cell-background-color                   | _var(--app-B6, #fff)_                         | Cell background color                     |
| --cell-active-color                       | _var(--app-B1, #f6f7fb)_                      | Cell active color                         |
| --cell-required-color                     | _var(--app-M2, #f04c4c)_                      | Cell required field color                 |
| --cell-label-color                        | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_        | Cell label text color                     |
| --cell-label-font-size                    | _14px_                                        | Cell label font size                      |
| --cell-label-line-height                  | _18px_                                        | Cell label line height                    |
| --cell-label-margin-top                   | _3px_                                         | Cell label top margin                     |
| --cell-value-color                        | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_        | Cell value text color                     |
| --cell-icon-size                          | _24px_                                        | Cell icon size                            |
| --cell-right-icon-color                   | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_        | Cell right icon color                     |
| --cell-border-color `v2.1.4`              | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_        | Cell border color                         |
| --cell-border-left-position `v2.1.4`      | _16px_                                        | Cell left border position                 |
| --cell-border-right-position `v2.1.4`     | _16px_                                        | Cell right border position                |
| --cell-group-background-color             | _var(--app-B6, #fff)_                         | Cell group background color               |
| --cell-group-title-color                  | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_        | Cell group title color                    |
| --cell-group-title-padding                | _@padding-md @padding-md @padding-xs_         | Cell group title padding                  |
| --cell-group-title-font-size              | _16px_                                        | Cell group title font size                |
| --cell-group-title-line-height            | _16px_                                        | Cell group title line height              |
| --cell-group-inset-padding                | _0 @padding-md_                               | Cell group inset padding                  |
| --cell-group-inset-border-radius          | _16px_                                        | Cell group inset border radius            |
| --cell-group-inset-title-padding          | _@padding-md @padding-md @padding-xs @padding-xl_ | Cell group inset title padding            |