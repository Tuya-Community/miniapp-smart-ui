---
category: 数据录入
---

# Checkbox 复选框

### 介绍

在一组备选项中进行多选。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-checkbox": "@tuya-miniapp/smart-ui/lib/checkbox/index",
  "smart-checkbox-group": "@tuya-miniapp/smart-ui/lib/checkbox-group/index"
}
```

## 代码演示

### 基础用法

通过`value`绑定复选框的勾选状态。

```html
<smart-checkbox
  value="{{ checked }}"
  custom-class="demo-checkbox-inline"
  bind:change="onChange"
/>
<smart-checkbox
  value="{{ checked ? false : true }}"
  custom-class="demo-checkbox-inline"
  bind:change="onChange2"
/>
```

```js
Page({
  data: {
    checked: true,
  },

  onChange(event) {
    this.setData({ checked: event.detail });
  },

  onChange2(event) {
    this.setData({ checked: !event.detail });
  },
});
```

### 禁用状态

通过设置`disabled`属性可以禁用复选框。

```html
<smart-checkbox
  disabled
  value="{{ false }}"
  custom-class="demo-checkbox-inline"
/>
<smart-checkbox
  disabled
  value="{{ true }}"
  custom-class="demo-checkbox-inline"
/>
```

### 自定义形状

将`shape`属性设置为`square`，复选框的形状会变成方形。

```html
<smart-checkbox
  value="{{ checked }}"
  shape="square"
  custom-class="demo-checkbox-inline"
  bind:change="onChange"
/>
<smart-checkbox
  value="{{ checked ? false : true }}"
  shape="square"
  custom-class="demo-checkbox-inline"
  bind:change="onChange2"
/>
```

### 自定义颜色

通过`checked-color`属性可以自定义选中状态下的图标颜色。

```html
<smart-checkbox
  value="{{ checked }}"
  checked-color="#10D0D0"
  custom-class="demo-checkbox-inline"
  bind:change="onChange"
/>
<smart-checkbox
  value="{{ checked ? false : true }}"
  checked-color="#10D0D0"
  custom-class="demo-checkbox-inline"
  bind:change="onChange2"
/>
```

### 自定义大小

通过`icon-size`属性可以自定义图标的大小。

```html
<smart-checkbox
  icon-size="28px"
  value="{{ checked }}"
  custom-class="demo-checkbox-inline"
  bind:change="onChange"
/>
<smart-checkbox
  icon-size="28px"
  value="{{ checked ? false : true }}"
  custom-class="demo-checkbox-inline"
  bind:change="onChange2"
/>
```

## 展示文本

通过 slot 子节点可展示文本

<smart-checkbox
  value="{{ checked }}"
  bind:change="onChange"
>
  自定义文本
</smart-checkbox>

### 自定义图标

通过 `icon` 配合 `use-icon-slot` 插槽自定义图标。

```html
<smart-checkbox
  use-icon-slot
  value="{{ checked }}"
  bind:change="onChange"
>
  自定义图标
  <image
    slot="icon"
    class="icon"
    mode="widthFix"
    src="{{ checked ? activeIcon : inactiveIcon }}"
  />
</smart-checkbox>
```

```js
Page({
  data: {
    checked: true,
    activeIcon: 'https://images.tuyacn.com/content-platform/hestia/1730877912e76cbdb7563.png',
    inactiveIcon: '',
  },

  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
});
```

### 禁用文本点击

通过设置`label-disabled`属性可以禁用复选框文本点击。

```html
  <smart-checkbox
  label-disabled
  value="{{ checked }}"
  bind:change="onChange"
>
  Checkbox 复选框
</smart-checkbox>
```

### 复选框组

需要与`smart-checkbox-group`一起使用，选中值是一个数组，通过`value`绑定在`smart-checkbox-group`上，数组中的项即为选中的`Checkbox`的`name`属性设置的值。

```html
<smart-checkbox-group value="{{ result }}" bind:change="onChange">
  <smart-checkbox name="a">Checkbox 复选框 a</smart-checkbox>
  <smart-checkbox name="b">Checkbox 复选框 b</smart-checkbox>
  <smart-checkbox name="c">Checkbox 复选框 c</smart-checkbox>
</smart-checkbox-group>
```

```javascript
Page({
  data: {
    result: ['a', 'b'],
  },

  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },
});
```

### 限制最大可选数

```html
<smart-checkbox-group value="{{ result }}" bind:change="onChange" max="{{ 2 }}">
  <smart-checkbox name="a">复选框 a</smart-checkbox>
  <smart-checkbox name="b">复选框 b</smart-checkbox>
  <smart-checkbox name="c">复选框 c</smart-checkbox>
