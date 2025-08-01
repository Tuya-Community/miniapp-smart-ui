---
category: 数据录入
---

# Stepper 步进器

### 介绍

步进器由增加按钮、减少按钮和输入框组成，用于在一定范围内输入、调整数字。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-stepper": "@tuya-miniapp/smart-ui/lib/stepper/index"
}
```

## 代码演示

### 基础用法

通过`value`设置输入值，可以通过`change`事件监听到输入值的变化。

```html
<smart-stepper value="{{ 1 }}" bind:change="onChange" />
```

```js
Page({
  onChange(event) {
    console.log(event.detail);
  },
});
```

### 步长设置

通过`step`属性设置每次点击增加或减少按钮时变化的值，默认为`1`。

```html
<smart-stepper value="{{ 1 }}" step="2" />
```

### 限制输入范围

通过`min`和`max`属性限制输入值的范围。

```html
<smart-stepper value="{{ 5 }}" min="5" max="8" />
```

### 限制输入整数

设置`integer`属性后，输入框将限制只能输入整数。

```html
<smart-stepper value="{{ 1 }}" integer />
```

### 禁用状态

通过设置`disabled`属性来禁用步进器，禁用状态下无法点击按钮或修改输入框。

```html
<smart-stepper value="{{ 1 }}" disabled />
```

### 关闭长按

通过设置`long-press`属性决定步进器是否开启长按手势。

```html
<smart-stepper value="{{ 1 }}" long-press="{{ false }}" />
```

### 固定小数位数

通过设置`decimal-length`属性可以保留固定的小数位数。

```html
<smart-stepper value="{{ 1 }}" step="0.2" decimal-length="{{ 1 }}" />
```

### 异步变更

如果需要异步地修改输入框的值，可以设置`async-change`属性，并在`change`事件中手动修改`value`。

```html
<smart-stepper value="{{ value }}" async-change bind:change="onChange" />
```

```js
Page({
  data: {
    value: 1,
  },

  onChange(value) {
    Toast.loading({ forbidClick: true });

    setTimeout(() => {
      Toast.clear();
      this.setData({ value });
    }, 500);
  },
});
```

### 自定义大小

通过`input-width`属性设置输入框宽度，通过`button-size`属性设置按钮大小和输入框高度。

```html
<smart-stepper value="{{ 1 }}" input-width="40px" button-size="32px" />
```

## API

### Props

| 参数                  | 说明                                                                            | 类型               | 默认值  |
| --------------------- | ------------------------------------------------------------------------------- | ------------------ | ------- |
| always-embed `v1.9.3` | 强制 input 处于同层状态，默认 focus 时 input 会切到非同层状态 (仅在 iOS 下生效) | _boolean_          | `false` |
| async-change          | 是否开启异步变更，开启后需要手动控制输入值                                      | _boolean_          | `false` |
| button-size           | 按钮大小，默认单位为 `px`，输入框高度会和按钮大小保持一致                       | _string \| number_ | `28px`  |
| decimal-length        | 固定显示的小数位数                                                              | _number_           | -       |
| disable-input         | 是否禁用输入框                                                                  | _boolean_          | `false` |
| disable-minus         | 是否禁用减少按钮                                                                | _boolean_          | -       |
| disable-plus          | 是否禁用增加按钮                                                                | _boolean_          | -       |
| disabled              | 是否禁用                                                                        | _boolean_          | `false` |
| input-width           | 输入框宽度，默认单位为 `px`                                                     | _string \| number_ | `32px`  |
| integer               | 是否只允许输入整数                                                              | _boolean_          | `false` |
| long-press            | 是否开启长按手势                                                                | _boolean_          | `true`  |
| max                   | 最大值                                                                          | _string \| number_ | -       |
| min                   | 最小值                                                                          | _string \| number_ | `1`     |
| name                  | 在表单内提交时的标识符                                                          | _string_           | -       |
| show-minus            | 是否显示减少按钮                                                                | _boolean_          | `true`  |
| show-plus             | 是否显示增加按钮                                                                | _boolean_          | `true`  |
| step                  | 步长                                                                            | _string \| number_ | `1`     |
| theme                 | 样式风格，可选值为 `round`                                                      | _string_           | -       |
| value                 | 输入值                                                                          | _string \| number_ | 最小值  |

### Events

| 事件名         | 说明                     | 回调参数                   |
| -------------- | ------------------------ | -------------------------- |
| bind:blur      | 输入框失焦时触发         | -                          |
| bind:change    | 当绑定值变化时触发的事件 | event.detail: 当前输入的值 |
| bind:focus     | 输入框聚焦时触发         | -                          |
| bind:minus     | 点击减少按钮时触发       | -                          |
| bind:overlimit | 点击不可用的按钮时触发   | -                          |
| bind:plus      | 点击增加按钮时触发       | -                          |

### Slot

| 名称  | 说明     |
| ----- | -------- |
| minus | 减号按钮 |
| plus  | 加号按钮 |

### 外部样式类

| 类名            | 说明           |
| --------------- | -------------- |
| custom-class    | 根节点样式类   |
| input-class     | 输入框样式类   |
| minusmart-class | 减号按钮样式类 |
| plusmart-class  | 加号按钮样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --stepper-container-background-color | _var(--app-B6-N9, rgba(0, 0, 0, 0.05))_ | 背景色 |
| --stepper-background-border-radius | _10px_ | 背景圆角 |
| --stepper-padding | _2px_ | 外部合作内边距 |
| --stepper-active-color | _#e8e8e8_ | 按钮点击后颜色 |
| --stepper-background-color | _var(--app-B6, #fff)_ | 按钮背景色 |
| --stepper-button-icon-color | _var(--app-B6-N3, rgba(0, 0, 0, 0.5))_ | 按钮内部图标颜色 |
| --stepper-button-disabled-color | _none_ | 按钮禁用颜色 |
| --stepper-button-disabled-icon-color | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_ | 按钮禁用图标颜色 |
| --stepper-button-round-theme-color | _#ee0a24_ | 圆角样式按钮颜色 |
| --stepper-btn-width | _44px_ | 按钮宽度 |
| --stepper-btn-height | _28px_ | 按钮高度 |
| --stepper-input-width | _50px_ | 中间数组输入框宽度 |
| --stepper-input-height | _28px_ | 中间数组输入框高度 |
| --stepper-input-font-size | _16px_ | 中间数组输入框字体大小 |
| --stepper-input-line-height | _normal_ | 中间数组输入框字体高度 |
| --stepper-input-text-color | _var(--app-B6-N1, rgba(0, 0, 0, 1))_ | 中间数组输入框字体颜色 |
| --stepper-input-disabled-text-color | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_ | 中间数组输入框禁用模式字体颜色 |
| --stepper-border-radius | _8px_ | 按钮圆角 |
| --stepper-button-border `v2.2.0` | _0_ | 按钮边框 |
| --stepper-button-icon-font-size `v2.2.0` | _22px_ | 按钮内部图标的字体大小 |
