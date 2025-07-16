[English](./README.md) | 简体中文

# @tuya-miniapp/smart-ui

## 介绍

`@tuya-miniapp/smart-ui` 是一个**轻量、可靠的智能小程序组件库**，其基于 `vant-weapp` 实现，提供了一整套符合智能小程序移动端设计规范的 UI 组件（暂不支持微信小程序，此组件库只支持涂鸦小程序）。

## 预览

扫描下方智能小程序二维码，体验组件库示例。

<img src="https://images.tuyacn.com/rms-static/b0b15a90-ae04-11ef-aa47-ab559e071ba6-1732852063929.png?tyName=miniapp-smart-ui-1.x.png" width="200" height="200">

## 使用之前

使用 Smart UI 前，请确保你已经学习过智能小程序官方的 [智能小程序快速开始](https://developer.tuya.com/cn/miniapp/develop/miniapp/guide/start/smart) 和 [小程序组件介绍](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/component/intro)。

## 安装

```bash
# 通过 yarn 安装（推荐）
yarn add @tuya-miniapp/smart-ui

# 通过 npm 安装
npm i @tuya-miniapp/smart-ui
```

## 使用组件

以按钮组件为例，只需要在 json 文件中引入按钮对应的自定义组件即可

```json
{
  "usingComponents": {
    "smart-button": "@tuya-miniapp/smart-ui/lib/button/index"
  }
}
```

接着就可以在 tyml 中直接使用组件

```html
<smart-button type="primary">按钮</smart-button>
```

## 在开发者工具中预览

```bash
# 安装项目依赖
yarn

# 执行组件编译
yarn dev
```

打开 [Tuya MiniApp Tools](https://developer.tuya.com/cn/miniapp/devtools/tools)，把`smart-ui/example`目录添加进去就可以预览示例了。

## 基础库版本

`@tuya-miniapp/smart-ui` 从智能小程序基础库 `2.19.0` 版本开始提供稳定的支持。

## 开源协议

本项目基于 [MIT](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89) 协议，请自由地享受和参与开源。

