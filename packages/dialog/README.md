---
category: 反馈
---

# Dialog 弹出框

### 介绍

弹出模态框，常用于消息提示、消息确认，或在当前页面内完成特定的交互操作，支持函数调用和组件调用两种方式。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-dialog": "@tuya-miniapp/smart-ui/lib/dialog/index"
}
```

## 代码演示

### 消息提示

用于提示一些消息，只包含一个确认按钮。

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

DialogInstance.alert({
  title: '标题',
  message: '弹窗内容',
}).then(() => {
  // on close
});

DialogInstance.alert({
  message: '弹窗内容',
}).then(() => {
  // on close
});
```

### 消息确认

用于确认消息，包含取消和确认按钮。

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

DialogInstance.confirm({
  title: '标题',
  message: '弹窗内容',
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  });
```

### 输入框

用于输入文案信息，此时默认最大输入限制`maxLength`是`20`

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

const beforeClose = (action: 'confirm' | 'cancel' | 'overlay', value?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (action === 'confirm') {
        // 不存在输入值则拦截确认操作
        resolve(!!value);
      } else {
        resolve(true);
      }
    }, 1000);
  });
}    

DialogInstance.input({
  title: 'Title',
  value: '',
  beforeClose,
  cancelButtonText: 'Sub Action',
})
  .then(() => {
    // on confirm
  })
  .catch(() => {
    // on cancel
  });
```

### 圆角按钮风格

将 theme 选项设置为 `round-button` 可以展示圆角按钮风格的弹窗。

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

DialogInstance.alert({
  title: '标题',
  message: '弹窗内容',
  theme: 'round-button',
}).then(() => {
  // on close
});

DialogInstance.alert({
  message: '弹窗内容',
  theme: 'round-button',
}).then(() => {
  // on close
});
```

### 异步关闭

通过 `beforeClose` 属性可以传入一个回调函数，在弹窗关闭前进行特定操作。

```html
<smart-dialog id="smart-dialog" />
```

```javascript
import DialogInstance from '@tuya-miniapp/smart-ui/dialog/dialog';

const beforeClose = (action) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (action === 'confirm') {
        resolve(true);
      } else {
        // 拦截取消操作
        resolve(false);
      }
    }, 1000);
  });

DialogInstance.confirm({
  title: '标题',
  message: '弹窗内容',
  beforeClose,
});
```

### 组件调用

如果需要在弹窗内嵌入组件或其他自定义内容，可以使用组件调用的方式。

```html
<smart-dialog
  use-slot
  title="标题"
  show="{{ show }}"
  show-cancel-button
  confirm-button-open-type="getUserInfo"
  bind:close="onClose"
  bind:getuserinfo="getUserInfo"
>
  <image src="https://static1.tuyacn.com/static/tuya-miniapp-doc/_next/static/images/logo-small.png" />
</smart-dialog>
```

```js
Page({
  data: {
    show: true,
  },

  getUserInfo(event) {
    console.log(event.detail);
  },

  onClose() {
    this.setData({ show: false });
  },
});
```

### 自定义样式

如果需要自定义样式，建议使用 `custom-class` 实现，不在推荐 `className` 属性（在自定义组件中使用并不会生效），使用方法如下

#### 组件调用

```html
<smart-dialog
  title="标题"
  message="弹窗内容"
  show="{{ show }}"
  custom-class="my-custom-class"
