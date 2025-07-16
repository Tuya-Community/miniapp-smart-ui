---
category: 数据录入
---

# Cascader 级联选择

### 介绍

级联选择框，用于多层级数据的选择，典型场景为省市区选择。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-cascader": "@tuya-miniapp/smart-ui/lib/cascader/index"
}
```

## 代码演示

### 基础用法

级联选择组件可以搭配 Field 和 Popup 组件使用，示例如下：

```html
<smart-field
  value="{{ fieldValue }}"
  is-link
  readonly
  label="地区"
  placeholder="请选择所在地区"
  bind:tap="onClick"
/>
<smart-popup show="{{ show }}" round position="bottom">
  <smart-cascader
    ty:if="{{ show }}"
    value="{{ cascaderValue }}"
    title="请选择所在地区"
    options="{{ options }}"
    bind:close="onClose"
    bind:finish="onFinish"
  />
</smart-popup>
```

```js

const options = [
  {
    text: '浙江省',
    value: '330000',
    children: [{ text: '杭州市', value: '330100' }],
  },
  {
    text: '江苏省',
    value: '320000',
    children: [{ text: '南京市', value: '320100' }],
  },
];

Page({
  data: {
    show: false,
    options,
    fieldValue: '',
    cascaderValue: '',
  },

  onClick() {
    this.setData({
      show: true,
    });
  },

  onClose() {
    this.setData({
      show: false,
    });
  },

  onFinish(e) {
    const { selectedOptions, value } = e.detail;
    const fieldValue = selectedOptions
        .map((option) => option.text || option.name)
        .join('/');
    this.setData({
      fieldValue,
      cascaderValue: value,
    })
  },
});
```

### 自定义颜色

通过 `active-color` 属性来设置选中状态的高亮颜色。

```html
<smart-cascader
  value="{{ cascaderValue }}"
  title="请选择所在地区"
  options="{{ options }}"
  active-color="#ee0a24"
  bind:close="onClose"
  bind:finish="onFinish"
/>
```

### 异步加载选项

可以监听 `change` 事件并动态设置 `options`，实现异步加载选项。

```html
<smart-field
  value="{{ fieldValue }}"
  is-link
  readonly
  label="地区"
  placeholder="请选择所在地区"
  bind:tap="onClick"
/>
<smart-popup show="{{ show }}" round position="bottom">
  <smart-cascader
    ty:if="{{ show }}"
    value="{{ cascaderValue }}"
    title="请选择所在地区"
    options="{{ options }}"
    bind:close="onClose"
    bind:change="onChange"
    bind:finish="onFinish"
  />
</smart-popup>
```

```js
Page({
  data: {
    options: [
      {
        text: '浙江省',
        value: '330000',
        children: [],
      }
    ];
  },
  onChange(e) {
    const { value } = e.detail;
    if (value === this.data.options[0].value) {
      setTimeout(() => {
        const children = [
          { text: '杭州市', value: '330100' },
          { text: '宁波市', value: '330200' },
        ];
        this.setData({
          'options[0].children': children,
        })
      }, 500);
    }
  },
});

```

## API

### Props

| 参数            | 说明                                                           | 类型               | 默认值    |
| --------------- | -------------------------------------------------------------- | ------------------ | --------- |
| active-color    | 选中状态的高亮颜色                                             | _string_           | `#1989fa` |
| close-icon      | 关闭图标svg值或图片链接，等同于 Icon 组件的 [name 属性](/material/smartui?comId=icon&appType=miniapp) | _string_           | `cross`   |
| closeable       | 是否显示关闭图标                                               | _boolean_          | `true`    |
| ellipsis        | 是否省略过长的标题文字, 关闭后文字过长会出现横向滚动           | _boolean_          | `true`    |
| options         | 可选项数据源                                                   | _CascaderOption[]_ | `[]`      |
| placeholder     | 未选中时的提示文案                                             | _string_           | `请选择`  |
| show-header     | 是否展示标题栏                                                 | _boolean_          | `true`    |
| swipe-threshold | 滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动 | _number_           | `5`       |
| swipeable       | 是否开启手势左右滑动切换                                       | _boolean_          | `false`   |
| title           | 顶部标题                                                       | _string_           | -         |
| use-title-slot  | 是否使用自定义标题的插槽                                       | _boolean_          | `false`   |
| value           | 选中项的值                                                     | _string \| number_ | -         |

### CascaderOption 数据结构

`options` 属性是一个由对象构成的数组，数组中的每个对象配置一个可选项，对象可以包含以下值：

| 键名      | 说明                     | 类型                        |
| --------- | ------------------------ | --------------------------- |
| className | 为对应列添加额外的 class | _string \| Array \| object_ |
| color     | 选项文字颜色             | _string_                    |
| disabled  | 是否禁用选项             | _boolean_                   |
| options   | 子选项列表               | _CascaderOption[]_          |
| text      | 选项文字（必填）         | _string_                    |
| value     | 选项对应的值（必填）     | _string \| number_          |

### Events

| 事件           | 说明                   | 回调参数                                                                                         |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| bind:change    | 选中项变化时触发       | event.detail：_{ value: string \| number, selectedOptions: CascaderOption[], tabIndex: number }_ |
| bind:click-tab | 点击标签时触发         | event.detail：_{ tabIndex: number, title: string }_                                              |
| bind:close     | 点击关闭图标时触发     | -                                                                                                |
| bind:finish    | 全部选项选择完成后触发 | event.detail：_{ value: string \| number, selectedOptions: CascaderOption[], tabIndex: number }_ |

### Slots

| 名称  | 说明           | 参数 |
| ----- | -------------- | ---- |
| title | 自定义顶部标题 | -    |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                                  | 默认值                                   | 描述                                     |
| ------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| --cascader-header-height              | _48px_                                   | 级联选择器头部高度                       |
| --cascader-header-padding             | _0 16px_                                 | 级联选择器头部内边距                     |
| --cascader-title-font-size            | _16px_                                   | 级联选择器标题字体大小                   |
| --cascader-title-line-height          | _20px_                                   | 级联选择器标题行高                       |
| --cascader-close-icon-size            | _22px_                                   | 级联选择器关闭图标大小                   |
| --cascader-close-icon-color           | _#c8c9cc_                                | 级联选择器关闭图标颜色                   |
| --cascader-selected-icon-size         | _18px_                                   | 级联选择器选中图标大小                   |
| --cascader-tabs-height                | _48px_                                   | 级联选择器标签栏高度                     |
| --cascader-active-color               | _#1989fa_                                | 级联选择器激活项颜色                     |
| --cascader-options-height             | _384px_                                  | 级联选择器选项高度                       |
| --cascader-option-disabled-color      | _#c8c9cc_                                | 级联选择器禁用选项颜色                   |
| --cascader-tab-color                  | _var(--app-B6-N1, rgba(0, 0, 0, 1))_     | 级联选择器标签颜色                       |
| --cascader-unselected-tab-color       | _#969799_                                | 级联选择器未选中标签颜色                 |
| --cascader-tab-inactive-color         | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_   | 级联选择器标签未激活颜色                 |
| --cascader-text-color                 | _var(--app-B6-N5, rgba(0, 0, 0, 0.3))_   | 级联选择器文本颜色                       |