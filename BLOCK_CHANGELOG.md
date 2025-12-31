# 升级注意事项

## v2.9.0 (2025-12-23)

### Bug Fixes  🐛

- nav-bar: 对齐涂鸦 UI 标准，sideWidth 默认值从 mid 调整为 max([64281c8](https://github.com/Tuya-Community/miniapp-smart-ui/pull/125/commits/64281c830cde83b908320085014f394058b257c1))
- calendar: 对齐涂鸦 UI 标准，删除 --calendar-day-disabled-color，采用 opacity 实现禁用样式，修复深色模式禁用样式问题([pull/126](https://github.com/Tuya-Community/miniapp-smart-ui/pull/126))
- nativeDisabled: 属性 安卓失效 2.9.2 版本修复


## v2.8.0 (2025-12-09)

### Bug Fixes  🐛

- notice-bar: 对齐 UI 标准，修改 --notice-bar-text-color CSS 变量默认值为 rgba(0, 0, 0, 0.5)，不再依赖 --app-B6-N5 ([43922ab](https://github.com/Tuya-Community/miniapp-smart-ui/commit/43922abceaedf1af448147e189517598151dd0a9))
- switch: 对齐 UI 标准，修改 --switch-label-active-color、--switch-label-inactive-color CSS 变量默认值为 #FFFFFF，不再依赖 --app-B3 ([43922ab](https://github.com/Tuya-Community/miniapp-smart-ui/commit/43922abceaedf1af448147e189517598151dd0a9))

## v2.7.3 (2025-11-20)

### Features  ✨

- nav-bar: 对齐全新 UI 标准，调整 --nav-bar-side-width、--nav-bar-text-font-size、--nav-bar-text-font-weight CSS 变量默认值([pull/96](https://github.com/Tuya-Community/miniapp-smart-ui/pull/96))

## v2.7.2 (2025-11-13)

### Bug Fixes  🐛

- picker: 修复单列时 onChange 事件返回格式问题，和2.7.0之前版本保持一致([9800e64](https://github.com/Tuya-Community/miniapp-smart-ui/pull/77/commits/9800e649576136eb102cc61c5192e6a6ffd57ea3))

## v2.7.1(2025-10-28)

### Bug Fixes 🐛
- popup: 对齐 UI 标准，调整组件默认 safe-area-inset-bottom 为 false([c3c79f2](https://github.com/Tuya-Community/miniapp-smart-ui/pull/61/commits/c3c79f2f0efef6595649b426fb5221cb6df83da9))；修复 --popup-background-color 无法设置渐变色问题，使用 background CSS 属性代替 background-color([37a938a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/68/commits/37a938a0780fe64d24a4e8c20810b1e1434e4ee6))

## v2.7.0(2025-10-21)

### Features ✨

- picker: 对齐 UI 标准，重构 picker 实现原理，增加3D视觉效果([pull/48](https://github.com/Tuya-Community/miniapp-smart-ui/pull/48))
- nav-bar: 对齐 UI 标准稿，样式优化，新增和修改 --nav-bar-side-width、--nav-bar-text-padding、--nav-bar-icon-padding、--nav-bar-title-margin、--nav-bar-home-max-width、--nav-bar-left-title-padding、--nav-bar-title-max-width CSS 变量；删除--nav-bar-icon-size、--nav-bar-icon-margin CSS 变量；修改 border 属性默认为 false([pull/38](https://github.com/Tuya-Community/miniapp-smart-ui/pull/38))

### Bug Fixes 🐛

- image: 修改 show-loading 默认值为false([6090b97](https://github.com/Tuya-Community/miniapp-smart-ui/pull/50/commits/6090b97baea6f1c75bf7be184a5ae8fcc33afa9b))
- popup: 对齐 UI 标准，默认底部安全距离关闭([3da77ee](https://github.com/Tuya-Community/miniapp-smart-ui/pull/54/commits/3da77eecbc51b014fd06b4871d054ddda9d2a1c7))
- calendar: 对齐 UI 标准，默认底部安全距离关闭([4c91851](https://github.com/Tuya-Community/miniapp-smart-ui/pull/54/commits/4c91851fe674bcb64a19c830a3f1539da8700dd1))
- icon: 对齐 UI 标准，更新 right、left、down、up 图标, ([e1bd07e](https://github.com/Tuya-Community/miniapp-smart-ui/commit/e1bd07ebb2bd411fe82e714b11e603ed68271c9a))


## v2.6.0(2025-07-31)

### Features ✨
- datetime-picker: 对齐 UI 标准，修改组件分割线为渐变色，应用新 CSS 变量 --hairline-border-image-color CSS([6381e6f](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/6381e6ffdf61ae21a1ff3943c69a543ecbc1e03c))
- toast: 调整样式，新增 --toast-min-width CSS 变量，弃用 --toast-text-min-width CSS 变量([13a4f93](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/13a4f93e4bf9f2fb3dfb17e64f85d82430d22706), [f99c3a3](https://github.com/Tuya-Community/miniapp-smart-ui/pull/9/commits/f99c3a30b5d78f655513756ce494b1ec6e259a1f))

### Bug Fixes 🐛
- overlay: 对齐 UI 标准调整背景样式，底层依赖 --app-overlay CSS变量([319761a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/319761a88793c178d3f6c0089adb4a6079df29ec))
- dialog: 对齐 UI 标准稿，修改弹框背景颜色，--dialog-background-color CSS 变量底层依赖从 --app-B4 变更为 --smart-ui-dialog-background([eae43fb](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/eae43fb54a23fa669636e166b149cd9f393fb8ef))
- picker: 修改 animationTime 默认值为 300([302919a](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/302919ab414ac70cc2174541c97127bc8e2f5bdc), [f7a4f28](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/f7a4f28b60d31afc7b699100f7cc1e992f621319), [afe87f2](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/afe87f262a69d6733c8ee7eb38cf129220ae333f));改变定位单位方式，修复其间距受外部盒子挤压问题，并修改 --picker-option-unit-mid-size 默认值为 4px ([1619172](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/16191721222fe7658d87b0eaf0d8c28d5ecc29a6), [d82a6cf](https://github.com/Tuya-Community/miniapp-smart-ui/pull/3/commits/d82a6cff525d26f9094046be27874a0a80f883de));


## v2.5.1(2025-07-17)
### Features ✨
- nav-bar: 新增单独定义右侧文案颜色样式，新增 --nav-bar-right-text-color CSS 变量

## v2.5.0(2025-06-26)
### Features ✨
- switch: 改动组件内部样式布局

## v2.4.0(2025-06-10)

### Features ✨
- picker: 新增 --picker-option-unit-mid-size CSS 变量，flex gap 方式控制单位间距
- switch: 新增单独定义开启时背景色，新增 --switch-node-on-background-color CSS 变量

## v2.3.0(2025-02-28)

### Features ✨
- circle: 使用canvas重构组件

### Bug Fixes 🐛
- dialog: 修复组件无法打开问题，增加全局 Id 唯一校验
- toast: 修复组件无法打开问题，增加全局 Id 唯一校验

## v2.2.0 (2025-2-13)

### Bug Fixes 🐛
- stepper: 修复内部图标显示问题，内置Icon图标

## v2.1.7 (2024-12-27)

### Features ✨
- index-bar: 新增 scrollable 属性默认禁止 Sidebar 滚动触发索引变更

## v2.1.6 (2024-12-19)

### Bug Fixes 🐛
- toast: 修复宽度默认值以及屏幕居中问题

## v2.1.0（2024-11-21）

### Features
- tab: 重构样式
- field: 重构样式

## v2.0.0（2024-11-12）

### Features  ✨
- field: UI 对齐设计稿&重构
- tab: UI 对齐设计稿&重构
- search: UI 对齐设计稿&重构
- top-nar: UI 对齐设计稿&重构
- switch: UI 对齐设计稿&重构
- toast: UI 对齐设计稿&重构
- dropdown-menu: UI 对齐设计稿&重构
- button: UI 对齐设计稿&重构
- action-sheet: UI 对齐设计稿&重构
- checkbox: UI 对齐设计稿&重构
- radio: UI 对齐设计稿&重构
- empty: UI 对齐设计稿&重构
- picker: 功能优化&重构
- tabbar: 功能优化&重构

