# Field 不限长原生兼容与路径命名验收

负责人：田坤；AI 工具：Codex；日期：2026-11-16。

## 根因与实现

Android 15 / OnePlus PJD110 / TEST-涂鸦 7.13.0 / Lynx 4.0.2，IPC 移动摄像机“路径→创建路径→设置名称”的 Field 传 `maxlength=-1`。原生输入节点有尺寸、可命中且已聚焦，但键盘输入没有文字；临时只将原生 maxlength 改为 500 后立即能输入，Field change 和业务值正常更新。同机 WebView 原实现可输入、取消后页面正常。

- `build/lynx.cjs` 仅对 Lynx Field 的 input/textarea 生成模板，将 -1 映射为 `1000000000`。公开 props/JS 仍为 -1，显式 0/正数不变，业务 50 Unicode 码点校验继续生效。
- INT_MAX 数字及十进制字符串经当前桥接后均不可作为安全替代；使用经过真机验证的十亿原生上限，理论上限属于组件兼容限制，不宣称数学意义的无限字符。没有将业务限制偷偷改为 50 个 UTF-16 单元。
- 原版 `packages/`、WebView `dist/`、`lib/` 不变，没有修改 node_modules 或底座。
- 另发现调用方直接卸载整个 Dialog 后，安卓原生遮罩仍命中旧节点，逻辑树已经没有对应 Dialog。改 Popup 为直属遮罩、加 flatten=false 的探针均未解决，已全部撤回，不保留无效通用改动。IPC 调用方最终由跨子场景存活的 PathManager 持有唯一受控 NameInputDialog，通过 show=false 执行既有清理；只在 PathList 内保留挂载仍会在保存切页时提前卸载。

## 验证

- `yarn build:lynx` / `yarn verify:package` 通过：70 组件，WebView SHA 基线不变，1139 必需文件 / 2342 总文件。
- `yarn test:lynx`：53 项通过；生成模板覆盖 input/textarea 的 -1、0、1、50、1000 映射。
- `yarn test:lynx:render`：13 项通过；100 个扩展 Unicode 字符不限长、显式正数截断，原 Image load/error 等回归保留。模拟器不作为原生长度滤镜与遮罩的验收依据。
- 原版 `yarn test --runInBand`：本轮早先运行 117 suites / 1094 tests / 51 snapshots 通过，后续未改 WebView 源码；SHA 校验仍通过。
- IPC 本地源重构建并定向推送安卓小程序缓存后，真实输入 LynxRouteProbe，取消后白底恢复，再点创建成功重开，输入 ReopenPassed 回显；最后取消，无保存创建操作。Field 公开属性仍为 -1，原生显示 1e+09。
- DevTool getNodeForLocation 在隐藏后仍可能返回 display:none 的旧节点；结合截图、节点 display 和真实按钮重开验证，不单凭该命中 API 判定拦截残留。
- 截图和日志在业务仓忽略目录 `.clix/tmp/android-route-name-20261116/`：`webview-typed.png`、`webview-cancelled.png`、`lynx-typed.png`、`lynx-cancelled.png`、`lynx-reopened-typed.png`。

IPC 进一步将 NameField 限定为 show=true 时挂载，保留 Dialog 外壳，解决始终挂载输入早于弹窗原生内容导致首次预填为空。安卓真实点击编辑入口后可预填“巡航”，追加 RenameProbe 回显，取消重开恢复“巡航”；最终新建输入 FinalCreateProbe、取消重开为空。编辑入口使用共用 PopupTitle 右按钮，避免图标被标题覆盖。

仅声明当前安卓浅色、新增与改名输入/预填/取消/重开通过。未实际保存创建、未验证 iOS/深色/大屏；不声明所有直接卸载的 Popup 均修复。正式 npm 仍是旧包，业务须显式 IPC_SMART_UI_DEBUG_SOURCE 使用本仓构建，正式生效需另行发布升级。

## 同日补充：保存成功切页

用户真实保存后反馈整屏遮罩。核对手机六份关键产物与上一轮本地 SHA 一致，确认不是旧包；IPC PathList 在快速设备应答后切场景，仍提前卸载 Dialog。业务已提升 Dialog 到 PathManager，SDK 本次不新增改动。真实 PathManager/PathList React 回归先红后绿；安卓通过受控确认回调立即切 EDIT_PATH_POINT，真实点击保存后 Dialog 仍挂载且 show=false，原生树全屏遮罩消失、白底恢复、返回按钮可用。该真机验证未发送真实创建 DP，不代替设备创建链路验收；细节与截图见 IPC DevLog 同名追加记录。
