# Alita
[English](./README_en.md)

> Alita，战斗天使阿丽塔，原型是《铳梦》中一位不断战斗和自我超越的生化改造少女。

[![npm Version](https://img.shields.io/npm/v/@areslabs/alita.svg)](https://www.npmjs.com/package/@areslabs/alita)
[![npm Downloads](https://img.shields.io/npm/dt/@areslabs/alita.svg)](https://www.npmjs.com/package/@areslabs/alita)
[![npm License](https://img.shields.io/npm/l/@areslabs/alita.svg)](https://www.npmjs.com/package/@areslabs/alita)


Alita是一套React Native代码转换引擎工具。它对React语法有全新的处理方式，支持在运行时处理React语法，实现了React Native和微信小程序之间的主要组件对齐，可以用简洁、高效的方式把React Native代码转换成微信小程序代码。  

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

## Features
* 完备的React语法支持。runtime阶段处理JSX语法，对JSX支持更加完善，可以在组件内任何地方出现JSX片段，包括属性传递JSX片段，render方法之外的JSX片段等等， 
* React生命周期
* React Native组件/API
* [动画](https://areslabs.github.io/alita/%E5%8A%A8%E7%94%BB.html)
* [支持Redux](https://areslabs.github.io/alita/%E6%94%AF%E6%8C%81Redux.html)
* [支持Mobx](https://areslabs.github.io/alita/%E6%94%AF%E6%8C%81mobx.html)
* 支持第三方/自定义组件库扩展， 扩展方式[详见](https://areslabs.github.io/alita/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E5%BA%93%E6%89%A9%E5%B1%95.html)

## Alita 原理相关
1. Alita使用运行时React语法处理方案，区别现有社区使用的编译时方案，对React语法的支持更加完备，具体请看：[一种让小程序支持JSX语法的新思路](https://areslabs.github.io/alita/%E4%B8%80%E7%A7%8D%E8%AE%A9%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%94%AF%E6%8C%81JSX%E8%AF%AD%E6%B3%95%E7%9A%84%E6%96%B0%E6%80%9D%E8%B7%AF.html)

2. 关于React和小程序的数据交互方式，请看：[React与小程序的数据交换](https://areslabs.github.io/alita/mini-react%E4%B8%8E%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%9A%84%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%96%B9%E5%BC%8F.html)

## Install
通过npm安装即可

`npm install -g @areslabs/alita`

若`-g`有权限问题，需要`sudo`

## Getting Started
我们在[examples](https://github.com/areslabs/alita/tree/master/examples)目录提供了丰富的样例代码， 强烈建议你clone出一份，然后使用Alita转化，你可以在这些样例代码上尝试任何你想要的功能。 


当然你也可以使用如下的方式建立新的RN应用：
```
    react-native init myproject && alita init myproject
``` 

`alita init`命令 会对rn项目做一些调整。 

**注意：** RN 0.60 以后的项目，IOS需要依赖`CocoaPods`，导致初始化项目极其缓慢，可以使用其他版本的RN
```
    react-native init myproject --version 0.59.9 && alita init myproject
``` 

下面以`myproject`项目说明Alita的使用。
 
1. 调用alita命令将其转化为微信小程序应用
    ```
    alita -i myproject -o myprojectwp
    ```
    如果你需要边开发边看小程序效果可以添加`--watch` 参数，watch模式会监听文件修改：
    ```
    alita -i myproject -o myprojectwp --watch
    ```

2. 这样，你在`myprojectwp`目录就得到了一份小程序源代码。 进入`myprojectwp` 目录， 安装相关依赖
    ```
    cd myprojectwp
    npm install
    ```

3. [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)从`myprojectwp`目录导入项目

4. 在微信开发者工具下构建npm， 工具 --> 构建npm。如下图
   
   ![buildnpm](./static/buildnpm.jpg)
   

5. 概率性的，由于构建npm发生在导入项目之后，可能会出现找不到包的错误，出现控制台错误，此时需要重启开发者工具，或者重新导入项目，[详见](https://github.com/areslabs/alita/issues/23)。

这样React Native应用就运行在了微信小程序

## 命令行参数
alita命令有以下参数：

1. -v  打印alita 版本
2. -i  React Native 源代码目录
3. -o  转化生成的小程序源代码目录
4. --config 指定配置文件
5. --watch 监听模式
6. --comp 转化RN组件，而不是整个项目

## Examples
以下提供了一些样例代码以及他们转化出来的小程序代码。 当然你完全可以选择其他小程序源码输出目录，自行转化。

运行转化生成的微信小程序：
1. 安装`微信开发者工具`
2. 进入生成的小程序目录：`npm install`
3. 用`开发者工具`打开生成的小程序目录（老版本的`开发者工具`，在目录上`新建小程序`即可，新版本的`开发者工具`，需要`导入项目`）
4. 在`开发者工具`上 点击：`工具 --> 构建npm`。


[HelloWorldExpo](https://github.com/areslabs/alita/tree/master/examples/HelloWorldExpo), Expo命令创建的项目，转化出来的小程序在[HelloWorldWP](https://github.com/areslabs/alita/tree/master/examples/HelloWorldExpoWP)。

[HelloWorldRN](https://github.com/areslabs/alita/tree/master/examples/HelloWorldRN), react-native 命令创建的项目。 代码逻辑同[HelloWorldExpo](https://github.com/areslabs/alita/tree/master/examples/HelloWorldRNWP)

[Todo(redux实现)](https://github.com/areslabs/alita/tree/master/examples/Todo)，react-native 命令创建的项目，转化出来的小程序在[TodoWP](https://github.com/areslabs/alita/tree/master/examples/TodoWP)

[ReactRepos](https://github.com/areslabs/alita/tree/master/examples/ReactRepos)，react-native 命令创建的项目，转化出来的小程序在[ReactReposWP](https://github.com/areslabs/alita/tree/master/examples/ReactReposWP)

[RoomMobx](https://github.com/areslabs/alita/tree/master/examples/RoomMobx) Mobx项目，转化出来的小程序在[RoomMobxWP](https://github.com/areslabs/alita/tree/master/examples/RoomMobxWP)

[SubpackagesDemo](https://github.com/areslabs/alita/tree/master/examples/SubpackagesDemo)， 通过[小程序分包集成的方式](https://areslabs.github.io/alita/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%88%86%E5%8C%85%E9%9B%86%E6%88%90.html)，集成的小程序包


## 要求与限制
主要有3个方面的要求和限制

1. 转化之后的小程序，必须符合小程序的规范， 比如最终压缩的代码小于4m，分包8m， 路由深度不大于5层等。

2. Alita本身的一些限制 详见[要求与限制](https://areslabs.github.io/alita/%E8%A6%81%E6%B1%82%E4%B8%8E%E9%99%90%E5%88%B6.html)， [静态限制](https://areslabs.github.io/alita/%E9%9D%99%E6%80%81%E9%99%90%E5%88%B6.html)

3. 如果使用了第三方React Native组件，需要使用[自定义组件库扩展](https://areslabs.github.io/alita/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E5%BA%93%E6%89%A9%E5%B1%95.html) 方式进行扩展

## 关于第三方包/组件库，原生组件
Alita并不能直接转化第三方库组件库，RN原生扩展组件。需要你预先在微信小程序平台对齐好相应组件，这一点很像你在原生平台上扩展RN组件，这很好理解，比如你在RN上扩展了一个原生平台组件`MyComp`，小程序并不知道这个`MyComp`为何物，需要你预先对齐好小程序版的`MyComp`，第三方组件库也是一样，也是需要手动的对齐处理。我们提供两种对齐方式，具体请[参考](https://areslabs.github.io/alita/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E5%BA%93%E6%89%A9%E5%B1%95.html)。另外，我们还会发布`alita-ui`，她会处理好RN社区常用的一些组件，是直接被Alita支持的。

微信小程序对npm包有特殊的要求，你需要确定你的包是否可以直接在小程序端使用，我们在[配置文件](https://areslabs.github.io/alita/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.html)的`dependenciesMap`字段对npm包的使用做了详细的说明。

## 配置文件
Alita可以通过参数`--config`指定一个配置文件。当你的项目只使用了React Native官方组件和API的时候，这个配置文件是可以忽略的，使用系统默认配置就可以，但是当你的React Native应用足够复杂的，就需要使用配置文件了。

[详细介绍](https://areslabs.github.io/alita/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.html)

## eslint检查
虽然Alita支持了大部分的React语法，但是还是有一些情况Alita无法处理，比如原生RN动画库。另外Alita在转化代码的过程中，使用了一些保留字。我们希望这些来自Alita的限制可以近早的被发现，所以我们提供了一个eslint plugin。通过配置此plugin，可以让你在使用Alita转化代码之前，对你的代码进行静态的检查。

[详细介绍](https://areslabs.github.io/alita/%E4%BB%A3%E7%A0%81%E6%A3%80%E6%9F%A5&Eslint.html)

## 已有RN项目转化
Alita的设计目标是要尽可能无损的转换RN应用，即使是已经存在的RN应用。但是不可避免的，已有项目会更多的触及到Alita的限制，包括路由组件，动画组件。当你需要转化已有RN项目时，我们梳理了需要注意和必要的修改点

[详细介绍](https://areslabs.github.io/alita/%E5%B7%B2%E6%9C%89%E9%A1%B9%E7%9B%AE%E8%BD%AC%E5%8C%96.html)

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
