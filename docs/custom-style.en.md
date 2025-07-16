---
category: Guide
---

# Style Overrides

### Introduction

Smart UI, based on the smart mini program mechanism, provides developers with the following 3 methods to modify component styles

### Removing Style Isolation

For background knowledge on style isolation, please refer to the [Smart Mini Program Documentation](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/custom-component/tyml-tyss#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB)

<br />

All components in Smart UI have `addGlobalClass: true` enabled to accept the influence of external styles. You can use the following 2 methods to override component styles

> When using Smart UI components on a page, you can directly override styles in the page's style file

```html
<smart-button type="primary">Primary Button</smart-button>
```

```css
/* page.tyss */
.smart-button--primary {
  font-size: 20px;
  background-color: pink;
}
```

> When using Smart UI components in a custom component, you need to enable the `styleIsolation: 'shared'` option

```html
<smart-button type="primary">Primary Button</smart-button>
```

```js
Component({
  options: {
    styleIsolation: 'shared',
  },
});
```

```css
.smart-button--primary {
  font-size: 20px;
  background-color: pink;
}
```

### Using External Style Classes

For background knowledge on external style classes, please refer to the [Smart Mini Program Documentation](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/custom-component/tyml-tyss#%E5%A4%96%E9%83%A8%E6%A0%B7%E5%BC%8F%E7%B1%BB)

<br />

Smart UI has opened up a large number of external style classes for developers to use. The specific style class names can be found in the "External Style Classes" section of the corresponding component.

It is important to note that the priority of ordinary style classes and external style classes is undefined, so please add `!important` when using them to ensure the priority of external style classes.

```html
<smart-cell
  title="Cell"
  value="Content"
  title-class="cell-title"
  value-class="cell-value"
/>
```

```css
.cell-title {
  color: pink !important;
  font-size: 20px !important;
}

.cell-value {
  color: green !important;
  font-size: 12px !important;
}
```

### Using CSS Variables

Smart UI has opened up customization schemes based on CSS properties for some CSS attributes.

Compared to removing style isolation and using external style classes, this scheme supports batch modification of the styles of multiple components at the page or application level to customize theme styles.

Of course, it is also more than sufficient to use it to modify some styles of a single component. For specific usage methods, please refer to [Custom Themes](#/theme)