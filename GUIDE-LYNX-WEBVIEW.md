# 其它 Ray 项目如何接入

项目已能运行 Lynx 页面时，按下面 4 步接入，WebView 页面继续保留。

**当前需要配套适配器；只升级 npm 包还不够。** 底层完整包的构建修复尚未发布，下面的版本号要换成后续确认的完整版本。

## 1. 安装依赖

在业务项目执行：

```bash
yarn add --exact '@tuya/miniapp-smart-ui@填写完整版本' @ray-js/smart-ui@2.13.3 @ray-js/components-ty-slider@0.3.10-beta.3
```

## 2. 准备适配器

在业务项目目录执行，替换组件库源码路径（使用与安装包对应的源码）：

```bash
export BUSINESS_PROJECT="$PWD"
cd /你的路径/miniapp-smart-ui
yarn build
SMART_UI_RAY_WRAPPER_ROOT="$BUSINESS_PROJECT/node_modules/@ray-js/smart-ui" \
SMART_UI_TY_SLIDER_ROOT="$BUSINESS_PROJECT/node_modules/@ray-js/components-ty-slider" \
SMART_UI_RAY_OUTPUT_ROOT="$BUSINESS_PROJECT/.generated/smart-ui-bridge" \
yarn build:lynx:ray
```

这一步在当前机器生成双渲染包装层；CI 打包时也执行，换机器后重新生成。

## 3. 配置引用

业务 `ray.config.ts` 合并以下配置，保留已有别名和转换器：

```ts
import path from 'node:path';
import { createRequire } from 'node:module';
import SmartUIAutoImport from '@ray-js/smart-ui/lib/auto-import';

const nodeRequire = createRequire(__filename);

export default {
  importTransformer: [SmartUIAutoImport],
  resolveAlias: {
    '@ray-js/smart-ui': path.resolve(__dirname, '.generated/smart-ui-bridge'),
    '@tuya-miniapp/smart-ui': path.dirname(
      nodeRequire.resolve('@tuya/miniapp-smart-ui/package.json')
    ),
  },
};
```

`tsconfig.json` 合并以下类型路径（`baseUrl` 为项目根目录）：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ray-js/smart-ui": [".generated/smart-ui-bridge/es/index.d.ts"],
      "@ray-js/smart-ui/*": [".generated/smart-ui-bridge/es/*"]
    }
  }
}
```

## 4. 组件按页面传模式

导入方式保持原样，Lynx 页面显式传 `renderMode="lynx"`：

```tsx
import { Popup, Picker } from '@ray-js/smart-ui';

// show、columns、close 沿用业务自己的状态和回调。
<Popup renderMode="lynx" show={show} position="bottom" onClickOverlay={close}>
  <Picker renderMode="lynx" columns={columns} />
</Popup>
```

WebView 页面不传，默认就是 WebView。两种页面共用的业务组件，根据**当前页面 renderer** 传 `'lynx'` 或 `'webview'`；Popup 和里面的 Picker 都要传。

另外记住一项：Lynx 页面的 Toast / Dialog / Notify，实例调用分别使用 `LynxToastInstance` / `LynxDialogInstance` / `LynxNotifyInstance`，并挂载同模式的对应组件。

接完分别打开一个 Lynx 页面和一个 WebView 页面，确认弹层能打开、文字能显示、选择能操作。

原生小程序接法、完整示例和排查说明，需要时看 [详细附录](GUIDE-LYNX-WEBVIEW-DETAILS.md)。
