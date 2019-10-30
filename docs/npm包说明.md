## npm包说明

现阶段，Alita并不会去处理项目中的：node_modules目录，所以关于npm包，需要特别说明。 

微信小程序自`2.2.1`起支持了npm的功能，但是npm的支持不是很完善，具体请查看[小程序npm文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

简单来说，不是所有的npm包都可以在微信小程序上使用。 假定你的RN项目 `package.json`文件如下

```json
{
    ...
    "dependencies": {
        "xxx": "^1.0.0",
        "yyy": "^1.0.0",
    }
    ...
}

```

其中`xxx`包是可以直接运行在微信小程序平台的，不用处理。 

对于`yyy`包。 可能会有如下的考虑： 

1. 原包太大，而小程序有体积要求
2. 原包不符合小程序的npm包规则，不能直接使用
3. 原包调用了一些全局变量（如 window 对象），构造器（如 Function 构造器，RN固有API等小程序不存在对象，导致不能直接使用

一般这种情况，我们需要对`yyy`包手动处理。 需要在手动创建一个微信小程序平台的包，与之对应。

假定我们在微信小程序端实现了一个`yyy-wx`包 来处理。那么需要在`alita.config.js`配置(alita.config.js 是alita[默认配置](./配置文件.md)文件)如下：

```javascript
module.exports = {
    dependencies: [
        {
            name: 'yyy',
            wxName: 'yyy-wx',
        }
    ]
}
```
这样，所有对`yyy`包的应用，在微信小程序平台都会被替换为`yyy-wx`

```javascript
import yyy from 'yyy'

// 会把转化为

import yyy from 'yyy-wx'
```


具体的使用可以请参考 [HelloWorldRN](https://github.com/areslabs/alita/tree/master/examples/HelloWorldRN) 下`@areslabs/stringutil-rn`包的配置和使用，
`@areslabs/stringutil-rn`是一个封装lodash的工具包，在微信小程序平台，我们创建了一个体积更小的`@areslabs/stringutil-wx`

如果`yyy` 是React 组件包，那么还需要参考 [第三方组件库扩展](./第三方组件库扩展.md)

**需要特别强调的是：npm包的处理，特别依赖与`package.json` 文件的`dependencies` 字段，需要保证`dependencies` 字段的准确性，并把其他无关依赖
放置在`devDependencies`**
