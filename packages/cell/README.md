---
category: 展示
---

# Cell 单元格

### 介绍

单元格为列表中的单个展示项。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-cell": "@tuya-miniapp/smart-ui/lib/cell/index",
  "smart-cell-group": "@tuya-miniapp/smart-ui/lib/cell-group/index"
}
```

## 代码演示

### 基础用法

`Cell`可以单独使用，也可以与`CellGroup`搭配使用。`CellGroup`可以为`Cell`提供上下外边框。

```html
<smart-cell-group>
  <smart-cell title="单元格" value="内容" is-link />
  <smart-cell
    title="单元格"
    value="内容"
    label="描述信息"
    border="{{ false }}"
    is-link
  />
</smart-cell-group>
```

### 卡片风格

通过 `CellGroup` 的 `inset` 属性，可以将单元格转换为圆角卡片风格（从 1.7.2 版本开始支持）。

```html
<smart-cell-group inset>
  <smart-cell title="单元格" value="内容" is-link />
  <smart-cell title="单元格" value="内容" label="描述信息" border="{{ false }}" is-link />
</smart-cell-group>
```

### 展示图标

通过`icon`属性在标题左侧展示图标。

```html
<smart-cell
  title="单元格"
  value="内容"
  icon="{{ sunMaxFill }}"
  border="{{ false }}"
  is-link
/>
<smart-cell
  title="自定义 Icon"
  value="内容"
  border="{{ false }}"
  is-link
>
  <smart-icon
    class="cell-icon"
    slot="icon"
    name="{{ sunMaxFill }}"
    size="24px"
    color="#3678E3"
  />
</smart-cell>
```

### 展示箭头

设置`is-link`属性后会在单元格右侧显示箭头，并且可以通过`arrow-direction`属性控制箭头方向。

```html
<smart-cell title="单元格" is-link />
<smart-cell title="单元格" is-link value="内容" />
<smart-cell title="单元格" is-link value="内容" arrow-direction="down" />
```

### 页面跳转

可以通过`url`属性进行页面跳转，通过`link-type`属性控制跳转类型。

```html
<smart-cell title="URL跳转(navigateTo)" is-link url="/pages/dashboard/index" />
  <smart-cell title="URL重定向(redirectTo)" is-link url="/pages/dashboard/index" link-type="redirectTo" />
  <smart-cell title="打开H5容器(openInnerH5)" is-link bind:click="onNavTo" border="{{ false }}" />
```

### 分组标题

通过`CellGroup`的`title`属性可以指定分组标题。

```html
<smart-cell-group title="分组 1">
  <smart-cell title="单元格" is-link border="{{ false }}" />
</smart-cell-group>
<smart-cell-group title="分组 2">
  <smart-cell title="单元格" is-link border="{{ false }}" />
</smart-cell-group>
```

### 其他类型

也可配合其他组件进行展示

```html
<smart-cell title="Title">
  <smart-switch checked="{{ true }}" size="24px" />
</smart-cell>
<smart-cell title="Title">
  <smart-icon name="{{ checkMark }}" color="#3678E3" size="28px" />
</smart-cell>
<smart-cell title="Title">
  <smart-checkbox value="{{ false }}" shape="square" />
</smart-cell>
<smart-cell title="Title">
  <smart-checkbox value="{{ false }}" />
</smart-cell>
<smart-cell
  title="Title"
  label="Bedroom"
  is-link
  border="{{ false }}"
>
  <smart-icon
    class="cell-icon"
    slot="icon"
    name="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png"
    size="50px"
  />
</smart-cell>
```

### 使用插槽

如以上用法不能满足你的需求，可以使用插槽来自定义内容。

```html
<smart-cell value="内容" icon="{{ sunMaxFill }}" is-link>
  <view slot="title">
    <view class="title">单元格</view>
    <smart-tag type="danger">标签</smart-tag>
  </view>
</smart-cell>
<smart-cell title="单元格" border="{{ false }}">
  <smart-icon slot="right-icon" name="search" />