/>
```

#### API 调用

```html
<smart-dialog id="smart-dialog" custom-class="my-custom-class" />
```

## API

### 方法

| 方法名  | 参数      | 返回值    | 介绍     |
| -------- | --------- | --------- | --------- |
| DialogInstance                     | `options` | `Promise` | 展示弹窗                         |
| DialogInstance.alert               | `options` | `Promise` | 展示消息提示弹窗                 |
| DialogInstance.close               | -         | `void`    | 关闭弹窗, 并清空缓存队列                         |
| DialogInstance.confirm             | `options` | `Promise` | 展示消息确认弹窗                 |
| DialogInstance.input               | `options` | `Promise` | 展示输入框弹窗                   |
| DialogInstance.resetDefaultOptions | -         | `void`    | 重置默认配置，对所有 Dialog 生效 |
| DialogInstance.setDefaultOptions   | `options` | `void`    | 修改默认配置，对所有 Dialog 生效 |
| DialogInstance.stopLoading         | -         | `void`    | 停止按钮的加载状态               |

### Options

通过函数调用 Dialog 时，支持传入以下选项：

| 参数         | 说明  | 类型   | 默认值    |
| ------------ | --------- | -------------- | --------- |
| icon         | 是否显示警告图标    | _boolean_          | `false`   |
| maxlength    | 最大输入长度，设置为 -1 的时候不限制最大长度 | _number_           | `20`      |
| message      | 文本内容，支持通过`\n`换行                   | _string_           | -         |
| messageAlign | 内容对齐方式，可选值为`left` `right`         | _string_           | `center`  |
| password     | 是否是密码类型     | _boolean_          | `false`   |
| placeholder  | 输入框为空时占位符     | _string_           | -         |
| theme        | 样式风格，可选值为`round-button`   | _string_           | `default` |
| title        | 标题      | _string_       | -         |
| value        | 输入框的初始值     | _string_           | -         |
| width        | 弹窗宽度，默认单位为`px`   | _string \| number_ | `320px`   |
| zIndex       | z-index 层级   | _number_           | `100`     |
| customStyle | 自定义样式 | _string_ | '' |
| selector | 自定义选择器 | _string_ | `#smart-dialog` |
| cancelButtonText | 取消按钮的文案 | _string_ | `Cancel` |
| closeOnClickOverlay | 点击遮罩层时是否关闭弹窗 | _boolean_ | `false` |
| confirmButtonText | 确认按钮的文案 | _string_ | `Confirm` |
| overlay | 是否展示遮罩层 | _boolean_ | `true` |
| overlayStyle | 自定义遮罩层样式 | _object_ | - |
| showCancelButton | 是否展示取消按钮 | _boolean_ | `false` |
| showConfirmButton | 是否展示确认按钮 | _boolean_ | `true` |
| beforeClose | 关闭前的回调函数，返回 `false` 可阻止关闭，支持返回 Promise | _(action) => boolean \| Promise\<boolean\>_ | - |
| context | 选择器的选择范围，可以传入自定义组件的 this 作为上下文 | _object_ | 当前页面 |
| transition | 动画名称，可选值为`fade` `none` | _string_ | `scale` |
| nativeDisabled `v2.3.8` | 开启弹框期间是否禁用本地手势 | _boolean_ | `false` |


### Props

通过组件调用 Dialog 时，支持以下 Props:

| 参数              | 说明  | 类型   | 默认值    |
| ----------------- | --------- | ------------ | --------- |
| confirm-button-id | 确认按钮的标识符，作为底层原生 button 组件的 id 值 | _string_           | -         |
| icon              | 是否显示警告图标                                   | _boolean_          | `false`   |
| maxlength         | 最大输入长度，设置为 -1 的时候不限制最大长度       | _number_           | `20`      |
| message           | 文本内容，支持通过`\n`换行                         | _string_           | -         |
| message-align     | 内容对齐方式，可选值为`left` `right`               | _string_           | `center`  |
| password          | 是否是密码类型                                     | _boolean_          | `false`   |
| placeholder       | 输入框为空时占位符                                 | _string_           | -         |
| show              | 是否显示弹窗                                       | _boolean_          | -         |
| theme             | 样式风格，可选值为`round-button`                   | _string_           | `default` |
| title             | 标题                                               | _string_           | -         |
| value             | 输入框的初始值                                     | _string_           | -         |
| width             | 弹窗宽度，默认单位为`px`                           | _string \| number_ | `320px`   |
| z-index           | z-index 层级                                       | _number_           | `100`     |
| custom-style | 自定义样式 | _string_ | '' |
| show-confirm-button | 是否展示确认按钮 | _boolean_ | `true` |
| cancel-button-color | 取消按钮的字体颜色 | _string_ | `#333` |
| cancel-button-text | 取消按钮的文案 | _string_ | `取消` |
| close-on-click-overlay | 点击遮罩层时是否关闭弹窗 | _boolean_ | `false` |
| confirm-button-color | 确认按钮的字体颜色 | _string_ | `#ee0a24` |
| confirm-button-text | 确认按钮的文案 | _string_ | `确认` |
| overlay | 是否展示遮罩层 | _boolean_ | `true` |
| overlay-style | 自定义遮罩层样式 | _object_ | - |
| show-cancel-button | 是否展示取消按钮 | _boolean_ | `false` |
| use-cancel-button-slot | 是否使用自定义取消按钮的插槽 | _boolean_ | `false` |
| use-confirm-button-slot | 是否使用自定义确认按钮的插槽 | _boolean_ | `false` |
| use-slot | 是否使用自定义内容的插槽 | _boolean_ | `false` |
| use-title-slot | 是否使用自定义标题的插槽 | _boolean_ | `false` |
| before-close | 关闭前的回调函数，返回 `false` 可阻止关闭，支持返回 Promise | _(action, value?: string) => boolean \| Promise\<boolean\>_ | - |
| transition | 动画名称，可选值为`fade` | _string_ | `scale` |


