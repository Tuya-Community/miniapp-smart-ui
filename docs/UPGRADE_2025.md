# SmartUI 2025 年度升级总结

> 本文档面向内部开发者，总结 2025 年度 SmartUI 组件库的重要升级事项和技术改进

## 📊 版本概览

2025 年度共发布 **23 个版本**，从 v2.1.10 升级至 v2.9.0，包含：
- **1 个新组件**：popover（气泡弹框）
- **多项重大重构**：Picker 3D 效果、Circle 组件重构、ESM 打包支持
- **80+ 新增属性/事件/插槽**：覆盖 30+ 组件，包括主题切换、拖拽能力、震动反馈等
- **100+ Bug 修复**：修复各类已知问题，提升组件稳定性和用户体验

---

## 🎯 核心升级亮点

### 1. ESM 打包支持（v2.1.7）

**重大架构升级**：
- 组件实现 ESM 方式打包，支持 tree-shaking
- `@tuya-miniapp/icons` 实现 ESM 方式打包
- 配合 `SmartUIAutoImport` 插件实现按需引入（v2.4.0）

**图标引入方式变更**：
```typescript
// ❌ 禁止使用
import { Sun } from '@tuya-miniapp/icons'

// ✅ 推荐使用
import Sun from '@tuya-miniapp/icons/dist/svg/Sun'
```

---

### 2. Circle 组件重构（v2.3.0、v2.3.9）

**重构历程**：
- v2.3.0：使用 canvas 重构，新增 `mode`、`round` 属性
- v2.3.9：采用 rjs 重写（不再支持微信小程序）

**新增能力**：
- `angle-offset`：设置半圆类型起始角度偏移（v2.8.0）
- `customStyle`：自定义样式（v2.1.7）
- `mask-color` 默认值从 `#ffffff` 改为 `transparent`（v2.8.0）

**修复问题**：
- 修复模糊问题
- 修复 flex 布局下初始化宽度 100% 问题
- 修复外部盒子被挤压导致圆环部分被隐藏问题

---

### 3. Picker 组件 3D 重构（v2.7.0）

**重大更新**：Picker 组件完全重构，带来革命性体验提升

- ✨ **3D 视觉效果**：实现类似 iOS 原生的真实 3D 滚动效果
- ✨ **循环滚动能力**：新增 `loop` 属性，支持无限滚动
- ✨ **性能优化**：重构实现原理，大幅提升滚动性能
- ✨ **新增属性**：
  - `loop`：开启循环滚动
  - `full-height`：全高度显示
  - `changeAnimation`：控制动画开关（v2.2.0）

**影响范围**：DateTimePicker 同步支持循环滚动能力

---

### 4. 主题系统升级（v2.8.0）

**一键主题切换**：ConfigProvider 新增 `theme` 属性

```typescript
// 使用示例
<ConfigProvider theme="dark">
  {/* 组件内容 */}
</ConfigProvider>
```

**相关优化**：
- 缩小主题文件体积（v2.9.0）

---

## 🎨 UI 设计标准对齐

2025 年度，SmartUI 持续对齐涂鸦小程序 UI 设计标准，确保组件库视觉风格统一。以下为已完成对齐的组件及最终状态：

### 已完成完整重构对齐的组件

以下组件已完成 UI 设计稿对齐和重构，符合涂鸦小程序移动端设计规范：

- **field**：表单输入组件
- **tab**：标签页组件
- **search**：搜索组件
- **nav-bar**：导航栏组件
- **switch**：开关组件
- **toast**：轻提示组件
- **dropdown-menu**：下拉菜单组件
- **button**：按钮组件
- **action-sheet**：操作面板组件
- **checkbox**：复选框组件
- **radio**：单选框组件
- **empty**：空状态组件
- **picker**：滚动选择组件
- **datetime-picker**：时间选择组件
- **circle**：圆环进度条组件

### 关键组件对齐要点

#### NavBar（导航栏）
- ✅ 支持三种侧边宽度模式：`min`、`mid`、`max`（通过 `side-width` 属性）
- ✅ 默认宽度为 `max`，符合最新 UI 标准
- ✅ 新增多个样式控制属性：`right-text-color`、`right-icon-color`、`right-icon-size` 等
- ✅ 支持自定义左右侧图标和文案样式

#### Calendar（日历）
- ✅ 禁用样式采用 `opacity` 实现，支持深色模式
- ✅ 删除 `--calendar-day-disabled-color` CSS 变量
- ✅ 新增 `header-icon-color` 属性，支持自定义头部图标颜色
- ✅ 优化分割线、边距、安全距离等细节

