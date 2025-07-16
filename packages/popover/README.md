---
category: 反馈
new: true
version: v2.3.0
---

# Popover 弹出提示

### 介绍

v2.3.0 版本后开始加入，弹出层容器，用于展示弹窗、信息提示等轻量内容。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-popover": "@tuya-miniapp/smart-ui/lib/popover/index"
}
```

## 代码演示

### 基础用法

```html
<smart-popover show="{{show}}" placement="bottomLeft">
  <smart-button>下左弹出</smart-button>
  <view slot="overlay">
    <smart-cell-group inset>
      <smart-cell
        title="Title"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
      <smart-cell
        title="Title"
        border="{{ false }}"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
    </smart-cell-group>
  </view>
</smart-popover>

<smart-popover placement="bottom">
  <smart-button>下方弹出</smart-button>
  <view slot="overlay">
    <smart-cell-group inset>
      <smart-cell
        title="Title"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
      <smart-cell
        title="Title"
        border="{{ false }}"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
    </smart-cell-group>
  </view>
</smart-popover>

<smart-popover placement="bottomRight">
  <smart-button>下右弹出</smart-button>
  <view slot="overlay">
    <smart-cell-group inset>
      <smart-cell
        title="Title"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
      <smart-cell
        title="Title"
        border="{{ false }}"
      >
        <smart-icon
          class="cell-icon"
          slot="icon"
          name="{{ sunMaxFill }}"
          size="24px"
          color="#3678E3"
        />
      </smart-cell>
    </smart-cell-group>
  </view>
</smart-popover>

<smart-popover placement="top">
  <smart-button>上方弹出</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
<smart-popover placement="left">
  <smart-button>左侧弹出</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
<smart-popover placement="right">
  <smart-button>右侧弹出</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
<smart-popover placement="bottom">
  <smart-button>下方弹出</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
```

```javascript
import Sun from '@tuya-miniapp/icons/dist/svg/Sun';

Page({
  data: {
    show: false,
    sunMaxFill: Sun,
  },
  methods: {
    onClose() {
      this.setData({ show: false });
    },
  },
});
```

### 受控用法

通过`show`属性控制弹出层是否展示。

```html
<smart-popover show="{{show}}" placement="top" bind:close="onClose">
  <smart-button>上方弹出</smart-button>
  <view slot="overlay">
    tip
  </view>
</smart-popover>
```

```js
Page({
  data: {
    show: false,
  },
  methods: {
    onClose() {
      this.setData({ show: false });
    },
    onShow(e) {
      this.setData({ show: e.detail });
    }
  },
});
```

### 弹出位置

通过`position`属性设置弹出位置，默认居右弹出，可以设置为`top`、`topLeft`、`topRight`、`bottom`、`bottomLeft`、`bottomRight`、`left`、`leftTop`、`leftBottom`、`right`、`rightTop`、`rightBottom`。

```html
<smart-popover
  show="{{ show }}"
  position="top"
  custom-style="height: 20%;"
  bind:close="onClose"
  bind:show-change=“onShow”
/>
```

## API

### Props
| 参数        | 说明                                                                                                                                                           | 类型      | 默认值  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| custom-style | 自定义弹出层样式                                                                                                                                               | _string_  | `''`    |
| duration    | 延迟关闭的时间(ms)                                                                                                                                             | number    | `3000`  |
| placement   | 弹出层的位置，支持值：`top`、`topLeft`、`topRight`、`bottom`、`bottomLeft`、`bottomRight`、`left`、`leftTop`、`leftBottom`、`right`、`rightTop`、`rightBottom` | _string_  | `right` |
| show        | 控制弹出层是否显示，并监听状态变化，值变更时更新 `currentShow`                                                                                                 | _boolean_ | `false` |
| trigger  `v2.5.0`      | 控制弹出层触发方式，支持 `tap`、`longpress`                                                                                                  | _string_ | `tap` |

### Events

| 事件名           | 说明            | 参数 |
| ---------------- | --------------- | ---- |
| bind:close       | 关闭时触发      | -    |
| bind:show-change | 显示/隐藏时触发 | -    |

### Popover Slot

| 名称 | 说明       |
| ---- | ---------- |
| overlay    | 弹窗内容 |

### 外部样式类

| 类名         | 说明         |
| ------------ | ------------ |
| custom-class | 根节点样式类 |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider 组件](/material/smartui?comId=config-provider&appType=miniapp)。

| 名称                       | 默认值                              | 描述         |
| -------------------------- | ----------------------------------- | ------------ |
| --popover-background-color | #fff                                | 弹出层背景色 |
| --popover-border-radius    | 12px                                | 弹出层圆角   |
| --popover-box-shadow       | 0px 6px 12px 0px rgba(0, 0, 0, 0.1) | 弹出层阴影   |
| --popover-padding          | 12px                                | 弹出层内边距 |

