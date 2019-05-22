# 组件的导入，需要在import/require语句就写明， 转化引擎需要静态的获取组件路径 (component-static-path)
由于小程序的组件导入定义在对应的xxx.json 文件， 是个静态文件， 所以转化引擎需要在静态编译阶段确定组件路径。


## Rule Details
错误案例
```js
import A from 'A'
const B = requie('B')
const Ac = A.c
const Bd = B.d
const x = <Ac/>
const y = <Bd/>
```

正确案例
```js
import {Ac} from 'A'
const { Bd }  = require('B')

const x = <Ac/>
const y = <Bd/>
```

对于第一种情况， 转化引擎无法分析出Ac， Bd的组件路径
