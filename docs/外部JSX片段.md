## 外部JSX片段

非组件文件中定义的 `JSX` 片段， 我们称之为 `外部JSX片段`，小程序转化引擎不支持外部 `JSX` 片段。 

具体如下： 

a.js

```javascript
export const xx = <Text>Hello</Text>
```

b.js

```javascript
import {xx} from './a.js'

class A extends Component {
    render(){
        return <View>{xx}</View>
    }
}
```

b.js 里面的 xx，定义在 a.js 中， 对于 b.js 来说，就是"外部JSX片段"，不支持。 

组件内部的 `JSX` 是支持的，如下：

```javascript
const xx = <Text>Hello</Text>
class A extends Component {
    render(){
        return <View>{xx}</View>
    }
}
```

这样是支持的，因为这个 `JSX` 片段出现在组件文件内，就不是`外部JSX片段`了，所以能够被正确处理。
 
**一定要记住，只有组件文件中定义的JSX片段才会被正确处理**， 其他地方的 `JSX` 片段转化引擎不会处理！