---
category: Display
---

# Image

### Introduction

An enhanced img tag providing multiple image fill modes, supporting lazy loading, loading prompts, and error prompts.

### Import

Introduce the component in `app.json` or `index.json`. For details, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-image": "@tuya-miniapp/smart-ui/lib/image/index"
}
```

## Code Demonstrations

### Basic Usage

Basic usage is consistent with the native [image](<(https://developers.weixin.qq.com/miniprogram/dev/component/image.html)>) tag, where you can set native attributes like `src`, `width`, `height`, etc.

```html
<smart-image width="100" height="100" src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" />
```

### Fill Mode

You can set the image fill mode through the `fit` attribute, with optional values listed in the table below.

```html
<smart-image
  width="10rem"
  height="10rem"
  fit="contain"
  src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
/>
```

### Circular Image

You can set the image to be circular through the `round` attribute. Note that when the width and height of the image are not equal and `fit` is `contain` or `scale-down`, a complete circle cannot be filled.

```html
<smart-image
  round
  width="10rem"
  height="10rem"
  src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
/>
```

### Lazy Loading

Images are lazy-loaded and only start loading when they are about to enter a certain range (three screens up and down).

```html
<smart-image
  width="100"
  height="100"
  lazy-load
  src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
/>
```

### Loading Prompt

The `Image` component provides a default loading prompt, with support for custom content via the `loading` slot.

```html
<smart-image use-loading-slot>
  <smart-loading slot="loading" type="spinner" size="20" vertical />
</smart-image>
```

### Error Prompt

The `Image` component provides a default error prompt, with support for custom content via the `error` slot.

```html
<smart-image use-error-slot>
  <text slot="error">Load failed</text>
</smart-image>
```

### Change image color `v2.3.3`

`tint-color`The attribute can directly modify the color of the image, similar to the tintColor property in RN. The principle is achieved through CSS mask, so make sure to conduct a user compatibility investigation before use.

```html
<smart-image 
  width="100" 
  height="100" 
  src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" 
  tint-color="rgba(255, 255, 25, 0.4)"
/>
```

## API

### Props

| Parameter              | Description                             | Type               | Default  |
| ---------------------- | --------------------------------------- | ------------------ | ------- |
| alt                    | Alternative text                        | _string_           | -       |
| fit                    | Image fill mode                         | _string_           | _fill_  |
| height                 | Height, default unit is `px`            | _string \| number_ | -       |
| lazy-load              | Whether to lazy load                    | _boolean_          | `false` |
| radius                 | Corner size, default unit is `px`       | _string \| number_ | `0`     |
| round                  | Whether to display as circular          | _boolean_          | `false` |
| show-error             | Whether to show image load failure prompt | _boolean_          | `true`  |
| show-loading           | Whether to show image loading prompt    | _boolean_          | `true`  |
| show-menu-by-longpress | Whether to enable long press image to display recognition mini-program code menu | _boolean_          | `false` |
| src                    | Image link                              | _string_           | -       |
| use-error-slot         | Whether to use error slot               | _boolean_          | `false` |
| use-loading-slot       | Whether to use loading slot             | _boolean_          | `false` |
| webp `v1.10.11`        | Whether to decode webp format           | _boolean_          | `false` |
| width                  | Width, default unit is `px`             | _string \| number_ | -       |
| tint-color `v2.3.3`                  |     Modify the image color, similar to RN's tintColor, using CSS mask implementation        | _string_ | -       |


### Image Fill Modes

| Name      | Meaning                                                |
| --------- | ------------------------------------------------------ |
| contain   | Scale the image while maintaining aspect ratio, so the long side fully displays |
| cover     | Scale the image while maintaining aspect ratio, so the short side fully displays, cropping the long side |
| fill      | Stretch the image to fill the element                  |
| heightFix | Adjust width automatically with fixed height, maintaining original aspect ratio |
| none      | Retain original image size                             |
| widthFix  | Adjust height automatically with fixed width, maintaining original aspect ratio |

### Events

| Event Name | Description            | Callback Parameters |
| ---------- | ---------------------- | ------------------ |
| bind:click | Triggered on image click | event: Event       |
| bind:error | Triggered on image load failure | event: Event       |
| bind:load  | Triggered when image load is complete | event: Event       |

### Slots

| Name    | Description                         |
| ------- | ----------------------------------- |
| error   | Custom prompt for load failure      |
| loading | Custom prompt during loading        |

### External Style Classes

| Class Name       | Description       |
| ---------------- | ----------------- |
| custom-class     | Root node style   |
| error-class      | Error style       |
| image-class      | Image style       |
| loading-class    | Loading style     |

### Style Variables

The component provides the following CSS variables for custom styling. For usage, refer to the [ConfigProvider component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                               | Default Value                        | Description     |
| ---------------------------------- | ------------------------------------ | --------------- |
| --image-placeholder-text-color    | _#969799_                            | Loading description text |
| --image-placeholder-font-size     | _14px_                               | Loading text font size |
| --image-placeholder-background-color | _#f7f8fa_                          | Loading overlay background color |
| --image-loading-icon-size         | _32px_                               | Loading icon size |
| --image-loading-icon-color        | _#dcdee0_                            | Loading icon color |
| --image-error-size `v2.0.0`                | _32px_                               | Default image on load error |