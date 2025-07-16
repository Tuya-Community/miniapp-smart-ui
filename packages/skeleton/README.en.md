---
category: Display
---

# Skeleton

### Introduction

Used to display a set of placeholder graphics while content is loading.

### Import

Import the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-skeleton": "@tuya-miniapp/smart-ui/lib/skeleton/index"
}
```

## Code Demonstration

### Basic Usage

Use the `title` attribute to show a title placeholder and the `row` attribute to configure the number of placeholder paragraph rows.

```html
<smart-skeleton title row="3" />
```

### Show Avatar

Use the `avatar` attribute to display an avatar placeholder.

```html
<smart-skeleton title avatar row="3" />
```

### Display Sub-components 

Set the `loading` attribute to `false` to indicate that content has finished loading. This will hide the placeholder and display the sub-components of `Skeleton`.

```html
<smart-skeleton title avatar row="3" loading="{{ loading }}">
  <view>Actual Content</view>
</smart-skeleton>
```

```js
Page({
  data: {
    loading: true,
  },
  onReady() {
    this.setData({
      loading: false,
    });
  },
});
```

## API

### Props

| Parameter    | Description                                 | Type                 | Default |
| ------------ | ------------------------------------------- | -------------------- | ------- |
| animate      | Whether to enable animation                 | _boolean_            | `true`  |
| avatar       | Whether to display an avatar placeholder    | _boolean_            | `false` |
| avatar-shape | Shape of the avatar placeholder, options are `square` | _string_   | `round` |
| avatar-size  | Size of the avatar placeholder              | _string \| number_   | `32px`  |
| loading      | Whether to display the placeholder, when `false` content of sub-components will be shown | _boolean_ | `true`  |
| row          | Number of placeholder paragraph rows        | _number_             | `0`     |
| row-width    | Width of the placeholder paragraphs, can be an array to set width of each row  | _string \| string[]_ | `100%`  |
| title        | Whether to display a title placeholder      | _boolean_            | `false` |
| title-width  | Width of the title placeholder              | _string \| number_   | `40%`   |

### External Style Classes

| Class Name    | Description       |
| ------------- | ----------------- |
| avatar-class  | Avatar placeholder style class |
| custom-class  | Root node style class   |
| row-class     | Paragraph placeholder style class |
| title-class   | Title placeholder style class |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description              |
| ----------------------------- | ---------------------------------------- | ------------------------ |
| --skeleton-padding            | _0 @padding-md_                         | Skeleton screen padding  |
| --skeleton-row-height         | _16px_                                  | Skeleton row height      |
| --skeleton-row-background-color | _var(--app-B3, #ffffff)_              | Skeleton row background color |
| --skeleton-row-margin-top     | _12px_                                  | Skeleton row top margin  |
| --skeleton-avatar-background-color | _var(--app-B3, #ffffff)_           | Skeleton avatar background color |
| --skeleton-animation-duration | _1.2s_                                  | Animation duration       |
