---
category: Layout
---

# DropdownMenu Dropdown Menu

### Introduction

A menu list that pops down.

### Import

Introduce components in `app.json` or `index.json`. The default is the `ES6` version. For `ES5` import methods, see [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-dropdown-menu": "@tuya-miniapp/smart-ui/lib/dropdown-menu/index",
  "smart-dropdown-item": "@tuya-miniapp/smart-ui/lib/dropdown-item/index"
}
```

## Code Demonstration

### Basic Usage

```html
<smart-dropdown-menu>
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <smart-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</smart-dropdown-menu>
```

```js
Page({
  data: {
    option1: [
      { text: 'All Products', value: 0 },
      { text: 'New Products', value: 1 },
      { text: 'Promotional Products', value: 2 },
    ],
    option2: [
      { text: 'Default Sorting', value: 'a' },
      { text: 'Rating Sorting', value: 'b' },
      { text: 'Sales Sorting', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
  },
});
```

### Custom Menu Content

```html
<smart-dropdown-menu>
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <smart-dropdown-item id="item" title="{{ itemTitle }}">
    <smart-cell title="{{ switchTitle1 }}" title-style="{{ switch1 ? 'color: #3678E3;' : '' }}">
      <smart-switch
        slot="right-icon"
        size="24px"
        style="height: 26px"
        checked="{{ switch1 }}"
        active-color="#3678E3"
        bind:change="onSwitch1Change"
      />
    </smart-cell>
    <smart-cell title="{{ switchTitle2 }}" title-style="{{ switch2 ? 'color: #3678E3;' : '' }}">
      <smart-switch
        slot="right-icon"
        size="24px"
        style="height: 26px"
        checked="{{ switch2 }}"
        active-color="#3678E3"
        bind:change="onSwitch2Change"
      />
    </smart-cell>
    <view style="padding: 5px 16px;">
      <smart-button type="danger" block round bind:click="onConfirm">
        Confirm
      </smart-button>
    </view>
  </smart-dropdown-item>
</smart-dropdown-menu>
```

```js
Page({
  data: {
    switchTitle1: 'Free Shipping',
    switchTitle2: 'Group Purchase',
    itemTitle: 'Filter',
    option1: [
      { text: 'All Products', value: 0 },
      { text: 'New Products', value: 1 },
      { text: 'Promotional Products', value: 2 },
    ],
    value1: 0,
  },

  onConfirm() {
    this.selectComponent('#item').toggle();
  },

  onSwitch1Change({ detail }) {
    this.setData({ switch1: detail });
  },

  onSwitch2Change({ detail }) {
    this.setData({ switch2: detail });
  },
});
```

### Custom Selected State Color

```html
<smart-dropdown-menu active-color="#1989fa">
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <smart-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</smart-dropdown-menu>
```

### Expand Upwards

```html
<smart-dropdown-menu direction="up">
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <smart-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</smart-dropdown-menu>
```

### Disable Menu

```html
<smart-dropdown-menu>
  <smart-dropdown-item value="{{ value1 }}" disabled options="{{ option1 }}" />
  <smart-dropdown-item value="{{ value2 }}" disabled options="{{ option2 }}" />
</smart-dropdown-menu>
```

### Asynchronous Open/Close

The `before-toggle` event allows you to execute specific logic before the dropdown menu opens or closes, achieving pre-state-change validation and the purpose of asynchronous opening/closing.
`scroll-style` `v2.5.0` When the popup requires scrolling, you can set this attribute and provide a height.

```html
<smart-dropdown-menu>
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" use-before-toggle bind:before-toggle="onBeforeChange" />
</smart-dropdown-menu>
```

```js
Page({
  data: {
    value1: 0,
    option1: [
      { text: 'All Products', value: 0 },
      { text: 'New Products', value: 1 },
      { text: 'Promotional Products', value: 2 },
    ],
  },
  onBeforeChange({ detail: { status, callback }}) {
    ty.showModal({
      title: 'Asynchronous Open/Close',
      content: `Are you sure you want to ${status ? 'open' : 'close'} the dropdown menu?`,
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

## API

### DropdownMenu Props

| Parameter              | Description                                         | Type      | Default  |
| ---------------------- | --------------------------------------------------- | --------- | -------- |
| active-color           | The selected state color of the menu title and options | _string_  | `#3678E3` |
| triangle-color `v2.0.0`  | The color of the arrow when unselected           | _string_  | `#CCCCCC` |
| close-on-click-outside | Whether to close the menu when clicking outside   | _boolean_ | `true`    |
| close-on-click-overlay | Whether to close the menu when clicking on the overlay | _boolean_ | `true`    |
| direction              | The direction the menu expands, optional value is up | _string_  | `down`    |
| duration               | The duration of the animation, in milliseconds     | _number_  | `200`     |
| overlay                | Whether to show the overlay                         | _boolean_ | `true`    |
| safe-area-tab-bar      | Whether to leave safe distance for the bottom tabbar | _boolean_ | `false`   |
| z-index                | The z-index level of the menu bar                  | _number_  | `10`      |

### DropdownItem Props

| Parameter          | Description                                             | Type               | Default          |
| ----------------- | ------------------------------------------------------- | ------------------ | ---------------- |
| disabled          | Whether to disable the menu                             | _boolean_          | `false`          |
| options           | Array of options                                        | _Option[]_         | `[]`             |
| popup-style       | Custom popup layer style                                | _string_           | -                |
| title             | The title of the menu item                              | _string_           | Selected item text |
| title-class       | Extra class name for the title, it is recommended to use custom style item-title-class instead | _string_           | -                |
| use-before-toggle | Whether to enable pre-verification before opening or closing the dropdown menu | _boolean_          | `false`          |
| value             | The value corresponding to the selected item            | _number \| string_ | -                |
| scroll-style `v2.5.0`        | When the dropdown menu needs to be scrolled, this attribute sets the style of the scrolling area, such as its height.    | _string_ | -       |

### DropdownItem Events

| Event Name     | Description                                                                  | Callback Parameters                                                                                                                             |
| ------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| before-toggle | Triggered before opening or closing the dropdown menu; you need to set the `use-before-toggle` property to `true` | `event.detail.status`: `true` for opening the dropdown menu, `false` for closing it <br> `event.detail.callback`: Callback function, calling `callback(false)` will terminate the status change of the dropdown menu |
| change        | Triggered when clicking an option causes a value change                     | value                                                                                                                               |
| close         | Triggered when the menu is closed                                             | -                                                                                                                                   |
| closed        | Triggered after the menu is closed and the animation ends                     | -                                                                                                                                   |
| open          | Triggered when the menu is opened                                             | -                                                                                                                                   |
| opened        | Triggered after the menu is opened and the animation ends                     | -                                                                                                                                   |

### DropdownItem Methods

Accessible via [selectComponent](/material/smartui?comId=faq&appType=miniapp)

| Method Name | Description                           | Parameters     | Return Value |
| ----------- | ------------------------------------- | -------------- | ------------ |
| toggle      | Toggle menu display state; pass `true` to show, `false` to hide, no parameter to invert | show?: boolean | -            |

### Option Data Structure

| Key   | Description                             | Type               |
| ----- | --------------------------------------- | ------------------ |
| icon  | Left [icon svg value](/material/smartui?comId=icon&appType=miniapp) or image link  | _string_           |
| text  | Text                                    | _string_           |
| value | Identifier                              | _number \| string_ |

### DropdownMenu External Style Classes

| Class Name    | Description      |
| ------------- | ---------------- |
| custom-class  | Root node style class  |
| title-class   | Selected item style class  |

### DropdownItem External Style Classes

| Class Name      | Description       |
| --------------- | ----------------- |
| custom-class    | Root node style class  |
| item-title-class| Option style class  |

### Style Variables

The component offers the following CSS variables for customization. Refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp) for usage.

| Name                                | Default                                | Description    |
| ----------------------------------- | -------------------------------------- | -------------- |
| --dropdown-menu-height              | _46px_                           | Height of the menu    |
| --dropdown-menu-background-color    | _var(--app-B3, #ffffff)_                         | Background color of the menu    |
| --dropdown-menu-title-font-size     | _14px_    | Font size of the title    |
| --dropdown-menu-title-line-height   | _18px_    | Font height of the title    |
| --dropdown-menu-title-text-color    | _var(--app-B6-N1, rgba(0, 0, 0, 1))_    | Title text color    |
| --dropdown-menu-title-active-text-color | _var(--app-M1, #3678e3)_    | Title active color    |
| --dropdown-menu-title-disabled-text-color | _var(--app-B6-N4, rgba(0, 0, 0, 0.4))_    | Title disabled color    |
| --dropdown-menu-title-padding       | _0 24px 0 8px_    | Padding of the menu    |
| --dropdown-menu-title-triangle-size `v2.0.0` | _12px_    | Triangle icon font size    |
| --dropdown-menu-title-triangle-margin-left `v2.0.0` | _4px_    | Left margin for the triangle icon    |
| --dropdown-menu-item-title-font-size `v2.0.0` | _14px_    | Font size of dropdown item    |
| --dropdown-menu-item-title-font-weight `v2.0.0` | _normal_  | Font weight of dropdown item    |
| --dropdown-menu-option-active-color | _var(--app-M1, #3678e3)_  |  Active color of dropdown option  |
| --dropdown-menu-item-title-line-height `v2.0.0` | _rgba(0,0,0,.05)_    | Color of the dropdown item separator    |
| --dropdown-menu-item-first-line-color `v2.0.0` | _rgba(0,0,0,.08)_    | Color of the first separator line in the dropdown    |
| --dropdown-menu-item-line-width `v2.0.0`    | _1px_    | Height of the first separator line in the dropdown    |
| --dropdown-menu-item-icon-font-size `v2.0.0` | _28px_    | Font size of the right icon in dropdown    |
| --dropdown-menu-item-title-active-font-weight `v2.0.0` | _500_    | Font weight of active dropdown item    |

## FAQ

### Why does the Dropdown component have positioning issues when used inside a Popup?

The Dropdown is located within a Popup node, and the Popup's position is set to center. The center style includes `top: 50%` and `transform: translate3d(-50%, -50%, 0)`, which causes the node's position calculation to be offset, affecting the Dropdown's positioning. The solution is to set the Popup's position to bottom or top.
