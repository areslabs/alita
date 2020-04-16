# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
