---
category: 布局
---

# Layout 布局

### 介绍

Layout 提供了`smart-row`和`smart-col`两个组件来进行行列布局。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-row": "@tuya-miniapp/smart-ui/lib/row/index",
  "smart-col": "@tuya-miniapp/smart-ui/lib/col/index"
}
```

## 代码演示

### 基本用法

Layout 组件提供了`24列栅格`，通过在`Col`上添加`span`属性设置列所占的宽度百分比。此外，添加`offset`属性可以设置列的偏移宽度，计算方式与 span 相同。

```html
<smart-row>
  <smart-col span="8" custom-class="dark">span: 8</smart-col>
  <smart-col span="8" custom-class="light">span: 8</smart-col>
  <smart-col span="8" custom-class="dark">span: 8</smart-col>
</smart-row>

<smart-row>
  <smart-col span="4" custom-class="dark">span: 4</smart-col>
  <smart-col span="10" offset="4" custom-class="light">offset: 4, span: 10</smart-col>
</smart-row>

<smart-row>
  <smart-col offset="12" span="12" custom-class="dark">offset: 12, span: 12</smart-col>
</smart-row>
```

less样式：

```less
.dark,
.light {
  color: #fff;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 10px;
  background-clip: content-box;
}

.dark {
  background-color: #39a9ed;
}

.light {
  background-color: #66c6f2;
}
```

### 设置列元素间距

通过`gutter`属性可以设置列元素之间的间距，默认间距为 0。

```html
<smart-row gutter="20">
  <smart-col span="8" custom-class="dark">span: 8</smart-col>
  <smart-col span="8" custom-class="light">span: 8</smart-col>
  <smart-col span="8" custom-class="dark">span: 8</smart-col>
</smart-row>
```

less样式：

```less
.dark,
.light {
  color: #fff;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 10px;
  background-clip: content-box;
}

.dark {
  background-color: #39a9ed;
}

.light {
  background-color: #66c6f2;
}
```

## API

### Row Props

| 参数   | 说明                          | 类型               | 默认值 |
| ------ | ----------------------------- | ------------------ | ------ |
| gutter | 列元素之间的间距（单位为 px） | _string \| number_ | -      |

### Col Props

| 参数   | 说明           | 类型               | 默认值 |
| ------ | -------------- | ------------------ | ------ |
| offset | 列元素偏移距离 | _string \| number_ | -      |
| span   | 列元素宽度     | _string \| number_ | -      |

### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                                          | 默认值                                       | 描述                                       |
| --------------------------------------------- | -------------------------------------------- | ------------------------------------------ |
| --collapse-item-transition-duration           | _0.3s_                                       | 折叠项过渡持续时间                         |
| --collapse-item-content-padding               | _15px_                                       | 折叠项内容内边距                           |
| --collapse-item-content-font-size             | _13px_                                       | 折叠项内容字体大小                         |
| --collapse-item-content-line-height           | _1.5_                                        | 折叠项内容行高                             |
| --collapse-item-content-text-color            | _#969799_                                    | 折叠项内容文本颜色                         |
| --collapse-item-content-background-color      | _var(--app-B6, #fff)_                        | 折叠项内容背景颜色                         |
| --collapse-item-title-disabled-color          | _#c8c9cc_                                    | 折叠项标题禁用状态颜色                     |