# Alita
[English](./README_en.md)

> Alita，战斗天使阿丽塔，原型是《铳梦》中一位不断战斗和自我超越的生化改造少女。

[![npm Version](https://img.shields.io/npm/v/@areslabs/alita.svg)](https://www.npmjs.com/package/@areslabs/alita)
[![npm Downloads](https://img.shields.io/npm/dt/@areslabs/alita.svg)](https://www.npmjs.com/package/@areslabs/alita)
[![npm License](https://img.shields.io/npm/l/@areslabs/alita.svg)](https://www.npmjs.com/package/@areslabs/alita)


Alita是一套React Native代码转换引擎工具。与现有编译时方案不同，Alita对React语法有全新的处理方式，支持在运行时处理React语法，实现了React Native和微信小程序之间的主要组件对齐，可以用简洁、高效的方式把React Native代码转换成微信小程序代码。  

Alita不是新的框架，也没有提出新的语法规则，她只做一件事，就是把你的React Native代码运行在微信小程序端。所以Alita的侵入性很低，选用与否，并不会对你的原有React Native开发方式造成太大影响。 

<table>
   <tr>
   	    <td>React Native</td>
   	    <td>微信小程序</td>
   </tr>
	<tr>
		<td><img src="./docs/static/rnalita.gif"/></td>
		<td><img src="./docs/static/wxalita.gif"/></td>
	</tr>
</table>

## Alita 原理相关
1. Alita使用运行时React语法处理方案，区别现有社区使用的编译时方案，对React语法的支持更加完备，具体请看：[一种让小程序支持JSX语法的新思路](https://areslabs.github.io/alita/%E4%B8%80%E7%A7%8D%E8%AE%A9%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%94%AF%E6%8C%81JSX%E8%AF%AD%E6%B3%95%E7%9A%84%E6%96%B0%E6%80%9D%E8%B7%AF.html)

2. 关于React和小程序的数据交互方式，请看：[React与小程序的数据交换](https://areslabs.github.io/alita/mini-react%E4%B8%8E%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%9A%84%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%96%B9%E5%BC%8F.html)


## Features
* 完备的React语法支持。runtime阶段处理JSX语法，对JSX支持更加完善，可以在组件内任何地方出现JSX片段，包括属性传递JSX片段，render方法之外的JSX片段等等， 
* `React`生命周期
* `React Native`组件/API
* [动画](https://areslabs.github.io/alita/%E5%8A%A8%E7%94%BB.html)
* [支持Redux](https://areslabs.github.io/alita/%E6%94%AF%E6%8C%81Redux.html)
* [支持Mobx](https://areslabs.github.io/alita/%E6%94%AF%E6%8C%81mobx.html)
* 支持`typescript`

## Install
通过npm安装即可

`npm install -g @areslabs/alita`

若`-g`有权限问题，需要`sudo`

## Getting Started
我们在[examples](https://github.com/areslabs/alita/tree/master/examples)目录提供了丰富的样例代码， 强烈建议你clone出一份，然后使用Alita转化，你可以在这些样例代码上尝试任何你想要的功能。 


当然你也可以使用如下的方式建立新的RN应用：
```
    react-native init [项目名] && alita init [项目名]
``` 

`alita init`命令 会对rn项目做一些调整，并且安装alita转化所必须的库。 

如果需要初始化`typescript`项目，请添加`--typescript`参数
```
    react-native init [项目名] && alita init [项目名] --typescript
``` 

**注意：** RN 0.60 以后的项目，IOS需要依赖`CocoaPods`，导致初始化项目极其缓慢，可以使用其他版本的RN
```
    react-native init [项目名] --version 0.59.9 && alita init [项目名]
``` 

项目初始化之后，小程序运行需要：

1. `cd [项目名]`

2. 执行alita转化命令
    ```
    alita 
    ```
    如果你需要边开发边看小程序效果可以添加`--dev` 参数，打开开发者模式：
    ```
    alita --dev
    ```

2. 这样，你在RN目录的`wx-dist`目录下就得到了一份小程序源代码

3. [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)从`wx-dist`目录导入项目

这样React Native应用就运行在了微信小程序，**Have fun！！**

## 命令行参数
alita命令有以下参数：

1. -v  alita 版本
2. --dev  开发者模式，将监听RN源码修改，生成的文件较大，生产版本请禁用此参数
3. --config 指定配置文件
4. --analyzer 输出小程序js大小分布 （以后将会添加完整小程序代码分布）

## 注意事项
Alita对React Native应用有一些基本要求和限制。 除此以外，微信小程序本身就存在一些限制，比如包大小等。对这些限制，希望你有一个足够的了解。这样在使用Alita的过程中就不会出现莫名其妙的错误。

* 详细的说明了Alita转化的限制以及这些限制产生的原因[限制&限制说明](https://areslabs.github.io/alita/%E9%99%90%E5%88%B6&%E9%99%90%E5%88%B6%E8%AF%B4%E6%98%8E.html)
* 一些尚未实现的组件，主要是平台相关组件，[详见](https://areslabs.github.io/alita/%E6%9C%AA%E5%AE%9E%E7%8E%B0%E7%BB%84%E4%BB%B6%E5%92%8CAPI.html)， 最终我们会提供`alita-ui`3端UI库，来补充这方面的不足。
* 当你的应用使用了第三方组件 且 此组件Alita不能直接转化，那么需要[手动处理](https://areslabs.github.io/alita/%E7%AC%AC%E4%B8%89%E6%96%B9%E7%BB%84%E4%BB%B6%E5%BA%93%E6%89%A9%E5%B1%95.html)
   

## Examples
下面是官方提供的RN项目案例，查看小程序效果，请进入相应目录执行` alita --dev ` 

[HelloWorldExpo](https://github.com/areslabs/alita/tree/master/examples/HelloWorldExpo), Expo命令创建的项目

[HelloWorldRN](https://github.com/areslabs/alita/tree/master/examples/HelloWorldRN), react-native 命令创建的项目

[Todo(redux实现)](https://github.com/areslabs/alita/tree/master/examples/Todo)，Rudex Todo 项目

[ReactRepos](https://github.com/areslabs/alita/tree/master/examples/ReactRepos)，react-native 列表详情项目案例

[RoomMobx](https://github.com/areslabs/alita/tree/master/examples/RoomMobx) Mobx项目案例


## 配置文件
Alita可以通过参数`--config`指定一个配置文件。当你的项目只使用了React Native官方组件和API的时候，这个配置文件是可以忽略的，使用系统默认配置就可以，但是当你的React Native应用足够复杂的，就需要使用配置文件了。

[详细介绍](https://areslabs.github.io/alita/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.html)


## 已有RN项目集成
Alita的设计目标是要尽可能无损的转换RN应用，即使是已经存在的RN应用。但是不可避免的，已有项目会更多的触及到Alita的限制，包括路由组件，动画组件。当你需要转化已有RN项目时，我们梳理了需要注意和必要的修改点

[详细介绍](https://areslabs.github.io/alita/已有项目集成.html)

## Alita组件库
在项目开发中，仅仅使用 RN 基本组件和 API，是很难满足需要的。我们在内部使用 Alita 的过程中，积累了很多常用的三端组件，包括ScrollTabView，ViewPager，SegmentedControl等等，我们正在剥离和梳理这些组件，很快会发布兼容三端的 Alita 组件库。此组件库也是我们日后的工作重点之一，我们将会不断优化和扩展新组件。

## 更新日志
本项目遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，更新日志由 `conventional-changelog` 自动生成。完整日志请点击 [CHANGELOG.md](./CHANGELOG.md)。

## alitajs
社区另有一个[alitajs/alita](https://github.com/alitajs/alita)，那是一个专注业务的Web全流程方案。我们重名了，带来的困扰很抱歉:sweat_smile::sweat_smile::sweat_smile: 。 所以如果你需要的是Web全流程方案，请[点击](https://github.com/alitajs/alita)


## 开发交流

<table>
   <tr>
   	    <td>QQ群</td>
   	    <td>微信公众号</td>
   </tr>
	<tr>
		<td><img src="./docs/static/qqgroup.jpg"/></td>
		<td><img src="./docs/static/gzh.jpg"/></td>
	</tr>
</table>

## License
MIT License

Copyright (c) ARES Labs
