---
category: Layout
---

# Grid

### Introduction

The grid can divide a page into equal-width sections horizontally, used for displaying content or page navigation.

### Integration

Introduce the component in `app.json` or `index.json`, see [Quickstart](/material/smartui?comId=help-getting-started&appType=miniapp) for details.

```json
"usingComponents": {
  "smart-grid": "@tuya-miniapp/smart-ui/lib/grid/index",
  "smart-grid-item": "@tuya-miniapp/smart-ui/lib/grid-item/index"
}
```

## Code Demonstration

### Basic Usage

Set the icon in the grid with the `icon` attribute and the text with the `text` attribute.

```html
<smart-grid>
  <smart-grid-item icon="photo-o" text="Text" />
  <smart-grid-item icon="photo-o" text="Text" />
  <smart-grid-item icon="photo-o" text="Text" />
  <smart-grid-item icon="photo-o" text="Text" />
</smart-grid>
```

### Custom Columns

The default displays four grids per row. You can customize the number of columns with the `column-num` attribute.

```html
<smart-grid column-num="3">
  <smart-grid-item icon="photo-o" text="Text" ty:for="{{ 6 }}" />
</smart-grid>
```

### Custom Content

The grid content can be customized through slots.

```html
<smart-grid column-num="3" border="{{ false }}">
  <smart-grid-item use-slot ty:for="{{ 3 }}" ty:for-item="index">
    <image
      style="width: 90px; height: 90px;"
      src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
    />
  </smart-grid-item>
</smart-grid>
```

### Square Grid

Setting the `square` attribute will make the grid's height consistent with its width.

```html
<smart-grid square>
  <smart-grid-item icon="photo-o" text="Text" ty:for="{{ 8 }}" />
</smart-grid>
```

### Grid Spacing

Use the `gutter` attribute to set the distance between grids.

```html
<smart-grid gutter="{{ 10 }}">
  <smart-grid-item icon="photo-o" text="Text" ty:for="{{ 8 }}" />
</smart-grid>
```

### Horizontal Content

Set the `direction` attribute to `horizontal` to make the grid content horizontal.

```html
<smart-grid direction="horizontal" column-num="2">
  <smart-grid-item icon="photo-o" text="Text" />
  <smart-grid-item icon="photo-o" text="Text" />
  <smart-grid-item icon="photo-o" text="Text" />
</smart-grid>
```

### Page Navigation

Use the `url` attribute for page navigation and the `link-type` to control the navigation type.

```html
<smart-grid clickable column-num="2">
  <smart-grid-item
    icon="home-o"
    link-type="navigateTo"
    url="/pages/dashboard/index"
    text="Navigate"
  />
  <smart-grid-item
    icon="search"
    link-type="reLaunch"
    url="/pages/dashboard/index"
    text="ReLaunch"
  />
</smart-grid>
```

### Notifications

The `dot` attribute displays a small red dot in the top-right corner of the icon. The `badge` attribute shows a corresponding badge.

```html
<smart-grid column-num="2">
  <smart-grid-item icon="home-o" text="Text" dot />
  <smart-grid-item icon="search" text="Text" badge="99+" />
</smart-grid>
```

## API

### Grid Props

| Parameter          | Description                                 | Type               | Default    |
| ------------------ | ------------------------------------------- | ------------------ | ---------- |
| border             | Whether to display a border                 | _boolean_          | `true`     |
| center             | Whether to center the grid content          | _boolean_          | `true`     |
| clickable          | Whether to enable grid click feedback       | _boolean_          | `false`    |
| column-num         | Number of columns                           | _number_           | `4`        |
| direction          | Content direction, options are `horizontal` | _string_           | `vertical` |
| gutter             | Space between grids, default unit is `px`   | _string \| number_ | `0`        |
| icon-size `v1.3.2` | Icon size, default unit is `px`             | _string_           | `28px`     |
| reverse `v1.7.0`   | Swap icon and text positions                | _boolean_          | `false`    |
| square             | Fix the grid as a square                    | _boolean_          | `false`    |
| use-slot           | Use customization slot                      | _boolean_          | `false`    |

### External Grid Style Class

| Class Name   | Description           |
| ------------ | --------------------- |
| custom-class | Root node style class |

### GridItem Props

| Parameter            | Description                                                                                                                                     | Type               | Default      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------ |
| badge                | Content of the top-right badge of the icon                                                                                                      | _string \| number_ | -            |
| dot                  | Show a small red dot on the top-right of the icon                                                                                               | _boolean_          | `false`      |
| icon                 | Icon Svg Value or image link, see [Icon Component](/material/smartui?comId=icon&appType=miniapp)                                                | _string_           | -            |
| icon-color           | Icon color                                                                                                                                      | _string_           | -            |
| icon-prefix `v1.7.0` | Third-party icon prefix                                                                                                                         | _string_           | `smart-icon` |
| link-type            | Link jump type, options are `redirectTo` [`switchTab`](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html) `reLaunch` | _string_           | `navigateTo` |
| text                 | Text                                                                                                                                            | _string_           | -            |
| url                  | Link address to jump to when clicked                                                                                                            | _string_           | -            |

### GridItem Events

| Event Name | Description                        | Callback Parameter |
| ---------- | ---------------------------------- | ------------------ |
| bind:click | Triggered when the grid is clicked | -                  |

### GridItem Slots

| Name | Description                                                       |
| ---- | ----------------------------------------------------------------- |
| -    | Customize all grid content, need to set `use-slot` attribute      |
| icon | Custom icon, ineffective if `use-slot` or `icon` attribute is set |
| text | Custom text, ineffective if `use-slot` or `text` attribute is set |

### External GridItem Style Class

| Class Name    | Description           |
| ------------- | --------------------- |
| content-class | Content style class   |
| custom-class  | Root node style class |
| icon-class    | Icon style class      |
| text-class    | Text style class      |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                                 | Default Value                          | Description      |
| ------------------------------------ | -------------------------------------- | ---------------- |
| --grid-item-content-padding          | _@padding-md @padding-xs_              | Content padding  |
| --grid-item-content-background-color | _var(--app-B3, #ffffff)_               | Background color |
| --grid-item-content-active-color     | _#f2f3f5_                              | Active color     |
| --grid-item-icon-size                | _26px_                                 | Icon size        |
| --grid-item-text-color               | _var(--app-B6-N2, rgba(0, 0, 0, 0.7))_ | Text color       |
| --grid-item-text-font-size           | _12px_                                 | Text font size   |
