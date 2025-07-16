English | [简体中文](./README-zh_CN.md)

# @tuya-miniapp/smart-ui

![npm](https://img.shields.io/npm/v/@tuya-miniapp/smart-ui)![down](https://img.shields.io/npm/dt/@tuya-miniapp/smart-ui)

## Introduction

`@tuya-miniapp/smart-ui` is a **lightweight and reliable smart mini-app component library**, implemented based on `vant-weapp`. It provides a complete set of UI components that comply with smart mini-app mobile design specifications (currently does not support WeChat mini-programs, this component library only supports Tuya mini-programs).

## Preview

Scan the smart mini-app QR code below to experience the component library examples.

<img src="https://images.tuyacn.com/rms-static/8bcfe810-a187-11ef-9773-6b86083026a3-1731478901009.png?tyName=v2.0.0miniapp-SmartUI.png" width="200" height="200">

## Before Using

Before using Smart UI, make sure you have studied the official [Smart Mini-App Quick Start](https://developer.tuya.com/cn/miniapp/develop/miniapp/guide/start/smart) and [Mini-App Component Introduction](https://developer.tuya.com/cn/miniapp/develop/miniapp/framework/component/intro).

## Installation

```bash
# Install via yarn (recommended)
yarn add @tuya-miniapp/smart-ui

# Install via npm
npm i @tuya-miniapp/smart-ui
```

## Using Components

Take the button component as an example, you only need to introduce the corresponding custom component of the button in the json file.

```json
{
  "usingComponents": {
    "smart-button": "@tuya-miniapp/smart-ui/lib/button/index"
  }
}
```

Then you can directly use the component in tyml.

```html
<smart-button type="primary">Button</smart-button>
```

## Preview in Developer Tools

```bash
# Install project dependencies
yarn

# Execute component compilation
yarn dev
```

Open [Tuya MiniApp Tools](https://developer.tuya.com/cn/miniapp/devtools/tools), add the `smart-ui/example` directory to preview the examples.

## Base Library Version

`@tuya-miniapp/smart-ui` provides stable support starting from version `2.19.0` of the smart mini-app base library.

## Related Links

[SmartUI Component Library Official Website](https://developer.tuya.com/material/smartui?comId=help-getting-started)  
[Miniapp SmartUI Component Library Official Website](https://developer.tuya.com/material/smartui?comId=help-getting-started&appType=miniapp)  
[SmartUI GitHub](https://github.com/Tuya-Community/ray-smart-ui)  
[miniapp-smart-ui GitHub](https://github.com/Tuya-Community/miniapp-smart-ui)  
[Mini-App Community Forum](https://www.tuyaos.com/viewforum.php?f=10)   
[Ray Official Website](https://developer.tuya.com/cn/miniapp)  
[Ray Material Market](https://developer.tuya.com/material/library_oHEKLjj0/)   
[Public Source Collection of Materials & Templates](https://github.com/Tuya-Community/tuya-ray-materials) 

## Changelog

[Official Changelog](https://developer.tuya.com/material/smartui?comId=help-changelog&appType=miniapp)  

This project follows [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)

## Development Communication

[Official WeChat Group](https://github.com/Tuya-Community/ray-smart-ui/issues/1)

## Open-Source License

This project is licensed under the [MIT](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89) license. Please feel free to enjoy and participate in open-source.