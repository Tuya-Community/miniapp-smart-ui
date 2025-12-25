# 🚀 SmartUI：让涂鸦小程序开发更简单、更高效

> 一个轻量、可靠、功能丰富的智能小程序 UI 组件库，助力开发者快速构建精美的涂鸦小程序应用

## 📦 关于 Smart UI

`@ray-js/smart-ui` 是专为**涂鸦智能小程序 Ray开发**打造的 UI 组件库，基于成熟的 `vant-weapp` 架构实现，提供了一整套符合涂鸦小程序移动端设计规范的 UI 组件。无论你是开发智能家居控制面板、设备管理界面，还是构建复杂的业务场景，Smart UI 都能为你提供开箱即用的解决方案。

![npm version](https://img.shields.io/npm/v/@tuya-miniapp/smart-ui)
![npm downloads](https://img.shields.io/npm/dt/@tuya-miniapp/smart-ui)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ 核心特性

### 🎯 60+ 高质量组件
涵盖表单、导航、反馈、展示、业务等各个场景，满足小程序开发的方方面面：
- **表单组件**：Button、Field、Switch、Checkbox、Radio、Stepper、Rate、Slider 等
- **导航组件**：NavBar、Tabbar、Tabs、IndexBar、Sidebar 等
- **反馈组件**：Toast、Dialog、Notify、Loading、ActionSheet 等
- **展示组件**：Cell、Image、Tag、Empty、Skeleton、Progress、Circle 等
- **业务组件**：Calendar、Picker、DateTimePicker、Cascader、TreeSelect 等

### 🎨 设计规范统一
所有组件严格遵循涂鸦小程序移动端设计规范，确保应用界面的一致性和专业性。

### ⚡ 轻量高效
- 按需引入，减少包体积
- 性能优化，流畅体验
- 支持 WXS 计算，提升渲染性能

### 🔧 开发体验友好
- **TypeScript 支持**：完整的类型定义，智能提示
- **Less 样式**：灵活的样式定制能力
- **完整文档**：中英文文档齐全，示例丰富
- **测试覆盖**：Jest 测试框架，保证代码质量

### ✅ 测试覆盖率
经过持续完善的测试用例补充，Smart UI 现已达到**98.21%** 的测试覆盖率，确保组件库的稳定性和可靠性：

- **语句覆盖率**：98.21%
- **分支覆盖率**：91.88%
- **函数覆盖率**：96.24%
- **行覆盖率**：98.37%

所有组件都经过严格的单元测试，覆盖各种使用场景和边界情况。你可以通过运行 `yarn test:cover` 查看详细的覆盖率报告。

### 🌈 主题定制
- 支持 CSS 变量定制主题
- ConfigProvider 组件一键切换主题
- 支持深/浅色模式

## 🚀 快速开始

### 安装

```bash
# 通过 yarn 安装（推荐）
yarn add @ray-js/smart-ui

# 通过 npm 安装
npm i @ray-js/smart-ui
```

### 使用组件

```tsx
import { Button } from '@ray-js/smart-ui';

export default function Demo() {
  return <Button type="info">信息按钮</Button>;
}
```

就是这么简单！🎉

## 📖 完整示例

### 内置主题
内置 深/浅色主题跟随 APP 主题自动切换，也可以根据需求设置

<img src="https://github.com/user-attachments/assets/aa64f245-efa6-4e2b-b85e-9be28feb266c" width="250" style="display: inline-block; margin-right: 2%;" /> <img src="https://github.com/user-attachments/assets/26aa4298-7f70-48b9-9d5b-81109b47c074" width="250" style="display: inline-block;" />

### 导航组件

<img src="https://github.com/user-attachments/assets/89ee3b28-f3db-4b0a-84af-648294f3bacb" width="250" style="display: inline-block; margin-right: 2%;" /> <img src="https://github.com/user-attachments/assets/a223e51b-6f98-42ae-8905-37d63a5eec04" width="250" style="display: inline-block;" /> <img src="https://github.com/user-attachments/assets/d3fc8f0e-9f39-47a6-9240-64d08155ab64" width="250" style="display: inline-block; margin-right: 2%;" /> <img src="https://github.com/user-attachments/assets/7042a950-3d24-4cbe-b8ce-d13121dfe7d8" width="250" style="display: inline-block;" /> <img src="https://github.com/user-attachments/assets/dde6a21a-1b19-4c88-9be7-b1ef69cb59f0" width="250" style="display: inline-block; margin-right: 2%;" />

### 3D 滚动选择器

真实3D滚动效果，类似 IOS 原生，且支持无限滚动的Picker，DateTimePicker

<img src="https://github.com/user-attachments/assets/4129d062-1147-4d30-8344-71aaa779ec45" height="180" style="display: inline-block; margin-right: 2%;" /> <img src="https://github.com/user-attachments/assets/860dbc3f-f6ce-41c1-899f-bcf8fdc5e5c0" height="180" style="display: inline-block;" />

### 表单组件

<img src="https://github.com/user-attachments/assets/ded282ee-9f31-4f9d-891f-da7932bbc183" width="250" style="display: inline-block; margin-right: 2%;" /> <img src="https://github.com/user-attachments/assets/cd6b3ee5-b08f-45ac-be3b-cd236687f9ff" width="250" style="display: inline-block;" /> <img src="https://github.com/user-attachments/assets/88a435d6-95f7-437f-92d1-44be0c58f709" width="250" style="display: inline-block;" /><img src="https://github.com/user-attachments/assets/1839bfe6-30ae-4056-9aa6-0d97a5e1003b" width="250" style="display: inline-block; margin-right: 2%;" /> <img src="https://github.com/user-attachments/assets/7bade96b-c527-443f-b8fd-ab35030f455e" width="250" style="display: inline-block;" /> <img src="https://github.com/user-attachments/assets/b57fb828-c3dc-4638-a4d7-438c1ba3101e" width="250" style="display: inline-block;" />

### 多种弹框

内部包含基础弹框Popup（可任意方向出现）、选择器弹框ActionSheet、底部可拖拽弹框BottomSheet、交互弹框Dialog、轻提示弹框Toast，涵盖所有交互形式，方便开发。

<img src="https://github.com/user-attachments/assets/80a018ff-7485-4bdd-8fa5-ad0a3c764957" width="250" style="display: inline-block; margin-right: 2%;" /> <img src="https://github.com/user-attachments/assets/5ca739c7-e439-4ffd-af5f-10ab3e1b72a0" width="250" style="display: inline-block;" /> <img src="https://github.com/user-attachments/assets/f087f0da-f8a2-4eb5-882e-b055952fe38d" width="250" style="display: inline-block; margin-right: 2%;" /> 

<img src="https://github.com/user-attachments/assets/be25d5da-a196-4afd-afd8-95c2e569fae1" width="250" style="display: inline-block; margin-right: 2%;" /> <img src="https://github.com/user-attachments/assets/83774a26-ab95-44cb-9afa-4e481c382723" width="250" style="display: inline-block;" /> <img src="https://github.com/user-attachments/assets/54861153-1f31-46cd-af0f-e78649c78430" width="250" style="display: inline-block; margin-right: 2%;" /> 

## 🎯 适用场景

### 智能家居控制
- 电工（插座、排插、开关）
- 照明（光源、灯带、氛围灯、吸顶灯、灯串、感应灯...）
- 大家电
- 门锁
- 节能
- 户外
- ...  

> 超100+个涂鸦公版接入SmartUI  
> 宠物猫砂、食物秤、充电桩...

<img width="250" alt="image" src="https://github.com/user-attachments/assets/cf056a4e-6010-4a81-912a-4e2a40e98cbc" />

<img width="250" alt="截屏2025-12-24 14 03 31" src="https://github.com/user-attachments/assets/ef9fcd4a-09df-4eb0-872d-e235b228a9f5" />

<img width="250" alt="企业微信截图_ab13183c-6573-4811-8435-0cc60122281b" src="https://github.com/user-attachments/assets/301230eb-2572-4463-841d-33db6d957e54" />


### 设备管理
- 设备列表展示（Cell、CellGroup）
- 设备搜索（Search）
- 设备分组（IndexBar、Sidebar）

### 数据可视化
- 进度展示（Progress、Circle）
- 图表展示（支持自定义）
- 状态指示（Tag、Badge）

### 用户交互
- 表单填写（Field、Checkbox、Radio）
- 日期选择（Calendar、DateTimePicker）
- 操作确认（Dialog、ActionSheet）

## 💡 为什么选择 Smart UI？

### ✅ 成熟稳定
- 基于 `vant-weapp` 成熟架构
- 经过大量项目验证
- 持续更新维护（一月两次）

### ✅ 开发效率
- 开箱即用，减少重复开发
- 统一的设计规范
- 丰富的组件和示例

### ✅ 代码质量
- TypeScript 类型安全
- **98.21% 测试覆盖率**：经过完善的测试用例补充，确保组件稳定可靠
- 规范的代码风格

### ✅ 社区支持
- 开源 MIT 协议
- 活跃的社区论坛
- 完善的文档和示例

### ✅ 性能优化
- 按需加载
- WXS 性能优化
- 体积控制

## 📚 学习资源

- 📖 [组件库官网](https://developer.tuya.com/material/smartui?comId=help-getting-started&lang=zh)
- 📦 [GitHub 仓库](https://github.com/Tuya-Community/ray-smart-ui)
- 💬 [社区论坛](https://www.tuyaos.com/viewforum.php?f=10)
- 🎨 [物料市场](https://developer.tuya.com/material/library_oHEKLjj0/?lang=zh)
- 📝 [更新日志](https://developer.tuya.com/material/smartui?comId=help-changelog)

## 🔍 预览体验

扫描下方二维码，在涂鸦小程序中体验完整的组件库示例：

<img src="https://images.tuyacn.com/content-platform/hestia/1716260412b7f2ae02271.png" width="200" height="200" alt="智能小程序二维码">

## 🛠️ 本地开发

想要深入了解或参与贡献？可以本地运行示例：

```bash
# 克隆仓库
git clone https://github.com/Tuya-Community/ray-smart-ui

# 安装依赖
yarn install

# 启动开发
yarn dev

# 运行测试
yarn test

# 查看测试覆盖率
yarn test:cover
```

然后在 [Tuya MiniApp Tools](https://developer.tuya.com/cn/miniapp/devtools/tools) 中打开 `example` 目录即可预览。

## 🤝 参与贡献

我们欢迎所有形式的贡献！无论是：
- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码

请查看 [贡献指南](https://github.com/Tuya-Community/ray-smart-ui/blob/main/CONTRIBUTING.md) 了解详情。

## 📄 开源协议

本项目基于 [MIT](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89) 协议开源，请自由地享受和参与开源。

## ✅ 开发计划

[PLANS](https://github.com/Tuya-Community/miniapp-smart-ui/blob/release/2.x/PLANS.md) 内部会标注下个版本迭代的开发计划以及相应的测试包版本

## 🌟 开始使用

还在等什么？立即开始使用 `@ray-js/smart-ui`，让小程序开发变得更简单！

```bash
yarn add @ray-js/smart-ui
```

---

**让开发更简单，让体验更美好** ✨

如有任何问题或建议，欢迎在 [小程序开发论坛](https://www.tuyaos.com/viewforum.php?f=10&sid=31103cb7c85eb94d0dc9017a3c0eeaf1) 中提出。

