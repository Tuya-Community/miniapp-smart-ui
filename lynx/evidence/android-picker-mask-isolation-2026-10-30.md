# Android Picker 遮罩隔离（2026-10-30，Codex）

植物 TV 水位的开始时间在 Android Lynx 空白。当前设备为 OnePlus PJD110 / Android 15，宿主 Lynx SDK 4.0.2。原生树包含时间数据、选中值和非零文字布局；空白并非数据缺失。

业务全局 `.smart-picker__columns` 原有 `-webkit-mask-image:none !important` / `mask-image:none !important`，用于重置 WebView 渐变。该声明串入 Lynx 后，当前安卓原生树出现 `mask-image:[0]`。仅去掉 mask 数字出现，补回又空白，再移除又出现，已完成双向对照。DevTool 重写整段 style 会连带清除 mask，不能把显示恢复归因于单一 z-index 或绘制时序。

本库仅在独立 Lynx 模板生成时给 Picker 列增加 `smart-lynx-picker-columns`。业务重置选择器改为 `.smart-picker__columns:not(.smart-lynx-picker-columns)`；原 WebView 模板、样式及包保持不变。该标记需要消费者同步隔离旧的全局 mask reset，并非仅升级组件就能移除消费者样式。两个失败的时序/强制容器候选已撤回，无额外延迟和重绘轮询。

本地 build:lynx、44 项逻辑/产物测试、11 项渲染测试及 70 组件 WebView 隔离校验通过。npm pack 私有快照 `2.13.3-lynx.local.20261030.3` 集成业务 src；未发布 npm。

正式业务包 Android 新会话首次打开和两次取消重开均显示，小时拖动 07→10，取消重开恢复原 07:30，没有确认/保存或下发时间设置。原生列保留 z-index:2、opacity:1，已无 mask-image。业务证据见 `docs/lynx/android-picker-mask-isolation-2026-10-30.md`。

iOS 已推同一包。用户正常重进后实际打开植物 TV「灯光 → 开始时间」，浅色时间列显示 13:41，原生列含新标记；选中行与选中框中心均为 y=652。用户手动重新触发并操作后，新列节点由544变为714，显示11:44，选中中心仍为652。当前浅色入口显示、重开及操作后居中通过，没有确认保存。

用户反馈“iOS 比之前出现速度快不少”，只记录为体感改善；首帧时长未量化、深色和其它入口未复测，不沿用历史 iOS 通过记录。SUI-20 首帧文案延迟仍开放，不因本次 Android 空白修复而关闭。
