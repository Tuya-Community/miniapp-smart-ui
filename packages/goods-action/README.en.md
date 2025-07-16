# GoodsAction Product Navigation

### Introduction

Used to provide convenient interactions for product-related operations.

### Import

Introduce the component in `app.json` or `index.json`. For detailed instructions, refer to [Quick Start](/material/smartui?comId=help-getting-started&appType=miniapp).

```json
"usingComponents": {
  "smart-goodsmart-action": "@tuya-miniapp/smart-ui/lib/goodsmart-action/index",
  "smart-goodsmart-action-icon": "@tuya-miniapp/smart-ui/lib/goodsmart-action-icon/index",
  "smart-goodsmart-action-button": "@tuya-miniapp/smart-ui/lib/goodsmart-action-button/index"
}
```

## Code Examples

### Basic Usage

```html
<smart-goodsmart-action>
  <smart-goodsmart-action-icon icon="chat-o" text="Customer Service" bind:click="onClickIcon" />
  <smart-goodsmart-action-icon icon="cart-o" text="Cart" bind:click="onClickIcon" />
  <smart-goodsmart-action-button
    text="Add to Cart"
    type="warning"
    bind:click="onClickButton"
  />
  <smart-goodsmart-action-button text="Buy Now" bind:click="onClickButton" />
</smart-goodsmart-action>
```

```javascript
Page({
  onClickIcon() {
    Toast('Icon Clicked');
  },

  onClickButton() {
    Toast('Button Clicked');
  },
});
```

### Notification Information

When the `dot` property is set, a small red dot will be displayed on the upper right corner of the icon. When the `info` property is set, the corresponding badge will be shown on the upper right corner of the icon.

```html
<smart-goodsmart-action>
  <smart-goodsmart-action-icon icon="chat-o" text="Customer Service" dot />
  <smart-goodsmart-action-icon icon="cart-o" text="Cart" info="5" />
  <smart-goodsmart-action-icon icon="shop-o" text="Shop" />
  <smart-goodsmart-action-button text="Add to Cart" type="warning" />
  <smart-goodsmart-action-button text="Buy Now" />
</smart-goodsmart-action>
```

### Custom Button Colors

You can customize the button colors using the `color` property. `linear-gradient` gradients are also supported.

```html
<smart-goodsmart-action>
  <smart-goodsmart-action-icon icon="chat-o" text="Customer Service" />
  <smart-goodsmart-action-icon icon="cart-o" text="Cart" info="5" />
  <smart-goodsmart-action-icon icon="shop-o" text="Shop" />
  <smart-goodsmart-action-button color="#be99ff" text="Add to Cart" type="warning" />
  <smart-goodsmart-action-button color="#7232dd" text="Buy Now" />
</smart-goodsmart-action>
```

### Plain Buttons

Set the `plain` property to make the button a plain button. The text color of a plain button matches the button color, and its background is white.

```html
<smart-goodsmart-action>
  <smart-goodsmart-action-icon icon="chat-o" text="Customer Service" />
  <smart-goodsmart-action-icon icon="cart-o" text="Cart" info="5" />
  <smart-goodsmart-action-icon icon="shop-o" text="Shop" />
  <smart-goodsmart-action-button color="#7232dd" text="Add to Cart" type="warning" />
  <smart-goodsmart-action-button plain color="#7232dd" text="Buy Now" />
</smart-goodsmart-action>
```

## API

### GoodsAction Props

| Parameter              | Description                         | Type      | Default |
| ---------------------- | ----------------------------------- | --------- | ------- |
| safe-area-inset-bottom | Whether to reserve bottom safe area for iPhoneX | _boolean_ | `true`  |

### GoodsActionIcon Props

| Parameter             | Description                                                                                                        | Type                | Default       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------- | ------------- |
| app-parameter         | Parameters passed to the APP when opened                                                                           | _string_            | -             |
| class-prefix `v1.10.1`| Class name prefix                                                                                                  | _string_            | `smart-icon`  |
| color `v1.10.15`      | Icon color                                                                                                         | _string_            | `inherit`     |
| disabled              | Whether to disable the button                                                                                      | _boolean_           | `false`       |
| icon                  | Type of icon, please refer to the `icon` component for optional values                                             | _string_            | -             |
| id                    | Identifier                                                                                                         | _string_            | -             |
| info                  | Information in the upper right corner of the icon                                                                  | _string \| number_  | -             |
| lang                  | Specifies the language for returning user info, options: zh_CN simplified Chinese, zh_TW traditional Chinese, en English | _string_            | `en`          |
| link-type             | Link jump type, optional values are `redirectTo`, `switchTab`, `reLaunch`                                          | _string_            | `navigateTo`  |
| loading               | Whether to show loading state                                                                                      | _boolean_           | `false`       |
| open-type             | WeChat open capabilities, see [WeChat official documentation](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) for details | _string_            | -             |
| send-message-img      | Image for sendMessage                                                                                              | _string_            | Screenshot    |
| send-message-path     | Path to the mini program when the message card in the session is clicked                                           | _string_            | Current sharing path |
| send-message-title    | Title of the message card in the session                                                                            | _string_            | Current title |
| session-from          | Session source                                                                                                     | _string_            | -             |
| show-message-card     | Whether to show message card                                                                                       | _string_            | `false`       |
| size                  | Icon size, such as 20px, 2em; default unit is px                                                                   | _string \| number_  | -             |
| text                  | Button text                                                                                                        | _string_            | -             |
| url                   | URL to navigate to when clicked                                                                                    | _string_            | -             |

