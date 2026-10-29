# PickerColumn 嵌套原生滚动（2026-10-28，Codex）

用户在宝宝看护器喂奶提醒时间列拖动时，外层内容也滚动。数字显示已恢复。
当前层级为 ScrollView → DateTimePicker → Picker → PickerColumn，JS catch:touchmove不能直接等同于拦截平台层pan。

独立Lynx列根节点声明 consume-slide-event：纵向角区间 [-135,-45] 和 [45,135]，取自官方角度规则；disabled/空列为[]，不消费，flatten:false保证原生节点。列自身Lynx touch仍工作；不设全局锁，不改业务scrollY，不扩大到横向。
依据：https://lynxjs.org/zh/api/elements/built-in/view.html#consume-slide-event 。实际MiniApp透传及iOS拖动待新包验收，不能仅以模板属性存在判定成功。
取消触摸补清lynxDragging，原回退值/change合同保持。

新增属性/取消断言在改前失败；构建后40项测试及11项模板挂载通过，70组件WebView SHA不变。业务构建和renderer检查通过。真机验收待回填；SUI-20首帧延迟保持待优化。

## 第一版失败与标量属性对照

- 用户重进第一版仍外层滚动。原生session30 __GetAttributeByName确认consume-slide-event实际类型string，内容为JSON文本，flatten是boolean。属性在DOM中存在不代表数组类型合同正确。
- 原生列临时设置pan-intercept-direction="1"与pan-intercept-scope="1"（与当前MiniApp透传一致的字符串标量），用户反馈“现在可以”。同会话拖动前10:05、后07:48；ScrollView边界不变，内容/Picker顶部差仅-0.333px（亚像素范围），作为当前对照通过证据；未点保存。
- 正式实现移除无效consume-slide-event，改用纵向1/祖先1；disabled/空列设置none方向2、none范围6，不影响横向，且无全局锁或组件外状态。仍保留flatten:false和catch:touchmove。取消手势清理lynxDragging。
- 依据：https://lynxjs.org/zh/api/elements/built-in/view.html#pan-intercept-direction ，scope枚举见同页。数字标量在当前iOS宿主的临时原生对照有效；未据此扩展Android与其它原生宿主兼容结论。
- 修正后40项逻辑/产物、11项模板挂载、70组件WebView SHA校验通过。正式包重进以及列外滚动恢复仍待验证，不能以当前临时对照冒充首次挂载成功。

## 正式包用户验收

381文件业务包推送，活动缓存首页native，6个关键文件读回一致。用户正常退出/重进后回复“重进后两项都正常”，列内独立滚动与列外正常滚动均通过。标当前iOS宝宝看护器喂奶场景通过；最终采集时没有打开的原生PickerColumn，未取得正式包该时刻新截图，几何截图证据仍明确属于此前临时对照，不伪造新包采集结果。其它平台/入口、全部禁用与空列组合不据此标通过，SUI-20延迟保持待优化。
