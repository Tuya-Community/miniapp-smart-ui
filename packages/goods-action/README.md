# GoodsAction 商品导航

### 介绍

用于为商品相关操作提供便捷交互。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-goodsmart-action": "@tuya-miniapp/smart-ui/lib/goodsmart-action/index",
  "smart-goodsmart-action-icon": "@tuya-miniapp/smart-ui/lib/goodsmart-action-icon/index",
  "smart-goodsmart-action-button": "@tuya-miniapp/smart-ui/lib/goodsmart-action-button/index"
}
```

## 代码演示

### 基础用法

```html
<smart-goodsmart-action>
  <smart-goodsmart-action-icon icon="chat-o" text="客服" bind:click="onClickIcon" />
  <smart-goodsmart-action-icon icon="cart-o" text="购物车" bind:click="onClickIcon" />
  <smart-goodsmart-action-button
    text="加入购物车"
    type="warning"
    bind:click="onClickButton"
  />
  <smart-goodsmart-action-button text="立即购买" bind:click="onClickButton" />
</smart-goodsmart-action>
```

```javascript
Page({
  onClickIcon() {
    Toast('点击图标');
  },

  onClickButton() {
    Toast('点击按钮');
  },
});
```

### 提示信息

设置`dot`属性后，会在图标右上角展示一个小红点。设置`info`属性后，会在图标右上角展示相应的徽标。

```html
<smart-goodsmart-action>
  <smart-goodsmart-action-icon icon="chat-o" text="客服" dot />
  <smart-goodsmart-action-icon icon="cart-o" text="购物车" info="5" />
  <smart-goodsmart-action-icon icon="shop-o" text="店铺" />
  <smart-goodsmart-action-button text="加入购物车" type="warning" />
  <smart-goodsmart-action-button text="立即购买" />
</smart-goodsmart-action>
```

### 自定义按钮颜色

通过`color`属性可以自定义按钮的颜色，支持传入`linear-gradient`渐变色。

```html
<smart-goodsmart-action>
  <smart-goodsmart-action-icon icon="chat-o" text="客服" />
  <smart-goodsmart-action-icon icon="cart-o" text="购物车" info="5" />
  <smart-goodsmart-action-icon icon="shop-o" text="店铺" />
  <smart-goodsmart-action-button color="#be99ff" text="加入购物车" type="warning" />
  <smart-goodsmart-action-button color="#7232dd" text="立即购买" />
</smart-goodsmart-action>
```

### 朴素按钮

通过`plain`属性将按钮设置为朴素按钮，朴素按钮的文字为按钮颜色，背景为白色。

```html
<smart-goodsmart-action>
  <smart-goodsmart-action-icon icon="chat-o" text="客服" />
  <smart-goodsmart-action-icon icon="cart-o" text="购物车" info="5" />
  <smart-goodsmart-action-icon icon="shop-o" text="店铺" />
  <smart-goodsmart-action-button color="#7232dd" text="加入购物" type="warning" />
  <smart-goodsmart-action-button plain color="#7232dd" text="立即购买" />
