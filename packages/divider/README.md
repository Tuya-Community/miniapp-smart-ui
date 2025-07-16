---
category: 展示
---

# Divider 分割线

### 介绍

用于将内容分隔为多个区域。

### 引入

在`app.json`或`index.json`中引入组件，默认为`ES6`版本，`ES5`引入方式参见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)

```json
"usingComponents": {
  "smart-divider": "@tuya-miniapp/smart-ui/lib/divider/index"
}
```

## 代码演示

### 基础用法

```html
<smart-divider />
```

### 使用 hairline

```html
<smart-divider hairline />
```

### 虚线

```html
<smart-divider dashed />
```

### 文本位置

```html
<smart-divider contentPosition="center">文本</smart-divider>
<smart-divider contentPosition="left">文本</smart-divider>
<smart-divider contentPosition="right">文本</smart-divider>
```

### 自定义属性

```html
<smart-divider contentPosition="center" textColor="#1989fa">文本颜色</smart-divider>
<smart-divider contentPosition="center" borderColor="#1989fa">
  border 颜色
</smart-divider>
<smart-divider contentPosition="center" fontSize="18">字体大小</smart-divider>
```

### 自定义样式

```html
<smart-divider
  contentPosition="center"
  customStyle="color: #1989fa; border-color: #1989fa; font-size: 18px;"
>
  文本
</smart-divider>
```

## API

### Props

| 参数             | 说明                              | 类型      | 默认值 |
| ---------------- | --------------------------------- | --------- | ------ |
| content-position | 文本位置，`left` `center` `right` | _string_  | -      |
| custom-style     | 自定义样式                        | _string_  | -      |
| dashed           | 虚线                              | _boolean_ | false  |
| hairline         | 细线                              | _boolean_ | false  |

### Slot

| 名称 | 说明           |
| ---- | -------------- |
| 默认 | 自定义文本内容 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --divider-margin | _@padding-md 0_ | 上下边距 |
| --divider-text-color | _#969799_ | 文本颜色 |
| --divider-font-size | _14px_ | 字体大小 |
| --divider-line-height | _24px_ | 行高 |
| --divider-border-color | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_ | 边框颜色 |
| --divider-content-padding | _16px_ | 内容内边距 |
| --divider-content-left-width | _10%_ | 左侧内容宽度 |
| --divider-content-right-width | _10%_ | 右侧内容宽度 |