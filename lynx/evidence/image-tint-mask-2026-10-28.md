# Image.tintColor 位图 Mask 补修

2026-10-28，Codex。依据用户提供的底座 Image 迁移文档：
https://lynx-dev.fast-daily.tuya-inc.cn/development/migration/image.html

- 仅修改 build/lynx.cjs 与 lynx/ 独立源码/测试；原版 packages、dist、lib SHA 验证保持不变。
- 位图使用标准 mask-image、mask-size、mask-position、mask-repeat 及具体背景色，按 fit 对齐原图。
- 可解析 SVG data URI 用 svg-render，单色显式着色，多色路径保留；远程/base64 SVG 不作 Mask，暂保留原图。需要着色时提供可解析SVG XML资源或位图。
- 不传 tintColor 保持原图；图片 load/error/占位/点击仍由原逻辑处理，error 时不留残余着色层。
- 本地新增签名URL、fit、颜色切换、SVG分流、多色保留、错误移除着色层用例。模板测试中 SvgRender 为替身，不能作为原生渲染验收。
- 真机目标：业务消息统计的两个远程PNG，深色白图标、浅色黑图标。尚待新包首次挂载实际截图，Android、大屏及扩展SVG不标通过。

本轮本地门禁：35项逻辑/结构、10项模板挂载全部通过，70组件及WebView SHA不变校验通过；业务联编和renderer门禁通过。目标ESLint保留model.ts原有5处resolveColor声明前引用，无新增错误。

## 真机颜色生效后的尺寸补修

深色原生截图已确认两个PNG图标均白色，动态Mask/背景有效；但Mask层实测12.576×25.152px，被横向压缩。根因是styles()仍保留早期禁用Mask时删除smart-image__tint-color整段规则的逻辑，导致原absolute/100%以及追加z-index全丢失。已移除该过滤，恢复全尺寸绝对定位；新增编译后CSS的position/top/left/width/height/父子z-index断言。36项逻辑/产物测试、10项模板挂载通过，原版SHA不变。新包实际尺寸仍待真机重进确认，不能只凭颜色有效标Image全部通过。

真机补修后结果：iOS业务首页消息统计两个远程PNG，深色白色；同一Lynx会话切浅色后均黑色。两态实际25.152×25.152px，绝对定位和z1保持，截图图形比例正常。当前入口场景已验证；Android/大屏、加载失败回退、SVG扩展未验收。

## SUI-13 灯的同源 SVG 内容回接

宝宝看护器Lynx灯面板原来用PNG绕过。业务原nightOpen.svg包含fill-opacity=0的灰色占位rect和黑色可见path，旧颜色统计将其误判多色，切白色时不重着色。独立Lynx模型改为统计直接可见的fill/stroke，忽略对应零透明属性，真正多色图仍保留；新增透明占位回归。业务仅该灯入口把原SVG逐字节内容编码为data URI交Image/svg-render，WebView仍原资源路径；文件URL/远程SVG、其它灯/喂奶绕过仍不算修完。37项逻辑/产物与10项模板挂载、70组件原版SHA隔离检查通过。真实SVG绘制、尺寸与两主题待新包验收，不以旧PNG截图作证。

SUI-13真机回接失败：用户反馈图标异常，原生截图/节点出现Image错误占位层；SVG绘制与Image加载/error链路未独立归因。按用户要求撤回本轮SVG内容回接、透明占位颜色改动及新增测试，业务恢复原PNG，SUI-12位图Mask与尺寸修复保留。SUI-13继续业务绕过库待修，不把37项本地测试当作客户端通过；恢复后36项检查通过。
