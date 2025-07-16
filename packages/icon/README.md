---
category: 展示
---

# Icon 图标

### 介绍

基于字体的图标集，可以通过 Icon 组件使用，也可以在其他组件中通过 icon 属性引用。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-icon": "@tuya-miniapp/smart-ui/lib/icon/index"
}
```

在`index.ts`中引入 icon svg

```js
import warningIcon from '@tuya-miniapp/icons/dist/svg/Warning';
```

## 代码演示

### 基础用法

`Icon`的`name`属性支持传入图标名称或图片链接。

```html
<smart-icon name="{{ warningIcon }}" />
<smart-icon name="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" />
```

### 提示信息

设置`dot`属性后，会在图标右上角展示一个小红点。设置`info`属性后，会在图标右上角展示相应的徽标。

```html
<smart-icon name="{{ warningIcon }}" dot />
<smart-icon name="{{ warningIcon }}" info="9" />
<smart-icon name="{{ warningIcon }}" info="99+" />
```

### 图标颜色

设置`color`属性来控制图标颜色。

```html
<smart-icon name="{{ warningIcon }}" color="red" />
```

### 图标大小

设置`size`属性来控制图标大小。

```html
<smart-icon name="{{ warningIcon }}" size="50px" />
```

### 自定义图标

如果需要在现有 Icon 的基础上使用更多图标，可以引入第三方 iconfont 对应的字体文件和 CSS 文件，之后就可以在 Icon 组件中直接使用。例如，可以在 `app.wxss` 文件中引入。

```css
/* 引入第三方或自定义的字体图标样式 */
@font-face {
  font-family: 'my-icon';
  src: url('./my-icon.ttf') format('truetype');
}

.my-icon {
  font-family: 'my-icon';
}

.my-icon-extra::before {
  content: '\e626';
}
```

```html
<!-- 通过 class-prefix 指定类名为 my-icon -->
<smart-icon class-prefix="my-icon" name="extra" />
```

### Svg Path `v2.3.3`

组件现在也支持传入path的方式渲染
```html
<smart-icon 
  name="M192 448C192 624.736 335.264 768 512 768s320-143.264 320-320a319.872 319.872 0 0 0-160-277.184V160a64 64 0 0 0-64-64h-192a64 64 0 0 0-64 64v10.816A319.872 319.872 0 0 0 192 448z m224-384h192a32 32 0 0 0 0-64h-192a32 32 0 0 0 0 64z" 
  size="36"
  color="#1989fa"
/>
```


## API

### Props

| 参数         | 说明                                       | 类型               | 默认值       |
| ------------ | ------------------------------------------ | ------------------ | ------------ |
| class-prefix | 类名前缀                                   | _string_           | `smart-icon` |
| color        | 图标颜色                                   | _string_           | `inherit`    |
| custom-style | 自定义样式                                 | _string_           | -            |
| dot          | 是否显示图标右上角小红点                   | _boolean_          | `false`      |
| info         | 图标右上角文字提示                         | _string \| number_ | -            |
| name         | 图标名称或 Svg URL 或图片链接              | _string_           | -            |
| size         | 图标大小，如 `20px`，`2em`，默认单位为`px` | _string \| number_ | `inherit`    |

### Events

| 事件名     | 说明           | 参数 |
| ---------- | -------------- | ---- |
| bind:click | 点击图标时触发 | -    |

### 外部样式类

| 类名         | 说明                 |
| ------------ | -------------------- |
| custom-class | 根节点样式类         |
| info-class   | 图标右上角文字样式类 |


### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --icon-color | _var(--app-B4-N2, rgba(0, 0, 0, 0.7))_ | 图标颜色 |

## 常见问题

### 开发者工具上提示 Failed to load font 是什么情况？

这个是开发者工具本身的问题，可以忽略，具体可以查看[微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/font/wx.loadFontFace.html) - 注意事项第 5 条。
