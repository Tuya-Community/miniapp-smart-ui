English | [简体中文](./README-zh_CN.md)

# @tuya-miniapp/smart-ui

## Introduction

`@tuya-miniapp/smart-ui` is a **lightweight and reliable smart mini program component library** based on `vant-weapp`, offering a complete set of UI components that adhere to the mobile design specifications of smart mini programs (currently not supporting WeChat Mini Programs, this component library only supports Tuya Mini Programs).

## Preview

Scan the smart mini program QR code below to experience the component library examples.

<img src="https://images.tuyacn.com/rms-static/b0b15a90-ae04-11ef-aa47-ab559e071ba6-1732852063929.png?tyName=miniapp-smart-ui-1.x.png" width="200" height="200">


## Before Using

Before using Smart UI, make sure you have studied the official [Smart Mini Program Quick Start](https://developer.tuya.com/en/miniapp/develop/miniapp/guide/start/smart) and [Mini Program Component Introduction](https://developer.tuya.com/en/miniapp/develop/miniapp/framework/component/intro).

## Installation

```bash
# Install via yarn (recommended)
yarn add @tuya-miniapp/smart-ui

# Install via npm
npm i @tuya-miniapp/smart-ui
```

## Using Components

Taking the button component as an example, you only need to import the corresponding custom component in the JSON file.

```json
{
  "usingComponents": {
    "smart-button": "@tuya-miniapp/smart-ui/dist/button/index"
  }
}
```

Then you can directly use the component in the TYML file.

```html
<smart-button type="primary">Button</smart-button>
```

## Preview in Developer Tools

```bash
# Install project dependencies
yarn

# Compile components
yarn dev
```

Open [Tuya MiniApp Tools](https://developer.tuya.com/cn/miniapp/devtools/tools), add the `smart-ui/example` directory, and you can preview the examples.

## Base Library Version

`@tuya-miniapp/smart-ui` provides stable support starting from the smart MiniApp base library version `2.19.0`.

## Open Source License

This project is licensed under the [MIT](https://en.wikipedia.org/wiki/MIT_License) license. Feel free to enjoy and contribute to the open-source community.
