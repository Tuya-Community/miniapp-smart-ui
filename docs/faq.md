---
category: 开发指南
---

# 常见问题

一些开发的常见问题

## 获取组件实例

```html
<picker id="myPicker" columns="{{[]}}" />
```
```js
const picker = this.selectComponent('#myPicker');
console.log(picker, '----picker');
```