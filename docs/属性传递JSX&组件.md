## 属性传递JSX&组件

在说明这个问题之前，我们先来看一下 React Native 中一个非常重要的组件 FlatList。

```javascript
<FlatList
  data={[{key: 'a'}, {key: 'b'}]}
  renderItem={({item}) => <Text>{item.key}</Text>}
  ListHeaderComponent={<Header/>}
/>
```

- 属性 `renderItem` 是一个方法，返回 `JSX` 片段
- 属性 `ListHeaderComponent`，值可以是方法，也可以直接是 `JSX` 片段

这两种写法小程序转化引擎都能够完美支持。 

但是有一点需要说明，转化引擎在处理这些属性的时候是有别于其他普通属性的，这就要求转化引擎必须在静态分析的时候能够识别出哪些属性是 `JSX片段属性` , 对于 React Native 提供的 FlatList/SectionList 这些 RN 组件，属性值类型是提前知晓的，但是对于自定义的组件，转换引擎无法获悉，因此需要遵守以下约定：所有需要返回 `JSX片段属性` 的属性名**必须**以 `Component` 结尾。

例如：

```javascript
<A
   xxComponent={<Text>xx</Text>}
   yyComponent={() => <Text>yy</Text>}
   headerComponent={<Header/>}
/>
```

另外在A组件内部使用 `xxComponent` 的时候，需要以下约定：

需要写 `this.props.xxComponent` 或者  `props.yyComponent`。

直接写 `headerComponent` 是不行的。

如下所示：

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

**注意：** `children` 和 `xxComponnet` 的处理 是一样的，所以对于 `children` 的使用，也必须写全：`this.props.children` 或者 `props.children`

### 注意点

属性传递 `JSX` 片段/组件时，不支持多层级的传递，如： 

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

我们看下上面的这个例子，Main组件使用了A组件，A组件通过 `oneComponent` 这个属性传递了一个 `JSX` 片段，这个 `JSX` 片段没有直接在A组件使用，我们看到是由B组件的 `twoComponent` 传递给了B组件，真正使用的地方在B组件，这个就是
多层级传递，这种在小程序转化引擎中是不支持的。 


只有一种多层级转递是支持的，如下：

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

我们看到B组件的 `twoComponent` 是直接 `this.props.oneComponent` 并没有对 `this.props.oneComponent` 做任何的操作，这样的多层级传递是可以的。

尽管如此，仍然希望大家尽可能少用多层级传递。

### 最后

1. 属性传递组件，属性传递 `JSX` 片段 必须准守属性名的约定: 以 `Component`结尾
2. 使用的时候路径的约定，写全路径 `this.props.xxComponent` 或 `props.xxComponent`
3. `children` 在使用的时候，也必须写全路径 `this.props.children` / `props.children`
4. 多层级传递组件/ `JSX` 片段的支持很有限，应该避免使用


