---
category: 通用
---

# ConfigProvider 全局配置

### 介绍

用于配置 Smart UI 组件的主题样式。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-config-provider": "@tuya-miniapp/smart-ui/lib/config-provider/index"
}
```

## 定制主题

### 介绍

Smart UI 组件通过丰富的 [CSS 变量](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties) 来组织样式，通过覆盖这些 CSS 变量，可以实现**定制主题、动态切换主题**等效果。

#### 示例

以 Button 组件为例，查看组件的样式，可以看到 `.smart-button--primary` 类名上存在以下变量：

```css
.smart-button--primary {
  color: var(--button-primary-color, #fff);
  background: var(--button-primary-background-color, #07c160);
  border: var(--button-border-width, 1px) solid var(
      --button-primary-border-color,
      #07c160
    );
}
```

### 自定义 CSS 变量

#### 通过 CSS 覆盖

你可以直接在代码中覆盖这些 CSS 变量，Button 组件的样式会随之发生改变：

```css
/* 添加这段样式后，Primary Button 会变成红色 */
page {
  --button-primary-background-color: red;
}
```

#### 通过 ConfigProvider 覆盖

`ConfigProvider` 组件提供了覆盖 CSS 变量的能力，你需要在根节点包裹一个 `ConfigProvider` 组件，并通过 `theme-vars` 属性来配置一些主题变量，其入参就是组件的CSS 变量变成驼峰形式。

```html
<smart-config-provider theme-vars="{{ themeVars }}">
  <smart-cell-group>
    <smart-field label="评分">
      <view slot="input" style="width: 100%">
        <smart-rate
          model:value="{{ rate }}"
          data-key="rate"
          bind:change="onChange"
        />
      </view>
    </smart-field>
    <smart-field label="滑块" border="{{ false }}">
      <view slot="input" style="width: 100%">
        <smart-slider
          value="{{ slider }}"
          data-key="slider"
          bind:change="onChange"
        />
      </view>
    </smart-field>
  </smart-cell-group>

  <view style="margin: 16px">
    <smart-button round block type="primary">提交</smart-button>
  </view>
</smart-config-provider>
```

```js
import Page from '../../common/page';

Page({
  data: {
    rate: 4,
    slider: 50,
    themeVars: {
      rateIconFullColor: '#07c160',
      sliderBarHeight: '4px',
      sliderButtonWidth: '20px',
      sliderButtonHeight: '20px',
      sliderActiveBackgroundColor: '#07c160',
      buttonPrimaryBorderColor: '#07c160',
      buttonPrimaryBackgroundColor: '#07c160',
    },
  },

  onChange(event) {
    const { key } = event.currentTarget.dataset;
    this.setData({
      [key]: event.detail,
    });
  },
});
```

## API

### Props

| 参数       | 说明           | 类型     | 默认值 |
| ---------- | -------------- | -------- | ------ |
| theme-vars | 自定义主题变量 | _object_ | -      |
