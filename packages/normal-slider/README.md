---
category: 数据录入
---

# Slider 滑块

### 介绍

滑动输入条，用于在给定的范围内选择一个值。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-slider": "@tuya-miniapp/smart-ui/lib/normal-slider/index"
}
```

## 代码演示

### 普通滑动条

> 注意 instanceId 值必选，需要设置为一个字符串值且不能数字开头，每个 slider 实例的 instanceId 不同

```html
<smart-slider
  instanceId="slider1"
  trackStyle="height:4px"
  barStyle="height:4px"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### 间隔滑动条

设置 `step` 属性可开启间隔拖动模式

```html
<smart-slider
  instanceId="slider2"
  trackStyle="height:8px"
  barStyle="height:8px"
  thumbStyle="width:18px;height:18px;"
  stepStyle="width:4px;height:4px;"
  activeStepStyle="background:#fff;"
  showSteps="{{true}}"
  step="{{10}}"
  min="{{0}}"
  max="{{100}}"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### 间隔滑动条隐藏滑块

设置 `hideThumbButton` 为 `true` 可以隐藏滑块

```html
<smart-slider
  instanceId="slider3"
  trackStyle="height:40px;border-radius:16px;"
  barStyle="height:40px;border-radius:16px;"
  thumbStyle="width:18px;height:18px;"
  stepStyle="width:4px;height:12px;border-radius:4px;"
  activeStepStyle="width:4px;height:12px;border-radius:4px;background:#fff;"
  hideThumbButton="{{true}}"
  showSteps="{{true}}"
  step="{{30}}"
  min="{{0}}"
  max="{{90}}"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```


```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### 拖动滑动条

设置 `parcel` 为true，可以使滑块包裹在滑条内。

```html
<smart-slider
  instanceId="slider4"
  parcel="{{true}}"
  parcelMargin="{{2}}"
  trackStyle="height:26px;border-radius:13px;"
  barStyle="height:22px;border-radius:13px;"
  thumbStyle="width:20px;height:20px;background:#fff;border-radius:50%;"
  parcelThumbWidth="{{18}}"
  parcelThumbHeight="{{18}}"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```


### 拖动滑动条自定义样式1

可通过 `trackStyle`、`barStyle`、`thumbStyle` 自定义滑槽、滑动条、滑块的样式

```html
<smart-slider
  instanceId="slider5"
  trackStyle="height:45px;border-radius:8px;"
  barStyle="height:45px;border-radius:8px;"
  thumbStyle="width:15px;height:50px;background:#BBC5D4;border:2px solid #FFFFFF;box-shadow:0px 0px 2px 0px rgba(0, 0, 0, 0.5);border-radius:2px;"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```


### 拖动滑动条自定义样式2

```html
<smart-slider
  instanceId="slider6"
  parcel="{{true}}"
  parcelMargin="{{2}}"
  trackStyle="height:26px;border-radius:5px;"
  barStyle="height:22px;border-radius:5px;"
  parcelThumbWidth="{{3}}"
  parcelThumbHeight="{{16}}"
  thumbStyle="width:5px;height:16px;background:#fff;"
  value="{{currentValue}}"
  bind:change="onChange"
/>
```

```js
Page({
  data: {
    currentValue: 50,
  },
  onChange(event) {
    this.setData({
      currentValue: event.detail.value,
    });
  },
});
```

### 双滑块滑动条

两个滑块的滑动条，需要引用：

```json
"usingComponents": {
  "smart-range-slider": "@tuya-miniapp/smart-ui/lib/slider/index"
}
```

```html
<smart-range-slider
  min="{{0}}"
  max="{{100}}"
  value="{{range}}"
  bind:change="onRangeChange"
  bar-height="4px"
  inactive-color="#D8D9DC"
  active-color="#007AFF"
/>
```

```js
Page({
  data: {
    range: [10, 40],
  },
  onRangeChange(event) {
    this.setData({
      range: event.detail,
    });
  },
});
```

### 竖向

