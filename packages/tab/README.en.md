---
category: Layout
---

# Tab Component

### Introduction

The tab component is used for switching between different content areas.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-tab": "@tuya-miniapp/smart-ui/lib/tab/index",
  "smart-tabs": "@tuya-miniapp/smart-ui/lib/tabs/index"
}
```

## Code Demonstrations

### Basic Usage

Set the index value of the currently active tab using `active`. By default, the first tab is enabled.

```html
<smart-tabs active="{{ active }}" bind:change="onChange">
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2">Content 2</smart-tab>
  <smart-tab title="Tab 3">Content 3</smart-tab>
  <smart-tab title="Tab 4">Content 4</smart-tab>
</smart-tabs>
```

```js
Page({
  data: {
    active: 1,
  },

  onChange(event) {
    wx.showToast({
      title: `Switched to tab ${event.detail.name}`,
      icon: 'none',
    });
  },
});
```

### Matching by Name

When the `name` attribute is specified for a tab, the value of `active` corresponds to the `name` of the current tab (in this case, it cannot be matched by index).

```html
<smart-tabs active="a">
  <smart-tab title="Tab 1" name="a">Content 1</smart-tab>
  <smart-tab title="Tab 2" name="b">Content 2</smart-tab>
  <smart-tab title="Tab 3" name="c">Content 3</smart-tab>
</smart-tabs>
```

### Horizontal Scrolling

Tabs can scroll horizontally when there are more than 5 tabs.

```html
<smart-tabs active="{{ active }}">
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2">Content 2</smart-tab>
  <smart-tab title="Tab 3">Content 3</smart-tab>
  <smart-tab title="Tab 4">Content 4</smart-tab>
  <smart-tab title="Tab 5">Content 5</smart-tab>
  <smart-tab title="Tab 6">Content 6</smart-tab>
</smart-tabs>
```

### Disabled Tabs

Set the `disabled` attribute to disable a tab. If you need to listen for click events on disabled tabs, you can listen to the `disabled` event on `smart-tabs`.

```html
<smart-tabs bind:disabled="onClickDisabled">
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2" disabled>Content 2</smart-tab>
  <smart-tab title="Tab 3">Content 3</smart-tab>
</smart-tabs>
```

```javascript
Page({
  onClickDisabled(event) {
    wx.showToast({
      title: `Tab ${event.detail.name} is disabled`,
      icon: 'none',
    });
  },
});
```

### Style Variations

`Tab` supports two style variations: `line` and `card`. The default is the `line` style, which can be changed using the `type` attribute.

```html
<smart-tabs type="card">
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2">Content 2</smart-tab>
  <smart-tab title="Tab 3">Content 3</smart-tab>
</smart-tabs>
```

### Click Events

You can bind the `click` event on `smart-tabs` to get the title and identifier of the clicked tab from `event.detail` in the callback parameters.

```html
<smart-tabs bind:click="onClick">
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2">Content 2</smart-tab>
</smart-tabs>
```

```javascript
Page({
  onClick(event) {
    wx.showToast({
      title: `Clicked tab ${event.detail.name}`,
      icon: 'none',
    });
  },
});
```

### Sticky Layout

You can enable a sticky layout through the `sticky` attribute. In a sticky layout, the tab will automatically stick to the top when it is scrolled to the top.

```html
<smart-tabs sticky>
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2">Content 2</smart-tab>
  <smart-tab title="Tab 3">Content 3</smart-tab>
  <smart-tab title="Tab 4">Content 4</smart-tab>
</smart-tabs>
```

### Switching Animation

You can enable or disable the animation when switching tabs using `animated`.

```html
<smart-tabs animated>
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2">Content 2</smart-tab>
  <smart-tab title="Tab 3">Content 3</smart-tab>
  <smart-tab title="Tab 4">Content 4</smart-tab>
</smart-tabs>
```

### Swipe Switch

Enable swipe switching of tabs using the `swipeable` attribute.

```html
<smart-tabs swipeable>
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2">Content 2</smart-tab>
  <smart-tab title="Tab 3">Content 3</smart-tab>
  <smart-tab title="Tab 4">Content 4</smart-tab>
</smart-tabs>
```

### Nested Popup

When smart-tabs are nested inside components or nodes that hide content like smart-popup, the underline will not display properly when smart-tabs is shown.

You can manually control the rendering of smart-tabs using `ty:if` to avoid this scenario.

```html
<smart-popup show="{{ show }}">
  <smart-tabs ty:if="{{ show }}">
    <smart-tab title="Tab 1">Content 1</smart-tab>
    <smart-tab title="Tab 2">Content 2</smart-tab>
    <smart-tab title="Tab 3">Content 3</smart-tab>
    <smart-tab title="Tab 4">Content 4</smart-tab>
  </smart-tabs>
