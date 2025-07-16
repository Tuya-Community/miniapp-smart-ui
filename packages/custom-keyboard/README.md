---
category: 数据录入
---

# CustomKeyboard 数字键盘

### 介绍

自定义数字键盘

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-custom-keyboard": "@tuya-miniapp/smart-ui/lib/custom-keyboard/index"
}
```

## 代码演示

### 基础用法

```html
<smart-custom-keyboard bind:change="onChange" bind:confirm="onConfirm" />
```

```js
Page({
  onChange(v) {
    console.log('onChange value =====>', v.detail);
  },
  onConfirm(v) {
    console.log('onConfirm value ====>', v.detail);
  },
});
```

### 高级用法

可以通过插槽添加定制内容。

```html
<smart-custom-keyboard
  input-container-style="
    marginLeft: 56rpx;
    marginTop: 16rpx;
    marginBottom: 56rpx;
    width: 560rpx;
    height: 120rpx;
  "
  placeholder="请输入"
  confirm-text="确认"
  value="123"
  confirm-color="#123321"
  bind:change="onChange"
  bind:confirm="onConfirm"
>
  <view
    slot="custom-button"
    bind:tap="handleBtn"
    style="border: 1px solid blue; borderRadius: 4px; marginRight: 4px"
    >点击</view
  >
</smart-custom-keyboard>
```

```js
Page({
  onChange(v) {
    console.log('onChange value =====>', v.detail);
  },
  onConfirm(v) {
    console.log('onConfirm value ====>', v.detail);
  },
  handleBtn() {
    console.log('click');
  },
});
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| confirm-color         | 数字键盘的确认按钮背景色                | _string_  | -              |
| confirm-text          | 确认按钮文案                            | _string_  | Confirm        |
| confirm-text-style    | 确认按钮的样式                          | _string_  | -              |
| digital-base          | 用于适配进制功能（取值范围 1-10）       | _number_  | 10             |
| input-container-style | 输入框容器样式                          | _string_  | -              |
| ismart-hide-zero      | 是否隐藏零                              | _boolean_ | false          |
| placeholder           | placeholder 文案                        | _string_  | `please input` |
| value                 | 值                                      | _string_  | -              |
| value-text-style      | 当前值的样式（适用于 placeholder 样式） | _string_  | -              |

### Slot

| 名称          | 说明           |
| ------------- | -------------- |
| custom-button | 自定义右侧内容 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --custom-keyboard-bg-color | _var(--app-B6, #fff)_ | 背景颜色 |
| --custom-keyboard-text-color | _var(--app-B6-N2, rgba(0, 0, 0, 0.7))_ | 字体颜色 |
| --custom-keyboard-border-color | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_ | 边框颜色 |
| --custom-keyboard-placeholder-color | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_ | 占位符颜色 |
| --custom-keyboard-popup-bg-color | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_ | 弹窗背景色 |
| --custom-keyboard-popup-item-color | _var(--app-B6, #fff)_ | 弹窗项目颜色 |
| --custom-keyboard-popup-confirm-color | _var(--app-M3, #2dda86)_ | 确认按钮颜色 |
| --custom-keyboard-popup-text-color | _var(--app-B6-N2, rgba(0, 0, 0, 0.7))_ | 弹窗文字颜色 |
| --custom-keyboard-popup-hover-color | _var(--app-B6-N7, rgba(0, 0, 0, 0.1))_ | 鼠标悬停颜色 |