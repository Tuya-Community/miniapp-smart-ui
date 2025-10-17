---
category: Guide
---

# FAQ

Some common issues of development

## Get component instance

```html
<picker id="myPicker" columns="{{[]}}" />
```
```js
const picker = this.selectComponent('#myPicker');
console.log(picker, '----picker');
```