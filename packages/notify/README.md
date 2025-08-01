# Notify 消息提示

### 介绍

在页面顶部展示消息提示，支持函数调用和组件调用两种方式。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-notify": "@tuya-miniapp/smart-ui/lib/notify/index"
}
```

## 代码演示

### 基础用法

```js
import Notify from '@tuya-miniapp/smart-ui/notify/notify';

Notify('通知内容');
```

```html
<!-- 在页面内添加对应的节点 -->
<smart-notify id="smart-notify" />
```

### 通知类型

支持`primary`、`success`、`warning`、`danger`四种通知类型，默认为`danger`。

```js
// 主要通知
Notify({ type: 'primary', message: '通知内容' });

// 成功通知
Notify({ type: 'success', message: '通知内容' });

// 危险通知
Notify({ type: 'danger', message: '通知内容' });

// 警告通知
Notify({ type: 'warning', message: '通知内容' });
```

### 自定义通知

自定义消息通知的颜色和展示时长。

```js
Notify({
  message: '自定义颜色',
  color: '#ad0000',
  background: '#ffe1e1',
});

Notify({
  message: '自定义时长',
  duration: 1000,
});
```

### 自定义选择器

```js
Notify({
  message: '自定义节点选择器',
  duration: 1000,
  selector: '#custom-selector',
});
```

```html
<!-- 在页面内添加自定义节点 -->
<smart-notify id="custom-selector" />
```

## API

### 方法

| 方法名       | 说明     | 参数                 | 返回值      |
| ------------ | -------- | -------------------- | ----------- |
| Notify       | 展示提示 | `options \| message` | notify 实例 |
| Notify.clear | 关闭提示 | `options`            | `void`      |

### Options

| 参数             | 说明                                                   | 类型       | 默认值         |
| ---------------- | ------------------------------------------------------ | ---------- | -------------- |
| background       | 背景颜色                                               | _string_   | -              |
| color            | 字体颜色                                               | _string_   | `#fff`         |
| context          | 选择器的选择范围，可以传入自定义组件的 this 作为上下文 | _object_   | 当前页面       |
| duration         | 展示时长(ms)，值为 0 时，notify 不会消失               | _number_   | `3000`         |
| message          | 展示文案，支持通过`\n`换行                             | _string_   | `''`           |
| onClick          | 点击时的回调函数                                       | _Function_ | -              |
| onClose          | 关闭时的回调函数                                       | _Function_ | -              |
| onOpened         | 完全展示后的回调函数                                   | _Function_ | -              |
| safeAreaInsetTop | 是否留出顶部安全距离（状态栏高度）                     | _boolean_  | `false`        |
| selector         | 自定义节点选择器                                       | _string_   | `smart-notify` |
| top              | 顶部距离                                               | _number_   | `0`            |
| type             | 类型，可选值为 `primary` `success` `warning`           | _string_   | `danger`       |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --notify-padding | _6px 15px_ | 通知内边距 |
| --notify-font-size | _14px_ | 通知字体大小 |
| --notify-line-height | _20px_ | 通知行高 |
| --notify-primary-background-color | _#1989fa_ | 主要通知背景颜色 |
| --notify-success-background-color | _#07c160_ | 成功通知背景颜色 |
| --notify-danger-background-color | _#ee0a24_ | 危险通知背景颜色 |
| --notify-warning-background-color | _#ff976a_ | 警告通知背景颜色 |