---
category: 布局
---

# DropdownMenu 下拉菜单

### 介绍

向下弹出的菜单列表。

### 引入

在`app.json`或`index.json`中引入组件，默认为`ES6`版本，`ES5`引入方式参见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-dropdown-menu": "@tuya-miniapp/smart-ui/lib/dropdown-menu/index",
  "smart-dropdown-item": "@tuya-miniapp/smart-ui/lib/dropdown-item/index"
}
```

## 代码演示

### 基础用法

```html
<smart-dropdown-menu>
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <smart-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</smart-dropdown-menu>
```

```js
Page({
  data: {
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
  },
});
```

### 自定义菜单内容

```html
<smart-dropdown-menu>
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <smart-dropdown-item id="item" title="{{ itemTitle }}">
    <smart-cell title="{{ switchTitle1 }}" title-style="{{ switch1 ? 'color: #3678E3;' : '' }}">
      <smart-switch
        slot="right-icon"
        size="24px"
        style="height: 26px"
        checked="{{ switch1 }}"
        active-color="#3678E3"
        bind:change="onSwitch1Change"
      />
    </smart-cell>
    <smart-cell title="{{ switchTitle2 }}" title-style="{{ switch2 ? 'color: #3678E3;' : '' }}">
      <smart-switch
        slot="right-icon"
        size="24px"
        style="height: 26px"
        checked="{{ switch2 }}"
        active-color="#3678E3"
        bind:change="onSwitch2Change"
      />
    </smart-cell>
    <view style="padding: 5px 16px;">
      <smart-button type="danger" block round bind:click="onConfirm">
        确认
      </smart-button>
    </view>
  </smart-dropdown-item>
</smart-dropdown-menu>
```

```js
Page({
  data: {
    switchTitle1: '包邮',
    switchTitle2: '团购',
    itemTitle: '筛选',
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    value1: 0,
  },

  onConfirm() {
    this.selectComponent('#item').toggle();
  },

  onSwitch1Change({ detail }) {
    this.setData({ switch1: detail });
  },

  onSwitch2Change({ detail }) {
    this.setData({ switch2: detail });
  },
});
```

### 自定义选中状态颜色

```html
<smart-dropdown-menu active-color="#1989fa">
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <smart-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</smart-dropdown-menu>
```

### 向上展开

```html
<smart-dropdown-menu direction="up">
  <smart-dropdown-item value="{{ value1 }}" options="{{ option1 }}" />
  <smart-dropdown-item value="{{ value2 }}" options="{{ option2 }}" />
</smart-dropdown-menu>
```

### 禁用菜单

```html
<smart-dropdown-menu>
  <smart-dropdown-item value="{{ value1 }}" disabled options="{{ option1 }}" />
  <smart-dropdown-item value="{{ value2 }}" disabled options="{{ option2 }}" />
</smart-dropdown-menu>
```

### 异步打开/关闭

通过 `before-toggle` 事件可以在下拉菜单打开或者关闭前执行特定的逻辑，实现状态变更前校验、异步打开/关闭的目的。  
`scroll-style` `v2.5.0` 当弹框需要滚动时，可以设置此属性，给定一个高度即可。

```html
<smart-dropdown-menu>
  <smart-dropdown-item scroll-style="height: 120px;" value="{{ value1 }}" options="{{ option1 }}" use-before-toggle bind:before-toggle="onBeforeChange" />
</smart-dropdown-menu>
```

```js
Page({
  data: {
    value1: 0,
     option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
  },
  onBeforeChange({ detail: { status, callback }}) {
    wx.showModal({
      title: '异步打开/关闭',
      content: `确定要${status ? '打开' : '关闭'}下拉菜单吗？`,
      success: (res) => {
        if (res.confirm) {
          callback(true)
        } else if (res.cancel) {
          callback(false)
        }
      },
    })
  }
});
```

## API

### DropdownMenu Props

| 参数                   | 说明                           | 类型      | 默认值    |
| ---------------------- | ------------------------------ | --------- | --------- |
| active-color           | 菜单标题和选项的选中态颜色     | _string_  | `#3678E3` |
| triangle-color `v2.0.0` | 箭头未选中状态下的颜色        | _string_  | `#CCCCCC` |
| close-on-click-outside | 是否在点击外部 menu 后关闭菜单 | _boolean_ | `true`    |
| close-on-click-overlay | 是否在点击遮罩层后关闭菜单     | _boolean_ | `true`    |
| direction              | 菜单展开方向，可选值为 up      | _string_  | `down`    |
| duration               | 动画时长，单位毫秒            | _number_  | `200`     |
| overlay                | 是否显示遮罩层                | _boolean_ | `true`    |
| safe-area-tab-bar      | 是否留出底部 tabbar 安全距离   | _boolean_ | `false`   |
| z-index                | 菜单栏 z-index 层级          | _number_  | `10`      |

### DropdownItem Props

