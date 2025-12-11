---
category: 反馈
---

# Toast 轻提示

### 介绍

在页面中间弹出黑色半透明提示，用于消息通知、加载提示、操作结果提示等场景。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-toast": "@tuya-miniapp/smart-ui/lib/toast/index"
}
```

## 代码演示

### 文字提示

```javascript
import ToastInstance from '@tuya-miniapp/smart-ui/toast/toast';

ToastInstance('我是提示文案，建议不超过十五字~');
```

```html
<smart-toast id="smart-toast" />
```

### 加载提示

使用 `ToastInstance.loading` 方法展示加载提示，通过 `forbidClick` 属性可以禁用背景点击，通过 `loadingType` 属性可以自定义加载图标类型。

```javascript
ToastInstance.loading({
  message: '加载中...',
  forbidClick: true,
});

// 自定义加载图标
ToastInstance.loading({
  message: '加载中...',
  forbidClick: true,
  loadingType: 'spinner',
});
```

### 成功/失败提示

```javascript
ToastInstance.success('成功文案');
ToastInstance.fail('失败文案');
```


### 警告提示

```js
ToastInstance.warn('警告文案');
```

### 动态更新提示

```javascript
const toast = ToastInstance.loading({
  duration: 0, // 持续展示 toast
  forbidClick: true,
  message: '倒计时 3 秒',
  selector: '#custom-selector',
  width: 88,
});

let second = 3;
const timer = setInterval(() => {
  second--;
  if (second) {
    toast.setData({
      message: `倒计时 ${second} 秒`,
    });
  } else {
    clearInterval(timer);
    ToastInstance.clear();
  }
}, 1000);
```

```html
<smart-toast id="custom-selector" />
```

### OnClose 回调函数

```javascript
ToastInstance({
  type: 'success',
  message: '提交成功',
  onClose: () => {
    console.log('执行OnClose函数');
  },
});
```

### 自定义宽度

通过 `width` 属性可以自定义弹窗宽度。

```javascript
ToastInstance.loading({
  message: '加载中...',
  forbidClick: true,
  width: 200,
});
```

### 位置设置

通过 `position` 属性可以设置提示的位置，可选值为 `top`、`middle`、`bottom`。

```javascript
// 底部位置
ToastInstance({
  position: 'bottom',
  message: '我是提示文案，建议不超过十五字~',
});

// 顶部位置
ToastInstance({
  position: 'top',
  message: '我是提示文案，建议不超过十五字~',
});
```


### 自定义颜色 `v2.8.0`

通过 `textColor` 属性可以自定义文字颜色，通过 `iconColor` 属性可以自定义图标颜色。

```javascript
// 自定义文字颜色
ToastInstance({
  message: '我是提示文案，建议不超过十五字~',
  textColor: '#1989FA',
});

// 自定义成功提示的颜色
ToastInstance.success({
  message: '成功文案',
  textColor: '#1989FA',
  iconColor: '#1989FA',
});
```

## API

### 方法

| 方法名    | 参数   | 返回值     | 介绍   |
| ---------- | ------------ | ---------- | --------- |
| ToastInstance                     | `options \| message` | toast 实例 | 展示提示                        |
| ToastInstance.clear               | `clearAll`           | `void`     | 关闭提示                        |
| ToastInstance.fail                | `options \| message` | toast 实例 | 展示失败提示                    |
| ToastInstance.loading             | `options \| message` | toast 实例 | 展示加载提示                    |
| ToastInstance.resetDefaultOptions | -                    | `void`     | 重置默认配置，对所有 Toast 生效 |
| ToastInstance.setDefaultOptions   | `options`            | `void`     | 修改默认配置，对所有 Toast 生效 |
| ToastInstance.success             | `options \| message` | toast 实例 | 展示成功提示                    |

### Options

| 参数        | 说明               | 类型       | 默认值        |
| ----------- | ------------------------ | ---------- | ------------- |
| context     | 选择器的选择范围，可以传入自定义组件的 this 作为上下文          | _object_   | 当前页面      |
| duration    | 展示时长(ms)，值为 0 时，toast 不会消失         | _number_   | `2000`        |
| forbidClick | 是否禁止背景点击        | _boolean_  | `false`       |
| loadingType | 加载图标类型, 可选值为 `spinner`     | _string_   | `circular`    |
| mask        | 是否显示遮罩层             | _boolean_  | `false`       |
| message     | 内容                   | _string_   | `''`          |
| textColor `v2.8.0`   | 文字颜色               | _string_   | -             |
| iconColor `v2.8.0`   | 图标颜色               | _string_   | `white`       |
| onClose     | 关闭时的回调函数                  | _Function_ | -             |
| position    | 位置，可选值为 `top` `middle` `bottom`       | _string_   | `middle`      |
| selector    | 自定义选择器                  | _string_   | `#smart-toast` |
| type        | 提示类型，可选值为 `loading` `success` `fail` `warn` `html` (`^v2.0.0`支持`warn`) | _string_   | `text`        |
| zIndex      | z-index 层级                       | _number_   | `1000`        |
| width `v2.1.7`     | 自定义弹窗宽度               | _number_   | `''`        |
| nativeDisabled `v2.5.0`     | 开启弹框期间是否禁用本地手势       | _boolean_   | `false`        |

### Slot

| 名称 | 说明       |
| ---- | ---------- |
| -    | 自定义内容 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --toast-min-width `v2.6.0` | _88px_ | 提示最小宽度 |
| --toast-max-width | _70%_ | 提示最大宽度 |
| --toast-font-size | _14px_ | 提示字体大小 |
| --toast-text-color | _#fff_ | 提示文本颜色 |
| --toast-line-height | _20px_ | 提示行高 |
| --toast-border-radius | _10px_ | 提示圆角半径 |
| --toast-background-color | _fade(@black, 70%)_ | 提示背景颜色 |
| --toast-icon-size | _36px_ | 提示图标大小 |
| --toast-text-min-width `@deprecated v2.6.0` | _96px_ | 提示文本最小宽度 |
| --toast-text-padding | _@padding-xs @padding-sm_ | 提示文本内边距 |
| --toast-default-padding | _16px_ | 提示默认内边距 |
| --toast-default-width | _88px_ | 提示默认宽度 |
| --toast-default-min-height | _88px_ | 提示默认最小高度 |
