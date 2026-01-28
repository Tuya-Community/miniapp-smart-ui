---
category: 通用
---

# Button 按钮

### 介绍

按钮用于触发一个操作，如提交表单。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-button": "@tuya-miniapp/smart-ui/lib/button/index"
}
```

## 代码演示

### 按钮类型

支持`default`、`primary`、`info`、`warning`、`danger`五种类型，默认为`default`。

```html
<smart-button type="default">默认按钮</smart-button>
<smart-button type="primary">主要按钮</smart-button>
<smart-button type="info">信息按钮</smart-button>
<smart-button type="warning">警告按钮</smart-button>
<smart-button type="danger">危险按钮</smart-button>
```

### 朴素按钮

通过`plain`属性将按钮设置为朴素按钮，朴素按钮的文字为按钮颜色，背景为白色。

```html
<smart-button plain type="primary">朴素按钮</smart-button>
<smart-button plain type="info">朴素按钮</smart-button>
```

### 细边框

设置`hairline`属性可以开启 0.5px 边框，基于伪类实现。

```html
<smart-button plain hairline type="primary">细边框按钮</smart-button>
<smart-button plain hairline type="info">细边框按钮</smart-button>
```

### 禁用状态

通过`disabled`属性来禁用按钮，此时按钮的`bind:click`事件不会触发。

```html
<smart-button disabled type="primary">禁用状态</smart-button>
<smart-button disabled type="info">禁用状态</smart-button>
```

### 加载状态

```html
<smart-button loading type="primary" />
<smart-button loading type="primary" loading-type="spinner" />
<smart-button loading type="primary" loading-text="加载中..." />
```

### 按钮形状

```html
<smart-button square type="primary">方形按钮</smart-button>
<smart-button round type="info">圆形按钮</smart-button>
```

### 图标按钮

通过`icon`属性设置按钮图标，支持 Icon 组件里的所有图标，也可以传入图标 URL。

```html
<smart-button icon="{{ iconAdd }}" type="primary" />
<smart-button icon="{{ iconAdd }}" type="primary">按钮</smart-button>
<smart-button icon="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" type="info">
  按钮
</smart-button>
```

### 按钮尺寸

支持`large`、`normal`、`small`、`mini`四种尺寸，默认为`normal`。

```html
<smart-button type="primary" size="large">大号按钮</smart-button>
<smart-button type="primary" size="normal">普通按钮</smart-button>
<smart-button type="primary" size="small">小型按钮</smart-button>
<smart-button type="primary" size="mini">迷你按钮</smart-button>
```

### 块级元素

通过`block`属性可以将按钮的元素类型设置为块级元素。

```html
<smart-button type="primary" block>块级元素</smart-button>
```

### 自定义颜色

通过`color`属性可以自定义按钮的颜色。

```html
<smart-button color="#7232dd">单色按钮</smart-button>
<smart-button color="#7232dd" plain>单色按钮</smart-button>
<smart-button color="linear-gradient(to right, #4bb0ff, #6149f6)">
  渐变色按钮