### Events

| 事件         | 说明      | 回调参数        |
| ------------ | -------------- | ------------ |
| bind:cancel  | 点击取消按钮时触发 | -                                                                        |
| bind:close   | 弹窗关闭时触发     | event.detail: 触发关闭事件的来源，<br>枚举为`confirm`,`cancel`,`overlay` |
| bind:confirm | 点击确认按钮时触发 | -          |

### Slot

| 名称         | 说明                |
| ---------- | ----------------------- |
| cancel-button  | 自定义`cancel-button`显示内容，需要 `use-cancel-button-slot` 为 `true`   |
| confirm-button | 自定义`confirm-button`显示内容，需要 `use-confirm-button-slot` 为 `true` |
| title          | 自定义`title`显示内容，如果设置了`title`属性则不生效                     |

### 外部样式类

| 类名                 | 说明           |
| -------------------- | -------------- |
| cancel-button-class  | 取消按钮样式类 |
| confirm-button-class | 确认按钮样式类 |
| custom-class         | 根节点样式类   |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。
| 名称    | 默认值   | 描述 |
| ------------ | --------- | ---- |
| --dialog-cancel-color `v2.1.7` | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | 取消按钮颜色 |
| --dialog-confirm-color `v2.1.7` | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | 确认按钮颜色 |
| --dialog-confirm-font-weight `v2.5.1` | _normal_ | 确认按钮的字重 |
| --dialog-cancel-font-weight `v2.5.1` | _normal_ | 取消按钮字重 |
| --dialog-width | _311px_ | 弹窗宽度 |
| --dialog-small-screen-width | _90%_ | 小屏幕弹窗宽度 |
| --dialog-font-size | _16px_ | 对话框字体大小 |
| --dialog-border-radius | _16px_ | 圆角半径 |
| --dialog-background-color | _var(--app-B4, #ffffff)_ | 背景颜色 |
| --dialog-header-font-color | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | 标题字体颜色 |
| --dialog-header-font-weight | _400_ | 标题字体粗细 |
| --dialog-header-line-height | _24px_ | 标题行高 |
| --dialog-header-padding `2.3.5` | _0_ | 头部标题内边距 |
| --dialog-header-padding-top | _24px_ | 头部标题顶部内边距 |
| --dialog-header-isolated-padding | _@padding-lg 0_ | 标题内边距 |
| --dialog-message-padding | _24px_ | 消息内边距 |
| --dialog-message-font-size | _16px_ | 消息字体大小 |
| --dialog-message-line-height | _20px_ | 消息行高 |
| --dialog-message-max-height | _60vh_ | 消息最大高度 |
| --dialog-message-text-color | _var(--app-B4-N1, rgba(0, 0, 0, 1))_ | 消息字体颜色 |
| --dialog-has-title-message-font-size | _14px_ | 标题消息字体大小 |
| --dialog-has-title-message-text-color | _var(--app-B4-N3, rgba(0, 0, 0, 0.5))_ | 标题消息字体颜色 |
| --dialog-has-title-message-padding-top | _8px_ | 标题消息顶部内边距 |
| --dialog-header-icon-size | _39px_ | 图标大小 |
| --dialog-input-height | _40px_ | 输入框高度 |
| --dialog-input-background-color | _var(--app-B4-N9, rgba(0, 0, 0, 0.05))_ | 输入框背景色 |
| --dialog-input-margin | _0 16px 24px_ | 输入框外边距 |
| --dialog-input-padding | _0 10px_ | 输入框内边距 |
| --dialog-input-border-radius | _10px_ | 输入框圆角半径 |
| --dialog-input-font-size | _14px_ | 输入框字体大小 |
| --dialog--round-button-border-radius `v2.3.5` | _20px_ | 当设置`theme: 'round-button'`的按钮圆角 |

