# Built-in Styles

### Introduction

Smart UI includes some common styles by default, which can be used directly through className.

### Import

Import built-in styles in app.wxss.

```css
@import '@tuya-miniapp/smart-ui/common/index.wxss';
```

## Code Examples

### Text Ellipsis

Automatically ellipsis text when its length exceeds the container's maximum width.

```xml
<view class="smart-ellipsis">
  This is a text with a width limit of 250px, and the following content will be ellipsed.
</view>

<!-- Displays up to two lines -->
<view class="smart-multi-ellipsis--l2">
  This is a text that displays up to two lines, and the following content will be ellipsed.
</view>

<!-- Displays up to three lines -->
<view class="smart-multi-ellipsis--l3">
  This is a text that displays up to three lines, and the following content will be ellipsed.
</view>
```

### 1px Border

Add a 1px border (hairline) for elements on Retina screens, achieved using pseudo-class transform.

```xml
<!-- Top border -->
<view class="smart-hairline--top"></view>

<!-- Bottom border -->
<view class="smart-hairline--bottom"></view>

<!-- Left border -->
<view class="smart-hairline--left"></view>

<!-- Right border -->
<view class="smart-hairline--right"></view>

<!-- Top and bottom borders -->
<view class="smart-hairline--top-bottom"></view>

<!-- Surrounding border -->
<view class="smart-hairline--surround"></view>
```

### Global Fonts

It's recommended to set the following global fonts in app.wxss to ensure the best visual experience across different devices.

```css
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
}
