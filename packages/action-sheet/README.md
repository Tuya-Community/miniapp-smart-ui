---
category: 反馈
---

# ActionSheet 动作面板

### 介绍

底部弹起的模态面板，包含与当前情境相关的多个选项。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-action-sheet": "@tuya-miniapp/smart-ui/lib/action-sheet/index"
}
```

## 代码演示

### 基础用法

需要传入一个`actions`的数组，数组的每一项是一个对象，对象属性见文档下方表格。

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  bind:close="onClose"
  bind:cancel="onCancel"
  bind:select="onSelect"
/>
```

```javascript
Page({
  data: {
    show: false,
    actions: [
      { id: 0, name: 'Action', checked: true },
      { id: 1, name: 'Action', checked: false },
      { id: 2, name: 'Action', checked: false },
      { id: 3, name: 'Action', checked: false },
      { id: 4, name: 'Action', checked: false },
      { id: 5, name: 'Action', checked: false },
      { id: 6, name: 'Action', checked: false },
      { id: 7, name: 'Action', checked: false },
    ],
  },

  onCancel() {
    this.setData({ show: false });
  },

  onClose() {
    console.log('close')
  },

  onSelect(event) {
    console.log(event.detail);
  },
});
```

### 自定义选中图标颜色

通过`active-color`属性可以自定义选中状态下图标的颜色。

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  active-color="#1989FA"
  cancel-text="取消"
  bind:select="onSelect"
  bind:close="onClose"
  bind:cancel="onClose"
/>
```

```javascript
Page({
  data: {
    show: false,
    actions: [
      { id: 0, name: 'Action', checked: true },
      { id: 1, name: 'Action', checked: false },
      { id: 2, name: 'Action', checked: false },
    ],
  },

  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    const { id } = event.detail;
    const newActions = this.data.actions.map((item) => {
      if (item.id === id) return { ...item, checked: true };
      return { ...item, checked: false };
    });
    this.setData({
      actions: newActions,
    });
  },
});
```

### 无选中列表

设置`actions[idx].checked`属性为`false`后，可以展示无选中状态的列表。

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  cancel-text="取消"
/>
```

```javascript
Page({
  data: {
    show: false,
    actions: [{ name: 'Action' }, { name: 'Action' }, { name: 'Action', subname: 'Description' }],
  },
});
```

### 选项状态

选项可以设置为加载状态或禁用状态。

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  cancel-text="取消"
/>
```

```javascript
Page({
  data: {
    show: false,
    actions: [
      { name: '着色选项', color: '#ee0a24' },
      { loading: true },
      { name: '禁用选项', disabled: true },
    ],
  },
});
```

### 展示取消/确认按钮

设置`cancel-text`、`confirm-text`属性后，会在底部展示取消或确认按钮，点击后关闭当前菜单。

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  cancel-text="取消"
  confirm-text="确认"
/>
```

### 展示描述信息

设置`description`属性后，会在选项上方显示描述信息。

```html
<smart-action-sheet
  show="{{ show }}"
  actions="{{ actions }}"
  description="这是一段描述信息"
/>
```

```javascript
Page({
  data: {
    show: false,
    actions: [{ name: 'Action' }, { name: 'Action' }, { name: 'Action', subname: 'Description' }],
  },
});
```

### 自定义面板

通过设置`title`属性展示标题栏，同时可以使用插槽自定义菜单内容。

```html
<smart-action-sheet show="{{ show }}" title="标题">
  <view>内容</view>
</smart-action-sheet>
```

### 嵌入数字滑块

ActionSheet 内可以嵌入 Slider 等其他组件，需要注意在 `onAfterEnter` 回调后再渲染 Slider。

```html
<smart-action-sheet
  show="{{ show }}"
  title="数值调节"
  cancel-text="取消"
  confirm-text="确认"
  bind:close="onClose"
  bind:cancel="onClose"
  bind:confirm="onClose"
  bind:after-enter="onAfterEnter"
>
  <view class="content-number">
    <view class="demo-header">
      <text class="demo-text">{{ currentNumber }}%</text>
    </view>
    <view class="demo-slider">
      <smart-slider
        wx:if="{{ isReady }}"
        instanceId="action-sheet-slider"
        trackStyle="height:45px;border-radius:8px;"
        barStyle="height:45px;border-radius:8px;"
        thumbStyle="width:15px;height:50px;background:#BBC5D4;border:2px solid #FFFFFF;box-shadow:0px 0px 2px 0px rgba(0, 0, 0, 0.5);border-radius:2px;"
        value="{{ currentNumber }}"
        bind:change="onChange"
      />
      <view wx:else style="height: 45px;" />
    </view>
  </view>
</smart-action-sheet>
```

