# SmartUI miniapp 组件库仓库说明

项目下有 project.tuya.json 文件，包含了基本信息，其中：
- miniprogramRoot 字段表示 example 打包产物目录，不能为空

## 安装

- yarn install

## 项目结构

- 此项目为用 小程序 开发， 语法类似微信小程序，语言选用 Typescript、less；测试用例采用 jest + miniprogram 方式去测试小程序代码

总体项目目录:
- packages 目录下为所有组件的代码以及组件目录下的demo目录为demo的代码
- example 为组件库的demo 目录，在打包时我们会将 packages 目录下的组件 demo打包到 example 的dist 目录下用于在运行编辑器内预览实际运行的效果，但是我们实际在开发时只需要改动 packages 目录下的内容即可

单个组件目录结构：
- demo 组件的demo 代码位置
- test 测试用例代码位置 其中 demo.spec.ts 文件为 demo 代码的快照用于测试demo生成的一致性；部分组件会有index.spec.ts 文件是因为部分组件光使用测试快照的方式代码覆盖不全，需要单独书写测试用例去填补测试用例不足
- index.json 基础配置文件，组件需要引入其他组件时 需要在 usingComponents 字段内配置
- index.less 样式文件，会自动加载
- index.ts 主要逻辑文件
- index.wxml dom文件
- index.wxs dom文件引入的计算逻辑文件，内部只能书写es5代码，但是计算时的性能会比放在 index.ts 文件内好
- README.en.md 英文版本的README
- README.md 中文版本的README

## 多语言

example/i18n/strings.json 其是一个JSON 对象，en 代表英文，zh 代表中文；  
在我们demo 书写时都需要使用例如：title="{{I18n.t('basicUsage')}}" 这样的代码，通过I18n方法去调用strings文件内的key 生成文案，这样可以在不同的语言环境下生成不同的多语言文案  
README文件内在将demo的代码书写时不需要使用 I18n 方法，直接根据README中英文类别直接写对应strings.json 对应语种文案即可


## 启动开发

- yarn dev

## 测试

- yarn test 测试整个项目
- yarn test:cover 测试整个项目并计算测试覆盖率