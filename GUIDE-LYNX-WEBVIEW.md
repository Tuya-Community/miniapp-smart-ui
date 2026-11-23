# Ray 项目接入 Smart UI Lynx

React/Ray 业务优先安装配套的 `@ray-js/smart-ui`，由包装层精确依赖本底层库；不再要求每个业务复制适配器或访问组件库源码。

当前新接口在包装层源码候选 `2.13.7-lynx.2` 中，尚未发布 npm。已发布的 `2.13.7-canary.bcodex-pr-240-ray-canary.s6a37075.44710305558.1` 只固定了底层依赖，尚没有 withSmartUI / SmartUIPage，不能套用新接口。旧业务可继续保留已验证的 bridge，待安装新候选或其正式发布版本再移除。

## 三步接入

1. 安装新包装层版本；本地候选使用构建打出的 tgz，并随业务仓库保存以供 CI 重装。底层包自动安装，业务不再额外锁底层版本。
2. `ray.config.ts` 用 `withSmartUI(existingConfig)` 合并配置。纯 WebView 对照构建传 `{ renderer: 'webview' }`；默认 mixed 保留双端实现，不承诺组件资产已逐页面裁剪。
3. 每个页面静态包一层 `SmartUIPage`，renderer 复用该页面的 native/webview 配置。组件和 ToastInstance/DialogInstance 导入及用法保持原样。

```tsx
import { SmartUIPage, Popup, Picker } from '@ray-js/smart-ui';
import pageConfig from './index.config';

export default function Page() {
  return <SmartUIPage renderer={pageConfig.renderer}><Content /></SmartUIPage>;
}
```

页面配置没有 renderer 字段时，可省略边界上的 renderer（默认 webview），或先在配置里显式声明 webview。不要为 Smart UI 新建另一份路由模式表。边界静态挂载 Dialog/Toast；Notify 如有使用，在同一边界内静态挂载相应 id 的 Notify。

详细的配置、实例 context、宿主检查、依赖 registry 和验收要求以包装层的 `README-LYNX.md` 为准。本底层库继续提供默认 dist/lib 和隔离的 lynx/dist、lynx/lib。原生小程序直接接入仍可使用 `@tuya/miniapp-smart-ui/lynx/lib/<组件>/index`，不依赖 React 包装层。

## 历史接法

[旧适配器附录](GUIDE-LYNX-WEBVIEW-DETAILS.md) 仅供尚未升级包装层的既有项目维护，不是新版本的接入前置。源码构建、npm 发布、业务采用和真机生效是独立阶段；安装新包后须重新验证目标平台、主题、页面交互及原生层命中。
