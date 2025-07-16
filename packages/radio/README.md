---
category: 数据录入
---

# Radio 单选框

### 介绍

在一组备选项中进行单选。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-radio": "@tuya-miniapp/smart-ui/lib/radio/index",
  "smart-radio-group": "@tuya-miniapp/smart-ui/lib/radio-group/index"
}
```

## 代码演示

### 基础用法

通过`value`绑定值当前选中项的 name 。

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" custom-class="demo-radio-inline" />
  <smart-radio name="2" custom-class="demo-radio-inline" />
</smart-radio-group>
```

```css
.demo-radio-inline {
  margin: 10px 0 0 20px;
  display: inline-block !important;
}
```

```js
Page({
  data: {
    radio: '1',
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
});
```

### 禁用状态

通过`disabled`属性禁止选项切换，在`Radio`上设置`diabled`可以禁用单个选项。

```html
<smart-radio-group value="{{ radio }}" disabled bind:change="onChange">
  <smart-radio name="1" custom-class="demo-radio-inline" />
  <smart-radio name="2" custom-class="demo-radio-inline" />
</smart-radio-group>
```

### 自定义形状

将 `shape` 属性设置为 `square`，单选框的形状会变成方形。

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" shape="square" custom-class="demo-radio-inline" />
  <smart-radio name="2" shape="square" custom-class="demo-radio-inline" />
</smart-radio-group>
```

### 自定义颜色

通过 `checked-color` 属性设置选中状态的图标颜色。

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" custom-class="demo-radio-inline" checked-color="#10D0D0" />
  <smart-radio name="2" custom-class="demo-radio-inline" checked-color="#10D0D0" />
</smart-radio-group>
```

### 自定义大小

通过 `icon-size` 属性可以自定义图标的大小。

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" icon-size="28px" custom-class="demo-radio-inline" />
  <smart-radio name="2" icon-size="28px" custom-class="demo-radio-inline" />
</smart-radio-group>
```

### 自定义文本

通过 slot 插槽子节点可以自定义文本内容。

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1">Radio 单选框 1</smart-radio>
  <smart-radio name="2">Radio 单选框 2</smart-radio>
</smart-radio-group>
```

### 水平排列

将`direction`属性设置为`horizontal`后，单选框组会变成水平排列。

```html
<smart-radio-group
  value="{{ radio }}"
  bind:change="onChange"
  direction="horizontal"
>
  <smart-radio name="1">Radio 单选框 1</smart-radio>
  <smart-radio name="2">Radio 单选框 2</smart-radio>
</smart-radio-group>
```

### 自定义图标

通过 `icon` 插槽自定义图标，需要设置 `use-icon-slot` 属性。

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio use-icon-slot value="{{ radio }}" name="1">
    自定义图标
    <image slot="icon" src="{{ radio === '1' ? icon.active : icon.normal }}" />
  </smart-radio>
  <smart-radio use-icon-slot value="{{ radio }}" name="2">
    自定义图标
    <image slot="icon" src="{{ radio === '2' ? icon.active : icon.normal }}" />
  </smart-radio>