</smart-goodsmart-action>
```

## API

### GoodsAction Props

| 参数                   | 说明                            | 类型      | 默认值 |
| ---------------------- | ------------------------------- | --------- | ------ |
| safe-area-inset-bottom | 是否为 iPhoneX 留出底部安全距离 | _boolean_ | `true` |

### GoodsActionIcon Props

| 参数                   | 说明                                                                                                                | 类型               | 默认值       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------ |
| app-parameter          | 打开 APP 时，向 APP 传递的参数                                                                                      | _string_           | -            |
| class-prefix `v1.10.1` | 类名前缀                                                                                                            | _string_           | `smart-icon` |
| color `v1.10.15`       | 图标颜色                                                                                                            | _string_           | `inherit`    |
| disabled               | 是否禁用按钮                                                                                                        | _boolean_          | `false`      |
| icon                   | 图标类型，可选值见`icon`组件                                                                                        | _string_           | -            |
| id                     | 标识符                                                                                                              | _string_           | -            |
| info                   | 图标右上角提示信息                                                                                                  | _string \| number_ | -            |
| lang                   | 指定返回用户信息的语言，zh_CN 简体中文，<br>zh_TW 繁体中文，en 英文                                                 | _string_           | `en`         |
| link-type              | 链接跳转类型，可选值为 `redirectTo` `switchTab` `reLaunch`                                                          | _string_           | `navigateTo` |
| loading                | 是否显示为加载状态                                                                                                  | _boolean_          | `false`      |
| open-type              | 微信开放能力，具体支持可参考 [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) | _string_           | -            |
| send-message-img       | sendMessageImg                                                                                                      | _string_           | 截图         |
| send-message-path      | 会话内消息卡片点击跳转小程序路径                                                                                    | _string_           | 当前分享路径 |
| send-message-title     | 会话内消息卡片标题                                                                                                  | _string_           | 当前标题     |
| session-from           | 会话来源                                                                                                            | _string_           | -            |
| show-message-card      | 显示会话内消息卡片                                                                                                  | _string_           | `false`      |
| size                   | 图标大小，如 20px，2em，默认单位为 px                                                                               | _string \| number_ | -            |
| text                   | 按钮文字                                                                                                            | _string_           | -            |
| url                    | 点击后跳转的链接地址                                                                                                | _string_           | -            |

### GoodsActionButton Props

| 参数                   | 说明                                                                                                                | 类型      | 默认值       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | --------- | ------------ |
| app-parameter          | 打开 APP 时，向 APP 传递的参数                                                                                      | _string_  | -            |
| button-id `v1.10.25`   | 标识符，作为原生 button 组件的 id 值                                                                                | _string_  | -            |
| color                  | 按钮颜色，支持传入 `linear-gradient` 渐变色                                                                         | _string_  | -            |
| custom-style `v1.11.3` | 自定义样式                                                                                                          | _string_  | ''           |
| disabled               | 是否禁用按钮                                                                                                        | _boolean_ | `false`      |
| id                     | 标识符                                                                                                              | _string_  | -            |
| lang                   | 指定返回用户信息的语言，zh_CN 简体中文，<br>zh_TW 繁体中文，en 英文                                                 | _string_  | `en`         |
| link-type              | 链接跳转类型，可选值为 `redirectTo` `switchTab` `reLaunch`                                                          | _string_  | `navigateTo` |
| loading                | 是否显示为加载状态                                                                                                  | _boolean_ | `false`      |
| open-type              | 微信开放能力，具体支持可参考 [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) | _string_  | -            |
| plain                  | 是否为朴素按钮                                                                                                      | _boolean_ | `false`      |
| send-message-img       | sendMessageImg                                                                                                      | _string_  | 截图         |
| send-message-path      | 会话内消息卡片点击跳转小程序路径                                                                                    | _string_  | 当前分享路径 |
| send-message-title     | 会话内消息卡片标题                                                                                                  | _string_  | 当前标题     |
| session-from           | 会话来源                                                                                                            | _string_  | -            |
| show-message-card      | 显示会话内消息卡片                                                                                                  | _string_  | `false`      |
| size                   | 按钮尺寸，可选值为 `normal` `large` `small` `mini`                                                                  | _string_  | `normal`     |
| text                   | 按钮文字                                                                                                            | _string_  | -            |
| type                   | 按钮类型，可选值为 `primary` `warning` `danger`                                                                     | _string_  | `danger`     |
| url                    | 点击后跳转的链接地址                                                                                                | _string_  | -            |

### Events

| 事件名     | 说明             | 参数 |
| ---------- | ---------------- | ---- |
| bind:click | 按钮点击事件回调 | -    |

### GoodsActionIcon Slot

| 名称 | 说明       |
| ---- | ---------- |
| icon | 自定义图标 |

### GoodsActionButton Slot

| 名称 | 说明         |
| ---- | ------------ |
| -    | 按钮显示内容 |

### GoodsActionIcon 外部样式类

| 类名                  | 说明                 |
| --------------------- | -------------------- |
| icon-class            | 图标样式类           |
| info-class `v1.10.20` | 图标右上角文字样式类 |
| text-class            | 文字样式类           |

### GoodsActionButton 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
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