# Lynx 验证记录

本目录保存源码适配的本地门禁结果。逐组件运行验收以 `../components.json` 为准，
不能以编译或单测通过代替客户端绘制、主题、触摸及原生层命中验收。

2026-10-27 的 `validation-2026-10-27.json` 记录基线、命令、结果与产物摘要。

- 原版：117 suites、1094 tests、51 snapshots；原源码和原构建产物的 SHA-256 不变。
- Lynx：26 项逻辑/分流/生命周期/结构检查，8 项真实组件挂载检查；挂载中的 SvgRender 为替身。
- React 类型冒烟：Icon、Switch、Slider、Slider.RangeSlider 的 JSX 与 React.createElement 模式参数。
- MiniPack：70 组件完整依赖树的 native 编译，编译 fixture 并非所有组件的交互验收页。
- npm：只执行 dry-run，检查两套 native 目录及全部入口，排除源码覆盖、测试和中间产物；没有发布。

组件仍统一保持 `IMPLEMENTED_RUNTIME_PENDING`。SvgRender 真机绘制、图片 tint、
Picker 手势/联动、嵌套弹层、播放器及地图命中、双端深浅主题/大屏应逐项采证。
编译器过滤的 justify / pre-wrap / break-word 和扩展 SVG 用法见仓库根 `README-LYNX.md`。