```javascript
Page({
  data: {
    show: false,
    isReady: false,
    currentNumber: 0,
  },

  onClose() {
    this.setData({ show: false });
  },
  
  onAfterEnter() {
    this.setData({ isReady: true })
  },

  onChange(event) {
    this.setData({ currentNumber: event.detail.value });
  },
});
```

```css
.content-number {
  padding: 10px 39px;
  background: var(--app-B1, #f6f7fb);
  text-align: center;
  color: var(--app-B4-N1, #000);
}

.demo-header {
  padding: 10px 39px;
}

.demo-text {
  font-size: 40px;
  font-weight: 600;
  line-height: 46px;
}

.demo-slider {
  margin: 23px 0;
  min-height: 45px;
}
```

### 嵌入日期选择器

ActionSheet 内可以嵌入日期选择器等其他组件。

```html
<smart-action-sheet
  show="{{ show }}"
  title="选择日期"
  cancel-text="取消"
  confirm-text="确认"
  bind:close="onClose"
  bind:cancel="onClose"
  bind:confirm="onPickerConfirm"
>
  <smart-datetime-picker
    show-toolbar="{{ false }}"
    type="date"
    value="{{ currentDate }}"
    min-date="{{ minDate }}"
    formatter="{{ formatter }}"
    bind:input="onInput"
  />
</smart-action-sheet>
```

```javascript
Page({
  data: {
    show: false,
    currentDate: new Date(2018, 0, 1),
    minDate: new Date(2018, 0, 1).getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  onClose() {
    this.setData({ show: false });
  },

  onInput(event) {
    const { detail } = event;
    const date = new Date(detail);
    this.setData({ currentDate: date });
  },

  onPickerConfirm() {
    this.setData({
      show: false,
    });
    // 处理确认选择的日期
    console.log('选择的日期:', this.data.currentDate);
  },
});
```

### 自定义双列选择器 `v2.6.0`

当 `use-title-slot` 为 `true` 时，可以使用插槽自定义标题内容，支持复杂的双选择器场景。

```html
<smart-action-sheet 
  show="{{ show }}" 
  use-title-slot="{{ true }}"
  cancel-text="取消"
  confirm-text="确认"
  bind:close="onClose"
  bind:cancel="onClose"
  bind:confirm="onDoubleSelectorConfirm"
>
  <view slot="title" class="demo-custom-double-select-header">
    <view>时间</view>
    <view>温度</view>
  </view>
  <view class="demo-custom-double-select-content">
    <smart-datetime-picker
      class="flex1"
      type="time"
      data-type="time"
      is-12-hour-clock
      show-toolbar="{{ false }}"
      value="{{ current12Date }}"
      max-hour="{{ maxHour }}"
      min-hour="{{ minHour }}"
      bind:input="onCurrent12DateInput"
    />
    <smart-picker
      class="flex1"
      unit="℃"
      active-index="{{ tempColumnIdx }}"
      columns="{{ tempColumns }}"
      bind:change="onTempColumnChange"
    />
  </view>
</smart-action-sheet>
```

```javascript
Page({
  data: {
    show: false,
    current12Date: '12:00',
    minHour: 0,
    maxHour: 23,
    tempColumnIdx: 3,
    tempColumns: [39, 40, 41, 42, 43, 44, 45],
  },

  onClose() {
    this.setData({ show: false });
  },

  onDoubleSelectorConfirm() {
    console.log('当前双选择器结果', this.data.current12Date, this.data.tempColumnIdx);
    this.setData({
      show: false,
    });
  },

  onCurrent12DateInput(event) {
    this.setData({
      current12Date: event.detail,
    });
  },

  onTempColumnChange(event) {
    const { index } = event.detail;
    this.setData({
      tempColumnIdx: index,
    });
  },
});
```

```css
.demo-custom-double-select-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.demo-custom-double-select-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex1 {
  flex: 1;
}
```

## API

### Props

