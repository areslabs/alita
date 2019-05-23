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


### 函数式组件

一个返回 `JSX` 片段的方法，很难判断出这是一个函数式组件，还是一个普通方法。比如： 

a.js

```javascript
export default A() {
    return <View/>
}
```

b.js

```javascript
import A from './a.js'

class B extends Componnet {
    render() {
        return <View>{A()}</View>
    }
}
```

c.js

```javascript
import A from './a.js'

class B extends Componnet {
    render() {
        return <View><A/></View>
    }
}
```

对于 b.js 这里的A是一个普通方法，a.js 里面的A方法的返回值就是"外部JSX片段" 这是不被转化引擎支持的。 

对于 c.js 来说，A是一个函数式组件，所以不会有问题。 但是A组件这里很难判断出是"外部JSX片段"还是函数式组件。

为了小程序转换引擎能够准确判断出函数组件，我们作了如下限制：

函数式组件必须在定义的时候导出。

```javascript
// 1
export default A = (props) => {}

// 2
export default function B(props) {}

// 3

export C = (props) => {}
C.contextTypes = {...}
```

以上：当转化引擎遇到形如 a.js 的文件的时候，会将其判断为函数组件。