# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.6.4](https://github.com/areslabs/alita/compare/v2.6.3...v2.6.4) (2020-05-22)


### Bug Fixes

* **alita-core:** 修复wxml引用wxs变量名t和template模板相关变量冲突导致无法正常渲染问题 ([716c335](https://github.com/areslabs/alita/commit/716c335b8c638661bb5e2e37af667693e2d443a0))





## [2.6.3](https://github.com/areslabs/alita/compare/v2.6.2...v2.6.3) (2020-05-21)

**Note:** Version bump only for package @areslabs/alita-core





## [2.6.2](https://github.com/areslabs/alita/compare/v2.6.1...v2.6.2) (2020-05-21)

**Note:** Version bump only for package @areslabs/alita-core





## [2.6.1](https://github.com/areslabs/alita/compare/v2.6.0...v2.6.1) (2020-05-21)

**Note:** Version bump only for package @areslabs/alita-core





# [2.6.0](https://github.com/areslabs/alita/compare/v2.5.1...v2.6.0) (2020-05-15)


### Bug Fixes

* **alita-core:** 修复 .wx 文件取 文件名的bug ([c22acdb](https://github.com/areslabs/alita/commit/c22acdb50a963bb1584b026e30d66d9c59e0a78f))


### Features

* **wx-react wx-react-native alita-core:** 1.重新实现this.props.xxComponent 2.简化生成的小程序组件 3. 其他 ([834d045](https://github.com/areslabs/alita/commit/834d0454298afa13d11690e21df65df4dbebb17d))





## [2.5.1](https://github.com/areslabs/alita/compare/v2.5.0...v2.5.1) (2020-04-30)


### Bug Fixes

* **alita-core:** 修复序号重复，引起的bug ([8ce041d](https://github.com/areslabs/alita/commit/8ce041dd6dc822e83a8a408da896ad14679b1703))
* **alita-core:** 修复模块合并的情况下，模块记录错误的bug ([3ea7e48](https://github.com/areslabs/alita/commit/3ea7e48984f884e98a876e7da135dc185e6605b4))


### Features

* **alita-core:** webpack新增致命的错误（配置错误）的提示 ([50a2d54](https://github.com/areslabs/alita/commit/50a2d5449fc6ce065a02d148ab78b9a56c5a7549))
* **alita-core:** 支持<>、<React.Fragment>这两类标签的写法 ([74c290c](https://github.com/areslabs/alita/commit/74c290c6114a07b5c69089cf26dc64687d7ac310))
* **alita-core wx-react:** 添加直接渲染Fragment的警告提示 ([e4596c7](https://github.com/areslabs/alita/commit/e4596c724f5167b868b9cdf5416c7dec481504a9))





# [2.5.0](https://github.com/areslabs/alita/compare/v2.4.6...v2.5.0) (2020-04-20)


### Bug Fixes

* **alita-core:** 修复 组件外层view 退化为block，引起的onLayout事件不调用 ([ed8bc73](https://github.com/areslabs/alita/commit/ed8bc73b859d03cff563c1e9840f57165344cb8d))


### Features

* **alita-core wx-react:** 支持 onLayout ([6f9cd2d](https://github.com/areslabs/alita/commit/6f9cd2df8abbca74212236a6ebb891e5c77a37fa))





## [2.4.6](https://github.com/areslabs/alita/compare/v2.4.5...v2.4.6) (2020-04-16)


### Features

* **alita-core:** 增加对weixin目录app.json文件的处理 ([32d9942](https://github.com/areslabs/alita/commit/32d994230287b2b15e3fbb07b4aafce897b8cd2e))





## [2.4.5](https://github.com/areslabs/alita/compare/v2.4.4...v2.4.5) (2020-04-10)


### Bug Fixes

* **alita-core:** 当存在babel-loader版本冲突的时候，修复loader加载错误的bug ([91aa6dd](https://github.com/areslabs/alita/commit/91aa6dd4a9d06a372c2805029469dfe5f59a4f24))





## [2.4.4](https://github.com/areslabs/alita/compare/v2.4.3...v2.4.4) (2020-04-10)


### Bug Fixes

* **alita-core:** 修复 isChildComp 方法只通过基本组件名称来判断是否需要处理成抽象节点导致的bug ([c6748b8](https://github.com/areslabs/alita/commit/c6748b8960354bee3a44d276d30349ac235fc918))


### Features

* **alita-core:** 支持全局变量global，把显示的对全局变量的使用转化为wx ([c3f2589](https://github.com/areslabs/alita/commit/c3f25896c324ef26b7ac14a59a9ae27d104f92ae))





## [2.4.3](https://github.com/areslabs/alita/compare/v2.4.2...v2.4.3) (2020-04-02)

**Note:** Version bump only for package @areslabs/alita-core





## [2.4.2](https://github.com/areslabs/alita/compare/v2.4.1...v2.4.2) (2020-03-19)


### Bug Fixes

* **alita-core:** 修复 tree-shake的模块 在执行handleChange等方法的时候报错的bug ([5de491c](https://github.com/areslabs/alita/commit/5de491c91a0e0675484e565695f4bef984a21658))





## [2.4.1](https://github.com/areslabs/alita/compare/v2.4.0...v2.4.1) (2020-02-23)


### Bug Fixes

* **alita-core:** 修复decodeURIComponent/encodeURIComponent 触发检查错误的bug ([93c5ac6](https://github.com/areslabs/alita/commit/93c5ac6d625c683de00f6d39009c986581ee6899))





# [2.4.0](https://github.com/areslabs/alita/compare/v2.3.6...v2.4.0) (2020-02-22)


### Bug Fixes

* **alita-core:** 修复 新建AST标签，没有loc信息，引起的报错 ([696087a](https://github.com/areslabs/alita/commit/696087a053e5b16aa7547413098f030228037579))
* **alita-core wx-react:** 修复类似 a-b-c 属性指的绑定无效的bug ([443dea5](https://github.com/areslabs/alita/commit/443dea53eb1474fe1208e588ff84acbcfa1c08b0))


### Features

* **alita-core:** 支持形如 <A x /> x这类无指的属性 ([ffbe802](https://github.com/areslabs/alita/commit/ffbe8025414b112b022b3cd4f54e5f35cf207c3b))
* **alita-core babel-plugin-alitamisc:** 添加小程序自定义组件的支持 ([76edb4b](https://github.com/areslabs/alita/commit/76edb4b7f6cbd34069a972eef3acbc4b96632002))
* **alita-core wx-react-native:** 微信基础样式移除在page.wxss定义，防止对直接使用微信组件的影响 ([5ce1f7b](https://github.com/areslabs/alita/commit/5ce1f7ba5b3906015499a6fa1038ce4d40c32231))





## [2.3.6](https://github.com/areslabs/alita/compare/v2.3.5...v2.3.6) (2020-02-06)


### Features

* **alita-core:** 修改对不支持RN组件的处理， 不支持的RN组件会退化为一个提示的view节点 ([677dd63](https://github.com/areslabs/alita/commit/677dd63bba3f99a729818a6adb618d54da3cb9a4))
* **alita-core:** 支持 StatusBar ([bec5d68](https://github.com/areslabs/alita/commit/bec5d68255c50ccbb67cb7db3a71b9d4567bf6d5))
* **wx-react-native:** 添加SafeAreaView支持 ([6824698](https://github.com/areslabs/alita/commit/6824698205f0aeff84063419d258e95fa7ccb826))





## [2.3.5](https://github.com/areslabs/alita/compare/v2.3.4...v2.3.5) (2020-02-02)

**Note:** Version bump only for package @areslabs/alita-core





## [2.3.4](https://github.com/areslabs/alita/compare/v2.3.3...v2.3.4) (2020-02-02)

**Note:** Version bump only for package @areslabs/alita-core





## [2.3.4](https://github.com/areslabs/alita/compare/v2.3.3...v2.3.4) (2020-02-02)

**Note:** Version bump only for package @areslabs/alita-core
