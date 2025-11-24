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

`ConfigProvider` 组件提供了覆盖 CSS 变量的能力，你需要在组件节点外包裹一个 `ConfigProvider` 组件，并通过 `theme-vars` 属性来配置一些主题变量，其入参就是组件的CSS 变量变成驼峰形式。

```html
<view class="demo-buttons">
  <smart-button type="primary" data-color="red" color="red" bind:click="onChange">
    设置为红色
  </smart-button>
  <smart-button type="primary" data-color="green" color="green" bind:click="onChange">
    设置为绿色
  </smart-button>
  <smart-button type="primary" data-color="blue" color="blue" bind:click="onChange">
    设置为蓝色
  </smart-button>
</view>
<smart-config-provider theme-vars="{{ themeVars }}">
  <smart-button type="primary">主按钮</smart-button>
</smart-config-provider>
```

```js
Page({
  data: {
    themeVars: {
      buttonPrimaryBorderColor: 'red',
      buttonPrimaryBackgroundColor: 'red',
    },
  },

  onChange(event) {
    const { color } = event.currentTarget.dataset;
    this.setData({
      themeVars: {
        buttonPrimaryBorderColor: color,
        buttonPrimaryBackgroundColor: color,
      },
    });
  },
});
```

### 主题切换 `v2.7.4`

`ConfigProvider` 组件支持通过 `theme` 属性来切换明暗主题，可选值为 `light` 和 `dark`。

```html
<view class="demo-buttons">
  <smart-button type="primary" data-theme="light" bind:click="onThemeChange">
    浅色主题
  </smart-button>
  <text>当前主题：{{ currentTheme }}</text>
  <smart-button type="primary" data-theme="dark" bind:click="onThemeChange">
    深色主题
  </smart-button>
</view>
<smart-config-provider theme="{{ currentTheme }}">
  <smart-cell-group>
    <smart-cell title="标题" value="内容" />
    <smart-cell title="标题" value="内容" label="详细信息" is-link />
  </smart-cell-group>
</smart-config-provider>
```

```js
Page({
  data: {
    currentTheme: 'light',
  },

  onThemeChange(event) {
    const { theme } = event.currentTarget.dataset;
    this.setData({
      currentTheme: theme,
    });
  },
});
```

## API

### Props

| 参数       | 说明           | 类型     | 默认值 |
| ---------- | -------------- | -------- | ------ |
| theme-vars | 自定义主题变量 | _object_ | -      |
| theme   `v2.7.4`      | 主题模式       | _'light'\/'dark'_ | -      |