</smart-button>
```

### 文字颜色 `v2.10.1`

通过`my-text-color`属性可以自定义按钮文字颜色，与`color`、`plain`等配合使用。

```html
<smart-button type="primary" my-text-color="#fff">文字颜色</smart-button>
<smart-button type="primary" plain my-text-color="#1989fa">文字颜色</smart-button>
<smart-button color="#7232dd" my-text-color="#fff">文字颜色</smart-button>
```

### 文字样式 `v2.10.1`

通过`text-style`属性可以自定义按钮文字样式，如字号、字重、字间距等。

```html
<smart-button type="primary" text-style="font-size: 18px; font-weight: 600;">文字样式</smart-button>
<smart-button type="info" text-style="letter-spacing: 2px;">文字样式</smart-button>
```

## API

### Props

| 参数         | 说明                                                     | 类型      | 默认值       |
| ------------ | -------------------------------------------------------- | --------- | ------------ |
| block        | 是否为块级元素                                           | _boolean_ | `false`      |
| button-id    | 标识符，作为原生 button 组件的 id 值                     | _string_  | -            |
| class-prefix | 图标类名前缀，同 Icon 组件的 [class-prefix 属性](/material/smartui?comId=icon&appType=miniapp) | _string_  | `smart-icon` |
| color        | 按钮颜色，支持传入`linear-gradient`渐变色                | _string_  | -            |
| custom-style | 自定义样式                                               | _string_  | -            |
| disabled     | 是否禁用按钮                                             | _boolean_ | `false`      |
| hairline     | 是否使用 0.5px 边框                                      | _boolean_ | `false`      |
| icon         | 左侧图标或图片链接，可选值见 [Icon 组件](/material/smartui?comId=icon&appType=miniapp)         | _string_  | -            |
| id           | 标识符                                                   | _string_  | -            |
| loading      | 是否显示为加载状态                                       | _boolean_ | `false`      |
| loading-size | 加载图标大小                                             | _string_  | `20px`       |
| loading-text | 加载状态提示文字                                         | _string_  | -            |
| my-text-color `v2.10.1` | 按钮文字颜色                                             | _string_  | -            |
| text-style   | 按钮文字样式                                         | _string_  | -            |
| loading-type | 加载状态图标类型，可选值为 `spinner`                     | _string_  | `circular`   |
| plain        | 是否为朴素按钮                                           | _boolean_ | `false`      |
| right-icon   | 右侧图标或图片链接，可选值见 [Icon 组件](/material/smartui?comId=icon&appType=miniapp)         | _string_  | -            |
| round        | 是否为圆形按钮                                           | _boolean_ | `false`      |
| size         | 按钮尺寸，可选值为 `normal` `large` `small` `mini`       | _string_  | `normal`     |
| square       | 是否为方形按钮                                           | _boolean_ | `false`      |
| type         | 按钮类型，可选值为 `primary` `info` `warning` `danger`   | _string_  | `default`    |

### Events

| 事件名     | 说明                                     | 参数 |
| ---------- | ---------------------------------------- | ---- |
| bind:click | 点击按钮，且按钮状态不为加载或禁用时触发 | -    |
| bind:error | 当使用开放能力时，发生错误的回调 | - |

> Button 提供的是 click 事件而不是原生 tap 事件，按钮禁用时，click 事件不会触发，tap 事件依然会触发。

### 外部样式类

| 类名          | 说明           |
| ------------- | -------------- |
| custom-class  | 根节点样式类   |
| loading-class | 加载图标样式类 |
| hover-class | 按钮按下时的样式 |


### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。
| 名称                                          | 默认值                                         | 描述                               |
| --------------------------------------------- | ---------------------------------------------- | ---------------------------------- |
| --button-mini-height                          | _22px_                                         | 迷你按钮高度                       |
| --button-mini-min-width                       | _50px_                                         | 迷你按钮最小宽度                   |
| --button-mini-font-size                       | _10px_                                         | 迷你按钮字体大小                   |
| --button-small-height                         | _30px_                                         | 小按钮高度                         |
| --button-small-font-size                      | _12px_                                         | 小按钮字体大小                     |
| --button-small-min-width                      | _60px_                                         | 小按钮最小宽度                     |
| --button-normal-font-size                     | _14px_                                         | 普通按钮字体大小                   |
| --button-large-height                         | _48px_                                         | 大按钮高度                         |
| --button-default-color                        | _var(--app-B1-N1, rgba(0, 0, 0, 1))_           | 默认按钮字体颜色                   |
| --button-default-height                       | _48px_                                         | 默认按钮高度                       |
| --button-default-font-size                    | _16px_                                         | 默认按钮字体大小                   |
| --button-default-background-color             | _var(--app-B3, #ffffff)_                       | 默认按钮背景颜色                   |
| --button-default-border-color                 | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_         | 默认按钮边框颜色                   |
| --button-primary-color                        | _#fff_                                         | 主按钮字体颜色                     |
| --button-primary-background-color             | _var(--app-M3, #2dda86)_                       | 主按钮背景颜色                     |
| --button-primary-border-color                 | _var(--app-M3, #2dda86)_                       | 主按钮边框颜色                     |
| --button-info-color                           | _#fff_                                         | 信息按钮字体颜色                   |
| --button-info-background-color                | _var(--app-M4, #1989fa)_                       | 信息按钮背景颜色                   |
| --button-info-border-color                    | _var(--app-M4, #1989fa)_                       | 信息按钮边框颜色                   |
| --button-danger-color                         | _#fff_                                         | 危险按钮字体颜色                   |
| --button-danger-background-color              | _var(--app-M2, #f04c4c)_                       | 危险按钮背景颜色                   |
| --button-danger-border-color                  | _var(--app-M2, #f04c4c)_                       | 危险按钮边框颜色                   |
| --button-warning-color                        | _#fff_                                         | 警告按钮字体颜色                   |
| --button-warning-background-color             | _var(--app-M5, #ffa000)_                       | 警告按钮背景颜色                   |
| --button-warning-border-color                 | _var(--app-M5, #ffa000)_                       | 警告按钮边框颜色                   |
| --button-line-height                          | _20px_                                         | 按钮行高                           |
| --button-border-width                         | _1px_                                          | 按钮边框宽度                       |
| --button-border-radius                        | _10px_                                         | 按钮边框圆角半径                   |
| --button-round-border-radius                  | _999px_                                        | 圆形按钮边框圆角半径               |
| --button-plain-background-color               | _#fff_                                         | 纯按钮背景颜色                     |
| --button-disabled-opacity                     | _0.3_                                          | 禁用按钮不透明度                   |
| --button-font-weight                          | _normal_                                       | 按钮字体粗细                       |
| --button-primary-font-weight                  | _600_                                          | 主按钮字体粗细                     |