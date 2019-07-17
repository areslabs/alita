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