</smart-popup>
```

### Asynchronous Switch

Through the `before-change` event, specific logic can be executed before switching tabs to verify before switching or achieve asynchronous switching.

```html
<smart-tabs active="{{ active }}" use-before-change="{{ true }}" bind:change="onChange" bind:before-change="onBeforeChange" >
  <smart-tab title="Tab 1">Content 1</smart-tab>
  <smart-tab title="Tab 2">Content 2</smart-tab>
  <smart-tab title="Tab 3">Content 3</smart-tab>
  <smart-tab title="Tab 4">Content 4</smart-tab>
</smart-tabs>
```

```js
Page({
  data: {
    active: 1,
  },

  onChange(event) {
    wx.showToast({
      title: `Switched to tab ${event.detail.name}`,
      icon: 'none',
    });
  },
  onBeforeChange(event) {
    const { callback, title } = event.detail;
    
    wx.showModal({
      title: 'Asynchronous Switch',
      content: `Are you sure you want to switch to the ${title} tab?`,
      success: (res) => {
        if (res.confirm) {
          callback(true)
        } else if (res.cancel) {
          callback(false)
        }
      },
    })
  }
});
```
### Subtitle

You can set a secondary title using `subtitle`

```html
<smart-tabs active="{{ 1 }}" bind:change="onChange" swipe-threshold="7" title-active-color="#1989FA">
  <smart-tab
    wx:for="{{ tabsRenders }}"
    wx:key="name"
    title="{{ item.name }}"
    subtitle="{{ item.content }}"
    subtitle-style="color: black;"
  >
  </smart-tab>
</smart-tabs>
```

```js
Page({
  data: {
    active: 1,
    tabsRenders: [
      { name: 'Monday', content: '12' },
      { name: 'Tuesday', content: '13' },
      { name: 'Wednesday', content: '14' },
      { name: 'Thursday', content: '15' },
      { name: 'Friday', content: '16' },
      { name: 'Saturday', content: '17' },
      { name: 'Sunday', content: '18' },
    ],
  },

  onChange(event) {
    wx.showToast({
      title: `Switched to tab ${event.detail.name}`,
      icon: 'none',
    });
  }
});
```

## API

### Tabs Props

| Parameter                   | Description                                                                                      | Type               | Default  |
| --------------------------- | ------------------------------------------------------------------------------------------------ | ------------------ | -------- |
| active                      | Identifier of the currently selected tab                                                         | _string \| number_ | `0`      |
| animated                    | Whether to enable the transition animation when switching tab content                            | _boolean_          | `false`  |
| border                      | Whether to show border, only effective in `line` style                                           | _boolean_          | `false`  |
| color                       | Label theme color, only available in non `card` mode color                                    | _string_           | `#ee0a24` |
| duration                    | Animation duration in seconds                                                                    | _number_           | `0.3`    |
| ellipsis                    | Whether to truncate long title text                                                              | _boolean_          | `true`   |
| lazy-render                 | Whether to enable lazy rendering of tab page content (not destroy)                                | _boolean_          | `true`   |
| inactive-destroy `v2.1.0`   | Whether to destroy the tab slot content when the tab is not selected                           | _boolean_          | `false`  |
| line-height                 | Height of the bottom bar, default unit `px`                                                      | _string \| number_ | `3px`    |
| line-width                  | Width of the bottom bar, default unit `px`                                                       | _string \| number_ | `40px`   |
| offset-top                  | Minimum distance from the top in sticky positioning layout, unit `px`                            | _number_           | -        |
| sticky                      | Whether to use sticky positioning layout                                                         | _boolean_          | `false`  |
| swipe-threshold             | Scroll threshold, tab starts scrolling horizontally when the number of tabs exceeds the threshold | _number_           | `5`      |
| swipeable                   | Whether to enable gesture swipe switching                                                        | _boolean_          | `false`  |
| title-active-color          | Color of selected title                                                                          | _string_           | -        |
| title-inactive-color        | Color of default title                                                                           | _string_           | -        |
| type                        | Style type, optional value is `card`                                                             | _string_           | `line`   |
| use-before-change `v1.10.10`| Whether to enable pre-switch verification                                                         | _boolean_          | `false`  |
| z-index                     | z-index level                                                                                    | _number_           | `1`      |

### Tab Props