| 参数              | 说明                                                   | 类型               | 默认值         |
| ----------------- | ------------------------------------------------------ | ------------------ | -------------- |
| disabled          | 是否禁用菜单                                           | _boolean_          | `false`        |
| options           | 选项数组                                               | _Option[]_         | `[]`           |
| popup-style       | 自定义弹出层样式                                       | _string_           | -              |
| title             | 菜单项标题                                             | _string_           | 当前选中项文字 |
| title-class       | 标题额外类名，建议使用自定义样式 item-title-class 代替 | _string_           | -              |
| use-before-toggle | 是否开启下拉菜单打开或者关闭前校验                     | _boolean_          | `false`        |
| value        | 当前选中项对应的 value    | _number \| string_ | -       |
| scroll-style `v2.5.0`        | 当需要下拉菜单滚动时，此属性设置滚动区域的样式，比如高度    | _string_ | -       |

### DropdownItem Events

| 事件名        | 说明                                                                  | 回调参数                                                                                                                                          |
| ------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| before-toggle | 下拉菜单打开或者关闭前触发，需要将`use-before-toggle`属性设置为`true` | `event.detail.status`: `true` 打开下拉菜单，`false` 关闭下拉菜单 <br>`event.detail.callback`: 回调函数，调用`callback(false)`终止下拉菜单状态变更 |
| change        | 点击选项导致 value 变化时触发          | value         |
| close         | 关闭菜单栏时触发       | -      |
| closed        | 关闭菜单栏且动画结束后触发           | -               |
| open          | 打开菜单栏时触发              | -            |
| opened        | 打开菜单栏且动画结束后触发        | -           |

### DropdownItem 方法

通过 selectComponent(id) 可访问。

| 方法名 | 说明                                                          | 参数           | 返回值 |
| ------ | ------------------------------------------------------------- | -------------- | ------ |
| toggle | 切换菜单展示状态，传`true`为显示，`false`为隐藏，不传参为取反 | show?: boolean | -      |

### Option 数据结构

| 键名  | 说明                             | 类型               |
| ----- | -------------------------------- | ------------------ |
| icon  | 左侧[图标svg字符串](/material/smartui?comId=icon&appType=miniapp)或图片链接 | _string_           |
| text  | 文字                             | _string_           |
| value | 标识符                           | _number \| string_ |

### DropdownMenu 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |
| title-class  | 选中项样式类 |

### DropdownItem 外部样式类

| 类名             | 说明         |
| ---------------- | ------------ |
| custom-class     | 根节点样式类 |
| item-title-class | 选项样式类   |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --dropdown-menu-height        | _46px_                           | 菜单的高度    |
| --dropdown-menu-background-color        | _var(--app-B3, #ffffff)_                         | 菜单的背景色    |
| --dropdown-menu-title-font-size  | _14px_    | 菜单的标题字体大小    |
| --dropdown-menu-title-line-height  | _18px_    | 菜单的标题字体高度    |
| --dropdown-menu-title-text-color  | _var(--app-B6-N1, rgba(0, 0, 0, 1))_    | 菜单的标题颜色    |
| --dropdown-menu-title-active-text-color  | _var(--app-M1, #3678e3)_    | 菜单的标题选中颜色    |
| --dropdown-menu-title-disabled-text-color  | _var(--app-B6-N4, rgba(0, 0, 0, 0.4))_    | 菜单的标题禁用颜色    |
| --dropdown-menu-title-padding  | _0 24px 0 8px_    | 菜单的padding    |
| --dropdown-menu-title-triangle-size `v2.0.0`  | _12px_    | 箭头图标字体大小    |
| --dropdown-menu-title-triangle-margin-left `v2.0.0`  | _4px_    | 箭头图标左间距    |
| --dropdown-menu-item-title-font-size `v2.0.0`  | _14px_    | 下拉菜单字体大小    |
| --dropdown-menu-item-title-font-weight `v2.0.0`  | _normal_  | 下拉菜单字体粗细   |
| --dropdown-menu-option-active-color  | _var(--app-M1, #3678e3)_  |  下拉菜单选中颜色  |
| --dropdown-menu-item-title-line-height `v2.0.0`  | _rgba(0,0,0,.05)_    | 下拉菜单分割线颜色    |
| --dropdown-menu-item-first-line-color `v2.0.0`  | _rgba(0,0,0,.08)_    | 下拉菜单第一个分割线颜色    |
| --dropdown-menu-item-line-width `v2.0.0`  | _1px_    | 下拉菜单第一个分割线高度    |
| --dropdown-menu-item-icon-font-size `v2.0.0`  | _28px_    | 下拉菜单右侧图标字体大小    |
| --dropdown-menu-item-title-active-font-weight `v2.0.0`  | _500_    | 下拉菜单选中字体粗细    |

## 常见问题

### Dropdown 组件在 Popup 中使用，为什么点击打开下拉选项时，定位出现异常？

DropDown 位于 Popup 节点内，并且 Popup 的 position 设置为 center。由于 center 样式包含 `top: 50% ` 和 `transform: translate3d(-50%,-50%,0)`，导致节点位置计算偏移，从而影响 DropDown 的定位，解决方案是将 Popup 的 position 设置为 bottom 或 top。
