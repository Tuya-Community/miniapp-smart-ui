---
category: 反馈
---

# SwipeCell 滑动单元格

### 介绍

可以左右滑动来展示操作按钮的单元格组件。

### 引入

在`app.json`或`index.json`中引入组件，详细介绍见[快速上手](/material/smartui?comId=help-getting-started&appType=miniapp)。

```json
"usingComponents": {
  "smart-swipe-cell": "@tuya-miniapp/smart-ui/lib/swipe-cell/index"
}
```

## 代码演示

### 基础用法

```html
<smart-swipe-cell right-width="{{ 65 }}" left-width="{{ 65 }}" bind:tabClose="onTabClose">
  <view slot="left" class="smart-swipe-cell__left">选择</view>
  <smart-cell-group>
    <smart-cell title="单元格" value="内容" />
  </smart-cell-group>
  <view slot="right" class="smart-swipe-cell__right">删除</view>
</smart-swipe-cell>
```

```js
Page({
  onTabClose(event) {
    console.log('onTabClose: ', event.detail);
  },
});
```

### 异步关闭

当开启`async-close`时， 通过绑定`close`事件，可以自定义两侧滑动内容点击时的关闭行为。

```html
<smart-swipe-cell
  id="swipe-cell"
  right-width="{{ 65 }}"
  left-width="{{ 65 }}"
  async-close
  bind:close="onAsyncClose"
>
  <view slot="left">选择</view>
  <smart-cell-group>
    <smart-cell title="单元格" value="内容" />
  </smart-cell-group>
  <view slot="right">删除</view>
</smart-swipe-cell>
```

```js
Page({
  onAsyncClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
        });
        break;
    }
  },
});
```

### 主动打开

```html
<smart-swipe-cell
  id="swipe-cell2"
  right-width="{{ 65 }}"
  left-width="{{ 65 }}"
  name="示例"
  bind:open="onOpen"
>
  <view slot="left" class="smart-swipe-cell__left">选择</view>
  <smart-cell-group>
    <smart-cell title="单元格" value="内容" />
  </smart-cell-group>
  <view slot="right" class="smart-swipe-cell__right">删除</view>
</smart-swipe-cell>
```

```js
import ToastInstance from '@tuya-miniapp/smart-ui/dist/toast/toast';

Page({
  onOpen(event) {
    const { position, name } = event.detail;
    switch (position) {
      case 'left':
        ToastInstance({
          context: this,
          type: 'primary',
          message: `${name}${position}部分展示open事件被触发`,
        });
        break;
      case 'right':
        ToastInstance({
          context: this,
          type: 'primary',
          message: `${name}${position}部分展示open事件被触发`,
        });
        break;
    }
  },
});
```

## API

### Props

| 参数        | 说明                                    | 类型               | 默认值  |
| ----------- | --------------------------------------- | ------------------ | ------- |
| async-close | 是否异步关闭                            | _boolean_          | `false` |
| disabled    | 是否禁用滑动                            | _boolean_          | `false` |
| left-width  | 左侧滑动区域宽度                        | _number_           | `0`     |
| name        | 标识符，可以在 close 事件的参数中获取到 | _string \| number_ | -       |
| right-width | 右侧滑动区域宽度                        | _number_           | `0`     |

### Slot

| 名称  | 说明           |
| ----- | -------------- |
| -     | 自定义显示内容 |
| left  | 左侧滑动内容   |
| right | 右侧滑动内容   |

### Events

| 事件名     | 说明       | 参数                                                      |
| ---------- | ---------- | --------------------------------------------------------- |
| bind:click | 点击时触发 | 关闭时的点击位置 (`left` `right` `cell` `outside`)        |
| bind:tabClose `v2.7.0` | 关闭时触发 | 关闭的位置 (`left` `right`)        |
| bind:close | 点击异步关闭时触发 | { position: 'left' \| 'right' , instance , name: string } |
| bind:open  | 打开时触发 | { position: 'left' \| 'right' , name: string }            |

### close 参数

| 参数     | 类型     | 说明                                               |
| -------- | -------- | -------------------------------------------------- |
| instance | _object_ | SwipeCell 实例                                     |
| name     | 标识符   | _string_                                           |
| position | _string_ | 关闭时的点击位置 (`left` `right` `cell` `outside`) |

### 方法

通过 selectComponent 可以获取到 SwipeCell 实例并调用实例方法

| 方法名 | 参数                      | 返回值 | 介绍             |
| ------ | ------------------------- | ------ | ---------------- |
| close  | -                         | -      | 收起单元格侧边栏 |
| open   | position: `left \| right` | -      | 打开单元格侧边栏 |
