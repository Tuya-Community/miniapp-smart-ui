---
category: 展示
---

# Collapse 折叠面板

### 介绍

将一组内容放置在多个折叠面板中，点击面板的标题可以展开或收缩其内容。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-collapse": "@tuya-miniapp/smart-ui/lib/collapse/index",
  "smart-collapse-item": "@tuya-miniapp/smart-ui/lib/collapse-item/index"
}
```

## 代码演示

### 基础用法

通过`value`控制展开的面板列表，`activeNames`为数组格式。

```html
<smart-collapse value="{{ activeNames }}" bind:change="onChange">
  <smart-collapse-item title="标题1" name="1">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
  <smart-collapse-item title="标题2" name="2">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
  <smart-collapse-item title="标题3" name="3" disabled>
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
</smart-collapse>
```

```javascript
Page({
  data: {
    activeNames: ['1'],
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
});
```

### 手风琴

通过`accordion`可以设置为手风琴模式，最多展开一个面板，此时`activeName`为字符串格式。

```html
<smart-collapse accordion value="{{ activeName }}" bind:change="onChange">
  <smart-collapse-item title="标题1" name="1">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
  <smart-collapse-item title="标题2" name="2">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
  <smart-collapse-item title="标题3" name="3">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
</smart-collapse>
```

```javascript
Page({
  data: {
    activeName: '1',
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
});
```

### 事件监听

`smart-collapse` 提供了 `change`, `open` 和 `close` 事件。`change` 事件在面板切换时触发，`open` 事件在面板展开时触发，`close` 事件在面板关闭时触发。

```html
<smart-collapse
  value="{{ activeNames }}"
  bind:change="onChange"
  bind:open="onOpen"
  bind:close="onClose"
>
  <smart-collapse-item title="标题1" name="1">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
  <smart-collapse-item title="标题2" name="2">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
  <smart-collapse-item title="标题3" name="3">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
</smart-collapse>
```

```javascript
Page({
  data: {
    activeNames: ['1'],
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onOpen(event) {
    Toast(`展开: ${event.detail}`);
  },
  onClose(event) {
    Toast(`关闭: ${event.detail}`);
  },
});
```

### 自定义标题内容

```html
<smart-collapse value="{{ activeNames }}" bind:change="onChange">
  <smart-collapse-item name="1">
    <view slot="title">标题1<smart-icon name="question-o" /></view>
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
  <smart-collapse-item title="标题2" name="2" icon="shop-o">
    代码是写出来给人看的，附带能在机器上运行
  </smart-collapse-item>
</smart-collapse>
```

```javascript
Page({
  data: {
    activeNames: ['1'],
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
});
```

## API

### Collapse Props

| 参数      | 说明                | 类型                                                                   | 默认值  |
| --------- | ------------------- | ---------------------------------------------------------------------- | ------- |
| accordion | 是否开启手风琴模式  | _boolean_                                                              | `false` |
| border    | 是否显示外边框      | _boolean_                                                              | `true`  |
| value     | 当前展开面板的 name | 非手风琴模式：_(string \| number)[]_<br>手风琴模式：_string \| number_ | -       |

### Collapse Event

| 事件名 | 说明           | 参数                            |
| ------ | -------------- | ------------------------------- |
| change | 切换面板时触发 | activeNames: _string \| Array_  |
| close  | 关闭面板时触发 | currentName: _string \| number_ |
| open   | 展开面板时触发 | currentName: _string \| number_ |

### CollapseItem Props

| 参数      | 说明                                                       | 类型               | 默认值  |
| --------- | ---------------------------------------------------------- | ------------------ | ------- |
| border    | 是否显示内边框                                             | _boolean_          | `true`  |
| clickable | 是否开启点击反馈                                           | _boolean_          | `false` |
| disabled  | 是否禁用面板                                               | _boolean_          | `false` |
| icon      | 标题栏左侧图标svg值或图片链接，可选值见 [Icon 组件](/material/smartui?comId=icon&appType=miniapp) | _string_           | -       |
| is-link   | 是否展示标题栏右侧箭头并开启点击反馈                       | _boolean_          | `true`  |
| label     | 标题栏描述信息                                             | _string_           | -       |
| name      | 唯一标识符，默认为索引值                                   | _string \| number_ | `index` |
| size      | 标题栏大小，可选值为`large`                                | _string_           | -       |
| title     | 标题栏左侧内容                                             | _string \| number_ | -       |
| value     | 标题栏右侧内容                                             | _string \| number_ | -       |

### CollapseItem Slot

| 名称       | 说明                                                                     |
| ---------- | ------------------------------------------------------------------------ |
| -          | 面板内容                                                                 |
| icon       | 自定义`icon`                                                             |
| right-icon | 自定义右侧按钮，默认是`arrow`, 需要将 `is-link` 设置为 `false`, 才会生效 |
| title      | 自定义`title`                                                            |
| value      | 自定义显示内容                                                           |

### Collapse 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### CollapseItem 外部样式类

| 类名          | 说明         |
| ------------- | ------------ |
| content-class | 内容样式类   |
| custom-class  | 根节点样式类 |

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