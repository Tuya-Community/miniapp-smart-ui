---
category: Display
new: true
---

# Empty Status

> Added since v2.0.0

### Introduction

Placeholder hints when in an empty state.

### Import

Import the component in `app.json` or `index.json`. The default is the `ES6` version. For `ES5`, refer to [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-empty": "@tuya-miniapp/smart-ui/lib/empty/index"
}
```

## Code Examples

### Basic Usage

The component internally has built-in `title` and `description`.  
```html
<smart-empty title="Title" description="Description text" />
```

### Custom Image

By providing an image address, you can customize the image.  
```html
<smart-empty
 image="https://images.tuyacn.com/rms-static/ae2ff530-976e-11ef-9ccb-47cdb7db279b-1730368709635.png?tyName=img_custom_empty.png"
/>
```

### Bottom Content

The default slot is inserted at the bottom of the component.
```html
<smart-empty title="Title" description="Description text">
  <smart-button round type="primary" >
    Button
  </smart-button>
</smart-empty>
```

### Using Slots

Custom slots `title` can insert titles, and `description` can insert description text.  
```jsx
<smart-empty>
  <text slot="title" style="font-weight: normal;">Insert title using slot</text>
  <text slot="description" style="font-weight: normal;">Insert description text using slot</text>
</smart-empty>
```

## API

### Props

| Parameter   | Description                                                      | Type     | Default   |
| ----------- | ---------------------------------------------------------------- | -------- | --------- |
| description | Description text below the image                                 | _string_ | -         |
| image       | Custom image URL                                                 | _string_ | `default` |
| image-style | Image style                                                      | _string_ | `''`      |
| title-style | Title style                                                      | _string_ | `''`      |
| description-style | Description style                                          | _string_ | `''`      |

### Slots

| Name        | Description    |
| ----------- | -------------- |
| -           | Custom bottom content |
| title       | Custom title   |
| description | Custom description text |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                             | Description |
| ----------------------------- | ----------------------------------------- | ----------- |
| --empty-image-width           | _180px_                                   | Image width |
| --empty-image-height          | _180px_                                   | Image height |
| --empty-title-color           | _var(--app-B6-N1, rgba(0, 0, 0, 1))_      | Title color |
| --empty-title-font-size       | _16px_                                    | Title font size |
| --empty-title-font-weight     | _normal_                                  | Title font weight |
| --empty-title-line-height     | _24px_                                    | Title line height |
| --empty-title-margin-top      | _7px_                                     | Title top margin |
| --empty-description-color     | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_    | Description text color |
| --empty-description-font-size | _14px_                                    | Description text font size |
| --empty-description-font-weight | _normal_                                | Description text font weight |
| --empty-description-line-height | _20px_                                  | Description text line height |
| --empty-description-margin-top | _4px_                                    | Description text top margin |
| --empty-bottom-margin-top     | _24px_                                    | Bottom content top margin |