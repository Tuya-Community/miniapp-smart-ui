---
category: Navigation
---

# IndexBar

### Introduction

Used for index classification display and quick positioning in lists.

### Import

Introduce the component in `app.json` or `index.json`. For details, see [Quickstart](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-index-bar": "@tuya-miniapp/smart-ui/lib/index-bar/index",
  "smart-index-anchor": "@tuya-miniapp/smart-ui/lib/index-anchor/index"
}
```

```warning:⚠️Note
The component listens for the scroll event of the entire page to create a dynamic fixed header element, so the page rendering this component must be configured to allow scrolling.

index.config.ts:

export default {
  navigationBarTitleText: 'Home',
  disableScroll: false,
};
```

## Code Demonstration

### Basic Usage

Clicking the index bar will automatically jump to the corresponding `IndexAnchor` anchor point.

```html
<smart-index-bar>
  <view
    wx:for="{{ indexList }}"
    wx:for-item="item"
    wx:key="item"
  >
    <smart-index-anchor index="{{ item }}" />
    <smart-cell title="Text" />
    <smart-cell title="Text" />
    <smart-cell title="Text" />
  </view>
</smart-index-bar>
```

```javascript
const indexList = [];
const charCodeOfA = 'A'.charCodeAt(0);

for (let i = 0; i < 26; i++) {
  indexList.push(String.fromCharCode(charCodeOfA + i));
}

Page({
  data: {
    indexList, // A-Z alphabet list
  },
});
```

### Custom Index List

You can customize the list of index characters displayed through the `index-list` property.

```html
<smart-index-bar index-list="{{ customIndexList }}">
  <view
    wx:for="{{ customIndexList }}"
    wx:key="index"
  >
    <smart-index-anchor
      use-slot
      index="{{ item }}"
    >
      <text>Title {{ item }}</text>
    </smart-index-anchor>
    <smart-cell title="Text" />
    <smart-cell title="Text" />
    <smart-cell title="Text" />
  </view>
</smart-index-bar>
```

```javascript
Page({
  data: {
    customIndexList: [1, 2, 3, 4, 5, 6, 8, 9, 10],
  },
});
```

## API

### IndexBar Props

| Parameter         | Description                | Type                   | Default   | 
| ----------------- | -------------------------- | ---------------------- | --------- |
| highlight-color   | Index character highlight color | _string_               | `#07c160` |
| index-list        | List of index characters   | _string[] \| number[]_ | `A-Z`     |
| sticky            | Whether to enable anchor auto-sticky | _boolean_              | `true`    |
| sticky-offset-top | Distance from top when anchor auto-sticky | _number_               | `0`       |
| z-index           | z-index level              | _number_               | `1`       |
| scrollable `v2.1.7` | Whether the SideBar can scroll | _boolean_ | `false` |

### IndexAnchor Props

| Parameter | Description             | Type               | Default |
| --------- | ----------------------- | ------------------ | ------- | 
| index     | Index character         | _string \| number_ | -       | 
| use-slot  | Whether to use custom content slot | _boolean_          | `false` | 

### IndexBar Events

| Event Name | Description          | Callback Parameters |
| ---------- | -------------------- | ------------------- |
| select     | Fires when a character is selected | index: Index character |

### IndexAnchor Slots

| Name | Description                        |
| ---- | ---------------------------------- |
| -    | Anchor position display content, defaults to index character |


### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                           | Description       |
| ----------------------------- | ---------------------------------------- | ----------------- |
| --index-bar-index-font-size   | _10px_                                   | Index font size   |
| --index-bar-index-line-height | _14px_                                   | Index line height |


## FAQ

### IndexAnchor is ineffective when nested in scrolling elements?

As `<IndexBar />` uses ty.pageScrollTo internally to scroll to the specified position, it only supports page-level scrolling and cannot be nested in scrolling elements, such as when `view` uses `overflow: scroll;` or `scroll-view`. For details, see [WeChat Mini Program Documentation](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ty.pageScrollTo.html).
