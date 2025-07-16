---
category: 数据录入
---

# Search 搜索

### 介绍

用于搜索场景的输入框组件。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-search": "@tuya-miniapp/smart-ui/lib/search/index"
}
```

## 代码演示

### 基础用法

`smart-search` 中，value 用于控制搜索框中的文字。

```html
<smart-search value="{{ value }}" placeholder="请输入搜索关键词" />
```

### 简洁风格

`smart-search` 中，value 用于控制搜索框中的文字。可以通过 css 变量调整背景。

```css
.easy-demo {
  --search-background-color: transparent;
  --search-body-background-color: var(--app-B3, #fff);
}
```

```html
<smart-search
  custom-class="easy-demo"
  model:value="{{ value }}"
  shape="round"
  search-text="搜索"
  placeholder="请输入搜索关键词"
  bind:search="onSearch"
/>
```

### 事件监听

`smart-search` 提供了 search 和 cancel 事件。search 事件在用户点击键盘上的搜索按钮触发。cancel 事件在用户点击搜索框右侧取消按钮时触发。

```html
<smart-search
  value="{{ value }}"
  placeholder="请输入搜索关键词"
  show-action
  search-text="搜索"
  action-text="取消"
  bind:search="onSearch"
  bind:cancel="onCancel"
  bind:clear="onClear"
/>
```

### 搜索框内容对齐

通过 `input-align` 属性可以设置搜索框内容的对齐方式。

```html
<smart-search
  value="{{ value }}"
  input-align="center"
  placeholder="请输入搜索关键词"
/>
```

### 禁用搜索框

通过 `disabled` 属性可以将组件设置为禁用状态。

```html
<smart-search disabled value="{{ value }}" placeholder="请输入搜索关键词" />
```

### 自定义按钮

`smart-search` 支持自定义右侧取消按钮，使用名字为 action 的 slot，并设置 use-action-slot 为 true 即可。

```html
<smart-search
  value="{{ value }}"
  label="地址"
  shape="round"
  placeholder="请输入搜索关键词"
  use-action-slot
  bind:change="onChange"
  bind:search="onSearch"
>
  <view slot="action" bind:tap="onClick">搜索</view>
</smart-search>

<smart-search
  value="{{ value }}"
  shape="round"
  placeholder="请输入搜索关键词"
  bind:search="onSearch"
  bind:change="onChange"
>
  <view slot="search-button" bind:tap="onClick">搜索</view>
  <view slot="label"
    >地址<smart-icon class="icon" name="{{icon}}" size="12px"
  /></view>
</smart-search>
```

```css
.searchBtn {
  padding: 0 16px;
}
.icon {
  margin: 0 8px 0 4px;
}
```

```javascript
Page({
  data: {
    value: '',
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
    Toast('搜索' + this.data.value);
  },
  onClick() {
    Toast('搜索' + this.data.value);
  },
});
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| action-text | 取消按钮文字 | _string_ | `Cancel` |
| background | 搜索框背景色 | _string_ | `#f2f2f2` |
| clear-icon | 清除[图标svg字符串](/material/smartui?comId=icon&appType=miniapp)或图片链接 | _string_ | `close` |
| clear-trigger | 显示清除图标的时机，`always` 表示输入框不为空时展示，<br>`focus` 表示输入框聚焦且不为空时展示 | _string_ | `focus` |
| clearable | 是否启用清除控件 | _boolean_ | `true` |
| cursor-spacing | 输入框聚焦时底部与键盘的距离 | _number_ | `0` |
| disabled | 是否禁用输入框 | _boolean_ | `false` |
| error | 是否将输入内容标红 | _boolean_ | `false` |
| focus | 获取焦点 | _boolean_ | `false` |
| input-align | 输入框内容对齐方式，可选值为 `center` `right` | _string_ | `left` |
| label | 搜索框左侧文本 | _string_ | - |
| left-icon | 输入框左侧图标名称或图片链接，可选值见 Icon 组件（如果设置了 use-left-icon-slot，则该属性无效） | _string_ | `search` |
| maxlength | 最大输入长度，设置为 -1 的时候不限制最大长度 | _number_ | `-1` |
| name | 在表单内提交时的标识符 | _string_ | - |
| placeholder | 输入框为空时占位符 | _string_ | - |
| placeholder-style | 指定占位符的样式 | _string_ | - |
| readonly | 是否只读 | _boolean_ | `false` |
| right-icon | 输入框右侧图标名称或图片链接，可选值见 Icon 组件（如果设置了 use-right-icon-slot，则该属性无效） | _string_ | - |
| shape | 形状，可选值为 `round` | _string_ | `square` |
| show-action | 是否在搜索框右侧显示取消按钮 | _boolean_ | `false` |
| use-action-slot | 是否使用 action slot | _boolean_ | `false` |
| use-left-icon-slot | 是否使用输入框左侧图标 slot | _boolean_ | `false` |
| use-right-icon-slot | 是否使用输入框右侧图标 slot | _boolean_ | `false` |
| value | 当前输入的值 | _string \| number_ | - |
| search-text `v2.0.0` | 搜索按钮文字 | _string_ | - |

### Events

| 事件名           | 说明               | 参数                     |
| ---------------- | ------------------ | ------------------------ |
| bind:blur        | 输入框失焦时触发   | -                        |
| bind:cancel      | 取消搜索搜索时触发 | -                        |
| bind:change      | 输入内容变化时触发 | event.detail: 当前输入值 |
| bind:clear       | 点击清空控件时触发 | -                        |
| bind:click-input | 点击搜索区域时触发 | -                        |
| bind:focus       | 输入框聚焦时触发   | -                        |
| bind:search      | 确定搜索时触发     | event.detail: 当前输入值 |

### Slot

| 名称 | 说明 |
| --- | --- |
| action | 自定义搜索框右侧按钮，需要在`use-action-slot`为 true 时才会显示 |
| label | 自定义搜索框左侧文本 |
| left-icon | 自定义输入框左侧图标，需要在`use-left-icon-slot`为 true 时才会显示 |
| right-icon | 自定义输入框右侧图标，需要在`use-right-icon-slot`为 true 时才会显示 |
| search-button `v2.0.0` | 自定义搜索按钮 |

### 外部样式类

| 类名         | 说明           |
| ------------ | -------------- |
| cancel-class | 取消按钮样式类 |
| custom-class | 根节点样式类   |
| field-class  | 搜索框样式类   |
| input-class  | 输入框样式类   |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --search-background-color | _var(--app-B3, #fff)_ | 搜索框背景颜色 |
| --search-body-background-color | _var(--app-B4-N9,rgba(0,0,0,0.05))_ | 搜索内容背景颜色 |
| --search-padding | _12px var(--padding-md, 16px)_ | 搜索框内边距 |
| --search-input-height | _24px_ | 输入框高度 |
| --search-label-padding | _0 5px_ | 标签内边距 |
| --search-label-color | _var(--app-B4_N1, #000)_ | 标签文本颜色 |
| --search-label-font-size | _var(--font-size-md)_ | 标签字体大小 |
| --search-value-font-size | _var(--font-size-md)_ | 输入文字字体大小 |
| --search-left-icon-color | _var(--app-B4_N4, rgba(0,0,0,0.4))_ | 左侧图标颜色 |
| --search-action-padding | _0 var(--padding-md) 0 var(--padding-sm)_ | 操作按钮内边距 |
| --search-action-text-color | _var(--app-B4_N3, rgba(0,0,0,0.5))_ | 操作按钮文本颜色 |
| --search-action-font-size | _var(--font-size-md)_ | 操作按钮字体大小 |
| --search-submit-font-size | _var(--font-size-md)_ | 提交按钮字体大小 |
| --search-submit-color | _var(--app-M1, #3678e3)_ | 提交按钮颜色 |
| --search-btn-hover-color | _var(--app-B4_N9, rgba(0,0,0,0.05))_ | 按钮悬停颜色 |
| --search-submit-line-width | _1px_ | 提交按钮线宽度 |
| --search-submit-line-height | _12px_ | 提交按钮线高度 |
| --search-btn-hover-opacity | _0.4_ | 按钮悬停透明度 |
