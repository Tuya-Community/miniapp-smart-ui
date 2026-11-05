# Field 原生输入隐藏：逗宠语音命名弹窗

2026-11-03；负责人tiankun；AI Codex。用户报告Android/iOS Lynx录制保存名称无法点击输入。Android真实移动摄像机已复现，input disabled=false、focus=false、rect=0×0；物理点击后输入法mInputShown=false。仅录制本地测试音频并打开命名弹窗，没有确认上传或下发设备设置。

根因：原Field以control:empty + control显示原生输入。Lynx转换器漏识别Field动态BEM View空插槽，默认display:none一直保留。另避免依赖原生侧相邻选择器，input/textarea根据input命名插槽元数据显式显示/隐藏；native void控件不按无子节点判空。textarea既有autosize样式保留。

本次仅增加build/lynx.cjs的Field转换分支及artifact测试两项；保留原有未提交的Popup/Transition等改动。两项测试先红后绿，完整49项测试、70组件构建和隔离verify完成，packages及WebView基线未改。

主项目已打新npm-pack快照2.13.3-lynx.local.20261103.1并同步src；Android包已推。重进后真实设备离线，语音入口禁用，修复后的实际聚焦/输入/取消重开尚待复测；不得按静态测试标已验收。iOS独立实测待连接。未提交或发布npm。

## 第二轮布局修正与安卓验收

第一版显示输入后进一步定位到Field经内层Cell再次投影默认插槽，输入与灰色背景根错位。仅Lynx转换将单行Field改为自有View背景根，导入原Cell样式保留布局，尾部可选箭头仍使用无子节点Cell。WebView源码保持不变。增加第三项真实模板回归，先红后绿；全库50项测试、70组件隔离构建完成。

最新快照为`2.13.3-lynx.local.20261103.2`，已集成项目src并推送安卓。原生input为248.333×24，位于280.333×56的灰色Field根内；真机读到用户输入bbbb，键盘正常打开。用户明确确认“重开后也能正常输入”，第9条Android标记通过。iOS仍待独立实测。

固定坐标点击脚本仅辅助聚焦检查；Android返回键收起键盘后可能保留焦点，须使用新打开弹窗及当前坐标核验，不以单次脚本失败覆盖用户实际输入证据。