| 参数         | 说明                      | 类型      | 默认值              |
| ----------------------- | -------------------------------------------- | --------- | ------------------- |
| actions            | 菜单选项         | _Array_   | `[]`                |
| active-color                       | 列表选项中 icon 的选中态颜色            | _string_  | `--app-M1` |
| cancel-text     | 取消按钮文字          | _string_  | -                   |
| close-on-click-action        | 是否在点击选项后关闭           | _boolean_ | `true`              |
| close-on-click-overlay     | 点击遮罩是否关闭菜单                               | _boolean_ | `true`       |
| confirm-text         | 确认按钮文字                                                                                                         | _string_  | -                   |
| description            | 选项上方的描述信息                                                                                                   | _string_  | -                   |
| overlay          | 是否显示遮罩层                                         | _boolean_ | `true`          |
| round                              | 是否显示圆角                                  | _boolean_ | `true`              |
| safe-area-inset-bottom             | 是否为 iPhoneX 留出底部安全距离                               | _boolean_ | `true`              |
| safe-area-inset-bottom-min `v1.1.0` | 是否需要预留出一个最小的底部安全距离，用于在 safeArea 底部为 0 时进行追加，需要在 safeAreaInsetBottom 为 true 时生效 | _number_  | `16`                |
| show      | 是否显示动作面板                  | _boolean_ | -                   |
| title        | 标题      | _string_  | -                   |
| use-title-slot `v2.6.0`        | 是否启用标题 Slot      | _boolean_  | `false`                   |
| z-index                            | z-index 层级                                                                                                         | _number_  | `100`               |
| native-disabled `v2.5.0`     | 开启弹框期间是否禁用本地手势; 会在弹框开始进入动画时调用 `ty.nativeDisabled(true)`, 在弹框关闭动画结束时调用 `ty.nativeDisabled(false)` 恢复异层组件的点击能力；由于`ty.nativeDisabled` 是全局生效的，所以多个弹框组件同时打开时注意是否传 `native-disabled`属性和关闭的时机，防止 `native-disabled` 属性失效     | _boolean_   | `false`        |

### Events

| 事件名             | 说明                                     | 参数                         |
| ------------------ | ---------------------------------------- | ---------------------------- |
| bind:after-enter   | 遮罩进入后触发                           | -                            |
| bind:after-leave   | 遮罩离开后触发                           | -                            |
| bind:before-enter  | 遮罩进入前触发                           | -                            |
| bind:before-leave  | 遮罩离开前触发                           | -                            |
| bind:cancel        | 取消按钮点击时触发                       | -                            |
| bind:click-overlay | 点击遮罩层时触发                         | -                            |
| bind:close         | 关闭时触发                               | -                            |
| bind:confirm       | 确认按钮点击时触发                       | -                            |
| bind:enter         | 遮罩进入中触发                           | -                            |
| bind:leave         | 遮罩离开中触发                           | -                            |
| bind:select        | 选中选项时触发，禁用或加载状态下不会触发 | event.detail: 选项对应的对象 |

### actions

`API`中的`actions`为一个对象数组，数组中的每一个对象配置每一列，每一列有以下`key`：

| 键名      | 说明                          | 类型      | 默认值 |
| --------- | ----------------------------- | --------- | ------ |
| className | 为对应列添加额外的 class 类名 | _string_  | -      |
| color     | 选项文字颜色                  | _string_  | -      |
| checked   | 是否为选中状态，显示选中图标  | _boolean_ | -      |
| disabled  | 是否为禁用状态                | _boolean_ | -      |
| loading   | 是否为加载状态                | _boolean_ | -      |
| name      | 标题                          | _string_  | -      |
| subname   | 二级标题                      | _string_  | -      |
| sendMessageImg | 会话内消息卡片图片，openType="contact"时有效 | _string_ | 截图 |
| sendMessagePath | 会话内消息卡片点击跳转小程序路径，openType="contact"时有效 | _string_ | 当前分享路径 |
| sendMessageTitle | 会话内消息卡片标题，openType="contact"时有效 | _string_ | 当前标题 |
| showMessageCard | 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，openType="contact"时有效 | _string_ | `false` |

### 外部样式类

| 类名         | 说明                |
| ------------ | ------------------- |
| custom-class | 根节点样式类        |
| list-class   | `actions`容器样式类 |


### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --action-sheet-width | _calc(100% - 32px)_ | 弹窗的宽度 |
| --action-sheet-left | _16px_ | 弹窗绝对定位左侧的位置 |
| --action-sheet-max-height | _90%_ | 弹窗的最大高度 |
| --action-sheet-margin | _0 0 16px_ | 弹窗的边距 |
| --action-sheet-active-color | _var(--app-B1, #f6f7fb)_ | 选中图标的颜色,以及按下时列表的背景色 |
| --action-sheet-item-disabled-opacity | _0.3_ | 禁用列表的透明度 |
| --action-sheet-header-border-color | _var(--app-B4-N7, rgba(0, 0, 0, 0.1))_ | 头部的边框色 |
| --action-sheet-header-height | _56px_ | 头部的高度 |
| --action-sheet-header-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | 头部的字体颜色 |
| --action-sheet-header-font-size | _16px_ | 头部的字体大小 |
| --action-sheet-header-font-weight | _normal_ | 头部的字重 |
| --action-sheet-description-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | 说明文字的颜色 |
| --action-sheet-description-font-size | _14px_ | 说明文字的字体大小 |
| --action-sheet-description-line-height | _20px_ | 说明文字的行高 |
| --action-sheet-item-background | _var(--app-B4, #ffffff)_ | 列表的背景色 |
| --action-sheet-item-border-radius | _0_ | 列表的边框圆角 |
| --action-sheet-item-icon-margin | _0px 16px 0 0_ | 列表的图标大小边距 |
| --action-sheet-item-icon-color | _var(--app-M1, #3678e3)_ | 列表的图标颜色 |
| --action-sheet-item-icon-size | _28px_ | 列表的图标大小 |
| --action-sheet-item-font-size | _16px_ | 列表的文字字体大小 |
| --action-sheet-item-font-weight | _normal_ | 列表的文字字重 |
| --action-sheet-item-line-height | _24px_ | 列表的文字的行高 |
| --action-sheet-item-text-color | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | 列表的文字的颜色 |
| --action-sheet-subname-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | 列表二级名称的字体颜色 |
| --action-sheet-subname-font-size | _12px_ | 列表二级名称的字体大小 |
| --action-sheet-subname-line-height | _20px_ | - |
| --action-sheet-confirm-text-color | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | 确认按钮的字体颜色 |
| --action-sheet-confirm-font-weight | _500_ | 确认按钮的字体字重 |
| --action-sheet-cancel-text-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | 取消按钮的字体颜色 |
| --action-sheet-footer-padding-top | _8px_ | 底部内容的顶部内边距 |
| --action-sheet-footer-padding-color | _var(--app-B4-N9, rgba(0, 0, 0, 0.05))_ | 底部内容的距离列表的间隔色 |
| --action-sheet-active-icon-color `v2.2.0` | _var(--app-M1, #3678e3)_ | 列表选中图标的颜色 |



## 常见问题

### ActionSheet 子组件使用 Slider 渲染定位异常，是什么情况？

由于 `Slider` 组件在 `ActionSheet` 打开时可能尚未完全渲染，因此我们无法获取其 DOM，从而导致定位出现问题。解决方案是在 `ActionSheet` 的 `onAfterEnter` 事件回调之后再开始渲染 `Slider` 组件。这样，我们可以确保 `Slider` 能够在获取 DOM 时被正常渲染。请参考以下示例：

```html
<smart-action-sheet
  show="{{ show }}"
  title="Title"
  cancel-text="Action"
  confirm-text="Action"
  bind:close="onClose"
  bind:cancel="onClose"
  bind:confirm="onClose"
  bind:after-enter="onAfterEnter"
>
  <view class="content-number">
    <view class="demo-header">
      <text class="demo-text">{{ currentNumber }}%</text>
    </view>
    <view class="demo-slider">
      <smart-slider
        wx:if="{{ isReady }}"
        instanceId="action-sheet-slider"
        trackStyle="height:45px;border-radius:8px;"
        barStyle="height:45px;border-radius:8px;"
        thumbStyle="width:15px;height:50px;background:#BBC5D4;border:2px solid #FFFFFF;box-shadow:0px 0px 2px 0px rgba(0, 0, 0, 0.5);border-radius:2px;"
        value="{{ currentNumber }}"
        bind:change="onChange"
      />
      <view wx:else style="height: 45px;" />
    </view>
  </view>
</smart-action-sheet>
```

```javascript
Page({
  data: {
    show: false,
    isReady: false,
    currentNumber: 0,
  },

  onClose() {
    this.setData({ show: false });
  },
  
  onAfterEnter() {
    this.setData({ isReady: true })
  },

  onChange(event) {
    this.setData({ currentNumber: event.detail.value });
  },
});
```

```css
.content-number {
  padding: 10px 39px;
  background: var(--app-B1, #f6f7fb);
  text-align: center;
  color: var(--app-B4-N1, #000);
}

.demo-header {
  padding: 10px 39px;
}

.demo-text {
  font-size: 40px;
  font-weight: 600;
  line-height: 46px;
}

.demo-slider {
  margin: 23px 0;
  min-height: 45px;
}
```