</smart-cell>
```

## API

### CellGroup Props

| 参数   | 说明                   | 类型      | 默认值  |
| ------ | ---------------------- | --------- | ------- |
| border | 是否显示外边框         | _boolean_ | `true`  |
| inset  | 是否展示为圆角卡片风格 | _boolean_ | `false` |
| title  | 分组标题               | _string_  | `-`     |

### CellGroup 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### Cell Props

| 参数            | 说明                                                       | 类型               | 默认值       |
| --------------- | ---------------------------------------------------------- | ------------------ | ------------ |
| arrow-direction | 箭头方向，可选值为 `left` `up` `down`                      | _string_           | -            |
| border          | 是否显示下边框                                             | _boolean_          | `true`       |
| clickable       | 是否开启点击反馈                                           | _boolean_          | `false`      |
| icon            | 左侧图标svg值或图片链接，可选值见 [Icon 组件](/material/smartui?comId=icon&appType=miniapp)       | _string_           | -            |
| is-link         | 是否展示右侧箭头并开启点击反馈                             | _boolean_          | `false`      |
| label           | 标题下方的描述信息                                         | _string_           | -            |
| link-type       | 链接跳转类型，可选值为 `redirectTo` `switchTab` `reLaunch` | _string_           | `navigateTo` |
| required        | 是否显示表单必填星号                                       | _boolean_          | `false`      |
| title           | 左侧标题                                                   | _string \| number_ | -            |
| title-style     | 标题样式                                                   | _string_           | -            |
| title-width     | 标题宽度，须包含单位                                       | _string_           | -            |
| url             | 点击后跳转的链接地址                                       | _string_           | -            |
| use-label-slot  | 是否使用 label slot                                        | _boolean_          | `false`      |
| value           | 右侧内容                                                   | _string \| number_ | -            |

### Cell Event

| 事件名     | 说明             | 参数 |
| ---------- | ---------------- | ---- |
| bind:click | 点击单元格时触发 | -    |

### Cell Slot

| 名称       | 说明                                                           |
| ---------- | -------------------------------------------------------------- |
| -          | 自定义`value`显示内容，如果设置了`value`属性则不生效           |
| icon       | 自定义`icon`显示内容，如果设置了`icon`属性则不生效             |
| label      | 自定义`label`显示内容，需要设置 `use-label-slot`属性           |
| right-icon | 自定义右侧按钮，默认是`arrow`，如果设置了`is-link`属性则不生效 |
| title      | 自定义`title`显示内容，如果设置了`title`属性则不生效           |

### Cell 外部样式类

| 类名         | 说明           |
| ------------ | -------------- |
| custom-class | 根节点样式类   |
| label-class  | 描述信息样式类 |
| title-class  | 标题样式类     |
| value-class  | 右侧内容样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                                      | 默认值                                        | 描述                                     |
| ----------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| --cell-font-size                          | _16px_                                        | 单元格字体大小                           |
| --cell-line-height                        | _24px_                                        | 单元格行高                               |
| --cell-vertical-padding                   | _16px_                                        | 单元格垂直内边距                         |
| --cell-horizontal-padding                 | _16px_                                        | 单元格水平内边距                         |
| --cell-text-color                         | _var(--app-B6-N1, rgba(0, 0, 0, 1))_          | 单元格文字颜色                           |
| --cell-background-color                   | _var(--app-B6, #fff)_                         | 单元格背景颜色                           |
| --cell-active-color                       | _var(--app-B1, #f6f7fb)_                      | 单元格激活颜色                           |
| --cell-required-color                     | _var(--app-M2, #f04c4c)_                      | 单元格必填项颜色                         |
| --cell-label-color                        | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_        | 单元格标签文字颜色                       |
| --cell-label-font-size                    | _14px_                                        | 单元格标签字体大小                       |
| --cell-label-line-height                  | _18px_                                        | 单元格标签行高                           |
| --cell-label-margin-top                   | _3px_                                         | 单元格标签上边距                         |
| --cell-value-color                        | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_        | 单元格值文字颜色                         |
| --cell-icon-size                          | _24px_                                        | 单元格图标大小                           |
| --cell-right-icon-color                   | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_        | 单元格右侧图标颜色                       |
| --cell-border-color `v2.1.4`              | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_        | 单元格边框颜色                           |
| --cell-border-left-position `v2.1.4`      | _16px_                                        | 单元格左边框位置                         |
| --cell-border-right-position `v2.1.4`     | _16px_                                        | 单元格右边框位置                         |
| --cell-group-background-color             | _var(--app-B6, #fff)_                         | 单元格组背景颜色                         |
| --cell-group-title-color                  | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_        | 单元格组标题颜色                         |
| --cell-group-title-padding                | _@padding-md @padding-md @padding-xs_         | 单元格组标题内边距                       |
| --cell-group-title-font-size              | _16px_                                        | 单元格组标题字体大小                     |
| --cell-group-title-line-height            | _16px_                                        | 单元格组标题行高                         |
| --cell-group-inset-padding                | _0 @padding-md_                               | 单元格组嵌入内边距                       |
| --cell-group-inset-border-radius          | _16px_                                        | 单元格组嵌入边框圆角半径                 |
| --cell-group-inset-title-padding          | _@padding-md @padding-md @padding-xs @padding-xl_ | 单元格组嵌入标题内边距                   |