#### Switch（开关）
- ✅ 尺寸样式对齐设计稿
- ✅ 支持渐变色背景（`active-color` 和 `inactive-color` 支持渐变色）
- ✅ 支持开关文案显示（`active-text`、`inactive-text`）
- ✅ 优化组件布局和样式

#### Popup（弹出层）
- ✅ 默认关闭底部安全距离（`safe-area-inset-bottom` 默认为 `false`）
- ✅ 支持渐变色背景设置

#### Icon（图标）
- ✅ 更新方向图标样式：`right`、`left`、`down`、`up`
- ✅ 支持自定义图标（Svg Path 方式）
- ✅ 支持自定义图标颜色和尺寸

#### ActionSheet（操作面板）
- ✅ 优化分割线样式和边距
- ✅ 调整安全距离样式
- ✅ 支持自定义标题插槽

#### Toast（轻提示）
- ✅ 优化样式，新增 `--toast-min-width` CSS 变量
- ✅ 弃用 `--toast-text-min-width` CSS 变量

#### Skeleton（骨架屏）
- ✅ 优化动画效果

### Manrope 数字字体接入（v2.7.2）

**对齐说明**：统一使用 Manrope 数字字体，符合涂鸦 UI 设计规范，提升数字显示效果。

**支持组件**（App 7.0.5+ 版本）：
- stepper（步进器）
- count-down（倒计时）
- picker（选择器）
- datetime-picker（日期时间选择器）
- calendar（日历）
- custom-keyboard（自定义键盘）

### iOS 震动反馈全面接入（v2.9.0）

**对齐说明**：统一接入 iOS 震动反馈，符合涂鸦 UI 设计规范，提升交互体验。

**覆盖组件**：以下组件均已接入 iOS 震动反馈
- search（搜索）
- field（输入框）
- tab（标签页）
- tabbar（标签栏）
- stepper（步进器）
- switch（开关）
- toast（轻提示）
- slider（滑块）
- index-bar（索引栏）
- calendar（日历）
- custom-keyboard（自定义键盘）

**技术实现**：统一使用系统震动 API，在用户交互时提供触觉反馈。

### 对齐成果

所有组件均遵循**涂鸦小程序移动端设计规范**，确保：
- 视觉风格统一
- 交互体验一致
- 样式细节完善
- 深色模式支持

---

## 🚀 重要功能增强

### BottomSheet 拖拽能力（v2.7.2）

**新增属性**：
- `draggable`：开启拖拽
- `min-drag-height`、`max-drag-height`、`mid-drag-height`、`close-drag-height`：拖拽高度控制
- `drag-position` 事件：拖拽位置回调
- `lock-scroll`：禁止遮罩滚动（v2.9.0）
- `lock-max-drag`：禁止最大距离拖动（v2.9.0）

**使用场景**：底部弹框需要支持拖拽交互的场景

---

### DateTimePicker 12 小时制支持（v2.2.0）

**新增属性**：
- `is12HourClock`：开启 12 小时制
- `amText`、`pmText`：自定义 AM/PM 文案
- `columnsOrder`：自定义时间列顺序
- `formatterMap`：自定义时间文案
- `changeAnimation`：关闭受控动画

**修复问题**：
- 修复 12 小时模式受控使用问题
- 修复部分情况下 1 月无法拖动选中的问题
- 修复长时间频繁拖拽后一直跳闪停不下来的问题

---

## 🐛 重要 Bug 修复

### Dialog 组件修复

**v2.9.0**：
- 修复组件未关闭，销毁页面后无法再次打开问题

**v2.6.3**：
- 新增 `autoClose` 属性，修复组件自动关闭问题

**v2.2.0**：
- 修复重复调用时，无法打开弹窗问题
- 修复组件无法打开问题，增加全局 Id 唯一校验

**v2.1.8**：
- 修复 API 方式调用时获取 context 错误导致无法获取组件实例问题

---

### Picker 组件修复

**v2.9.0**：
- 修复 loop 模式部分列无法拖动选中的问题

**v2.7.1**：
- 修复 loop 模式滚动值切换时，修改列表后滚动报错问题
- 修复 active 状态实时更新问题

**v2.7.0**：
- 修复在 flex 布局下默认没有宽度的问题
- 修复单位距离不受 fontStyle 属性控制问题

**v2.6.2**：
- 修复单位对齐问题

**v2.6.1**：
- 修复单位换行问题

---

### Calendar 组件修复

