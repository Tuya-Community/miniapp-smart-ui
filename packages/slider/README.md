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
  bind:end="onChange"
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
  bind:end="onChange"
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
  bind:end="onChange"
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
  bind:end="onChange"
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
  bind:end="onChange"
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
  bind:end="onChange"
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

添加 `range` 属性就可以开启双滑块模式，确保 `value` 的值是一个数组。

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
| bar `v.2.4.0` | 滑动条插槽 |
| thumb `v.2.4.0` | 滑块插槽 |

### Events

| 事件名      | 说明         | 参数                         |
| ----------- | ------------ | ---------------------------- |
| bind:change | 值改变后触发 | event.detail.value: 当前进度 |
| bind:end    | 拖动松手触发 | event.detail.value: 当前进度 |
| bind:start  | 拖动前触发   | event.detail.value: 当前进度 |

## 双滑块滑动条 API

### 双滑块滑动条 Props

| 参数              | 说明                                     | 类型                 | 默认值    |
| ----------------- | ---------------------------------------- | -------------------- | --------- |
| active-color      | 进度条激活态颜色                         | _string_             | `#1989fa` |
| bar-height        | 进度条高度，默认单位为 `px`              | _string \| number_   | `2px`     |
| disabled          | 是否禁用滑块                             | _boolean_            | `false`   |
| inactive-color    | 进度条默认颜色                           | _string_             | `#e5e5e5` |
| max               | 最大值                                   | _number_             | `100`     |
| min               | 最小值                                   | _number_             | `0`       |
| range `v1.8.4`    | 是否开启双滑块模式                       | _boolean_            | `false`   |
| step              | 步长                                     | _number_             | `1`       |
| use-button-slot   | 是否使用按钮插槽                         | _boolean_            | `false`   |
| value             | 当前进度百分比，在双滑块模式下为数组格式 | _number \| number[]_ | `0`       |
| vertical `v1.8.5` | 是否垂直展示                             | _boolean_            | `false`   |

### 双滑块滑动条 Events

| 事件名          | 说明             | 参数                         |
| --------------- | ---------------- | ---------------------------- |
| bind:change     | 进度值改变后触发 | event.detail: 当前进度       |
| bind:drag       | 拖动进度条时触发 | event.detail.value: 当前进度 |
| bind:drag-end   | 结束拖动时触发   | -                            |
| bind:drag-start | 开始拖动时触发   | -                            |

### 双滑块滑动条外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### 双滑块滑动条 Slots

| 名称                  | 说明                                | 参数                |
| --------------------- | ----------------------------------- | ------------------- |
| button                | 自定义滑块按钮                      | _{ value: number }_ |
| left-button `v1.8.4`  | 自定义左侧滑块按钮（双滑块模式下）  | _{ value: number }_ |
| right-button `v1.8.4` | 自定义右侧滑块按钮 （双滑块模式下） | _{ value: number }_ |

### 样式变量

双滑块滑动条样式变量  
  
组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                          | 默认值                                 | 描述 |
| ----------------------------- | -------------------------------------- | ---- |
| --slider-active-background-color  | _#1989fa_                               | 活动状态背景颜色   |
| --slider-inactive-background-color| _#ebedf0_                               | 非活动状态背景颜色 |
| --slider-disabled-opacity         | _0.3_                                   | 禁用状态透明度     |
| --slider-bar-height               | _2px_                                   | 滑动条高度         |
| --slider-button-width             | _24px_                                  | 滑块按钮宽度       |
| --slider-button-height            | _24px_                                  | 滑块按钮高度       |
| --slider-button-border-radius     | _50%_                                   | 滑块按钮边框圆角   |
| --slider-button-background-color  | _#fff_                                  | 滑块按钮背景颜色   |
| --slider-button-box-shadow        | _0 1px 2px rgba(0, 0, 0, 0.5)_          | 滑块按钮阴影       |
| --slider-thumb-color              | _var(--app-B3, #ffffff)_                | 滑块拇指颜色       |
