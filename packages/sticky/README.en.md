---
category: Layout
---

# Sticky

### Introduction

The Sticky component works the same way as the `position: sticky` attribute in CSS. When the component is within the screen range, it arranges according to the normal layout. When the component scrolls out of the screen range, it will always be fixed at the top of the screen.

### Import

Import the component in `app.json` or `index.json`. For detailed introduction, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-sticky": "@tuya-miniapp/smart-ui/lib/sticky/index"
}
```

## Code Examples

### Basic Usage

Wrap the content within the `Sticky` component.

```html
<smart-sticky>
  <smart-button type="primary">Basic Usage</smart-button>
</smart-sticky>
```

### Offset Distance

You can set the distance between the component and the top when it is sticky using the `offset-top` attribute.

```html
<smart-sticky offset-top="{{ 50 }}">
  <smart-button type="info">Offset Distance</smart-button>
</smart-sticky>
```

### Specify Container

You can specify the container of the component using the `container` attribute. When the page scrolls, the component will always stay within the container range. When it is about to exceed the bottom of the container, it will return to its original position.

```html
<view id="container" style="height: 150px;">
  <smart-sticky container="{{ container }}">
    <smart-button type="warning">Specify Container</smart-button>
  </smart-sticky>
</view>
```

```js
Page({
  data: {
    container: null,
  },

  onReady() {
    this.setData({
      container: () => wx.createSelectorQuery().select('#container'),
    });
  },
});
```

### Nested in scroll-view

You can achieve nested usage within a scroll-view using the `scroll-top` and `offset-top` attributes.

```html
<scroll-view
  bind:scroll="onScroll"
  scroll-y
  id="scroller"
  style="height: 200px;"
>
  <view style="height: 400px; padding-top: 50px;">
    <smart-sticky scroll-top="{{ scrollTop }}" offset-top="{{ offsetTop }}">
      <smart-button type="warning">Nested in scroll-view</smart-button>
    </smart-sticky>
  </view>
</scroll-view>
```

```js
Page({
  data: {
    scrollTop: 0,
    offsetTop: 0,
  },

  onScroll(event) {
    wx.createSelectorQuery()
      .select('#scroller')
      .boundingClientRect((res) => {
        this.setData({
          scrollTop: event.detail.scrollTop,
          offsetTop: res.top,
        });
      })
      .exec();
  },
});
```

## API

### Props

| Parameter   | Description                                                 | Type       | Default Value |
| ----------- | ----------------------------------------------------------- | ---------- | ------------- |
| container   | A function that returns the container's corresponding NodesRef node | _function_ | -             |
| offset-top  | The distance from the top when sticky, in `px`              | _number_   | `0`           |
| scroll-top  | Current scroll position of the scroll area. When not `null`, it disables the page's scroll event listener | _number_   | -             |
| z-index     | z-index when sticky                                         | _number_   | `99`          |

### Events

| Event Name   | Description  | Callback Parameters                                      |
| ------------ | ------------ | -------------------------------------------------------- |
| bind:scroll  | Triggered when scrolling | { scrollTop: Distance from the top position, isFixed: Whether sticky } |