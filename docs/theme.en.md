---
category: Guide
---

# Custom Themes

### Background Knowledge

Mini Programs utilize [Shadow DOM](https://developers.google.com/web/fundamentals/web-components/shadowdom?hl=zh-cn) to implement custom components. Therefore, Smart UI uses corresponding [CSS Variables](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties) to implement custom themes. The content in the links can help you gain a basic understanding of these concepts and avoid many unnecessary troubles.

The compatibility requirements of CSS Variables can be viewed [here](https://caniuse.com/#feat=cssmart-variables). For devices that do not support CSS Variables, custom themes will not take effect. However, don't worry, the default styles will still be effective.

### Style Variables

The CSS Variables used for customization have the same names as Less variables. Below are some basic style variables. Please refer to the configuration file for all available color variables.

```less
// Component Colors
@text-color: #323233;
@border-color: #ebedf0;
@active-color: #f2f3f5;
@background-color: #f8f8f8;
@background-color-light: #fafafa;
```

## Customization Methods

### Customizing Theme Styles for a Single Component

> Set CSS Variables for the component in TYSS

```html
<smart-button class="my-button">
  Default Button
</smart-button>
```

```less
.my-button {
  --button-border-radius: 10px;
  --button-default-color: #f2f3f5;
}
```

> Or set CSS Variables via the style attribute, which allows you to easily implement dynamic theme switching

```html
<smart-button style="{{ buttonStyle }}">
  Default Button
</smart-button>
```

```js
Page({
  data: {
    buttonStyle: `
      --button-border-radius: 10px;
      --button-default-color: green;
    `,
  },

  onLoad() {
    setTimeout(() => {
      this.setData({
        buttonStyle: `
          --button-border-radius: 2px;
          --button-default-color: pink;
        `,
      });
    }, 2000);
  },
});
```

### Customizing Theme Styles for Multiple Components

> Similar to customizing a single component, simply wrap the components you want to customize with a container node and set CSS Variables on the container node

```html
<view class="container">
  <smart-button bind:click="onClick">
    Default Button
  </smart-button>

  <smart-toast id="smart-toast" />
</view>
```

```js
import Toast from '@tuya-miniapp/smart-ui/toast/toast';

Page({
  onClick() {
    Toast('This is a prompt message, suggested not to exceed fifteen words~');
  },
});
```

```less
.container {
  --button-border-radius: 10px;
  --button-default-color: #f2f3f5;
  --toast-max-width: 100px;
  --toast-background-color: pink;
}
```

### Customizing Global Theme Styles

> In app.tyss, writing CSS Variables will apply them globally

```less
page {
  --button-border-radius: 10px;
  --button-default-color: #f2f3f5;
  --toast-max-width: 100px;
  --toast-background-color: pink;
}