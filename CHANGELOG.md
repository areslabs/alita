## [2.2.4](https://github.com/areslabs/alita/compare/2.2.3...2.2.4) (2020-01-16)


### Features

* **alita:** 修改RNCOMPSET 由对应rn库的package.json 配置生成，以前是硬编码 ([4ad6da1](https://github.com/areslabs/alita/commit/4ad6da1))



## [2.2.3](https://github.com/areslabs/alita/compare/2.2.2...2.2.3) (2020-01-14)



## [2.2.2](https://github.com/areslabs/alita/compare/2.2.1...2.2.2) (2020-01-09)


### Bug Fixes

* **alita:** 修复当webpack没有module successed成功的时候，报错行为 ([e5a8879](https://github.com/areslabs/alita/commit/e5a8879))
* **wx-react:** 修复FlatList，SectionList组件销毁时报错 ([3b1d381](https://github.com/areslabs/alita/commit/3b1d381)), closes [#47](https://github.com/areslabs/alita/issues/47)


### Features

* **alita:** 添加 componentPaths 配置项， 兜底处理未找到路径的组件 ([676aabb](https://github.com/areslabs/alita/commit/676aabb))



## [2.2.1](https://github.com/areslabs/alita/compare/2.0.3...2.2.1) (2020-01-03)


### Bug Fixes

* **alita:** 2个组件 + defaut导出 判断错误的bug ([f4635dc](https://github.com/areslabs/alita/commit/f4635dc))
* **alita:** 传递路径给extract** ，修改认为传递来的是对象的bug ([44b77ab](https://github.com/areslabs/alita/commit/44b77ab))
* **alita:** 修复window平台下 usingComponents路径错误 ([efe12c1](https://github.com/areslabs/alita/commit/efe12c1))
* **wx-react:** 修复复用逻辑的bug ([1e6d9c1](https://github.com/areslabs/alita/commit/1e6d9c1))


### Features

* **alita:** add webpack mini-program target ([9c7ea8b](https://github.com/areslabs/alita/commit/9c7ea8b))
* **alita:** version 2.20 ([228620d](https://github.com/areslabs/alita/commit/228620d))
* **alita:** watch模式下 保证chunk变化的时候，组件usingCOmponent关系正确 ([1f78b78](https://github.com/areslabs/alita/commit/1f78b78))
* **alita:** watch模式下，wxComponent 目录的删除 ([707110e](https://github.com/areslabs/alita/commit/707110e))
* **alita:** webpack入口 添加splitChunks用来分async包，添加miniprogramTarget ([f92a0f8](https://github.com/areslabs/alita/commit/f92a0f8))
* **alita:** 入口文件添加 subpage 分包处理逻辑 ([4f0044f](https://github.com/areslabs/alita/commit/4f0044f))
* **alita:** 分chunk生成小程序文件 ([b5d5ffb](https://github.com/areslabs/alita/commit/b5d5ffb))
* **alita:** 根据chunk  copy wxComponents目录，并提供getCompPath 方法 ([44d735e](https://github.com/areslabs/alita/commit/44d735e))
* **alita:** 添加module chunks字段 ([402f81e](https://github.com/areslabs/alita/commit/402f81e))
* **alita:** 添加收集模块的jsonRelativeFiles信息 ([8b23d81](https://github.com/areslabs/alita/commit/8b23d81))
* **wx-react:** 增加对异步分包模式的支持 ([bef4e72](https://github.com/areslabs/alita/commit/bef4e72))



## [2.1.1](https://github.com/areslabs/alita/compare/2.0.3...2.1.1) (2019-12-20)
提取alita-core，提取alita-cli， 这样把webpack安装在项目目录下， 方便与react-native-web 集成

### Bug Fixes

* **alita:** 2个组件 + defaut导出 判断错误的bug ([f4635dc](https://github.com/areslabs/alita/commit/f4635dc))



## [2.0.3](https://github.com/areslabs/alita/compare/2.0.2...2.0.3) (2019-12-18)


### Bug Fixes

* **alita:** 修复 export {} from './A' 搜集信息时候的语法错误 ([1fbcb5b](https://github.com/areslabs/alita/commit/1fbcb5b))


### Features

* **alita:** remove __source props in production ! ([aedef74](https://github.com/areslabs/alita/commit/aedef74))
* **alita:** 一个文件支持多个组件 ([48052a8](https://github.com/areslabs/alita/commit/48052a8))
* **alita:** 添加alita转化出错的 友好提示信息 ([4a7ff8b](https://github.com/areslabs/alita/commit/4a7ff8b))



## [2.0.2](https://github.com/areslabs/alita/compare/2.0.1...2.0.2) (2019-12-16)


### Bug Fixes

* **alita:** 修复中文展示乱码的bug ([ef72810](https://github.com/areslabs/alita/commit/ef72810))


### Features

* **@areslabs/wx-react:** 减少对外暴露的接口，相应的增强RNBaseComponent reactCompHelper的能力 ([6024ce9](https://github.com/areslabs/alita/commit/6024ce9))



## [2.0.1](https://github.com/areslabs/alita/compare/1.3.6...2.0.1) (2019-12-12)

V2.0 版本把打包方式改为了webpack，利用了webpack收集依赖的能力，简化了alita配置文件，简化了alita npm包使用方式，提升了更多对代码包体积
的分析手段，减少了无效文件的写入次数等等。

watch模式复用了webpack的复用。


### Bug Fixes

* **alita:** 修复 多次修改入口文件，生成重复page配置的bug ([4c8ad4d](https://github.com/areslabs/alita/commit/4c8ad4d))
* **alita:** 修复copy组件路径错误的bug ([3e6b53e](https://github.com/areslabs/alita/commit/3e6b53e))
* **alita:** 修复rawcode字段传递错误的bug ([b1f58d1](https://github.com/areslabs/alita/commit/b1f58d1))
* **alita:** 修复watchmoduleupdate 判断有误的bug ([bb4b0df](https://github.com/areslabs/alita/commit/bb4b0df))
* **alita:** 修复win平台下 控制台黑色背景 提示信息看不见的bug ([edbd2f5](https://github.com/areslabs/alita/commit/edbd2f5))
* **alita:** 修复win平台下 路径错误的bug ([c3e9ed5](https://github.com/areslabs/alita/commit/c3e9ed5))
* **alita:** 修复入口文件变化 小程序不刷新的bug ([7eea60c](https://github.com/areslabs/alita/commit/7eea60c))
* **alita:** 修复导入目录，小程序json文件路径错误的bug ([8036b68](https://github.com/areslabs/alita/commit/8036b68))
* **alita:** 修复每次compiler 丢失图片的bug， 需要重新实现移除的方式 ([c784a2e](https://github.com/areslabs/alita/commit/c784a2e))
* **alita:** 修复移除源图片的bug ([2887cc6](https://github.com/areslabs/alita/commit/2887cc6))
* **alita:** 修复配置会alita引擎默认配置的bug ([4847f36](https://github.com/areslabs/alita/commit/4847f36))
* **alita:** 修改生成小程序配置错误 ([520b0cf](https://github.com/areslabs/alita/commit/520b0cf))


### Features

* **@areslabs/alita-weixin-runtime:** add new package @areslabs/alita-weixin-runtime ([665b0cb](https://github.com/areslabs/alita/commit/665b0cb))
* **@areslabs/alita-weixin-runtime:** 聚合包，引用诸wx-rn适配包，不应该直接使用。 ([db560b8](https://github.com/areslabs/alita/commit/db560b8))
* **alita:** add parse options ([065605c](https://github.com/areslabs/alita/commit/065605c))
* **alita:** gatherInfo-laoder 配合cacheModuleInfos 收集信息 ([3e55be2](https://github.com/areslabs/alita/commit/3e55be2))
* **alita:** json路径添加 错误提示 ([19dfb67](https://github.com/areslabs/alita/commit/19dfb67))
* **alita:** support export from json组件路径查找 ([d017f21](https://github.com/areslabs/alita/commit/d017f21))
* **alita:** 修改ts lib配置 ([fc86f04](https://github.com/areslabs/alita/commit/fc86f04))
* **alita:** 提供cacheModuleInfo模块，记录模块信息 ([537b36c](https://github.com/areslabs/alita/commit/537b36c))
* **alita:** 提供WatchModuleUpdatedPlugin 监听模块的修改 删除等变化 ([5c3ffdd](https://github.com/areslabs/alita/commit/5c3ffdd))
* **alita:** 添加 include exclude配置，方便处理第三方库 ([920fb31](https://github.com/areslabs/alita/commit/920fb31))
* **alita:** 配合WatchModuleUpdatedPlugin 监听到的模块更新，更新对应的小程序组件文件 ([2a6f24c](https://github.com/areslabs/alita/commit/2a6f24c))
* **alita wx-react:** 解偶 小程序js ， reactjs ([37ae032](https://github.com/areslabs/alita/commit/37ae032))


### Performance Improvements

* **alita:** 移除 由于 RN bable 处理产生的多余属性 ([436d2a2](https://github.com/areslabs/alita/commit/436d2a2))



## [1.3.5](https://github.com/areslabs/alita/compare/1.3.4...1.3.5) (2019-11-27)


### Bug Fixes

* **@areslabs/wx-animated:** 添加类型定义 ([268b370](https://github.com/areslabs/alita/commit/268b370))
* **alita:** 修复入口文件.wx.js 结尾的bug ([54c1a08](https://github.com/areslabs/alita/commit/54c1a08))
* **alita:** 移除init typescript 的项目 null 报错的问题 ([b531f1e](https://github.com/areslabs/alita/commit/b531f1e))
* **router:** 添加类型定义 ([101c927](https://github.com/areslabs/alita/commit/101c927))
* **stringutil-rn:** 添加类型定义 ([5920cbf](https://github.com/areslabs/alita/commit/5920cbf))



## [1.3.4](https://github.com/areslabs/alita/compare/1.3.3...1.3.4) (2019-11-13)


### Features

* **alita:** 支持导入json文件 ([844f815](https://github.com/areslabs/alita/commit/844f815))
* **alita router wx-router:** 支持 类小程序switchTab ([94a1600](https://github.com/areslabs/alita/commit/94a1600))



## [1.3.3](https://github.com/areslabs/alita/compare/1.3.2...1.3.3) (2019-11-11)


### Bug Fixes

* **wx-react:** 修复 移除hocProps引起的样式错乱的bug ([0389a50](https://github.com/areslabs/alita/commit/0389a50))


### Features

* **alita:** 简化Text类型标签的处理 ([be8bc48](https://github.com/areslabs/alita/commit/be8bc48))
* **wx-react:** 移除Hoc需手动设置hocProps的限制 ([de2979f](https://github.com/areslabs/alita/commit/de2979f))



## [1.3.2](https://github.com/areslabs/alita/compare/1.3.1...1.3.2-beta.0) (2019-11-08)


### Bug Fixes

* **alita:** 修复 cptCompHandler 方法名错误的bug ([d6b276b](https://github.com/areslabs/alita/commit/d6b276b))
* **alita:** 修复watch模式下 删除ts文件，小程序文件仍然存在的bug ([c582a82](https://github.com/areslabs/alita/commit/c582a82))
* **alita:** 更新组件为对应的警告信息 ([e0a4cfe](https://github.com/areslabs/alita/commit/e0a4cfe))


### Features

* **alita:** 完善转化之前的check，添加entry check ([5e32980](https://github.com/areslabs/alita/commit/5e32980))
* **alita:** 检测到多个入口文件，提供报错提示消息 ([b76e6be](https://github.com/areslabs/alita/commit/b76e6be))
* **alita:** 添加 对JSX属性的precheck ([2fcbc4c](https://github.com/areslabs/alita/commit/2fcbc4c))
* **alita:** 添加不和规则JSX的提升 ([c3a26e9](https://github.com/areslabs/alita/commit/c3a26e9))



## [1.3.1](https://github.com/areslabs/alita/compare/1.3.0...1.3.1) (2019-11-06)

### Bug Fixes

* **alita:** 修复 alita init 之后RN项目，无法直接启动的bug ([82a8d30](https://github.com/areslabs/alita/commit/82a8d30))
* **alita:** 修复 h 函数的导入 ([169d318](https://github.com/areslabs/alita/commit/169d318))
* **alita:** 修复 typescript ，javascript 文件互相导入的时候，解析错误的bug ([3e6658b](https://github.com/areslabs/alita/commit/3e6658b))
* **alita:** 修复 typescript 下 .web.ts 未被忽略的情况 ([139afa8](https://github.com/areslabs/alita/commit/139afa8))
* **alita:** 修复 函数组件文件转化错误的bug ([668bc3e](https://github.com/areslabs/alita/commit/668bc3e))
* **alita:** 修复<> 类型推断 下，ts文件报错的bug ([b4f7864](https://github.com/areslabs/alita/commit/b4f7864))
* **alita:** 修复async 在typescript下报错的bug ([27a3e5f](https://github.com/areslabs/alita/commit/27a3e5f))
* **alita:** 修复h声明在 typescript情况下报错的bug ([0d623e4](https://github.com/areslabs/alita/commit/0d623e4))
* **alita:** 修复tpyescript 语法处理bug ([e96d1bc](https://github.com/areslabs/alita/commit/e96d1bc))
* **alita:** 未找到 import/require 模块 添加错误警告 ([89b4c81](https://github.com/areslabs/alita/commit/89b4c81))
* **wx-react:** 修复 StyleSheet.flatten 方法接受数组/对象参数的时候报错 ([1b1c9a8](https://github.com/areslabs/alita/commit/1b1c9a8))
* **wx-react:** 修复StyleSheet flatten ([e334318](https://github.com/areslabs/alita/commit/e334318))


### Features

* **alita:** support `export  from ` 语法 ([0ff1e49](https://github.com/areslabs/alita/commit/0ff1e49))
* **alita:** support typescript ([9c6a5e6](https://github.com/areslabs/alita/commit/9c6a5e6))
* **alita:** support typescript ([f7f6f6c](https://github.com/areslabs/alita/commit/f7f6f6c))
* **alita:** support typescript namespace ([d199d96](https://github.com/areslabs/alita/commit/d199d96))
* **alita:** 完善 js， ts init 初始化项目 ([ea3b37d](https://github.com/areslabs/alita/commit/ea3b37d))
* **alita:** 添加 init typescript 模版 ([b7e5615](https://github.com/areslabs/alita/commit/b7e5615))



# [1.3.0](https://github.com/areslabs/alita/compare/1.2.10...1.3.0) (2019-10-30)

* 简化 第三方库/组件 接入的配置
* 完善增强 --comp 参数，方便直接用alita命令转化纯JS组件
* 提供reactCompHelper API，方便手动对齐
* 完善简化 接入第三方库/组件 文档
* 完善 配置文件 文档


### Bug Fixes

* **alita:** 修复 组件 render null 没有jsx标签的时候 判断错误的bug ([356bac6](https://github.com/areslabs/alita/commit/356bac6))
* **alita:** 修复--comp 参数下 code应该转入miniprogram_dist ([ad65ae4](https://github.com/areslabs/alita/commit/ad65ae4))
* **alita:** 修复判断是否是React文件的bug ([3f2a161](https://github.com/areslabs/alita/commit/3f2a161))


### Features

* **alita:** 完善--comp命令的支持 ([7176ace](https://github.com/areslabs/alita/commit/7176ace))
* **alita:** 添加 对dependences配置项的完全支持 ([dd120ba](https://github.com/areslabs/alita/commit/dd120ba))
* **alita:** 添加--wxName 配合--comp使用 ，指定小程序平台的包名 ([42f66d1](https://github.com/areslabs/alita/commit/42f66d1))
* **alita:** 添加rn包没有映射时候的警告提示 ([8b3b496](https://github.com/areslabs/alita/commit/8b3b496))
* **alita:** 移除 areslabs库的无效警告 ([331da1d](https://github.com/areslabs/alita/commit/331da1d))
* **alita:** 简化配置项，Deprecated dependenciesMap extCompLibs。 启用dependencies配置项将其统一 ([a30baf6](https://github.com/areslabs/alita/commit/a30baf6))
* **wx-react:** 提供 reactCompHelper方法，方便手动对齐组件 ([567b4ca](https://github.com/areslabs/alita/commit/567b4ca))



## [1.2.10](https://github.com/areslabs/alita/compare/1.2.9...1.2.10) (2019-10-24)

1. 添加flow支持
2. wx-react 改为rollup 打包方式
3. 添加 rn-polyfill 文件夹，处理rn和小程序执行环境的异同，包括async等

### Features

* **alita:** 添加flow支持 ([c94aaea](https://github.com/areslabs/alita/commit/c94aaea)), closes [#29](https://github.com/areslabs/alita/issues/29)


### Performance Improvements

* **wx-react:** optimize objectIs ([7d0a9ab](https://github.com/areslabs/alita/commit/7d0a9ab))



## [1.2.9](https://github.com/areslabs/alita/compare/1.2.7...1.2.9) (2019-10-23)

1. 完善setState合并策略

### Features
* **alita**  完善setState合并策略
* **alita**  减少render的时候，递归此时，提升性能
* **alita:** process file 添加start ，end信息，方便错误定位 ([efcbfdd](https://github.com/areslabs/alita/commit/efcbfdd))
* **alita:** 添加 组件未发现 等错误信息的时候，打印处文件路径，方便调试 ([4940fe5](https://github.com/areslabs/alita/commit/4940fe5))



## [1.2.7](https://github.com/areslabs/alita/compare/1.2.6...1.2.7) (2019-10-09)


### Performance Improvements

* **wx-react:** 优化geneUUID的性能 ([e955b6d](https://github.com/areslabs/alita/commit/e955b6d))
* **wx-react:** 提供Sync版本的groupSetData，提升组件初始化性能 ([96d3177](https://github.com/areslabs/alita/commit/96d3177))
* **wx-react:** 重构react和mp之间的数据传输，解决闪屏问题 ([b5962f7](https://github.com/areslabs/alita/commit/b5962f7))



## [1.2.6](https://github.com/areslabs/alita/compare/1.2.5...1.2.6) (2019-09-25)
采用分组groupSetData的方式初始化组件

### Bug Fixes

* **wx-react:** 修复shouldComponent返回false的情况下，didUpdate仍然触发的bug ([952a0ed](https://github.com/areslabs/alita/commit/952a0ed))


### Performance Improvements

* **alita:** 依次R相关逻辑 ([f68c436](https://github.com/areslabs/alita/commit/f68c436))
* **wx-react:** 1. 修改组件初始化时数据传递 ([c39f3b5](https://github.com/areslabs/alita/commit/c39f3b5))
* **wx-react:** 1.分层setData的方式初始化组件 2. 使用opacity的方式防止页面抖动 ([77d3598](https://github.com/areslabs/alita/commit/77d3598))
* **wx-react-native:** 修改组件初始化数据传递逻辑 ([6edfa68](https://github.com/areslabs/alita/commit/6edfa68))



## [1.2.5](https://github.com/areslabs/alita/compare/1.2.4...1.2.5) (2019-09-19)


### Features

* **alita:** 改善编译完成之后的输出 ([d762ead](https://github.com/areslabs/alita/commit/d762ead))
* **alita:** 添加init命令 ([abc8dba](https://github.com/areslabs/alita/commit/abc8dba))



## [1.2.4](https://github.com/areslabs/alita/compare/1.2.1...1.2.4) (2019-09-18)


### Bug Fixes

* **wx-react:** 1. 修复setState组件 shouldUpdate状态没有设置的bug; 2. 外层_myOutStyle没有设置的bug ([d7483a2](https://github.com/areslabs/alita/commit/d7483a2))
* **wx-react:** 修复setState回调没有调用的bug ([cb78c93](https://github.com/areslabs/alita/commit/cb78c93))


### Features

* **wx-react-native:** ScrollView 添加onContentSizeChange, scrollToEnd 方法 ([5a0ced9](https://github.com/areslabs/alita/commit/5a0ced9)), closes [#22](https://github.com/areslabs/alita/issues/22)


### Performance Improvements

* **alita:** 对Text标签的子元素特殊处理 ([ec38d66](https://github.com/areslabs/alita/commit/ec38d66))



## [1.2.2](https://github.com/areslabs/alita/compare/1.2.1...1.2.2) (2019-08-26)


### Bug Fixes

* **alita:** 修复文件名后缀.jsx的bug ([99fcacb](https://github.com/areslabs/alita/commit/99fcacb)), closes [#13](https://github.com/areslabs/alita/issues/13)
* **alita:** 修复文件名后缀.jsx的bug ([82775b8](https://github.com/areslabs/alita/commit/82775b8)), closes [#13](https://github.com/areslabs/alita/issues/13)



## [1.2.1](https://github.com/areslabs/alita/compare/1.1.1...1.2.1) (2019-08-21)

### Bug Fixes
* **alita:** 去除componentGenerics 产生的警告/错误

### Features
* **alita:** 提升alita命令行的友好提示 ，添加--help等


# [1.2.0](https://github.com/areslabs/alita/compare/1.1.1...1.2.0) (2019-08-12)
重新实现了小程序和mini-react之间的数据交互， 带来如下的改进
* 首屏渲染优化
* 提升setState性能
* 重新实现willUnmount生命周期
* 修改自定义组件render 为null的时候，在小程序上的表现
* 其他bug修改

### Bug Fixes

* **alita:** 修复 TouchableHighlight 转化bug ([9652e5d](https://github.com/areslabs/alita/commit/9652e5d))
* **alita:** 修改生成的小程序调试版本固定2.2.0的bug ([0774df9](https://github.com/areslabs/alita/commit/0774df9))
* **alita wx-react:** 修复HOC 下 组件unmount调用错误 ([f00420b](https://github.com/areslabs/alita/commit/f00420b))
* **alita wx-react wx-react-native:** 修复 wxs过滤数组引起的bug ([055f20a](https://github.com/areslabs/alita/commit/055f20a))
* **alita wx-react wx-react-native:** 修复tempalte是数组的情况，在数据变少的时候bug ([8326a20](https://github.com/areslabs/alita/commit/8326a20))
* **hello-wx:** 新版本修复 ([fefb3a6](https://github.com/areslabs/alita/commit/fefb3a6))
* **wx-react:** 修复 TouchableWithoutFeedback 包裹自定义组件样式bug ([3f5d8f1](https://github.com/areslabs/alita/commit/3f5d8f1))
* **wx-react:** 修复_r 替换bug， 修复生命周期等bug ([b9b83ed](https://github.com/areslabs/alita/commit/b9b83ed))
* **wx-react:** 修复array元素不复用的bug ([6f17ea4](https://github.com/areslabs/alita/commit/6f17ea4))
* **wx-react:** 修复dataPath 在数据为数组的情况下，结构为a.[b].c的bug，修改为a[b].c ([ee8f61f](https://github.com/areslabs/alita/commit/ee8f61f))
* **wx-react:** 修复组件最外层节点 style未计算的bug ([7327626](https://github.com/areslabs/alita/commit/7327626))
* **wx-react:** 修改DiuuKey的判断方式 ([0bd9e2f](https://github.com/areslabs/alita/commit/0bd9e2f))
* **wx-react:** 修正didMount ,didFocus的执行顺序 ([c13e6e8](https://github.com/areslabs/alita/commit/c13e6e8))
* **wx-react-native:** R 与_r 切换 ([7e34f11](https://github.com/areslabs/alita/commit/7e34f11))
* **wx-react-native:** 修复FlatList onReachEnd多次调用的bug ([4c19656](https://github.com/areslabs/alita/commit/4c19656))
* **wx-react-native:** 当cpt render返回null的时候，小程序的实例也要对应销毁 ([3a9aa62](https://github.com/areslabs/alita/commit/3a9aa62))
* **wx-react-native:** 添加enable-fix，消除控制台enable-fix警告 ([4ba69eb](https://github.com/areslabs/alita/commit/4ba69eb))


### Features

* **alita:** 修改style处理函数的方法名，减少生成小程序体积 ([d8ddca6](https://github.com/areslabs/alita/commit/d8ddca6))
* **alita:** 去除无用属性，减少小程序包体积 ([274957f](https://github.com/areslabs/alita/commit/274957f))
* **alita:** 移除生成 WxCptComp的组件 ([4c6545e](https://github.com/areslabs/alita/commit/4c6545e))
* **alita wx-react:** 1.重写componentWillUnmount生命周期的实现， 2.修改自定义组件返回falsy值的时候在微信小程序端的表现 ([7056cd6](https://github.com/areslabs/alita/commit/7056cd6))
* **alita wx-react:** 减少JSX是文本的时候，生成的小程序的结构 ([5189ba2](https://github.com/areslabs/alita/commit/5189ba2))
* **wx-react:** 使用groupSetData API 优化setData此时 ([18abf71](https://github.com/areslabs/alita/commit/18abf71))
* **wx-react:** 减低setData次数，移除WxCPTComp实现 ([58674a7](https://github.com/areslabs/alita/commit/58674a7))
* **wx-react:** 添加BaseComponent 说明 ([7f2e6d6](https://github.com/areslabs/alita/commit/7f2e6d6))
* **wx-react:** 简化 实例管理模块 ([aa3bdd7](https://github.com/areslabs/alita/commit/aa3bdd7))
* **wx-react:** 首次渲染之后替换R， 防止页面闪动 ([648deae](https://github.com/areslabs/alita/commit/648deae))


### Performance Improvements

* **alita wx-react:** 减少template是数组，JSX片段时候传递的数据 ([4e67be9](https://github.com/areslabs/alita/commit/4e67be9))
* **alita wx-react:** 基本组件view/text的默认样式改为class实现 ([d81b406](https://github.com/areslabs/alita/commit/d81b406))
* **alita wx-react:** 首屏优化，把R，_r区别对待 ([6e2938e](https://github.com/areslabs/alita/commit/6e2938e))
* **wx-react:** 减少view/text等组件setData时候的数据 ([7b83782](https://github.com/areslabs/alita/commit/7b83782))
* **wx-react:** 当没有需要交互的数据的时候，groupSetData提前返回 ([28153cf](https://github.com/areslabs/alita/commit/28153cf))
* **wx-react:** 提前移除_or ([42e8c14](https://github.com/areslabs/alita/commit/42e8c14))
* **wx-react-native:** FlatList, SectionList, Picker R与_r 切换修改 ([5570b90](https://github.com/areslabs/alita/commit/5570b90))



## [1.1.1](https://github.com/areslabs/alita/compare/1.1.0...1.1.1) (2019-07-17)


### Bug Fixes

* **alita:** 修复Text， Image标签事件不触发的bug ([6ff2c3a](https://github.com/areslabs/alita/commit/6ff2c3a))
* **alita:** 修复中文乱码 ([6e4acbe](https://github.com/areslabs/alita/commit/6e4acbe))
* **alita:** 修复每次转化 project.config.json 文件被重置的bug ([ac0cfcb](https://github.com/areslabs/alita/commit/ac0cfcb))
* **wx-react-redux:** 修复组件被销毁之后调用 setState ([22783e1](https://github.com/areslabs/alita/commit/22783e1))


### Features

* **alita:** 新增name, appid的配置 ([fbef61d](https://github.com/areslabs/alita/commit/fbef61d))
* **wx-react-native:** 添加AppState NativeAppEventEmitter的not support 说明 ([f7dbbf7](https://github.com/areslabs/alita/commit/f7dbbf7))
* **wx-react-native:** 添加DeviceEventEmitter not support 说明 ([bcf0869](https://github.com/areslabs/alita/commit/bcf0869))
* **wx-react-redux:** wx-react-redux 基于react-redux重新实现 ([7d55920](https://github.com/areslabs/alita/commit/7d55920))



# [1.1.0](https://github.com/areslabs/alita/compare/v1.0.1...v1.1.0) (2019-07-08)


### Bug Fixes

* **alita:** HelloWorldExpoWP 无法运行bug ([aaa932a](https://github.com/areslabs/alita/commit/aaa932a))
* **alita:** wacth change file bug ([28b9c12](https://github.com/areslabs/alita/commit/28b9c12))
* **alita:** watch file bug fix ([699badd](https://github.com/areslabs/alita/commit/699badd))
* **alita:** 修复 DONE_EVENT 调用多次的bug ([2c8c857](https://github.com/areslabs/alita/commit/2c8c857))
* **alita:** 修复 wxss文件生成路径错误，修复输出目录不存在emptyDir方法报错 ([64390ef](https://github.com/areslabs/alita/commit/64390ef))
* **alita:** 修复 调用forceUpdate的组件被标识为stateless的bug ([31e8187](https://github.com/areslabs/alita/commit/31e8187))
* **alita:** 修改 addFile的时候 template.js 被忽略的bug ([ef2a91a](https://github.com/areslabs/alita/commit/ef2a91a))
* **alita:** 修改直接导出函数式组件转化报错的bug ([9658206](https://github.com/areslabs/alita/commit/9658206)), closes [#6](https://github.com/areslabs/alita/issues/6)
* **alita:** 每次转化增加目录的清理工作 ([23dc33e](https://github.com/areslabs/alita/commit/23dc33e))
* **alita:** 删除图片资源bug ([81650a9](https://github.com/areslabs/alita/commit/81650a9))
* **wx-react:** 修复嵌套unstable_batchedUpdates 多次渲染的bug ([dfbac12](https://github.com/areslabs/alita/commit/dfbac12))
* **wx-react-redux:** 修改mapDispatchToProps 传递对象报错 ([4ab63c1](https://github.com/areslabs/alita/commit/4ab63c1))


### Features

* **alita:** TODO @babel/plugin-transform-runtime的引入 ([d403f4b](https://github.com/areslabs/alita/commit/d403f4b))
* **alita:** 修改转化的babel配置 ([b2eddd7](https://github.com/areslabs/alita/commit/b2eddd7))
* **alita:** 增加babel对普通js文件的转化处理 ([fe92539](https://github.com/areslabs/alita/commit/fe92539))
* **alita:** 引入plugin-transform-runtime 减少helper函数体积 ([3e3f454](https://github.com/areslabs/alita/commit/3e3f454))
* **alita:** 新增 watch (delete file/dir) ([a426407](https://github.com/areslabs/alita/commit/a426407))
* **alita:** 添加 --comp参数， 添加转化完成的log ([59527b1](https://github.com/areslabs/alita/commit/59527b1))
* **alita:** 添加decorators转化支持，添加mobx处理逻辑，添加mobx样例 ([0b56326](https://github.com/areslabs/alita/commit/0b56326))
* **alita:** 添加JSX表达式的值是字符串常量的优化 ([5ef4ac4](https://github.com/areslabs/alita/commit/5ef4ac4))
* **alita:** 转化文件的时候，返回生成文件数组，for watch mode ([5d82044](https://github.com/areslabs/alita/commit/5d82044))
* **alita wx-react wx-router wx-react-redux:** 修改入口文件的转化，更加友好的支持Provider ([710d810](https://github.com/areslabs/alita/commit/710d810))
* **alita wx-react wx-router wx-react-redux:** 移除beta，测试正式npm包 ([2e8d569](https://github.com/areslabs/alita/commit/2e8d569))
* **filewatch:** 新增 watch (change file) ([8071df8](https://github.com/areslabs/alita/commit/8071df8))
* **wx-mobx wx-mobx-react:** 添加mobx相关库：mobx, mobx-react ([5ee22b0](https://github.com/areslabs/alita/commit/5ee22b0))
* **wx-mobx-react:** 添加批量处理逻辑 ([43a9924](https://github.com/areslabs/alita/commit/43a9924))
* **wx-react:** Add forceUpdate方法 ([4ffc6c7](https://github.com/areslabs/alita/commit/4ffc6c7))
* **wx-react:** add unstable_batchedUpdates api ([fd559ed](https://github.com/areslabs/alita/commit/fd559ed))
* **wx-react:** 增加对forceUpdate的批量处理 ([f89ce7a](https://github.com/areslabs/alita/commit/f89ce7a))
* **wx-react-native:** react-native add unstable_batchedUpdates api ([fc02117](https://github.com/areslabs/alita/commit/fc02117))



## [1.0.1](https://github.com/areslabs/alita/compare/v1.0.0...v1.0.1) (2019-05-26)


### Bug Fixes

* **config:** 修正默认配置文件名为:alita.config.js ([a0d77ac](https://github.com/areslabs/alita/commit/a0d77ac))
* **eslint:** add eslint ([367b5c6](https://github.com/areslabs/alita/commit/367b5c6))
* **eslint-plugin-alita:** 修正eslint plugin名为alita ([162aa16](https://github.com/areslabs/alita/commit/162aa16))



# 1.0.0 (2019-05-23)