```html
<smart-slider
  instanceId="slider7"
  direction="vertical"
  reverse
  step="{{5}}"
  min="{{0}}"
  max="{{100}}"
  parcel
  parcelMargin="{{2}}"
  useParcelPadding="{{false}}"
  parcelThumbWidth="{{12}}"
  parcelThumbHeight="{{2}}"
  thumbStyle="width: 12px;height:2px;border-radius:2px;background: #FFFFFF;"
  trackStyle="width:48px;height:203px;border-radius:10px;background:rgba(0, 0, 0, 0.08);"
  barStyle="width:48px;height:114px;background:#1989FA;"
/>
```

## API

### Props

| 参数                             | 说明                                   | 类型         | 默认值   |
| -------------------------------- | -------------------------------------- | ------------ | -------- |
| active-step-style                | 激活阶段样式                           | _string_     | null     |
| bar-style                        | 滑条样式                               | _string_     | null     |
| class-name                       | css 样式名                             | _string_     | null     |
| direction                        | 滑条方向（"horizontal"                 | "vertical"） | _string_ | null |
| disable                          | 是否禁用滑块                           | _boolean_    | false    |
| enable-touch                     | 是否启用触摸跳跃                       | _boolean_    | true     |
| enable-touch-bar                 | 是否启用触摸 bar 增加偏移              | _boolean_    | false    |
| hidden                           | 是否隐藏组件                           | _boolean_    | null     |
| hide-bar-on-first-render         | 是否在首次渲染时隐藏 bar               | _boolean_    | false    |
| hide-thumb                       | 是否隐藏滑块                           | _boolean_    | false    |
| hide-thumb-button                | 是否隐藏 thumb 按钮                    | _boolean_    | false    |
| hot-area-style                   | 点击热区样式                           | _string_     | null     |
| instance-id                      | 唯一 ID                                | _string_     | null     |
| max                              | 最大值                                 | _number_     | 100      |
| min                              | 最小值                                 | _number_     | 0        |
| parcel                           | 是否启用 parcel 模式                   | _boolean_    | false    |
| parcel-margin                    | parcel 模式下滑块边距                  | _number_     | 0        |
| parcel-thumb-height              | parcel 模式下滑块高度                  | _number_     | null     |
| parcel-thumb-width               | parcel 模式下滑块宽度                  | _number_     | null     |
| reverse                          | 是否反转滑条                           | _boolean_    | false    |
| show-steps                       | 是否显示阶段提示                       | _boolean_    | false    |
| show-text                        | 是否在 bar 上显示文本                  | _boolean_    | null     |
| step                             | 阶段值                                 | _number_     | 1        |
| step-style                       | 阶段样式                               | _string_     | null     |
| text-style                       | 文本样式                               | _string_     | null     |
| text-template                    | 文本格式化模板，例如 "比率 {{text}} %" | _string_     | null     |
| thumb-height                     | 滑块高度                               | _number_     | null     |
| thumb-style                      | 滑块样式                               | _string_     | null     |
| thumb-style-calc                 | 动态计算 thumb 样式                    | _null_       | null     |
| thumb-style-render-formatter     | 自定义 thumb 样式渲染格式化函数        | _null_       | null     |
| thumb-style-render-value-reverse | 是否反转 thumb 样式渲染的值            | _boolean_    | false    |
| thumb-style-render-value-scale   | 自定义 thumb 样式渲染时的值缩放比例    | _number_     | 1        |
| thumb-style-render-value-start   | 自定义 thumb 样式渲染时的起始值        | _number_     | 1        |
| thumb-width                      | 滑块宽度                               | _number_     | null     |
| thumb-wrap-style                 | 滑块包装样式                           | _null_       | null     |
| track-style                      | 轨道样式                               | _string_     | null     |
| value                            | 右滑块初始值/单向滑条初始值            | _number_     | 0        |

### Slot

| 名称  | 说明     |
| ----- | -------- |
| bar | 滑动条插槽 |
| thumb | 滑块插槽 |

### Events

| 事件名      | 说明         | 参数                         |
| ----------- | ------------ | ---------------------------- |
| bind:change | 值改变后触发 | event.detail.value: 当前进度 |
| bind:end    | 拖动松手触发 | event.detail.value: 当前进度 |
| bind:start  | 拖动前触发   | event.detail.value: 当前进度 |
