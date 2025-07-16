---
category: 展示
---

# Divider 分割线

### 介绍

用于将内容分隔为多个区域。

### 引入

在`app.json`或`index.json`中引入组件，默认为`ES6`版本，`ES5`引入方式参见[快速上手](#/quickstart)

```json
"usingComponents": {
  "smart-divider": "@tuya-miniapp/smart-ui/divider/index"
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
| dashed           | 虚线                              | _boolean_ | false  |
| hairline         | 细线                              | _boolean_ | false  |
| content-position | 文本位置，`left` `center` `right` | _string_  | -      |
| custom-style     | 自定义样式                        | _string_  | -      |

### Slot

| 名称 | 说明           |
| ---- | -------------- |
| 默认 | 自定义文本内容 |
