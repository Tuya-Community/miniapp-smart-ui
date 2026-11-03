# Lynx 验证记录

本目录保存源码适配的本地门禁结果。逐组件运行验收以 `../components.json` 为准，
不能以编译或单测通过代替客户端绘制、主题、触摸及原生层命中验收。

2026-10-27 的 `validation-2026-10-27.json` 记录基线、命令、结果与产物摘要。

- [Android Picker 遮罩隔离，2026-10-30](android-picker-mask-isolation-2026-10-30.md)：业务 WebView mask reset 与 Lynx 模板隔离；Android 当前场景通过，iOS 浅色灯光入口显示、重开及操作后居中通过，SUI-20 延迟继续保留。

- 原版：117 suites、1094 tests、51 snapshots；原源码和原构建产物的 SHA-256 不变。
- Lynx：26 项逻辑/分流/生命周期/结构检查，8 项真实组件挂载检查；挂载中的 SvgRender 为替身。
- React 类型冒烟：Icon、Switch、Slider、Slider.RangeSlider 的 JSX 与 React.createElement 模式参数。
- MiniPack：70 组件完整依赖树的 native 编译，编译 fixture 并非所有组件的交互验收页。
- npm：只执行 dry-run，检查两套 native 目录及全部入口，排除源码覆盖、测试和中间产物；没有发布。

组件仍统一保持 `IMPLEMENTED_RUNTIME_PENDING`。SvgRender 真机绘制、图片 tint、
Picker 手势/联动、嵌套弹层、播放器及地图命中、双端深浅主题/大屏应逐项采证。
编译器过滤的 justify / pre-wrap / break-word 和扩展 SVG 用法见仓库根 `README-LYNX.md`。

- [Popup动画与首帧时序，2026-11-02](popup-animation-2026-11-02.md)：安卓与iOS灯光模式进出、重开、关闭后操作验收通过；其他入口、主题及大屏待回归。

- [Field 输入分支修正](field-input-slot-2026-11-03.md)：动态BEM空插槽识别与原生input/textarea显式显示；50项逻辑/产物测试完成，Android输入及取消重开人工验收通过；iOS待独立实测。

## 2026-11-03 提交校验

本次收口 Picker 遮罩标记隔离、Popup 同树遮罩及首帧确认时序、Field 空插槽/原生输入可见性与背景根布局。`packages/**` 原 WebView 源码未修改，70组件隔离构建及 verify 通过；Lynx逻辑/产物50项、真实组件挂载11项通过，变更的Transition TypeScript ESLint零error。运行验收按上述各场景记录，不扩大为全部组件通过；未发布npm。

本次原版全量回归：117 suites、1094 tests、51 snapshots 全部通过。
