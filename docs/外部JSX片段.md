## 外部JSX片段
对于不在组件文件里面出现的JSX片段， 我们称之为`外部JSX片段`， 外部JSX片段是不被小程序转化引擎支持的。 
比如： 

a.js
```javascript
export const xx = <View>Hello</View>
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
对于a.js 里面的xx，就是"外部JSX片段"， 这里是不支持的。 

但是如果是如下这样： 
```javascript
const xx = <View>Hello</View>
class A extends Component {
    render(){
        return <View>{xx}</View>
    }
}
```
这样是支持的， 因为这个JSX片段出现在组件文件内，就不是`外部JSX片段`了， 所以会被正确处理。
 
**一定要记住，只有组件文件里面出现的JSX片段才会被正确处理**， 其他地方的JSX片段转化引擎不会处理！


### 函数式组件
一个返回JSX片段的方法， 很难判断出这是一个函数式组件，还是一个普通方法。 比如： 

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
对于b.js 这里的A是一个普通方法， a.js里面的A方法的返回值就是"外部JSX片段" 这是不被转化引擎支持的。 
对于c.js 来说，A是一个函数式组件， 所有不会有问题。 

所以A组件这里很难判断出"外部JSX片段" 还是函数式组件

为了准确判断出函数组件， 有如下的限制：
函数式组件必须在定义的时候导出
```javascript
// 1
export default A = (props) => {}

// 2
export default function B(props) {}

// 3

export C = (props) => {}
C.contextTypes = {...}
```

以上： 当转化引擎遇到形如a.js的文件的时候，会将其判断为函数组件