**v2.9.0**：
- 修复深色模式禁用样式问题

**v2.6.2**：
- 修复 CSS 变量 `--calendar-day-height`、`--calendar-selected-day-size` 不生效问题

**v2.2.1**：
- 修复 type 属性动态切换时显示问题
- 优化年选择的范围控制

---

### Stepper 组件修复

**v2.7.3**：
- 修复小数情况输入框输入实时更新问题

**v2.7.2**：
- 修复自动换行问题
- 修复无法输入小数问题
- 修复步长格式化不计入 min 问题
- 新增判断字符串逻辑

**v2.6.1**：
- 修复组件到达 max 或 min 时，禁用样式不生效问题
- 修复设置 min 或 decimalLength 导致输入框无法删除问题

---

## 📦 新组件

### Popover（v2.3.0）

**功能特性**：
- 气泡弹框组件
- 支持自定义触发方式（`trigger` 属性，v2.5.0）
- 新增 `--popover-overlay-color` CSS 变量（v2.8.0）

**使用场景**：需要展示提示信息或操作菜单的场景

---

## 🔧 开发体验优化

### 按需引入支持（v2.4.0）

**新增插件**：`SmartUIAutoImport`
- 配合 ESM 打包（详见"核心升级亮点"），实现按需引入组件资源
- 修改导出目录结构，配合 ray cli 使用
- 减少包体积

---

### 组件属性增强

**Dialog**：
- `emptyDisabled`：input 模式下输入内容为空时禁用提交（v2.7.0）
- `textColor`、`iconColor`：自定义文本和图标颜色（v2.8.0）

**Loading**：
- `iconColor`：自定义图标颜色（v2.8.0）
- 修复 `color` 属性效果（v2.8.0）

**Icon**：
- 支持自定义图标，新增 `iconColor` 和 `iconSize` 属性（v2.6.3）
- `name` 属性支持 Svg Path 方式（v2.3.3）
- 新增静音图标、更新更多图标（v2.7.2）

**Image**：
- 新增 `tintColor` 属性，支持图片改色（v2.3.3）
- 修改 `show-loading` 默认值为 false（v2.7.0）

---

## 🎯 性能优化

### 打包优化

- ESM 方式打包，支持 tree-shaking（详见"核心升级亮点"）
- 缩小主题文件体积（v2.9.0）
- 按需引入插件支持（详见"开发体验优化"）

### 组件性能优化

- Picker 重构，优化滚动性能（详见"核心升级亮点"）
- Circle 组件重构，修复模糊问题（详见"核心升级亮点"）
- 修复 action-sheet 关闭动画卡顿问题（v2.3.7）

---

## 🔄 兼容性说明

### 重要变更

1. **Circle 组件**：v2.3.9 采用 rjs 重写，不再支持微信小程序
2. **图标引入方式**：v2.1.5 起禁止使用命名导入，需使用默认导入
3. **NavBar**：v2.9.0 `side-width` 默认值从 `mid` 调整为 `max`
4. **Popup/Calendar**：v2.7.0 默认底部安全距离关闭

### 废弃属性

- Circle 组件 `style` 属性废弃，使用 `customStyle` 替代（v2.1.7）
- Toast `--toast-text-min-width` CSS 变量废弃，使用 `--toast-min-width`（v2.6.0）

---

## 📝 迁移指南

### 从 v2.1.x 升级到 v2.9.0

升级请参考 [升级注意事项](https://developer.tuya.com/material/smartui?comId=help-changelog&tab=block)

---

## 📚 相关资源

- [组件库官网](https://developer.tuya.com/material/smartui?comId=help-getting-started&lang=zh)
- [GitHub 仓库](https://github.com/Tuya-Community/ray-smart-ui)
- [更新日志](https://developer.tuya.com/material/smartui?comId=help-changelog&appType=miniapp)
- [社区论坛](https://www.tuyaos.com/viewforum.php?f=10)

---

## 🎉 总结

2025 年度 SmartUI 组件库在以下方面取得重大进展：

1. **用户体验**：3D Picker、震动反馈、拖拽能力等提升交互体验
2. **开发效率**：ESM 打包、按需引入、主题切换等提升开发效率
3. **代码质量**：持续修复 Bug，提升组件稳定性
4. **UI 规范**：对齐涂鸦 UI 标准，统一视觉风格
5. **性能优化**：重构核心组件，优化打包体积

建议开发者及时升级到最新版本，享受更好的开发体验和功能支持。

---

**文档更新时间**：2025-12-23  
**当前版本**：v2.9.0

