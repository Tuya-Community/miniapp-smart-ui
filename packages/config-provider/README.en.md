---
category: General
---

# ConfigProvider

### Introduction

Used to configure the theme styles of Smart UI components.

### Import

Import the component in `app.json` or `index.json`. For details, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-config-provider": "@tuya-miniapp/smart-ui/lib/config-provider/index"
}
```

## Customize Theme

### Introduction

Smart UI components organize styles through a wealth of [CSS variables](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties). By overriding these CSS variables, you can achieve effects like **custom themes and dynamic theme switching**.

#### Example

Take the Button component as an example. Looking at the component's style, you can see the following variables on the `.smart-button--primary` class name:

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

#### Override via CSS

You can directly override these CSS variables in your code, and the style of the Button component will change accordingly:

```css
/* After adding this style, the Primary Button will turn red */
page {
  --button-primary-background-color: red;
}
```

#### Override via ConfigProvider

The `ConfigProvider` component offers the ability to override CSS variables. You need to wrap a `ConfigProvider` component around the root node and use the `theme-vars` attribute to configure some theme variables. The parameters for `theme-vars` are the component's CSS variables converted into camelCase form.

```html
<smart-config-provider theme-vars="{{ themeVars }}">
  <smart-cell-group>
    <smart-field label="Rating">
      <view slot="input" style="width: 100%">
        <smart-rate
          model:value="{{ rate }}"
          data-key="rate"
          bind:change="onChange"
        />
      </view>
    </smart-field>
    <smart-field label="Slider" border="{{ false }}">
      <view slot="input" style="width: 100%">
        <smart-slider
          value="{{ slider }}"
          data-key="slider"
          bind:change="onChange"
        />
      </view>
    </smart-field>
  </smart-cell-group>

  <view style="margin: 16px">
    <smart-button round block type="primary">Submit</smart-button>
  </view>
</smart-config-provider>
```

```js
import Page from '../../common/page';

Page({
  data: {
    rate: 4,
    slider: 50,
    themeVars: {
      rateIconFullColor: '#07c160',
      sliderBarHeight: '4px',
      sliderButtonWidth: '20px',
      sliderButtonHeight: '20px',
      sliderActiveBackgroundColor: '#07c160',
      buttonPrimaryBorderColor: '#07c160',
      buttonPrimaryBackgroundColor: '#07c160',
    },
  },

  onChange(event) {
    const { key } = event.currentTarget.dataset;
    this.setData({
      [key]: event.detail,
    });
  },
});
```

## API

### Props

| Parameter  | Description    | Type     | Default |
| ---------- | -------------- | -------- | ------- |
| theme-vars | Custom theme variables | _object_ | -      |
