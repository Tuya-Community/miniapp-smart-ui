---
category: 反馈
---

# Switch 开关

### 介绍

用于在打开和关闭状态之间进行切换。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-switch": "@tuya-miniapp/smart-ui/lib/switch/index"
}
```

## 代码演示

### 基础用法

```html
<smart-switch checked="{{ checked }}" bind:change="onChange" />
<smart-switch checked="{{ !checked }}" bind:change="onChange" />
```

```javascript
Page({
  data: {
    checked: true,
  },

  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
});
```

### 禁用状态

```html
<smart-switch checked="{{ checked }}" disabled />
```

### 加载中

```html
<smart-switch checked="{{ checked }}" loading />
```

### 自定义大小

`size` 属性可以设置组件的大小。

```html
<smart-switch checked="{{ checked }}" size="24px" />
```

### 自定义颜色

设置 `active-color` 可以设置选择后的颜色，`inactive-color` 可以设置非选择后的颜色

```html
<smart-switch
  checked="{{ checked }}"
  active-color="#07c160"
  inactive-color="#ee0a24"
/>
```

### 渐变色 `v2.5.0`

所有 CSS background 可以实现的属性， `active-color` 和 `inactive-color` 都可以实现

```html
<smart-switch
  checked="{{ checked }}"
  active-color="linear-gradient(to right, #ff7e5f, #987AFF)"
  inactive-color="linear-gradient(to right, #407e5f, #841AFF)"
/>
```

### 异步控制

```html
<smart-switch checked="{{ checked }}" bind:change="onChange" />
```

```js
Page({
  data: {
    checked: true,
  },

  onChange({ detail }) {
    wx.showModal({
      title: '提示',
      content: '是否切换开关？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ checked2: detail });
        }
      },
    });
  },
});
```

### 阻止冒泡

`stop-click-propagation` 属性可以阻止冒泡。

```html
<smart-switch checked="{{ checked }}" stop-click-propagation bind:change="onChange" />
```

### 列表使用

```html
<smart-cell-group>
  <smart-cell title="标题">
    <smart-switch
      checked="{{ checked }}"
      bind:change="onChange"
    />    
  </smart-cell>
</smart-cell-group>
```

## API

### Props

| 参数                            | 说明                   | 类型      | 默认值    |
| ------------------------------- | ---------------------- | --------- | --------- |
| active-color                    | 打开时的背景色         | _string_  | `#1989fa` |
| active-value                    | 打开时的值             | _any_     | `true`    |
| checked                         | 开关选中状态           | _any_     | `false`   |
| disabled                        | 是否为禁用状态         | _boolean_ | `false`   |
| inactive-color                  | 关闭时的背景色         | _string_  | `#fff`    |
| inactive-value                  | 关闭时的值             | _any_     | `false`   |
| loading                         | 是否为加载状态         | _boolean_ | `false`   |
| name                            | 在表单内提交时的标识符 | _string_  | -         |
| size                            | 开关尺寸               | _string_  | `30px`    |
| stop-click-propagation `v1.0.2` | 是否阻止冒泡           | _boolean_ | `false`   |

### Events

| 事件名      | 说明             | 参数                       |
| ----------- | ---------------- | -------------------------- |
| bind:change | 开关状态切换回调 | event.detail: 是否选中开关 |

### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |
| node-class   | 圆点样式类   |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --switch-width | _1.5338em_ | 开关宽度 |
| --switch-height | _0.867em_ | 开关高度 |
| --switch-node-size | _0.867em_ | 开关节点大小 |
| --switch-node-z-index | _1_ | 开关节点层级 |
| --switch-node-background-color | _#fff_ | - |
| --switch-node-box-shadow | _0 3px 1px 0 rgba(0, 0, 0, 0.05),_ | 开关节点阴影 |
| --switch-background-color | _var(--app-B4-N6, rgba(0, 0, 0, 0.2))_ | 开关背景颜色 |
| --switch-on-background-color | _#1989fa_ | 开关开启时背景颜色 |
| --switch-transition-duration | _0.3s_ | 开关过渡持续时间 |
| --switch-disabled-opacity | _0.4_ | 开关禁用时不透明度 |
| --switch-border `@deprecated v2.5.0` | _0.08em solid rgba(0, 0, 0, 0.1)_ | 开关边框 |
| --switch-node-on-background-color `v2.4.0` | _var(--switch-node-background-color, #fff)_ | 开启时圆球的背景色 |
| --switch-padding `v2.5.0` | _0.08em_ | 内部边距 |
| --switch-label-font-size | `12px` | 文字大小 |
| --switch-label-active-color | `#fff` | 开时文字颜色 |
| --switch-label-inactive-color | `#fff` | 关时文字颜色 |