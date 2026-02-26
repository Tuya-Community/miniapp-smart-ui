---
name: add-miniapp-component
description: Scaffolds a new SmartUI miniapp component under packages, including index files, demo, test, and optional README. Use when the user wants to add a new component, create a component from scratch, or scaffold a miniapp component.
---

# 新增 SmartUI 组件

在 `packages/<组件名>/` 下按本仓库约定搭好目录与文件，仅改 packages，不改 example。

## 步骤

### 1. 创建目录与基础文件

在 `packages/<组件名>/` 下创建：

- `index.json`：`"component": true`，子组件在 `usingComponents` 中写相对路径，如 `"smart-icon": "../icon/index"`
- `index.ts`：用 `SmartComponent`（来自 `../common/component`）封装，按需从 `../mixins/` 引入
- `index.wxml`：模板
- `index.less`：样式（可为空）
- 若需模板内计算再建 `index.wxs`，**仅写 ES5**

### 2. 创建 demo

在 `packages/<组件名>/demo/` 下创建：

- `index.json`：`usingComponents` 中声明本组件（如 `"smart-xxx": "../index"`）和 `demo-block`（`"demo-block": "../../../example/components/demo-block/index"`）
- `index.wxml`：用 `<demo-block title="{{I18n.t('key')}}">` 包裹示例，文案一律用 `I18n.t('key')`
- `index.ts`：Page 或 Component 逻辑
- `index.less`：demo 用样式

### 3. 维护多语言

在 `example/i18n/strings.json` 的 `en`、`zh` 下为 demo 用到的 key 补全文案（如 `basicUsage`、`title` 等）。

### 4. 添加测试

在 `packages/<组件名>/test/` 下创建 `demo.spec.ts`：

```typescript
import path from 'path';
import simulate from 'miniprogram-simulate';

test('should render demo and match snapshot', () => {
  const id = simulate.load(path.resolve(__dirname, '../demo/index'), {
    rootPath: path.resolve(__dirname, '../../'),
  });
  const comp = simulate.render(id);
  comp.attach(document.createElement('parent-wrapper'));
  expect(comp.toJSON()).toMatchSnapshot();
});
```

执行 `yarn test`，必要时 `npx jest -u` 生成/更新快照。

### 5. 可选：README

新增或后续补全 `README.md`、`README.en.md`，结构参考同仓库其他组件（引入方式、代码演示、API）。README 内示例按中/英区块书写，不调用 I18n。

## 检查清单

- [ ] 仅修改了 `packages/<组件名>/`，未改 example 业务代码
- [ ] `index.json` 中 `usingComponents` 路径正确
- [ ] demo 文案均用 `I18n.t('key')`，且 key 已在 `example/i18n/strings.json` 的 en/zh 中维护
- [ ] 存在 `test/demo.spec.ts` 且 `yarn test` 通过（含快照）