| Parameter     | Description                 | Type               | Default     |
| ------------- | --------------------------- | ------------------ | ----------- |
| disabled      | Whether to disable the tab  | _boolean_          | `false`     |
| dot           | Whether to show a small dot | _boolean_          | -           |
| info          | Message prompt at icon corner | _string \| number_ | -           |
| name          | Tab name, as a matching identifier | _string \| number_ | Tab index value |
| title         | Title                       | _string_           | -           |
| title-style   | Custom title style          | _string_           | -           |
| subtitle `v2.3.5`       | Secondary Title                       | _string_           | -            |
| subtitle-style `v2.3.5` | Custom secondary heading style             | _string_           | -            |

### Tabs Slot

| Name      | Description     |
| --------- | --------------- |
| nav-left  | Content on the left side of the title |
| nav-right | Content on the right side of the title |

### Tab Slot

| Name | Description |
| ---- | ----------- |
| -    | Tab content |

### Tabs Event

| Event Name                  | Description                                                                                                | Parameters                                                                                                                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bind:before-change `v1.10.10` | Triggered before tab switching, returning `false` in the callback can stop tab switching, and the `use-before-change` attribute should be set to `true` | `event.detail.name`: The identifier of the currently switching tab, `event.detail.title`: The title of the currently switching tab, `event.detail.index`: The index of the currently switching tab, `event.detail.callback`: Callback function, call `callback(false)` to stop tab switching |
| bind:change                 | Triggered when the active tab changes                                                                      | name: Tab identifier, title: Title                                                                                                                                                                       |
| bind:click                  | Triggered when a tab is clicked                                                                            | name: Tab identifier, title: Title                                                                                                                                                                       |
| bind:disabled               | Triggered when a disabled tab is clicked                                                                   | name: Tab identifier, title: Title                                                                                                                                                                       |
| bind:scroll                 | Triggered during scrolling                                                                                 | { scrollTop: Distance from the top, isFixed: Whether it is fixed to the top }                                                                                                                            |

### External Style Classes

| Class Name        | Description         |
| ----------------- | ------------------- |
| custom-class      | Root node style class |
| nav-class         | Tab bar style class |
| tab-active-class  | Active tab style class |
| tab-class         | Tab style class     |
| wrap-class        | Tab bar root node style class |


### Style Variables

The component provides the following CSS variables for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name | Default Value | Description |
| --- | --- | ----------- |
| --tabs-background-color | _var(--app-B3, #fff)_ | Background color    |
| --tabs-default-color | _var(--app-M4)_ | Default text color    |
| --tabs-line-height | _32px_ | Default text line height    |
| --tabs-sub-line-height `2.3.5` | _64px_ | Default sub text line height    |
| --tabs-bottom-bar-height  | _3px_ | Bottom slider height    |
| --tabs-bottom-bar-color | _var(--tabs-default-color)_ | Bottom slider background color    |
| --tabs-card-text-color | _var(--app-B6-N3)_ | Card mode text color    |
| --tabs-card-text-active-color | _var(--app-B6-N1)_ | Card mode active text color    |
| --tabs-card-height | _32px_ | Card mode slider height    |
| --tabs-card-border-radius | _8px_ | Card mode radius    |
| --tabs-card-active-border-radius `v2.0.0` | _6px_ | Card mode slider radius    |
| --tabs-card-active-background-color | _var(--app-B3, #fff)_ | Card mode slider background color  |
| --tabs-card-active-top `v2.0.0`  | _0_    | Card mode slider top positioning    |
| --tabs-card-active-left `v2.0.0`  | _0_    | Card mode slider left positioning    |
| --tabs-card-padding `v2.0.0`  | _2px_    | Card mode padding   |
| --tab-panel-background-color `v2.0.0`  | _var(--app-B3)_    | Panel background color   |
| --tab-panel-text-color `v2.0.0`  | _var(--app-B3-N1)_    | Panel text color   |
| --tabs-card-background-color `v2.1.0`  | _var(--app-B6-N9, rgba(0, 0, 0, 0.05))_    | Card mode background color   |

### Methods

You can get the Tabs instance through selectComponent and call instance methods.

| Method Name | Parameter | Return Value | Description                                                        |
| ----------- | --------- | ------------ | ------------------------------------------------------------------ |
| resize      | -         | -            | When the size or display state of the outer element changes, you can call this method to trigger a redraw |

## FAQ

### Why is the position of the bottom bar incorrect when the component switches from a hidden state to a visible state?

The Tabs component acquires its width at mount time and calculates the position of the bottom bar accordingly. If the component is initially hidden, the width will always be 0, so the bottom bar position cannot be displayed.

#### Solution

Method 1: Use `ty:if` to control the component display, allowing the component to reinitialize.

```html
<smart-tabs ty:if="show" />
```

Method 2: Call the resize method of the component to actively trigger a redraw.

```html
<smart-tabs id="tabs" />
```

```js
this.selectComponent('#tabs').resize();
```