</smart-radio-group>
```

```js
Page({
  data: {
    radio: true,
    icon: {
      normal: 'https://images.tuyacn.com/content-platform/hestia/1729664215ebd89f13e54.png',
      active: 'https://images.tuyacn.com/content-platform/hestia/1730877912e76cbdb7563.png',
    },
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
});
```

### 禁用文本点击

通过设置`label-disabled`属性可以禁用单选框文本点击。

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-radio name="1" label-disabled>单选框 1</smart-radio>
  <smart-radio name="2" label-disabled>单选框 2</smart-radio>
</smart-radio-group>
```

### 与 Cell 组件一起使用

此时你需要再引入`Cell`和`CellGroup`组件。

```html
<smart-radio-group value="{{ radio }}" bind:change="onChange">
  <smart-cell-group>
    <smart-cell title="单选框 1" clickable data-name="1" bind:click="onClick">
      <smart-radio slot="right-icon" name="1" />
    </smart-cell>
    <smart-cell title="单选框 2" clickable data-name="2" bind:click="onClick">
      <smart-radio slot="right-icon" name="2" />
    </smart-cell>
  </smart-cell-group>
</smart-radio-group>
```

```js
Page({
  data: {
    radio: '1',
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
});
```


### 阻止默认的UI更新行为

假如你的 `UI更新` 需要在特定情况下才允许更新，如 确认框/接口行为等才允许更新，可以开启 `prevent-default` 这个选项。

```html
<smart-radio-group prevent-default value="{{ radio }}" bind:change="onChange">
    <smart-radio name="1">1</smart-radio>
    <smart-radio name="2">2</smart-radio>
  </smart-radio-group>
```

```js
Page({
  data: {
    radio: '1',
  },

  onChange(event) {
    ty.showModal({
      content: `onChange name: ${event.detail}`,
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          this.setData({
            radio: event.detail
          })
        }
      }
    })
  },
});
```

## API

### RadioGroup Props

| 参数               | 说明                            | 类型      | 默认值     |
| ------------------ | ------------------------------- | --------- | ---------- |
| direction | 排列方向，可选值为 `horizontal` | _string_  | `vertical` |
| disabled           | 是否禁用所有单选框              | _boolean_ | `false`    |
| name               | 在表单内提交时的标识符          | _string_  | -          |
| value              | 当前选中项的标识符              | _any_     | -          |
| prevent-default `v2.3.8`| 阻止默认的UI更新行为|_boolean_|`false`    |

### Radio Props

| 参数           | 说明                      | 类型               | 默认值    |
| -------------- | ------------------------- | ------------------ | --------- |
| checked-color  | 选中状态颜色              | _string_           | `#1989fa` |
| disabled       | 是否为禁用状态            | _boolean_          | `false`   |
| icon-size      | 图标大小，默认单位为`px`  | _string \| number_ | `24px`    |
| label-disabled | 是否禁用文本内容点击      | _boolean_          | `false`   |
| label-position | 文本位置，可选值为 `left` | _string_           | `right`   |
| name           | 标识符                    | _string_           | -         |
| shape          | 形状，可选值为 `square`   | _string_           | `round`   |
| use-icon-slot  | 是否使用 icon 插槽        | _boolean_          | `false`   |

### Radio Event

| 事件名      | 说明                     | 回调参数          |
| ----------- | ------------------------ | ----------------- |
| bind:change | 当绑定值变化时触发的事件 | 当前选中项的 name |

### Radio 外部样式类

| 类名         | 说明           |
| ------------ | -------------- |
| custom-class | 根节点样式类   |
| icon-class   | 图标样式类     |
| label-class  | 描述信息样式类 |

### RadioGroup Event

| 事件名      | 说明                     | 回调参数          |
| ----------- | ------------------------ | ----------------- |
| bind:change | 当绑定值变化时触发的事件 | 当前选中项的 name |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --radio-size                  | _24px_                                 | 单选框的大小 |
| --radio-border-color          | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_ | 单选框的边框颜色 |
| --radio-border-radius         | _4px_                                  | 单选框的边框圆角 |
| --radio-transition-duration   | _0.2s_                                 | 单选框的过渡持续时间 |
| --radio-label-size            | _12px_                                 | 单选框标签的字体大小 |
| --radio-label-margin          | _10px_                                 | 单选框标签的外边距 |
| --radio-label-color           | _var(--app-B6-N1, rgba(0, 0, 0, 1))_   | 单选框标签的字体颜色 |
| --radio-checked-icon-color    | _var(--app-M4, #1989fa)_               | 单选框选中状态的图标颜色 |
| --radio-disabled-label-color  | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_ | 单选框禁用状态的标签颜色 |
| --radio-disabled-opacity      | _0.3_                                  | 单选框禁用状态的透明度 |
