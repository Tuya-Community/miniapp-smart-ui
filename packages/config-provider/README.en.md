---
category: General
---

# ConfigProvider Global Configuration

### Introduction

Used to configure the theme styles of Smart UI components.

### Importing

Import the component in `app.json` or `index.json`. For details, see [Getting Started](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-config-provider": "@tuya-miniapp/smart-ui/lib/config-provider/index"
}
```

## Customizing Theme

### Introduction

Smart UI components organize styles through rich [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). By overriding these CSS variables, you can achieve **custom themes, dynamic theme switching**, and other effects.

#### Example

Taking the Button component as an example, by viewing the component's styles, you can see the following variables in the `.smart-button--primary` class name:

```css
.smart-button--primary {
  color: var(--button-primary-color, #fff);
  background: var(--button-primary-background-color, #07c160);
  border: var(--button-border-width, 1px) solid var(
      --button-primary-border-color,
      #07c160
    );
}
```

### Custom CSS Variables

#### Overriding via CSS

You can directly override these CSS variables in your code, and the Button component's styles will change accordingly:

```css
/* After adding this style, the Primary Button will turn red */
page {
  --button-primary-background-color: red;
}
```

#### Overriding via ConfigProvider

`ConfigProvider` component provides the ability to override CSS variables. You need to wrap a `ConfigProvider` component around the component node and configure some theme variables through the `theme-vars` attribute, where the input parameters are the component's CSS variables converted to camelCase.

```html
<view class="demo-buttons">
  <smart-button type="primary" data-color="red" color="red" bind:click="onChange">
    Set to red
  </smart-button>
  <smart-button type="primary" data-color="green" color="green" bind:click="onChange">
    Set to green
  </smart-button>
  <smart-button type="primary" data-color="blue" color="blue" bind:click="onChange">
    Set to blue 
  </smart-button>
</view>
<smart-config-provider theme-vars="{{ themeVars }}">
  <smart-button type="primary">Main Button</smart-button>
</smart-config-provider>
```

```js
Page({
  data: {
    themeVars: {
      buttonPrimaryBorderColor: 'red',
      buttonPrimaryBackgroundColor: 'red',
    },
  },

  onChange(event) {
    const { color } = event.currentTarget.dataset;
    this.setData({
      themeVars: {
        buttonPrimaryBorderColor: color,
        buttonPrimaryBackgroundColor: color,
      },
    });
  },
});
```

### Theme Switching `v2.7.4`

The `ConfigProvider` component supports switching between light and dark themes using the `theme` property, with optional values of `light` and `dark`.

```html
<view class="demo-buttons">
  <smart-button type="primary" data-theme="light" bind:click="onThemeChange">
    Light Theme
  </smart-button>
  <text>Current Theme: {{ currentTheme }}</text>
  <smart-button type="primary" data-theme="dark" bind:click="onThemeChange">
    Dark Theme
  </smart-button>
</view>
<smart-config-provider theme="{{ currentTheme }}">
  <smart-cell-group>
    <smart-cell title="Title" value="Content" />
    <smart-cell title="Title" value="Content" label="Details" is-link />
  </smart-cell-group>
</smart-config-provider>
```

```js
Page({
  data: {
    currentTheme: 'light',
  },

  onThemeChange(event) {
    const { theme } = event.currentTarget.dataset;
    this.setData({
      currentTheme: theme,
    });
  },
});
```

## API

### Props

| Parameter   | Description         | Type          | Default Value |
| ----------- | ------------------- | ------------- | ------------- |
| theme-vars  | Custom theme variables | _object_     | -             |
| theme `v2.7.4` | Theme mode         | _'light'\/'dark'_ | -             |