# Lynx Popup 动画恢复（2026-11-02）

- 独立 `lynx/overrides/mixins/transition.ts` 等待初始setData确认，再延后32ms切换enter-to/leave-to；revision、detach和page hide阻止晚到回调复活动画。
- 独立 `popup/index.wxml` 使遮罩与内容归同一isShowed Host；overlay=false不建立全屏透明Host。原packages/WebView实现不变。
- 业务此前自绘Host及show=false立即卸载绕过/截断动画，同步回接共用Popup并保留leave阶段；只更新库不能恢复被业务卸载的退场。
- 70组件Lynx构建与WebView基线隔离检查通过；首帧确认测试先红后绿，补充迟到确认和同树模板检查。
- 当前安卓OnePlus PJD110、植物TV虚拟设备、浅色灯光模式：用户确认进入动画、关闭、重开及关闭后页面点击/滚动正常。其他组件入口、iOS、深色、大屏未据此标为通过。
- 项目内快照 `2.13.3-lynx.local.20261102.1`，本轮未发布npm。最终分离组件CSS中存在transform/transition-property，不能仅查app.css判断缺失。

- 2026-11-02 同一包推送iPhone后，用户确认“ios 也正常”。当前灯光模式场景Android/iOS均人工通过；其他入口、主题及大屏仍待各自验收。