</smart-checkbox-group>
```

### 搭配单元格组件使用

此时你需要再引入`Cell`和`CellGroup`组件，并通过 checkbox 的 toggle 方法手动触发切换。

```html
<smart-checkbox-group value="{{ result }}" bind:change="onChange">
  <smart-cell-group>
    <smart-cell
      wx:for="{{ list }}"
      wx:key="index"
      title="复选框 {{ item }}"
      value-class="value-class"
      clickable
      data-index="{{ index }}"
      bind:click="toggle"
    >
      <smart-checkbox
        catch:tap="noop"
        class="checkboxes-{{ index }}"
        name="{{ item }}"
      />
    </smart-cell>
  </smart-cell-group>
</smart-checkbox-group>
```

```js
Page({
  data: {
    list: ['a', 'b', 'c'],
    result: ['a', 'b'],
  },

  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() {},
});
```

```css
.value-class {
  flex: none !important;
}
```

## API

### Checkbox Props

| 参数           | 说明                            | 类型               | 默认值    |
| -------------- | ------------------------------- | ------------------ | --------- |
| checked-color  | 选中状态颜色                    | _string_           | `#1989fa` |
| disabled       | 是否禁用单选框                  | _boolean_          | `false`   |
| icon-size      | icon 大小                       | _string \| number_ | `24px`    |
| label-disabled | 是否禁用单选框内容点击          | _boolean_          | `false`   |
| label-position | 文本位置，可选值为 `left`       | _string_           | `right`   |
| name           | 标识 Checkbox 名称              | _string_           | -         |
| shape          | 形状，可选值为 `round` `square` | _string_           | `round`   |
| use-icon-slot  | 是否使用 icon slot              | _boolean_          | `false`   |
| value          | 是否为选中状态                  | _boolean_          | `false`   |

### CheckboxGroup Props

| 参数               | 说明                            | 类型      | 默认值        |
| ------------------ | ------------------------------- | --------- | ------------- |
| direction | 排列方向，可选值为 `horizontal` | _string_  | `vertical`    |
| disabled           | 是否禁用所有单选框              | _boolean_ | `false`       |
| max                | 设置最大可选数                  | _number_  | `0`（无限制） |
| name               | 在表单内提交时的标识符          | _string_  | -             |
| value              | 所有选中项的 name               | _Array_   | -             |

### Checkbox Event

| 事件名      | 说明                     | 回调参数     |
| ----------- | ------------------------ | ------------ |
| bind:change | 当绑定值变化时触发的事件 | 当前组件的值 |

### Checkbox 外部样式类

| 类名         | 说明           |
| ------------ | -------------- |
| custom-class | 根节点样式类   |
| icon-class   | 图标样式类     |
| label-class  | 描述信息样式类 |

### CheckboxGroup Event

| 事件名      | 说明                     | 回调参数     |
| ----------- | ------------------------ | ------------ |
| bind:change | 当绑定值变化时触发的事件 | 当前组件的值 |

### Checkbox Slot

| 名称 | 说明       |
| ---- | ---------- |
| -    | 自定义文本 |
| icon | 自定义图标 |

### Checkbox 方法

通过 selectComponent 可以获取到 checkbox 实例并调用实例方法。

| 方法名 | 参数 | 返回值 | 介绍         |
| ------ | ---- | ------ | ------------ |
| toggle | -    | -      | 切换选中状态 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --checkbox-size               | _24px_                                 | 复选框的大小 |
| --checkbox-border-color       | _var(--app-B6-N6, rgba(0, 0, 0, 0.2))_                               | 复选框的边框颜色 |
| --checkbox-border-radius      | _4px_                                  | 复选框的边框圆角 |
| --checkbox-transition-duration| _0.2s_                                 | 复选框的过渡持续时间 |
| --checkbox-label-size         | _12px_                                 | 复选框标签的字体大小 |
| --checkbox-label-margin       | _10px_                                 | 复选框标签的外边距 |
| --checkbox-label-color        | _var(--app-B6-N1, rgba(0, 0, 0, 1))_                               | 复选框标签的颜色 |
| --checkbox-checked-icon-color | _@M4_                                  | 复选框选中状态的图标颜色 |
| --checkbox-disabled-label-color| _var(--app-B6-N1, rgba(0, 0, 0, 1))_                              | 禁用状态下复选框标签的颜色 |
| --checkbox-disabled-opacity   | _0.3_                    | 禁用状态下复选框的透明度 |
