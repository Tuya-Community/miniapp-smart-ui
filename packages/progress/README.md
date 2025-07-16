<!-- ---
category: 展示
--- -->

# Progress 进度条

### 介绍

用于展示操作的当前进度。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-progress": "@tuya-miniapp/smart-ui/lib/progress/index"
}
```

## 代码演示

### 基础用法

进度条默认为蓝色，使用`percentage`属性来设置当前进度。

```html
<smart-progress percentage="50" />
```

### 线条粗细

通过`stroke-width`可以设置进度条的粗细。

```html
<smart-progress :percentage="50" stroke-width="8" />
```

### 置灰

设置`inactive`属性后进度条将置灰。

```html
<smart-progress inactive percentage="50" />
```

### 样式定制

可以使用`pivot-text`属性自定义文字，`color`属性自定义进度条颜色。

```html
<smart-progress pivot-text="橙色" color="#f2826a" percentage="25" />

<smart-progress pivot-text="红色" color="#ee0a24" percentage="50" />

<smart-progress
  percentage="75"
  pivot-text="紫色"
  pivot-color="#7232dd"
  color="linear-gradient(to right, #be99ff, #7232dd)"
/>
```

## API

### Props

| 参数         | 说明                       | 类型               | 默认值           |
| ------------ | -------------------------- | ------------------ | ---------------- |
| color        | 进度条颜色                 | _string_           | `#1989fa`        |
| inactive     | 是否置灰                   | _boolean_          | `false`          |
| percentage   | 进度百分比                 | _number_           | `0`              |
| pivot-color  | 文字背景色                 | _string_           | 与进度条颜色一致 |
| pivot-text   | 文字显示                   | _string_           | 百分比文字       |
| show-pivot   | 是否显示进度文字           | _boolean_          | `true`           |
| stroke-width | 进度条粗细，默认单位为`px` | _string \| number_ | `4px`            |
| text-color   | 进度文字颜色               | _string_           | `#fff`           |
| track-color  | 轨道颜色                   | _string_           | `#e5e5e5`        |

### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --progress-height | _4px_ | - |
| --progress-background-color | _#ebedf0_ | - |
| --progress-pivot-padding | _0 5px_ | - |
| --progress-color | _#1989fa_ | - |
| --progress-pivot-font-size | _10px_ | - |
| --progress-pivot-line-height | _1.6_ | - |
| --progress-pivot-background-color | _#1989fa_ | - |
| --progress-pivot-text-color | _#fff_ | - |