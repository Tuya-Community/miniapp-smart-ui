---
category: 展示
---

# Image 图片

### 介绍

增强版的 img 标签，提供多种图片填充模式，支持图片懒加载、加载中提示、加载失败提示。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-image": "@tuya-miniapp/smart-ui/lib/image/index"
}
```

## 代码演示

### 基础用法

基础用法与原生 [image](<(https://developers.weixin.qq.com/miniprogram/dev/component/image.html)>) 标签一致，可以设置`src`、`width`、`height`等原生属性。

```html
<smart-image width="100" height="100" src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" />
```

### 填充模式

通过`fit`属性可以设置图片填充模式，可选值见下方表格。

```html
<smart-image
  width="10rem"
  height="10rem"
  fit="contain"
  src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
/>
```

### 圆形图片

通过`round`属性可以设置图片变圆，注意当图片宽高不相等且`fit`为`contain`或`scale-down`时，将无法填充一个完整的圆形。

```html
<smart-image
  round
  width="10rem"
  height="10rem"
  src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
/>
```

### 图片懒加载

图片懒加载，在即将进入一定范围（上下三屏）时才开始加载。

```html
<smart-image
  width="100"
  height="100"
  lazy-load
  src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
/>
```

### 加载中提示

`Image`组件提供了默认的加载中提示，支持通过`loading`插槽自定义内容。

```html
<smart-image use-loading-slot>
  <smart-loading slot="loading" type="spinner" size="20" vertical />
</smart-image>
```

### 加载失败提示

`Image`组件提供了默认的加载失败提示，支持通过`error`插槽自定义内容。

```html
<smart-image use-error-slot>
  <text slot="error">加载失败</text>
</smart-image>
```

### 修改图片颜色 `v2.3.3`

`tint-color`属性可以直接修改图片的颜色，类似RN的tintColor属性，原理是通过css mask实现的，所以使用之前要做好用户兼容性调查哦。

```html
<smart-image 
  width="100" 
  height="100" 
  src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" 
  tint-color="rgba(255, 255, 25, 0.4)"
/>
```

## API

### Props

| 参数                   | 说明                                 | 类型               | 默认值  |
| ---------------------- | ------------------------------------ | ------------------ | ------- |
| alt                    | 替代文本                             | _string_           | -       |
| fit                    | 图片填充模式                         | _string_           | _fill_  |
| height                 | 高度，默认单位为`px`                 | _string \| number_ | -       |
| lazy-load              | 是否懒加载                           | _boolean_          | `false` |
| radius                 | 圆角大小，默认单位为`px`             | _string \| number_ | `0`     |
| round                  | 是否显示为圆形                       | _boolean_          | `false` |
| show-error             | 是否展示图片加载失败提示             | _boolean_          | `true`  |
| show-loading           | 是否展示图片加载中提示               | _boolean_          | `true`  |
| show-menu-by-longpress | 是否开启长按图片显示识别小程序码菜单 | _boolean_          | `false` |
| src                    | 图片链接                             | _string_           | -       |
| use-error-slot         | 是否使用 error 插槽                  | _boolean_          | `false` |
| use-loading-slot       | 是否使用 loading 插槽                | _boolean_          | `false` |
| webp `v1.10.11`        | 是否解析 webp 格式                   | _boolean_          | `false` |
| width                  | 宽度，默认单位为`px`                 | _string \| number_ | -       |
| tint-color `v2.3.3`                  |     修改图片颜色，类似RN的tintColor，采用css mask实现        | _string_ | -       |

### 图片填充模式

| 名称      | 含义                                                   |
| --------- | ------------------------------------------------------ |
| contain   | 保持宽高缩放图片，使图片的长边能完全显示出来           |
| cover     | 保持宽高缩放图片，使图片的短边能完全显示出来，裁剪长边 |
| fill      | 拉伸图片，使图片填满元素                               |
| heightFix | 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变   |
| none      | 保持图片原有尺寸                                       |
| widthFix  | 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变   |

### Events

| 事件名     | 说明               | 回调参数     |
| ---------- | ------------------ | ------------ |
| bind:click | 点击图片时触发     | event: Event |
| bind:error | 图片加载失败时触发 | event: Event |
| bind:load  | 图片加载完毕时触发 | event: Event |

### Slots

| 名称    | 说明                       |
| ------- | -------------------------- |
| error   | 自定义加载失败时的提示内容 |
| loading | 自定义加载中的提示内容     |

### 外部样式类

| 类名          | 说明           |
| ------------- | -------------- |
| custom-class  | 根节点样式类   |
| error-class   | error 样式类   |
| image-class   | 图片样式类     |
| loading-class | loading 样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --image-placeholder-text-color    | _#969799_       | 加载描述文字    |
| --image-placeholder-font-size    | _14px_       | 加载文字字体    |
| --image-placeholder-background-color    | _#f7f8fa_       | 加载遮照背景色    |
| --image-loading-icon-size    | _32px_       | 加载图标体积    |
| --image-loading-icon-color    | _#dcdee0_       | 加载图标颜色    |
| --image-error-size `v2.0.0`   | _32px_       | 图片加载错误时默认图片    |