### GoodsActionButton Props

| Parameter              | Description                                                                                                        | Type      | Default       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ | --------- | ------------- |
| app-parameter          | Parameters passed to the APP when opened                                                                           | _string_  | -             |
| button-id `v1.10.25`   | Identifier, used as the id value of the native button component                                                    | _string_  | -             |
| color                  | Button color, supports `linear-gradient` gradients                                                                 | _string_  | -             |
| custom-style `v1.11.3` | Custom style                                                                                                       | _string_  | ''            |
| disabled               | Whether to disable the button                                                                                      | _boolean_ | `false`       |
| id                     | Identifier                                                                                                         | _string_  | -             |
| lang                   | Specifies the language for returning user info, options: zh_CN simplified Chinese, zh_TW traditional Chinese, en English | _string_  | `en`          |
| link-type              | Link jump type, optional values are `redirectTo`, `switchTab`, `reLaunch`                                          | _string_  | `navigateTo`  |
| loading                | Whether to show loading state                                                                                      | _boolean_ | `false`       |
| open-type              | WeChat open capabilities, see [WeChat official documentation](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) for details | _string_  | -             |
| plain                  | Whether it is a plain button                                                                                       | _boolean_ | `false`       |
| send-message-img       | Image for sendMessage                                                                                              | _string_  | Screenshot    |
| send-message-path      | Path to the mini program when the message card in the session is clicked                                           | _string_  | Current sharing path |
| send-message-title     | Title of the message card in the session                                                                            | _string_  | Current title |
| session-from           | Session source                                                                                                     | _string_  | -             |
| show-message-card      | Whether to show message card                                                                                       | _string_  | `false`       |
| size                   | Button size, optional values are `normal`, `large`, `small`, `mini`                                                | _string_  | `normal`      |
| text                   | Button text                                                                                                        | _string_  | -             |
| type                   | Button type, optional values are `primary`, `warning`, `danger`                                                    | _string_  | `danger`      |
| url                    | URL to navigate to when clicked                                                                                    | _string_  | -             |

### Events

| Event Name | Description          | Parameters |
| ---------- | -------------------- | ---------- |
| bind:click | Callback for button click event | -    |

### GoodsActionIcon Slot

| Name | Description    |
| ---- | -------------- |
| icon | Custom icon    |

### GoodsActionButton Slot

| Name | Description         |
| ---- | ------------------- |
| -    | Button display content |

### GoodsActionIcon External Style Class

| Class Name              | Description             |
| ----------------------- | ----------------------- |
| icon-class              | Icon style class        |
| info-class `v1.10.20`   | Style class for text in the upper right corner of the icon |
| text-class              | Text style class        |

### GoodsActionButton External Style Class

| Class Name   | Description     |
| ------------ | --------------- |
| custom-class | Root node style class |

### Style Variables

The component provides the following CSS variables that can be used for custom styles. For usage, refer to the [ConfigProvider Component](/material/smartui?comId=config-provider&appType=miniapp).

| Name                          | Default Value                             | Description |
| ----------------------------- | ----------------------------------------- | ----------- |
| --goods-action-background-color | _var(--app-B4, #ffffff)_ | - |
| --goods-action-height | _50px_ | - |
| --goods-action-icon-width | _48px_ | - |
| --goods-action-icon-height | _50px_ | - |
| --goods-action-icon-color | _#323233_ | - |
| --goods-action-icon-size | _18px_ | - |
| --goods-action-icon-font-size | _10px_ | - |
| --goods-action-icon-text-color | _#646566_ | - |
| --goods-action-button-height | _40px_ | - |
| --goods-action-button-line-height | _20px_ | - |
| --goods-action-button-border-radius | _999px_ | - |
| --goods-action-button-warning-color | _linear-gradient(to right, #ffd01e, #ff8917)_ | - |
| --goods-action-button-danger-color | _linear-gradient(to right, #ff6034, #ee0a24)_ | - |
| --goods-action-button-plain-color | _var(--app-B4, #ffffff)_ | - |

