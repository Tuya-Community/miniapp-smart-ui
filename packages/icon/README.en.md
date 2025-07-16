---
category: Display
---

# Icon

### Introduction

A set of font-based icons that can be used with the Icon component or referenced through the icon attribute in other components.

### Import

Introduce the component in `app.json` or `index.json`, for more details see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-icon": "@tuya-miniapp/smart-ui/lib/icon/index"
}
```

Import icon svg in `index.ts`

```js
import warningIcon from '@tuya-miniapp/icons/dist/svg/Warning';
```

## Code Examples

### Basic Usage

The `name` attribute of `Icon` supports passing icon names or image URLs.

```html
<smart-icon name="{{ warningIcon }}" />
<smart-icon name="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" />
```

### Notification

When the `dot` attribute is set, a small red dot will appear at the top-right corner of the icon. When the `info` attribute is set, a corresponding badge will display at the top-right corner of the icon.

```html
<smart-icon name="{{ warningIcon }}" dot />
<smart-icon name="{{ warningIcon }}" info="9" />
<smart-icon name="{{ warningIcon }}" info="99+" />
```

### Icon Color

Use the `color` attribute to control the icon color.

```html
<smart-icon name="{{ warningIcon }}" color="red" />
```

### Icon Size

Use the `size` attribute to control the icon size.

```html
<smart-icon name="{{ warningIcon }}" size="50px" />
```

### Custom Icons

If you need more icons based on existing ones, you can import third-party icon fonts and corresponding CSS files, and then use them directly in the Icon component. For example, you can import them in the `app.wxss` file.

```css
/* Import third-party or custom icon font styles */
@font-face {
  font-family: 'my-icon';
  src: url('./my-icon.ttf') format('truetype');
}

.my-icon {
  font-family: 'my-icon';
}

.my-icon-extra::before {
  content: '\e626';
}
```

```html
<!-- Specify the classname prefix as my-icon through class-prefix -->
<smart-icon class-prefix="my-icon" name="extra" />
```

### Svg Path `v2.3.3`

Components now also support rendering by passing the path.

```html
<smart-icon 
  name="M192 448C192 624.736 335.264 768 512 768s320-143.264 320-320a319.872 319.872 0 0 0-160-277.184V160a64 64 0 0 0-64-64h-192a64 64 0 0 0-64 64v10.816A319.872 319.872 0 0 0 192 448z m224-384h192a32 32 0 0 0 0-64h-192a32 32 0 0 0 0 64z" 
  size="36"
  color="#1989fa"
/>
```

## API

### Props

| Parameter     | Description                              | Type               | Default    |
| ------------- | ---------------------------------------- | ------------------ | ---------- |
| class-prefix  | Class name prefix                        | _string_           | `smart-icon` |
| color         | Icon color                               | _string_           | `inherit`  |
| custom-style  | Custom styles                            | _string_           | -          |
| dot           | Show a small red dot at the top-right corner of the icon | _boolean_          | `false`    |
| info          | Text notification at the top-right corner of the icon | _string \| number_ | -          |
| name          | Icon name, Svg URL, or image link        | _string_           | -          |
| size          | Icon size, such as `20px`, `2em`, default unit is `px` | _string \| number_ | `inherit`  |

### Events

| Event Name  | Description      | Parameters |
| ----------- | ---------------- | ---------- |
| bind:click  | Triggered when the icon is clicked | -          |

### External Style Classes

| Class Name     | Description           |
| -------------- | --------------------- |
| custom-class   | Root element style class |
| info-class     | Text style class at the top-right corner of the icon |


### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                             | Description |
| ----------------------------- | ----------------------------------------- | ----------- |
| --icon-color | _var(--app-B4-N2, rgba(0, 0, 0, 0.7))_ | icon color |


## FAQs

### What does the Failed to load font error in the developer tools mean?

This is an issue with the developer tools themselves and can be ignored. For more details, see [WeChat Mini Program Documentation](https://developers.weixin.qq.com/miniprogram/dev/api/ui/font/wx.loadFontFace.html) - Note 5.
