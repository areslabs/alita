## 属性传递JSX&组件
在说明这个问题之前， 我们先来看一下React Native中一个无比重要的组件FlatList。 
```javascript
<FlatList
  data={[{key: 'a'}, {key: 'b'}]}
  renderItem={({item}) => <Text>{item.key}</Text>}
  ListHeaderComponent={<Header/>}
/>
```
属性renderItem 是一个方法， 返回JSX片段
属性ListHeaderComponent，值可以是方法，也可以直接是JSX片段
这两种写法在小程序转化引擎都是完美的支持的。 

但是有一点需要说明，转化引擎在处理这些属性的时候是有别于其他普通属性的， 这就要求转化引擎必须在转化的时候也
就是静态分析的时候能识别出哪些属性是`JSX片段属性`, 对于React Native提供的FlatList/SectionList 这些RN组件， 
这些属性已经是提前知晓的， 但是对于自定义的组件呢？ 这里有一个约定 所有以Component结尾的属性名都是`JSX片段属性`
比如： 
```javascript

<A
   xxComponent={<Text>xx</Text>}
   yyComponent={() => <Text>yy</Text>}
   headerComponent={<Header/>}
/>
```
另外在A组件内部使用xxComponent的时候，也需要在AST阶段对齐特殊处理，将其转化为组件的形式。这里同样需要在识别，也有一个约定。
就是在A组件内部使用的时候 需要写全this.props.xxComponent 或者props.yyComponent。 
像下面这种 直接写headerComponent是不行的
```javascript
class A extends React.Component {
    
    render() {
        const {headerComponent} = this.props
        const props = this.props
        return (
            <View>
                 {this.props.xxComponent} // 可以
                 {props.yyComponent} // 可以
                 {headerComponent}   // 错误 不允许这么使用
            </View>
        )
    }
}
```

**注意** children和xxComponnet的处理 是一样的， 所以对于children的使用，也必须写全： this.props.children 或者 props.children

### 注意点
属性传递JSX片段/组件不支持多层级的传递， 比如： 

main.js
```javascript
class Main extends React.Component {
    render() {
        return <A
            oneComponent={<Text>hello</Text>}
        />
    }
}
```

a.js
```javascript
class A extends React.Component {
    
    f = () => {
        return <View>{this.props.oneComponent}</View>
    }
    
    render() {
        return (
            <View>
                <B
                   twoComponent={this.f}
                />
            </View>
        )
    }
}
```

b.js
```javascript
class B extends React.Component {
    
    render() {
        return (
            <View>
                {this.props.twoComponent}
            </View>
        )
    }
}
```

我们看下上面的这个例子， Main组件使用了A组件， A组件通过oneComponent这个属性传递了一个JSX片段，
这个JSX片段没有直接在A组件使用， 我们看到是由B组件的twoComponent传递给了B组件， 真正使用的地方在B组件， 这个就是
多层级传递， 这种在小程序转化引擎里面是不支持的。 


只有一种多层级转递是支持的， 如下：

main.js
```javascript
class Main extends React.Component {
    render() {
        return <A
            oneComponent={<Text>hello</Text>}
        />
    }
}
```

a.js
```javascript
class A extends React.Component {
    render() {
        return (
            <View>
                <B
                   twoComponent={this.props.oneComponent}
                />
            </View>
        )
    }
}
```

b.js
```javascript
class B extends React.Component {
    
    render() {
        return (
            <View>
                {this.props.twoComponent}
            </View>
        )
    }
}
```

我们看到B组件的twoComponent 是直接this.props.oneComponent 并没有对this.props.oneComponent 做任何的操作，
这样的多层级传递是可以的。
但是希望大家少用多层级传递

### 最后
1. 属性传递组件，属性传递JSX片段 必须准守 属性名的约定，以Component结尾
2. 使用的时候路径的约定，写全路径 this.props.xxComponent
2. children 在使用的时候 也必须写全路径 this.props.children / props.children
3. 多层级传递组件/JSX片段的支持很有限，应该避免使用


